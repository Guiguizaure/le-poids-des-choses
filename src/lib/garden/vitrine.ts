import { PLANT_BOUNDS } from "@/lib/illustrations/bounds.generated";
import { getSpec, type IllustrationName } from "@/lib/illustrations/specs";
import { PLANT_FRAME_WIDTH } from "./model";

/**
 * Vitrine de la carte de révélation (300×190) : la plante se dresse au sommet de la colline
 * (pied en 150,142) et occupe toute la hauteur disponible, quel que soit son stade : une pousse
 * est agrandie (dans le jardin, elle garde sa vraie taille). Sa largeur reste bornée pour
 * laisser la place à l'animal qui arrive par la droite.
 */
export const VITRINE = {
  width: 300,
  height: 190,
  foot: { x: 150, y: 142 },
  /** Hauteur du dessin, du pied jusqu'au haut de la plante. */
  plantHeight: 130,
  /** Demi-largeur maximale du dessin autour du pied. */
  plantHalfWidth: 60,
} as const;

export type VitrineFit = {
  /** Agrandissement du dessin, par rapport à son cadre (les traits ne suivent pas). */
  zoom: number;
  /**
   * Facteur à appliquer aux épaisseurs de trait du SVG pour retrouver celles du jardin, où
   * le cadre est dessiné à `PLANT_FRAME_WIDTH` unités de scène (la moitié de sa largeur).
   */
  strokeScale: number;
  /** Cadre de l'illustration dans la vitrine (unités de la vitrine). */
  left: number;
  top: number;
  width: number;
};

export function vitrineFit(name: IllustrationName): VitrineFit {
  const spec = getSpec(name);
  const bounds = PLANT_BOUNDS[name];
  if (!bounds || !spec.anchor)
    throw new Error(
      `« ${name} » n'est pas une plante (emprise ou pied manquant).`,
    );
  const { anchor } = spec;
  const type = name.startsWith("arbre-") ? "tree" : "flower";
  // Épaisseur d'un trait dans le jardin, en unités de scène, pour une unité du SVG.
  const gardenScale = PLANT_FRAME_WIDTH[type] / spec.width;
  const stroke = bounds.stroke * gardenScale;
  const height = anchor.y - bounds.y;
  const halfWidth = Math.max(
    anchor.x - bounds.x,
    bounds.x + bounds.width - anchor.x,
  );
  // Seule la forme est agrandie : le trait garde son épaisseur du jardin (`strokeScale`).
  const zoom = Math.min(
    (VITRINE.plantHeight - stroke) / height,
    (VITRINE.plantHalfWidth - stroke) / halfWidth,
  );
  return {
    zoom,
    strokeScale: gardenScale / zoom,
    left: VITRINE.foot.x - anchor.x * zoom,
    top: VITRINE.foot.y - anchor.y * zoom,
    width: spec.width * zoom,
  };
}
