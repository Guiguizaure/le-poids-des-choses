"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { HABITS, orderedHabits } from "@/lib/habits";
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
  const [editing, setEditing] = useState(false);
  const panelId = useId();
  const mine = orderedHabits(declared).filter((habit) =>
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
        Mes habitudes
      </h2>
      <p className="text-corps-s text-texte-attenue leading-[1.4]">
        Une habitude tenue ne se compare à rien et ne compte aucun kg : elle
        arrose ton jardin, et tes plantes avancent vers la floraison.{" "}
        <Link
          href="/methode#habitudes"
          className="text-encre focus-visible:outline-outremer font-semibold underline focus-visible:outline-2"
        >
          Comment ?
        </Link>
      </p>

      {mine.length > 0 ? (
        <ul
          className="flex flex-wrap gap-2"
          aria-label="Noter une habitude d’un toucher"
        >
          {mine.map((habit) => (
            <li key={habit.gesture}>
              <button
                type="button"
                className={CHIP}
                onClick={() => onWater(habit.gesture)}
              >
                J’ai tenu :{" "}
                {habit.label.charAt(0).toLowerCase() + habit.label.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <Link
        href="/comparer?habitude="
        className="text-corps-s text-encre focus-visible:outline-outremer self-start leading-[1.3] font-semibold underline focus-visible:outline-2"
      >
        Noter une autre habitude
      </Link>

      {mine.length > 0 ? (
        <button
          type="button"
          aria-expanded={editing}
          aria-controls={panelId}
          onClick={() => setEditing((value) => !value)}
          className="text-corps-s text-encre focus-visible:outline-outremer self-start leading-[1.3] font-semibold underline focus-visible:outline-2"
        >
          Modifier mes habitudes
        </button>
      ) : null}

      {open ? (
        <fieldset id={panelId} className="flex flex-col gap-2 pt-1">
          <legend className="text-corps-s text-encre mb-2 leading-[1.4] font-semibold">
            Ce que tu fais déjà
          </legend>
          <p className="text-legende text-texte-attenue mb-1 leading-[1.4]">
            Ces gestes te seront proposés en habitude, sans comparaison. Rien
            n’est noté tant que tu ne le dis pas. Gardé sur cet appareil
            seulement.
          </p>
          {HABITS.map((habit) => {
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
