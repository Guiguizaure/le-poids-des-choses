// Carnet enregistré sur l'appareil (localStorage), avec repli en mémoire quand le stockage est
// indisponible (navigation privée, stockage bloqué). Jamais d'erreur levée vers l'interface.
import type { JournalEntry } from "@/lib/data/types";
import { appendEntry, importJournal, type ImportResult } from "./merge";
import {
  MIGRATIONS,
  parseJournalText,
  serializeJournal,
  STORAGE_KEY,
  type Migration,
  type ParsedJournal,
} from "./schema";

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type JournalStore = {
  getEntries(): readonly JournalEntry[];
  subscribe(listener: () => void): () => void;
  add(entry: JournalEntry): void;
  importText(text: string): Omit<ImportResult, "entries">;
  reset(): void;
  /** Faux si le carnet ne vit qu'en mémoire (il disparaîtra à la fermeture). */
  readonly persistent: boolean;
  /** Entrées illisibles trouvées à la lecture (ignorées, mais conservées). */
  readonly invalidCount: number;
  /** Dernière entrée ajoutée pendant cette visite (pour l'animation d'arrivée). */
  readonly lastAddedId: string | null;
  /** Relit le stockage (modification depuis un autre onglet). */
  reload(): void;
  /** Réservé au labo : réécrit le carnet (ex. vieillir la dernière entrée). */
  debugRewrite(
    update: (entries: readonly JournalEntry[]) => JournalEntry[],
  ): void;
};

type StoreOptions = {
  migrations?: readonly Migration[];
  /** Appelé au premier ajout : demande un stockage persistant au navigateur. */
  requestPersistence?: () => void;
};

/** Vrai si le stockage accepte vraiment une écriture (certains navigateurs lèvent une erreur). */
export function isStorageUsable(
  storage: StorageLike | null | undefined,
): storage is StorageLike {
  if (!storage) return false;
  try {
    const probe = `${STORAGE_KEY}:probe`;
    storage.setItem(probe, "1");
    storage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

function read(
  storage: StorageLike,
  migrations: readonly Migration[],
): ParsedJournal {
  try {
    const current = storage.getItem(STORAGE_KEY);
    if (current !== null) return parseJournalText(current);
    for (const migration of migrations) {
      const old = storage.getItem(migration.fromKey);
      if (old === null) continue;
      const parsed = parseJournalText(JSON.stringify(migration.migrate(old)));
      storage.setItem(
        STORAGE_KEY,
        serializeJournal(parsed.entries, parsed.invalid),
      );
      return parsed;
    }
  } catch {
    // Lecture impossible : carnet vide, sans planter.
  }
  return { entries: [], invalid: [] };
}

export function createJournalStore(
  storage: StorageLike | null | undefined,
  { migrations = MIGRATIONS, requestPersistence }: StoreOptions = {},
): JournalStore {
  const usable = isStorageUsable(storage);
  let state: ParsedJournal = usable
    ? read(storage, migrations)
    : { entries: [], invalid: [] };
  let lastAddedId: string | null = null;
  let persistenceRequested = false;
  const listeners = new Set<() => void>();

  const emit = () => listeners.forEach((listener) => listener());
  const save = () => {
    if (!usable) return;
    try {
      storage.setItem(
        STORAGE_KEY,
        serializeJournal(state.entries, state.invalid),
      );
    } catch {
      // Quota dépassé ou stockage retiré : le carnet reste en mémoire pour cette visite.
    }
  };

  return {
    getEntries: () => state.entries,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    add(entry) {
      const entries = appendEntry(state.entries, entry);
      if (entries.length === state.entries.length) return;
      state = { ...state, entries };
      lastAddedId = entry.id;
      save();
      if (!persistenceRequested && usable) {
        persistenceRequested = true;
        requestPersistence?.();
      }
      emit();
    },
    importText(text) {
      const result = importJournal(state.entries, text);
      if (result.added > 0) {
        state = { ...state, entries: result.entries };
        save();
        emit();
      }
      return { added: result.added, invalid: result.invalid };
    },
    reset() {
      state = { entries: [], invalid: [] };
      lastAddedId = null;
      if (usable) {
        try {
          storage.removeItem(STORAGE_KEY);
        } catch {
          // Rien à faire.
        }
      }
      emit();
    },
    get persistent() {
      return usable;
    },
    get invalidCount() {
      return state.invalid.length;
    },
    get lastAddedId() {
      return lastAddedId;
    },
    reload() {
      if (!usable) return;
      state = read(storage, migrations);
      emit();
    },
    debugRewrite(update) {
      state = { ...state, entries: update(state.entries) };
      save();
      emit();
    },
  };
}

/** Demande au navigateur de ne pas effacer le carnet en cas de manque de place. */
export function requestPersistentStorage(): void {
  try {
    const storage =
      typeof navigator !== "undefined" ? navigator.storage : undefined;
    if (!storage?.persist) return;
    void storage
      .persisted()
      .then((already) => (already ? true : storage.persist()))
      .catch(() => undefined);
  } catch {
    // API absente ou refusée : sans conséquence.
  }
}
