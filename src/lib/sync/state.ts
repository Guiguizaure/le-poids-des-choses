// État de la synchro sur l'appareil (localStorage, pas un cookie) : compte connecté, curseur,
// file d'attente des entrées à envoyer, dernière synchro, conflits gardés à part.
import { isJournalEntry } from "@/lib/journal/schema";
import type { SyncConflict } from "./merge";

export const SYNC_STORAGE_KEY = "lpdc:compte:v1";

export type SyncState = {
  version: 1;
  /** Adresse du compte connecté sur cet appareil ; null : pas connecté. */
  email: string | null;
  /** Dernier numéro reçu du compte (synchro incrémentale). */
  cursor: number;
  /** Ids des entrées à envoyer (file d'attente hors ligne). */
  pending: string[];
  /** Tout le carnet est à envoyer (première synchro après une connexion). */
  sendAll: boolean;
  /** Date ISO de la dernière synchro réussie. */
  lastSyncAt: string | null;
  /** Autres versions d'entrées connues, gardées à part (jamais affichées). */
  conflicts: SyncConflict[];
};

export const SIGNED_OUT: SyncState = {
  version: 1,
  email: null,
  cursor: 0,
  pending: [],
  sendAll: false,
  lastSyncAt: null,
  conflicts: [],
};

function isConflict(value: unknown): value is SyncConflict {
  if (!value || typeof value !== "object") return false;
  const conflict = value as Record<string, unknown>;
  return (
    typeof conflict.id === "string" &&
    isJournalEntry(conflict.kept) &&
    isJournalEntry(conflict.other)
  );
}

/** Lit l'état enregistré ; un contenu illisible donne l'état « pas connecté ». */
export function parseSyncState(text: string | null): SyncState {
  if (!text) return SIGNED_OUT;
  try {
    const data = JSON.parse(text) as Partial<SyncState>;
    if (!data || data.version !== 1) return SIGNED_OUT;
    return {
      version: 1,
      email: typeof data.email === "string" ? data.email : null,
      cursor:
        typeof data.cursor === "number" &&
        Number.isSafeInteger(data.cursor) &&
        data.cursor >= 0
          ? data.cursor
          : 0,
      pending: Array.isArray(data.pending)
        ? data.pending.filter((id): id is string => typeof id === "string")
        : [],
      sendAll: data.sendAll === true,
      lastSyncAt: typeof data.lastSyncAt === "string" ? data.lastSyncAt : null,
      conflicts: Array.isArray(data.conflicts)
        ? data.conflicts.filter(isConflict)
        : [],
    };
  } catch {
    return SIGNED_OUT;
  }
}

export function serializeSyncState(state: SyncState): string {
  return JSON.stringify(state);
}
