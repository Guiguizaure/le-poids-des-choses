"use client";

import { useSyncExternalStore } from "react";
import {
  parseStoredSky,
  serializeSky,
  SKY_STORAGE_KEY,
  type SkyId,
} from "@/lib/garden/skies";

const listeners = new Set<() => void>();
/** Repli quand le stockage est indisponible (navigation privée) : le choix vit en mémoire. */
let memory: SkyId | null = null;

function read(): SkyId | null {
  try {
    return (
      parseStoredSky(window.localStorage.getItem(SKY_STORAGE_KEY)) ?? memory
    );
  } catch {
    return memory;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function choose(id: SkyId) {
  memory = id;
  try {
    window.localStorage.setItem(SKY_STORAGE_KEY, serializeSky(id));
  } catch {
    // Stockage indisponible : le choix reste en mémoire le temps de la visite.
  }
  listeners.forEach((listener) => listener());
}

/** Ciel choisi sur cet appareil (null : aucun choix, ou rendu serveur) et de quoi le changer. */
export function useSky(): [SkyId | null, (id: SkyId) => void] {
  const sky = useSyncExternalStore(subscribe, read, () => null);
  return [sky, choose];
}
