// Adaptateur de données : le reste du code ne lit les gestes que par ici.
// Source : gestures.generated.json, produit par `pnpm build-gestures` depuis le CSV Impact CO2.
// Les valeurs fictives (test-gestures.ts) ne servent plus qu'aux tests. Pour changer de
// source, il suffit de remplacer `gestures` : les fonctions ci-dessous ne bougent pas.
import type { Locale } from "@/lib/i18n/routes";
import { GESTURE_NAMES_EN } from "@/lib/i18n/messages/names";
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

/**
 * Nom affiché d'un geste : celui des données en français, celui de la table des noms en
 * anglais (repli sur le français si la table l'oublie : le garde-fou du build le signale).
 */
export function gestureLabel(id: string, locale: Locale = "fr"): string {
  if (locale === "en" && GESTURE_NAMES_EN[id])
    return GESTURE_NAMES_EN[id].label;
  return getGesture(id)?.label ?? id;
}

/** Précision affichée sous le nom (« trajet court », « high-speed train »), s'il y en a une. */
export function gestureDetail(
  id: string,
  locale: Locale = "fr",
): string | undefined {
  if (locale === "en" && GESTURE_NAMES_EN[id])
    return GESTURE_NAMES_EN[id].detail;
  return getGesture(id)?.detail;
}

/** Gestes des données sans nom anglais (vide : tout va bien). */
export function missingEnglishGestureNames(
  list: readonly Gesture[] = gestures,
): string[] {
  return list.filter((g) => !GESTURE_NAMES_EN[g.id]).map((g) => g.id);
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
