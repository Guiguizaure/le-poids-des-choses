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
 * réapparaissent de l'autre côté, un anneau couleur soleil respire derrière le disque. Immobile en
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

      // Halo : calque « halo-soleil » du dessin, derrière le disque, invisible par défaut.
      const halo = root.querySelector<SVGGraphicsElement>(
        '[data-part="halo-soleil"]',
      );
      if (halo) {
        const box = halo.getBBox();
        gsap.fromTo(
          halo,
          { opacity: SKY.haloOpacity[0], scale: SKY.haloScale[0] },
          {
            opacity: SKY.haloOpacity[1],
            scale: SKY.haloScale[1],
            svgOrigin: `${box.x + box.width / 2} ${box.y + box.height / 2}`,
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
        <Illustration
          name="scene-paysage"
          className="relative block h-auto w-full"
        />
      </div>
    </div>
  );
}
