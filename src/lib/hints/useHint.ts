"use client";

import { useSyncExternalStore } from "react";
import { HINTS_KEY, parseSeen, serializeSeen, type HintId } from "./hints";

const listeners = new Set<() => void>();
/** Repli quand le stockage est indisponible (navigation privée) : la liste vit en mémoire. */
let memory: string | null = null;
let cached: { raw: string | null; value: HintId[] } = { raw: null, value: [] };
/** Au rendu serveur, aucun indice : il n'apparaît qu'une fois la page hydratée (annoncé). */
const ALL_SEEN: HintId[] = ["jardin-vide", "premiere-plante", "premier-arrosage"];

function read(): HintId[] {
  let raw = memory;
  try {
    raw = window.localStorage.getItem(HINTS_KEY) ?? memory;
  } catch {
    // Stockage indisponible : on garde la mémoire.
  }
  if (raw !== cached.raw) cached = { raw, value: parseSeen(raw) };
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

/** L'indice ne reviendra plus (fermé, ou l'action qu'il annonçait est faite). */
export function markHintSeen(id: HintId) {
  const seen = read();
  if (seen.includes(id)) return;
  memory = serializeSeen([...seen, id]);
  try {
    window.localStorage.setItem(HINTS_KEY, memory);
  } catch {
    // Stockage indisponible : l'indice ne revient pas pendant la visite.
  }
  listeners.forEach((listener) => listener());
}

/** Vrai si l'indice `id` doit s'afficher (`active` : la situation qu'il décrit est là). */
export function useHint(id: HintId, active: boolean): boolean {
  const seen = useSyncExternalStore(subscribe, read, () => ALL_SEEN);
  return active && !seen.includes(id);
}
