"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
  gustDelay,
  nextGustInterval,
  type SceneBox,
} from "@/lib/geometry/gust";
import { gsap } from "./gsap";

export type GustEvent = {
  /** Scène traversée : seuls ses descendants réagissent (toute la page si null). */
  root: Element | null;
  /** Position de la scène à l'écran, pour situer le front de la rafale. */
  scene: SceneBox;
};

type GustListener = (event: GustEvent) => void;

const listeners = new Set<GustListener>();

/**
 * Déclenche un coup de vent sur `root` (ou sur toute la page). Chaque élément abonné réagit
 * quand le front l'atteint ; rien ne bouge pour ceux qui sont en mouvement réduit.
 */
export function playGust(root?: Element | null): void {
  if (typeof window === "undefined") return;
  const box = root?.getBoundingClientRect();
  const event: GustEvent = {
    root: root ?? null,
    scene: box
      ? { left: box.left, width: box.width }
      : { left: 0, width: window.innerWidth },
  };
  for (const listener of [...listeners]) listener(event);
}

export function subscribeToGusts(listener: GustListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Fait réagir un élément aux rafales : `react(delay, event)` est appelé avec le délai avant que
 * le front l'atteigne (selon sa position x). Ignoré en mouvement réduit ou hors de la scène.
 */
export function useGust(
  ref: RefObject<Element | null>,
  reduceRef: RefObject<boolean>,
  react: (delay: number, event: GustEvent) => void,
): void {
  const reactRef = useRef(react);
  useEffect(() => {
    reactRef.current = react;
  });
  useEffect(
    () =>
      subscribeToGusts((event) => {
        const element = ref.current;
        if (!element || reduceRef.current) return;
        if (event.root && !event.root.contains(element)) return;
        const box = element.getBoundingClientRect();
        reactRef.current(
          gustDelay(box.left + box.width / 2, event.scene),
          event,
        );
      }),
    [ref, reduceRef],
  );
}

/** Rafales automatiques toutes les 25 à 45 s, seulement quand l'onglet est visible. */
export function useAutoGusts(
  enabled: boolean,
  rootRef?: RefObject<Element | null>,
): void {
  useEffect(() => {
    if (!enabled) return;
    let timer: number | undefined;
    const schedule = () => {
      timer = window.setTimeout(() => {
        if (document.visibilityState === "visible")
          playGust(rootRef?.current ?? null);
        schedule();
      }, nextGustInterval() * 1000);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [enabled, rootRef]);
}

/** Arrête un déport en cours et remet l'insecte en place (passage en mouvement réduit). */
export function resetDrift(element: Element | null): void {
  if (!element) return;
  gsap.killTweensOf(element);
  gsap.set(element, { xPercent: 0, yPercent: 0, rotation: 0 });
}

/** Déport d'un insecte volant par la rafale, puis retour en douceur. */
export function driftWithGust(element: Element | null, delay: number): void {
  if (!element) return;
  gsap.killTweensOf(element);
  gsap
    .timeline({ delay })
    .to(element, {
      xPercent: 22,
      yPercent: -10,
      rotation: 10,
      duration: 0.35,
      ease: "power2.out",
    })
    .to(element, {
      xPercent: 0,
      yPercent: 0,
      rotation: 0,
      duration: 1.4,
      ease: "elastic.out(1, 0.5)",
    });
}
