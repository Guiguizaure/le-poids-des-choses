"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";
import { Illustration } from "@/components/illustrations/Illustration";
import { IconLink, PrimaryLink, TextButton } from "@/components/ui/buttons";
import { Logo } from "@/components/ui/Logo";
import type { HabitEntry } from "@/lib/data/types";
import { waterRevealForEntry } from "@/lib/garden/model";
import { seasonFor } from "@/lib/garden/seasons";
import { wateringMessage, wateringTitle } from "@/lib/garden/text";
import { habitLabel } from "@/lib/habits";
import { pictoFor } from "@/lib/journal/display";
import { useJournal } from "@/lib/journal/useJournal";
import { Vitrine } from "./ChoiceResult";
import { SpeciesUnlocked } from "@/components/garden/SpeciesUnlocked";
import { useFocusTitle } from "./useFocusTitle";
import { format } from "@/lib/i18n";
import { COMPARE } from "@/lib/i18n/messages/compare";
import { LocalLink as Link, useLocale } from "@/lib/i18n/LocaleProvider";

/**
 * Après une habitude notée : la carte se pose comme un papier. Si l'arrosage fait avancer une
 * plante, la vitrine la montre à son nouvel état (comme dans le jardin) ; sinon, le picto du
 * geste. Jamais de kg : une habitude ne se compare à rien.
 */
export function HabitResult({
  entry,
  onAgain,
}: {
  entry: HabitEntry;
  onAgain: () => void;
}) {
  const journal = useJournal();
  const locale = useLocale();
  const t = COMPARE[locale].habitResult;
  const cardRef = useRef<HTMLElement>(null);
  const titleRef = useFocusTitle<HTMLHeadingElement>(true);
  const [landed, setLanded] = useState(false);
  const reveal = waterRevealForEntry(
    journal.entries,
    entry.id,
    new Date(entry.date),
  );
  // La plante arrosée en bonus passe d'abord si elle avance.
  const featured =
    reveal?.target && reveal.targetMoved
      ? reveal.target
      : (reveal?.featured ?? null);
  // Rien n'avance encore : l'arrosoir si le jardin est arrosé, sinon le picto de l'habitude.
  const watered = reveal !== null && (reveal.target !== null || reveal.newDay);

  const reduceRef = useMotion(cardRef, () => {});
  useGSAP(
    () => {
      const card = cardRef.current;
      if (!card) return;
      if (reduceRef.current) {
        gsap.delayedCall(0, () => setLanded(true));
        return;
      }
      gsap.fromTo(
        card,
        { y: -56, rotation: -5, opacity: 0 },
        {
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.5)",
          onComplete: () => setLanded(true),
        },
      );
    },
    { scope: cardRef },
  );

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
          <p className="bg-pomme-douce text-corps-s text-encre rounded-full px-3 py-1.5 leading-[1.3] font-semibold">
            {t.pill}
          </p>
          {featured ? (
            <Vitrine
              reveal={{ plant: featured, animals: [] }}
              landed={landed}
              animalIn={false}
              season={seasonFor(new Date(entry.date))}
            />
          ) : (
            <div
              className="bg-creme flex size-28 items-center justify-center rounded-full"
              aria-hidden
            >
              <Illustration
                name={watered ? "picto-arrosoir" : pictoFor(entry.gesture)}
                className="size-16"
              />
            </div>
          )}
          <h1
            id="resultat-titre"
            ref={titleRef}
            tabIndex={-1}
            className="font-titre text-titre-l text-encre leading-[1.1] outline-none"
          >
            {reveal ? wateringTitle(reveal, locale) : t.noted}
          </h1>
          <p className="text-corps-m text-encre leading-[1.4]">
            {format(t.text, { label: habitLabel(entry.gesture, locale) })}
          </p>
          {reveal ? (
            <p
              role="status"
              className="text-corps-s text-texte-attenue leading-[1.4]"
            >
              {wateringMessage(reveal, locale)}
            </p>
          ) : null}
          <SpeciesUnlocked
            entries={journal.entries}
            entryIds={[entry.id]}
            className="w-full"
          />
          <PrimaryLink href={`/jardin?arrose=${encodeURIComponent(entry.id)}`}>
            {t.seeGarden}
          </PrimaryLink>
          <TextButton onClick={onAgain}>{t.again}</TextButton>
          <Link
            href="/methode#habitudes"
            className="text-legende text-texte-attenue focus-visible:outline-outremer underline focus-visible:outline-2"
          >
            {t.why}
          </Link>
        </section>
      </div>
    </main>
  );
}
