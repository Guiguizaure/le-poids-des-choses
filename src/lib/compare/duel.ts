// Règles du parcours : quels gestes peuvent s'affronter, curseurs, inclinaison, entrées.
import { compare, type Comparison } from "@/lib/calc";
import { getGesture, getGestures } from "@/lib/data";
import type {
  AcquisitionMode,
  Category,
  Choice,
  Gesture,
  Unit,
} from "@/lib/data/types";
import type { NewEntry } from "@/lib/journal/entry";

export const CATEGORY_ORDER: readonly Category[] = [
  "transport",
  "alimentation",
  "boisson",
  "habillement",
  "numerique",
  "livraison",
  "maison",
];

export function gesturesIn(category: Category): Gesture[] {
  return getGestures().filter((gesture) => gesture.category === category);
}

/** Seconds possibles : même unité (km avec km, repas avec repas, litre avec litre…). */
export function compatibleGestures(firstId: string): Gesture[] {
  const first = getGesture(firstId);
  if (!first || first.unit === "objet") return [];
  return getGestures().filter(
    (gesture) => gesture.id !== first.id && gesture.unit === first.unit,
  );
}

export function areComparable(aId: string, bId: string): boolean {
  return compatibleGestures(aId).some((gesture) => gesture.id === bId);
}

export type QuantitySlider = {
  min: number;
  max: number;
  default: number;
  unit: string;
  label: string;
  /** Échelle logarithmique (distances : 1 à 1 000 km). */
  logarithmic: boolean;
};

export const SLIDERS: Partial<Record<Unit, QuantitySlider>> = {
  km: {
    min: 1,
    max: 1000,
    default: 50,
    unit: "km",
    label: "Distance",
    logarithmic: true,
  },
};

/** Quantité par défaut d'un duel : celle du curseur, sinon 1 (un repas, un objet). */
export function defaultQuantity(unit: Unit): number {
  return SLIDERS[unit]?.default ?? 1;
}

export function isValidQuantity(unit: Unit, quantity: number): boolean {
  const slider = SLIDERS[unit];
  if (!slider) return quantity === 1;
  return (
    Number.isInteger(quantity) &&
    quantity >= slider.min &&
    quantity <= slider.max
  );
}

/** Position du curseur (0 à 1000) ↔ quantité, en échelle logarithmique pour les distances. */
export const SLIDER_STEPS = 1000;

export function quantityFromPosition(
  slider: QuantitySlider,
  position: number,
): number {
  const p = Math.min(SLIDER_STEPS, Math.max(0, position)) / SLIDER_STEPS;
  const value = slider.logarithmic
    ? slider.min * Math.pow(slider.max / slider.min, p)
    : slider.min + p * (slider.max - slider.min);
  return Math.min(slider.max, Math.max(slider.min, Math.round(value)));
}

export function positionFromQuantity(
  slider: QuantitySlider,
  quantity: number,
): number {
  const q = Math.min(slider.max, Math.max(slider.min, quantity));
  const p = slider.logarithmic
    ? Math.log(q / slider.min) / Math.log(slider.max / slider.min)
    : (q - slider.min) / (slider.max - slider.min);
  return Math.round(p * SLIDER_STEPS);
}

/** Rapport à partir duquel la balance est penchée au maximum. */
export const TILT_MAX_RATIO = 50;

/**
 * Inclinaison de la balance (-1 à 1) : proportionnelle au logarithme du rapport, plafonnée.
 * Positive quand B (plateau droit) est le plus lourd.
 */
export function tiltFor(comparison: Comparison): number {
  if (comparison.differenceKg === 0) return 0;
  const strength =
    comparison.ratio === null
      ? 1
      : Math.min(1, Math.log(comparison.ratio) / Math.log(TILT_MAX_RATIO));
  return comparison.heavier === "b" ? strength : -strength;
}

export function duelComparison(
  aId: string,
  bId: string,
  quantity: number,
): Comparison | null {
  const a = getGesture(aId);
  const b = getGesture(bId);
  if (!a || !b) return null;
  return compare(a, quantity, b, quantity);
}

/** Entrée de carnet pour un duel entre deux gestes. */
export function duelEntry(
  aId: string,
  bId: string,
  quantity: number,
  chosen: Choice,
): NewEntry {
  return { gestureA: aId, gestureB: bId, quantity, chosen };
}

export type ObjectOption = "neuf" | "occasion" | "garder";

/** Mode réel d'une option d'objet (l'occasion peut être livrée en colis). */
export function modeFor(
  option: ObjectOption,
  delivered: boolean,
): AcquisitionMode {
  if (option === "occasion") return delivered ? "occasion-livree" : "occasion";
  return option;
}

/**
 * Entrée de carnet pour un objet. Une option plus légère que le neuf est comparée au neuf ;
 * le neuf est comparé à l'occasion (telle que réglée), ce qui en fait un choix plus lourd.
 */
export function objectEntry(
  objectId: string,
  option: ObjectOption,
  delivered: boolean,
): NewEntry {
  const occasion = modeFor("occasion", delivered);
  if (option === "neuf") {
    return {
      gestureA: objectId,
      gestureB: objectId,
      quantity: 1,
      chosen: "a",
      modeA: "neuf",
      modeB: occasion,
    };
  }
  return {
    gestureA: objectId,
    gestureB: objectId,
    quantity: 1,
    chosen: "b",
    modeA: "neuf",
    modeB: modeFor(option, delivered),
  };
}
