// « Le savais-tu ? » et paliers : seule la prémisse est rédigée, la valeur (déjà arrondie et
// mise en forme) vient des données. Un gabarit sans phrase dans une langue fait échouer un test.
import { defineMessages } from "../index";

/** Phrase de chaque gabarit (id de FACT_TEMPLATES), valeur déjà mise en forme. */
export const FACT_TEXTS = defineMessages<
  Record<string, (value: string) => string>
>(
  {
    "jean-voiture": (km) =>
      `Un jean neuf, c’est autant que ${km} en voiture thermique.`,
    "smartphone-tgv": (km) =>
      `Un smartphone neuf, c’est autant que ${km} en TGV.`,
    "television-voiture": (km) =>
      `Une télévision neuve, c’est autant que ${km} en voiture thermique.`,
    "ordinateur-boeuf": (n) =>
      `Un ordinateur portable neuf, c’est autant que ${n} repas au bœuf.`,
    "boeuf-vegetarien": (n) =>
      `Un repas au bœuf pèse autant que ${n} repas végétariens.`,
    "avion-tgv": (n) =>
      `Sur un même trajet, l’avion émet ${n} fois plus que le TGV.`,
    "bouteille-robinet": (n) =>
      `Un litre d’eau en bouteille, c’est autant que ${n} litres d’eau du robinet.`,
    "lait-soja": (n) =>
      `Un litre de lait de vache émet ${n} fois plus qu’un litre de boisson au soja.`,
    "jean-garder": (mass) =>
      `Garder ton jean plutôt qu’en acheter un neuf, c’est ${mass} de CO2e d’écart.`,
    "mangue-avion-bateau": (n) =>
      `Une mangue importée par avion émet ${n} fois plus qu’une mangue importée par bateau.`,
    "relais-livraison": (mass) =>
      `Aller à pied au point relais plutôt que te faire livrer à domicile, c’est ${mass} de CO2e d’écart par colis.`,
  },
  {
    "jean-voiture": (km) =>
      `A new pair of jeans weighs as much as ${km} in a petrol or diesel car.`,
    "smartphone-tgv": (km) =>
      `A new smartphone weighs as much as ${km} on the TGV (high-speed train).`,
    "television-voiture": (km) =>
      `A new television weighs as much as ${km} in a petrol or diesel car.`,
    "ordinateur-boeuf": (n) =>
      `A new laptop weighs as much as ${n} beef meals.`,
    "boeuf-vegetarien": (n) =>
      `A beef meal weighs as much as ${n} vegetarian meals.`,
    "avion-tgv": (n) =>
      `On the same journey, the plane emits ${n} times more than the TGV (high-speed train).`,
    "bouteille-robinet": (n) =>
      `A litre of bottled water weighs as much as ${n} litres of tap water.`,
    "lait-soja": (n) =>
      `A litre of cow’s milk emits ${n} times more than a litre of soya drink.`,
    "jean-garder": (mass) =>
      `Keeping your jeans rather than buying a new pair makes a ${mass} CO2e difference.`,
    "mangue-avion-bateau": (n) =>
      `A mango imported by air emits ${n} times more than a mango imported by sea.`,
    "relais-livraison": (mass) =>
      `Walking to the pickup point rather than having it delivered to your door makes a ${mass} CO2e difference per parcel.`,
  },
);

/** Unité de l'équivalence de chaque palier, accordée au nombre affiché. */
export const MILESTONE_UNITS = defineMessages<
  Record<number, (count: number) => string>
>(
  {
    10: () => "km en voiture thermique",
    50: () => "repas au bœuf",
    100: (n) => (n >= 2 ? "T-shirts en coton neufs" : "T-shirt en coton neuf"),
    250: (n) => (n >= 2 ? "jeans neufs" : "jean neuf"),
    500: () => "km en avion (trajet court)",
    1000: () => "km en voiture thermique",
  },
  {
    10: () => "km in a petrol or diesel car",
    50: (n) => (n === 1 ? "beef meal" : "beef meals"),
    100: (n) => (n === 1 ? "new cotton T-shirt" : "new cotton T-shirts"),
    250: (n) => (n === 1 ? "new pair of jeans" : "new pairs of jeans"),
    500: () => "km by plane (short-haul flight)",
    1000: () => "km in a petrol or diesel car",
  },
);
