import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  LINK_EMAIL_LIMITS,
  LINK_IP_LIMITS,
  RATE_LIMIT_RETENTION_MS,
  type Limit,
} from "./config";
import type { D1Database } from "./env";
import { hitLimits, windowStart } from "./rate-limit";
import { createTestDb } from "./testing/d1";

let db: D1Database;
let reset: () => Promise<void>;
let dispose: () => Promise<void>;
const MINUTE = 60 * 1000;
// Début d'une fenêtre de 15 min et d'une fenêtre de 24 h.
const NOW = Date.UTC(2026, 9, 5);

beforeAll(async () => {
  ({ db, reset, dispose } = await createTestDb());
});
afterAll(() => dispose());
beforeEach(() => reset());

async function hits(
  key: string,
  limits: readonly Limit[],
  count: number,
  at = NOW,
) {
  const results: boolean[] = [];
  for (let i = 0; i < count; i += 1)
    results.push(await hitLimits(db, key, limits, at));
  return results;
}

describe("limites de débit", () => {
  it("valeurs validées : 3/15 min et 10/24 h par adresse, 10/15 min et 50/24 h par IP", () => {
    expect(LINK_EMAIL_LIMITS.map((l) => l.max)).toEqual([3, 10]);
    expect(LINK_IP_LIMITS.map((l) => l.max)).toEqual([10, 50]);
    expect(RATE_LIMIT_RETENTION_MS).toBeGreaterThanOrEqual(24 * 60 * MINUTE);
  });

  it("3 demandes par adresse en 15 minutes, la 4e est refusée", async () => {
    expect(await hits("link:email:x", LINK_EMAIL_LIMITS, 4)).toEqual([
      true,
      true,
      true,
      false,
    ]);
  });

  it("une nouvelle fenêtre de 15 minutes rouvre, dans la limite des 24 h", async () => {
    let allowed = 0;
    for (let window = 0; window < 6; window += 1)
      for (const ok of await hits(
        "link:email:y",
        LINK_EMAIL_LIMITS,
        3,
        NOW + window * 15 * MINUTE,
      ))
        if (ok) allowed += 1;
    expect(allowed).toBe(10);
  });

  it("les clés sont indépendantes", async () => {
    await hits("link:email:a", LINK_EMAIL_LIMITS, 3);
    expect(await hitLimits(db, "link:email:a", LINK_EMAIL_LIMITS, NOW)).toBe(
      false,
    );
    expect(await hitLimits(db, "link:email:b", LINK_EMAIL_LIMITS, NOW)).toBe(
      true,
    );
  });

  it("10 demandes par IP en 15 minutes", async () => {
    const results = await hits("link:ip:z", LINK_IP_LIMITS, 11);
    expect(results.filter(Boolean)).toHaveLength(10);
    expect(results[10]).toBe(false);
  });

  it("une demande refusée compte aussi", async () => {
    await hits("link:email:c", LINK_EMAIL_LIMITS, 5);
    const row = await db
      .prepare("SELECT count FROM rate_limits WHERE bucket = ?")
      .bind("link:email:c:15m")
      .first<{ count: number }>();
    expect(row?.count).toBe(5);
  });

  it("fenêtres fixes", () => {
    expect(windowStart(NOW + 14 * MINUTE, 15 * MINUTE)).toBe(NOW);
    expect(windowStart(NOW + 15 * MINUTE, 15 * MINUTE)).toBe(NOW + 15 * MINUTE);
  });
});
