// « Mes habitudes » : ce que la personne déclare faire déjà, gardé sur l'appareil seulement
// (clé versionnée). Déclarer n'arrose pas le jardin : ces gestes sont seulement proposés en
// premier, et en habitude par défaut dans « Raconte ta journée ».
import { HABITS } from "./index";

export const DECLARED_HABITS_KEY = "lpdc:habitudes:v1";

export function serializeDeclared(gestures: readonly string[]): string {
  return JSON.stringify({ version: 1, gestures: normalizeDeclared(gestures) });
}

/** Garde les habitudes connues, sans doublon, dans l'ordre de la table. */
export function normalizeDeclared(gestures: readonly unknown[]): string[] {
  const set = new Set(gestures.filter((id) => typeof id === "string"));
  return HABITS.map((habit) => habit.gesture).filter((id) => set.has(id));
}

/** Lecture tolérante : format inconnu ou illisible → aucune habitude. */
export function parseDeclared(text: string | null): string[] {
  if (!text) return [];
  try {
    const value = JSON.parse(text) as { version?: unknown; gestures?: unknown };
    if (value?.version !== 1 || !Array.isArray(value.gestures)) return [];
    return normalizeDeclared(value.gestures);
  } catch {
    return [];
  }
}
