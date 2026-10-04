import { describe, expect, it } from "vitest";
import type { SeasonalProduct } from "@/lib/data/types";
import {
  getSeasonalProducts,
  groupByCategory,
  monthOf,
  parseMonth,
  productsForMonth,
  SEASON_CATEGORIES,
  seasonHighlights,
} from "./index";

const product = (
  slug: string,
  kg: number,
  months: number[],
  category = "fruits",
): SeasonalProduct => ({
  slug,
  label: slug[0].toUpperCase() + slug.slice(1),
  category,
  months,
  kgCo2ePerKg: kg,
  source: "impactco2",
  fictive: false,
});

const LIST = [
  product("pomme", 0.41, [1, 2, 9, 10, 11, 12]),
  product("poire", 0.39, [8, 9, 10, 11]),
  product("fraise", 1.2, [4, 5, 6]),
  product("banane", 0.91, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
  product("carotte", 0.4, [1, 2, 3, 9, 10, 11, 12], "légumes"),
  product("ail", 0.38, [7, 8, 9, 10, 11, 12], "herbes"),
  product("courge", 0.64, [1, 9, 10, 11, 12], "légumes"),
];

describe("fruits et légumes de saison : filtrage par mois", () => {
  it("ne garde que les produits de saison ce mois-là", () => {
    expect(productsForMonth(5, LIST).map((p) => p.slug)).toEqual([
      "banane",
      "fraise",
    ]);
    expect(productsForMonth(10, LIST).map((p) => p.slug)).not.toContain(
      "fraise",
    );
  });
  it("trie du plus léger au plus lourd au kg", () => {
    const october = productsForMonth(10, LIST);
    expect(october.map((p) => p.slug)).toEqual([
      "ail",
      "poire",
      "carotte",
      "pomme",
      "courge",
      "banane",
    ]);
    for (let i = 1; i < october.length; i++)
      expect(october[i].kgCo2ePerKg).toBeGreaterThanOrEqual(
        october[i - 1].kgCo2ePerKg,
      );
  });
  it("à égalité d'impact, par ordre alphabétique", () => {
    const tie = [product("b", 1, [3]), product("a", 1, [3])];
    expect(productsForMonth(3, tie).map((p) => p.slug)).toEqual(["a", "b"]);
  });
});

describe("regroupement par catégorie de l'API", () => {
  it("dans l'ordre de l'API, groupes vides retirés, chaque groupe trié", () => {
    const groups = groupByCategory(productsForMonth(10, LIST));
    expect(groups.map((g) => g.category.label)).toEqual([
      "Fruits",
      "Légumes",
      "Herbes",
    ]);
    expect(groups[0].products.map((p) => p.slug)).toEqual([
      "poire",
      "pomme",
      "banane",
    ]);
  });
  it("les intitulés sont ceux de l'API, avec une majuscule", () => {
    for (const category of SEASON_CATEGORIES) {
      expect(category.label.toLowerCase()).toBe(category.api);
    }
  });
});

describe("encart « Ce mois-ci, c'est la saison de… »", () => {
  it("trois produits de saison, les plus légers, en préférant ceux qui ont une saison", () => {
    expect(seasonHighlights(10, 3, LIST).map((p) => p.slug)).toEqual([
      "ail",
      "poire",
      "carotte",
    ]);
    // Peu de produits saisonniers : on complète avec ceux de toute l'année.
    expect(seasonHighlights(5, 3, LIST).map((p) => p.slug)).toEqual([
      "fraise",
      "banane",
    ]);
  });
});

describe("mois de l'URL", () => {
  it("accepte 1 à 12, refuse le reste", () => {
    expect(parseMonth("10")).toBe(10);
    expect(parseMonth("1")).toBe(1);
    expect(parseMonth("01")).toBe(1);
    for (const bad of [null, "", "0", "13", "abc", "10.5", "-1"])
      expect(parseMonth(bad)).toBeNull();
  });
  it("mois courant en heure locale", () => {
    expect(monthOf(new Date(2026, 9, 31, 23, 59).getTime())).toBe(10);
  });
});

describe("données actuelles (saison.generated.json)", () => {
  const all = getSeasonalProducts();
  it("des produits pour chaque mois, tous avec catégorie connue et fiche Impact CO2", () => {
    for (let month = 1; month <= 12; month++)
      expect(productsForMonth(month).length).toBeGreaterThan(10);
    for (const p of all) {
      expect(SEASON_CATEGORIES.some((c) => c.api === p.category)).toBe(true);
      expect(p.fictive).toBe(false);
      expect(p.kgCo2ePerKg).toBeGreaterThan(0);
      expect(p.sourceUrl).toMatch(/^https:\/\/impactco2\.fr\//);
    }
  });
  it("les deux mangues sont gardées telles quelles", () => {
    const labels = all.map((p) => p.label);
    expect(labels).toContain("Mangue (importée par avion)");
    expect(labels).toContain("Mangue (importée par bateau)");
  });
});
