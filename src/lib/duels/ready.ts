// Duels prêts à jouer : une liste écrite à la main. Chaque duel reprend les paramètres du
// parcours (?a=…&b=…&q=… ou ?objet=…&option=…), donc le duel existant, déjà rempli. Le « Duel
// du jour » tourne chaque jour (heure de Paris), le même pour tout le monde.
import type { ComparisonState } from "@/lib/compare/url";
import { getGesture } from "@/lib/data";
import type { Category, Unit } from "@/lib/data/types";
import { fromToday } from "./daily";
import { defineMessages } from "@/lib/i18n";

type DuelState = Extract<ComparisonState, { step: "duel" | "object" }>;

export type ReadyDuel = {
  id: string;
  state: DuelState;
};

/**
 * 752 km : moitié des 1 504 km aller-retour du cas pratique ADEME « A/R Paris - Marseille en
 * TGV » (docs/gestes-sources.md).
 */
export const PARIS_MARSEILLE_KM = 752;

export const READY_DUELS: readonly ReadyDuel[] = [
  {
    id: "paris-marseille",
    state: { step: "duel", a: "tgv", b: "avion", quantity: PARIS_MARSEILLE_KM },
  },
  {
    id: "jean",
    state: {
      step: "object",
      object: "jean",
      option: "occasion",
      delivered: true,
    },
  },
  {
    id: "steak",
    state: {
      step: "duel",
      a: "repas-boeuf",
      b: "repas-vegetarien",
      quantity: 1,
    },
  },
  { id: "cafe-the", state: { step: "duel", a: "cafe", b: "the", quantity: 1 } },
  {
    id: "velo-voiture",
    state: { step: "duel", a: "velo", b: "voiture", quantity: 5 },
  },
  {
    id: "eau",
    state: { step: "duel", a: "eau-robinet", b: "eau-bouteille", quantity: 1 },
  },
  {
    id: "livraison",
    state: {
      step: "duel",
      a: "livraison-domicile",
      b: "point-relais-pied",
      quantity: 1,
    },
  },
  {
    id: "lave-linge",
    state: {
      step: "object",
      object: "lave-linge",
      option: "garder",
      delivered: false,
    },
  },
];

export const DUEL_TITLES = defineMessages<Record<string, string>>(
  {
    "paris-marseille": "Paris–Marseille : train ou avion ?",
    jean: "Jean neuf ou d’occasion ?",
    steak: "Steak ou plat végétarien ?",
    "cafe-the": "Café ou thé ?",
    "velo-voiture": "Vélo ou voiture sur 5 km ?",
    eau: "Eau du robinet ou en bouteille ?",
    livraison: "Livré chez toi ou au point relais à pied ?",
    "lave-linge": "Lave-linge neuf ou gardé ?",
  },
  {
    "paris-marseille": "Paris–Marseille: train or plane?",
    jean: "Jeans: new or second-hand?",
    steak: "Steak or a vegetarian dish?",
    "cafe-the": "Coffee or tea?",
    "velo-voiture": "Bike or car for 5 km?",
    eau: "Tap or bottled water?",
    livraison: "Home delivery or the pickup point on foot?",
    "lave-linge": "Washing machine: new or keep yours?",
  },
);

/** Gestes d'un duel (deux pour un duel, le même objet deux fois pour un duel objet). */
export function duelGestures(duel: ReadyDuel): [string, string] {
  return duel.state.step === "duel"
    ? [duel.state.a, duel.state.b]
    : [duel.state.object, duel.state.object];
}

/** Unités des deux côtés (toujours la même : un test le vérifie). */
export function duelUnits(duel: ReadyDuel): [Unit, Unit] {
  const [a, b] = duelGestures(duel);
  return [getGesture(a)!.unit, getGesture(b)!.unit];
}

export function duelCategory(duel: ReadyDuel): Category {
  return getGesture(duelGestures(duel)[0])!.category;
}

export { parisDayNumber } from "./daily";

/** Les duels à partir du Duel du jour, dans l'ordre de la liste (en boucle). */
export function duelsFromToday(
  now: Date,
  duels: readonly ReadyDuel[] = READY_DUELS,
): ReadyDuel[] {
  return fromToday(now, duels);
}

export function dailyDuel(
  now: Date,
  duels: readonly ReadyDuel[] = READY_DUELS,
): ReadyDuel {
  return duelsFromToday(now, duels)[0];
}
