import { describe, expect, it } from "vitest";
import {
  FLOAT,
  floatLayout,
  floatMotion,
  floatRow,
  keepApart,
  parallaxOffset,
  rotatedBox,
} from "./float";

describe("fruits et légumes flottants : places", () => {
  for (let count = 1; count <= 5; count++) {
    const items = floatLayout(count).map((slot, i) => ({
      slot,
      motion: floatMotion(i),
    }));

    it(`${count} produit(s) : dans la zone, même en flottant`, () => {
      expect(items).toHaveLength(count);
      for (const { slot, motion } of items) {
        const box = rotatedBox(slot, motion);
        expect(box.left).toBeGreaterThanOrEqual(0);
        expect(box.right).toBeLessThanOrEqual(FLOAT.zone.width);
        expect(box.top - motion.drift).toBeGreaterThanOrEqual(0);
        expect(box.bottom + motion.drift).toBeLessThanOrEqual(
          FLOAT.zone.height,
        );
      }
    });

    it(`${count} produit(s) : jamais de chevauchement`, () => {
      for (let i = 0; i < items.length; i++)
        for (let j = i + 1; j < items.length; j++)
          expect(keepApart(items[i], items[j]), `${i} et ${j}`).toBe(true);
    });
  }

  it("tailles légèrement différentes, inclinaisons douces", () => {
    const slots = floatLayout(5);
    expect(new Set(slots.map((s) => s.size)).size).toBeGreaterThan(2);
    for (const slot of slots) {
      expect(Math.abs(slot.tilt)).toBeLessThanOrEqual(8);
      expect(slot.size).toBeGreaterThanOrEqual(48);
      expect(slot.size).toBeLessThanOrEqual(72);
    }
  });

  it("aucun produit, aucune place ; au-delà de 5, cinq places", () => {
    expect(floatLayout(0)).toEqual([]);
    expect(floatLayout(9)).toHaveLength(5);
  });

  it("rangée mobile : 3 au plus", () => {
    expect(floatRow(5)).toHaveLength(3);
    expect(floatRow(2)).toHaveLength(2);
    expect(floatRow(0)).toEqual([]);
  });

  it("deux chevauchements détectés", () => {
    const motion = floatMotion(0);
    const a = { slot: { x: 0, y: 0, size: 60, tilt: 0 }, motion };
    expect(keepApart(a, { ...a, slot: { ...a.slot, x: 30 } })).toBe(false);
    // Séparés de moins que leurs dérives cumulées : ils se toucheraient en flottant.
    expect(keepApart(a, { ...a, slot: { ...a.slot, y: 66 } })).toBe(false);
  });
});

describe("fruits et légumes flottants : mouvement", () => {
  it("durées et départs tous différents (jamais synchrones), amplitudes bornées", () => {
    const motions = [0, 1, 2, 3, 4].map(floatMotion);
    expect(new Set(motions.map((m) => m.duration)).size).toBe(5);
    expect(new Set(motions.map((m) => m.delay)).size).toBe(5);
    for (const m of motions) {
      expect(Math.abs(m.drift)).toBeLessThanOrEqual(FLOAT.maxDrift);
      expect(Math.abs(m.swing)).toBeLessThanOrEqual(FLOAT.maxSwing);
      expect(Math.abs(m.parallax)).toBeLessThanOrEqual(FLOAT.maxParallax);
      expect(m.duration).toBeGreaterThan(2);
    }
  });

  it("parallaxe : nulle au milieu de l'écran, bornée aux bords", () => {
    expect(parallaxOffset(400, 800, 6)).toBe(0);
    expect(parallaxOffset(800, 800, 6)).toBe(6);
    expect(parallaxOffset(0, 800, 6)).toBe(-6);
    expect(parallaxOffset(5000, 800, 6)).toBe(6);
    expect(parallaxOffset(-5000, 800, 6)).toBe(-6);
    expect(parallaxOffset(600, 800, 6)).toBe(3);
    expect(parallaxOffset(100, 0, 6)).toBe(0);
  });
});
