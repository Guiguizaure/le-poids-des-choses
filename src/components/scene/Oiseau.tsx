"use client";

import { useRef } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { gsap } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";

type OiseauProps = {
  /** Version endormie (jardin assoupi) : yeux fermés, respiration lente. */
  asleep?: boolean;
  title?: string;
  className?: string;
};

/** Oiseau : petits sautillements ; endormi, il respire doucement. Immobile en mouvement réduit. */
export function Oiseau({
  asleep = false,
  title,
  className = "w-16",
}: OiseauProps) {
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
        .to("[data-hop]", { yPercent: 0, duration: 0.2, ease: "bounce.out" });
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
