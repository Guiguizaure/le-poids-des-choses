// « Le savais-tu ? » : gabarits de faits. Aucun chiffre n'est écrit à la main : chaque valeur
// est calculée depuis nos données (src/lib/data) avec les fonctions de src/lib/calc. Seule la
// prémisse est rédigée (« un jean neuf », « un repas », « un litre », « un trajet »).
import { compare, compareModes, emissions, withMode } from "@/lib/calc";
import type { AcquisitionMode, Gesture } from "@/lib/data/types";

/** Geste demandé par un gabarit, éventuellement sous un mode d'acquisition (objets). */
export type GestureRef = { id: string; mode?: AcquisitionMode };

/** Façon d'écrire la valeur : distance (km), nombre (repas, litres), rapport (fois), masse. */
export type FactKind = "km" | "count" | "ratio" | "mass";

export type FactTemplate = {
  id: string;
  kind: FactKind;
  /** Gestes utilisés ; le premier est le geste source (lien vers sa fiche Impact CO2). */
  gestures: readonly GestureRef[];
  /** Valeur calculée, à partir des gestes demandés (dans l'ordre de `gestures`). */
  compute: (gestures: readonly Gesture[]) => number;
  /** Phrase, avec la valeur déjà arrondie et mise en forme. */
  text: (value: string) => string;
};

/** Combien d'unités de `b` pèsent autant qu'une unité de `a`. */
const per = ([a, b]: readonly Gesture[]) => emissions(a, 1) / emissions(b, 1);

export const FACT_TEMPLATES: readonly FactTemplate[] = [
  {
    id: "jean-voiture",
    kind: "km",
    gestures: [{ id: "jean", mode: "neuf" }, { id: "voiture" }],
    compute: per,
    text: (km) => `Un jean neuf, c’est autant que ${km} en voiture thermique.`,
  },
  {
    id: "smartphone-tgv",
    kind: "km",
    gestures: [{ id: "smartphone", mode: "neuf" }, { id: "tgv" }],
    compute: per,
    text: (km) => `Un smartphone neuf, c’est autant que ${km} en TGV.`,
  },
  {
    id: "television-voiture",
    kind: "km",
    gestures: [{ id: "television", mode: "neuf" }, { id: "voiture" }],
    compute: per,
    text: (km) =>
      `Une télévision neuve, c’est autant que ${km} en voiture thermique.`,
  },
  {
    id: "ordinateur-boeuf",
    kind: "count",
    gestures: [
      { id: "ordinateur-portable", mode: "neuf" },
      { id: "repas-boeuf" },
    ],
    compute: per,
    text: (n) =>
      `Un ordinateur portable neuf, c’est autant que ${n} repas au bœuf.`,
  },
  {
    id: "boeuf-vegetarien",
    kind: "count",
    gestures: [{ id: "repas-boeuf" }, { id: "repas-vegetarien" }],
    compute: per,
    text: (n) => `Un repas au bœuf pèse autant que ${n} repas végétariens.`,
  },
  {
    id: "avion-tgv",
    kind: "ratio",
    gestures: [{ id: "avion" }, { id: "tgv" }],
    compute: ([avion, tgv]) => compare(avion, 1, tgv, 1).ratio ?? 0,
    text: (n) => `Sur un même trajet, l’avion émet ${n} fois plus que le TGV.`,
  },
  {
    id: "bouteille-robinet",
    kind: "count",
    gestures: [{ id: "eau-bouteille" }, { id: "eau-robinet" }],
    compute: per,
    text: (n) =>
      `Un litre d’eau en bouteille, c’est autant que ${n} litres d’eau du robinet.`,
  },
  {
    id: "lait-soja",
    kind: "ratio",
    gestures: [{ id: "lait-vache" }, { id: "boisson-soja" }],
    compute: ([lait, soja]) => compare(lait, 1, soja, 1).ratio ?? 0,
    text: (n) =>
      `Un litre de lait de vache émet ${n} fois plus qu’un litre de boisson au soja.`,
  },
  {
    id: "jean-garder",
    kind: "mass",
    gestures: [{ id: "jean" }],
    compute: ([jean]) =>
      compareModes(jean, 1, "neuf", "garder")?.differenceKg ?? 0,
    text: (mass) =>
      `Garder ton jean plutôt qu’en acheter un neuf évite ${mass} de CO2e.`,
  },
  {
    id: "relais-livraison",
    kind: "mass",
    gestures: [{ id: "livraison-domicile" }, { id: "point-relais-pied" }],
    compute: ([domicile, relais]) =>
      compare(domicile, 1, relais, 1).differenceKg,
    text: (mass) =>
      `Aller à pied au point relais plutôt que te faire livrer à domicile évite ${mass} de CO2e par colis.`,
  },
];

/** Le geste tel qu'un gabarit le demande (mode d'acquisition appliqué), ou undefined. */
export function resolveRef(
  ref: GestureRef,
  lookup: (id: string) => Gesture | undefined,
): Gesture | undefined {
  const gesture = lookup(ref.id);
  if (!gesture || !ref.mode) return gesture;
  return withMode(gesture, ref.mode);
}
