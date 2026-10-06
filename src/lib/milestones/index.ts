// Paliers de l'écart cumulé (kg CO2e d'écart avec les autres options) et leur équivalence.
// Comme « Le savais-tu ? » : aucune valeur écrite à la main, l'équivalence est calculée avec
// nos données et src/lib/calc ; seule l'unité de comparaison est rédigée.
import { emissions } from "@/lib/calc";
import { getGesture } from "@/lib/data";
import type { Gesture, JournalEntry } from "@/lib/data/types";
import { readableNumber } from "@/lib/facts";
import { entryKg, isLightChoice } from "@/lib/journal/kind";
import { resolveRef, type GestureRef } from "@/lib/facts/templates";

export const MILESTONES_KG = [10, 50, 100, 250, 500, 1000] as const;
export type Milestone = (typeof MILESTONES_KG)[number];

export type Equivalence = {
  /** Geste de comparaison (avec son mode pour un objet). */
  gesture: GestureRef;
  /** Unité rédigée, accordée : « km en voiture thermique », « repas au bœuf »… */
  unit: (count: number) => string;
};

const objects = (singular: string, plural: string) => (count: number) =>
  count >= 2 ? plural : singular;

/** Une équivalence par palier : l'écart du palier, rapporté à une unité du geste. */
export const MILESTONE_EQUIVALENCES: Record<Milestone, Equivalence> = {
  10: { gesture: { id: "voiture" }, unit: () => "km en voiture thermique" },
  50: { gesture: { id: "repas-boeuf" }, unit: () => "repas au bœuf" },
  100: {
    gesture: { id: "tshirt", mode: "neuf" },
    unit: objects("T-shirt en coton neuf", "T-shirts en coton neufs"),
  },
  250: {
    gesture: { id: "jean", mode: "neuf" },
    unit: objects("jean neuf", "jeans neufs"),
  },
  500: { gesture: { id: "avion" }, unit: () => "km en avion (trajet court)" },
  1000: { gesture: { id: "voiture" }, unit: () => "km en voiture thermique" },
};

/** Paliers atteints par un écart cumulé. */
export function reachedMilestones(totalKg: number): Milestone[] {
  return MILESTONES_KG.filter((milestone) => totalKg >= milestone);
}

/**
 * Palier franchi par le dernier choix léger du carnet (le plus haut s'il en franchit
 * plusieurs), ou null. Le carnet est dans l'ordre où les choix ont été notés.
 */
export function milestoneCrossed(
  entries: readonly JournalEntry[],
): Milestone | null {
  let last = -1;
  for (let i = entries.length - 1; i >= 0; i--) {
    if (isLightChoice(entries[i])) {
      last = i;
      break;
    }
  }
  if (last < 0) return null;
  const before = entries
    .slice(0, last)
    .reduce((sum, entry) => sum + Math.max(0, entryKg(entry)), 0);
  // Une habitude ne compte aucun kg : elle n'entre jamais dans les paliers.
  const after = before + entryKg(entries[last]);
  const crossed = MILESTONES_KG.filter(
    (milestone) => before < milestone && after >= milestone,
  );
  return crossed.length > 0 ? crossed[crossed.length - 1] : null;
}

export type MilestoneCard = {
  milestone: Milestone;
  /** « 10 kg de CO2e d’écart avec les autres options » */
  title: string;
  /** « C’est autant que 70 km en voiture thermique. » */
  text: string;
  /** Valeur exacte de l'équivalence, avant arrondi. */
  value: number;
  source: { label: string; url?: string };
  methodHref: string;
};

type Lookup = (id: string) => Gesture | undefined;

/** Carte d'un palier, ou null si le geste de l'équivalence n'existe plus. */
export function milestoneCard(
  milestone: Milestone,
  lookup: Lookup = getGesture,
): MilestoneCard | null {
  const equivalence = MILESTONE_EQUIVALENCES[milestone];
  const gesture = resolveRef(equivalence.gesture, lookup);
  const base = lookup(equivalence.gesture.id);
  if (!gesture || !base) return null;
  const value = milestone / emissions(gesture, 1);
  const shown = readableNumber(value);
  const count = Number(shown.replace(/\s/g, "").replace(",", "."));
  return {
    milestone,
    title: `${readableNumber(milestone)} kg de CO2e d’écart avec les autres options`,
    text: `C’est autant que ${shown} ${equivalence.unit(count)}.`,
    value,
    source: { label: base.label, url: base.sourceUrl },
    methodHref: "/methode#ecart",
  };
}

/** Gestes des équivalences qui n'existent plus (vide : tout va bien). */
export function missingMilestoneGestures(
  lookup: Lookup = getGesture,
): string[] {
  return MILESTONES_KG.flatMap((milestone) => {
    const { gesture } = MILESTONE_EQUIVALENCES[milestone];
    return resolveRef(gesture, lookup)
      ? []
      : [
          `palier ${milestone} kg → ${gesture.id}${gesture.mode ? ` (${gesture.mode})` : ""}`,
        ];
  });
}
