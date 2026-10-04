"use client";

import { useRef } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { gsap } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";
import { headingAngle } from "@/lib/geometry/heading";

// Les élytres pivotent depuis le haut de la ligne médiane (24,12), sous la tête.
const ELYTRA_PIVOT = "24 12";
/** Distance d'une marche, en % de la largeur de la coccinelle. */
const STRIDE = 45;

/**
 * Coccinelle (vue de dessus, tête en haut dans le dessin) : elle marche de long en large, la
 * tête dans le sens de la marche, fait demi-tour, puis de temps en temps ouvre ses élytres et
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
    // Trois niveaux : déplacement, orientation, dandinement — pour ne pas mélanger les rotations.
    const walker = "[data-walk]";
    const heading = "[data-heading]";
    const wobbler = "[data-wobble]";
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

    const timeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 1.2,
      delay: 0.5,
    });
    const face = (dx: number, position: string) =>
      timeline.to(
        heading,
        { rotation: headingAngle(dx), duration: 0.4, ease: "power1.inOut" },
        position,
      );
    const walkTo = (xPercent: number, dx: number) => {
      face(dx, "+=0.2");
      timeline
        .to(walker, { xPercent, duration: 2.4, ease: "none" }, "+=0.1")
        .fromTo(
          wobbler,
          { rotation: -4 },
          {
            rotation: 4,
            duration: 0.3,
            ease: "sine.inOut",
            repeat: 7,
            yoyo: true,
          },
          "<",
        )
        .set(wobbler, { rotation: 0 });
    };

    gsap.set(heading, { rotation: headingAngle(1) });
    walkTo(STRIDE, 1);
    walkTo(0, -1); // demi-tour
    walkTo(STRIDE, 1);
    // Envol : elle se tourne vers son point de départ, ouvre ses élytres, vole en arc, se pose.
    face(-1, "+=0.3");
    timeline
      .to(
        left,
        {
          rotation: -35,
          svgOrigin: ELYTRA_PIVOT,
          duration: 0.2,
          ease: "back.out(2)",
        },
        "+=0.2",
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
      .to(walker, { yPercent: -70, duration: 0.45, ease: "power2.out" })
      .to(walker, { xPercent: 0, duration: 0.7, ease: "sine.inOut" })
      .to(walker, { yPercent: 0, duration: 0.45, ease: "power2.in" })
      .to([left, right], {
        rotation: 0,
        svgOrigin: ELYTRA_PIVOT,
        duration: 0.25,
        ease: "power2.out",
      });
    // Prête à repartir vers la droite pour le tour suivant.
    face(1, "+=0.3");
  });

  return (
    <div ref={ref} className={className}>
      <div data-walk>
        <div data-heading>
          <div data-wobble>
            <Illustration
              name="coccinelle"
              title={title}
              className="block h-auto w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
