// Phrase de résultat du duel et équivalence parlante (fonctions pures). Textes dans
// src/lib/i18n/messages/compare.ts (SENTENCES).
import { formatMass, type Comparison } from "@/lib/calc";
import type { Unit } from "@/lib/data/types";
import { intlLocale, type Locale } from "@/lib/i18n";
import { SENTENCES } from "@/lib/i18n/messages/compare";
import { capitalize, type Noun, thanNoun } from "./nouns";

/** Au-delà, on écrit « plus de 100 fois ». */
export const RATIO_CAP = 100;

/** « 1,8 », « 12 » : une décimale sous 10, sinon un entier (« 1.8 » en anglais). */
export function formatRatio(ratio: number, locale: Locale = "fr"): string {
  const rounded = ratio < 10 ? Math.round(ratio * 10) / 10 : Math.round(ratio);
  return String(rounded).replace(".", SENTENCES[locale].decimal);
}

function times(ratio: number, locale: Locale): string {
  const t = SENTENCES[locale];
  return ratio > RATIO_CAP
    ? t.moreThanTimes(RATIO_CAP)
    : t.times(formatRatio(ratio, locale));
}

/** « 76 fois plus léger », « plus de 100 fois plus légère », « 76 times lighter ». */
export function lighterBy(
  ratio: number,
  feminine: boolean,
  locale: Locale = "fr",
): string {
  return SENTENCES[locale].lighterBy(times(ratio, locale), feminine);
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
  locale: Locale = "fr",
): string {
  const t = SENTENCES[locale];
  const lighter = comparison.lighter === "a" ? nouns.a : nouns.b;
  const heavier = comparison.lighter === "a" ? nouns.b : nouns.a;
  const context = t.context[unit];
  const start = (text: string) =>
    context ? `${context}${text}` : capitalize(text);
  const mass = formatMass(comparison.differenceKg, locale);

  if (comparison.almostEqual) {
    return t.almostEqual(start(t.and(nouns.a.text, nouns.b.text)));
  }
  if (comparison.ratio === null) {
    return t.zero(start(lighter.text), mass, heavier.text);
  }
  return t.lighterThan(
    start(lighter.text),
    lighterBy(comparison.ratio, lighter.feminine, locale),
    thanNoun(heavier, locale),
    t.less(mass),
  );
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
  locale: Locale = "fr",
): string {
  const t = SENTENCES[locale];
  const head = t.rather(chosenLabel, otherLabel);
  const diff = Math.abs(otherKg - chosenKg);
  const mass = formatMass(diff, locale);
  const almostEqual =
    Math.max(chosenKg, otherKg) === 0 ||
    diff / Math.max(chosenKg, otherKg) < 0.1;
  if (almostEqual) return t.objectAlmost(head);
  if (chosenKg > otherKg) {
    if (otherKg === 0) return t.objectMore(head, mass);
    return t.objectHeavier(head, times(chosenKg / otherKg, locale), mass);
  }
  // Objets : 0 kg veut dire « aucune nouvelle fabrication » (hypothèse de méthode : entretien et
  // fin de vie non comptés), pas « zéro émission », réservé à la marche.
  if (chosenKg === 0) return t.objectNothingNew(head, mass);
  return t.objectLighter(
    head,
    lighterBy(otherKg / chosenKg, false, locale),
    mass,
  );
}

/** kg CO2e d'un km en voiture thermique (facteur Impact CO2 « voiturethermique »). */
export function carKmFor(kg: number, carKgPerKm: number): number {
  if (!(kg > 0) || !(carKgPerKm > 0)) return 0;
  return kg / carKgPerKm;
}

/** Arrondi lisible : 2 chiffres significatifs (« 77 km », « 1 300 km »). */
function niceKm(km: number, locale: Locale): string {
  const rounded = Number(km.toPrecision(2));
  return new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: 1 })
    .format(rounded)
    .replace(/ | /g, " ");
}

/** « L’écart équivaut à 77 km en voiture thermique. » (vide si pas d'écart) */
export function equivalenceSentence(
  differenceKg: number,
  carKgPerKm: number,
  locale: Locale = "fr",
): string {
  const t = SENTENCES[locale];
  const km = carKmFor(differenceKg, carKgPerKm);
  if (km === 0) return "";
  if (km < 1) return t.equivalenceUnderOne;
  return t.equivalence(niceKm(km, locale));
}
