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
import {
  IconLink,
  Logo,
  PrimaryLink,
  TextButton,
} from "@/components/ui/buttons";
import { formatMass } from "@/lib/calc";
import type { JournalEntry } from "@/lib/data/types";
import {
  illustrationFor,
  revealForEntry,
  type AnimalKind,
  type Reveal,
} from "@/lib/garden/model";
import { arrivalExclamation, revealTitle } from "@/lib/garden/text";
import { VITRINE, vitrineFit } from "@/lib/garden/vitrine";
import { entryTitle } from "@/lib/journal/display";
import { useJournal } from "@/lib/journal/useJournal";
import { useFocusTitle } from "./useFocusTitle";

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

/** La plante exacte que ce choix fait pousser, puis l'animal qui arrive. */
function Vitrine({
  reveal,
  landed,
  animalIn,
}: {
  reveal: Reveal;
  landed: boolean;
  animalIn: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { plant } = reveal;
  const tree = plant.kind.type === "tree";
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
              zoom={fit.zoom}
              strokeScale={fit.strokeScale}
            />
          ) : (
            <Flower
              variant={plant.kind.variant}
              stage={plant.stage as "pousse" | "fleurie"}
              className="w-full"
              popIn
              zoom={fit.zoom}
              strokeScale={fit.strokeScale}
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
 * la plante exacte que ce choix fera pousser, l'éclat, l'animal éventuel, « Aller la planter ».
 * Choix plus lourd : la balance oscille puis se stabilise, « C’est noté ».
 */
export function ChoiceResult({
  entry,
  onCompareAgain,
}: {
  entry: JournalEntry;
  onCompareAgain: () => void;
}) {
  const journal = useJournal();
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

  const title = entryTitle(entry);
  const heading = light
    ? reveal
      ? revealTitle(reveal)
      : "Ton jardin est au complet"
    : "C’est noté";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 pt-[22px] pb-10">
      <div className="flex items-center justify-between pb-2">
        <Logo />
        <IconLink
          href="/"
          label="Fermer et revenir à l’accueil"
          icon="fermer"
        />
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
            {light ? `+${formatMass(entry.avoidedKg)} évités` : "Noté"}
          </p>

          {reveal ? (
            <Vitrine reveal={reveal} landed={landed} animalIn={animalIn} />
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
            {arriving && animalIn ? arrivalExclamation(arriving) : ""}
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
            {light
              ? `${title} : c’est noté dans ton carnet.`
              : `${title} : rien n’est retiré à ton jardin. On n’a pas toujours le choix.`}
          </p>
          {light ? (
            <PrimaryLink
              href={`/jardin?nouveau=${encodeURIComponent(entry.id)}`}
            >
              Aller la planter
            </PrimaryLink>
          ) : (
            <PrimaryLink href="/jardin">Voir mon jardin</PrimaryLink>
          )}
          <TextButton onClick={onCompareAgain}>Comparer autre chose</TextButton>
        </section>
      </div>
    </main>
  );
}
