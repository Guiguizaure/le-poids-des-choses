// Textes du jardin (tutoiement en français, « you » en anglais). Les phrases sont dans
// src/lib/i18n/messages/garden.ts (GARDEN_TEXT) ; ici, le choix de la phrase.
import type { Locale } from "@/lib/i18n/routes";
import { GARDEN_TEXT } from "@/lib/i18n/messages/garden";
import { ANIMAL_NAMES, IN_SEASON } from "@/lib/i18n/messages/names";
import type { AnimalKind, GardenState, WaterReveal } from "./model";
import type { Season } from "./seasons";

/** « Encore 2 choix légers avant l’arrivée de la coccinelle » (vide quand tous sont là). */
export function nextAnimalMessage(
  next: { kind: AnimalKind; remaining: number } | null,
  locale: Locale = "fr",
): string {
  if (!next) return "";
  return GARDEN_TEXT[locale].nextAnimal(
    next.remaining,
    ANIMAL_NAMES[locale][next.kind],
  );
}

/** « Et un papillon arrive ! », « Et une coccinelle arrive ! » */
export function arrivalExclamation(
  kind: AnimalKind,
  locale: Locale = "fr",
): string {
  return GARDEN_TEXT[locale].arrivalExclamation(ANIMAL_NAMES[locale][kind]);
}

/**
 * Titre de la révélation selon le stade : « Une petite pousse va sortir de terre », « Une fleur
 * va pousser dans ton jardin »… ; jardin plein, la plus ancienne plante « va grandir ».
 */
export function revealTitle(
  reveal: {
    plant: { kind: { type: "tree" | "flower" }; stage: string };
    isNew: boolean;
  },
  locale: Locale = "fr",
): string {
  const t = GARDEN_TEXT[locale];
  const tree = reveal.plant.kind.type === "tree";
  if (!reveal.isNew) return t.revealGrow(tree);
  if (reveal.plant.stage === "pousse") return t.revealSprout;
  return t.revealNew(tree);
}

/**
 * « Une coccinelle s'est installée dans ton jardin » ; si elle n'est pas visible en ce moment
 * (hiver, nuit), on dit quand la voir : elle n'est jamais perdue.
 */
export function arrivalMessage(
  kind: AnimalKind,
  away: "saison" | "nuit" | "assoupi" | null = null,
  locale: Locale = "fr",
): string {
  return GARDEN_TEXT[locale].arrival(
    ANIMAL_NAMES[locale][kind],
    away === "saison" || away === "nuit" ? away : null,
  );
}

/** « 2 choix légers » ; en anglais, « 0 lighter choices », « 1 lighter choice ». */
export function plural(
  count: number,
  singular: string,
  pluralForm: string,
  locale: Locale = "fr",
): string {
  return GARDEN_TEXT[locale].plural(count, singular, pluralForm);
}

/** « au printemps », « en été », « en automne », « en hiver » */
export function inSeason(season: Season, locale: Locale = "fr"): string {
  return IN_SEASON[locale][season];
}

/**
 * Description accessible : « Jardin : 12 plantes dont 2 épanouies, 3 animaux, en automne ».
 * La saison vient en dernier (avant l'assoupissement).
 */
export function gardenDescription(
  state: GardenState,
  season: Season | null = null,
  live: { visitors: number; night: boolean } = { visitors: 0, night: false },
  locale: Locale = "fr",
): string {
  const t = GARDEN_TEXT[locale].description;
  const visitors = live.visitors > 0 ? `, ${t.visitors(live.visitors)}` : "";
  const when =
    (season ? `, ${inSeason(season, locale)}` : "") +
    (live.night ? `, ${t.night}` : "");
  if (state.plants.length === 0) return `${t.empty}${visitors}${when}`;
  const bloomed = state.plants.filter((plant) => plant.bloom > 0).length;
  const parts = [
    t.plants(state.plants.length) + (bloomed > 0 ? t.bloomed(bloomed) : ""),
  ];
  if (state.unlocked.length > 0) parts.push(t.animals(state.unlocked.length));
  const text = t.garden(`${parts.join(", ")}${visitors}${when}`);
  return state.asleep ? `${text}, ${t.asleep}` : text;
}

/**
 * Après une habitude : « Ton jardin est arrosé : 2 plantes avancent d’un cran », ou le
 * prochain cran, ou « déjà arrosé aujourd’hui ». Jamais de kg.
 */
export function wateringMessage(
  reveal: WaterReveal,
  locale: Locale = "fr",
): string {
  const t = GARDEN_TEXT[locale].watering;
  if (reveal.plantCount === 0) return t.noPlant;
  if (!reveal.newDay) return t.already;
  if (reveal.moved.length > 0) return t.moved(reveal.moved.length);
  if (reveal.nextStepIn === null) return t.allBloomed;
  return t.next(reveal.nextStepIn);
}

/** Titre de la carte après une habitude : « Une fleur s’épanouit », « Un arbre grandit »… */
export function wateringTitle(
  reveal: WaterReveal,
  locale: Locale = "fr",
): string {
  const t = GARDEN_TEXT[locale].watering;
  const plant = reveal.featured;
  if (!plant) return reveal.newDay ? t.titleWatered : t.titleNoted;
  const tree = plant.kind.type === "tree";
  return plant.bloom > 0 ? t.bloom(tree) : t.grow(tree);
}
