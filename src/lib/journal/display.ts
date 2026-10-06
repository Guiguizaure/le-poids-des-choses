// Présentation d'une entrée du carnet (titre, date relative, catégorie, picto).
import { objectNoun } from "@/lib/compare/nouns";
import { getGesture } from "@/lib/data";
import type { AcquisitionMode, Category, JournalEntry } from "@/lib/data/types";
import { habitLabel } from "@/lib/habits";
import { doneGesture } from "./kind";
import {
  ILLUSTRATION_SPECS,
  type IllustrationName,
} from "@/lib/illustrations/specs";

export const CATEGORY_LABELS: Record<Category, string> = {
  transport: "Se déplacer",
  alimentation: "Manger",
  habillement: "S’habiller",
  numerique: "Numérique",
  boisson: "Boire",
  livraison: "Se faire livrer",
};

const VOWEL = /^[aàâeéèêëiîïoôuùûüyhœæ]/i;

/** « que » devant consonne, « qu’ » devant voyelle (ou h). */
function rather(other: string): string {
  return VOWEL.test(other) ? `plutôt qu’${other}` : `plutôt que ${other}`;
}

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
export function entryTitle(entry: JournalEntry): string {
  if (entry.kind === "habit") return habitLabel(entry.gesture);
  const chosenIsA = entry.chosen === "a";
  const chosenId = chosenIsA ? entry.gestureA : entry.gestureB;
  const otherId = chosenIsA ? entry.gestureB : entry.gestureA;
  const chosenMode = chosenIsA ? entry.modeA : entry.modeB;
  const otherMode = chosenIsA ? entry.modeB : entry.modeA;
  const chosenLabel = getGesture(chosenId)?.label ?? chosenId;
  const otherLabel = getGesture(otherId)?.label ?? otherId;

  if (chosenId === otherId && chosenMode && otherMode) {
    // Libellé court (« Jean ») ; l'accord vient du nom de l'objet (genre, nombre).
    return `${chosenLabel} ${modeWord(chosenMode, chosenId)} ${rather(modeWord(otherMode, chosenId))}`;
  }
  return `${chosenLabel} ${rather(lowerFirst(shortenOther(chosenLabel, otherLabel)))}`;
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
export function relativeDay(iso: string, now: Date): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const days = Math.round((startOfDay(now) - startOfDay(date)) / DAY_MS);
  if (days <= 0) return "Aujourd’hui";
  if (days === 1) return "Hier";
  if (days < 7) {
    const weekday = new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
    }).format(date);
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
  }
  const sameYear = date.getFullYear() === now.getFullYear();
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    ...(sameYear ? {} : { year: "numeric" }),
  }).format(date);
}

export function entryCategory(entry: JournalEntry): string {
  const gesture = getGesture(doneGesture(entry));
  return gesture ? CATEGORY_LABELS[gesture.category] : "";
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
