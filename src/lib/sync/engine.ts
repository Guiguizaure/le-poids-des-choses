// Moteur de synchro : envoie la file d'attente (ou tout le carnet après une connexion),
// fusionne les entrées du compte sans jamais rien écraser, garde l'état sur l'appareil.
// Sans réseau, la file reste et repart à la synchro suivante.
import type { JournalEntry } from "@/lib/data/types";
import type { StorageLike } from "@/lib/journal/store";
import type { ApiError, ApiResult, SyncPayload, SyncReply } from "./api";
import { addConflicts, type SyncConflict } from "./merge";
import {
  parseSyncState,
  serializeSyncState,
  SIGNED_OUT,
  SYNC_STORAGE_KEY,
  type SyncState,
} from "./state";

/** Entrées par requête (limite de l'API). */
export const SYNC_BATCH = 200;

export type SyncOutcome = "ok" | "signed-out" | ApiError;

export type JournalLike = {
  getEntries(): readonly JournalEntry[];
  mergeRemote(entries: readonly JournalEntry[]): {
    added: number;
    conflicts: SyncConflict[];
  };
};

export type SyncSnapshot = SyncState & {
  syncing: boolean;
  /** Résultat de la dernière tentative (null : aucune pendant cette visite). */
  lastOutcome: SyncOutcome | null;
  /** Choix récupérés depuis le compte pendant cette visite. */
  received: number;
};

export type SyncEngine = {
  getSnapshot(): SyncSnapshot;
  subscribe(listener: () => void): () => void;
  /** Après une connexion : tout le carnet sera envoyé à la prochaine synchro. */
  signedIn(email: string): void;
  /** Déconnexion, compte supprimé ou session expirée : l'état de synchro est oublié. */
  signedOut(): void;
  /** Nouvelle entrée à envoyer (ignorée si personne n'est connecté). */
  enqueue(id: string): void;
  /** Lance une synchro (une seule à la fois : un second appel attend la même). */
  sync(): Promise<SyncOutcome>;
  /** Relit l'état (modifié dans un autre onglet). */
  reload(): void;
};

export function createSyncEngine({
  journal,
  storage,
  sync: send,
  now = () => new Date(),
}: {
  journal: JournalLike;
  storage: StorageLike | null;
  sync: (payload: SyncPayload) => Promise<ApiResult<SyncReply>>;
  now?: () => Date;
}): SyncEngine {
  const read = (): SyncState => {
    try {
      return parseSyncState(storage?.getItem(SYNC_STORAGE_KEY) ?? null);
    } catch {
      return SIGNED_OUT;
    }
  };
  let state = read();
  let syncing: Promise<SyncOutcome> | null = null;
  let lastOutcome: SyncOutcome | null = null;
  let received = 0;
  let snapshot: SyncSnapshot | null = null;
  const listeners = new Set<() => void>();

  const emit = () => {
    snapshot = null;
    listeners.forEach((listener) => listener());
  };
  const update = (next: SyncState) => {
    state = next;
    try {
      if (next.email === null && next.conflicts.length === 0)
        storage?.removeItem(SYNC_STORAGE_KEY);
      else storage?.setItem(SYNC_STORAGE_KEY, serializeSyncState(next));
    } catch {
      // Stockage indisponible : l'état vit en mémoire pour cette visite.
    }
    emit();
  };

  async function run(): Promise<SyncOutcome> {
    const email = state.email;
    if (!email) return "signed-out";
    const local = journal.getEntries();
    const queued = new Set(state.pending);
    const toSend = state.sendAll
      ? [...local]
      : local.filter((entry) => queued.has(entry.id));
    const sent = new Set<string>();
    let cursor = state.cursor;
    let conflicts = state.conflicts;
    let index = 0;
    let more = false;
    let failure: ApiError | null = null;
    do {
      const batch = toSend.slice(index, index + SYNC_BATCH);
      const reply = await send({ since: cursor, entries: batch });
      if (!reply.ok) {
        failure = reply.error;
        break;
      }
      const merged = journal.mergeRemote(reply.data.entries);
      received += merged.added;
      conflicts = addConflicts(conflicts, merged.conflicts);
      cursor = reply.data.cursor;
      for (const entry of batch) sent.add(entry.id);
      index += batch.length;
      more = reply.data.hasMore;
    } while (index < toSend.length || more);

    // Déconnexion ou autre compte pendant la synchro : rien à enregistrer.
    if (state.email !== email) return "signed-out";
    if (failure === "unauthorized") {
      // Session expirée ou supprimée ailleurs : on oublie le compte, pas le carnet.
      update({ ...SIGNED_OUT, conflicts });
      return failure;
    }
    const complete = failure === null;
    update({
      ...state,
      cursor,
      // Relu après les appels : une entrée ajoutée pendant la synchro reste dans la file.
      pending: state.pending.filter((id) => !sent.has(id)),
      // Envoi complet interrompu : il reprendra en entier à la prochaine synchro.
      sendAll: state.sendAll && !complete,
      lastSyncAt: complete ? now().toISOString() : state.lastSyncAt,
      conflicts,
    });
    return failure ?? "ok";
  }

  return {
    getSnapshot() {
      if (!snapshot)
        snapshot = {
          ...state,
          syncing: syncing !== null,
          lastOutcome,
          received,
        };
      return snapshot;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    signedIn(email) {
      received = 0;
      lastOutcome = null;
      update({
        ...SIGNED_OUT,
        email,
        sendAll: true,
        conflicts: state.conflicts,
      });
    },
    signedOut() {
      lastOutcome = null;
      update({ ...SIGNED_OUT, conflicts: state.conflicts });
    },
    enqueue(id) {
      if (!state.email || state.pending.includes(id)) return;
      update({ ...state, pending: [...state.pending, id] });
    },
    sync() {
      if (!syncing) {
        syncing = run()
          .catch((): SyncOutcome => "error")
          .then((outcome) => {
            syncing = null;
            lastOutcome = outcome;
            emit();
            return outcome;
          });
        emit();
      }
      return syncing;
    },
    reload() {
      state = read();
      emit();
    },
  };
}
