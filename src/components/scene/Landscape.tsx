"use client";

import { useRef } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { gsap } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";
import { cloudDrift, cloudSeconds, SKY } from "@/lib/geometry/sky";
import { getSpec } from "@/lib/illustrations/specs";

const SCENE = getSpec("scene-paysage");
const CLOUDS = '[data-part^="nuage-"]';

/**
 * Le paysage (scene-paysage) vivant : les nuages traversent lentement la scène et
 * réapparaissent de l'autre côté, un halo très doux respire autour du soleil. Immobile en
 * mouvement réduit, ou si `still` (jardin assoupi).
 */
export function Landscape({
  className = "",
  still = false,
}: {
  className?: string;
  still?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);

  useMotion(
    ref,
    (reduce) => {
      const root = ref.current;
      if (reduce || still || !root) return;

      gsap.utils
        .toArray<SVGGraphicsElement>(CLOUDS, root)
        .forEach((cloud, index) => {
          const box = cloud.getBBox();
          const drift = cloudDrift(box.x, box.width, SCENE.width);
          gsap.to(cloud, {
            x: `+=${drift.distance}`,
            duration: cloudSeconds(index),
            ease: "none",
            repeat: -1,
            modifiers: {
              x: gsap.utils.unitize(gsap.utils.wrap(drift.min, drift.max)),
            },
          });
        });

      const sun = root.querySelector<SVGGraphicsElement>(
        '[data-part="soleil"]',
      );
      const halo = haloRef.current;
      if (sun && halo) {
        const box = sun.getBBox();
        const color =
          sun.querySelector("[fill]")?.getAttribute("fill") ??
          "var(--color-tomate)";
        gsap.set(halo, {
          left: `${(box.x / SCENE.width) * 100}%`,
          top: `${(box.y / SCENE.height) * 100}%`,
          width: `${(box.width / SCENE.width) * 100}%`,
          backgroundColor: color,
        });
        gsap.fromTo(
          halo,
          { scale: 1, opacity: 0.1 },
          {
            scale: 1.4,
            opacity: 0.2,
            duration: SKY.sunBreathSeconds / 2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          },
        );
      }
    },
    [still],
  );

  return (
    <div ref={ref} className={`pointer-events-none ${className}`} aria-hidden>
      <div className="relative">
        <div
          ref={haloRef}
          className="absolute aspect-square rounded-full"
          style={{ opacity: 0, transformOrigin: "50% 50%" }}
        />
        <Illustration
          name="scene-paysage"
          className="relative block h-auto w-full"
        />
      </div>
    </div>
  );
}
