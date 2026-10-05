import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import {
  consumeLoginToken,
  createLoginToken,
  createSession,
  deleteAccount,
  findSession,
  isTokenShaped,
  upsertUser,
} from "./auth";
import { DAY, LINK_TTL_MS, SESSION_TTL_MS } from "./config";
import { randomToken, sha256Hex } from "./crypto";
import type { D1Database } from "./env";
import { createTestDb } from "./testing/d1";

let db: D1Database;
let reset: () => Promise<void>;
let dispose: () => Promise<void>;
const NOW = Date.UTC(2026, 9, 5, 12);

beforeAll(async () => {
  ({ db, reset, dispose } = await createTestDb());
});
afterAll(() => dispose());
beforeEach(() => reset());

describe("jetons", () => {
  it("randomToken : 43 caractères base64url, tous différents", () => {
    const tokens = new Set(Array.from({ length: 50 }, () => randomToken()));
    expect(tokens.size).toBe(50);
    for (const token of tokens) expect(isTokenShaped(token)).toBe(true);
  });

  it("seule l'empreinte du jeton est stockée", async () => {
    const token = await createLoginToken(db, "camille@exemple.fr", NOW);
    const rows = await db.prepare("SELECT * FROM login_tokens").all();
    expect(JSON.stringify(rows.results)).not.toContain(token);
    expect(rows.results[0].token_hash).toBe(await sha256Hex(token));
  });
});

describe("lien magique", () => {
  it("valable une fois", async () => {
    const token = await createLoginToken(db, "camille@exemple.fr", NOW);
    expect(await consumeLoginToken(db, token, NOW + 1000)).toBe(
      "camille@exemple.fr",
    );
    expect(await consumeLoginToken(db, token, NOW + 2000)).toBeNull();
  });

  it("valable 15 minutes, pas une de plus", async () => {
    const early = await createLoginToken(db, "a@exemple.fr", NOW);
    const late = await createLoginToken(db, "b@exemple.fr", NOW);
    expect(await consumeLoginToken(db, early, NOW + LINK_TTL_MS - 1)).toBe(
      "a@exemple.fr",
    );
    expect(await consumeLoginToken(db, late, NOW + LINK_TTL_MS)).toBeNull();
  });

  it("utiliser un lien rend les autres liens de la même adresse inutilisables", async () => {
    const first = await createLoginToken(db, "camille@exemple.fr", NOW);
    const second = await createLoginToken(db, "camille@exemple.fr", NOW + 10);
    const other = await createLoginToken(db, "dominique@exemple.fr", NOW);
    expect(await consumeLoginToken(db, second, NOW + 100)).toBe(
      "camille@exemple.fr",
    );
    expect(await consumeLoginToken(db, first, NOW + 200)).toBeNull();
    expect(await consumeLoginToken(db, other, NOW + 300)).toBe(
      "dominique@exemple.fr",
    );
  });

  it("deux clics simultanés : un seul aboutit", async () => {
    const token = await createLoginToken(db, "camille@exemple.fr", NOW);
    const results = await Promise.all([
      consumeLoginToken(db, token, NOW + 1),
      consumeLoginToken(db, token, NOW + 1),
    ]);
    expect(results.filter(Boolean)).toHaveLength(1);
  });

  it("jeton inconnu ou mal formé : refusé", async () => {
    expect(await consumeLoginToken(db, randomToken(), NOW)).toBeNull();
    expect(await consumeLoginToken(db, "court", NOW)).toBeNull();
    expect(await consumeLoginToken(db, 42, NOW)).toBeNull();
  });
});

describe("comptes et sessions", () => {
  it("un compte par adresse, réutilisé ensuite", async () => {
    const first = await upsertUser(db, "camille@exemple.fr", NOW);
    const again = await upsertUser(db, "camille@exemple.fr", NOW + DAY);
    expect(again.id).toBe(first.id);
  });

  it("session valable 90 jours", async () => {
    const user = await upsertUser(db, "camille@exemple.fr", NOW);
    const token = await createSession(db, user.id, NOW);
    expect(
      await findSession(db, token, NOW + SESSION_TTL_MS - 1),
    ).toMatchObject({
      userId: user.id,
      email: "camille@exemple.fr",
    });
    expect(await findSession(db, token, NOW + SESSION_TTL_MS)).toBeNull();
    expect(await findSession(db, randomToken(), NOW)).toBeNull();
    expect(await findSession(db, null, NOW)).toBeNull();
  });

  it("l'activité est notée au plus une fois par jour", async () => {
    const user = await upsertUser(db, "camille@exemple.fr", NOW);
    const token = await createSession(db, user.id, NOW);
    const lastSeen = async () =>
      (
        await db
          .prepare("SELECT last_seen_at AS t FROM users WHERE id = ?")
          .bind(user.id)
          .first<{ t: number }>()
      )?.t;
    await findSession(db, token, NOW + 1000);
    expect(await lastSeen()).toBe(NOW);
    await findSession(db, token, NOW + DAY);
    expect(await lastSeen()).toBe(NOW + DAY);
  });

  it("supprimer le compte efface tout ce qui le concerne", async () => {
    const user = await upsertUser(db, "camille@exemple.fr", NOW);
    const token = await createSession(db, user.id, NOW);
    await createLoginToken(db, "camille@exemple.fr", NOW);
    await db
      .prepare(
        "INSERT INTO journal_entries (user_id, entry_id, payload, payload_hash, received_at) VALUES (?, 'e', '{}', 'h', ?)",
      )
      .bind(user.id, NOW)
      .run();
    const keep = await upsertUser(db, "dominique@exemple.fr", NOW);
    await createSession(db, keep.id, NOW);

    await deleteAccount(db, { userId: user.id, email: user.email });
    expect(await findSession(db, token, NOW)).toBeNull();
    for (const table of ["users", "sessions"]) {
      const row = await db
        .prepare(`SELECT COUNT(*) AS n FROM ${table}`)
        .first<{ n: number }>();
      expect(row?.n).toBe(1);
    }
    for (const table of ["journal_entries", "login_tokens"]) {
      const row = await db
        .prepare(`SELECT COUNT(*) AS n FROM ${table}`)
        .first<{ n: number }>();
      expect(row?.n).toBe(0);
    }
  });
});
