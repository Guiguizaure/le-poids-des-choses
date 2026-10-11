// Mini-duel de l'accueil, calculé au rendu serveur avec les données (aucune valeur écrite à la
// main) : vélo contre voiture thermique sur 5 km, le duel existant déjà rempli.
import { formatMass } from "@/lib/calc";
import { duelComparison, tiltFor } from "@/lib/compare/duel";
import { COMPARE_PATH, comparisonHref } from "@/lib/compare/url";
import type { Locale } from "@/lib/i18n";

export const MINI_DUEL_STATE = {
  step: "duel",
  a: "velo",
  b: "voiture",
  quantity: 5,
} as const;

export function miniDuelData(locale: Locale) {
  const comparison = duelComparison(
    MINI_DUEL_STATE.a,
    MINI_DUEL_STATE.b,
    MINI_DUEL_STATE.quantity,
  );
  if (!comparison) throw new Error("Mini-duel : geste introuvable.");
  return {
    href: comparisonHref(MINI_DUEL_STATE),
    anotherHref: COMPARE_PATH,
    tilt: tiltFor(comparison),
    gap: formatMass(comparison.differenceKg, locale),
  };
}
