// Carnet du compte : ajout append-only (une ligne par version d'entrée), lecture
// incrémentale par curseur, export.
import type { JournalEntry } from "../src/lib/data/types";
import { EXPORT_APP } from "../src/lib/journal/merge";
import { isJournalEntry, sortEntries } from "../src/lib/journal/schema";
import { canonicalJson } from "../src/lib/sync/canonical";
import {
  SYNC_MAX_ENTRIES,
  SYNC_MAX_ENTRY_BYTES,
  SYNC_MAX_ROWS_PER_USER,
  SYNC_PAGE_SIZE,
} from "./config";
import { sha256Hex } from "./crypto";
import type { D1Database } from "./env";
import { HttpError } from "./http";

export type SyncRequest = { since: number; entries: unknown[] };

export type SyncResponse = {
  /** Entrées enregistrées après `since`, dans l'ordre d'arrivée (toutes versions). */
  entries: JournalEntry[];
  /** Curseur à renvoyer à la prochaine synchro. */
  cursor: number;
  /** Vrai s'il reste des entrées à lire (rappeler avec le nouveau curseur). */
  hasMore: boolean;
  /** Nouvelles versions enregistrées par cette requête. */
  accepted: number;
  /** Entrées refusées (invalides ou trop grosses). */
  rejected: number;
  /** Ids qui ont plusieurs versions dans le compte. */
  conflicts: string[];
};

export function parseSyncRequest(body: unknown): SyncRequest {
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new HttpError(400, "bad-request");
  const { since = 0, entries = [] } = body as {
    since?: unknown;
    entries?: unknown;
  };
  if (
    typeof since !== "number" ||
    !Number.isSafeInteger(since) ||
    since < 0 ||
    !Array.isArray(entries)
  )
    throw new HttpError(400, "bad-request");
  if (entries.length > SYNC_MAX_ENTRIES) throw new HttpError(413, "too-large");
  return { since, entries };
}

type Prepared = { entryId: string; payload: string; hash: string };

async function prepare(entries: readonly unknown[]): Promise<{
  valid: Prepared[];
  rejected: number;
}> {
  const valid: Prepared[] = [];
  let rejected = 0;
  for (const entry of entries) {
    if (!isJournalEntry(entry)) {
      rejected += 1;
      continue;
    }
    const payload = canonicalJson(entry);
    if (new TextEncoder().encode(payload).length > SYNC_MAX_ENTRY_BYTES) {
      rejected += 1;
      continue;
    }
    valid.push({ entryId: entry.id, payload, hash: await sha256Hex(payload) });
  }
  return { valid, rejected };
}

/** Enregistre les entrées reçues (jamais d'écrasement) et renvoie celles d'après `since`. */
export async function syncJournal(
  db: D1Database,
  userId: string,
  request: SyncRequest,
  now: number,
): Promise<SyncResponse> {
  const { valid, rejected } = await prepare(request.entries);
  let accepted = 0;
  if (valid.length > 0) {
    const count = await db
      .prepare("SELECT COUNT(*) AS n FROM journal_entries WHERE user_id = ?")
      .bind(userId)
      .first<{ n: number }>();
    if ((count?.n ?? 0) + valid.length > SYNC_MAX_ROWS_PER_USER)
      throw new HttpError(413, "journal-full");
    const results = await db.batch(
      valid.map((entry) =>
        db
          .prepare(
            `INSERT OR IGNORE INTO journal_entries
             (user_id, entry_id, payload, payload_hash, received_at) VALUES (?, ?, ?, ?, ?)`,
          )
          .bind(userId, entry.entryId, entry.payload, entry.hash, now),
      ),
    );
    accepted = results.reduce(
      (sum, result) => sum + (result.meta.changes ?? 0),
      0,
    );
  }

  const rows = await db
    .prepare(
      `SELECT seq, payload FROM journal_entries
       WHERE user_id = ? AND seq > ? ORDER BY seq LIMIT ?`,
    )
    .bind(userId, request.since, SYNC_PAGE_SIZE + 1)
    .all<{ seq: number; payload: string }>();
  const page = rows.results.slice(0, SYNC_PAGE_SIZE);
  const conflicts = await db
    .prepare(
      `SELECT entry_id AS id FROM journal_entries WHERE user_id = ?
       GROUP BY entry_id HAVING COUNT(*) > 1 ORDER BY entry_id`,
    )
    .bind(userId)
    .all<{ id: string }>();

  return {
    entries: page.map((row) => JSON.parse(row.payload) as JournalEntry),
    cursor: page.length ? page[page.length - 1].seq : request.since,
    hasMore: rows.results.length > SYNC_PAGE_SIZE,
    accepted,
    rejected,
    conflicts: conflicts.results.map((row) => row.id),
  };
}

/**
 * Export des données du compte, au format de l'export local (lisible par « Importer ») :
 * la première version de chaque entrée dans `entries`, les autres dans `conflicts`, et
 * l'adresse du compte avec sa date de création dans `account`.
 */
export async function exportAccount(
  db: D1Database,
  user: { userId: string; email: string },
  now: number,
): Promise<string> {
  const account = await db
    .prepare("SELECT created_at AS createdAt FROM users WHERE id = ?")
    .bind(user.userId)
    .first<{ createdAt: number }>();
  const rows = await db
    .prepare(
      "SELECT entry_id AS id, payload FROM journal_entries WHERE user_id = ? ORDER BY seq",
    )
    .bind(user.userId)
    .all<{ id: string; payload: string }>();
  const seen = new Set<string>();
  const entries: JournalEntry[] = [];
  const conflicts: JournalEntry[] = [];
  for (const row of rows.results) {
    const entry = JSON.parse(row.payload) as JournalEntry;
    if (seen.has(row.id)) conflicts.push(entry);
    else {
      seen.add(row.id);
      entries.push(entry);
    }
  }
  return JSON.stringify(
    {
      app: EXPORT_APP,
      version: 1,
      exportedAt: new Date(now).toISOString(),
      account: {
        email: user.email,
        createdAt: account ? new Date(account.createdAt).toISOString() : null,
      },
      entries: sortEntries(entries),
      ...(conflicts.length ? { conflicts } : {}),
    },
    null,
    2,
  );
}
