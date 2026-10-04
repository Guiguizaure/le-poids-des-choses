import { describe, expect, it } from "vitest";
import { BALANCE, beamPosition, tiltToAngle } from "./balance";

describe("tiltToAngle", () => {
  it("convertit -1..1 en ±12°", () => {
    expect(tiltToAngle(0)).toBe(0);
    expect(tiltToAngle(1)).toBe(12);
    expect(tiltToAngle(-1)).toBe(-12);
    expect(tiltToAngle(0.5)).toBe(6);
  });
  it("borne les valeurs hors intervalle", () => {
    expect(tiltToAngle(3)).toBe(12);
    expect(tiltToAngle(-7)).toBe(-12);
  });
  it("valeur invalide → 0", () => {
    expect(tiltToAngle(Number.NaN)).toBe(0);
    expect(tiltToAngle(Number.POSITIVE_INFINITY)).toBe(0);
  });
  it("accepte un angle maximal personnalisé", () => {
    expect(tiltToAngle(1, 20)).toBe(20);
  });
});

describe("beamPosition", () => {
  const { pivot, armLength } = BALANCE;

  it("au repos, extrémités en 40,40 et 240,40, aucun déplacement", () => {
    const p = beamPosition(0);
    expect(p.left).toEqual({ x: 40, y: 40 });
    expect(p.right).toEqual({ x: 240, y: 40 });
    expect(p.leftOffset.x).toBeCloseTo(0);
    expect(p.leftOffset.y).toBeCloseTo(0);
    expect(p.rightOffset.x).toBeCloseTo(0);
    expect(p.rightOffset.y).toBeCloseTo(0);
  });

  it("angle positif : le plateau droit descend, le gauche monte", () => {
    const p = beamPosition(12);
    expect(p.rightOffset.y).toBeGreaterThan(0);
    expect(p.leftOffset.y).toBeLessThan(0);
    expect(p.rightOffset.y).toBeCloseTo(
      armLength * Math.sin((12 * Math.PI) / 180),
    );
  });

  it("les extrémités se rapprochent du mât en s'inclinant", () => {
    const p = beamPosition(12);
    expect(p.rightOffset.x).toBeLessThan(0);
    expect(p.leftOffset.x).toBeGreaterThan(0);
    expect(p.rightOffset.x).toBeCloseTo(
      -armLength * (1 - Math.cos((12 * Math.PI) / 180)),
    );
  });

  it("les extrémités restent à la longueur du bras et symétriques autour du pivot", () => {
    for (const angle of [-12, -5, 0, 3.3, 12]) {
      const p = beamPosition(angle);
      expect(Math.hypot(p.right.x - pivot.x, p.right.y - pivot.y)).toBeCloseTo(
        armLength,
      );
      expect(Math.hypot(p.left.x - pivot.x, p.left.y - pivot.y)).toBeCloseTo(
        armLength,
      );
      expect((p.left.x + p.right.x) / 2).toBeCloseTo(pivot.x);
      expect((p.left.y + p.right.y) / 2).toBeCloseTo(pivot.y);
    }
  });

  it("angles opposés : positions miroir", () => {
    const a = beamPosition(8);
    const b = beamPosition(-8);
    expect(a.rightOffset.y).toBeCloseTo(-b.rightOffset.y);
    expect(a.leftOffset.y).toBeCloseTo(b.rightOffset.y);
  });

  it("90° : le bras droit pend sous le pivot (cohérence du repère)", () => {
    const p = beamPosition(90);
    expect(p.right.x).toBeCloseTo(pivot.x);
    expect(p.right.y).toBeCloseTo(pivot.y + armLength);
  });
});
