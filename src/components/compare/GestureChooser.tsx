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
import { getGesture } from "@/lib/data";
import type { Category } from "@/lib/data/types";
import { CATEGORY_LABELS, pictoFor } from "@/lib/journal/display";
import { useFocusTitle } from "./useFocusTitle";
import { RaconteLink } from "@/components/raconte/RaconteLink";
import { SeasonTeaser } from "@/components/saison/SeasonTeaser";

type GestureChooserProps = {
  /** Premier geste déjà choisi (lien partagé, retour depuis le duel). */
  initialFirst?: string;
  backHref: string;
  /** Le premier geste change (l'URL suit, sans entrée d'historique). */
  onFirstChange: (first: string | null) => void;
  onCompare: (a: string, b: string) => void;
  onObject: (object: string) => void;
  focusTitle: boolean;
};

function announce(selection: PairSelection): string {
  const label = (id: string | null) =>
    id ? (getGesture(id)?.label ?? id) : "";
  if (selection.first && selection.second) {
    return `${label(selection.first)} et ${label(selection.second)} choisis : tu peux comparer.`;
  }
  if (selection.first) {
    return `${label(selection.first)} choisi en premier. Choisis un second geste du même type ; les autres sont grisés.`;
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
  focusTitle,
}: GestureChooserProps) {
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
    ? `${CATEGORY_LABELS[category]} · même type que ${gestureNoun(first.id).text}`
    : `${CATEGORY_LABELS[category]} · exemples de gestes`;

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
        ? `${getGesture(id)?.label ?? id} retiré. ${announce(next)}`
        : announce(next),
    );
  };

  return (
    <main className="animate-enter mx-auto flex min-h-screen w-full max-w-[430px] flex-col motion-reduce:animate-none">
      <div className="flex items-center justify-between px-5 pt-[22px] pb-2">
        <IconLink href={backHref} label="Retour" icon="retour" />
        <p className="text-corps-s text-encre leading-[1.3] font-semibold">
          Option {Math.min(count + 1, 2)} sur 2
        </p>
        <IconLink
          href="/"
          label="Fermer et revenir à l’accueil"
          icon="fermer"
        />
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
          Que veux-tu comparer ?
        </h1>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Catégories"
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
              {CATEGORY_LABELS[id]}
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
                    {gesture.label}
                  </span>
                  {gesture.detail ? (
                    <span className="text-legende text-texte-attenue">
                      {gesture.detail}
                    </span>
                  ) : null}
                  {badge ? (
                    <span className="sr-only">, geste {badge}</span>
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
          Comparer
        </PrimaryButton>
        <p className="text-legende text-texte-attenue text-center">
          {count === 0
            ? "Touche un premier geste, puis un second du même type."
            : count === 1
              ? "Ensuite, choisis la seconde option."
              : "Retouche un geste pour le retirer."}
        </p>
        <RaconteLink className="mt-2" />
        <SeasonTeaser className="mt-2" />
      </div>
    </main>
  );
}
