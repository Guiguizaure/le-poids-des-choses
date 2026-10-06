// Langues et correspondance des adresses : le français à la racine, l'anglais sous /en.
// Fonctions pures, partagées par le sélecteur de langue, les hreflang et le sitemap.

export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

/**
 * Table des pages : adresse française → adresse anglaise. Seules les pages listées ici ont
 * une version anglaise (/labo reste en français). Les paramètres (?a=, ?mois=…) et les
 * ancres (#ecart, #compte…) sont les mêmes dans les deux langues : un lien partagé garde
 * son état, et le sélecteur de langue n'a rien à traduire après le chemin.
 */
export const ROUTES = {
  "/": "/en",
  "/comparer": "/en/compare",
  "/raconte": "/en/your-day",
  "/jardin": "/en/garden",
  "/jardin/carnet": "/en/garden/notebook",
  "/saison": "/en/in-season",
  "/methode": "/en/method",
  "/mentions-legales": "/en/legal-notice",
  "/confidentialite": "/en/privacy",
  "/connexion": "/en/sign-in",
} as const;

export type FrenchPath = keyof typeof ROUTES;

const EN_TO_FR = new Map<string, FrenchPath>(
  Object.entries(ROUTES).map(([fr, en]) => [en, fr as FrenchPath]),
);

function trimSlash(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, "") : path;
}

/** Langue d'un chemin : /en et tout ce qui est dessous sont en anglais. */
export function localeOfPath(pathname: string): Locale {
  const path = trimSlash(pathname);
  return path === "/en" || path.startsWith("/en/") ? "en" : "fr";
}

/** Adresse d'une page dans une langue, à partir de son adresse française. */
export function localizedPath(frenchPath: FrenchPath, locale: Locale): string {
  return locale === "en" ? ROUTES[frenchPath] : frenchPath;
}

/** Adresse française d'un chemin, quelle que soit sa langue ; null s'il n'est pas dans la table. */
export function frenchPathOf(pathname: string): FrenchPath | null {
  const path = trimSlash(pathname);
  if (localeOfPath(path) === "en") return EN_TO_FR.get(path) ?? null;
  return path in ROUTES ? (path as FrenchPath) : null;
}

/**
 * Même page dans l'autre langue (sélecteur de langue) : chemin traduit, paramètres et ancre
 * gardés. Une page sans équivalent mène à l'accueil de la langue demandée.
 */
export function switchLocaleHref(
  pathname: string,
  search: string,
  hash: string,
  to: Locale,
): string {
  const french = frenchPathOf(pathname);
  if (!french) return localizedPath("/", to);
  return `${localizedPath(french, to)}${search}${hash}`;
}
