// Deux sortes d'entrées dans le carnet : la comparaison (deux gestes, un écart en kg) et
// l'habitude (un geste tenu, aucun kg). Seules les comparaisons entrent dans les kg d'écart.
import type {
  ComparisonEntry,
  HabitEntry,
  JournalEntry,
} from "@/lib/data/types";

export const isHabit = (entry: JournalEntry): entry is HabitEntry =>
  entry.kind === "habit";

export const isComparison = (entry: JournalEntry): entry is ComparisonEntry =>
  entry.kind === undefined;

/** Choix léger : une comparaison où l'on a pris le plus léger (écart > 0). */
export const isLightChoice = (entry: JournalEntry): entry is ComparisonEntry =>
  isComparison(entry) && entry.avoidedKg > 0;

/** Écart (kg) d'une entrée : 0 pour une habitude, qui ne compte aucun kg. */
export const entryKg = (entry: JournalEntry): number =>
  isComparison(entry) ? entry.avoidedKg : 0;

/** Geste fait : le geste choisi d'une comparaison, ou celui de l'habitude. */
export const doneGesture = (entry: JournalEntry): string =>
  isComparison(entry)
    ? entry.chosen === "a"
      ? entry.gestureA
      : entry.gestureB
    : entry.gesture;
