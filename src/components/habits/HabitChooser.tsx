"use client";

import Link from "next/link";
import { useState } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { IconLink, PrimaryButton, TextLink } from "@/components/ui/buttons";
import { useFocusTitle } from "@/components/compare/useFocusTitle";
import { orderedHabits } from "@/lib/habits";
import { useDeclaredHabits } from "@/lib/habits/useDeclaredHabits";
import { pictoFor } from "@/lib/journal/display";

type HabitChooserProps = {
  /** Habitude choisie (?habitude=velo), ou null. */
  selected: string | null;
  onSelect: (gesture: string | null) => void;
  onConfirm: (gesture: string) => void;
  focusTitle: boolean;
};

/**
 * « Noter une habitude » (/comparer?habitude) : un geste tenu, noté sans comparaison. Les
 * habitudes déclarées (« Mes habitudes ») passent en premier. Aucun kg : il arrose le jardin.
 */
export function HabitChooser({
  selected: initial,
  onSelect,
  onConfirm,
  focusTitle,
}: HabitChooserProps) {
  const [declared] = useDeclaredHabits();
  // Choix gardé ici (l'URL suit, sans entrée d'historique), comme pour les gestes.
  const [selected, setSelected] = useState(initial);
  const select = (gesture: string | null) => {
    setSelected(gesture);
    onSelect(gesture);
  };
  const titleRef = useFocusTitle<HTMLHeadingElement>(focusTitle);
  const mine = new Set(declared);

  return (
    <main className="animate-enter mx-auto flex min-h-screen w-full max-w-[430px] flex-col motion-reduce:animate-none">
      <div className="flex items-center justify-between px-5 pt-[22px] pb-2">
        <IconLink
          href="/comparer"
          label="Retour au choix des gestes"
          icon="retour"
        />
        <IconLink
          href="/"
          label="Fermer et revenir à l’accueil"
          icon="fermer"
        />
      </div>

      <div className="flex flex-col gap-[18px] px-5 pt-3 pb-8">
        <h1
          ref={titleRef}
          tabIndex={-1}
          className="font-titre text-titre-l text-encre leading-[1.1] outline-none"
        >
          Noter une habitude
        </h1>
        <p
          id="habitudes-aide"
          className="text-corps-s text-texte-attenue leading-[1.4]"
        >
          Ce que tu fais déjà n’a pas à être comparé à ce que tu ne ferais
          jamais. Une habitude tenue ne compte aucun kg : elle arrose ton
          jardin.{" "}
          <Link
            href="/methode#habitudes"
            className="text-encre focus-visible:outline-outremer font-semibold underline focus-visible:outline-2"
          >
            Pourquoi ?
          </Link>
        </p>

        <div
          className="grid grid-cols-2 gap-3"
          role="group"
          aria-label="Habitudes"
        >
          {orderedHabits(declared).map((habit) => {
            const pressed = selected === habit.gesture;
            return (
              <button
                key={habit.gesture}
                type="button"
                aria-pressed={pressed}
                onClick={() => select(pressed ? null : habit.gesture)}
                className={`press bg-blanc focus-visible:outline-outremer flex flex-col items-start gap-2.5 rounded-[18px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  pressed
                    ? "border-pomme animate-select border-2 p-[15px] motion-reduce:animate-none"
                    : "border-encre border p-4"
                }`}
              >
                <Illustration
                  name={pictoFor(habit.gesture)}
                  className="size-11"
                />
                <span className="flex flex-col gap-0.5">
                  <span className="text-corps-m text-encre leading-[1.3] font-semibold">
                    {habit.label}
                  </span>
                  {mine.has(habit.gesture) ? (
                    <span className="text-legende text-texte-attenue">
                      Mon habitude
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>

        <PrimaryButton
          disabled={!selected}
          onClick={() => selected && onConfirm(selected)}
        >
          Je l’ai fait aujourd’hui
        </PrimaryButton>
        <p className="text-legende text-texte-attenue text-center">
          {selected
            ? "Retouche l’habitude pour la retirer."
            : "Touche l’habitude que tu as tenue aujourd’hui."}
        </p>
        <TextLink href="/jardin#habitudes">Choisir mes habitudes</TextLink>
      </div>
    </main>
  );
}
