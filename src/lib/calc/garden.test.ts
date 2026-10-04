import { describe, expect, it } from "vitest";
import type { JournalEntry } from "@/lib/data/types";
import {
  GARDEN_STAGE_THRESHOLDS_KG,
  gardenStage,
  gardenTotals,
  isAsleep,
} from "./garden";

function entry(avoidedKg: number, id = "1"): JournalEntry {
  return {
    id,
    date: "2026-01-01T00:00:00.000Z",
    gestureA: "avion",
    gestureB: "train",
    quantity: 10,
    chosen: "b",
    avoidedKg,
  };
}

describe("gardenTotals", () => {
  it("jardin vide", () => {
    expect(gardenTotals([])).toEqual({
      totalAvoidedKg: 0,
      choiceCount: 0,
      lightChoiceCount: 0,
    });
  });
  it("somme les kg, compte tous les choix et les choix légers", () => {
    const totals = gardenTotals([
      entry(1.5, "1"),
      entry(0, "2"),
      entry(2.5, "3"),
    ]);
    expect(totals.totalAvoidedKg).toBeCloseTo(4);
    expect(totals.choiceCount).toBe(3);
    expect(totals.lightChoiceCount).toBe(2);
  });
  it("un choix lourd (0) n'enlève rien", () => {
    const before = gardenTotals([entry(3)]).totalAvoidedKg;
    const after = gardenTotals([entry(3), entry(0, "2")]).totalAvoidedKg;
    expect(after).toBe(before);
  });
});

describe("gardenStage", () => {
  it("0 sans rien évité", () => {
    expect(gardenStage(0)).toBe(0);
    expect(gardenStage(0.99)).toBe(0);
  });
  it("change pile au seuil", () => {
    GARDEN_STAGE_THRESHOLDS_KG.forEach((threshold, i) => {
      expect(gardenStage(threshold - 0.001)).toBe(i);
      expect(gardenStage(threshold)).toBe(i + 1);
    });
  });
  it("plafonne à 5", () => {
    expect(gardenStage(1_000_000)).toBe(5);
  });
  it("traite un total négatif comme vide", () => {
    expect(gardenStage(-3)).toBe(0);
  });
});

describe("isAsleep", () => {
  const now = new Date("2026-02-01T12:00:00Z");
  it("pas d'entrée : pas assoupi", () => {
    expect(isAsleep(null, now)).toBe(false);
    expect(isAsleep(undefined, now)).toBe(false);
  });
  it("date invalide : pas assoupi", () => {
    expect(isAsleep("n'importe quoi", now)).toBe(false);
  });
  it("récent : éveillé", () => {
    expect(isAsleep("2026-01-30T12:00:00Z", now)).toBe(false);
  });
  it("juste avant 21 jours : éveillé ; à 21 jours : assoupi", () => {
    expect(isAsleep("2026-01-11T12:00:01Z", now)).toBe(false);
    expect(isAsleep("2026-01-11T12:00:00Z", now)).toBe(true);
  });
  it("accepte un nombre de jours personnalisé et un objet Date", () => {
    expect(isAsleep(new Date("2026-01-29T12:00:00Z"), now, 3)).toBe(true);
    expect(isAsleep(new Date("2026-01-29T12:00:00Z"), now, 5)).toBe(false);
  });
});
