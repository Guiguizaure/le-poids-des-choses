// Géométrie de scene-paysage.svg (390×300) : ligne du sol et des collines, sur laquelle on
// pose les plantes. Les contours viennent de scene.generated.ts, extrait automatiquement du SVG
// par `pnpm illustrations` : redessiner les collines met le jardin à jour.
import { GROUND_TOP, HILL_OUTLINES } from "./scene.generated";

export const SCENE = { width: 390, height: 300 } as const;

/** Haut du calque « sol ». */
export const GROUND_Y = GROUND_TOP;

/** y le plus haut d'un contour en x (null si le contour ne passe pas par x). */
function outlineTop(
  points: readonly (readonly [number, number])[],
  x: number,
): number | null {
  let top: number | null = null;
  for (let i = 1; i < points.length; i++) {
    const [x1, y1] = points[i - 1];
    const [x2, y2] = points[i];
    if (x < Math.min(x1, x2) || x > Math.max(x1, x2)) continue;
    const y =
      x1 === x2 ? Math.min(y1, y2) : y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
    top = top === null ? y : Math.min(top, y);
  }
  return top;
}

/** Hauteur du premier plan de terre (colline ou sol) visible en x. */
export function surfaceY(x: number): number {
  let y = GROUND_Y;
  for (const outline of Object.values(HILL_OUTLINES)) {
    const top = outlineTop(outline, x);
    if (top !== null) y = Math.min(y, top);
  }
  return y;
}
