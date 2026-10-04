"use client";

import { useRef, type RefObject } from "react";
import { FULL_MOTION_QUERY, gsap, REDUCED_MOTION_QUERY, useGSAP } from "./gsap";
import { useMotionSettings } from "./MotionProvider";

/**
 * Met en place les animations « au repos » d'un composant via gsap.matchMedia :
 * `setup(reduce)` est rappelé (après annulation de ses animations) quand la préférence
 * prefers-reduced-motion change, quand l'animation réduite est forcée, ou quand une dépendance
 * change. Renvoie une ref qui indique si le mouvement est réduit, pour les animations
 * déclenchées ailleurs (changement de stade, d'inclinaison…).
 */
export function useMotion(
  scope: RefObject<HTMLElement | null>,
  setup: (reduce: boolean) => void | (() => void),
  dependencies: unknown[] = [],
): RefObject<boolean> {
  const { forceReduced } = useMotionSettings();
  const reduceRef = useRef(true);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { reduce: REDUCED_MOTION_QUERY, full: FULL_MOTION_QUERY },
        (context) => {
          const reduce = forceReduced || Boolean(context.conditions?.reduce);
          reduceRef.current = reduce;
          // Les animations d'ambiance démarrent après le premier affichage (deux images) :
          // le texte de la page s'affiche d'abord (LCP), sans différence visible. Elles
          // restent enregistrées dans ce contexte, donc annulées avec lui.
          let cleanup: void | (() => void);
          const deferred = context as gsap.Context & { start?: () => void };
          context.add("start", () => {
            cleanup = setup(reduce);
          });
          let frame = requestAnimationFrame(() => {
            frame = requestAnimationFrame(() => deferred.start?.());
          });
          return () => {
            cancelAnimationFrame(frame);
            if (typeof cleanup === "function") cleanup();
          };
        },
        scope.current ?? undefined,
      );
      return () => mm.revert();
    },
    {
      scope,
      dependencies: [forceReduced, ...dependencies],
      revertOnUpdate: true,
    },
  );

  return reduceRef;
}
