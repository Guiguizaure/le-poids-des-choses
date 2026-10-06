// Présentation d'une entrée du carnet (titre, date relative, catégorie, picto).
import { objectNoun } from "@/lib/compare/nouns";
import { gestureLabel, getGesture } from "@/lib/data";
import type { AcquisitionMode, Category, JournalEntry } from "@/lib/data/types";
import { habitLabel } from "@/lib/habits";
import { intlLocale, type Locale } from "@/lib/i18n";
import { JOURNAL } from "@/lib/i18n/messages/garden";
import { CATEGORY_NAMES } from "@/lib/i18n/messages/names";
import { doneGesture } from "./kind";
import {
  ILLUSTRATION_SPECS,
  type IllustrationName,
} from "@/lib/illustrations/specs";

/** Catégories en français (les deux langues : CATEGORY_NAMES). */
export const CATEGORY_LABELS: Record<Category, string> = CATEGORY_NAMES.fr;

/** Met en minuscule le premier mot, sauf un sigle (TGV, TER). */
function lowerFirst(label: string): string {
  const [first, ...rest] = label.split(" ");
  if (first.length > 1 && first === first.toUpperCase()) return label;
  return [first.charAt(0).toLowerCase() + first.slice(1), ...rest].join(" ");
}

/** Raccourcit l'autre option quand elle partage le premier mot : « Repas au bœuf » → « bœuf ». */
function shortenOther(chosen: string, other: string): string {
  const [chosenFirst] = chosen.split(" ");
  const [otherFirst, ...rest] = other.split(" ");
  if (
    rest.length === 0 ||
    chosenFirst.toLowerCase() !== otherFirst.toLowerCase()
  )
    return other;
  return rest
    .join(" ")
    .replace(/^(au|aux|à la|à l’|à l'|en|de la|du|des) /i, "");
}

/** Mode en anglais : « new », « second-hand », « second-hand, delivered », « kept ». */
const EN_MODES: Record<AcquisitionMode, string> = {
  neuf: "new",
  occasion: "second-hand",
  "occasion-livree": "second-hand, delivered",
  garder: "kept",
};

/** Titre anglais d'un objet : « Second-hand jeans rather than new », « Kept my laptop… ». */
function objectTitleEn(
  objectId: string,
  chosen: AcquisitionMode,
  other: AcquisitionMode,
): string {
  const noun = objectNoun(objectId, "en").bare;
  const head =
    chosen === "garder"
      ? `Kept my ${noun}`
      : chosen === "occasion-livree"
        ? `Second-hand ${noun}, delivered,`
        : `${EN_MODES[chosen].charAt(0).toUpperCase()}${EN_MODES[chosen].slice(1)} ${noun}`;
  return JOURNAL.en.rather(head, EN_MODES[other]);
}

/** Forme du mode accordée avec l'objet (« neuve », « d’occasion livrée », « gardée »). */
function modeWord(mode: AcquisitionMode, objectId: string): string {
  const { feminine, plural } = objectNoun(objectId);
  const ending = `${feminine ? "e" : ""}${plural ? "s" : ""}`;
  switch (mode) {
    case "neuf":
      return feminine
        ? `neuve${plural ? "s" : ""}`
        : `neuf${plural ? "s" : ""}`;
    case "occasion":
      return "d’occasion";
    case "occasion-livree":
      return `d’occasion livré${ending}`;
    case "garder":
      return `gardé${ending}`;
  }
}

/**
 * Titre d'une entrée : « Train plutôt qu’avion », « Jean neuf plutôt que d’occasion » ; pour
 * une habitude, son nom (« À vélo », « Repas végétarien »).
 */
export function entryTitle(entry: JournalEntry, locale: Locale = "fr"): string {
  if (entry.kind === "habit") return habitLabel(entry.gesture, locale);
  const chosenIsA = entry.chosen === "a";
  const chosenId = chosenIsA ? entry.gestureA : entry.gestureB;
  const otherId = chosenIsA ? entry.gestureB : entry.gestureA;
  const chosenMode = chosenIsA ? entry.modeA : entry.modeB;
  const otherMode = chosenIsA ? entry.modeB : entry.modeA;
  const chosenLabel = gestureLabel(chosenId, locale);
  const otherLabel = gestureLabel(otherId, locale);
  const rather = JOURNAL[locale].rather;

  if (chosenId === otherId && chosenMode && otherMode) {
    if (locale === "en") return objectTitleEn(chosenId, chosenMode, otherMode);
    // Libellé court (« Jean ») ; l'accord vient du nom de l'objet (genre, nombre).
    return rather(
      `${chosenLabel} ${modeWord(chosenMode, chosenId)}`,
      modeWord(otherMode, chosenId),
    );
  }
  if (locale === "en") return rather(chosenLabel, lowerFirst(otherLabel));
  return rather(chosenLabel, lowerFirst(shortenOther(chosenLabel, otherLabel)));
}

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): number {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
}

/** « Aujourd’hui », « Hier », « Lundi » (dans la semaine), sinon « 12 sept. ». */
export function relativeDay(
  iso: string,
  now: Date,
  locale: Locale = "fr",
): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const days = Math.round((startOfDay(now) - startOfDay(date)) / DAY_MS);
  if (days <= 0) return JOURNAL[locale].today;
  if (days === 1) return JOURNAL[locale].yesterday;
  if (days < 7) {
    const weekday = new Intl.DateTimeFormat(intlLocale(locale), {
      weekday: "long",
    }).format(date);
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
  }
  const sameYear = date.getFullYear() === now.getFullYear();
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  }).format(date);
}

export function entryCategory(
  entry: JournalEntry,
  locale: Locale = "fr",
): string {
  const gesture = getGesture(doneGesture(entry));
  return gesture ? CATEGORY_NAMES[locale][gesture.category] : "";
}

/** Picto illustrant le choix fait : celui du geste, ou celui du mode (occasion, garder). */
export function pictoFor(
  gestureId: string,
  mode?: AcquisitionMode,
): IllustrationName {
  if (mode === "occasion" || mode === "occasion-livree")
    return "picto-occasion";
  if (mode === "garder") return "picto-garder";
  const aliases: Record<string, string> = {
    "ordinateur-portable": "picto-ordinateur",
  };
  const name = aliases[gestureId] ?? `picto-${gestureId}`;
  return name in ILLUSTRATION_SPECS
    ? (name as IllustrationName)
    : "picto-generique";
}

export function entryPicto(entry: JournalEntry): IllustrationName {
  if (entry.kind === "habit") return pictoFor(entry.gesture);
  return entry.chosen === "a"
    ? pictoFor(entry.gestureA, entry.modeA)
    : pictoFor(entry.gestureB, entry.modeB);
}
