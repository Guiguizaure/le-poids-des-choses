import type { JournalEntry } from "@/lib/data/types";

/** Nombre de jours sans entrée après lesquels le jardin s'assoupit (il ne meurt jamais). */
export const DEFAULT_ASLEEP_DAYS = 21;

const DAY_MS = 24 * 60 * 60 * 1000;

export type GardenTotals = {
  totalAvoidedKg: number;
  /** Nombre total de choix notés. */
  choiceCount: number;
  /** Choix légers : le plus léger des deux, écart > 0. */
  lightChoiceCount: number;
};

export function gardenTotals(entries: readonly JournalEntry[]): GardenTotals {
  let totalAvoidedKg = 0;
  let lightChoiceCount = 0;
  for (const entry of entries) {
    if (entry.avoidedKg > 0) {
      totalAvoidedKg += entry.avoidedKg;
      lightChoiceCount += 1;
    }
  }
  return { totalAvoidedKg, choiceCount: entries.length, lightChoiceCount };
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
