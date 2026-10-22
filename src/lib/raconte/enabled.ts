// Interrupteur unique de « Raconte ta journée » côté site : le drapeau de build
// NEXT_PUBLIC_RACONTE_ENABLED. « 1 » affiche la fonction ; absent (cas par défaut, celui de la
// CI) ou toute autre valeur, elle est en veille : aucun lien ni texte, pages /raconte et
// /en/your-day non générées (404), hors du sitemap. Tout le reste du code passe par ce module.
// Côté Pages Functions, AI_ENABLED reste le coupe-circuit de l'API (server/handlers.ts).

/** Valeur du drapeau : seul « 1 » allume la fonction. */
export function isRaconteEnabled(value: string | undefined): boolean {
  return value === "1";
}

// Lecture littérale : Next remplace `process.env.NEXT_PUBLIC_…` au build, dans le navigateur
// aussi (une lecture par variable intermédiaire ne serait pas remplacée).
export const RACONTE_ENABLED = isRaconteEnabled(
  process.env.NEXT_PUBLIC_RACONTE_ENABLED,
);

/**
 * Les deux pages de la fonction s'appellent `page.raconte.tsx` : Next ne les reconnaît comme
 * pages que si l'extension « raconte.tsx » est déclarée (next.config.ts, `pageExtensions`).
 * Drapeau éteint, elles ne sont pas générées.
 */
export function pageExtensions(enabled: boolean): string[] {
  const defaults = ["tsx", "ts", "jsx", "js"];
  return enabled ? ["raconte.tsx", ...defaults] : defaults;
}
