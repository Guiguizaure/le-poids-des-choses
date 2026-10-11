"use client";

import { Landscape } from "@/components/scene/Landscape";
import { Butterfly } from "@/components/scene/Butterfly";
import { Flower } from "@/components/scene/Flower";
import { Scale } from "@/components/scene/Scale";
import { Tree } from "@/components/scene/Tree";
import { useMiniDuelTilt } from "./MiniDuel";

/**
 * Scène d'accueil : paysage, papillon, plantes et la balance du mini-duel (vélo contre
 * voiture) : à l'équilibre au repos, elle penche avec l'animation du duel après la réponse
 * (`Scale` : rien qu'un fondu court en mouvement réduit).
 */
export function HomeScene({ className = "" }: { className?: string }) {
  const tilt = useMiniDuelTilt();

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
          tilt={tilt}
          leftItem="picto-velo"
          rightItem="picto-voiture"
          className="w-full"
        />
      </div>
    </div>
  );
}
