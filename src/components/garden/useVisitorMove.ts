"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { gsap } from "@/components/motion/gsap";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import type { LiveVisitor } from "@/lib/garden/live";
import { SCENE } from "@/lib/garden/scene";
import {
  gaitFor,
  movePoint,
  planMove,
  VISITOR_MOVE,
  type Point,
} from "@/lib/geometry/visitor-move";

/**
 * Un visiteur ne saute jamais : quand sa place change (une nouvelle plante la prend), son cadre
 * est posé tout de suite à la nouvelle place (React), et, avant l'affichage, décalé pour rester
 * là où il était ; puis il rejoint sa place avec sa démarche (`src/lib/geometry/visitor-move.ts`).
 * Ses animations au repos (queue, ailes, va-et-vient) tournent sur le dessin, à l'intérieur :
 * elles continuent sans reprendre à zéro. Une place qui ne change pas : rien ne bouge.
 */
export function useVisitorMove(
  ref: RefObject<HTMLDivElement | null>,
  visitor: LiveVisitor,
  still: boolean,
) {
  const reduced = useReducedMotion();
  // Où le visiteur est dessiné en ce moment (coin haut gauche, unités de scène) : sa place,
  // ou un point du trajet en cours (un nouveau déplacement part de là).
  const shown = useRef<Point | null>(null);
  const running = useRef<gsap.core.Animation | null>(null);
  const { x, y } = visitor.box;
  const settings = useRef({ visitor, still, reduced });
  useLayoutEffect(() => {
    settings.current = { visitor, still, reduced };
  });

  useLayoutEffect(() => {
    const element = ref.current;
    const from = shown.current;
    const to = { x, y };
    shown.current = to;
    if (!element || !from || (from.x === x && from.y === y)) return;

    running.current?.kill();
    const { visitor, still, reduced } = settings.current;
    const gait = gaitFor(
      { kind: visitor.kind, place: visitor.rule.place },
      { asleep: visitor.asleep || still, reduced },
    );
    const plan = planMove(from, to, gait, reduced);
    // Unités de scène → pixels, relu à chaque image (la scène suit la largeur de l'écran).
    const scale = () =>
      (element.parentElement?.clientWidth ?? SCENE.width) / SCENE.width;
    const offset = (point: Point) => {
      shown.current = point;
      gsap.set(element, {
        x: (point.x - x) * scale(),
        y: (point.y - y) * scale(),
      });
    };
    const done = () => {
      shown.current = to;
      gsap.set(element, { clearProps: "transform,opacity,visibility" });
      running.current = null;
    };

    offset(from);
    // Un déplacement interrompu en plein fondu repart visible, de là où il était.
    gsap.set(element, { autoAlpha: 1, scale: 1 });
    if (gait === "regrow" || gait === "fade") {
      // Sur place : il s'efface (une plante rentre en terre), change de place invisible, puis
      // revient (la plante ressort de terre).
      const [out, back] =
        gait === "regrow"
          ? VISITOR_MOVE.regrow
          : [plan.duration / 2, plan.duration / 2];
      const grow = gait === "regrow";
      running.current = gsap
        .timeline({ onComplete: done })
        .to(element, {
          autoAlpha: 0,
          scale: grow ? 0.5 : 1,
          transformOrigin: "50% 100%",
          duration: out,
          ease: "power1.in",
        })
        .add(() => offset(to))
        .fromTo(
          element,
          { autoAlpha: 0, scale: grow ? 0 : 1 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: back,
            ease: grow ? "back.out(1.7)" : "power1.out",
          },
        );
      return;
    }
    const progress = { t: 0 };
    running.current = gsap.to(progress, {
      t: 1,
      duration: plan.duration,
      ease: "none",
      onUpdate: () => offset(movePoint(plan, from, to, progress.t)),
      onComplete: done,
    });
  }, [ref, x, y]);

  useLayoutEffect(
    () => () => {
      running.current?.kill();
    },
    [],
  );
}
