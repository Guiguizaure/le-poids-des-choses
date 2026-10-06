import { describe, expect, it, vi } from "vitest";
import type { ComparisonEntry } from "@/lib/data/types";
import { createEntry } from "./entry";
import {
  appendEntry,
  exportJournal,
  importJournal,
  mergeEntries,
} from "./merge";
import {
  isJournalEntry,
  parseJournal,
  parseJournalText,
  STORAGE_KEY,
} from "./schema";
import { createJournalStore, isStorageUsable, type StorageLike } from "./store";

function entry(
  id: string,
  day: number,
  avoidedKg = 1,
  extra: Partial<ComparisonEntry> = {},
): ComparisonEntry {
  return {
    id,
    date: new Date(Date.UTC(2026, 9, day, 12)).toISOString(),
    gestureA: "avion",
    gestureB: "tgv",
    quantity: 10,
    chosen: "b",
    avoidedKg,
    ...extra,
  };
}

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

class BrokenStorage implements StorageLike {
  getItem(): string | null {
    throw new Error("SecurityError");
  }
  setItem(): void {
    throw new Error("QuotaExceededError");
  }
  removeItem(): void {
    throw new Error("SecurityError");
  }
}

describe("isJournalEntry", () => {
  it("accepte une entrée valide, avec ou sans modes", () => {
    expect(isJournalEntry(entry("a", 1))).toBe(true);
    expect(
      isJournalEntry(
        entry("a", 1, 0, {
          gestureA: "jean",
          gestureB: "jean",
          modeA: "neuf",
          modeB: "occasion",
        }),
      ),
    ).toBe(true);
  });
  it.each([
    ["sans id", { ...entry("a", 1), id: "" }],
    ["date illisible", { ...entry("a", 1), date: "hier" }],
    ["quantité négative", { ...entry("a", 1), quantity: -1 }],
    ["kg non numériques", { ...entry("a", 1), avoidedKg: "3" }],
    ["choix inconnu", { ...entry("a", 1), chosen: "c" }],
    ["mode inconnu", { ...entry("a", 1), modeA: "vole" }],
    ["null", null],
    ["tableau", []],
  ])("refuse : %s", (_, value) => {
    expect(isJournalEntry(value)).toBe(false);
  });
});

describe("parseJournal", () => {
  it("ignore les entrées invalides sans planter, et les garde de côté", () => {
    const parsed = parseJournal({
      version: 1,
      entries: [entry("a", 1), { id: 3 }, "x", entry("b", 2)],
    });
    expect(parsed.entries.map((e) => e.id)).toEqual(["a", "b"]);
    expect(parsed.invalid).toHaveLength(2);
  });
  it("texte illisible ou vide : carnet vide", () => {
    expect(parseJournalText("{oups").entries).toEqual([]);
    expect(parseJournalText(null).entries).toEqual([]);
    expect(parseJournal(42).entries).toEqual([]);
  });
  it("trie par date puis id, et dédoublonne", () => {
    const parsed = parseJournal([entry("b", 2), entry("a", 1), entry("a", 1)]);
    expect(parsed.entries.map((e) => e.id)).toEqual(["a", "b"]);
  });
});

describe("ajout, export, import", () => {
  it("le carnet ne fait que s'allonger ; un id existant est ignoré", () => {
    const one = appendEntry([], entry("a", 1));
    expect(appendEntry(one, entry("a", 1, 99))).toEqual(one);
    expect(appendEntry(one, entry("b", 2))).toHaveLength(2);
  });
  it("fusion par id sans doublons, l'existant gagne", () => {
    const { entries, added } = mergeEntries(
      [entry("a", 1, 1)],
      [entry("a", 1, 50), entry("c", 3)],
    );
    expect(added).toBe(1);
    expect(
      entries.map((e) => [e.id, (e as ComparisonEntry).avoidedKg]),
    ).toEqual([
      ["a", 1],
      ["c", 1],
    ]);
  });
  it("export puis import dans le même carnet : rien n'est dupliqué", () => {
    const journal = [entry("a", 1), entry("b", 2)];
    const result = importJournal(journal, exportJournal(journal));
    expect(result.added).toBe(0);
    expect(result.entries).toHaveLength(2);
  });
  it("import dans un autre carnet : fusion", () => {
    const result = importJournal(
      [entry("x", 5)],
      exportJournal([entry("a", 1), entry("x", 5)]),
    );
    expect(result.added).toBe(1);
    expect(result.entries.map((e) => e.id)).toEqual(["a", "x"]);
  });
  it("import d'un fichier illisible : rien ne change", () => {
    const result = importJournal([entry("a", 1)], "pas du json");
    expect(result).toMatchObject({ added: 0, invalid: 0 });
    expect(result.entries).toHaveLength(1);
  });
  it("l'export porte l'app et la version", () => {
    expect(
      JSON.parse(
        exportJournal([entry("a", 1)], new Date("2026-10-04T10:00:00Z")),
      ),
    ).toMatchObject({
      app: "le-poids-des-choses",
      version: 1,
      exportedAt: "2026-10-04T10:00:00.000Z",
    });
  });
});

describe("createEntry", () => {
  const now = new Date("2026-10-04T10:00:00Z");
  it("calcule et fige l’écart (choix léger)", () => {
    const e = createEntry(
      { gestureA: "avion", gestureB: "tgv", quantity: 100, chosen: "b" },
      { now, id: "e1" },
    );
    expect(e).toMatchObject({ id: "e1", date: now.toISOString(), chosen: "b" });
    expect(e.avoidedKg).toBeGreaterThan(20);
  });
  it("choix lourd : écart de 0 kg", () => {
    expect(
      createEntry({
        gestureA: "avion",
        gestureB: "tgv",
        quantity: 100,
        chosen: "a",
      }).avoidedKg,
    ).toBe(0);
  });
  it("objets : compare deux modes du même objet", () => {
    const e = createEntry({
      gestureA: "jean",
      gestureB: "jean",
      quantity: 1,
      chosen: "b",
      modeA: "neuf",
      modeB: "occasion",
    });
    expect(e.modeA).toBe("neuf");
    expect(e.avoidedKg).toBeGreaterThan(20);
  });
  it("geste inconnu : erreur explicite", () => {
    expect(() =>
      createEntry({ gestureA: "x", gestureB: "tgv", quantity: 1, chosen: "a" }),
    ).toThrow(/inconnu/);
  });
});

describe("store", () => {
  it("enregistre sous la clé versionnée et relit", () => {
    const storage = new MemoryStorage();
    const store = createJournalStore(storage);
    store.add(entry("a", 1));
    expect(JSON.parse(storage.getItem(STORAGE_KEY)!)).toMatchObject({
      version: 1,
    });
    expect(
      createJournalStore(storage)
        .getEntries()
        .map((e) => e.id),
    ).toEqual(["a"]);
  });
  it("conserve les entrées illisibles telles quelles", () => {
    const storage = new MemoryStorage();
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, entries: [{ futur: true }, entry("a", 1)] }),
    );
    const store = createJournalStore(storage);
    expect(store.invalidCount).toBe(1);
    store.add(entry("b", 2));
    expect(JSON.parse(storage.getItem(STORAGE_KEY)!).entries).toContainEqual({
      futur: true,
    });
  });
  it("demande un stockage persistant au premier ajout seulement", () => {
    const requestPersistence = vi.fn();
    const store = createJournalStore(new MemoryStorage(), {
      requestPersistence,
    });
    store.add(entry("a", 1));
    store.add(entry("b", 2));
    expect(requestPersistence).toHaveBeenCalledTimes(1);
  });
  it("notifie les abonnés et retient la dernière entrée ajoutée", () => {
    const store = createJournalStore(new MemoryStorage());
    const listener = vi.fn();
    store.subscribe(listener);
    store.add(entry("a", 1));
    expect(listener).toHaveBeenCalledTimes(1);
    expect(store.lastAddedId).toBe("a");
  });
  it("sans localStorage (navigation privée) : fonctionne en mémoire", () => {
    for (const storage of [null, undefined, new BrokenStorage()]) {
      expect(isStorageUsable(storage)).toBe(false);
      const store = createJournalStore(storage);
      expect(store.persistent).toBe(false);
      store.add(entry("a", 1));
      expect(store.getEntries()).toHaveLength(1);
      store.reset();
      expect(store.getEntries()).toHaveLength(0);
    }
  });
  it("import et remise à zéro", () => {
    const storage = new MemoryStorage();
    const store = createJournalStore(storage);
    store.add(entry("a", 1));
    expect(
      store.importText(exportJournal([entry("a", 1), entry("b", 2)])),
    ).toEqual({ added: 1, invalid: 0 });
    store.reset();
    expect(store.getEntries()).toEqual([]);
    expect(storage.getItem(STORAGE_KEY)).toBeNull();
  });
  it("migration : lit une ancienne clé si la clé actuelle est absente", () => {
    const storage = new MemoryStorage();
    storage.setItem("ancien", JSON.stringify([entry("old", 1)]));
    const store = createJournalStore(storage, {
      migrations: [{ fromKey: "ancien", migrate: (raw) => JSON.parse(raw) }],
    });
    expect(store.getEntries().map((e) => e.id)).toEqual(["old"]);
    expect(storage.getItem(STORAGE_KEY)).not.toBeNull();
  });
});
