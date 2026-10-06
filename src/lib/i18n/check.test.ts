import { describe, expect, it } from "vitest";
import { checkEnglishNames } from "./check";

describe("garde-fou des noms anglais", () => {
  it("passe avec les données actuelles", () => {
    expect(checkEnglishNames().ok).toBe(true);
  });
  it("échoue si un geste ou un produit n'a pas de nom anglais", () => {
    const result = checkEnglishNames(["nouveau-geste"], ["kumquat"]);
    expect(result.ok).toBe(false);
    expect(result.message).toContain("geste nouveau-geste");
    expect(result.message).toContain("produit kumquat");
  });
});
