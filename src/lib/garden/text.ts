// Textes du jardin (français, tutoiement).
import type { AnimalKind, GardenState } from "./model";

type AnimalName = { name: string; feminine: boolean };

export const ANIMAL_NAMES: Record<AnimalKind, AnimalName> = {
  butterfly: { name: "papillon", feminine: false },
  ladybug: { name: "coccinelle", feminine: true },
  bird: { name: "oiseau", feminine: false },
  snail: { name: "escargot", feminine: false },
  bee: { name: "abeille", feminine: true },
  hedgehog: { name: "hérisson", feminine: false },
};

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
