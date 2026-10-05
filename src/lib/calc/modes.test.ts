import { describe, expect, it } from "vitest";
import { getGesture } from "@/lib/data";
import type { Gesture } from "@/lib/data/types";
import { avoidedKg } from "./compare";
import { emissions } from "./emissions";
import { acquisitionModes, compareModes, withMode } from "./modes";

const jean = getGesture("jean") as Gesture;
const tgv = getGesture("tgv") as Gesture;

describe("modes d'acquisition", () => {
  it("un objet propose les 4 modes, un trajet aucun", () => {
    expect(acquisitionModes(jean).sort()).toEqual([
      "garder",
      "neuf",
      "occasion",
      "occasion-livree",
    ]);
    expect(acquisitionModes(tgv)).toEqual([]);
  });
  it("withMode renvoie un geste ordinaire avec la valeur du mode", () => {
    expect(withMode(jean, "neuf")?.kgCo2ePerUnit).toBe(jean.kgCo2ePerUnit);
    expect(withMode(jean, "garder")?.kgCo2ePerUnit).toBe(0);
    expect(withMode(jean, "occasion")?.kgCo2ePerUnit).toBe(0);
    const livre = withMode(jean, "occasion-livree");
    expect(livre?.kgCo2ePerUnit).toBeGreaterThan(0);
    expect(livre?.kgCo2ePerUnit).toBeLessThan(jean.kgCo2ePerUnit);
    expect(livre?.id).toBe("jean@occasion-livree");
  });
  it("withMode : undefined si le mode n'existe pas", () => {
    expect(withMode(tgv, "occasion")).toBeUndefined();
  });
  it("emissions passe par le mode", () => {
    expect(emissions(withMode(jean, "neuf")!, 2)).toBeCloseTo(
      2 * jean.kgCo2ePerUnit,
    );
    expect(emissions(withMode(jean, "garder")!, 2)).toBe(0);
  });
  it("neuf vs garder : l’écart vaut tout le neuf, ratio null", () => {
    const c = compareModes(jean, 1, "neuf", "garder")!;
    expect(c.lighter).toBe("b");
    expect(c.ratio).toBeNull();
    expect(avoidedKg(c, "b")).toBeCloseTo(jean.kgCo2ePerUnit);
    expect(avoidedKg(c, "a")).toBe(0);
  });
  it("neuf vs occasion livrée : écart = neuf − colis", () => {
    const livre = jean.modes!["occasion-livree"]!.kgCo2e;
    const c = compareModes(jean, 1, "neuf", "occasion-livree")!;
    expect(c.differenceKg).toBeCloseTo(jean.kgCo2ePerUnit - livre);
    expect(c.lighter).toBe("b");
  });
  it("occasion livrée vs garder : garder est plus léger", () => {
    const c = compareModes(jean, 1, "occasion-livree", "garder")!;
    expect(c.lighter).toBe("b");
    expect(c.differenceKg).toBeCloseTo(jean.modes!["occasion-livree"]!.kgCo2e);
  });
  it("deux modes à 0 (occasion vs garder) : égaux, aucun écart", () => {
    const c = compareModes(jean, 1, "occasion", "garder")!;
    expect(c.differenceKg).toBe(0);
    expect(c.almostEqual).toBe(true);
    expect(avoidedKg(c, "a")).toBe(0);
    expect(avoidedKg(c, "b")).toBe(0);
  });
  it("même mode des deux côtés : égalité", () => {
    expect(compareModes(jean, 1, "neuf", "neuf")!.differenceKg).toBe(0);
  });
  it("quantité 0 : tout vaut 0", () => {
    expect(compareModes(jean, 0, "neuf", "garder")!.differenceKg).toBe(0);
  });
  it("mode manquant : undefined", () => {
    expect(compareModes(tgv, 1, "neuf", "garder")).toBeUndefined();
  });
});
