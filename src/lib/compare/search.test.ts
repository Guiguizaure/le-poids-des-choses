import { describe, expect, it } from "vitest";
import { normalizeSearch, searchGestures } from "./search";

const ids = (query: string) => searchGestures(query).map((g) => g.id);

describe("recherche dans le catalogue", () => {
  it("sans accents ni majuscules : « velo » trouve les vélos", () => {
    expect(ids("velo")).toEqual(["velo", "velo-electrique", "velo-cargo"]);
    expect(ids("VÉLO")).toEqual(ids("velo"));
    expect(ids("  Vélo ")).toEqual(ids("velo"));
  });

  it("noms anglais aussi : « washing » trouve le lave-linge, « bike » les vélos", () => {
    expect(ids("washing")).toEqual(["lave-linge"]);
    expect(ids("bike")).toEqual(
      expect.arrayContaining(["velo", "velo-electrique", "velo-cargo"]),
    );
    expect(ids("fridge")).toEqual(["refrigerateur"]);
  });

  it("tirets, apostrophes et ligatures confondus", () => {
    expect(ids("lave linge")).toEqual(["lave-linge"]);
    expect(ids("lave-linge")).toEqual(["lave-linge"]);
    expect(ids("boeuf")).toEqual(["repas-boeuf"]);
    expect(ids("ecran d'ordinateur")).toEqual(["ecran"]);
    expect(normalizeSearch("Écran d’ordinateur")).toBe("ecran d ordinateur");
  });

  it("chaque mot doit se trouver, dans n'importe quel ordre", () => {
    expect(ids("electrique voiture")).toEqual(["voiture-electrique"]);
    expect(ids("covoiturage")).toEqual(["covoiturage"]);
  });

  it("les noms qui commencent par la requête d'abord", () => {
    const found = ids("voiture");
    expect(found[0]).toBe("voiture");
    expect(found).toContain("covoiturage");
    expect(found.indexOf("covoiturage")).toBeGreaterThan(
      found.indexOf("voiture-hybride"),
    );
  });

  it("requête vide ou inconnue : rien", () => {
    expect(ids("")).toEqual([]);
    expect(ids("   ")).toEqual([]);
    expect(ids("console de jeux")).toEqual([]);
  });
});
