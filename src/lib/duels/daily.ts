// Rotation du « Duel du jour » : le jour à Paris, le même pour tout le monde. Sans données du
// catalogue (léger : chargé par l'accueil).
import { gardenDay } from "@/lib/garden/seasons";

/** Numéro du jour (heure de Paris) depuis le 1er janvier 1970 : la même valeur partout. */
export function parisDayNumber(now: Date): number {
  const day = gardenDay(now) ?? "1970-01-01";
  const [year, month, date] = day.split("-").map(Number);
  return Math.floor(Date.UTC(year, month - 1, date) / 86_400_000);
}

/**
 * La liste à partir de l'élément du jour, dans l'ordre (en boucle) : le premier est le Duel du
 * jour, il change à minuit, heure de Paris.
 */
export function fromToday<T>(now: Date, list: readonly T[]): T[] {
  if (list.length === 0) return [];
  const start = parisDayNumber(now) % list.length;
  return list.map((_, i) => list[(start + i) % list.length]);
}
