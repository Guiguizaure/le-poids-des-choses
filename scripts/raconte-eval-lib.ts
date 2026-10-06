// Jeu de phrases de « Raconte ta journée » (docs/raconte-phrases.md) : lecture du tableau et
// notation des détections. Utilisé par scripts/raconte-eval.ts (vrai modèle, à la main).
import type { Detection } from "../src/lib/raconte/detections";

export type Expected = {
  gestureId: string;
  quantity: number | null;
  mode: string | null;
};
export type EvalCase = {
  id: number;
  text: string;
  expected: Expected[];
  trap: string;
};

/** « velo@12 », « jean[occasion] », « ter » → geste attendu. */
export function parseExpectedItem(value: string): Expected {
  const match = value
    .trim()
    .match(/^([a-z0-9-]+)(?:@(\d+))?(?:\[([a-z-]+)\])?$/);
  if (!match) throw new Error(`Attendu illisible : « ${value} »`);
  return {
    gestureId: match[1],
    quantity: match[2] ? Number(match[2]) : null,
    mode: match[3] ?? null,
  };
}

/** Lignes du tableau Markdown (| # | Phrase | Attendu | Piège |). */
export function parseCases(markdown: string): EvalCase[] {
  const cases: EvalCase[] = [];
  for (const line of markdown.split("\n")) {
    const cells = line.split("|").map((cell) => cell.trim());
    if (cells.length < 6 || !/^\d+$/.test(cells[1])) continue;
    const [, id, phrase, expected, trap] = cells;
    cases.push({
      id: Number(id),
      text: phrase === "(vide)" ? "" : phrase,
      expected:
        expected === "—" ? [] : expected.split(",").map(parseExpectedItem),
      trap,
    });
  }
  return cases;
}

const keyOf = (item: Expected) =>
  `${item.gestureId}${item.quantity !== null ? `@${item.quantity}` : ""}${item.mode ? `[${item.mode}]` : ""}`;

export function detectionKeys(detections: readonly Detection[]): string[] {
  return detections.map((detection) => keyOf(detection)).sort();
}

export function expectedKeys(expected: readonly Expected[]): string[] {
  return expected.map(keyOf).sort();
}

/** Bonnes détections (multiensemble commun), en trop, manquées. */
export function score(expected: readonly string[], got: readonly string[]) {
  const left = [...expected];
  let matched = 0;
  for (const key of got) {
    const index = left.indexOf(key);
    if (index >= 0) {
      left.splice(index, 1);
      matched += 1;
    }
  }
  return {
    matched,
    extra: got.length - matched,
    missed: left.length,
    exact: matched === expected.length && got.length === expected.length,
  };
}
