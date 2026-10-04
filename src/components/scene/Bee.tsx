"use client";

import { useRef } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { driftWithGust, resetDrift, useGust } from "@/components/motion/gust";
import { gsap } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";

const WINGS = '[data-part="aile-gauche"], [data-part="aile-droite"]';

/**
 * Abeille : vol en petite boucle (huit couché), ailes rapides ; un coup de vent la déporte.
 * Immobile en mouvement réduit.
 */
export function Bee({
  title,
  className = "w-16",
}: {
  title?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);

  const reduceRef = useMotion(ref, (reduce) => {
    if (reduce) return resetDrift(driftRef.current);
    if (!ref.current) return;
    gsap.to(WINGS, {
      scaleY: 0.35,
      transformOrigin: "50% 100%",
      duration: 0.05,
      ease: "none",
      repeat: -1,
      yoyo: true,
    });
    const flight = ref.current.querySelector("[data-flight]");
    const path = { t: 0 };
    gsap.to(path, {
      t: Math.PI * 2,
      duration: 3.2,
      ease: "none",
      repeat: -1,
      onUpdate: () =>
        gsap.set(flight, {
          xPercent: 14 * Math.sin(path.t),
          yPercent: 9 * Math.sin(2 * path.t),
        }),
    });
  });

  useGust(ref, reduceRef, (delay) => driftWithGust(driftRef.current, delay));

  return (
    <div ref={ref} className={className}>
      <div ref={driftRef}>
        <div data-flight>
          <Illustration
            name="abeille"
            title={title}
            className="block h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}
