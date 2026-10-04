"use client";

import { useRef } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { gsap } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";

// Les élytres pivotent depuis le haut de la ligne médiane (24,12), sous la tête.
const ELYTRA_PIVOT = "24 12";

/**
 * Coccinelle : elle marche de long en large, puis de temps en temps ouvre ses élytres et
 * s'envole pour revenir à son point de départ. Immobile en mouvement réduit.
 */
export function Ladybug({
  title,
  className = "w-12",
}: {
  title?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(ref, (reduce) => {
    if (reduce) return;
    const bug = "[data-walk]";
    const left = '[data-part="elytre-gauche"]';
    const right = '[data-part="elytre-droite"]';

    gsap.to('[data-part="pattes"]', {
      rotation: 5,
      transformOrigin: "50% 50%",
      duration: 0.12,
      ease: "none",
      repeat: -1,
      yoyo: true,
    });

    const walk = (xPercent: number) => ({
      xPercent,
      duration: 2.4,
      ease: "none",
    });
    const wobble = {
      rotation: 4,
      duration: 0.3,
      ease: "sine.inOut",
      repeat: 7,
      yoyo: true,
    };

    gsap
      .timeline({ repeat: -1, repeatDelay: 1.2, delay: 0.5 })
      .to(bug, walk(45))
      .fromTo(bug, { rotation: -4 }, wobble, "<")
      .to(bug, walk(0), "+=0.4")
      .to(bug, walk(45), "+=0.4")
      // Envol : élytres ouvertes, petit vol en arc jusqu'au point de départ.
      .set(bug, { rotation: 0 })
      .to(
        left,
        {
          rotation: -35,
          svgOrigin: ELYTRA_PIVOT,
          duration: 0.2,
          ease: "back.out(2)",
        },
        "+=0.4",
      )
      .to(
        right,
        {
          rotation: 35,
          svgOrigin: ELYTRA_PIVOT,
          duration: 0.2,
          ease: "back.out(2)",
        },
        "<",
      )
      .to(bug, { yPercent: -70, duration: 0.45, ease: "power2.out" })
      .to(bug, { xPercent: 0, duration: 0.7, ease: "sine.inOut" })
      .to(bug, { yPercent: 0, duration: 0.45, ease: "power2.in" })
      .to([left, right], {
        rotation: 0,
        svgOrigin: ELYTRA_PIVOT,
        duration: 0.25,
        ease: "power2.out",
      });
  });

  return (
    <div ref={ref} className={className}>
      <div data-walk>
        <Illustration
          name="coccinelle"
          title={title}
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}
