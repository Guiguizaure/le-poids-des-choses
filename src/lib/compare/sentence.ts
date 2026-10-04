// Phrase de résultat du duel et équivalence parlante (fonctions pures).
import { formatMass, type Comparison } from "@/lib/calc";
import type { Unit } from "@/lib/data/types";
import { capitalize, type Noun, thanNoun } from "./nouns";

/** Au-delà, on écrit « plus de 100 fois ». */
export const RATIO_CAP = 100;

/** « 1,8 », « 12 » : une décimale sous 10, sinon un entier. */
export function formatRatio(ratio: number): string {
  const rounded = ratio < 10 ? Math.round(ratio * 10) / 10 : Math.round(ratio);
  return String(rounded).replace(".", ",");
}

const CONTEXT: Record<Unit, string> = {
  km: "Sur ce trajet, ",
  repas: "",
  heure: "Sur cette durée, ",
  objet: "",
};

/** « 76 fois plus léger », « plus de 100 fois plus légère ». */
export function lighterBy(ratio: number, feminine: boolean): string {
  const light = feminine ? "légère" : "léger";
  if (ratio > RATIO_CAP) return `plus de ${RATIO_CAP} fois plus ${light}`;
  return `${formatRatio(ratio)} fois plus ${light}`;
}

/**
 * Phrase de résultat d'un duel entre deux gestes : « Sur ce trajet, le train est 76 fois plus
 * léger que l’avion, soit 11 kg de CO2e en moins. » Cas particuliers : presque égaux, zéro
 * émission (le plus léger vaut 0), plus de 100 fois.
 */
export function resultSentence(
  comparison: Comparison,
  nouns: { a: Noun; b: Noun },
  unit: Unit,
): string {
  const lighter = comparison.lighter === "a" ? nouns.a : nouns.b;
  const heavier = comparison.lighter === "a" ? nouns.b : nouns.a;
  const context = CONTEXT[unit];
  const start = (text: string) =>
    context ? `${context}${text}` : capitalize(text);
  const gap = `soit ${formatMass(comparison.differenceKg)} de CO2e en moins`;

  if (comparison.almostEqual) {
    return `${start(`${nouns.a.text} et ${nouns.b.text}`)} pèsent presque autant.`;
  }
  if (comparison.ratio === null) {
    return `${start(lighter.text)}, c’est zéro émission, contre ${formatMass(
      comparison.differenceKg,
    )} de CO2e pour ${heavier.text}.`;
  }
  return `${start(lighter.text)} est ${lighterBy(comparison.ratio, lighter.feminine)} ${thanNoun(heavier)}, ${gap}.`;
}

/**
 * Phrase des objets : l'option retenue comparée au neuf (ou, si c'est le neuf, à l'occasion).
 * « D’occasion plutôt que neuf : 35 fois plus léger, soit 24 kg de CO2e en moins. »
 */
export function objectSentence(
  chosenLabel: string,
  otherLabel: string,
  chosenKg: number,
  otherKg: number,
): string {
  const head = `${chosenLabel} plutôt que ${otherLabel}`;
  const diff = Math.abs(otherKg - chosenKg);
  const almostEqual =
    Math.max(chosenKg, otherKg) === 0 ||
    diff / Math.max(chosenKg, otherKg) < 0.1;
  if (almostEqual) return `${head} : presque autant.`;
  if (chosenKg > otherKg) {
    if (otherKg === 0) return `${head} : ${formatMass(diff)} de CO2e de plus.`;
    const ratio = chosenKg / otherKg;
    const times =
      ratio > RATIO_CAP
        ? `plus de ${RATIO_CAP} fois`
        : `${formatRatio(ratio)} fois`;
    return `${head} : ${times} plus lourd, soit ${formatMass(diff)} de CO2e de plus.`;
  }
  // Objets : 0 kg veut dire « aucune nouvelle fabrication » (hypothèse de méthode : entretien et
  // fin de vie non comptés), pas « zéro émission », réservé à la marche.
  if (chosenKg === 0)
    return `${head} : aucune nouvelle fabrication, soit ${formatMass(diff)} de CO2e en moins.`;
  return `${head} : ${lighterBy(otherKg / chosenKg, false)}, soit ${formatMass(diff)} de CO2e en moins.`;
}

/** kg CO2e d'un km en voiture thermique (facteur Impact CO2 « voiturethermique »). */
export function carKmFor(kg: number, carKgPerKm: number): number {
  if (!(kg > 0) || !(carKgPerKm > 0)) return 0;
  return kg / carKgPerKm;
}

/** Arrondi lisible : 2 chiffres significatifs (« 77 km », « 1 300 km »). */
function niceKm(km: number): string {
  const rounded = Number(km.toPrecision(2));
  return new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 })
    .format(rounded)
    .replace(/ | /g, " ");
}

/** « L’écart équivaut à 77 km en voiture thermique. » (vide si pas d'écart) */
export function equivalenceSentence(
  differenceKg: number,
  carKgPerKm: number,
): string {
  const km = carKmFor(differenceKg, carKgPerKm);
  if (km === 0) return "";
  if (km < 1) return "L’écart équivaut à moins d’1 km en voiture thermique.";
  return `L’écart équivaut à ${niceKm(km)} km en voiture thermique.`;
}
