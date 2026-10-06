"use client";

import { useId, useState } from "react";
import { habitsIn, orderedHabits } from "@/lib/habits";
import { HABITS_UI } from "@/lib/i18n/messages/garden";
import { LocalLink as Link, useLocale } from "@/lib/i18n/LocaleProvider";
import { useDeclaredHabits } from "@/lib/habits/useDeclaredHabits";

const CHIP =
  "press border-encre bg-blanc text-corps-s text-encre focus-visible:outline-outremer rounded-full border px-3.5 py-2 leading-[1.3] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2";

/**
 * Section « Mes habitudes » de /jardin : arroser le jardin d'un toucher avec une habitude
 * déclarée, et déclarer une fois ce qu'on fait déjà (gardé sur l'appareil seulement).
 * Déclarer ne note rien : seul « J’ai tenu … » ajoute une habitude au carnet.
 */
export function MyHabits({ onWater }: { onWater: (gesture: string) => void }) {
  const [declared, setDeclared] = useDeclaredHabits();
  const locale = useLocale();
  const t = HABITS_UI[locale];
  const [editing, setEditing] = useState(false);
  const panelId = useId();
  const mine = orderedHabits(declared, locale).filter((habit) =>
    declared.includes(habit.gesture),
  );
  const open = editing || mine.length === 0;

  return (
    <section
      id="habitudes"
      aria-labelledby="habitudes-titre"
      className="bg-blanc flex scroll-mt-4 flex-col gap-3 rounded-[20px] p-5"
    >
      <h2
        id="habitudes-titre"
        className="font-titre text-titre-m text-encre leading-[1.1]"
      >
        {t.mine}
      </h2>
      <p className="text-corps-s text-texte-attenue leading-[1.4]">
        {t.mineText}{" "}
        <Link
          href="/methode#habitudes"
          className="text-encre focus-visible:outline-outremer font-semibold underline focus-visible:outline-2"
        >
          {t.how}
        </Link>
      </p>

      {mine.length > 0 ? (
        <ul className="flex flex-wrap gap-2" aria-label={t.oneTap}>
          {mine.map((habit) => (
            <li key={habit.gesture}>
              <button
                type="button"
                className={CHIP}
                onClick={() => onWater(habit.gesture)}
              >
                {t.done(habit.label)}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <Link
        href="/comparer?habitude="
        className="text-corps-s text-encre focus-visible:outline-outremer self-start leading-[1.3] font-semibold underline focus-visible:outline-2"
      >
        {t.another}
      </Link>

      {mine.length > 0 ? (
        <button
          type="button"
          aria-expanded={editing}
          aria-controls={panelId}
          onClick={() => setEditing((value) => !value)}
          className="text-corps-s text-encre focus-visible:outline-outremer self-start leading-[1.3] font-semibold underline focus-visible:outline-2"
        >
          {t.edit}
        </button>
      ) : null}

      {open ? (
        <fieldset id={panelId} className="flex flex-col gap-2 pt-1">
          <legend className="text-corps-s text-encre mb-2 leading-[1.4] font-semibold">
            {t.already}
          </legend>
          <p className="text-legende text-texte-attenue mb-1 leading-[1.4]">
            {t.alreadyHelp}
          </p>
          {habitsIn(locale).map((habit) => {
            const checked = declared.includes(habit.gesture);
            return (
              <label
                key={habit.gesture}
                className="text-corps-s text-encre flex cursor-pointer items-center gap-2.5 leading-[1.3]"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(event) => {
                    // La liste reste ouverte pendant qu'on coche.
                    setEditing(true);
                    setDeclared(
                      event.target.checked
                        ? [...declared, habit.gesture]
                        : declared.filter((id) => id !== habit.gesture),
                    );
                  }}
                  className="accent-encre size-[18px] shrink-0"
                />
                {habit.declaration}
              </label>
            );
          })}
        </fieldset>
      ) : null}
    </section>
  );
}
