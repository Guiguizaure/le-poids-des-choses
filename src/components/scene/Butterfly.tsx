"use client";

import { useRef } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { driftWithGust, resetDrift, useGust } from "@/components/motion/gust";
import { gsap } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";
import { getSpec } from "@/lib/illustrations/specs";

const WINGS = '[data-part="aile-gauche"], [data-part="aile-droite"]';

/**
 * Papillon : les ailes battent (scaleX autour du corps) ; un coup de vent le déporte un peu.
 * Immobile en mouvement réduit.
 */
export function Butterfly({
  title,
  className = "w-16",
}: {
  title?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);
  const body = getSpec("papillon").anchor ?? { x: 32, y: 26 };

  const reduceRef = useMotion(ref, (reduce) => {
    if (reduce) return resetDrift(driftRef.current);
    gsap.to(WINGS, {
      scaleX: 0.3,
      svgOrigin: `${body.x} ${body.y}`,
      duration: 0.14,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  });

  useGust(ref, reduceRef, (delay) => driftWithGust(driftRef.current, delay));

  return (
    <div ref={ref} className={className}>
      <div ref={driftRef}>
        <Illustration
          name="papillon"
          title={title}
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}
