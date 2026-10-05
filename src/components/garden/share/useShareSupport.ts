"use client";

import { useSyncExternalStore } from "react";

let cached: boolean | null = null;

/**
 * Le bouton « Partager » n'apparaît que si le navigateur sait partager un PNG
 * (navigator.canShare avec un fichier) ET si l'on est sur un écran tactile ou dans l'appli
 * installée. Sur ordinateur, rien ne change.
 */
export function canShareGarden(): boolean {
  if (cached !== null) return cached;
  let files = false;
  try {
    files =
      typeof navigator.canShare === "function" &&
      navigator.canShare({
        files: [
          new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], "jardin.png", {
            type: "image/png",
          }),
        ],
      });
  } catch {
    files = false;
  }
  const touch = window.matchMedia("(pointer: coarse)").matches;
  const installed = window.matchMedia("(display-mode: standalone)").matches;
  cached = files && (touch || installed);
  return cached;
}

const subscribe = () => () => {};

/** Faux au rendu serveur, puis la vraie réponse dans le navigateur. */
export function useShareSupport(): boolean {
  return useSyncExternalStore(subscribe, canShareGarden, () => false);
}
