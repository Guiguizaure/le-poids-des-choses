// Jour et nuit : le ciel suit l'heure locale de l'appareil. De 21 h à 6 h, le jardin passe
// en Nuit encre (soleil devenu lune, étoiles), sans nouveau ciel ni déblocage.

/** Début et fin de la nuit (heures locales, fin exclue). */
export const NIGHT_HOURS = { start: 21, end: 6 } as const;

/** Étoiles la nuit (etoiles.svg) : à couper ici si elles ne conviennent pas. */
export const STARS_ENABLED = true;
/** Opacité des étoiles : discrètes (validé dans /labo). */
export const STARS_OPACITY = 0.6;

export function isNightHour(hour: number): boolean {
  return hour >= NIGHT_HOURS.start || hour < NIGHT_HOURS.end;
}

/** Nuit à cet instant, à l'heure locale de l'appareil (faux au rendu serveur : now = 0). */
export function isNightAt(now: number): boolean {
  return now > 0 && isNightHour(new Date(now).getHours());
}
