import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildSaison, MONTHS, productUrls } from "./build-saison";

type Item = {
  name: string;
  slug: string;
  months: number[];
  ecv: number;
  category: string;
};

const POMME: Item = {
  name: "Pomme",
  slug: "pomme",
  months: [9, 10],
  ecv: 0.40819489999999997,
  category: "fruits",
};
const AIL: Item = {
  name: "Ail",
  slug: "ail",
  months: [10],
  ecv: 0.383493,
  category: "herbes",
};

/** Réponses de l'API mois par mois, à partir d'une liste de produits. */
function responses(items: Item[]): Map<number, unknown> {
  return new Map(
    MONTHS.map((month) => [
      month,
      { data: items.filter((item) => item.months.includes(month)) },
    ]),
  );
}

describe("build-saison", () => {
  it("construit les produits, arrondis à 4 chiffres significatifs, avec leur fiche", () => {
    const urls = new Map([
      ["pomme", "https://impactco2.fr/outils/fruitsetlegumes/pomme"],
    ]);
    const products = buildSaison(responses([POMME, AIL]), urls);
    expect(products).toEqual([
      {
        slug: "ail",
        label: "Ail",
        category: "herbes",
        months: [10],
        kgCo2ePerKg: 0.3835,
        source: "impactco2",
        fictive: false,
      },
      {
        slug: "pomme",
        label: "Pomme",
        category: "fruits",
        months: [9, 10],
        kgCo2ePerKg: 0.4082,
        source: "impactco2",
        fictive: false,
        sourceUrl: "https://impactco2.fr/outils/fruitsetlegumes/pomme",
      },
    ]);
  });
  it("échoue sur une catégorie inconnue (aucune catégorie inventée)", () => {
    expect(() =>
      buildSaison(responses([{ ...AIL, category: "épices" }])),
    ).toThrow(/Catégorie inconnue « épices »/);
  });
  it("échoue si un produit est renvoyé pour un mois qui n'est pas le sien", () => {
    const byMonth = responses([POMME]);
    byMonth.set(3, { data: [POMME] });
    expect(() => buildSaison(byMonth)).toThrow(/mois 3 sans en être/);
  });
  it("échoue s'il manque à l'un de ses mois", () => {
    const byMonth = responses([POMME]);
    byMonth.set(9, { data: [] });
    expect(() => buildSaison(byMonth)).toThrow(/absent du mois 9/);
  });
  it("échoue si la réponse change de forme ou si une valeur est invalide", () => {
    const byMonth = responses([POMME]);
    byMonth.set(4, { produits: [] });
    expect(() => buildSaison(byMonth)).toThrow(/Réponse inattendue/);
    expect(() => buildSaison(responses([{ ...POMME, ecv: -1 }]))).toThrow(
      /Valeur invalide/,
    );
    expect(() =>
      buildSaison(responses([{ ...POMME, months: [9, 13] }])),
    ).toThrow(/illisible/);
  });
  it("fiches des produits : seulement la thématique Fruits et légumes du CSV", () => {
    const csv = [
      "Nom de l'objet ou du geste,kg CO2e,Thématique,ID,URL",
      "Pomme,0.41,Fruits et légumes,pomme,https://impactco2.fr/outils/fruitsetlegumes/pomme",
      "TGV,0.003,Transport,tgv,https://impactco2.fr/outils/transport/tgv",
    ].join("\n");
    expect([...productUrls(csv)]).toEqual([
      ["pomme", "https://impactco2.fr/outils/fruitsetlegumes/pomme"],
    ]);
  });
  it("le fichier généré n'a aucune donnée fictive et vient de l'API", () => {
    const file = JSON.parse(
      readFileSync(
        new URL("../src/lib/data/saison.generated.json", import.meta.url),
        "utf8",
      ),
    );
    expect(file.source).toBe("https://impactco2.fr/api/v1/fruitsetlegumes");
    expect(file.products.length).toBeGreaterThan(0);
    expect(
      file.products.every(
        (p: { fictive: boolean; source: string }) =>
          !p.fictive && p.source === "impactco2",
      ),
    ).toBe(true);
  });
});
