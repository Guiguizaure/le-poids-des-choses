"use client";

import { useEffect, useState } from "react";
import { Landscape } from "@/components/scene/Landscape";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { Butterfly } from "@/components/scene/Butterfly";
import { Flower } from "@/components/scene/Flower";
import { Scale } from "@/components/scene/Scale";
import { Tree } from "@/components/scene/Tree";

/** La balance hésite puis penche du côté le plus lourd, en boucle. */
const WEIGHING = [0.55, -0.2, 0.35, 0.6, 0.15];
const STATIC_TILT = 0.45;

/** Scène d'accueil : paysage, balance animée (vélo contre voiture), papillon et plantes. */
export function HomeScene({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(
      () => setStep((value) => (value + 1) % WEIGHING.length),
      3200,
    );
    return () => window.clearInterval(timer);
  }, [reduce]);

  return (
    <div
      className={`bg-creme relative aspect-[390/470] w-full overflow-hidden ${className}`}
      aria-hidden
    >
      <Landscape className="absolute bottom-0 left-0 w-full" />
      <div className="absolute top-[47%] left-[60%] w-[11%]">
        <Butterfly className="w-full" />
      </div>
      <div className="absolute bottom-[4%] left-[2%] w-[20%]">
        <Tree variant={2} stage="grand" className="w-full" sparkle={false} />
      </div>
      <div className="absolute right-[4%] bottom-[5%] w-[11%]">
        <Flower
          variant={1}
          stage="fleurie"
          className="w-full"
          sparkle={false}
        />
      </div>
      <div className="absolute bottom-[10%] left-1/2 w-[74%] -translate-x-1/2">
        <Scale
          tilt={reduce ? STATIC_TILT : WEIGHING[step]}
          leftItem="picto-velo"
          rightItem="picto-voiture"
          className="w-full"
        />
      </div>
    </div>
  );
}
