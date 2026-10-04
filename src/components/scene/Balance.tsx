"use client";

import { useRef } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";
import { BALANCE, beamPosition, tiltToAngle } from "@/lib/geometry/balance";

type BalanceProps = {
  /** -1 : le plateau gauche descend ; 1 : le droit descend ; 0 : équilibre. */
  tilt: number;
  title?: string;
  /** Taille : une largeur suffit, la hauteur suit le cadre 280×170. */
  className?: string;
};

const SVG_ORIGIN = `${BALANCE.pivot.x} ${BALANCE.pivot.y}`;

/**
 * Balance : le fléau tourne autour du pivot (±12°), les plateaux suivent ses extrémités
 * (beamPosition). L'arrivée se fait avec un petit rebond amorti.
 */
export function Balance({
  tilt,
  title,
  className = "w-[280px]",
}: BalanceProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Angle affiché, animé par GSAP ; la géométrie est recalculée à chaque image.
  const displayed = useRef({ angle: 0 });

  const apply = (angle: number) => {
    const root = ref.current;
    if (!root) return;
    const position = beamPosition(angle);
    gsap.set(root.querySelector('[data-part="fleau"]'), {
      rotation: angle,
      svgOrigin: SVG_ORIGIN,
    });
    gsap.set(
      root.querySelector('[data-part="plateau-gauche"]'),
      position.leftOffset,
    );
    gsap.set(
      root.querySelector('[data-part="plateau-droit"]'),
      position.rightOffset,
    );
  };

  const reduceRef = useMotion(ref, () => apply(displayed.current.angle));

  useGSAP(
    () => {
      const target = tiltToAngle(tilt);
      const state = displayed.current;
      gsap.killTweensOf(state);
      if (reduceRef.current) {
        state.angle = target;
        apply(target);
        return;
      }
      gsap.to(state, {
        angle: target,
        duration: 1.2,
        ease: "elastic.out(1, 0.45)",
        onUpdate: () => apply(state.angle),
      });
    },
    { scope: ref, dependencies: [tilt] },
  );

  return (
    <div ref={ref} className={className}>
      <Illustration
        name="balance"
        title={title}
        className="block h-auto w-full overflow-visible"
      />
    </div>
  );
}
