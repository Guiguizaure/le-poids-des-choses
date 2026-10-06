import { describe, expect, it } from "vitest";
import { PLANT_BOUNDS } from "@/lib/illustrations/bounds.generated";
import { getSpec, type IllustrationName } from "@/lib/illustrations/specs";
import { PLANT_FRAME_WIDTH } from "./model";
import { VITRINE, vitrineFit } from "./vitrine";

const PLANTS = Object.keys(PLANT_BOUNDS) as IllustrationName[];

/** Emprise du dessin une fois placé dans la vitrine. */
function placed(name: IllustrationName) {
  const fit = vitrineFit(name);
  const b = PLANT_BOUNDS[name];
  const stroke = b.stroke * fit.strokeScale * fit.zoom;
  return {
    fit,
    // Le trait n'est pas agrandi : sa demi-épaisseur (celle du jardin) s'ajoute telle quelle.
    top: fit.top + b.y * fit.zoom - stroke,
    left: fit.left + b.x * fit.zoom - stroke,
    right: fit.left + (b.x + b.width) * fit.zoom + stroke,
  };
}

describe("vitrine de révélation", () => {
  it("couvre tous les arbres et toutes les fleurs, à chaque stade", () => {
    // 6 arbres à 3 stades, 6 fleurs à 2 stades.
    expect(PLANTS).toHaveLength(30);
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
  it("chaque plante occupe l'essentiel de la hauteur de la vitrine (ou de sa largeur, pour une pousse basse et large)", () => {
    for (const name of PLANTS) {
      const { top, left, right } = placed(name);
      const tall = VITRINE.foot.y - top > 90;
      // Bornée par sa demi-largeur, d'un côté du pied ou de l'autre.
      const limit = VITRINE.plantHalfWidth * 0.9;
      const wide =
        VITRINE.foot.x - left > limit || right - VITRINE.foot.x > limit;
      expect(tall || wide, name).toBe(true);
    }
  });
  it("une pousse est agrandie, un grand arbre garde à peu près sa taille", () => {
    expect(vitrineFit("arbre-1-pousse").zoom).toBeGreaterThan(2.5);
    expect(vitrineFit("fleur-1-pousse").zoom).toBeGreaterThan(3.5);
    expect(vitrineFit("arbre-1-grand").zoom).toBeCloseTo(130 / 146, 3);
  });
  it.each(PLANTS)("%s : trait à l'épaisseur du jardin", (name) => {
    const fit = vitrineFit(name);
    const type = name.startsWith("arbre-") ? "tree" : "flower";
    // Dans la vitrine, une unité du SVG vaut `zoom` unités ; dans le jardin, cadre / largeur.
    expect(fit.strokeScale * fit.zoom).toBeCloseTo(
      PLANT_FRAME_WIDTH[type] / getSpec(name).width,
      10,
    );
  });
  it("refuse ce qui n'est pas une plante", () => {
    expect(() => vitrineFit("papillon" as IllustrationName)).toThrow(
      /pas une plante/,
    );
  });
});
