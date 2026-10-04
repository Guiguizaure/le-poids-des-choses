"use client";

import { useSyncExternalStore } from "react";
import { REDUCED_MOTION_QUERY } from "./gsap";
import { useMotionSettings } from "./MotionProvider";

function subscribe(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

/** Préférence du système (prefers-reduced-motion). Faux au rendu serveur. */
export function useSystemReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

/** Vrai si le mouvement doit être réduit (système, ou forcé par MotionProvider). */
export function useReducedMotion(): boolean {
  const { forceReduced } = useMotionSettings();
  return useSystemReducedMotion() || forceReduced;
}
