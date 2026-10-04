"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

/**
 * Valeur d'un paramètre de l'URL, lue côté client. Contrairement à useSearchParams, la page
 * reste rendue au build (export statique) : null au rendu serveur, puis la vraie valeur.
 */
export function useSearchParam(name: string): string | null {
  return useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(name),
    () => null,
  );
}
