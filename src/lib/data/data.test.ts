import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { compare } from "@/lib/calc";
import { missingLegalFields } from "@/lib/legal";
import { getSeasonalProducts } from "@/lib/saison";
import { checkData } from "./check";
import generated from "./gestures.generated.json";
import {
  getGesture,
  getGestures,
  getGesturesByCategory,
  hasFictiveData,
} from "./index";
import { testGestures } from "./test-gestures";
import type { Category } from "./types";

const UNITS_BY_CATEGORY: Record<Category, string[]> = {
  transport: ["km"],
  alimentation: ["repas"],
  habillement: ["objet"],
  numerique: ["objet"],
  boisson: ["litre"],
  livraison: ["achat"],
};
const CATEGORIES = Object.keys(UNITS_BY_CATEGORY) as Category[];

describe("données générées (Impact CO2)", () => {
  it("date de téléchargement et source en tête de fichier", () => {
    expect(Object.keys(generated).slice(0, 2)).toEqual([
      "downloadedAt",
      "source",
    ]);
    expect(Number.isNaN(Date.parse(generated.downloadedAt))).toBe(false);
  });
  it("environ une vingtaine de gestes, ids uniques", () => {
    const gestures = getGestures();
    expect(gestures.length).toBeGreaterThanOrEqual(18);
    expect(new Set(gestures.map((g) => g.id)).size).toBe(gestures.length);
  });
  it("chaque geste a une catégorie, une unité cohérente et une valeur ≥ 0", () => {
    for (const g of getGestures()) {
      expect(CATEGORIES).toContain(g.category);
      expect(UNITS_BY_CATEGORY[g.category]).toContain(g.unit);
      expect(Number.isFinite(g.kgCo2ePerUnit)).toBe(true);
      expect(g.kgCo2ePerUnit).toBeGreaterThanOrEqual(0);
      expect(g.defaultQuantity).toBeGreaterThan(0);
      expect(g.label.length).toBeGreaterThan(0);
    }
  });
  it("le numérique ne garde que les appareils (par objet), plus d'usages à l'heure", () => {
    expect(
      getGesturesByCategory("numerique").map((g) => [g.id, g.unit]),
    ).toEqual([
      ["smartphone", "objet"],
      ["ordinateur-portable", "objet"],
      ["television", "objet"],
    ]);
    expect(getGesture("streaming")).toBeUndefined();
    expect(getGesture("visio")).toBeUndefined();
  });
  it("boire : par litre ; se faire livrer : par achat, colis d'1 kg", () => {
    expect(getGesturesByCategory("boisson")).toHaveLength(9);
    expect(getGesture("eau-robinet")?.sourceId).toBe("eaudurobinet");
    expect(getGesturesByCategory("livraison").map((g) => g.sourceId)).toEqual([
      "livraisondomicile",
      "pointrelaisdouce",
      "pointrelais",
      "magasindouce",
      "magasin",
    ]);
  });
  it("tous sourcés Impact CO2, aucun fictif", () => {
    for (const g of getGestures()) {
      expect(g.source).toBe("impactco2");
      expect(g.fictive).toBe(false);
      expect(g.sourceId).toBeTruthy();
      expect(g.sourceUrl).toMatch(/^https:\/\/impactco2\.fr\//);
    }
  });
  it("valeurs arrondies à 4 chiffres significatifs", () => {
    for (const g of getGestures()) {
      expect(Number(g.kgCo2ePerUnit.toPrecision(4))).toBe(g.kgCo2ePerUnit);
    }
  });
  it("couvre les 4 catégories", () => {
    for (const category of CATEGORIES) {
      expect(getGesturesByCategory(category).length).toBeGreaterThan(0);
    }
  });
  it("pas de geste sans source (vêtement d'occasion, appel audio)", () => {
    expect(getGesture("vetement-occasion")).toBeUndefined();
    expect(getGesture("appel")).toBeUndefined();
  });
  it("la marche vaut 0 : ratio null face à un autre geste", () => {
    const marche = getGesture("marche");
    const tgv = getGesture("tgv");
    expect(marche?.kgCo2ePerUnit).toBe(0);
    expect(compare(tgv!, 10, marche!, 10).ratio).toBeNull();
  });
});

describe("modes d'acquisition des objets", () => {
  const objets = () => getGestures().filter((g) => g.unit === "objet");
  it("seuls les objets ont des modes", () => {
    for (const g of getGestures()) {
      expect(g.modes === undefined).toBe(g.unit !== "objet");
    }
  });
  it("neuf = valeur du CSV, occasion et garder = hypothèses à 0", () => {
    for (const g of objets()) {
      expect(g.modes?.neuf).toMatchObject({
        kgCo2e: g.kgCo2ePerUnit,
        method: "impactco2",
        sourceId: g.sourceId,
      });
      expect(g.modes?.occasion).toEqual({
        kgCo2e: 0,
        method: "hypothese-occasion",
      });
      expect(g.modes?.garder).toEqual({
        kgCo2e: 0,
        method: "hypothese-garder",
      });
    }
  });
  it("occasion livrée : fabrication à 0 (hypothèse) + colis sourcé Livraison", () => {
    for (const g of objets()) {
      const livree = g.modes?.["occasion-livree"];
      expect(livree?.method).toBe("hypothese-occasion");
      expect(livree?.parts).toHaveLength(2);
      const [fab, colis] = livree!.parts!;
      expect(fab).toMatchObject({ kgCo2e: 0, method: "hypothese-occasion" });
      expect(colis.method).toBe("impactco2");
      expect(colis.sourceId).toMatch(/^livraisondomicile/);
      expect(colis.sourceUrl).toMatch(
        /^https:\/\/impactco2\.fr\/outils\/livraison\//,
      );
      expect(livree?.kgCo2e).toBe(colis.kgCo2e);
      expect(colis.kgCo2e).toBeGreaterThan(0);
    }
  });
  it("toute valeur 'impactco2' a une source ; toute valeur est ≥ 0", () => {
    for (const g of objets()) {
      for (const value of Object.values(g.modes ?? {})) {
        expect(value.kgCo2e).toBeGreaterThanOrEqual(0);
        if (value.method === "impactco2") expect(value.sourceId).toBeTruthy();
        for (const part of value.parts ?? []) {
          if (part.method === "impactco2") expect(part.sourceId).toBeTruthy();
        }
      }
    }
  });
  it("l'occasion livrée reste moins lourde que le neuf", () => {
    for (const g of objets()) {
      expect(g.modes!["occasion-livree"]!.kgCo2e).toBeLessThan(g.kgCo2ePerUnit);
    }
  });
});

describe("adaptateur", () => {
  it("getGesture", () => {
    expect(getGesture("tgv")?.label).toBe("TGV");
    expect(getGesture("inconnu")).toBeUndefined();
  });
  it("hasFictiveData renvoie false", () => {
    expect(hasFictiveData()).toBe(false);
  });
});

describe("données de test (tests uniquement)", () => {
  it("toutes fictives", () => {
    expect(testGestures.length).toBeGreaterThanOrEqual(18);
    expect(testGestures.every((g) => g.fictive && g.source === "fictive")).toBe(
      true,
    );
    expect(new Set(testGestures.map((g) => g.id)).size).toBe(
      testGestures.length,
    );
  });
});

describe("checkData", () => {
  it("non strict : autorise les données fictives avec un avertissement", () => {
    const r = checkData(testGestures, false);
    expect(r.ok).toBe(true);
    expect(r.message).toContain("fictive");
  });
  it("strict : échoue s'il reste une donnée fictive", () => {
    expect(checkData(testGestures, true).ok).toBe(false);
    const real = getGestures()[0];
    expect(
      checkData([real, { ...real, id: "x", fictive: true }], true).ok,
    ).toBe(false);
    expect(
      checkData([real, { ...real, id: "x", source: "fictive" }], true).ok,
    ).toBe(false);
  });
  it("strict : passe avec les données réelles (gestes et produits de saison)", () => {
    expect(checkData(getGestures(), true).ok).toBe(true);
    expect(
      checkData([...getGestures(), ...getSeasonalProducts()], true).ok,
    ).toBe(true);
  });
  it("strict : un produit de saison fictif fait aussi échouer", () => {
    const fruit = {
      ...getSeasonalProducts()[0],
      slug: "fruit-test",
      fictive: true,
    };
    const result = checkData([fruit], true);
    expect(result.ok).toBe(false);
    expect(result.message).toContain("fruit-test");
  });
});

describe("scripts/check-data.ts", () => {
  const run = (strict: string | undefined) => {
    const env = { ...process.env };
    delete env.STRICT_DATA;
    if (strict) env.STRICT_DATA = strict;
    try {
      execFileSync("pnpm", ["exec", "tsx", "scripts/check-data.ts"], {
        env,
        stdio: "pipe",
      });
      return 0;
    } catch (error) {
      return (error as { status: number }).status;
    }
  };
  it("sort en 0 sans STRICT_DATA", () => {
    expect(run(undefined)).toBe(0);
  });
  it("avec STRICT_DATA=1 : passe (aucune donnée fictive, mentions légales remplies)", () => {
    expect(missingLegalFields()).toEqual([]);
    expect(run("1")).toBe(0);
  });
}, 30_000);
