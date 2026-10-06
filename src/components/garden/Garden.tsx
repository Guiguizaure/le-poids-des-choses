"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { Landscape } from "@/components/scene/Landscape";
import { playGust, useAutoGusts } from "@/components/motion/gust";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { Bee } from "@/components/scene/Bee";
import { Bird } from "@/components/scene/Bird";
import { Butterfly } from "@/components/scene/Butterfly";
import { Flower } from "@/components/scene/Flower";
import { Hedgehog } from "@/components/scene/Hedgehog";
import { Ladybug } from "@/components/scene/Ladybug";
import { Snail } from "@/components/scene/Snail";
import { Tree } from "@/components/scene/Tree";
import { Wind } from "@/components/scene/Wind";
import { SeasonFall, SeasonGround } from "@/components/scene/SeasonLayers";
import { Visitor } from "@/components/scene/Visitor";
import { isNightAt, STARS_OPACITY } from "@/lib/garden/daytime";
import { NO_FLIGHT_SKIES } from "@/lib/garden/fauna";
import {
  liveScene,
  type LiveAnimal,
  type LiveVisitor,
} from "@/lib/garden/live";
import type { JournalEntry } from "@/lib/data/types";
import {
  animalsArrivedWith,
  buildGarden,
  waterRevealForEntry,
  type Box,
  type GardenPlant,
} from "@/lib/garden/model";
import { SCENE } from "@/lib/garden/scene";
import { seasonAt, type Season } from "@/lib/garden/seasons";
import { DEFAULT_SKY, skyStyle, type SkyId } from "@/lib/garden/skies";
import { plantLook } from "@/lib/garden/species";
import {
  arrivalMessage,
  gardenDescription,
  wateringMessage,
} from "@/lib/garden/text";
import { FlightPath, FlyButton, useAutoFlights } from "./BirdFlight";

type GardenProps = {
  entries: readonly JournalEntry[];
  /** Horodatage courant (ms), pour l'endormissement ; 0 au rendu serveur. */
  now: number;
  /** Entrée qui vient d'être ajoutée : sa plante pousse, une rafale passe, un animal arrive. */
  highlightId?: string | null;
  /**
   * Choix arrivés d'un coup pendant la visite (synchro du compte, import) : leurs plantes
   * apparaissent ensemble en fondu, sans éclat, rafale ni message par plante.
   */
  arriving?: readonly string[];
  /** Ciel du jardin (débloqué par les choix légers ; voir src/lib/garden/skies.ts). */
  sky?: SkyId;
  /** Saison imposée (labo) ; par défaut, celle de `now` (aucune au rendu serveur). */
  season?: Season | null;
  /** Nuit imposée (labo) ; par défaut, de 21 h à 6 h à l'heure de l'appareil. */
  night?: boolean;
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
  season,
}: {
  plant: GardenPlant;
  still: boolean;
  popIn: boolean;
  season: Season | null;
}) {
  const look = plantLook(plant, season);
  const common = {
    className: "w-full",
    still,
    popIn,
    paint: look.paint,
    bloom: look.bloom,
  };
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

function Animal({
  animal,
  flying,
  onLanded,
}: {
  animal: LiveAnimal;
  flying: boolean;
  onLanded: () => void;
}) {
  switch (animal.kind) {
    case "butterfly":
      return <Butterfly className="w-full" />;
    case "ladybug":
      return <Ladybug className="w-full" />;
    case "bird":
      return (
        <FlightPath flying={flying} onLanded={onLanded}>
          <Bird asleep={animal.asleep} flying={flying} className="w-full" />
        </FlightPath>
      );
    case "snail":
      return <Snail asleep={animal.asleep} className="w-full" />;
    case "bee":
      return <Bee className="w-full" />;
    case "hedgehog":
      return <Hedgehog asleep={animal.asleep} className="w-full" />;
  }
}

/** Un animal qui vient de s'installer entre par le bord droit de la scène. */
function Entering({
  box,
  kind,
  children,
}: {
  box: Box;
  kind: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceRef = useMotion(ref, () => {});
  useGSAP(
    () => {
      if (reduceRef.current || !ref.current) return;
      // Assez loin pour partir hors de la scène, à droite.
      const offscreen = ((SCENE.width - box.x) / box.width) * 100 + 30;
      gsap.fromTo(
        ref.current,
        { xPercent: offscreen },
        { xPercent: 0, duration: 1.6, ease: "power2.out", delay: 0.3 },
      );
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="absolute" style={place(box)} data-animal={kind}>
      {children}
    </div>
  );
}

const NONE: readonly string[] = [];

/** Un visiteur à sa place (cadre en unités de scène). */
function VisitorAt({
  visitor,
  still,
}: {
  visitor: LiveVisitor;
  still: boolean;
}) {
  return (
    <div
      className="absolute"
      style={place(visitor.box)}
      data-visitor={visitor.kind}
      data-asleep={visitor.asleep ? "" : undefined}
    >
      <Visitor visitor={visitor} still={still} />
    </div>
  );
}

/** Arrivée groupée : toutes les plantes en moins d'1,5 s, quel que soit leur nombre. */
export const ARRIVAL = {
  duration: 0.6,
  spread: 0.9,
  maxStagger: 0.08,
} as const;

/** Délai avant que le nouveau choix apparaisse : la scène s'affiche d'abord sans lui. */
const REVEAL_DELAY_MS = 700;

/**
 * Le jardin : scene-paysage, une plante par choix léger, les animaux installés. Avec
 * `highlightId` (choix qu'on vient de faire) : la scène s'affiche d'abord sans ce choix, puis sa
 * plante pousse à sa place (éclat), une rafale passe et l'animal éventuel entre par le bord,
 * avec le message d'arrivée. Assoupi : brume, animaux endormis ou partis, plus de vent.
 * L'oiseau s'envole de temps en temps, ou quand on le touche (bouton posé sur lui).
 */
export function Garden({
  entries,
  now,
  highlightId = null,
  arriving = NONE,
  sky = DEFAULT_SKY,
  season: forcedSeason,
  night: forcedNight,
  className = "",
}: GardenProps) {
  const season = forcedSeason === undefined ? seasonAt(now) : forcedSeason;
  const night = forcedNight ?? isNightAt(now);
  const sceneRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);
  // Choix à révéler : retenu une fois (l'URL peut ensuite perdre son paramètre), puis masqué
  // le temps que la scène s'affiche.
  const [revealId, setRevealId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  if (highlightId && highlightId !== revealId) {
    setRevealId(highlightId);
    setPending(true);
  }

  useEffect(() => {
    if (!pending) return;
    const timer = window.setTimeout(() => setPending(false), REVEAL_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [pending]);

  const visibleEntries = useMemo(
    () =>
      pending && revealId
        ? entries.filter((entry) => entry.id !== revealId)
        : entries,
    [entries, pending, revealId],
  );
  const garden = useMemo(
    () => buildGarden(visibleEntries, new Date(now)),
    [visibleEntries, now],
  );
  // Le jardin vivant : animaux présents selon la saison et l'heure, visiteurs, ciel de nuit.
  const live = useMemo(
    () => liveScene(garden, { season, night }, sky, new Date(now)),
    [garden, season, night, sky, now],
  );
  const revealed = revealId && !pending ? revealId : null;
  const arrived = useMemo(
    () => (revealed ? animalsArrivedWith(entries, revealed) : []),
    [entries, revealed],
  );
  // Habitude qui vient d'être notée : le jardin est arrosé (des plantes avancent, peut-être).
  const watered = useMemo(
    () =>
      revealed ? waterRevealForEntry(entries, revealed, new Date(now)) : null,
    [entries, revealed, now],
  );
  const message = watered
    ? wateringMessage(watered)
    : arrived
        .map((kind) =>
          arrivalMessage(
            kind,
            live.away.find((away) => away.kind === kind)?.why ?? null,
          ),
        )
        .join(". ");
  const awake = !garden.asleep && garden.plants.length > 0;

  useAutoGusts(awake, sceneRef);

  // Envol de l'oiseau (V1.1) : de temps en temps, ou quand on le touche. Jamais quand le jardin
  // dort ni en mouvement réduit : il reste posé.
  const reduced = useReducedMotion();
  const canFly =
    !reduced &&
    !garden.asleep &&
    !NO_FLIGHT_SKIES.includes(live.sky) &&
    live.animals.some((animal) => animal.kind === "bird" && !animal.asleep);
  const [flying, setFlying] = useState(false);
  if (flying && !canFly) setFlying(false);
  const startFlight = useCallback(() => setFlying(true), []);
  const land = useCallback(() => setFlying(false), []);
  useAutoFlights(canFly && !flying, startFlight);

  const gusty = !watered || watered.moved.length > 0;
  useEffect(() => {
    if (!revealed || garden.asleep || !gusty) return;
    // La rafale passe une fois la nouvelle plante sortie de terre.
    const timer = window.setTimeout(() => playGust(sceneRef.current), 700);
    return () => window.clearTimeout(timer);
  }, [revealed, garden.asleep, gusty]);

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
            delay: 1.4,
          },
        )
        .to(element, { autoAlpha: 0, duration: 0.4 }, "+=5");
    },
    { dependencies: [message, revealed] },
  );

  // Arrivée groupée (synchro) : un fondu commun, depuis un rien plus bas, en léger décalé.
  useGSAP(
    () => {
      const scene = sceneRef.current;
      if (!scene || arriving.length === 0) return;
      const ids = new Set(arriving);
      const targets = Array.from(
        scene.querySelectorAll<HTMLElement>("[data-plant]"),
      ).filter(
        (element) =>
          ids.has(element.dataset.plant ?? "") &&
          element.dataset.plant !== revealed,
      );
      if (targets.length === 0) return;
      if (reduceRef.current) {
        gsap.fromTo(targets, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 });
        return;
      }
      gsap.fromTo(
        targets,
        { autoAlpha: 0, yPercent: 8 },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: ARRIVAL.duration,
          ease: "power1.out",
          stagger: Math.min(
            ARRIVAL.maxStagger,
            ARRIVAL.spread / targets.length,
          ),
        },
      );
    },
    { dependencies: [arriving] },
  );

  return (
    <div className={`relative ${className}`}>
      <div
        ref={sceneRef}
        role="img"
        aria-label={gardenDescription(garden, season, {
          visitors: live.visitors.length,
          night,
        })}
        className="relative aspect-[390/300] w-full overflow-hidden"
        data-sky={live.sky}
        data-season={season ?? undefined}
        data-night={night ? "" : undefined}
        style={skyStyle(live.sky, season) as CSSProperties}
      >
        <Landscape className="absolute inset-0" still={garden.asleep} />
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-[2000ms] motion-reduce:transition-none"
          style={{ opacity: live.stars ? STARS_OPACITY : 0 }}
          data-stars
          aria-hidden
        >
          <Illustration name="etoiles" className="block h-auto w-full" />
        </div>
        <SeasonGround season={season} />
        {live.visitors
          .filter((visitor) => visitor.rule.place === "plant")
          .map((visitor) => (
            <VisitorAt
              key={visitor.kind}
              visitor={visitor}
              still={garden.asleep}
            />
          ))}
        <Wind className="absolute inset-x-0 top-[30%]" />
        {garden.plants.map((plant) => (
          <div
            key={plant.id}
            className="absolute"
            style={place(plant.box)}
            data-plant={plant.id}
            data-stage-level={plant.level}
            data-bloom-level={plant.bloom}
          >
            <Plant
              plant={plant}
              still={garden.asleep}
              popIn={plant.id === revealed}
              season={season}
            />
          </div>
        ))}
        {live.visitors
          .filter((visitor) => visitor.rule.place !== "plant")
          .map((visitor) => (
            <VisitorAt
              key={visitor.kind}
              visitor={visitor}
              still={garden.asleep}
            />
          ))}
        {live.animals.map((animal) =>
          arrived.includes(animal.kind) ? (
            <Entering key={animal.kind} box={animal.box} kind={animal.kind}>
              <Animal animal={animal} flying={flying} onLanded={land} />
            </Entering>
          ) : (
            <div
              key={animal.kind}
              className="absolute"
              style={place(animal.box)}
              data-animal={animal.kind}
              data-asleep={animal.asleep ? "" : undefined}
            >
              <Animal animal={animal} flying={flying} onLanded={land} />
            </div>
          ),
        )}
        <SeasonFall season={season} still={garden.asleep} />
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
      {canFly ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 aspect-[390/300]">
          <FlyButton flying={flying} onFly={startFlight} />
        </div>
      ) : null}
      {/* Annonce pour les lecteurs d'écran (toujours présente) ; la bulle visible est décorative. */}
      <p role="status" aria-live="polite" className="sr-only">
        {message}
      </p>
    </div>
  );
}
