import { avoidedKg, compare, withMode } from "@/lib/calc";
import { getGesture } from "@/lib/data";
import type {
  AcquisitionMode,
  Choice,
  ComparisonEntry,
  Gesture,
  HabitEntry,
} from "@/lib/data/types";
import { isHabitGesture } from "@/lib/habits";

export type NewEntry = {
  gestureA: string;
  gestureB: string;
  quantity: number;
  chosen: Choice;
  modeA?: AcquisitionMode;
  modeB?: AcquisitionMode;
  /** Espèce choisie pour la plante (choix léger seulement), sinon le jardin choisit. */
  species?: string;
};

function resolve(id: string, mode: AcquisitionMode | undefined): Gesture {
  const gesture = getGesture(id);
  if (!gesture) throw new Error(`Geste inconnu : ${id}`);
  if (!mode) return gesture;
  const moded = withMode(gesture, mode);
  if (!moded) throw new Error(`Mode « ${mode} » indisponible pour ${id}`);
  return moded;
}

export function newEntryId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Crée une entrée de carnet : l'écart (kg) est calculé et figé au moment du choix. */
export function createEntry(
  input: NewEntry,
  { now = new Date(), id = newEntryId() }: { now?: Date; id?: string } = {},
): ComparisonEntry {
  const a = resolve(input.gestureA, input.modeA);
  const b = resolve(input.gestureB, input.modeB);
  const comparison = compare(a, input.quantity, b, input.quantity);
  const entry: ComparisonEntry = {
    id,
    date: now.toISOString(),
    gestureA: input.gestureA,
    gestureB: input.gestureB,
    quantity: input.quantity,
    chosen: input.chosen,
    avoidedKg: Math.round(avoidedKg(comparison, input.chosen) * 1000) / 1000,
  };
  if (input.modeA) entry.modeA = input.modeA;
  if (input.modeB) entry.modeB = input.modeB;
  // Un choix plus lourd ne fait rien pousser : pas d'espèce à garder.
  if (input.species && entry.avoidedKg > 0) entry.species = input.species;
  return entry;
}

/** Crée une entrée « habitude » : un geste tenu, sans comparaison ni kg. */
export function createHabitEntry(
  gesture: string,
  { now = new Date(), id = newEntryId() }: { now?: Date; id?: string } = {},
): HabitEntry {
  if (!isHabitGesture(gesture))
    throw new Error(`Ce geste ne se note pas en habitude : ${gesture}`);
  return { kind: "habit", id, date: now.toISOString(), gesture };
}
