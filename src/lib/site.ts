// Configuration du site : lancement, adresse, métadonnées de partage (fonctions pures).
import type { Metadata, MetadataRoute } from "next";

export const SITE_NAME = "Le poids des choses";
export const SITE_DESCRIPTION =
  "Compare deux gestes du quotidien sur une balance et regarde ton jardin grandir à chaque choix plus léger.";

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

export function sitemapEntries(
  launched: boolean,
  base: string,
): MetadataRoute.Sitemap {
  if (!launched) return [];
  return PUBLIC_PATHS.map((path) => ({
    url: `${base}${path === "/" ? "" : path}` || base,
  }));
}

export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME} : une balance et un jardin`,
};

/** Métadonnées d'une page : titre, description, partage (Open Graph, carte Twitter). */
export function pageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
}: {
  /** Titre de la page (sans le nom du site) ; absent pour l'accueil. */
  title?: string;
  description?: string;
  path: string;
}): Metadata {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url: path,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
