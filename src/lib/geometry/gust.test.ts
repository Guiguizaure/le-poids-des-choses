import { describe, expect, it } from "vitest";
import {
  GUST,
  gustDelay,
  gustDelays,
  gustLean,
  nextGustInterval,
} from "./gust";

const scene = { left: 100, width: 400 };

describe("gustDelay", () => {
  it("0 au bord gauche, durée complète au bord droit", () => {
    expect(gustDelay(100, scene)).toBe(0);
    expect(gustDelay(500, scene)).toBeCloseTo(GUST.crossDuration);
  });
  it("proportionnel à la position dans la scène", () => {
    expect(gustDelay(300, scene)).toBeCloseTo(0.6);
    expect(gustDelay(200, scene, 2)).toBeCloseTo(0.5);
  });
  it("borné hors de la scène", () => {
    expect(gustDelay(0, scene)).toBe(0);
    expect(gustDelay(9999, scene)).toBeCloseTo(GUST.crossDuration);
  });
  it("scène vide ou position invalide : 0", () => {
    expect(gustDelay(200, { left: 0, width: 0 })).toBe(0);
    expect(gustDelay(Number.NaN, scene)).toBe(0);
  });
});

describe("gustDelays", () => {
  it("les plantes plient l'une après l'autre de gauche à droite", () => {
    const delays = gustDelays([150, 250, 350, 450], scene);
    for (let i = 1; i < delays.length; i++)
      expect(delays[i]).toBeGreaterThan(delays[i - 1]);
  });
  it("garde l'ordre donné (pas de tri)", () => {
    const [right, left] = gustDelays([450, 150], scene);
    expect(right).toBeGreaterThan(left);
  });
  it("deux plantes à la même position plient ensemble", () => {
    const [a, b] = gustDelays([300, 300], scene);
    expect(a).toBe(b);
  });
});

describe("gustLean", () => {
  it("entre 6 et 10°", () => {
    expect(gustLean(() => 0)).toBe(6);
    expect(gustLean(() => 0.5)).toBe(8);
    expect(gustLean(() => 0.999999)).toBeCloseTo(10);
  });
  it("borne un aléa hors intervalle", () => {
    expect(gustLean(() => 5)).toBe(10);
    expect(gustLean(() => -1)).toBe(6);
    expect(gustLean(() => Number.NaN)).toBe(6);
  });
  it("valeurs aléatoires réelles dans l'intervalle", () => {
    for (let i = 0; i < 100; i++) {
      const lean = gustLean();
      expect(lean).toBeGreaterThanOrEqual(6);
      expect(lean).toBeLessThanOrEqual(10);
    }
  });
});

describe("nextGustInterval", () => {
  it("entre 25 et 45 s (rafales rares)", () => {
    expect(nextGustInterval(() => 0)).toBe(25);
    expect(nextGustInterval(() => 1)).toBe(45);
    for (let i = 0; i < 100; i++) {
      const wait = nextGustInterval();
      expect(wait).toBeGreaterThanOrEqual(25);
      expect(wait).toBeLessThanOrEqual(45);
    }
  });
});
