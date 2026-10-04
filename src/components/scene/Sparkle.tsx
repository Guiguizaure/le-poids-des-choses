"use client";

import { useRef, type CSSProperties } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";
import { anchorAsCssOrigin } from "@/lib/illustrations/specs";

/** Joue l'apparition brève d'un éclat (élément contenant l'illustration « eclat »). */
export function playSparkle(
  element: Element,
  reduce: boolean,
): gsap.core.Timeline {
  gsap.killTweensOf(element);
  const timeline = gsap.timeline();
  if (reduce) {
    // Mouvement réduit : simple apparition en fondu, sans changement d'échelle.
    return timeline
      .fromTo(
        element,
        { autoAlpha: 0, scale: 1, rotation: 0 },
        { autoAlpha: 1, duration: 0.15 },
      )
      .to(element, { autoAlpha: 0, duration: 0.3 }, "+=0.3");
  }
  return timeline
    .fromTo(
      element,
      { autoAlpha: 0, scale: 0.4, rotation: -10 },
      {
        autoAlpha: 1,
        scale: 1.1,
        rotation: 0,
        duration: 0.35,
        ease: "back.out(2)",
      },
    )
    .to(
      element,
      { autoAlpha: 0, scale: 1.25, duration: 0.35, ease: "power1.in" },
      "+=0.1",
    );
}

export const sparkleHiddenStyle: CSSProperties = {
  opacity: 0,
  visibility: "hidden",
  transformOrigin: anchorAsCssOrigin("eclat"),
};

type SparkleProps = {
  /** Chaque nouvelle valeur (non nulle) rejoue l'éclat. */
  trigger?: number;
  className?: string;
  style?: CSSProperties;
};

export function Sparkle({
  trigger = 0,
  className = "w-20",
  style,
}: SparkleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceRef = useMotion(ref, () => {});

  useGSAP(
    () => {
      if (trigger && ref.current) playSparkle(ref.current, reduceRef.current);
    },
    { scope: ref, dependencies: [trigger] },
  );

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...sparkleHiddenStyle, ...style }}
    >
      <Illustration name="eclat" className="block h-auto w-full" />
    </div>
  );
}
