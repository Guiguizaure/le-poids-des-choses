import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import type { ComparisonEntry, JournalEntry } from "../src/lib/data/types";
import { importJournal } from "../src/lib/journal/merge";
import { upsertUser } from "./auth";
import { SYNC_MAX_ENTRIES, SYNC_PAGE_SIZE } from "./config";
import type { D1Database } from "./env";
import { HttpError } from "./http";
import { exportAccount, parseSyncRequest, syncJournal } from "./journal";
import { createTestDb } from "./testing/d1";

let db: D1Database;
let reset: () => Promise<void>;
let dispose: () => Promise<void>;
const NOW = Date.UTC(2026, 9, 5, 12);
let userId: string;

beforeAll(async () => {
  ({ db, reset, dispose } = await createTestDb());
});
afterAll(() => dispose());
beforeEach(async () => {
  await reset();
  userId = (await upsertUser(db, "camille@exemple.fr", NOW)).id;
});

function entry(
  id: string,
  over: Partial<ComparisonEntry> = {},
): ComparisonEntry {
  return {
    id,
    date: "2026-10-01T10:00:00.000Z",
    gestureA: "tgv",
    gestureB: "avion",
    quantity: 50,
    chosen: "a",
    avoidedKg: 12.5,
    ...over,
  };
}

const sync = (since: number, entries: unknown[], user = userId) =>
  syncJournal(db, user, { since, entries }, NOW);

describe("syncJournal", () => {
  it("compte vide, rien envoyé : rien reçu", async () => {
    expect(await sync(0, [])).toEqual({
      entries: [],
      cursor: 0,
      hasMore: false,
      accepted: 0,
      rejected: 0,
      conflicts: [],
    });
  });

  it("enregistre puis renvoie les entrées, avec un curseur", async () => {
    const first = await sync(0, [entry("a"), entry("b")]);
    expect(first.accepted).toBe(2);
    expect(first.entries.map((e) => e.id)).toEqual(["a", "b"]);
    const second = await sync(first.cursor, [entry("c")]);
    expect(second.entries.map((e) => e.id)).toEqual(["c"]);
    expect(second.cursor).toBeGreaterThan(first.cursor);
    expect((await sync(second.cursor, [])).entries).toEqual([]);
  });

  it("renvoyer la même entrée ne crée pas de doublon", async () => {
    await sync(0, [entry("a")]);
    const again = await sync(0, [entry("a"), { ...entry("a") }]);
    expect(again.accepted).toBe(0);
    expect(again.entries).toHaveLength(1);
    expect(again.conflicts).toEqual([]);
  });

  it("l'ordre des clés ne compte pas", async () => {
    await sync(0, [entry("a")]);
    const reversed = Object.fromEntries(Object.entries(entry("a")).reverse());
    expect((await sync(0, [reversed])).accepted).toBe(0);
  });

  it("conflit : les deux versions sont gardées et signalées, rien n'est écrasé", async () => {
    await sync(0, [entry("a")]);
    const result = await sync(0, [entry("a", { avoidedKg: 99 })]);
    expect(result.accepted).toBe(1);
    expect(result.conflicts).toEqual(["a"]);
    expect(result.entries.map((e) => (e as ComparisonEntry).avoidedKg)).toEqual(
      [12.5, 99],
    );
  });

  it("entrées invalides refusées, les autres enregistrées (champs inconnus gardés)", async () => {
    const result = await sync(0, [
      entry("a", { extra: "gardé" } as Partial<ComparisonEntry>),
      { id: "b" },
      "texte",
      entry("c", { avoidedKg: -1 }),
      entry("d", { gestureA: "x".repeat(3000) }),
    ]);
    expect(result.accepted).toBe(1);
    expect(result.rejected).toBe(4);
    expect(result.entries[0]).toMatchObject({ id: "a", extra: "gardé" });
  });

  it("habitudes : acceptées telles quelles (aucune migration), refusées si elles portent des kg", async () => {
    const habit = {
      kind: "habit",
      id: "h1",
      date: new Date(NOW).toISOString(),
      gesture: "velo",
    };
    const result = await sync(0, [
      habit,
      { ...habit, id: "h2", avoidedKg: 3 },
      { ...habit, id: "h3", kind: "autre" },
    ]);
    expect(result.accepted).toBe(1);
    expect(result.rejected).toBe(2);
    expect(result.entries).toEqual([habit]);
  });

  it("arrosage ciblé : la plante arrosée (`plant`) fait l'aller-retour, null compris ; une valeur invalide est refusée", async () => {
    const base = {
      kind: "habit",
      date: new Date(NOW).toISOString(),
      gesture: "velo",
    };
    const targeted = { ...base, id: "p1", plant: "e-42" };
    const none = { ...base, id: "p2", plant: null };
    const result = await sync(0, [
      targeted,
      none,
      { ...base, id: "p3", plant: 7 },
    ]);
    expect(result.accepted).toBe(2);
    expect(result.rejected).toBe(1);
    expect(result.entries).toEqual(expect.arrayContaining([targeted, none]));
  });

  it("chaque compte ne voit que ses entrées", async () => {
    const other = (await upsertUser(db, "dominique@exemple.fr", NOW)).id;
    await sync(0, [entry("a")]);
    await sync(0, [entry("b")], other);
    expect((await sync(0, [])).entries.map((e) => e.id)).toEqual(["a"]);
    expect((await sync(0, [], other)).entries.map((e) => e.id)).toEqual(["b"]);
  });

  it("réponse paginée au-delà de SYNC_PAGE_SIZE", async () => {
    const all = Array.from({ length: SYNC_PAGE_SIZE + 5 }, (_, i) =>
      entry(`e${String(i).padStart(5, "0")}`),
    );
    for (let i = 0; i < all.length; i += SYNC_MAX_ENTRIES)
      await sync(0, all.slice(i, i + SYNC_MAX_ENTRIES));
    const first = await sync(0, []);
    expect(first.entries).toHaveLength(SYNC_PAGE_SIZE);
    expect(first.hasMore).toBe(true);
    const rest = await sync(first.cursor, []);
    expect(rest.entries).toHaveLength(5);
    expect(rest.hasMore).toBe(false);
  });
});

describe("parseSyncRequest", () => {
  it("refuse un corps mal formé ou trop grand", () => {
    expect(parseSyncRequest({})).toEqual({ since: 0, entries: [] });
    for (const body of [
      null,
      [],
      { since: -1 },
      { since: 1.5 },
      { entries: {} },
    ])
      expect(() => parseSyncRequest(body)).toThrow(HttpError);
    expect(() =>
      parseSyncRequest({ entries: Array(SYNC_MAX_ENTRIES + 1).fill({}) }),
    ).toThrow(HttpError);
  });
});

describe("exportAccount", () => {
  it("même format que l'export local, relisible par l'import", async () => {
    await sync(0, [
      entry("b", { date: "2026-10-03T10:00:00.000Z" }),
      entry("a"),
    ]);
    const text = await exportAccount(
      db,
      { userId, email: "camille@exemple.fr" },
      NOW,
    );
    const data = JSON.parse(text);
    expect(data).toMatchObject({
      app: "le-poids-des-choses",
      version: 1,
      exportedAt: new Date(NOW).toISOString(),
      account: {
        email: "camille@exemple.fr",
        createdAt: new Date(NOW).toISOString(),
      },
    });
    expect(data.entries.map((e: JournalEntry) => e.id)).toEqual(["a", "b"]);
    expect(data.conflicts).toBeUndefined();
    expect(importJournal([], text).added).toBe(2);
  });

  it("les autres versions d'une entrée sont exportées dans conflicts", async () => {
    await sync(0, [entry("a")]);
    await sync(0, [entry("a", { avoidedKg: 99 })]);
    const data = JSON.parse(
      await exportAccount(db, { userId, email: "camille@exemple.fr" }, NOW),
    );
    expect(data.entries).toEqual([entry("a")]);
    expect(data.conflicts).toEqual([entry("a", { avoidedKg: 99 })]);
  });
});
