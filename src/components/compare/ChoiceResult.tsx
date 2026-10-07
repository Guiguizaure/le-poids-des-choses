"use client";

import { useRef, useState, type CSSProperties } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";
import { Bee } from "@/components/scene/Bee";
import { Bird } from "@/components/scene/Bird";
import { Butterfly } from "@/components/scene/Butterfly";
import { Flower } from "@/components/scene/Flower";
import { Hedgehog } from "@/components/scene/Hedgehog";
import { Ladybug } from "@/components/scene/Ladybug";
import { Scale } from "@/components/scene/Scale";
import { Snail } from "@/components/scene/Snail";
import { Tree } from "@/components/scene/Tree";
import { IconLink, PrimaryLink, TextButton } from "@/components/ui/buttons";
import { Logo } from "@/components/ui/Logo";
import { formatMass } from "@/lib/calc";
import type { ComparisonEntry } from "@/lib/data/types";
import {
  illustrationFor,
  revealForEntry,
  type AnimalKind,
  type Reveal,
} from "@/lib/garden/model";
import { arrivalExclamation, revealTitle } from "@/lib/garden/text";
import { VITRINE, vitrineFit } from "@/lib/garden/vitrine";
import { seasonFor, type Season } from "@/lib/garden/seasons";
import { plantLook } from "@/lib/garden/species";
import { entryTitle } from "@/lib/journal/display";
import { useJournal } from "@/lib/journal/useJournal";
import { useFocusTitle } from "./useFocusTitle";
import { DataCredit } from "@/components/ui/DataCredit";
import { SpeciesUnlocked } from "@/components/garden/SpeciesUnlocked";
import { format } from "@/lib/i18n";
import { COMPARE } from "@/lib/i18n/messages/compare";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const FLYERS: readonly AnimalKind[] = ["butterfly", "bee"];

function percent(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

function VitrineAnimal({ kind }: { kind: AnimalKind }) {
  const common = { className: "w-full" };
  switch (kind) {
    case "butterfly":
      return <Butterfly {...common} />;
    case "bee":
      return <Bee {...common} />;
    case "ladybug":
      return <Ladybug {...common} />;
    case "snail":
      return <Snail {...common} />;
    case "hedgehog":
      return <Hedgehog {...common} />;
    case "bird":
      return <Bird {...common} />;
  }
}

/** La plante exacte que ce choix fait pousser (ou que l'arrosage fait avancer), puis l'animal. */
export function Vitrine({
  reveal,
  landed,
  animalIn,
  season,
}: {
  reveal: Pick<Reveal, "plant" | "animals">;
  landed: boolean;
  animalIn: boolean;
  /** Saison du choix : feuillage et épanouissement comme dans le jardin. */
  season: Season | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { plant } = reveal;
  const tree = plant.kind.type === "tree";
  const look = plantLook(plant, season);
  // La plante occupe la hauteur de la vitrine quel que soit son stade (une pousse est agrandie).
  const fit = vitrineFit(illustrationFor(plant.kind, plant.level));
  const plantStyle: CSSProperties = {
    left: percent(fit.left, VITRINE.width),
    top: percent(fit.top, VITRINE.height),
    width: percent(fit.width, VITRINE.width),
  };
  const animal = reveal.animals[0];
  const flying = animal ? FLYERS.includes(animal) : false;
  const animalStyle: CSSProperties = flying
    ? { left: "70%", top: "4%", width: "17%" }
    : {
        left: "70%",
        top: animal === "ladybug" ? "60%" : "50%",
        width: animal === "ladybug" ? "11%" : "17%",
      };

  const reduceRef = useMotion(ref, () => {});
  useGSAP(
    () => {
      const element = ref.current?.querySelector("[data-animal]");
      if (!animalIn || !element || reduceRef.current) return;
      // Il entre par le bord droit de la vitrine, en volant ou en marchant.
      gsap.fromTo(
        element,
        { xPercent: 260, yPercent: flying ? -40 : 0, opacity: 0 },
        {
          xPercent: 0,
          yPercent: 0,
          opacity: 1,
          duration: flying ? 1.1 : 1.4,
          ease: "power2.out",
        },
      );
    },
    { scope: ref, dependencies: [animalIn] },
  );

  return (
    <div
      ref={ref}
      className="relative aspect-[300/190] w-full max-w-[300px] overflow-hidden"
      aria-hidden
    >
      <svg
        viewBox="0 0 300 190"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <path
          d="M6 186 C 6 160, 60 128, 150 128 C 240 128, 294 160, 294 186 Z"
          fill="var(--color-pomme)"
        />
      </svg>
      {landed ? (
        <div className="absolute" style={plantStyle}>
          {tree ? (
            <Tree
              variant={plant.kind.variant}
              stage={plant.stage as "pousse" | "jeune" | "grand"}
              className="w-full"
              popIn
              sparkle={false}
              strokeScale={fit.strokeScale}
              paint={look.paint}
              bloom={look.bloom}
            />
          ) : (
            <Flower
              variant={plant.kind.variant}
              stage={plant.stage as "pousse" | "fleurie"}
              className="w-full"
              popIn
              sparkle={false}
              strokeScale={fit.strokeScale}
              paint={look.paint}
              bloom={look.bloom}
            />
          )}
        </div>
      ) : null}
      {animal && animalIn ? (
        <div data-animal className="absolute" style={animalStyle}>
          <VitrineAnimal kind={animal} />
        </div>
      ) : null}
    </div>
  );
}

/**
 * Après un choix (maquettes 05a v2 et 05b v2) : une carte se pose comme un papier. Choix léger :
 * la plante exacte que ce choix fera pousser (sans éclat : il est réservé au jardin, quand la
 * plante pousse à sa place), l'animal éventuel, « Aller la planter ».
 * Choix plus lourd : la balance oscille puis se stabilise, « C’est noté ».
 */
export function ChoiceResult({
  entry,
  onCompareAgain,
}: {
  entry: ComparisonEntry;
  onCompareAgain: () => void;
}) {
  const journal = useJournal();
  const locale = useLocale();
  const t = COMPARE[locale].result;
  const cardRef = useRef<HTMLElement>(null);
  const titleRef = useFocusTitle<HTMLHeadingElement>(true);
  const [landed, setLanded] = useState(false);
  const [animalIn, setAnimalIn] = useState(false);
  const light = entry.avoidedKg > 0;
  const reveal = light
    ? revealForEntry(journal.entries, entry.id, new Date(entry.date))
    : null;
  const arriving = reveal?.animals[0];

  const reduceRef = useMotion(cardRef, () => {});
  useGSAP(
    () => {
      const card = cardRef.current;
      if (!card) return;
      const settle = () => {
        setLanded(true);
        // L'animal arrive une fois la plante sortie de terre.
        gsap.delayedCall(reduceRef.current ? 0 : 0.9, () => setAnimalIn(true));
      };
      if (reduceRef.current) {
        gsap.delayedCall(0, settle);
        return;
      }
      // Un papier qu'on pose : il descend en tournant un peu, puis se stabilise.
      gsap.fromTo(
        card,
        { y: -56, rotation: -5, opacity: 0 },
        {
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.5)",
          onComplete: settle,
        },
      );
    },
    { scope: cardRef },
  );

  const title = entryTitle(entry, locale);
  const heading = light
    ? reveal
      ? revealTitle(reveal, locale)
      : t.full
    : t.noted;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 pt-[22px] pb-10">
      <div className="flex items-center justify-between pb-2">
        <Logo />
        <IconLink href="/" label={COMPARE[locale].close} icon="fermer" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center py-6">
        <section
          ref={cardRef}
          aria-labelledby="resultat-titre"
          className="bg-blanc flex w-full max-w-[350px] flex-col items-center gap-3.5 rounded-[28px] px-[22px] py-6 text-center shadow-[0_10px_30px_rgba(31,26,23,0.12)]"
        >
          <p
            className={`text-corps-s text-encre rounded-full px-3 py-1.5 leading-[1.3] font-semibold ${
              light ? "bg-pomme-douce" : "bg-creme"
            }`}
          >
            {light
              ? format(t.difference, {
                  mass: formatMass(entry.avoidedKg, locale),
                })
              : t.notedPill}
          </p>

          {reveal ? (
            <Vitrine
              reveal={reveal}
              landed={landed}
              animalIn={animalIn}
              season={seasonFor(new Date(entry.date))}
            />
          ) : !light ? (
            <div className="w-[200px] max-w-full py-2" aria-hidden>
              {/* La balance oscille puis se stabilise une fois la carte posée. */}
              <Scale tilt={landed ? 0.3 : 0} className="w-full" />
            </div>
          ) : null}

          <p
            role="status"
            aria-live="polite"
            className="text-corps-s text-encre min-h-[1.3em] leading-[1.3] font-semibold"
          >
            {arriving && animalIn ? arrivalExclamation(arriving, locale) : ""}
          </p>
          <h1
            id="resultat-titre"
            ref={titleRef}
            tabIndex={-1}
            className="font-titre text-titre-l text-encre -mt-2 leading-[1.1] outline-none"
          >
            {heading}
          </h1>
          <p className="text-corps-m text-encre leading-[1.4]">
            {format(light ? t.lightText : t.heavyText, { title })}
          </p>
          <SpeciesUnlocked
            entries={journal.entries}
            entryIds={[entry.id]}
            className="w-full"
          />
          {light ? (
            <PrimaryLink
              href={`/jardin?nouveau=${encodeURIComponent(entry.id)}`}
            >
              {t.plant}
            </PrimaryLink>
          ) : (
            <PrimaryLink href="/jardin">{t.seeGarden}</PrimaryLink>
          )}
          <TextButton onClick={onCompareAgain}>{t.again}</TextButton>
        </section>
        <DataCredit independent className="mt-4 text-center" />
      </div>
    </main>
  );
}
