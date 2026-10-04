import { describe, expect, it } from "vitest";
import { PLANT_BOUNDS } from "@/lib/illustrations/bounds.generated";
import { getSpec, type IllustrationName } from "@/lib/illustrations/specs";
import { VITRINE, vitrineFit } from "./vitrine";

const PLANTS = Object.keys(PLANT_BOUNDS) as IllustrationName[];

/** Emprise du dessin une fois placé dans la vitrine. */
function placed(name: IllustrationName) {
  const fit = vitrineFit(name);
  const b = PLANT_BOUNDS[name];
  return {
    fit,
    top: fit.top + b.y * fit.zoom,
    left: fit.left + b.x * fit.zoom,
    right: fit.left + (b.x + b.width) * fit.zoom,
  };
}

describe("vitrine de révélation", () => {
  it("couvre tous les arbres et toutes les fleurs, à chaque stade", () => {
    expect(PLANTS).toHaveLength(15);
  });
  it.each(PLANTS)(
    "%s : pied au sommet de la colline, dessin dans la vitrine",
    (name) => {
      const { fit, top, left, right } = placed(name);
      const anchor = getSpec(name).anchor!;
      expect(fit.left + anchor.x * fit.zoom).toBeCloseTo(VITRINE.foot.x, 5);
      expect(fit.top + anchor.y * fit.zoom).toBeCloseTo(VITRINE.foot.y, 5);
      expect(top).toBeGreaterThanOrEqual(
        VITRINE.foot.y - VITRINE.plantHeight - 1e-6,
      );
      expect(left).toBeGreaterThanOrEqual(
        VITRINE.foot.x - VITRINE.plantHalfWidth - 1e-6,
      );
      expect(right).toBeLessThanOrEqual(
        VITRINE.foot.x + VITRINE.plantHalfWidth + 1e-6,
      );
    },
  );
  it("chaque plante occupe l'essentiel de la hauteur de la vitrine", () => {
    for (const name of PLANTS) {
      const { top } = placed(name);
      expect(VITRINE.foot.y - top, name).toBeGreaterThan(90);
    }
  });
  it("une pousse est agrandie, un grand arbre garde à peu près sa taille", () => {
    expect(vitrineFit("arbre-1-pousse").zoom).toBeGreaterThan(2.5);
    expect(vitrineFit("fleur-1-pousse").zoom).toBeGreaterThan(3.5);
    expect(vitrineFit("arbre-1-grand").zoom).toBeCloseTo(130 / 146, 3);
  });
  it("refuse ce qui n'est pas une plante", () => {
    expect(() => vitrineFit("papillon" as IllustrationName)).toThrow(
      /pas une plante/,
    );
  });
});
