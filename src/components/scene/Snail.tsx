"use client";

import { useRef } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { gsap } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";

type SnailProps = {
  /** Version endormie (jardin assoupi) : rentré dans sa coquille, respiration lente. */
  asleep?: boolean;
  title?: string;
  className?: string;
};

/**
 * Escargot : avance très lentement, fait demi-tour, antennes qui bougent ; endormi, sa
 * coquille respire doucement. Immobile en mouvement réduit.
 */
export function Snail({
  asleep = false,
  title,
  className = "w-16",
}: SnailProps) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(
    ref,
    (reduce) => {
      if (reduce) return;
      if (asleep) {
        gsap.to('[data-part="coquille"]', {
          scale: 1.03,
          transformOrigin: "50% 100%",
          duration: 2.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
        return;
      }
      gsap.fromTo(
        '[data-part="antennes"]',
        { rotation: -8 },
        {
          rotation: 8,
          transformOrigin: "30% 100%",
          duration: 1.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        },
      );
      gsap.to('[data-part="corps"]', {
        scaleX: 1.04,
        transformOrigin: "0% 100%",
        duration: 1.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      gsap
        .timeline({ repeat: -1 })
        .set("[data-crawl]", { scaleX: 1, transformOrigin: "50% 100%" })
        .to("[data-crawl]", { xPercent: 30, duration: 14, ease: "none" })
        .set("[data-crawl]", { scaleX: -1 })
        .to("[data-crawl]", { xPercent: 0, duration: 14, ease: "none" });
    },
    [asleep],
  );

  return (
    <div ref={ref} className={className}>
      <div data-crawl>
        <Illustration
          name={asleep ? "escargot-endormi" : "escargot"}
          title={title}
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}
