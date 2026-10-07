// Indices de première utilisation : un seul par situation, la première fois (jardin vide,
// première plante, premier arrosage), puis plus jamais. Mémorisés sur l'appareil seulement
// (clé versionnée) ; lecture tolérante.
export const HINTS_KEY = "lpdc:indices:v1";

export const HINT_IDS = [
  "jardin-vide",
  "premiere-plante",
  "premier-arrosage",
] as const;
export type HintId = (typeof HINT_IDS)[number];

/** Garde les indices connus, sans doublon, dans l'ordre de la liste. */
export function normalizeSeen(ids: readonly unknown[]): HintId[] {
  const set = new Set(ids.filter((id) => typeof id === "string"));
  return HINT_IDS.filter((id) => set.has(id));
}

export function serializeSeen(ids: readonly HintId[]): string {
  return JSON.stringify({ version: 1, seen: normalizeSeen(ids) });
}

/** Format inconnu ou illisible : aucun indice vu (au pire, un indice revient une fois). */
export function parseSeen(text: string | null): HintId[] {
  if (!text) return [];
  try {
    const value = JSON.parse(text) as { version?: unknown; seen?: unknown };
    if (value?.version !== 1 || !Array.isArray(value.seen)) return [];
    return normalizeSeen(value.seen);
  } catch {
    return [];
  }
}
