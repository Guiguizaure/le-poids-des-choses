"use client";

import { useState } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { IconLink, PrimaryButton } from "@/components/ui/buttons";
import {
  badgeFor,
  CATEGORY_ORDER,
  EMPTY_SELECTION,
  gestureNoun,
  gesturesIn,
  isSelectable,
  selectionCount,
  toggleGesture,
  type PairSelection,
} from "@/lib/compare";
import { gestureDetail, gestureLabel, getGesture } from "@/lib/data";
import type { Category } from "@/lib/data/types";
import { pictoFor } from "@/lib/journal/display";
import { format, type Locale } from "@/lib/i18n";
import { COMPARE } from "@/lib/i18n/messages/compare";
import { CATEGORY_NAMES } from "@/lib/i18n/messages/names";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { useFocusTitle } from "./useFocusTitle";
import { RaconteLink } from "@/components/raconte/RaconteLink";
import { SeasonTeaser } from "@/components/saison/SeasonTeaser";
import { useDeclaredHabits } from "@/lib/habits/useDeclaredHabits";

type GestureChooserProps = {
  /** Premier geste déjà choisi (lien partagé, retour depuis le duel). */
  initialFirst?: string;
  backHref: string;
  /** Le premier geste change (l'URL suit, sans entrée d'historique). */
  onFirstChange: (first: string | null) => void;
  onCompare: (a: string, b: string) => void;
  onObject: (object: string) => void;
  /** Noter une habitude sans comparer (null : choisir laquelle). */
  onHabit: (habit: string | null) => void;
  focusTitle: boolean;
};

function announce(selection: PairSelection, locale: Locale): string {
  const t = COMPARE[locale].chooser;
  const label = (id: string | null) => (id ? gestureLabel(id, locale) : "");
  if (selection.first && selection.second) {
    return format(t.bothChosen, {
      a: label(selection.first),
      b: label(selection.second),
    });
  }
  if (selection.first) {
    return format(t.firstChosen, { a: label(selection.first) });
  }
  return "";
}

/**
 * Écran 02 · Choisir les gestes, sur un seul écran : premier toucher = geste 1, second = geste
 * 2 ; dès le premier choix, les gestes d'une autre unité se grisent. Un objet mène directement
 * aux trois options (neuf, d'occasion, garder).
 */
export function GestureChooser({
  initialFirst,
  backHref,
  onFirstChange,
  onCompare,
  onObject,
  onHabit,
  focusTitle,
}: GestureChooserProps) {
  const [declared] = useDeclaredHabits();
  const locale = useLocale();
  const common = COMPARE[locale];
  const t = common.chooser;
  const categoryNames = CATEGORY_NAMES[locale];
  const initial = initialFirst ? getGesture(initialFirst) : undefined;
  const [category, setCategory] = useState<Category>(
    initial?.category ?? "transport",
  );
  const [selection, setSelection] = useState<PairSelection>(
    initial ? { first: initial.id, second: null } : EMPTY_SELECTION,
  );
  const [message, setMessage] = useState("");
  const titleRef = useFocusTitle<HTMLHeadingElement>(focusTitle);

  const count = selectionCount(selection);
  const first = selection.first ? getGesture(selection.first) : undefined;
  const subtitle = first
    ? format(t.sameTypeAs, {
        category: categoryNames[category],
        noun: gestureNoun(first.id, locale).text,
      })
    : format(t.examples, { category: categoryNames[category] });

  const toggle = (id: string) => {
    const result = toggleGesture(selection, id);
    if (result.kind === "object") onObject(result.object);
    if (result.kind !== "selection") return;
    const next = result.selection;
    if (next.first !== selection.first) onFirstChange(next.first);
    setSelection(next);
    const removed =
      badgeFor(selection, id) !== null && badgeFor(next, id) !== 1;
    setMessage(
      removed
        ? `${format(t.removed, { label: gestureLabel(id, locale) })} ${announce(next, locale)}`
        : announce(next, locale),
    );
  };

  return (
    <main className="animate-enter mx-auto flex min-h-screen w-full max-w-[430px] flex-col motion-reduce:animate-none">
      <div className="flex items-center justify-between px-5 pt-[22px] pb-2">
        <IconLink href={backHref} label={common.back} icon="retour" />
        <p className="text-corps-s text-encre leading-[1.3] font-semibold">
          {format(t.step, { n: Math.min(count + 1, 2) })}
        </p>
        <IconLink href="/" label={common.close} icon="fermer" />
      </div>

      <div className="flex flex-col gap-[18px] px-5 pt-3 pb-8">
        <div className="flex gap-1.5" aria-hidden>
          <span className="bg-tomate h-1.5 flex-1 rounded-[3px]" />
          <span
            className={`h-1.5 flex-1 rounded-[3px] ${count >= 1 ? "bg-tomate" : "bg-encre/15"}`}
          />
        </div>

        <h1
          ref={titleRef}
          tabIndex={-1}
          className="font-titre text-titre-l text-encre leading-[1.1] outline-none"
        >
          {t.title}
        </h1>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label={t.categories}
        >
          {CATEGORY_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={category === id}
              onClick={() => setCategory(id)}
              className={`press border-encre text-corps-s focus-visible:outline-outremer rounded-full border px-3.5 py-2 leading-[1.3] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${
                category === id ? "bg-encre text-creme" : "bg-blanc text-encre"
              }`}
            >
              {categoryNames[id]}
            </button>
          ))}
        </div>

        <p
          id="gestes-aide"
          className="text-corps-s text-texte-attenue leading-[1.4]"
        >
          {subtitle}
        </p>
        <div
          className="grid grid-cols-2 gap-3"
          role="group"
          aria-labelledby="gestes-aide"
        >
          {gesturesIn(category).map((gesture) => {
            const badge = badgeFor(selection, gesture.id);
            const selectable = isSelectable(selection, gesture.id);
            return (
              <button
                key={gesture.id}
                type="button"
                aria-pressed={badge !== null}
                disabled={!selectable}
                onClick={() => toggle(gesture.id)}
                className={`press bg-blanc focus-visible:outline-outremer flex flex-col items-start gap-2.5 rounded-[18px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-35 ${
                  badge
                    ? "border-tomate animate-select border-2 p-[15px] motion-reduce:animate-none"
                    : "border-encre border p-4"
                }`}
              >
                <span className="flex w-full items-start justify-between">
                  <Illustration
                    name={pictoFor(gesture.id)}
                    className="size-11"
                  />
                  {badge ? (
                    <span
                      aria-hidden
                      className="bg-tomate text-encre text-legende animate-pop flex size-6 items-center justify-center rounded-full font-semibold motion-reduce:animate-none"
                    >
                      {badge}
                    </span>
                  ) : null}
                </span>
                <span className="flex flex-col gap-0.5">
                  <span className="text-corps-m text-encre leading-[1.3] font-semibold">
                    {gestureLabel(gesture.id, locale)}
                  </span>
                  {gestureDetail(gesture.id, locale) ? (
                    <span className="text-legende text-texte-attenue">
                      {gestureDetail(gesture.id, locale)}
                    </span>
                  ) : null}
                  {badge ? (
                    <span className="sr-only">
                      {format(t.badge, { n: badge })}
                    </span>
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>

        <p role="status" aria-live="polite" className="sr-only">
          {message}
        </p>

        <PrimaryButton
          disabled={count < 2}
          onClick={() =>
            selection.first &&
            selection.second &&
            onCompare(selection.first, selection.second)
          }
        >
          {t.compare}
        </PrimaryButton>
        <p className="text-legende text-texte-attenue text-center">
          {count === 0 ? t.hintNone : count === 1 ? t.hintOne : t.hintTwo}
        </p>
        {selection.first &&
        !selection.second &&
        declared.includes(selection.first) ? (
          // Une habitude déclarée n'a pas à être comparée : on propose de la noter telle quelle.
          <button
            type="button"
            onClick={() => onHabit(selection.first)}
            className="press bg-pomme-douce text-corps-s text-encre focus-visible:outline-outremer rounded-2xl px-4 py-3 text-left leading-[1.35] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {t.declaredHabit}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => onHabit(null)}
          className="press border-encre bg-blanc focus-visible:outline-outremer mt-2 flex flex-col gap-0.5 rounded-[18px] border px-4 py-3.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span className="text-corps-s text-encre leading-[1.3] font-semibold underline">
            {t.logHabit}
          </span>
          <span className="text-legende text-texte-attenue leading-[1.35]">
            {t.logHabitHelp}
          </span>
        </button>
        <RaconteLink className="mt-2" />
        <SeasonTeaser className="mt-2" />
      </div>
    </main>
  );
}
