import { describe, expect, it } from "vitest";
import { avoidedKg, compare } from "./compare";
import { fakeGesture } from "./helpers.test-util";

const train = fakeGesture("train", 0.03);
const avion = fakeGesture("avion", 0.2);
const velo = fakeGesture("velo", 0);

describe("compare", () => {
  it("désigne le plus léger et le plus lourd", () => {
    const c = compare(avion, 10, train, 10);
    expect(c.lighter).toBe("b");
    expect(c.heavier).toBe("a");
    expect(c.differenceKg).toBeCloseTo(1.7);
    expect(c.ratio).toBeCloseTo(0.2 / 0.03);
    expect(c.almostEqual).toBe(false);
  });
  it("gère l'ordre inverse", () => {
    const c = compare(train, 10, avion, 10);
    expect(c.lighter).toBe("a");
    expect(c.heavier).toBe("b");
  });
  it("tient compte des quantités différentes", () => {
    const c = compare(avion, 1, train, 10);
    expect(c.emissionsA).toBeCloseTo(0.2);
    expect(c.emissionsB).toBeCloseTo(0.3);
    expect(c.lighter).toBe("a");
  });
  it("deux gestes égaux : écart 0, ratio 1, quasi égaux", () => {
    const c = compare(train, 10, train, 10);
    expect(c.differenceKg).toBe(0);
    expect(c.ratio).toBe(1);
    expect(c.almostEqual).toBe(true);
    expect(avoidedKg(c, "a")).toBe(0);
    expect(avoidedKg(c, "b")).toBe(0);
  });
  it("ratio null quand le plus léger vaut 0 (vélo)", () => {
    const c = compare(avion, 10, velo, 10);
    expect(c.lighter).toBe("b");
    expect(c.ratio).toBeNull();
    expect(c.differenceKg).toBeCloseTo(2);
  });
  it("quantité 0 des deux côtés : tout vaut 0, ratio null, quasi égaux", () => {
    const c = compare(avion, 0, train, 0);
    expect(c.differenceKg).toBe(0);
    expect(c.ratio).toBeNull();
    expect(c.almostEqual).toBe(true);
  });
  it("quantité 0 d'un côté : l'autre est le plus lourd", () => {
    const c = compare(avion, 0, train, 10);
    expect(c.lighter).toBe("a");
    expect(c.ratio).toBeNull();
  });
  it("almostEqual : écart < 10 % du plus lourd", () => {
    const a = fakeGesture("a", 1);
    expect(compare(a, 10, fakeGesture("b", 0.95), 10).almostEqual).toBe(true);
    expect(compare(a, 10, fakeGesture("b", 0.9), 10).almostEqual).toBe(false);
    expect(compare(a, 10, fakeGesture("b", 0.85), 10).almostEqual).toBe(false);
  });
});

describe("avoidedKg", () => {
  const c = compare(avion, 10, train, 10);
  it("choix léger : ajoute lourd − léger", () => {
    expect(avoidedKg(c, "b")).toBeCloseTo(1.7);
  });
  it("choix lourd : 0, jamais négatif", () => {
    expect(avoidedKg(c, "a")).toBe(0);
  });
  it("choix léger face à un vélo à 0 : tout le lourd est évité", () => {
    expect(avoidedKg(compare(avion, 10, velo, 10), "b")).toBeCloseTo(2);
  });
});
