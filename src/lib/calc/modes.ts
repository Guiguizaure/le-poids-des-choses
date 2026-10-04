import type { AcquisitionMode, Gesture } from "@/lib/data/types";
import { compare, type Comparison } from "./compare";

export const ACQUISITION_MODE_LABELS: Record<AcquisitionMode, string> = {
  neuf: "Neuf",
  occasion: "D'occasion",
  "occasion-livree": "D'occasion, livré",
  garder: "Garder le mien",
};

/** Modes disponibles pour un geste (vide hors unité « objet »). */
export function acquisitionModes(gesture: Gesture): AcquisitionMode[] {
  return (Object.keys(gesture.modes ?? {}) as AcquisitionMode[]).filter(
    (mode) => gesture.modes?.[mode] !== undefined,
  );
}

/**
 * Le même objet vu sous un mode d'acquisition, sous forme de geste ordinaire : il se passe donc
 * tel quel à `emissions` et `compare`. Undefined si le mode n'existe pas pour cet objet.
 */
export function withMode(
  gesture: Gesture,
  mode: AcquisitionMode,
): Gesture | undefined {
  const value = gesture.modes?.[mode];
  if (!value) return undefined;
  return {
    ...gesture,
    id: `${gesture.id}@${mode}`,
    label: `${gesture.label} — ${ACQUISITION_MODE_LABELS[mode].toLowerCase()}`,
    kgCo2ePerUnit: value.kgCo2e,
    sourceId: value.sourceId,
    sourceUrl: value.sourceUrl,
  };
}

/** Compare deux modes d'acquisition d'un même objet (A = modeA, B = modeB). */
export function compareModes(
  gesture: Gesture,
  quantity: number,
  modeA: AcquisitionMode,
  modeB: AcquisitionMode,
): Comparison | undefined {
  const a = withMode(gesture, modeA);
  const b = withMode(gesture, modeB);
  if (!a || !b) return undefined;
  return compare(a, quantity, b, quantity);
}
