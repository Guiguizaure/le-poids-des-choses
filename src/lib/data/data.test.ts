import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { compare } from "@/lib/calc";
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

const UNIT_BY_CATEGORY: Record<Category, string> = {
  transport: "km",
  alimentation: "repas",
  habillement: "objet",
  numerique: "heure",
};
const CATEGORIES = Object.keys(UNIT_BY_CATEGORY) as Category[];

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
      expect(g.unit).toBe(UNIT_BY_CATEGORY[g.category]);
      expect(Number.isFinite(g.kgCo2ePerUnit)).toBe(true);
      expect(g.kgCo2ePerUnit).toBeGreaterThanOrEqual(0);
      expect(g.defaultQuantity).toBeGreaterThan(0);
      expect(g.label.length).toBeGreaterThan(0);
    }
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
  it("strict : passe avec les données réelles", () => {
    expect(checkData(getGestures(), true).ok).toBe(true);
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
  it("sort en 0 avec STRICT_DATA=1 : plus aucune donnée fictive", () => {
    expect(run("1")).toBe(0);
  });
}, 30_000);
