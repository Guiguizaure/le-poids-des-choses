import type { Choice } from "@/lib/data/types";
import { emissions, type Emitter } from "./emissions";

/** Écart relatif (par rapport au plus lourd) en dessous duquel deux gestes comptent pour égaux. */
const ALMOST_EQUAL_RATIO = 0.1;

export type Comparison = {
  emissionsA: number;
  emissionsB: number;
  /** Côté le plus léger. À égalité, 'a' (l'écart vaut alors 0, rien n'est compté). */
  lighter: Choice;
  heavier: Choice;
  differenceKg: number;
  /** Plus lourd / plus léger ; null si le plus léger vaut 0 (ex. le vélo). */
  ratio: number | null;
  /** Écart inférieur à 10 % du plus lourd. */
  almostEqual: boolean;
};

export function compare(
  a: Emitter,
  qa: number,
  b: Emitter,
  qb: number,
): Comparison {
  const emissionsA = emissions(a, qa);
  const emissionsB = emissions(b, qb);
  const lighter: Choice = emissionsB < emissionsA ? "b" : "a";
  const heavier: Choice = lighter === "a" ? "b" : "a";
  const light = lighter === "a" ? emissionsA : emissionsB;
  const heavy = lighter === "a" ? emissionsB : emissionsA;
  const differenceKg = heavy - light;

  return {
    emissionsA,
    emissionsB,
    lighter,
    heavier,
    differenceKg,
    ratio: light === 0 ? null : heavy / light,
    almostEqual: heavy === 0 || differenceKg / heavy < ALMOST_EQUAL_RATIO,
  };
}

/**
 * Écart compté pour un choix : (lourd − léger) si on prend le plus léger, sinon 0. Jamais
 * négatif. Ce n'est pas un gain mesuré : seulement l'écart avec l'autre option comparée.
 */
export function avoidedKg(comparison: Comparison, chosen: Choice): number {
  return chosen === comparison.lighter ? comparison.differenceKg : 0;
}
