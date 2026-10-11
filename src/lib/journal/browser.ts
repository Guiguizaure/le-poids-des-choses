// Carnet unique de la page, partagé par tous les composants (et entre /jardin et /labo) et
// par la synchro du compte.
import { setGardenFlag } from "./garden-flag";
import { STORAGE_KEY } from "./schema";
import {
  createJournalStore,
  requestPersistentStorage,
  type JournalStore,
} from "./store";

let browserStore: JournalStore | null = null;

export function getBrowserStore(): JournalStore {
  if (!browserStore) {
    let storage: Storage | null = null;
    try {
      storage = window.localStorage;
    } catch {
      // Accès refusé (navigation privée stricte) : carnet en mémoire.
    }
    const store = createJournalStore(storage, {
      requestPersistence: requestPersistentStorage,
    });
    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY) store.reload();
    });
    // Premier choix enregistré (ou carnet vidé) : l'accueil change d'action principale.
    store.subscribe(() => setGardenFlag(store.getEntries().length > 0));
    browserStore = store;
  }
  return browserStore;
}
