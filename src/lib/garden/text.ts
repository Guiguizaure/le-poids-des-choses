// Textes du jardin (français, tutoiement).
import type { AnimalKind, GardenState, WaterReveal } from "./model";
import { SEASON_LABELS, type Season } from "./seasons";

type AnimalName = {
  name: string;
  feminine: boolean;
  /** « du papillon », « de l’oiseau » */ of: string;
};

export const ANIMAL_NAMES: Record<AnimalKind, AnimalName> = {
  butterfly: { name: "papillon", feminine: false, of: "du papillon" },
  ladybug: { name: "coccinelle", feminine: true, of: "de la coccinelle" },
  bird: { name: "oiseau", feminine: false, of: "de l’oiseau" },
  snail: { name: "escargot", feminine: false, of: "de l’escargot" },
  bee: { name: "abeille", feminine: true, of: "de l’abeille" },
  // h aspiré : « du hérisson »
  hedgehog: { name: "hérisson", feminine: false, of: "du hérisson" },
};

/** « Encore 2 choix légers avant l’arrivée de la coccinelle » (vide quand tous sont là). */
export function nextAnimalMessage(
  next: { kind: AnimalKind; remaining: number } | null,
): string {
  if (!next) return "";
  return `Encore ${plural(next.remaining, "choix léger", "choix légers")} avant l’arrivée ${ANIMAL_NAMES[next.kind].of}`;
}

/** « Et un papillon arrive ! », « Et une coccinelle arrive ! » */
export function arrivalExclamation(kind: AnimalKind): string {
  const { name, feminine } = ANIMAL_NAMES[kind];
  return `Et ${feminine ? "une" : "un"} ${name} arrive !`;
}

/**
 * Titre de la révélation selon le stade : « Une petite pousse va sortir de terre », « Une fleur
 * va pousser dans ton jardin »… ; jardin plein, la plus ancienne plante « va grandir ».
 */
export function revealTitle(reveal: {
  plant: { kind: { type: "tree" | "flower" }; stage: string };
  isNew: boolean;
}): string {
  const tree = reveal.plant.kind.type === "tree";
  if (!reveal.isNew)
    return tree
      ? "Un arbre va grandir dans ton jardin"
      : "Une fleur va grandir dans ton jardin";
  if (reveal.plant.stage === "pousse")
    return "Une petite pousse va sortir de terre";
  return tree
    ? "Un arbre va pousser dans ton jardin"
    : "Une fleur va pousser dans ton jardin";
}

/** « Une coccinelle s'est installée dans ton jardin » */
export function arrivalMessage(kind: AnimalKind): string {
  const { name, feminine } = ANIMAL_NAMES[kind];
  return `${feminine ? "Une" : "Un"} ${name} s’est installé${feminine ? "e" : ""} dans ton jardin`;
}

export function plural(
  count: number,
  singular: string,
  pluralForm: string,
): string {
  return `${count} ${count > 1 ? pluralForm : singular}`;
}

/** « au printemps », « en été », « en automne », « en hiver » */
export function inSeason(season: Season): string {
  return season === "printemps"
    ? "au printemps"
    : `en ${SEASON_LABELS[season]}`;
}

/**
 * Description accessible : « Jardin : 12 plantes dont 2 épanouies, 3 animaux, en automne ».
 * La saison vient en dernier (avant l'assoupissement).
 */
export function gardenDescription(
  state: GardenState,
  season: Season | null = null,
): string {
  const when = season ? `, ${inSeason(season)}` : "";
  if (state.plants.length === 0) return `Jardin vide${when}`;
  const bloomed = state.plants.filter((plant) => plant.bloom > 0).length;
  const parts = [
    plural(state.plants.length, "plante", "plantes") +
      (bloomed > 0 ? ` dont ${plural(bloomed, "épanouie", "épanouies")}` : ""),
  ];
  if (state.unlocked.length > 0)
    parts.push(plural(state.unlocked.length, "animal", "animaux"));
  const text = `Jardin : ${parts.join(", ")}${when}`;
  return state.asleep ? `${text}, assoupi sous la brume` : text;
}

/**
 * Après une habitude : « Ton jardin est arrosé : 2 plantes avancent d’un cran », ou le
 * prochain cran, ou « déjà arrosé aujourd’hui ». Jamais de kg.
 */
export function wateringMessage(reveal: WaterReveal): string {
  if (reveal.plantCount === 0)
    return "Ton jardin est arrosé. Il attend sa première pousse : compare deux gestes pour la planter.";
  if (!reveal.newDay)
    return "Ton jardin est déjà arrosé aujourd’hui : c’est noté.";
  if (reveal.moved.length > 0)
    return `Ton jardin est arrosé : ${plural(reveal.moved.length, "plante avance", "plantes avancent")} d’un cran.`;
  if (reveal.nextStepIn === null)
    return "Ton jardin est arrosé : toutes tes plantes sont épanouies.";
  return `Ton jardin est arrosé. Encore ${plural(reveal.nextStepIn, "jour arrosé", "jours arrosés")} avant le prochain cran.`;
}

/** Titre de la carte après une habitude : « Une fleur s’épanouit », « Un arbre grandit »… */
export function wateringTitle(reveal: WaterReveal): string {
  const plant = reveal.featured;
  if (!plant) return reveal.newDay ? "Ton jardin est arrosé" : "C’est noté";
  const tree = plant.kind.type === "tree";
  if (plant.bloom > 0)
    return tree ? "Un arbre s’épanouit" : "Une fleur s’épanouit";
  return tree ? "Un arbre grandit" : "Une fleur grandit";
}
