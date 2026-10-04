import { describe, expect, it } from "vitest";
import { headingAngle } from "./heading";

describe("headingAngle", () => {
  it("tête vers la droite quand on avance vers la droite", () => {
    expect(headingAngle(1)).toBe(90);
    expect(headingAngle(45)).toBe(90);
  });
  it("tête vers la gauche au retour (demi-tour de 180°)", () => {
    expect(headingAngle(-1)).toBe(-90);
    expect(Math.abs(headingAngle(1) - headingAngle(-1))).toBe(180);
  });
  it("vers le haut : 0 ; vers le bas : 180", () => {
    expect(headingAngle(0, -1)).toBe(0);
    expect(headingAngle(0, 1)).toBe(180);
  });
  it("diagonale : 45°", () => {
    expect(headingAngle(1, -1)).toBeCloseTo(45);
  });
  it("sans déplacement ou valeur invalide : 0", () => {
    expect(headingAngle(0, 0)).toBe(0);
    expect(headingAngle(Number.NaN)).toBe(0);
  });
});
