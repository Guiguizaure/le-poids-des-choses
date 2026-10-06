// Arrosage : les habitudes tenues font avancer les plantes, sans aucun kg. Un « jour arrosé »
// est un jour (heure de Paris) où au moins une habitude est notée ; noter dix fois le même jour
// ne compte qu'une fois. Chaque plante avance d'un cran tous les WATER_DAYS_PER_STEP jours
// arrosés depuis qu'elle a été plantée : pousse → jeune → grand (arbres), pousse → fleurie
// (fleurs), puis épanouissement 1, 2, 3. Le carnet ne fait que s'allonger, donc le compte d'une
// plante ne baisse jamais : pas de régression.
import type { JournalEntry } from "@/lib/data/types";
import { isHabit } from "@/lib/journal/kind";
import { gardenDay } from "./seasons";

/** Jours arrosés par cran (PROVISOIRE, facile à ajuster). */
export const WATER_DAYS_PER_STEP = 3;

/** Niveaux d'épanouissement d'une plante adulte (0 : pas encore épanouie). */
export const MAX_BLOOM = 3;
export type BloomLevel = 0 | 1 | 2 | 3;

export type Watering = { time: number; day: string };

/** Habitudes du carnet, avec leur jour (dates illisibles ignorées). */
export function waterings(entries: readonly JournalEntry[]): Watering[] {
  const result: Watering[] = [];
  for (const entry of entries) {
    if (!isHabit(entry)) continue;
    const day = gardenDay(entry.date);
    if (day) result.push({ time: Date.parse(entry.date), day });
  }
  return result;
}

/** Jours arrosés après `since` (ms) : jours distincts des habitudes notées ensuite. */
export function wateredDaysSince(
  list: readonly Watering[],
  since: number,
): number {
  const days = new Set<string>();
  for (const watering of list)
    if (watering.time > since) days.add(watering.day);
  return days.size;
}

/** Jours arrosés en tout (jours distincts). */
export function wateredDayCount(list: readonly Watering[]): number {
  return new Set(list.map((watering) => watering.day)).size;
}

/** Crans gagnés par l'arrosage. */
export function wateringSteps(wateredDays: number): number {
  return Math.floor(wateredDays / WATER_DAYS_PER_STEP);
}

/** Jours arrosés qui manquent avant le prochain cran. */
export function daysToNextStep(wateredDays: number): number {
  return WATER_DAYS_PER_STEP - (wateredDays % WATER_DAYS_PER_STEP);
}
