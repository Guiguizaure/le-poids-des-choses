// Saisons du jardin : saison météorologique de l'hémisphère nord, d'après le mois (fuseau
// Europe/Paris, le même sur tous les appareils). Décembre à février : hiver ; mars à mai :
// printemps ; juin à août : été ; septembre à novembre : automne.

export type Season = "printemps" | "ete" | "automne" | "hiver";

export const SEASONS: readonly Season[] = [
  "printemps",
  "ete",
  "automne",
  "hiver",
];

export const SEASON_LABELS: Record<Season, string> = {
  printemps: "printemps",
  ete: "été",
  automne: "automne",
  hiver: "hiver",
};

/** Fuseau des jours et des mois du jardin (jours arrosés, saisons). */
export const GARDEN_TIME_ZONE = "Europe/Paris";

const DAY_FORMAT = new Intl.DateTimeFormat("en-CA", {
  timeZone: GARDEN_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Jour du jardin (AAAA-MM-JJ, heure de Paris), ou null pour une date illisible. */
export function gardenDay(date: Date | string): string | null {
  const value = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(value.getTime())) return null;
  return DAY_FORMAT.format(value);
}

/** Mois (1 à 12) à Paris. */
export function gardenMonth(date: Date): number {
  return Number((gardenDay(date) ?? "1970-01-01").slice(5, 7));
}

export function seasonForMonth(month: number): Season {
  if (month === 12 || month <= 2) return "hiver";
  if (month <= 5) return "printemps";
  if (month <= 8) return "ete";
  return "automne";
}

export function seasonFor(date: Date): Season {
  return seasonForMonth(gardenMonth(date));
}

/** Saison à afficher : null tant que l'heure n'est pas connue (rendu serveur : now = 0). */
export function seasonAt(now: number): Season | null {
  return now > 0 ? seasonFor(new Date(now)) : null;
}
