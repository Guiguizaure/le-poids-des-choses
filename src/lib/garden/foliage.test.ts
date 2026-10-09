import { describe, expect, it } from "vitest";
import {
  applyMatrix,
  multiply,
  parseTransform,
  type Matrix,
} from "@/lib/geometry/matrix";
import {
  AUTUMN,
  bareBranchesSvg,
  BUD_COLOR,
  gradientTransformFor,
  WINTER,
} from "./foliage";

const parseMatrix = (text: string): Matrix =>
  text
    .match(/matrix\(([^)]+)\)/)![1]
    .split(" ")
    .map(Number) as unknown as Matrix;

describe("feuillage au fil des saisons", () => {
  it("forme sans transformation : le dégradé est dans le repère de l'arbre, rien à corriger", () => {
    expect(gradientTransformFor(null)).toBeNull();
    expect(gradientTransformFor("")).toBeNull();
  });

  it("forme transformée (feuille du figuier) : le dégradé reçoit l'inverse, haut et bas restent ceux de l'arbre", () => {
    const transform =
      "translate(9 23.4) scale(0.85) translate(42 72) rotate(-20) scale(1.25)";
    const shape = parseTransform(transform);
    const inverse = parseMatrix(gradientTransformFor(transform)!);
    // Repère de l'arbre ← forme ← dégradé : l'identité, à l'arrondi près.
    const back = multiply(shape, inverse);
    [1, 0, 0, 1, 0, 0].forEach((value, index) =>
      expect(back[index]).toBeCloseTo(value, 3),
    );
    const [, top] = applyMatrix(back, 60, AUTUMN["arbre-6"].y.grand[0]);
    expect(top).toBeCloseTo(AUTUMN["arbre-6"].y.grand[0], 2);
  });

  it("hiver : branches et bourgeons de la planche dans le cadre 120×160, à chaque stade", () => {
    for (const winter of Object.values(WINTER))
      for (const bare of Object.values(winter.bare)) {
        const matrix = parseTransform(bare.transform);
        for (const bud of bare.buds) {
          const [x, y] = applyMatrix(matrix, bud.x, bud.y);
          expect(x).toBeGreaterThan(0);
          expect(x).toBeLessThan(120);
          expect(y).toBeGreaterThan(0);
          expect(y).toBeLessThan(160);
        }
        const svg = bareBranchesSvg(bare);
        expect(svg).not.toMatch(/\sid="/);
        expect(svg.match(new RegExp(BUD_COLOR, "g"))).toHaveLength(
          bare.buds.length,
        );
      }
  });
});
