import { describe, expect, it } from "vitest";
import type { ComparisonEntry, JournalEntry } from "@/lib/data/types";
import { createJournalStore, type StorageLike } from "@/lib/journal/store";
import type { ApiResult, SyncPayload, SyncReply } from "./api";
import { canonicalJson } from "./canonical";
import { createSyncEngine, SYNC_BATCH } from "./engine";
import { parseSyncState, SYNC_STORAGE_KEY } from "./state";

class MemoryStorage implements StorageLike {
  data = new Map<string, string>();
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
  removeItem(key: string) {
    this.data.delete(key);
  }
}

function entry(
  id: string,
  over: Partial<ComparisonEntry> = {},
): ComparisonEntry {
  return {
    id,
    date: `2026-10-01T10:00:${String(id.length).padStart(2, "0")}.000Z`,
    gestureA: "tgv",
    gestureB: "avion",
    quantity: 50,
    chosen: "a",
    avoidedKg: 12.5,
    ...over,
  };
}

/** Faux compte : même règle que le serveur (une ligne par version, curseur). */
class FakeServer {
  rows: { seq: number; entry: JournalEntry }[] = [];
  offline = false;
  expired = false;
  calls: SyncPayload[] = [];
  pageSize = 1000;

  sync = async (payload: SyncPayload): Promise<ApiResult<SyncReply>> => {
    this.calls.push(payload);
    if (this.offline) return { ok: false, error: "offline" };
    if (this.expired) return { ok: false, error: "unauthorized" };
    for (const item of payload.entries) {
      const exists = this.rows.some(
        (row) =>
          row.entry.id === item.id &&
          canonicalJson(row.entry) === canonicalJson(item),
      );
      if (!exists) this.rows.push({ seq: this.rows.length + 1, entry: item });
    }
    const after = this.rows.filter((row) => row.seq > payload.since);
    const page = after.slice(0, this.pageSize);
    return {
      ok: true,
      data: {
        entries: page.map((row) => row.entry),
        cursor: page.at(-1)?.seq ?? payload.since,
        hasMore: after.length > this.pageSize,
        accepted: 0,
        rejected: 0,
        conflicts: [],
      },
    };
  };
}

function device(server: FakeServer, entries: JournalEntry[] = []) {
  const storage = new MemoryStorage();
  const journal = createJournalStore(new MemoryStorage());
  for (const item of entries) journal.add(item);
  const engine = createSyncEngine({
    journal,
    storage,
    sync: server.sync,
    now: () => new Date("2026-10-05T12:00:00.000Z"),
  });
  return { storage, journal, engine };
}

const ids = (entries: readonly JournalEntry[]) =>
  entries.map((e) => e.id).sort();

describe("moteur de synchro", () => {
  it("personne de connecté : aucun appel", async () => {
    const server = new FakeServer();
    const { engine } = device(server, [entry("a")]);
    engine.enqueue("a");
    expect(await engine.sync()).toBe("signed-out");
    expect(server.calls).toEqual([]);
  });

  it("connexion : tout le carnet part, le compte revient, sur deux appareils", async () => {
    const server = new FakeServer();
    const phone = device(server, [entry("a"), entry("bb")]);
    const laptop = device(server, [entry("ccc")]);
    phone.engine.signedIn("camille@exemple.fr");
    expect(await phone.engine.sync()).toBe("ok");
    laptop.engine.signedIn("camille@exemple.fr");
    expect(await laptop.engine.sync()).toBe("ok");
    expect(await phone.engine.sync()).toBe("ok");
    expect(ids(phone.journal.getEntries())).toEqual(["a", "bb", "ccc"]);
    expect(ids(laptop.journal.getEntries())).toEqual(["a", "bb", "ccc"]);
    expect(phone.engine.getSnapshot()).toMatchObject({
      sendAll: false,
      pending: [],
      lastSyncAt: "2026-10-05T12:00:00.000Z",
    });
  });

  it("après la première synchro, seule la file part", async () => {
    const server = new FakeServer();
    const phone = device(server, [entry("a")]);
    phone.engine.signedIn("camille@exemple.fr");
    await phone.engine.sync();
    phone.journal.add(entry("bb"));
    phone.engine.enqueue("bb");
    await phone.engine.sync();
    expect(server.calls.at(-1)?.entries.map((e) => e.id)).toEqual(["bb"]);
    expect(server.calls.at(-1)?.since).toBe(1);
  });

  it("hors ligne : la file reste (et survit au rechargement), puis repart", async () => {
    const server = new FakeServer();
    const phone = device(server);
    phone.engine.signedIn("camille@exemple.fr");
    await phone.engine.sync();
    server.offline = true;
    phone.journal.add(entry("a"));
    phone.engine.enqueue("a");
    expect(await phone.engine.sync()).toBe("offline");
    expect(phone.engine.getSnapshot().pending).toEqual(["a"]);
    expect(
      parseSyncState(phone.storage.getItem(SYNC_STORAGE_KEY)).pending,
    ).toEqual(["a"]);

    server.offline = false;
    expect(await phone.engine.sync()).toBe("ok");
    expect(phone.engine.getSnapshot().pending).toEqual([]);
    expect(server.rows.map((row) => row.entry.id)).toEqual(["a"]);
  });

  it("première synchro hors ligne : tout le carnet repartira", async () => {
    const server = new FakeServer();
    server.offline = true;
    const phone = device(server, [entry("a")]);
    phone.engine.signedIn("camille@exemple.fr");
    expect(await phone.engine.sync()).toBe("offline");
    expect(phone.engine.getSnapshot().sendAll).toBe(true);
    server.offline = false;
    await phone.engine.sync();
    expect(server.rows).toHaveLength(1);
  });

  it("conflit : la version locale reste, l'autre est gardée à part", async () => {
    const server = new FakeServer();
    server.rows.push({ seq: 1, entry: entry("a", { avoidedKg: 99 }) });
    const phone = device(server, [entry("a")]);
    phone.engine.signedIn("camille@exemple.fr");
    await phone.engine.sync();
    expect(phone.journal.getEntries()).toEqual([entry("a")]);
    const { conflicts } = phone.engine.getSnapshot();
    expect(conflicts).toHaveLength(1);
    expect((conflicts[0].other as ComparisonEntry).avoidedKg).toBe(99);
    // Le serveur garde aussi les deux versions.
    expect(server.rows).toHaveLength(2);
  });

  it("gros carnet : envoyé par lots, réponse paginée", async () => {
    const server = new FakeServer();
    server.pageSize = 150;
    const many = Array.from({ length: SYNC_BATCH * 2 + 10 }, (_, i) =>
      entry(`e${String(i).padStart(4, "0")}`),
    );
    const phone = device(server, many);
    phone.engine.signedIn("camille@exemple.fr");
    expect(await phone.engine.sync()).toBe("ok");
    expect(server.rows).toHaveLength(many.length);
    expect(
      Math.max(...server.calls.map((call) => call.entries.length)),
    ).toBeLessThanOrEqual(SYNC_BATCH);

    const laptop = device(server);
    laptop.engine.signedIn("camille@exemple.fr");
    await laptop.engine.sync();
    expect(laptop.journal.getEntries()).toHaveLength(many.length);
  });

  it("session expirée : le compte est oublié sur l'appareil, pas le carnet", async () => {
    const server = new FakeServer();
    const phone = device(server, [entry("a")]);
    phone.engine.signedIn("camille@exemple.fr");
    server.expired = true;
    expect(await phone.engine.sync()).toBe("unauthorized");
    expect(phone.engine.getSnapshot().email).toBeNull();
    expect(phone.journal.getEntries()).toHaveLength(1);
  });

  it("déconnexion : état oublié, carnet gardé, plus d'appel", async () => {
    const server = new FakeServer();
    const phone = device(server, [entry("a")]);
    phone.engine.signedIn("camille@exemple.fr");
    await phone.engine.sync();
    phone.engine.signedOut();
    expect(phone.storage.getItem(SYNC_STORAGE_KEY)).toBeNull();
    expect(phone.journal.getEntries()).toHaveLength(1);
    phone.engine.enqueue("a");
    expect(await phone.engine.sync()).toBe("signed-out");
  });

  it("deux synchros lancées ensemble : une seule requête à la fois", async () => {
    const server = new FakeServer();
    const phone = device(server, [entry("a")]);
    phone.engine.signedIn("camille@exemple.fr");
    const [first, second] = [phone.engine.sync(), phone.engine.sync()];
    expect(first).toBe(second);
    await first;
    expect(server.calls).toHaveLength(1);
  });
});

describe("parseSyncState", () => {
  it("contenu illisible ou d'une autre version : pas connecté", () => {
    for (const text of [null, "", "{", "[]", '{"version":2,"email":"a@b.fr"}'])
      expect(parseSyncState(text).email).toBeNull();
  });

  it("champs invalides remplacés", () => {
    const state = parseSyncState(
      JSON.stringify({
        version: 1,
        email: "a@b.fr",
        cursor: -3,
        pending: ["x", 4],
        conflicts: [{ id: "x" }],
      }),
    );
    expect(state).toMatchObject({
      email: "a@b.fr",
      cursor: 0,
      pending: ["x"],
      conflicts: [],
    });
  });
});
