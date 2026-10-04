"use client";

import { Illustration } from "@/components/illustrations/Illustration";
import { GardenPill } from "@/components/ui/GardenPill";
import { IconLink, PrimaryButton, TextLink } from "@/components/ui/buttons";
import { Switch } from "@/components/ui/Switch";
import { formatMass } from "@/lib/calc";
import {
  equivalenceSentence,
  modeFor,
  objectNoun,
  objectSentence,
  possessive,
  type ObjectOption,
} from "@/lib/compare";
import { getGesture } from "@/lib/data";
import type { IllustrationName } from "@/lib/illustrations/specs";
import { CATEGORY_LABELS, pictoFor } from "@/lib/journal/display";
import { useFocusTitle } from "./useFocusTitle";

type ObjectDuelProps = {
  object: string;
  option: ObjectOption;
  delivered: boolean;
  backHref: string;
  onChange: (option: ObjectOption, delivered: boolean) => void;
  onChoose: () => void;
  focusTitle: boolean;
};

/** Écran 03b · Duel objet : neuf, d'occasion (livré en colis ou non), ou je garde le mien. */
export function ObjectDuel({
  object,
  option,
  delivered,
  backHref,
  onChange,
  onChoose,
  focusTitle,
}: ObjectDuelProps) {
  const gesture = getGesture(object)!;
  const noun = objectNoun(object);
  const titleRef = useFocusTitle<HTMLHeadingElement>(focusTitle);
  const car = getGesture("voiture")?.kgCo2ePerUnit ?? 0;

  const parcelKg = gesture.modes?.["occasion-livree"]?.kgCo2e;
  const kgOf = (choice: ObjectOption) =>
    gesture.modes?.[modeFor(choice, delivered)]?.kgCo2e ?? 0;
  const newKg = kgOf("neuf");
  const usedLabel =
    delivered && parcelKg !== undefined ? "d’occasion livré" : "d’occasion";

  const options: {
    id: ObjectOption;
    title: string;
    detail: string;
    picto: IllustrationName;
  }[] = [
    {
      id: "neuf",
      title: "Neuf",
      detail: `Fabrication ${noun.newOne}`,
      picto: pictoFor(object),
    },
    {
      id: "occasion",
      title: "D’occasion",
      detail: "Pas de nouvelle fabrication",
      picto: "picto-occasion",
    },
    {
      id: "garder",
      title: `Je garde ${possessive(noun, "moi")}`,
      detail: "Rien de neuf à fabriquer",
      picto: "picto-garder",
    },
  ];

  const sentence =
    option === "neuf"
      ? objectSentence("Neuf", usedLabel, newKg, kgOf("occasion"))
      : option === "occasion"
        ? objectSentence(
            usedLabel === "d’occasion" ? "D’occasion" : "D’occasion livré",
            "neuf",
            kgOf("occasion"),
            newKg,
          )
        : objectSentence(`Garder ${possessive(noun, "toi")}`, "neuf", 0, newKg);
  const gap =
    option === "neuf" ? newKg - kgOf("occasion") : newKg - kgOf(option);
  const equivalence = equivalenceSentence(Math.abs(gap), car);
  const action =
    option === "neuf"
      ? "Je choisis neuf"
      : option === "occasion"
        ? "Je choisis d’occasion"
        : `Je garde ${possessive(noun, "moi")}`;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col">
      <div className="flex items-center justify-between gap-3 px-5 pt-[22px] pb-2">
        <div className="flex items-center gap-1">
          <IconLink
            href={backHref}
            label="Retour au choix des gestes"
            icon="retour"
          />
          <p className="text-corps-s text-encre leading-[1.3] font-semibold">
            {CATEGORY_LABELS[gesture.category]}
          </p>
        </div>
        <GardenPill />
      </div>

      <div className="flex flex-col gap-4 px-5 pt-3 pb-8">
        <div className="flex items-center gap-3">
          <Illustration name={pictoFor(object)} className="size-12" />
          <p className="font-titre text-titre-m text-encre leading-[1.1]">
            {noun.indefinite}
          </p>
        </div>
        <h1
          ref={titleRef}
          tabIndex={-1}
          className="font-titre text-titre-l text-encre leading-[1.1] outline-none"
        >
          Neuf, d’occasion, ou tu gardes {possessive(noun, "toi")} ?
        </h1>

        <fieldset className="flex flex-col gap-2.5">
          <legend className="sr-only">Comment l’obtenir</legend>
          {options.map((item) => {
            const checked = option === item.id;
            const kg = kgOf(item.id);
            return (
              <div
                key={item.id}
                className={`bg-blanc has-[input[type=radio]:focus-visible]:outline-outremer rounded-[18px] has-[input[type=radio]:focus-visible]:outline-2 has-[input[type=radio]:focus-visible]:outline-offset-2 ${
                  checked
                    ? "border-tomate border-2 p-[13px]"
                    : "border-encre border p-3.5"
                }`}
              >
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="radio"
                    name="option"
                    value={item.id}
                    checked={checked}
                    onChange={() => onChange(item.id, delivered)}
                    className="sr-only"
                  />
                  <Illustration
                    name={item.picto}
                    className="size-10 shrink-0"
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-corps-m text-encre leading-[1.3] font-semibold">
                      {item.title}
                    </span>
                    <span className="text-legende text-texte-attenue">
                      {item.detail}
                    </span>
                  </span>
                  <span className="text-corps-s text-encre shrink-0 leading-[1.3] font-semibold">
                    {kg === 0 ? "0 kg" : formatMass(kg)}
                  </span>
                </label>
                {item.id === "occasion" && parcelKg !== undefined ? (
                  <Switch
                    checked={delivered}
                    onChange={(value) => onChange(option, value)}
                    className="pt-3 pl-[52px]"
                  >
                    Livré en colis (+ {formatMass(parcelKg)})
                  </Switch>
                ) : null}
              </div>
            );
          })}
        </fieldset>

        <div aria-live="polite" className="flex flex-col gap-1">
          <p className="text-corps-m text-encre leading-[1.4]">{sentence}</p>
          {equivalence ? (
            <p className="text-corps-s text-texte-attenue">{equivalence}</p>
          ) : null}
        </div>

        <PrimaryButton onClick={onChoose}>{action}</PrimaryButton>
        <TextLink href="/methode">Comment on compte l’occasion ?</TextLink>
      </div>
    </main>
  );
}
