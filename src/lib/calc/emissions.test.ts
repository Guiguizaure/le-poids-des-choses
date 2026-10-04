import { describe, expect, it } from "vitest";
import { emissions } from "./emissions";
import { fakeGesture } from "./helpers.test-util";

describe("emissions", () => {
  it("multiplie le facteur par la quantité", () => {
    expect(emissions(fakeGesture("x", 0.2), 10)).toBeCloseTo(2);
  });
  it("vaut 0 pour une quantité de 0", () => {
    expect(emissions(fakeGesture("x", 0.2), 0)).toBe(0);
  });
  it("ignore les quantités négatives ou invalides", () => {
    expect(emissions(fakeGesture("x", 0.2), -5)).toBe(0);
    expect(emissions(fakeGesture("x", 0.2), Number.NaN)).toBe(0);
  });
  it("vaut 0 pour un geste à 0 (vélo)", () => {
    expect(emissions(fakeGesture("velo", 0), 50)).toBe(0);
  });
});
