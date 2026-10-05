"use client";

import { useRef } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { useGust } from "@/components/motion/gust";
import { gsap } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";
import { GUST } from "@/lib/geometry/gust";
import { getSpec } from "@/lib/illustrations/specs";

const TRAITS = ["traits-1", "traits-2", "traits-3"];

/**
 * Traits de vent : invisibles au repos, ils traversent la scène de gauche à droite à chaque
 * coup de vent (playGust). À placer dans la scène (position absolue), qui doit masquer ce qui
 * dépasse. Rien en mouvement réduit.
 */
export function Wind({
  className = "absolute inset-x-0 top-0",
}: {
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  // Passage en mouvement réduit pendant une rafale : on l'arrête et on cache les traits.
  const reduceRef = useMotion(ref, (reduce) => {
    if (!reduce) return;
    timelineRef.current?.kill();
    timelineRef.current = null;
    gsap.set(ref.current, { autoAlpha: 0 });
  });
  const width = getSpec("vent").width;

  useGust(ref, reduceRef, () => {
    const root = ref.current;
    if (!root) return;
    timelineRef.current?.kill();
    const timeline = gsap.timeline();
    timelineRef.current = timeline;
    timeline.set(root, { autoAlpha: 1 });
    TRAITS.forEach((part, i) => {
      const trait = root.querySelector(`[data-part="${part}"]`);
      const start = i * 0.08;
      timeline
        .fromTo(
          trait,
          { x: -width * 0.9 },
          {
            x: width * 0.9,
            duration: GUST.crossDuration,
            ease: "power1.inOut",
          },
          start,
        )
        .fromTo(trait, { opacity: 0 }, { opacity: 1, duration: 0.25 }, start)
        .to(
          trait,
          { opacity: 0, duration: 0.3 },
          start + GUST.crossDuration - 0.3,
        );
    });
    timeline.set(root, { autoAlpha: 0 });
  });

  return (
    <div
      ref={ref}
      className={`pointer-events-none ${className}`}
      style={{ opacity: 0, visibility: "hidden" }}
      data-wind
      aria-hidden
    >
      <Illustration
        name="vent"
        className="block h-auto w-full overflow-visible"
      />
    </div>
  );
}
