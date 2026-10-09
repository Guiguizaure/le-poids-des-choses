// Indices de première utilisation : un seul par situation, la première fois (jardin vide,
// première plante, saisons des espèces, premier arrosage), puis plus jamais ; et une astuce
// par saison qui commence (« saison-automne-2026 »). Mémorisés sur l'appareil seulement (clé
// versionnée) ; lecture tolérante.
import type { Season } from "@/lib/garden/seasons";

export const HINTS_KEY = "lpdc:indices:v1";

export const HINT_IDS = [
  "jardin-vide",
  "premiere-plante",
  "saisons-especes",
  "premier-arrosage",
] as const;
/** Astuce d'une saison, une fois par saison (année de la saison : l'hiver de décembre compte avec janvier). */
export type SeasonHintId = `saison-${Season}-${number}`;
export type HintId = (typeof HINT_IDS)[number] | SeasonHintId;

const SEASON_HINT = /^saison-(printemps|ete|automne|hiver)-\d{4}$/;

export function seasonHintId(season: Season, year: number): SeasonHintId {
  return `saison-${season}-${year}`;
}

/** Garde les indices connus, sans doublon : ceux de la liste dans l'ordre, puis les saisons. */
export function normalizeSeen(ids: readonly unknown[]): HintId[] {
  const set = new Set(ids.filter((id) => typeof id === "string"));
  return [
    ...HINT_IDS.filter((id) => set.has(id)),
    ...([...set].filter((id) => SEASON_HINT.test(id)).sort() as SeasonHintId[]),
  ];
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
