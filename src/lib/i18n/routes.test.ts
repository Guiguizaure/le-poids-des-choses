import { describe, expect, it } from "vitest";
import { PUBLIC_PATHS } from "@/lib/site";
import {
  frenchPathOf,
  localeOfPath,
  localizedPath,
  ROUTES,
  switchLocaleHref,
} from "./routes";

describe("table des adresses", () => {
  it("chaque page publique a son adresse anglaise, sous /en", () => {
    for (const path of PUBLIC_PATHS) {
      expect(ROUTES[path]).toMatch(/^\/en(\/[a-z-]+)*$/);
    }
  });
  it("aucune adresse anglaise en double", () => {
    const english = Object.values(ROUTES);
    expect(new Set(english).size).toBe(english.length);
  });
  it("/labo n'a pas de version anglaise", () => {
    expect(frenchPathOf("/labo")).toBe(null);
  });
});

describe("langue d'un chemin", () => {
  it("/en et ses sous-pages sont en anglais, le reste en français", () => {
    expect(localeOfPath("/en")).toBe("en");
    expect(localeOfPath("/en/")).toBe("en");
    expect(localeOfPath("/en/garden/journal")).toBe("en");
    expect(localeOfPath("/")).toBe("fr");
    expect(localeOfPath("/jardin")).toBe("fr");
    expect(localeOfPath("/entree")).toBe("fr");
  });
});

describe("sélecteur de langue", () => {
  it("aller-retour sur chaque page", () => {
    for (const fr of Object.keys(ROUTES) as (keyof typeof ROUTES)[]) {
      const en = localizedPath(fr, "en");
      expect(frenchPathOf(en)).toBe(fr);
      expect(switchLocaleHref(en, "", "", "fr")).toBe(fr);
    }
  });
  it("garde les paramètres et l'ancre", () => {
    expect(switchLocaleHref("/comparer", "?a=tgv&b=avion&q=50", "", "en")).toBe(
      "/en/compare?a=tgv&b=avion&q=50",
    );
    expect(switchLocaleHref("/en/method/", "", "#ecart", "fr")).toBe(
      "/methode#ecart",
    );
  });
  it("page sans équivalent : accueil de l'autre langue", () => {
    expect(switchLocaleHref("/labo", "", "", "en")).toBe("/en");
    expect(switchLocaleHref("/en/inconnue", "", "", "fr")).toBe("/");
  });
});
