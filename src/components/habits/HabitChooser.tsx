"use client";

import { useState } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { IconLink, PrimaryButton, TextLink } from "@/components/ui/buttons";
import { useFocusTitle } from "@/components/compare/useFocusTitle";
import { orderedHabits } from "@/lib/habits";
import { useDeclaredHabits } from "@/lib/habits/useDeclaredHabits";
import { pictoFor } from "@/lib/journal/display";
import { COMPARE } from "@/lib/i18n/messages/compare";
import { HABITS_UI } from "@/lib/i18n/messages/garden";
import { LocalLink as Link, useLocale } from "@/lib/i18n/LocaleProvider";

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
  const locale = useLocale();
  const t = HABITS_UI[locale];
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
        <IconLink href="/comparer" label={t.back} icon="retour" />
        <IconLink href="/" label={COMPARE[locale].close} icon="fermer" />
      </div>

      <div className="flex flex-col gap-[18px] px-5 pt-3 pb-8">
        <h1
          ref={titleRef}
          tabIndex={-1}
          className="font-titre text-titre-l text-encre leading-[1.1] outline-none"
        >
          {t.title}
        </h1>
        <p
          id="habitudes-aide"
          className="text-corps-s text-texte-attenue leading-[1.4]"
        >
          {t.help}{" "}
          <Link
            href="/methode#habitudes"
            className="text-encre focus-visible:outline-outremer font-semibold underline focus-visible:outline-2"
          >
            {t.why}
          </Link>
        </p>

        <div
          className="grid grid-cols-2 gap-3"
          role="group"
          aria-label={t.group}
        >
          {orderedHabits(declared, locale).map((habit) => {
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
                      {t.myHabit}
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
          {t.didIt}
        </PrimaryButton>
        <p className="text-legende text-texte-attenue text-center">
          {selected ? t.hintSelected : t.hintNone}
        </p>
        <TextLink href="/jardin#habitudes">{t.choose}</TextLink>
      </div>
    </main>
  );
}
