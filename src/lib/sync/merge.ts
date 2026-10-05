// Fusion du carnet local avec les entrées du compte : append-only par id. Une entrée locale
// n'est jamais écrasée ni retirée ; une autre version d'une entrée déjà connue (même id,
// contenu différent) est gardée à part, comme conflit.
import type { JournalEntry } from "@/lib/data/types";
import { sortEntries } from "@/lib/journal/schema";
import { canonicalJson } from "./canonical";

export type SyncConflict = {
  id: string;
  /** Version gardée dans le carnet (affichée dans le jardin). */
  kept: JournalEntry;
  /** Autre version reçue, conservée à part (export), jamais affichée. */
  other: JournalEntry;
};

export type MergeResult = {
  entries: JournalEntry[];
  /** Entrées ajoutées au carnet. */
  added: JournalEntry[];
  /** Nouveaux conflits trouvés pendant cette fusion. */
  conflicts: SyncConflict[];
};

/**
 * Fusionne des entrées reçues dans le carnet local. Les entrées locales restent telles
 * quelles ; une entrée inconnue est ajoutée ; deux versions d'un même id sont gardées (la
 * première connue dans le carnet, l'autre comme conflit). Les doublons exacts sont ignorés.
 */
export function mergeRemote(
  local: readonly JournalEntry[],
  remote: readonly JournalEntry[],
): MergeResult {
  const byId = new Map(local.map((entry) => [entry.id, entry]));
  const added: JournalEntry[] = [];
  const conflicts: SyncConflict[] = [];
  const seenConflicts = new Set<string>();
  for (const entry of remote) {
    const existing = byId.get(entry.id);
    if (!existing) {
      byId.set(entry.id, entry);
      added.push(entry);
      continue;
    }
    const other = canonicalJson(entry);
    if (canonicalJson(existing) === other) continue;
    const key = `${entry.id}\n${other}`;
    if (seenConflicts.has(key)) continue;
    seenConflicts.add(key);
    conflicts.push({ id: entry.id, kept: existing, other: entry });
  }
  return {
    entries: added.length ? sortEntries([...local, ...added]) : [...local],
    added,
    conflicts,
  };
}

/** Ajoute des conflits à une liste existante, sans doublon (même id, même autre version). */
export function addConflicts(
  existing: readonly SyncConflict[],
  incoming: readonly SyncConflict[],
): SyncConflict[] {
  const keys = new Set(
    existing.map(
      (conflict) => `${conflict.id}\n${canonicalJson(conflict.other)}`,
    ),
  );
  const result = [...existing];
  for (const conflict of incoming) {
    const key = `${conflict.id}\n${canonicalJson(conflict.other)}`;
    if (keys.has(key)) continue;
    keys.add(key);
    result.push(conflict);
  }
  return result;
}
