// Paliers de l'écart cumulé (kg CO2e d'écart avec les autres options) et leur équivalence.
// Comme « Le savais-tu ? » : aucune valeur écrite à la main, l'équivalence est calculée avec
// nos données et src/lib/calc ; seule l'unité de comparaison est rédigée.
import { emissions } from "@/lib/calc";
import { gestureLabel, getGesture } from "@/lib/data";
import type { Locale } from "@/lib/i18n/routes";
import { FACT_CARD } from "@/lib/i18n/messages/garden";
import { MILESTONE_UNITS } from "@/lib/i18n/messages/facts";
import type { Gesture, JournalEntry } from "@/lib/data/types";
import { readableNumber } from "@/lib/facts";
import { entryKg, isLightChoice } from "@/lib/journal/kind";
import { resolveRef, type GestureRef } from "@/lib/facts/templates";

export const MILESTONES_KG = [10, 50, 100, 250, 500, 1000] as const;
export type Milestone = (typeof MILESTONES_KG)[number];

export type Equivalence = {
  /** Geste de comparaison (avec son mode pour un objet). */
  gesture: GestureRef;
};

/**
 * Une équivalence par palier : l'écart du palier, rapporté à une unité du geste. L'unité
 * rédigée et accordée (« km en voiture thermique », « repas au bœuf »…) est dans
 * MILESTONE_UNITS (src/lib/i18n/messages/facts.ts).
 */
export const MILESTONE_EQUIVALENCES: Record<Milestone, Equivalence> = {
  10: { gesture: { id: "voiture" } },
  50: { gesture: { id: "repas-boeuf" } },
  100: { gesture: { id: "tshirt", mode: "neuf" } },
  250: { gesture: { id: "jean", mode: "neuf" } },
  500: { gesture: { id: "avion" } },
  1000: { gesture: { id: "voiture" } },
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
  locale: Locale = "fr",
): MilestoneCard | null {
  const t = FACT_CARD[locale];
  const equivalence = MILESTONE_EQUIVALENCES[milestone];
  const gesture = resolveRef(equivalence.gesture, lookup);
  const base = lookup(equivalence.gesture.id);
  if (!gesture || !base) return null;
  const value = milestone / emissions(gesture, 1);
  const shown = readableNumber(value, locale);
  const count = Number(
    locale === "en"
      ? shown.replace(/,/g, "")
      : shown.replace(/\s/g, "").replace(",", "."),
  );
  return {
    milestone,
    title: t.milestoneTitle(readableNumber(milestone, locale)),
    text: t.milestoneText(shown, MILESTONE_UNITS[locale][milestone](count)),
    value,
    source: {
      label: locale === "fr" ? base.label : gestureLabel(base.id, locale),
      url: base.sourceUrl,
    },
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
