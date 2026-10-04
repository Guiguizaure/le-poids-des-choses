// Adaptateur de données : le reste du code ne lit les gestes que par ici.
// Source : gestures.generated.json, produit par `pnpm build-gestures` depuis le CSV Impact CO2.
// Les valeurs fictives (test-gestures.ts) ne servent plus qu'aux tests. Pour changer de
// source, il suffit de remplacer `gestures` : les fonctions ci-dessous ne bougent pas.
import generated from "./gestures.generated.json";
import type { Category, Gesture } from "./types";

const gestures = generated.gestures as readonly Gesture[];

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

export type {
  AcquisitionMode,
  Category,
  Choice,
  Gesture,
  JournalEntry,
  ModeValue,
  Unit,
  ValueMethod,
  ValuePart,
} from "./types";
