"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { gardenTotals, type GardenTotals } from "@/lib/calc";
import type {
  ComparisonEntry,
  HabitEntry,
  JournalEntry,
} from "@/lib/data/types";
import { afterEntryAdded } from "@/lib/sync/browser";
import { getBrowserStore } from "./browser";
import { createEntry, createHabitEntry, type NewEntry } from "./entry";
import { exportFileName, exportJournal } from "./merge";

type Snapshot = {
  /** Faux pendant le rendu serveur et l'hydratation : le carnet n'est pas encore lu. */
  ready: boolean;
  entries: readonly JournalEntry[];
  persistent: boolean;
  invalidCount: number;
  lastAddedId: string | null;
};

const SERVER_SNAPSHOT: Snapshot = {
  ready: false,
  entries: [],
  persistent: true,
  invalidCount: 0,
  lastAddedId: null,
};

let cached: Snapshot | null = null;

function getSnapshot(): Snapshot {
  const store = getBrowserStore();
  const entries = store.getEntries();
  if (
    !cached ||
    cached.entries !== entries ||
    cached.lastAddedId !== store.lastAddedId ||
    cached.invalidCount !== store.invalidCount
  ) {
    cached = {
      ready: true,
      entries,
      persistent: store.persistent,
      invalidCount: store.invalidCount,
      lastAddedId: store.lastAddedId,
    };
  }
  return cached;
}

const subscribe = (listener: () => void) =>
  getBrowserStore().subscribe(listener);
const getServerSnapshot = () => SERVER_SNAPSHOT;

export type ImportOutcome =
  { ok: true; added: number; invalid: number } | { ok: false };

export type UseJournal = Snapshot & {
  totals: GardenTotals;
  add: (input: NewEntry) => ComparisonEntry;
  /** Note une habitude tenue aujourd'hui (aucun kg : elle arrose le jardin). */
  addHabit: (gesture: string) => HabitEntry;
  exportFile: () => void;
  importFile: (file: File) => Promise<ImportOutcome>;
  reset: () => void;
  /**
   * Réservé au labo : recule tout le carnet de `days` jours (la dernière entrée a alors cet
   * âge), pour simuler une absence sans changer l'ordre des entrées ni le jardin.
   */
  ageJournal: (days: number) => void;
};

export function useJournal(): UseJournal {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const totals = useMemo(
    () => gardenTotals(snapshot.entries),
    [snapshot.entries],
  );

  const add = useCallback((input: NewEntry) => {
    const entry = createEntry(input);
    getBrowserStore().add(entry);
    // Compte connecté : l'entrée part vers le compte (ou attend le retour en ligne).
    afterEntryAdded(entry);
    return entry;
  }, []);

  const addHabit = useCallback((gesture: string) => {
    const entry = createHabitEntry(gesture);
    getBrowserStore().add(entry);
    afterEntryAdded(entry);
    return entry;
  }, []);

  const exportFile = useCallback(() => {
    const now = new Date();
    const blob = new Blob(
      [exportJournal(getBrowserStore().getEntries(), now)],
      {
        type: "application/json",
      },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = exportFileName(now);
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, []);

  const importFile = useCallback(async (file: File): Promise<ImportOutcome> => {
    try {
      const text = await file.text();
      JSON.parse(text);
      return { ok: true, ...getBrowserStore().importText(text) };
    } catch {
      return { ok: false };
    }
  }, []);

  const reset = useCallback(() => getBrowserStore().reset(), []);

  const ageJournal = useCallback((days: number) => {
    const shift = days * 24 * 60 * 60 * 1000;
    getBrowserStore().debugRewrite((entries) =>
      entries.map((entry) => ({
        ...entry,
        date: new Date(Date.parse(entry.date) - shift).toISOString(),
      })),
    );
  }, []);

  return {
    ...snapshot,
    totals,
    add,
    addHabit,
    exportFile,
    importFile,
    reset,
    ageJournal,
  };
}
