"use client";

import { useRef } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { gsap } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";

type BirdProps = {
  /** Version endormie (jardin assoupi) : yeux fermés, respiration lente. */
  asleep?: boolean;
  title?: string;
  className?: string;
};

const HEAD = '[data-part="tete"], [data-part="bec"], [data-part="oeil"]';
/** Cou de l'oiseau (oiseau.svg) : la tête pivote autour pour picorer. */
const NECK = "40 27";

/**
 * Oiseau, posé au sol (V1) : il sautille et picore ; endormi, il respire doucement au sol.
 * Immobile en mouvement réduit. L'envol est prévu pour la V1.1.
 */
export function Bird({ asleep = false, title, className = "w-16" }: BirdProps) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(
    ref,
    (reduce) => {
      if (reduce) return;
      if (asleep) {
        gsap.to('[data-part="corps"], [data-part="aile"]', {
          scaleY: 1.05,
          transformOrigin: "50% 100%",
          duration: 1.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
        return;
      }
      gsap
        .timeline({ repeat: -1, repeatDelay: 1.4, delay: 0.4 })
        .to("[data-hop]", { yPercent: -14, duration: 0.16, ease: "power2.out" })
        .to("[data-hop]", { yPercent: 0, duration: 0.24, ease: "bounce.out" })
        .to(
          "[data-hop]",
          { yPercent: -10, duration: 0.14, ease: "power2.out" },
          "+=0.08",
        )
        .to("[data-hop]", { yPercent: 0, duration: 0.2, ease: "bounce.out" })
        // Picore deux fois : la tête plonge vers le sol et remonte.
        .to(
          HEAD,
          { rotation: 32, svgOrigin: NECK, duration: 0.12, ease: "power2.in" },
          "+=0.5",
        )
        .to(HEAD, {
          rotation: 0,
          svgOrigin: NECK,
          duration: 0.14,
          ease: "power2.out",
        })
        .to(
          HEAD,
          { rotation: 32, svgOrigin: NECK, duration: 0.12, ease: "power2.in" },
          "+=0.12",
        )
        .to(HEAD, {
          rotation: 0,
          svgOrigin: NECK,
          duration: 0.18,
          ease: "power2.out",
        });
    },
    [asleep],
  );

  return (
    <div ref={ref} className={className}>
      <div data-hop>
        <Illustration
          name={asleep ? "oiseau-endormi" : "oiseau"}
          title={title}
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}
