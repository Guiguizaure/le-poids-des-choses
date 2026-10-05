import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { createLoginToken, createSession, upsertUser } from "./auth";
import { DAY, LINK_TTL_MS } from "./config";
import type { D1Database } from "./env";
import { inactiveCutoff, runMaintenance } from "./maintenance";
import { hitLimits } from "./rate-limit";
import { createTestDb } from "./testing/d1";

let db: D1Database;
let reset: () => Promise<void>;
let dispose: () => Promise<void>;
const START = Date.UTC(2026, 9, 5, 12);

beforeAll(async () => {
  ({ db, reset, dispose } = await createTestDb());
});
afterAll(() => dispose());
beforeEach(() => reset());

const count = async (table: string) =>
  (
    await db
      .prepare(`SELECT COUNT(*) AS n FROM ${table}`)
      .first<{ n: number }>()
  )?.n;

describe("inactiveCutoff", () => {
  it("24 mois calendaires avant", () => {
    expect(new Date(inactiveCutoff(START)).toISOString()).toBe(
      "2024-10-05T12:00:00.000Z",
    );
  });
});

describe("runMaintenance", () => {
  it("au plus une fois par jour", async () => {
    expect(await runMaintenance(db, START)).toBe(true);
    expect(await runMaintenance(db, START + 1000)).toBe(false);
    expect(await runMaintenance(db, START + DAY - 1)).toBe(false);
    expect(await runMaintenance(db, START + DAY)).toBe(true);
  });

  it("deux requêtes simultanées : une seule purge", async () => {
    const results = await Promise.all([
      runMaintenance(db, START),
      runMaintenance(db, START),
    ]);
    expect(results.filter(Boolean)).toHaveLength(1);
  });

  it("supprime les comptes inactifs depuis 24 mois, avec leurs données", async () => {
    const old = await upsertUser(db, "ancien@exemple.fr", START);
    await createSession(db, old.id, START);
    await db
      .prepare(
        "INSERT INTO journal_entries (user_id, entry_id, payload, payload_hash, received_at) VALUES (?, 'e', '{}', 'h', ?)",
      )
      .bind(old.id, START)
      .run();
    const later = new Date(START);
    later.setUTCMonth(later.getUTCMonth() + 24);
    const active = await upsertUser(
      db,
      "actif@exemple.fr",
      later.getTime() - DAY,
    );

    // Juste avant 24 mois : rien n'est supprimé.
    await runMaintenance(db, later.getTime() - 1);
    expect(await count("users")).toBe(2);

    await runMaintenance(db, later.getTime() + DAY);
    const users = await db
      .prepare("SELECT id FROM users")
      .all<{ id: string }>();
    expect(users.results.map((u) => u.id)).toEqual([active.id]);
    expect(await count("journal_entries")).toBe(0);
    expect(await count("sessions")).toBe(0);
  });

  it("efface les liens expirés, les sessions expirées et les vieux compteurs", async () => {
    await createLoginToken(db, "a@exemple.fr", START);
    const user = await upsertUser(db, "a@exemple.fr", START);
    await createSession(db, user.id, START - 91 * DAY);
    await hitLimits(
      db,
      "link:ip:x",
      [{ name: "15m", windowMs: 15 * 60 * 1000, max: 3 }],
      START - 3 * DAY,
    );
    await hitLimits(
      db,
      "link:ip:y",
      [{ name: "15m", windowMs: 15 * 60 * 1000, max: 3 }],
      START,
    );
    await runMaintenance(db, START + LINK_TTL_MS);
    expect(await count("login_tokens")).toBe(0);
    expect(await count("sessions")).toBe(0);
    expect(await count("rate_limits")).toBe(1);
    expect(await count("users")).toBe(1);
  });
});
