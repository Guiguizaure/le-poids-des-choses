// Moteur de synchro de la page (un seul, partagé). Personne n'est connecté : aucun appel
// réseau, rien d'autre qu'une lecture du stockage.
import type { JournalEntry } from "@/lib/data/types";
import { getBrowserStore } from "@/lib/journal/browser";
import { accountApi } from "./api";
import { createSyncEngine, type SyncEngine } from "./engine";
import { SYNC_STORAGE_KEY } from "./state";

let engine: SyncEngine | null = null;

export function getSyncEngine(): SyncEngine {
  if (!engine) {
    let storage: Storage | null = null;
    try {
      storage = window.localStorage;
    } catch {
      // Stockage refusé : état en mémoire.
    }
    const created = createSyncEngine({
      journal: getBrowserStore(),
      storage,
      sync: accountApi.sync,
    });
    // Retour en ligne : la file d'attente repart.
    window.addEventListener("online", () => {
      const state = created.getSnapshot();
      if (state.email && (state.pending.length > 0 || state.sendAll))
        void created.sync();
    });
    window.addEventListener("storage", (event) => {
      if (event.key === SYNC_STORAGE_KEY) created.reload();
    });
    engine = created;
  }
  return engine;
}

/** Après un nouveau choix : envoyé tout de suite au compte si l'appareil est connecté. */
export function afterEntryAdded(entry: JournalEntry): void {
  const sync = getSyncEngine();
  if (!sync.getSnapshot().email) return;
  sync.enqueue(entry.id);
  void sync.sync();
}
