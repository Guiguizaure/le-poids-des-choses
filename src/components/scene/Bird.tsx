"use client";

import { useRef } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { gsap } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";

type BirdProps = {
  /** Version endormie (jardin assoupi) : yeux fermés, respiration lente. */
  asleep?: boolean;
  /** En vol (oiseau-vol.svg) : les deux ailes battent en décalé. Le trajet est géré autour. */
  flying?: boolean;
  title?: string;
  className?: string;
};

const HEAD = '[data-part="tete"], [data-part="bec"], [data-part="oeil"]';
/** Cou de l'oiseau (oiseau.svg) : la tête pivote autour pour picorer. */
const NECK = "40 27";
/** Épaule de l'oiseau en vol (oiseau-vol.svg) : les ailes battent autour. */
const SHOULDER = "28 30";
/** Battement : ample course de scaleY, de 1 (ailes levées) à -0,6 (ailes rabattues). */
const FLAP = { from: 1, to: -0.6, halfPeriod: 0.14 } as const;

/**
 * Oiseau : posé au sol, il sautille et picore ; endormi, il respire doucement au sol ; en vol
 * (V1.1), ses ailes battent. Immobile en mouvement réduit (et il ne s'envole jamais).
 */
export function Bird({
  asleep = false,
  flying = false,
  title,
  className = "w-16",
}: BirdProps) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(
    ref,
    (reduce) => {
      if (reduce) return;
      if (flying && !asleep) {
        // Deux ailes, en décalé d'un demi-battement.
        ['[data-part="aile-avant"]', '[data-part="aile-arriere"]'].forEach(
          (wing, index) => {
            gsap.fromTo(
              wing,
              { scaleY: FLAP.from, svgOrigin: SHOULDER },
              {
                scaleY: FLAP.to,
                svgOrigin: SHOULDER,
                duration: FLAP.halfPeriod,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                delay: index * FLAP.halfPeriod,
              },
            );
          },
        );
        return;
      }
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
    [asleep, flying],
  );

  return (
    <div ref={ref} className={className}>
      <div data-hop>
        <Illustration
          name={asleep ? "oiseau-endormi" : flying ? "oiseau-vol" : "oiseau"}
          title={title}
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}
