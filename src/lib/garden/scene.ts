// Géométrie de scene-paysage.svg (390×300) : ligne du sol et des collines, sur laquelle on
// pose les plantes. Si les collines sont redessinées, reporter ici leurs courbes.
import type { Point } from "@/lib/illustrations/specs";

export const SCENE = { width: 390, height: 300 } as const;

type Cubic = readonly [Point, Point, Point, Point];

/** Crêtes des collines (chemins « colline-arriere » et « colline-avant »). */
const HILLS: readonly Cubic[] = [
  [
    { x: -30, y: 250 },
    { x: 60, y: 150 },
    { x: 170, y: 150 },
    { x: 250, y: 250 },
  ],
  [
    { x: 140, y: 255 },
    { x: 230, y: 165 },
    { x: 330, y: 165 },
    { x: 430, y: 250 },
  ],
];

/** Haut du calque « sol ». */
export const GROUND_Y = 240;

function cubicAt(c: Cubic, t: number): Point {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const d = 3 * u * t * t;
  const e = t * t * t;
  return {
    x: a * c[0].x + b * c[1].x + d * c[2].x + e * c[3].x,
    y: a * c[0].y + b * c[1].y + d * c[2].y + e * c[3].y,
  };
}

/** y de la crête d'une colline en x (x croissant le long de la courbe), ou null hors colline. */
function hillY(c: Cubic, x: number): number | null {
  if (x < c[0].x || x > c[3].x) return null;
  let low = 0;
  let high = 1;
  for (let i = 0; i < 40; i++) {
    const mid = (low + high) / 2;
    if (cubicAt(c, mid).x < x) low = mid;
    else high = mid;
  }
  return cubicAt(c, (low + high) / 2).y;
}

/** Hauteur du premier plan de terre (colline ou sol) visible en x. */
export function surfaceY(x: number): number {
  let y = GROUND_Y;
  for (const hill of HILLS) {
    const top = hillY(hill, x);
    if (top !== null) y = Math.min(y, top);
  }
  return y;
}
