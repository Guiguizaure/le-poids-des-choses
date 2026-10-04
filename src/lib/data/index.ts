// Adaptateur de données : le reste du code ne lit les gestes que par ici.
// Pour brancher plus tard les données générées depuis l'API, remplacer `gestures`
// par le contenu du fichier généré (même type `Gesture[]`) ; les fonctions ci-dessous
// et leurs appelants ne changent pas.
import { testGestures } from "./test-gestures";
import type { Category, Gesture } from "./types";

const gestures: readonly Gesture[] = testGestures;

export function getGestures(): readonly Gesture[] {
  return gestures;
}

export function getGesture(id: string): Gesture | undefined {
  return gestures.find((gesture) => gesture.id === id);
}

export function getGesturesByCategory(category: Category): readonly Gesture[] {
  return gestures.filter((gesture) => gesture.category === category);
}

/** Vrai tant qu'il reste au moins une donnée fictive. */
export function hasFictiveData(): boolean {
  return gestures.some(
    (gesture) => gesture.fictive || gesture.source === "fictive",
  );
}

export type { Category, Choice, Gesture, JournalEntry, Unit } from "./types";
