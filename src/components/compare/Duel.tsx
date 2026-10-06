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
import { gestureDetail, gestureLabel, getGesture } from "@/lib/data";
import type { Choice } from "@/lib/data/types";
import { pictoFor } from "@/lib/journal/display";
import { format } from "@/lib/i18n";
import { COMPARE } from "@/lib/i18n/messages/compare";
import { CATEGORY_NAMES } from "@/lib/i18n/messages/names";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { DuelScene } from "./DuelScene";
import { useFocusTitle } from "./useFocusTitle";
import { FactCard } from "@/components/facts/FactCard";
import { DataCredit } from "@/components/ui/DataCredit";

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
  const locale = useLocale();
  const t = COMPARE[locale].duel;
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
  const nouns = { a: gestureNoun(a, locale), b: gestureNoun(b, locale) };
  const sentence = resultSentence(comparison, nouns, gestureA.unit, locale);
  const equivalence = equivalenceSentence(comparison.differenceKg, car, locale);
  const chooseLabel = (side: Choice) => {
    const noun = side === "a" ? nouns.a : nouns.b;
    return noun.choose ?? format(t.choose, { noun: noun.text });
  };
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
              {feminine ? t.lighterFeminine : t.lighter}
            </span>
          ) : null}
        </div>
        <p className="text-legende text-texte-attenue">
          {CATEGORY_NAMES[locale][gesture.category]}
        </p>
        <h2 className="font-titre text-titre-m text-encre break-words">
          {gestureLabel(gesture.id, locale)}
          {gestureDetail(gesture.id, locale) ? (
            <span className="text-legende text-texte-attenue font-texte block font-normal">
              {gestureDetail(gesture.id, locale)}
            </span>
          ) : null}
        </h2>
        <p className="text-corps-s text-encre font-semibold">
          {formatMass(kg, locale)} CO2e
        </p>
      </div>
    );
  };

  return (
    <main className="animate-enter mx-auto flex min-h-screen w-full max-w-[430px] flex-col motion-reduce:animate-none">
      <div className="flex items-center justify-between px-5 pt-[22px] pb-3">
        <Logo />
        <GardenPill />
      </div>

      <DuelScene
        tilt={tiltFor(comparison)}
        left={pictoFor(a)}
        right={pictoFor(b)}
        title={format(t.scale, {
          a: gestureLabel(a, locale),
          b: gestureLabel(b, locale),
        })}
      />

      <div className="flex flex-col gap-3.5 px-5 pt-[18px] pb-[26px]">
        <h1
          ref={titleRef}
          tabIndex={-1}
          className="font-titre text-titre-l text-encre leading-[1.1] outline-none"
        >
          {t.title}
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
              <span className="text-texte-attenue">{t.distance}</span>
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
              aria-valuetext={t.kilometres(quantity)}
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
          {chooseLabel(lighter)}
        </PrimaryButton>
        <TextButton
          className="text-texte-attenue no-underline"
          onClick={() => onChoose(heavier, quantity)}
        >
          {chooseLabel(heavier)}
        </TextButton>
        <FactCard related={[a, b]} className="mt-2" />
        <DataCredit independent className="text-center" />
      </div>
    </main>
  );
}
