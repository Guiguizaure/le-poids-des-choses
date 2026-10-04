"use client";

import { useState } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { IconLink, PrimaryButton } from "@/components/ui/buttons";
import {
  CATEGORY_ORDER,
  compatibleGestures,
  gestureNoun,
  gesturesIn,
} from "@/lib/compare";
import { getGesture } from "@/lib/data";
import type { Category } from "@/lib/data/types";
import { CATEGORY_LABELS, pictoFor } from "@/lib/journal/display";
import { useFocusTitle } from "./useFocusTitle";

type GestureChooserProps = {
  /** Premier geste déjà choisi (étape 2), sinon étape 1. */
  firstId?: string;
  backHref: string;
  onContinue: (gestureId: string) => void;
  focusTitle: boolean;
};

/** Écran 02 · Choisir un geste (option 1 sur 2, puis 2 sur 2 parmi les gestes de même unité). */
export function GestureChooser({
  firstId,
  backHref,
  onContinue,
  focusTitle,
}: GestureChooserProps) {
  const first = firstId ? getGesture(firstId) : undefined;
  const step = first ? 2 : 1;
  const [category, setCategory] = useState<Category>(
    first?.category ?? "transport",
  );
  const [selected, setSelected] = useState<string | null>(null);
  const titleRef = useFocusTitle<HTMLHeadingElement>(focusTitle);

  const gestures = first ? compatibleGestures(first.id) : gesturesIn(category);
  const subtitle = first
    ? `${CATEGORY_LABELS[first.category]} · à comparer avec ${gestureNoun(first.id).text}`
    : `${CATEGORY_LABELS[category]} · exemples de gestes`;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col">
      <div className="flex items-center justify-between px-5 pt-[22px] pb-2">
        <IconLink href={backHref} label="Retour" icon="retour" />
        <p className="text-corps-s text-encre leading-[1.3] font-semibold">
          Option {step} sur 2
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
            className={`h-1.5 flex-1 rounded-[3px] ${step === 2 ? "bg-tomate" : "bg-encre/15"}`}
          />
        </div>

        <h1
          ref={titleRef}
          tabIndex={-1}
          className="font-titre text-titre-l text-encre leading-[1.1] outline-none"
        >
          {first ? "Avec quoi le comparer ?" : "Que veux-tu comparer ?"}
        </h1>

        {first ? null : (
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
                onClick={() => {
                  setCategory(id);
                  setSelected(null);
                }}
                className={`border-encre text-corps-s focus-visible:outline-outremer rounded-full border px-3.5 py-2 leading-[1.3] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  category === id
                    ? "bg-encre text-creme"
                    : "bg-blanc text-encre"
                }`}
              >
                {CATEGORY_LABELS[id]}
              </button>
            ))}
          </div>
        )}

        <fieldset className="flex flex-col gap-[18px]">
          <legend className="text-corps-s text-texte-attenue mb-[18px] leading-[1.4]">
            {subtitle}
          </legend>
          <div className="grid grid-cols-2 gap-3">
            {gestures.map((gesture) => {
              const checked = selected === gesture.id;
              return (
                <label
                  key={gesture.id}
                  className={`bg-blanc has-[:focus-visible]:outline-outremer flex cursor-pointer flex-col gap-2.5 rounded-[18px] p-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${
                    checked
                      ? "border-tomate border-2 p-[15px]"
                      : "border-encre border"
                  }`}
                >
                  <input
                    type="radio"
                    name="geste"
                    value={gesture.id}
                    checked={checked}
                    onChange={() => setSelected(gesture.id)}
                    className="sr-only"
                  />
                  <span className="flex items-start justify-between">
                    <Illustration
                      name={pictoFor(gesture.id)}
                      className="size-11"
                    />
                    {checked ? (
                      <span className="bg-tomate-douce text-legende text-encre rounded-full px-2 py-[3px] leading-[1.3] font-semibold">
                        Choisi
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
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <PrimaryButton
          disabled={!selected}
          onClick={() => selected && onContinue(selected)}
        >
          Continuer
        </PrimaryButton>
        <p className="text-legende text-texte-attenue text-center">
          {first
            ? "Ensuite, pose-les sur la balance."
            : "Ensuite, choisis la seconde option."}
        </p>
      </div>
    </main>
  );
}
