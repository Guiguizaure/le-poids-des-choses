import type { JournalEntry } from "@/lib/data/types";
import { isComparison } from "@/lib/journal/kind";

/** Nombre de jours sans entrée après lesquels le jardin s'assoupit (il ne meurt jamais). */
export const DEFAULT_ASLEEP_DAYS = 21;

const DAY_MS = 24 * 60 * 60 * 1000;

export type GardenTotals = {
  /** Écart cumulé des comparaisons (une habitude ne compte aucun kg). */
  totalAvoidedKg: number;
  /** Nombre de comparaisons notées. */
  choiceCount: number;
  /** Choix légers : le plus léger des deux, écart > 0. */
  lightChoiceCount: number;
  /** Habitudes notées (aucun kg). */
  habitCount: number;
};

export function gardenTotals(entries: readonly JournalEntry[]): GardenTotals {
  let totalAvoidedKg = 0;
  let lightChoiceCount = 0;
  let choiceCount = 0;
  for (const entry of entries) {
    if (!isComparison(entry)) continue;
    choiceCount += 1;
    if (entry.avoidedKg > 0) {
      totalAvoidedKg += entry.avoidedKg;
      lightChoiceCount += 1;
    }
  }
  return {
    totalAvoidedKg,
    choiceCount,
    lightChoiceCount,
    habitCount: entries.length - choiceCount,
  };
}

/**
 * Vrai si la dernière entrée remonte à `days` jours ou plus. Sans entrée (ou date invalide),
 * le jardin n'est pas assoupi : il n'a simplement pas encore commencé.
 */
export function isAsleep(
  lastEntryDate: string | Date | null | undefined,
  now: Date,
  days: number = DEFAULT_ASLEEP_DAYS,
): boolean {
  if (lastEntryDate == null) return false;
  const last = new Date(lastEntryDate).getTime();
  if (Number.isNaN(last)) return false;
  return now.getTime() - last >= days * DAY_MS;
}
