"use client";

import { useSyncExternalStore } from "react";
import {
  DECLARED_HABITS_KEY,
  normalizeDeclared,
  parseDeclared,
  serializeDeclared,
} from "./declared";

const listeners = new Set<() => void>();
/** Repli quand le stockage est indisponible (navigation privée) : la liste vit en mémoire. */
let memory: string | null = null;
let cached: { raw: string | null; value: string[] } = { raw: null, value: [] };
const EMPTY: string[] = [];

function read(): string[] {
  let raw = memory;
  try {
    raw = window.localStorage.getItem(DECLARED_HABITS_KEY) ?? memory;
  } catch {
    // Stockage indisponible : on garde la mémoire.
  }
  if (raw !== cached.raw) cached = { raw, value: parseDeclared(raw) };
  return cached.value;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function save(gestures: readonly string[]) {
  memory = serializeDeclared(normalizeDeclared(gestures));
  try {
    window.localStorage.setItem(DECLARED_HABITS_KEY, memory);
  } catch {
    // Stockage indisponible : la liste reste en mémoire le temps de la visite.
  }
  listeners.forEach((listener) => listener());
}

/** « Mes habitudes » sur cet appareil (vide au rendu serveur) et de quoi les changer. */
export function useDeclaredHabits(): [
  string[],
  (gestures: readonly string[]) => void,
] {
  const declared = useSyncExternalStore(subscribe, read, () => EMPTY);
  return [declared, save];
}
