// Arrosage : les habitudes tenues font avancer les plantes, sans aucun kg. Un « jour arrosé »
// est un jour (heure de Paris) où au moins une habitude est notée ; noter dix fois le même jour
// ne compte qu'une fois. Règle de base, pour toutes les habitudes : chaque jour arrosé compte
// pour toutes les plantes plantées avant lui. En plus, une habitude notée avec une plante cible
// (`plant`) lui donne un arrosage bonus, au plus un par plante et par jour. Compteur d'une
// plante = jours arrosés depuis sa plantation + arrosages bonus ; un cran tous les
// WATER_DAYS_PER_STEP : pousse → jeune → grand (arbres), pousse → fleurie (fleurs), puis
// épanouissement 1, 2, 3. Le carnet ne fait que s'allonger et le bonus ne fait qu'ajouter :
// le compteur d'une plante ne baisse jamais, et n'est jamais plus petit qu'avec la règle de
// base seule.
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

/**
 * Arrosages bonus par plante : jours distincts (heure de Paris) où une habitude l'a visée
 * (`plant`). Les habitudes sans cible, ou à la date illisible, n'en donnent aucun.
 */
export function bonusDaysByPlant(
  entries: readonly JournalEntry[],
): Map<string, Set<string>> {
  const result = new Map<string, Set<string>>();
  for (const entry of entries) {
    if (!isHabit(entry) || typeof entry.plant !== "string") continue;
    const day = gardenDay(entry.date);
    if (!day) continue;
    const days = result.get(entry.plant) ?? new Set<string>();
    days.add(day);
    result.set(entry.plant, days);
  }
  return result;
}

/** Crans gagnés par l'arrosage (compteur : jours arrosés + arrosages bonus). */
export function wateringSteps(wateredDays: number): number {
  return Math.floor(wateredDays / WATER_DAYS_PER_STEP);
}

/** Arrosages qui manquent avant le prochain cran. */
export function daysToNextStep(wateredDays: number): number {
  return WATER_DAYS_PER_STEP - (wateredDays % WATER_DAYS_PER_STEP);
}
