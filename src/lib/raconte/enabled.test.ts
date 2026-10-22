import { describe, expect, it } from "vitest";
import { isRaconteEnabled, pageExtensions } from "./enabled";

describe("interrupteur de « Raconte ta journée » (NEXT_PUBLIC_RACONTE_ENABLED)", () => {
  it("éteint par défaut : seul « 1 » l'allume", () => {
    expect(isRaconteEnabled(undefined)).toBe(false);
    for (const value of ["", "0", "true", "oui", " 1"])
      expect(isRaconteEnabled(value)).toBe(false);
    expect(isRaconteEnabled("1")).toBe(true);
  });
  it("éteint, les pages page.raconte.tsx ne sont pas des pages ; allumé, elles le sont", () => {
    expect(pageExtensions(false)).toEqual(["tsx", "ts", "jsx", "js"]);
    expect(pageExtensions(true)).toEqual([
      "raconte.tsx",
      "tsx",
      "ts",
      "jsx",
      "js",
    ]);
  });
});
