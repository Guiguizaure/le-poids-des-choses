"use client";

import { useEffect, useMemo, useState } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { GardenPill } from "@/components/ui/GardenPill";
import { Logo, PrimaryButton, TextButton } from "@/components/ui/buttons";
import { formatMass } from "@/lib/calc";
import {
  duelComparison,
  equivalenceSentence,
  gestureNoun,
  positionFromQuantity,
  quantityFromPosition,
  resultSentence,
  SLIDER_STEPS,
  SLIDERS,
  tiltFor,
} from "@/lib/compare";
import { getGesture } from "@/lib/data";
import type { Choice } from "@/lib/data/types";
import { CATEGORY_LABELS, pictoFor } from "@/lib/journal/display";
import { DuelScene } from "./DuelScene";
import { useFocusTitle } from "./useFocusTitle";

type DuelProps = {
  a: string;
  b: string;
  quantity: number;
  /** Quantité modifiée au curseur (l'URL suit). */
  onQuantity: (quantity: number) => void;
  onChoose: (choice: Choice, quantity: number) => void;
  focusTitle: boolean;
};

/** Écran 03 · Duel : la balance penche, la phrase dit l'écart, on choisit. */
export function Duel({
  a,
  b,
  quantity: initialQuantity,
  onQuantity,
  onChoose,
  focusTitle,
}: DuelProps) {
  const gestureA = getGesture(a)!;
  const gestureB = getGesture(b)!;
  const slider = SLIDERS[gestureA.unit];
  const [quantity, setQuantity] = useState(initialQuantity);
  const titleRef = useFocusTitle<HTMLHeadingElement>(focusTitle);
  const car = getGesture("voiture")?.kgCo2ePerUnit ?? 0;

  // L'URL suit le curseur, sans surcharger l'historique pendant qu'on le fait glisser.
  useEffect(() => {
    if (quantity === initialQuantity) return;
    const timer = window.setTimeout(() => onQuantity(quantity), 300);
    return () => window.clearTimeout(timer);
  }, [quantity, initialQuantity, onQuantity]);

  const comparison = useMemo(
    () => duelComparison(a, b, quantity)!,
    [a, b, quantity],
  );
  const nouns = { a: gestureNoun(a), b: gestureNoun(b) };
  const sentence = resultSentence(comparison, nouns, gestureA.unit);
  const equivalence = equivalenceSentence(comparison.differenceKg, car);
  const lighter: Choice = comparison.lighter;
  const heavier: Choice = lighter === "a" ? "b" : "a";
  const showLighterBadge =
    comparison.differenceKg > 0 && !comparison.almostEqual;

  const card = (side: Choice) => {
    const gesture = side === "a" ? gestureA : gestureB;
    const kg = side === "a" ? comparison.emissionsA : comparison.emissionsB;
    const isLighter = showLighterBadge && side === lighter;
    const feminine = (side === "a" ? nouns.a : nouns.b).feminine;
    return (
      <div
        className={`bg-blanc flex min-w-0 flex-1 flex-col gap-2 rounded-[18px] ${
          isLighter
            ? "border-tomate border-2 p-[13px]"
            : "border-encre/12 border p-3.5"
        }`}
      >
        <div className="flex items-center justify-between">
          <Illustration name={pictoFor(gesture.id)} className="size-9" />
          {isLighter ? (
            <span className="bg-tomate-douce text-encre rounded-full px-2 py-[3px] text-[11px] font-semibold">
              {feminine ? "plus légère" : "plus léger"}
            </span>
          ) : null}
        </div>
        <p className="text-legende text-texte-attenue">
          {CATEGORY_LABELS[gesture.category]}
        </p>
        <h2 className="font-titre text-titre-m text-encre break-words">
          {gesture.label}
          {gesture.detail ? (
            <span className="text-legende text-texte-attenue font-texte block font-normal">
              {gesture.detail}
            </span>
          ) : null}
        </h2>
        <p className="text-corps-s text-encre font-semibold">
          {formatMass(kg)} CO2e
        </p>
      </div>
    );
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col">
      <div className="flex items-center justify-between px-5 pt-[22px] pb-3">
        <Logo />
        <GardenPill />
      </div>

      <DuelScene
        tilt={tiltFor(comparison)}
        left={pictoFor(a)}
        right={pictoFor(b)}
        title={`Balance : ${gestureA.label} à gauche, ${gestureB.label} à droite`}
      />

      <div className="flex flex-col gap-3.5 px-5 pt-[18px] pb-[26px]">
        <h1
          ref={titleRef}
          tabIndex={-1}
          className="font-titre text-titre-l text-encre leading-[1.1] outline-none"
        >
          Lequel pèse le moins ?
        </h1>
        <div className="flex gap-3">
          {card("a")}
          {card("b")}
        </div>

        {slider ? (
          <div className="flex flex-col gap-2">
            <label
              htmlFor="quantite"
              className="text-corps-s flex justify-between"
            >
              <span className="text-texte-attenue">{slider.label}</span>
              <span className="text-encre font-semibold">
                {quantity} {slider.unit}
              </span>
            </label>
            <input
              id="quantite"
              type="range"
              min={0}
              max={SLIDER_STEPS}
              step={SLIDER_STEPS / 100}
              value={positionFromQuantity(slider, quantity)}
              aria-valuetext={`${quantity} ${slider.unit === "h" ? (quantity > 1 ? "heures" : "heure") : "kilomètres"}`}
              onChange={(event) =>
                setQuantity(
                  quantityFromPosition(slider, Number(event.target.value)),
                )
              }
              className="range-tomate"
              style={{
                ["--fill" as string]: `${(positionFromQuantity(slider, quantity) / SLIDER_STEPS) * 100}%`,
              }}
            />
          </div>
        ) : null}

        <div aria-live="polite" className="flex flex-col gap-1">
          <p className="text-corps-m text-encre leading-[1.4]">{sentence}</p>
          {equivalence ? (
            <p className="text-corps-s text-texte-attenue">{equivalence}</p>
          ) : null}
        </div>

        <PrimaryButton onClick={() => onChoose(lighter, quantity)}>
          Je choisis {(lighter === "a" ? nouns.a : nouns.b).text}
        </PrimaryButton>
        <TextButton
          className="text-texte-attenue no-underline"
          onClick={() => onChoose(heavier, quantity)}
        >
          Je choisis {(heavier === "a" ? nouns.a : nouns.b).text}
        </TextButton>
        <p className="text-texte-attenue text-center text-[11px]">
          Données : Impact CO2 (ADEME) · projet indépendant
        </p>
      </div>
    </main>
  );
}
