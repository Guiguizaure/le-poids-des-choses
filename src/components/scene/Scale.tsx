"use client";

import { useRef } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";
import { BALANCE, beamPosition, tiltToAngle } from "@/lib/geometry/balance";
import { getSpec, type IllustrationName } from "@/lib/illustrations/specs";

type ScaleProps = {
  /** -1 : le plateau gauche descend ; 1 : le droit descend ; 0 : équilibre. */
  tilt: number;
  title?: string;
  /** Taille : une largeur suffit, la hauteur suit le cadre 280×170. */
  className?: string;
  /** Pictos posés sur les plateaux (ils suivent les plateaux). */
  leftItem?: IllustrationName;
  rightItem?: IllustrationName;
};

const SVG_ORIGIN = `${BALANCE.pivot.x} ${BALANCE.pivot.y}`;
const FRAME = getSpec("balance");
/** Picto posé dans la coupelle : 32 unités, centré au-dessus du bord (y = 94). */
const ITEM_SIZE = 32;
const ITEM_CENTER_Y = 80;

function itemStyle(centerX: number) {
  return {
    left: `${((centerX - ITEM_SIZE / 2) / FRAME.width) * 100}%`,
    top: `${((ITEM_CENTER_Y - ITEM_SIZE / 2) / FRAME.height) * 100}%`,
    width: `${(ITEM_SIZE / FRAME.width) * 100}%`,
  };
}

/**
 * Balance : le fléau tourne autour du pivot (±12°), les plateaux (et leurs pictos) suivent ses
 * extrémités (beamPosition). L'arrivée se fait avec un petit rebond amorti.
 */
export function Scale({
  tilt,
  title,
  className = "w-[280px]",
  leftItem,
  rightItem,
}: ScaleProps) {
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
    // Les pictos mesurent ITEM_SIZE unités : un déplacement en unités devient un pourcentage.
    const toPercent = (offset: { x: number; y: number }) => ({
      xPercent: (offset.x / ITEM_SIZE) * 100,
      yPercent: (offset.y / ITEM_SIZE) * 100,
    });
    const left = root.querySelector("[data-item='left']");
    const right = root.querySelector("[data-item='right']");
    if (left) gsap.set(left, toPercent(position.leftOffset));
    if (right) gsap.set(right, toPercent(position.rightOffset));
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
    <div ref={ref} className={`relative ${className}`}>
      <Illustration
        name="balance"
        title={title}
        className="block h-auto w-full overflow-visible"
      />
      {leftItem ? (
        <div data-item="left" className="absolute" style={itemStyle(40)}>
          <Illustration name={leftItem} className="block h-auto w-full" />
        </div>
      ) : null}
      {rightItem ? (
        <div data-item="right" className="absolute" style={itemStyle(240)}>
          <Illustration name={rightItem} className="block h-auto w-full" />
        </div>
      ) : null}
    </div>
  );
}
