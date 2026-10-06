// Langues du site : adresses, dictionnaires, formats (fonctions pures).
import { localeOfPath, ROUTES, type FrenchPath, type Locale } from "./routes";

export * from "./routes";

/**
 * Forme d'un dictionnaire, commune aux deux langues : mêmes clés, chaînes libres, fonctions de
 * même signature (accords, pluriels). Un oubli dans une langue fait échouer la vérification
 * des types, donc le build.
 */
export type Shape<T> = T extends string
  ? string
  : T extends (...args: infer A) => infer R
    ? (...args: A) => R extends string ? string : R
    : T extends readonly (infer U)[]
      ? readonly Shape<U>[]
      : { [K in keyof T]: Shape<T[K]> };

export type Dictionary<T> = { fr: T; en: Shape<T> };

/** Déclare un dictionnaire : le français fait référence, l'anglais doit avoir la même forme. */
export function defineMessages<T>(fr: T, en: Shape<T>): Dictionary<T> {
  return { fr, en };
}

/** Textes d'un dictionnaire dans une langue. */
export function pick<T>(dictionary: Dictionary<T>, locale: Locale): Shape<T> {
  return (locale === "en" ? dictionary.en : dictionary.fr) as Shape<T>;
}

/** « De saison en {month} » + { month: "octobre" } → « De saison en octobre ». */
export function format(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** Étiquette Intl de la langue (nombres, dates) : français de France, anglais britannique. */
export function intlLocale(locale: Locale): string {
  return locale === "en" ? "en-GB" : "fr-FR";
}

/** Attribut hreflang et Open Graph de chaque langue. */
export const OG_LOCALE: Record<Locale, string> = { fr: "fr_FR", en: "en_GB" };

/**
 * Lien interne dans la langue de la page : « /jardin?nouveau=x » → « /en/garden?nouveau=x ».
 * Les liens externes, les ancres seules et les pages hors de la table restent tels quels.
 */
export function localizeHref(href: string, locale: Locale): string {
  if (locale === "fr" || !href.startsWith("/") || href.startsWith("//"))
    return href;
  const match = /^([^?#]*)(.*)$/.exec(href)!;
  const [, path, rest] = match;
  if (localeOfPath(path) === "en") return href;
  if (!(path in ROUTES)) return href;
  return `${ROUTES[path as FrenchPath]}${rest}`;
}
