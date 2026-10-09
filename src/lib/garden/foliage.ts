// Feuillage des arbres caducs au fil des saisons (planche « Saisons · feuillage », Figma, et
// saisons-feuillage.json livré le 9 octobre 2026). Printemps et été : le dessin tel quel.
// Automne : un dégradé vertical par espèce, du haut vers le bas du feuillage, à tous les stades.
// Hiver : l'arbre dort, sans feuilles ; ses branches nues portent de petits bourgeons verts
// (signe qu'il dort, pas qu'il est mort). Aucun `id` dans les dessins publiés : les dégradés
// sont créés par le code (StagedPlant, image de partage). Faits et sources :
// docs/especes-sources.md (« Au fil des saisons »).
import { invert, parseTransform, type Matrix } from "@/lib/geometry/matrix";

export type TreeStage = "pousse" | "jeune" | "grand";

/** Dégradé d'automne : couleur du haut, du bas, et hauteurs (unités du dessin 120×160). */
export type AutumnFoliage = {
  mode: "autumn";
  top: string;
  bottom: string;
  /** Début et fin du dégradé pour chaque stade (haut et bas du feuillage). */
  y: Record<TreeStage, readonly [number, number]>;
};

/** Branches nues d'un arbre endormi, posées sur le dessin du stade (unités du dessin). */
export type BareBranches = {
  /** Transformation commune (dessin réduit autour du pied, comme le figuier adulte). */
  transform?: string;
  branches: readonly { d: string; width: number }[];
  buds: readonly { x: number; y: number }[];
  budRadius: number;
};

export type WinterFoliage = {
  mode: "asleep";
  bare: Record<TreeStage, BareBranches>;
};

export type SeasonalFoliage = AutumnFoliage | WinterFoliage;

/** Branches : encre ; bourgeons : vert pomme (couleurs de la palette). */
export const BRANCH_COLOR = "#1F1A17";
export const BUD_COLOR = "#2FBF71";

/** Petit rayon des bourgeons des stades « pousse » et « jeune » (3,2 sur l'adulte). */
const SMALL_BUD = 2.6;

/**
 * Pousse endormie (pommier, cerisier) : la tige, deux brindilles en V et trois bourgeons, là
 * où étaient les deux feuilles. Proposition, à valider sur capture.
 */
const bareSprout = (top: number): BareBranches => ({
  branches: [
    {
      d: `M60 ${top + 8} L52 ${top} M60 ${top + 5} L68 ${top - 3}`,
      width: 3,
    },
  ],
  buds: [
    { x: 60, y: top },
    { x: 52, y: top },
    { x: 68, y: top - 3 },
  ],
  budRadius: SMALL_BUD,
});

/** Couleurs et hauteurs de la planche ; stades « pousse » et « jeune » adaptés à leur feuillage. */
export const AUTUMN: Record<"arbre-1" | "arbre-3" | "arbre-6", AutumnFoliage> =
  {
    // Pommier : orange → rouille.
    "arbre-1": {
      mode: "autumn",
      top: "#FFB23E",
      bottom: "#B9552A",
      y: { pousse: [120, 138], jeune: [64, 112], grand: [10, 98] },
    },
    // Cerisier : rouge → bordeaux.
    "arbre-3": {
      mode: "autumn",
      top: "#FF4F2E",
      bottom: "#9E1F3D",
      y: { pousse: [120, 138], jeune: [76, 112], grand: [16, 104] },
    },
    // Figuier : jaune → or. La planche donne 50 → 112 pour le dessin d'origine ; le figuier
    // adulte du jardin est réduit à 0,85 autour du pied (translate(9 23.4) scale(0.85)), et le
    // jeune est le même dessin à 0,55 autour du pied.
    "arbre-6": {
      mode: "autumn",
      top: "#FFD84A",
      bottom: "#D99A1E",
      y: { pousse: [114, 138], jeune: [97.7, 131.8], grand: [65.9, 118.6] },
    },
  };

/** Hiver : branches nues de la planche pour les adultes, proposition pour les jeunes stades. */
export const WINTER: Record<"arbre-1" | "arbre-3" | "arbre-6", WinterFoliage> =
  {
    "arbre-1": {
      mode: "asleep",
      bare: {
        pousse: bareSprout(128),
        // Les branches de l'adulte, ramenées au houppier du jeune arbre (rayon 24 au lieu
        // de 44), traits et bourgeons gardés lisibles.
        jeune: {
          branches: [
            {
              d: "M60 115.3 L41.5 91.3 M60 109.8 L79.6 85.8 M60 104.4 L60 67.3",
              width: 4,
            },
            { d: "M60 83.6 L51.3 74.9 M60 78.2 L67.6 70.6", width: 3 },
          ],
          buds: [
            { x: 41.5, y: 91.3 },
            { x: 79.6, y: 85.8 },
            { x: 60, y: 67.3 },
            { x: 51.3, y: 74.9 },
            { x: 67.6, y: 70.6 },
          ],
          budRadius: SMALL_BUD,
        },
        grand: {
          branches: [
            { d: "M60 104 L 26 60 M60 94 L 96 50 M60 84 L 60 16", width: 5 },
            {
              d: "M40 78 L 26 80 M38 70 L 40 52 M82 66 L 98 70 M80 60 L 76 40 M60 46 L 44 30 M60 36 L 74 22",
              width: 3.5,
            },
          ],
          buds: [
            { x: 26, y: 60 },
            { x: 96, y: 50 },
            { x: 60, y: 16 },
            { x: 26, y: 80 },
            { x: 40, y: 52 },
            { x: 98, y: 70 },
            { x: 76, y: 40 },
            { x: 44, y: 30 },
            { x: 74, y: 22 },
          ],
          budRadius: 3.2,
        },
      },
    },
    "arbre-3": {
      mode: "asleep",
      bare: {
        pousse: bareSprout(128),
        jeune: {
          branches: [
            { d: "M60 110 L42 92 M60 106 L78 86 M60 102 L61 74", width: 4 },
            { d: "M61 86 L53 79 M61 81 L68 75", width: 3 },
          ],
          buds: [
            { x: 42, y: 92 },
            { x: 78, y: 86 },
            { x: 61, y: 74 },
            { x: 53, y: 79 },
            { x: 68, y: 75 },
          ],
          budRadius: SMALL_BUD,
        },
        grand: {
          branches: [
            { d: "M60 110 L 18 74 M60 100 L 100 64 M60 92 L 62 18", width: 5 },
            {
              d: "M34 88 L 20 92 M36 86 L 34 66 M84 78 L 102 82 M84 78 L 80 56 M61 52 L 46 36 M62 40 L 76 26",
              width: 3.5,
            },
          ],
          buds: [
            { x: 18, y: 74 },
            { x: 100, y: 64 },
            { x: 62, y: 18 },
            { x: 20, y: 92 },
            { x: 34, y: 66 },
            { x: 102, y: 82 },
            { x: 80, y: 56 },
            { x: 46, y: 36 },
            { x: 76, y: 26 },
          ],
          budRadius: 3.2,
        },
      },
    },
    // Le figuier a déjà ses branches dans son tronc : seulement les bourgeons, au bout.
    "arbre-6": {
      mode: "asleep",
      bare: {
        pousse: {
          branches: [{ d: "M60 138 L52 130 M60 135 L68 127", width: 3 }],
          buds: [
            { x: 60, y: 130 },
            { x: 52, y: 130 },
            { x: 68, y: 127 },
          ],
          budRadius: SMALL_BUD,
        },
        jeune: {
          branches: [],
          buds: [
            { x: 45.7, y: 121.9 },
            { x: 75.4, y: 119.7 },
            { x: 57.8, y: 109.8 },
          ],
          budRadius: SMALL_BUD,
        },
        grand: {
          transform: "translate(9 23.4) scale(0.85)",
          branches: [],
          buds: [
            { x: 34, y: 94 },
            { x: 88, y: 90 },
            { x: 56, y: 72 },
          ],
          budRadius: 3.2,
        },
      },
    },
  };

/**
 * Le dégradé d'automne est défini dans le repère de l'arbre ; une forme du feuillage peut
 * avoir sa propre transformation (feuilles du figuier, pousses inclinées). Le dégradé de cette
 * forme reçoit alors l'inverse de sa transformation (`gradientTransform`), pour que toutes les
 * formes partagent le même haut et le même bas.
 */
export function gradientTransformFor(
  shapeTransform: string | null | undefined,
): string | null {
  const matrix = parseTransform(shapeTransform);
  if (matrix.every((value, index) => value === [1, 0, 0, 1, 0, 0][index]))
    return null;
  return matrixAttribute(invert(matrix));
}

const round = (value: number) => Math.round(value * 10000) / 10000;

export function matrixAttribute(matrix: Matrix): string {
  return `matrix(${matrix.map(round).join(" ")})`;
}

/** Branches nues et bourgeons, en SVG (image de partage ; le jardin les dessine en React). */
export function bareBranchesSvg(bare: BareBranches): string {
  const shapes = [
    ...bare.branches.map(
      (branch) =>
        `<path d="${branch.d}" stroke="${BRANCH_COLOR}" stroke-width="${branch.width}" stroke-linecap="round" fill="none"/>`,
    ),
    ...bare.buds.map(
      (bud) =>
        `<circle cx="${bud.x}" cy="${bud.y}" r="${bare.budRadius}" fill="${BUD_COLOR}"/>`,
    ),
  ].join("");
  return bare.transform
    ? `<g transform="${bare.transform}">${shapes}</g>`
    : `<g>${shapes}</g>`;
}
