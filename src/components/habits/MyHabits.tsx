"use client";

import { useMemo, useRef, useState } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { FirstHint } from "@/components/ui/FirstHint";
import { StickyBar } from "@/components/ui/StickyBar";
import type { JournalEntry } from "@/lib/data/types";
import { gardenDay } from "@/lib/garden/seasons";
import { habitsIn } from "@/lib/habits";
import { useDeclaredHabits } from "@/lib/habits/useDeclaredHabits";
import { HABITS_UI, HINTS } from "@/lib/i18n/messages/garden";
import { LocalLink as Link, useLocale } from "@/lib/i18n/LocaleProvider";
import { isHabit } from "@/lib/journal/kind";
import { pictoFor } from "@/lib/journal/display";

const BUTTON =
  "press text-corps-m focus-visible:outline-outremer rounded-full px-6 py-3 leading-[1.3] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2";
const LINK =
  "text-corps-s text-encre focus-visible:outline-outremer self-start leading-[1.3] font-semibold underline focus-visible:outline-2";

/** Coche de l'état « Arrosée aujourd'hui » (décorative : le nom du bouton le dit). */
function Check() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
      <path
        d="M3.5 8.5 6.5 11.5 12.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Section « Mes habitudes » de /jardin (pastille arrosoir). Premier passage : choisir ses
 * habitudes (cases à cocher), confirmé par « Valider » en bas de la liste ou dans la barre
 * fixe (`StickyBar`, comme « Comparer »). Ensuite, une icône par habitude choisie : la toucher
 * note l'habitude (`onWater`) et arrose une plante ; elle passe alors « Arrosée aujourd'hui »
 * (grisée, cochée, `aria-disabled`) jusqu'à minuit, heure de Paris. « Modifier mes
 * habitudes » rouvre la liste. Les habitudes choisies restent sur cet appareil ; seules les
 * habitudes notées vont dans le carnet.
 */
export function MyHabits({
  entries,
  now,
  onWater,
}: {
  entries: readonly JournalEntry[];
  /** Horodatage courant (ms) ; 0 au rendu serveur. */
  now: number;
  onWater: (gesture: string) => void;
}) {
  const [declared, setDeclared] = useDeclaredHabits();
  const locale = useLocale();
  const t = HABITS_UI[locale];
  const hints = HINTS[locale];
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [draft, setDraft] = useState<string[] | null>(null);
  const habits = habitsIn(locale);
  const choosing = draft !== null || declared.length === 0;
  const selection = draft ?? declared;
  const mine = habits.filter((habit) => declared.includes(habit.gesture));

  // Habitudes déjà notées aujourd'hui (heure de Paris) : une seule fois par jour.
  const wateredToday = useMemo(() => {
    const today = now ? gardenDay(new Date(now)) : null;
    return new Set(
      today
        ? entries
            .filter(
              (entry) => isHabit(entry) && gardenDay(entry.date) === today,
            )
            .map((entry) => (isHabit(entry) ? entry.gesture : ""))
        : [],
    );
  }, [entries, now]);

  const toggle = (gesture: string, checked: boolean) =>
    setDraft(
      checked
        ? [...selection, gesture]
        : selection.filter((id) => id !== gesture),
    );
  const confirm = () => {
    if (selection.length === 0) return;
    setDeclared(selection);
    setDraft(null);
    // La liste se referme : le focus revient au titre de la section, au lieu de se perdre.
    requestAnimationFrame(() => titleRef.current?.focus());
  };
  const cancel = () => {
    setDraft(null);
    requestAnimationFrame(() => titleRef.current?.focus());
  };

  return (
    <section
      id="habitudes"
      aria-labelledby="habitudes-titre"
      className="bg-blanc flex scroll-mt-4 flex-col gap-3 rounded-[20px] p-5"
    >
      <div className="flex items-center gap-2">
        <Illustration
          name="badge-arrosage"
          className="size-6 shrink-0"
          data-badge="arrosage"
        />
        <h2
          id="habitudes-titre"
          ref={titleRef}
          tabIndex={-1}
          className="font-titre text-titre-m text-encre leading-[1.1] outline-none"
        >
          {t.mine}
        </h2>
      </div>
      <p className="text-corps-s text-texte-attenue leading-[1.4]">
        {t.mineText}{" "}
        <Link
          href="/methode#habitudes"
          className="text-encre focus-visible:outline-outremer font-semibold underline focus-visible:outline-2"
        >
          {t.how}
        </Link>
      </p>

      {choosing ? (
        <>
          <fieldset className="flex flex-col gap-2" data-habit-choice>
            <legend className="text-corps-m text-encre mb-1 leading-[1.3] font-semibold">
              {t.chooseLegend}
            </legend>
            <p className="text-legende text-texte-attenue mb-1 leading-[1.4]">
              {t.alreadyHelp}
            </p>
            <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
              {habits.map((habit) => {
                const checked = selection.includes(habit.gesture);
                return (
                  <label
                    key={habit.gesture}
                    className={`press bg-blanc text-corps-s text-encre has-[:focus-visible]:outline-outremer flex cursor-pointer items-center gap-2.5 rounded-2xl p-2.5 leading-[1.3] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${
                      checked
                        ? "border-tomate border-2 p-[9px]"
                        : "border-encre/40 border"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) =>
                        toggle(habit.gesture, event.target.checked)
                      }
                      className="accent-encre size-[18px] shrink-0"
                    />
                    <Illustration
                      name={pictoFor(habit.gesture)}
                      className="size-8 shrink-0"
                    />
                    <span>{habit.declaration}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={confirm}
              aria-disabled={selection.length === 0 ? true : undefined}
              aria-describedby={
                selection.length === 0 ? "habitudes-aucune" : undefined
              }
              className={`${BUTTON} bg-encre text-creme aria-disabled:cursor-not-allowed aria-disabled:opacity-40`}
            >
              {t.confirm}
            </button>
            {declared.length > 0 ? (
              <button
                type="button"
                onClick={cancel}
                className={`${BUTTON} border-encre text-encre border-2`}
              >
                {t.cancel}
              </button>
            ) : null}
          </div>
          {selection.length === 0 ? (
            <p
              id="habitudes-aucune"
              className="text-legende text-texte-attenue leading-[1.4]"
            >
              {t.noneSelected}
            </p>
          ) : null}
          <StickyBar
            open={selection.length > 0}
            name="habits"
            label={t.barLabel}
            announcement={t.selectedAnnounce(selection.length)}
            action={t.confirm}
            onAction={confirm}
          >
            {t.selected(selection.length)}
          </StickyBar>
        </>
      ) : (
        <>
          <p className="text-corps-s text-encre leading-[1.4] font-semibold">
            {t.tapHelp}
          </p>
          <FirstHint id="premier-arrosage" active={mine.length > 0}>
            {hints.firstWatering}
          </FirstHint>
          <ul
            aria-label={t.icons}
            className="grid grid-cols-3 gap-2"
            data-habit-icons
          >
            {mine.map((habit) => {
              const done = wateredToday.has(habit.gesture);
              return (
                <li key={habit.gesture}>
                  <button
                    type="button"
                    data-habit={habit.gesture}
                    aria-label={
                      done ? t.watered(habit.label) : t.water(habit.label)
                    }
                    aria-disabled={done ? true : undefined}
                    onClick={() => {
                      if (!done) onWater(habit.gesture);
                    }}
                    className={`press focus-visible:outline-outremer relative flex h-full w-full flex-col items-center gap-1.5 rounded-2xl border p-2.5 text-center focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed ${
                      done
                        ? "border-encre/25 bg-creme"
                        : "border-encre bg-blanc"
                    }`}
                  >
                    <Illustration
                      name={pictoFor(habit.gesture)}
                      className={`size-11 ${done ? "opacity-50 grayscale" : ""}`}
                    />
                    <span className="text-legende text-encre leading-[1.25] font-semibold">
                      {habit.label}
                    </span>
                    {done ? (
                      <>
                        <span className="bg-pomme text-encre absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full">
                          <Check />
                        </span>
                        <span className="text-legende text-texte-attenue leading-[1.25]">
                          {t.wateredShort}
                        </span>
                      </>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={() => setDraft(declared)}
            className={LINK}
          >
            {t.edit}
          </button>
        </>
      )}

      <Link href="/comparer?habitude=" className={LINK}>
        {t.another}
      </Link>
    </section>
  );
}
