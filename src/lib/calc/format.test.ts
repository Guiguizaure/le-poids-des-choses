import { describe, expect, it } from "vitest";
import { formatMass } from "./format";

describe("formatMass", () => {
  it.each([
    [0, "0 g"],
    [0.35, "350 g"],
    [0.0004, "0 g"],
    [0.9996, "1 kg"],
    [1, "1 kg"],
    [1.24, "1,2 kg"],
    [1.26, "1,3 kg"],
    [12, "12 kg"],
    [999.94, "999,9 kg"],
    [999.96, "1 t"],
    [1400, "1,4 t"],
    [12_345, "12,3 t"],
  ])("%s kg → %s", (kg, expected) => {
    expect(formatMass(kg)).toBe(expected);
  });
  it("valeurs négatives ou invalides → 0 g", () => {
    expect(formatMass(-2)).toBe("0 g");
    expect(formatMass(Number.NaN)).toBe("0 g");
  });
});
