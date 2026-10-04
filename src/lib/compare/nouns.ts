// Noms des gestes dans les phrases (article, genre), pour accorder « plus léger / plus légère ».
import { getGesture } from "@/lib/data";

export type Noun = { text: string; feminine: boolean };

/** Gestes comparables (km, repas, heure) : « le train », « la voiture »… */
const GESTURE_NOUNS: Record<string, Noun> = {
  tgv: { text: "le TGV", feminine: false },
  ter: { text: "le TER", feminine: false },
  avion: { text: "l’avion", feminine: false },
  voiture: { text: "la voiture", feminine: true },
  bus: { text: "le bus", feminine: false },
  metro: { text: "le métro", feminine: false },
  velo: { text: "le vélo", feminine: false },
  marche: { text: "la marche", feminine: true },
  "repas-vegetarien": { text: "le repas végétarien", feminine: false },
  "repas-vegetalien": { text: "le repas végétal", feminine: false },
  "repas-poulet": { text: "le repas au poulet", feminine: false },
  "repas-boeuf": { text: "le repas au bœuf", feminine: false },
  "repas-poisson": { text: "le repas au poisson", feminine: false },
  streaming: { text: "le streaming vidéo", feminine: false },
  visio: { text: "la visioconférence", feminine: true },
};

export function gestureNoun(id: string): Noun {
  const known = GESTURE_NOUNS[id];
  if (known) return known;
  const label = getGesture(id)?.label ?? id;
  return {
    text: `le ${label.charAt(0).toLowerCase()}${label.slice(1)}`,
    feminine: false,
  };
}

/** « le train » → « Le train » */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** « que » + nom ; les noms portent leur article (« que l’avion »), pas d'élision. */
export function thanNoun(noun: Noun): string {
  return `que ${noun.text}`;
}

// ---- Objets ---------------------------------------------------------------------------------

export type ObjectNoun = {
  /** « Un jean » */
  indefinite: string;
  /** « d’un jean neuf » (Fabrication …) */
  newOne: string;
  feminine: boolean;
  plural: boolean;
};

const OBJECT_NOUNS: Record<string, ObjectNoun> = {
  jean: {
    indefinite: "Un jean",
    newOne: "d’un jean neuf",
    feminine: false,
    plural: false,
  },
  tshirt: {
    indefinite: "Un t-shirt en coton",
    newOne: "d’un t-shirt neuf",
    feminine: false,
    plural: false,
  },
  pull: {
    indefinite: "Un pull en laine",
    newOne: "d’un pull neuf",
    feminine: false,
    plural: false,
  },
  chaussures: {
    indefinite: "Des chaussures de sport",
    newOne: "de chaussures neuves",
    feminine: true,
    plural: true,
  },
  smartphone: {
    indefinite: "Un smartphone",
    newOne: "d’un smartphone neuf",
    feminine: false,
    plural: false,
  },
  "ordinateur-portable": {
    indefinite: "Un ordinateur portable",
    newOne: "d’un ordinateur portable neuf",
    feminine: false,
    plural: false,
  },
  television: {
    indefinite: "Une télévision",
    newOne: "d’une télévision neuve",
    feminine: true,
    plural: false,
  },
};

export function objectNoun(id: string): ObjectNoun {
  const known = OBJECT_NOUNS[id];
  if (known) return known;
  const label = getGesture(id)?.label ?? id;
  return {
    indefinite: label,
    newOne: `de ${label.toLowerCase()}`,
    feminine: false,
    plural: false,
  };
}

/** « le tien », « la tienne », « les tiennes » (toi) ; « le mien »… (moi). */
export function possessive(noun: ObjectNoun, person: "toi" | "moi"): string {
  const stem = person === "toi" ? "tien" : "mien";
  if (noun.plural) return `les ${stem}${noun.feminine ? "nes" : "s"}`;
  return noun.feminine ? `la ${stem}ne` : `le ${stem}`;
}
