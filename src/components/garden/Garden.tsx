"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { Landscape } from "@/components/scene/Landscape";
import { playGust, useAutoGusts } from "@/components/motion/gust";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";
import { Bee } from "@/components/scene/Bee";
import { Bird } from "@/components/scene/Bird";
import { Butterfly } from "@/components/scene/Butterfly";
import { Flower } from "@/components/scene/Flower";
import { Hedgehog } from "@/components/scene/Hedgehog";
import { Ladybug } from "@/components/scene/Ladybug";
import { Snail } from "@/components/scene/Snail";
import { Tree } from "@/components/scene/Tree";
import { Wind } from "@/components/scene/Wind";
import type { JournalEntry } from "@/lib/data/types";
import {
  animalsArrivedWith,
  buildGarden,
  type Box,
  type GardenAnimal,
  type GardenPlant,
} from "@/lib/garden/model";
import { SCENE } from "@/lib/garden/scene";
import { arrivalMessage, gardenDescription } from "@/lib/garden/text";

type GardenProps = {
  entries: readonly JournalEntry[];
  /** Horodatage courant (ms), pour l'endormissement ; 0 au rendu serveur. */
  now: number;
  /** Entrée qui vient d'être ajoutée : sa plante pousse, une rafale passe, un animal arrive. */
  highlightId?: string | null;
  className?: string;
};

/** Position d'un cadre de la scène (unités 390×300) en pourcentages. */
function place(box: Box): CSSProperties {
  return {
    left: `${(box.x / SCENE.width) * 100}%`,
    top: `${(box.y / SCENE.height) * 100}%`,
    width: `${(box.width / SCENE.width) * 100}%`,
  };
}

function Plant({
  plant,
  still,
  popIn,
}: {
  plant: GardenPlant;
  still: boolean;
  popIn: boolean;
}) {
  const common = { className: "w-full", still, popIn };
  return plant.kind.type === "tree" ? (
    <Tree
      variant={plant.kind.variant}
      stage={plant.stage as "pousse" | "jeune" | "grand"}
      {...common}
    />
  ) : (
    <Flower
      variant={plant.kind.variant}
      stage={plant.stage as "pousse" | "fleurie"}
      {...common}
    />
  );
}

function Animal({ animal }: { animal: GardenAnimal }) {
  switch (animal.kind) {
    case "butterfly":
      return <Butterfly className="w-full" />;
    case "ladybug":
      return <Ladybug className="w-full" />;
    case "bird":
      return <Bird asleep={animal.asleep} className="w-full" />;
    case "snail":
      return <Snail asleep={animal.asleep} className="w-full" />;
    case "bee":
      return <Bee className="w-full" />;
    case "hedgehog":
      return <Hedgehog asleep={animal.asleep} className="w-full" />;
  }
}

/**
 * Le jardin : scene-paysage, une plante par choix léger, les animaux installés. Quand une
 * entrée arrive, sa plante pousse (avec l'éclat), une rafale passe et un éventuel nouvel animal
 * est annoncé. Assoupi : brume, animaux endormis ou partis, plus de vent.
 */
export function Garden({
  entries,
  now,
  highlightId = null,
  className = "",
}: GardenProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const garden = useMemo(
    () => buildGarden(entries, new Date(now)),
    [entries, now],
  );
  const message = useMemo(
    () =>
      highlightId
        ? animalsArrivedWith(entries, highlightId)
            .map(arrivalMessage)
            .join(". ")
        : "",
    [entries, highlightId],
  );
  const awake = !garden.asleep && garden.plants.length > 0;

  useAutoGusts(awake, sceneRef);

  useEffect(() => {
    if (!highlightId || garden.asleep) return;
    // La rafale passe une fois la nouvelle plante sortie de terre.
    const timer = window.setTimeout(() => playGust(sceneRef.current), 700);
    return () => window.clearTimeout(timer);
  }, [highlightId, garden.asleep]);

  const reduceRef = useMotion(sceneRef, () => {});
  useGSAP(
    () => {
      const element = messageRef.current;
      if (!element || !message) return;
      const reduce = reduceRef.current;
      gsap
        .timeline()
        .fromTo(
          element,
          { autoAlpha: 0, y: reduce ? 0 : 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: reduce ? 0.2 : 0.5,
            ease: "back.out(1.6)",
            delay: 0.9,
          },
        )
        .to(element, { autoAlpha: 0, duration: 0.4 }, "+=5");
    },
    { dependencies: [message, highlightId] },
  );

  return (
    <div className={`relative ${className}`}>
      <div
        ref={sceneRef}
        role="img"
        aria-label={gardenDescription(garden)}
        className="relative aspect-[390/300] w-full overflow-hidden"
      >
        <Landscape className="absolute inset-0" still={garden.asleep} />
        <Wind className="absolute inset-x-0 top-[30%]" />
        {garden.plants.map((plant) => (
          <div key={plant.id} className="absolute" style={place(plant.box)}>
            <Plant
              plant={plant}
              still={garden.asleep}
              popIn={plant.id === highlightId}
            />
          </div>
        ))}
        {garden.animals.map((animal) => (
          <div key={animal.kind} className="absolute" style={place(animal.box)}>
            <Animal animal={animal} />
          </div>
        ))}
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 transition-opacity duration-1000"
          style={{ opacity: garden.asleep ? 1 : 0 }}
        >
          <Illustration name="brume" className="block h-auto w-full" />
        </div>
        <p
          ref={messageRef}
          aria-hidden
          className="bg-encre text-creme text-corps-s absolute bottom-3 left-1/2 w-max max-w-[90%] -translate-x-1/2 rounded-full px-4 py-2 text-center font-semibold"
          style={{ opacity: 0, visibility: "hidden" }}
        >
          {message}
        </p>
      </div>
      {/* Annonce pour les lecteurs d'écran (toujours présente) ; la bulle visible est décorative. */}
      <p role="status" aria-live="polite" className="sr-only">
        {message}
      </p>
    </div>
  );
}
