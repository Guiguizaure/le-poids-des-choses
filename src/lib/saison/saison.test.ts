import { describe, expect, it } from "vitest";
import type { SeasonalProduct } from "@/lib/data/types";
import {
  getSeasonalProducts,
  groupByCategory,
  monthOf,
  parseMonth,
  productsForMonth,
  formatPerKilo,
  SEASON_CATEGORIES,
  seasonRange,
} from "./index";
import { drawnForMonth, SEASON_DRAWINGS } from "./drawn";
import { ILLUSTRATION_SPECS } from "@/lib/illustrations/specs";

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

describe("encart de saison : du plus léger au plus lourd au kilo", () => {
  const slugs = (list: SeasonalProduct[]) => list.map((p) => p.slug);

  it("le plus léger et le plus lourd parmi les produits de saison ce mois-ci", () => {
    // La banane (toute l'année) et la fraise (pas en octobre) sont exclues.
    expect(slugs(seasonRange(10, LIST))).toEqual(["ail", "courge"]);
    expect(slugs(seasonRange(5, LIST))).toEqual(["fraise"]);
  });
  it("mois sans produit : aucun repère", () => {
    expect(seasonRange(6, [product("pomme", 0.4, [9, 10])])).toEqual([]);
    expect(seasonRange(6, [])).toEqual([]);
    // Seulement des produits de toute l'année : rien non plus.
    expect(seasonRange(6, [LIST[3]])).toEqual([]);
  });
  it("un seul produit : un seul repère", () => {
    expect(slugs(seasonRange(9, [product("raisin", 0.5, [9, 10])]))).toEqual([
      "raisin",
    ]);
  });
  it("à égalité, ordre alphabétique", () => {
    const tie = [
      product("navet", 0.4, [3]),
      product("cresson", 2, [3]),
      product("blette", 0.4, [3]),
      product("asperge", 2, [3]),
      product("radis", 1, [3]),
    ];
    expect(slugs(seasonRange(3, tie))).toEqual(["blette", "asperge"]);
    // Deux produits au même impact : le premier puis le second par ordre alphabétique.
    expect(
      slugs(seasonRange(3, [product("b", 1, [3]), product("a", 1, [3])])),
    ).toEqual(["a", "b"]);
  });
  it("valeur arrondie comme sur /saison, espaces insécables avant les unités", () => {
    expect(formatPerKilo(0.3835)).toBe("384 g CO2e/kg");
    expect(formatPerKilo(4.811)).toBe("4,8 kg CO2e/kg");
  });
  it("données actuelles : deux repères chaque mois, le plus léger d'abord", () => {
    for (let month = 1; month <= 12; month++) {
      const [lightest, heaviest] = seasonRange(month);
      expect(heaviest.kgCo2ePerKg).toBeGreaterThan(lightest.kgCo2ePerKg);
      for (const p of [lightest, heaviest]) {
        expect(p.months).toContain(month);
        expect(p.months.length).toBeLessThan(12);
      }
    }
  });
});

describe("fruits et légumes dessinés", () => {
  // Nom du dessin et intitulé des données, sans accents, espaces, tirets ni « s » final :
  // « petits-pois » ↔ « Petit pois », « clementine » ↔ « Clémentine ».
  const comparable = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter(Boolean)
      .map((word) => word.replace(/s$/, ""))
      .join(" ");

  it("chaque dessin correspond, par son nom, à un produit des données", () => {
    expect(Object.keys(SEASON_DRAWINGS)).toHaveLength(21);
    for (const [name, slug] of Object.entries(SEASON_DRAWINGS)) {
      expect(name in ILLUSTRATION_SPECS, name).toBe(true);
      const found = getSeasonalProducts().find((p) => p.slug === slug);
      expect(found, slug).toBeDefined();
      expect(comparable(found!.label), name).toBe(
        comparable(name.replace(/^saison-/, "")),
      );
    }
  });
  it("tous les dessins de produits sont dans la table", () => {
    // saison-hiver-…, saison-automne-…, saison-printemps-… : saisons du jardin, pas des produits.
    const drawings = Object.keys(ILLUSTRATION_SPECS).filter(
      (name) =>
        name.startsWith("saison-") &&
        !/^saison-(printemps|ete|automne|hiver)-/.test(name),
    );
    expect(Object.keys(SEASON_DRAWINGS).sort()).toEqual(drawings.sort());
  });
  it("pas de cagette", () => {
    expect(Object.keys(ILLUSTRATION_SPECS)).not.toContain("saison-cagette");
  });

  const DRAWN = [
    product("pomme", 0.41, [1, 2, 3, 4, 8, 9, 10, 11, 12]),
    product("poire", 0.39, [1, 2, 3, 8, 9, 10, 11, 12]),
    product("carotte", 0.4, [1, 2, 3, 9, 10, 11, 12], "légumes"),
    product("courge", 0.64, [1, 9, 10, 11, 12], "légumes"),
    product("raisin", 0.51, [9, 10]),
    product("poireau", 0.61, [1, 2, 3, 4, 9, 10, 11, 12], "légumes"),
    product("tomate", 0.63, [6, 7, 8, 9], "légumes"),
  ];

  it("seulement ceux de saison ce mois-ci, saison la plus courte d'abord, 5 au plus", () => {
    expect(drawnForMonth(10, DRAWN)).toEqual([
      "saison-raisin",
      "saison-courge",
      "saison-carotte",
      "saison-poire",
      "saison-poireau",
    ]);
    expect(drawnForMonth(10, DRAWN, 3)).toHaveLength(3);
    expect(drawnForMonth(4, DRAWN)).toEqual(["saison-poireau", "saison-pomme"]);
  });
  it("moins de 3 : complétés par ceux de toute l'année", () => {
    const withYearRound = [
      ...DRAWN.filter((p) => p.slug !== "poireau"),
      product("poireau", 0.61, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
    ];
    expect(drawnForMonth(4, withYearRound)).toEqual([
      "saison-pomme",
      "saison-poireau",
    ]);
    // Déjà 3 de saison : on ne complète pas.
    expect(drawnForMonth(8, withYearRound)).toEqual([
      "saison-tomate",
      "saison-poire",
      "saison-pomme",
    ]);
  });
  it("aucun ce mois-ci : ceux du mois le plus proche", () => {
    // Mai : avril (pomme, poireau) et juin (tomate) sont à un mois ; avril en a le plus.
    expect(drawnForMonth(5, DRAWN)).toEqual(["saison-poireau", "saison-pomme"]);
    // À égalité, le mois à venir.
    const two = [product("pomme", 0.4, [4]), product("tomate", 0.6, [6])];
    expect(drawnForMonth(5, two)).toEqual(["saison-tomate"]);
    // Plus loin : on cherche jusqu'à trouver.
    expect(drawnForMonth(1, [product("tomate", 0.6, [7])])).toEqual([
      "saison-tomate",
    ]);
    expect(drawnForMonth(5, [])).toEqual([]);
  });
  it("données actuelles : au moins 3 dessins de saison chaque mois", () => {
    for (let month = 1; month <= 12; month++) {
      const drawn = drawnForMonth(month);
      expect(drawn.length, `mois ${month}`).toBeGreaterThanOrEqual(3);
      for (const name of drawn)
        expect(
          getSeasonalProducts()
            .find((p) => p.slug === SEASON_DRAWINGS[name])!
            .months.includes(month),
          `${name}, mois ${month}`,
        ).toBe(true);
    }
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
