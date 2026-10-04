"use client";

import { useEffect, useRef } from "react";

/**
 * Place le focus sur le titre de l'écran quand on y arrive par navigation (clavier, lecteur
 * d'écran), sans voler le focus au premier chargement de la page.
 */
export function useFocusTitle<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (enabled) ref.current?.focus();
  }, [enabled]);
  return ref;
}
