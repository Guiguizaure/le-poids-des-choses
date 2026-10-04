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
          return setup(reduce);
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
