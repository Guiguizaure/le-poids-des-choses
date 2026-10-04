// Textes du jardin (français, tutoiement).
import type { AnimalKind, GardenState } from "./model";

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

/** Description accessible : « 12 plantes, 3 animaux ». */
export function gardenDescription(state: GardenState): string {
  if (state.plants.length === 0) return "Jardin vide";
  const parts = [plural(state.plants.length, "plante", "plantes")];
  if (state.unlocked.length > 0)
    parts.push(plural(state.unlocked.length, "animal", "animaux"));
  const text = `Jardin : ${parts.join(", ")}`;
  return state.asleep ? `${text}, assoupi sous la brume` : text;
}
