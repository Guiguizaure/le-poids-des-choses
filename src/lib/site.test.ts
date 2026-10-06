import { describe, expect, it } from "vitest";
import { checkLegal, isPlaceholder, missingLegalFields } from "./legal";
import {
  DEFAULT_SITE_URL,
  isLaunched,
  pageMetadata,
  PUBLIC_PATHS,
  robotsFile,
  robotsMeta,
  siteUrl,
  sitemapEntries,
} from "./site";

describe("lancement (SITE_LAUNCHED)", () => {
  it("non lancé par défaut", () => {
    expect(isLaunched({})).toBe(false);
    expect(isLaunched({ SITE_LAUNCHED: "0" })).toBe(false);
    expect(isLaunched({ SITE_LAUNCHED: "1" })).toBe(true);
  });
  it("noindex tant que le site n'est pas lancé", () => {
    expect(robotsMeta(false)).toEqual({ index: false, follow: false });
    expect(robotsMeta(true)).toEqual({ index: true, follow: true });
  });
  it("robots.txt fermé avant, ouvert après (sans /labo), avec le sitemap", () => {
    expect(robotsFile(false, "https://x.fr")).toEqual({
      rules: { userAgent: "*", disallow: "/" },
    });
    const open = robotsFile(true, "https://x.fr");
    expect(open.rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: "/labo",
    });
    expect(open.sitemap).toBe("https://x.fr/sitemap.xml");
  });
  it("sitemap vide avant le lancement, pages publiques après, jamais /labo", () => {
    expect(sitemapEntries(false, "https://x.fr")).toEqual([]);
    const urls = sitemapEntries(true, "https://x.fr").map((entry) => entry.url);
    expect(urls).toEqual([
      "https://x.fr",
      "https://x.fr/comparer",
      "https://x.fr/raconte",
      "https://x.fr/jardin",
      "https://x.fr/jardin/carnet",
      "https://x.fr/saison",
      "https://x.fr/methode",
      "https://x.fr/mentions-legales",
      "https://x.fr/confidentialite",
    ]);
    expect(urls.some((url) => url.includes("labo"))).toBe(false);
    expect(PUBLIC_PATHS).not.toContain("/labo");
    expect(PUBLIC_PATHS).not.toContain("/connexion");
    expect(PUBLIC_PATHS).toContain("/confidentialite");
  });
  it("adresse du site : variable SITE_URL, sinon Cloudflare Pages", () => {
    expect(siteUrl({})).toBe(DEFAULT_SITE_URL);
    expect(siteUrl({ SITE_URL: "https://lepoidsdeschoses.fr/" })).toBe(
      "https://lepoidsdeschoses.fr",
    );
  });
});

describe("métadonnées de partage", () => {
  it("titre propre par page, image 1200×630, carte Twitter", () => {
    const meta = pageMetadata({
      title: "Mon jardin",
      description: "Ton jardin.",
      path: "/jardin",
    });
    expect(meta.title).toBe("Mon jardin · Le poids des choses");
    expect(meta.description).toBe("Ton jardin.");
    expect(meta.openGraph).toMatchObject({
      title: "Mon jardin · Le poids des choses",
      locale: "fr_FR",
      url: "/jardin",
    });
    expect(meta.openGraph?.images).toEqual([
      expect.objectContaining({ url: "/og.png", width: 1200, height: 630 }),
    ]);
    expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
  });
  it("accueil : le nom du site seul", () => {
    expect(pageMetadata({ path: "/" }).title).toBe("Le poids des choses");
  });
});

describe("mentions légales", () => {
  it("repère les emplacements à remplir", () => {
    expect(isPlaceholder("[NOM]")).toBe(true);
    expect(isPlaceholder("Guillaume")).toBe(false);
    expect(missingLegalFields({ name: "Guillaume", email: "[EMAIL]" })).toEqual(
      ["email"],
    );
  });
  it("garde-fou : bloque seulement en mode strict", () => {
    expect(checkLegal(["email"], true)).toMatchObject({ ok: false });
    expect(checkLegal(["email"], true).message).toContain("e-mail");
    expect(checkLegal(["email"], false)).toMatchObject({ ok: true });
    expect(checkLegal([], true)).toMatchObject({ ok: true });
  });
});
