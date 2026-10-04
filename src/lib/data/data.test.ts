import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { checkData } from "./check";
import {
  getGesture,
  getGestures,
  getGesturesByCategory,
  hasFictiveData,
} from "./index";
import type { Category, Gesture } from "./types";

const real: Gesture = {
  id: "reel",
  label: "Réel",
  category: "transport",
  unit: "km",
  kgCo2ePerUnit: 0.1,
  defaultQuantity: 10,
  source: "impactco2",
  fictive: false,
};

describe("données de test", () => {
  it("toutes fictives, ids uniques, ~20 gestes", () => {
    const gestures = getGestures();
    expect(gestures.length).toBeGreaterThanOrEqual(18);
    expect(gestures.every((g) => g.fictive && g.source === "fictive")).toBe(
      true,
    );
    expect(new Set(gestures.map((g) => g.id)).size).toBe(gestures.length);
  });
  it("couvre les 4 catégories avec la bonne unité", () => {
    const units: Record<Category, string> = {
      transport: "km",
      alimentation: "repas",
      habillement: "objet",
      numerique: "heure",
    };
    for (const [category, unit] of Object.entries(units)) {
      const list = getGesturesByCategory(category as Category);
      expect(list.length).toBeGreaterThan(0);
      expect(list.every((g) => g.unit === unit)).toBe(true);
    }
  });
  it("valeurs valides", () => {
    for (const g of getGestures()) {
      expect(g.kgCo2ePerUnit).toBeGreaterThanOrEqual(0);
      expect(g.defaultQuantity).toBeGreaterThan(0);
    }
  });
});

describe("adaptateur", () => {
  it("getGesture", () => {
    expect(getGesture("train")?.label).toBe("Train");
    expect(getGesture("inconnu")).toBeUndefined();
  });
  it("hasFictiveData", () => {
    expect(hasFictiveData()).toBe(true);
  });
});

describe("checkData", () => {
  it("non strict : autorise les données fictives avec un avertissement", () => {
    const r = checkData(getGestures(), false);
    expect(r.ok).toBe(true);
    expect(r.message).toContain("fictive");
  });
  it("strict : échoue s'il reste une donnée fictive", () => {
    expect(checkData(getGestures(), true).ok).toBe(false);
    expect(
      checkData([real, { ...real, id: "x", fictive: true }], true).ok,
    ).toBe(false);
    expect(
      checkData([real, { ...real, id: "x", source: "fictive" }], true).ok,
    ).toBe(false);
  });
  it("strict : passe avec des données réelles uniquement", () => {
    expect(checkData([real], true).ok).toBe(true);
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
  it("sort en 1 avec STRICT_DATA=1 tant que des données sont fictives", () => {
    expect(run("1")).toBe(1);
  });
}, 30_000);
