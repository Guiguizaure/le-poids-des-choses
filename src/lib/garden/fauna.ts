// Faune du jardin selon la saison et l'heure (table de données, comme species.ts). Un animal
// débloqué n'est jamais perdu : il est seulement absent ou endormi selon le moment ; la vitrine
// et le compteur ne changent pas.
import type { AnimalKind } from "./model";
import type { Season } from "./seasons";
import type { SkyId } from "./skies";

/** Ce qu'on voit d'un animal à un moment donné. */
export type Presence = "awake" | "asleep" | "absent";

export type DayNight = {
  day: Record<Season, Presence>;
  night: Record<Season, Presence>;
};

const every = (presence: Presence): Record<Season, Presence> => ({
  printemps: presence,
  ete: presence,
  automne: presence,
  hiver: presence,
});
const winter = (rest: Presence, hiver: Presence): Record<Season, Presence> => ({
  ...every(rest),
  hiver,
});

/**
 * Animaux débloqués :
 * - papillon, abeille : absents l'hiver et la nuit ;
 * - coccinelle : absente l'hiver ;
 * - oiseau : toute l'année, endormi la nuit ;
 * - escargot : endormi l'hiver ;
 * - hérisson : dort le jour, actif la nuit, hiberne tout l'hiver.
 */
export const FAUNA: Record<AnimalKind, DayNight> = {
  butterfly: { day: winter("awake", "absent"), night: every("absent") },
  bee: { day: winter("awake", "absent"), night: every("absent") },
  ladybug: {
    day: winter("awake", "absent"),
    night: winter("awake", "absent"),
  },
  bird: { day: every("awake"), night: every("asleep") },
  snail: { day: winter("awake", "asleep"), night: winter("awake", "asleep") },
  hedgehog: { day: every("asleep"), night: winter("awake", "asleep") },
};

/**
 * Présence selon la table. Sans saison (rendu serveur), l'animal est là, éveillé.
 */
export function presenceOf(
  rule: DayNight,
  moment: { season: Season | null; night: boolean },
): Presence {
  if (!moment.season) return "awake";
  return (moment.night ? rule.night : rule.day)[moment.season];
}

/**
 * Ciels sur lesquels l'oiseau ne s'envole pas (il reste posé) : bleu sur Nuit encre, son corps
 * ne se distingue pas assez du fond (voir sky-contrast.ts).
 */
export const NO_FLIGHT_SKIES: readonly SkyId[] = ["nuit"];
