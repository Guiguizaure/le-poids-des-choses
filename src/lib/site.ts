// Configuration du site : lancement, adresse, métadonnées de partage (fonctions pures).
import type { Metadata, MetadataRoute } from "next";
import {
  localizedPath,
  OG_LOCALE,
  ROUTES,
  type FrenchPath,
  type Locale,
} from "@/lib/i18n";
import { SITE } from "@/lib/i18n/messages/common";

export const SITE_NAME = "Le poids des choses";
export const SITE_DESCRIPTION = SITE.fr.description;

/**
 * Adresse publique du site (images de partage, sitemap). À confirmer au lancement : par
 * défaut, l'adresse Cloudflare Pages du projet. Surchargée par la variable SITE_URL.
 */
export const DEFAULT_SITE_URL = "https://le-poids-des-choses.pages.dev";

export function siteUrl(
  env: Record<string, string | undefined> = process.env,
): string {
  return (env.SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");
}

/**
 * Lancement : SITE_LAUNCHED=1 retire le noindex, remplit le sitemap et ouvre robots.txt.
 * Sans elle, tout reste en noindex.
 */
export function isLaunched(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return env.SITE_LAUNCHED === "1";
}

/** Pages publiques (le sitemap au lancement) : /labo et /connexion n'y figurent jamais. */
export const PUBLIC_PATHS = [
  "/",
  "/comparer",
  "/raconte",
  "/jardin",
  "/jardin/carnet",
  "/saison",
  "/methode",
  "/mentions-legales",
  "/confidentialite",
] as const;

export function robotsMeta(launched: boolean): Metadata["robots"] {
  return launched
    ? { index: true, follow: true }
    : { index: false, follow: false };
}

export function robotsFile(
  launched: boolean,
  base: string,
): MetadataRoute.Robots {
  if (!launched) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/labo" },
    sitemap: `${base}/sitemap.xml`,
  };
}

/** Adresse absolue d'un chemin (« / » → l'adresse du site, sans barre finale). */
function absolute(base: string, path: string): string {
  return path === "/" ? base : `${base}${path}`;
}

/** Les deux langues d'une page (hreflang) : français, anglais, et le français par défaut. */
export function languageAlternates(path: FrenchPath): Record<string, string> {
  return { fr: path, en: ROUTES[path], "x-default": path };
}

/** Sitemap au lancement : chaque page dans les deux langues, avec ses hreflang. */
export function sitemapEntries(
  launched: boolean,
  base: string,
): MetadataRoute.Sitemap {
  if (!launched) return [];
  return PUBLIC_PATHS.flatMap((path) => {
    const languages = {
      fr: absolute(base, path),
      en: absolute(base, ROUTES[path]),
    };
    return [
      { url: languages.fr, alternates: { languages } },
      { url: languages.en, alternates: { languages } },
    ];
  });
}

/**
 * Image de partage du site (logo « Horizon-balance », public/partage-1200x630.png) : la même
 * dans les deux langues (le nom ne se traduit pas), texte alternatif dans la langue de la page.
 */
export const OG_IMAGES: Record<
  Locale,
  { url: string; width: number; height: number; alt: string }
> = {
  fr: {
    url: "/partage-1200x630.png",
    width: 1200,
    height: 630,
    alt: SITE.fr.ogAlt,
  },
  en: {
    url: "/partage-1200x630.png",
    width: 1200,
    height: 630,
    alt: SITE.en.ogAlt,
  },
};

export const OG_IMAGE = OG_IMAGES.fr;

/**
 * Métadonnées d'une page : titre, description, adresse canonique et hreflang, partage (Open
 * Graph, carte Twitter) dans la langue de la page. `path` est l'adresse française de la page
 * (celle de la table des adresses) ; une page hors de la table n'a pas de version anglaise.
 */
export function pageMetadata({
  title,
  description,
  path,
  locale = "fr",
}: {
  /** Titre de la page (sans le nom du site) ; absent pour l'accueil. */
  title?: string;
  description?: string;
  path: string;
  locale?: Locale;
}): Metadata {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
  const text = description ?? SITE[locale].description;
  const inTable = path in ROUTES;
  const url = inTable ? localizedPath(path as FrenchPath, locale) : path;
  const image = OG_IMAGES[locale];
  return {
    title: fullTitle,
    description: text,
    alternates: {
      canonical: url,
      ...(inTable ? { languages: languageAlternates(path as FrenchPath) } : {}),
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      alternateLocale: OG_LOCALE[locale === "fr" ? "en" : "fr"],
      siteName: SITE_NAME,
      title: fullTitle,
      description: text,
      url,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: text,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}
