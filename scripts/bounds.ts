// Emprise réelle du dessin d'une plante dans son cadre (unités du SVG) : sert à la mettre à
// l'échelle dans la vitrine de révélation (une pousse n'occupe qu'un petit bout de son cadre).
// Approximation sûre : rectangles, cercles, ellipses (rotation prise en compte par le plus grand
// rayon), chemins échantillonnés. L'attribut `transform` d'une forme (translate, rotate, scale)
// est appliqué à ses points ; une ellipse garde l'approximation du plus grand rayon autour de
// son centre transformé. Le trait est compté à part (`stroke`, plus grande demi-épaisseur) :
// dans la vitrine il garde son épaisseur au lieu de grossir avec la plante.
import {
  applyMatrix,
  IDENTITY,
  transformMatrix,
} from "../src/lib/geometry/matrix";
import { pathToPoints } from "./scene-geometry";

export type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Plus grande demi-épaisseur de trait (0 sans trait). */
  stroke: number;
};

const number = (tag: string, name: string) => {
  const value = tag.match(new RegExp(`\\s${name}="(-?[\\d.]+)"`))?.[1];
  return value === undefined ? 0 : Number(value);
};

export { transformMatrix };

const apply = applyMatrix;

export function contentBounds(svg: string): Bounds {
  let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];
  let stroke = 0;
  const include = (x0: number, y0: number, x1: number, y1: number) => {
    minX = Math.min(minX, x0);
    minY = Math.min(minY, y0);
    maxX = Math.max(maxX, x1);
    maxY = Math.max(maxY, y1);
  };
  let matrix = IDENTITY;
  const point = (x: number, y: number) => {
    const [px, py] = apply(matrix, x, y);
    include(px, py, px, py);
  };
  /** Échelle de la transformation (longueur d'un vecteur unité). */
  const scale = () => Math.hypot(matrix[0], matrix[1]);
  for (const [tag, kind] of svg.matchAll(
    /<(rect|circle|ellipse|path)\b[^>]*>/g,
  )) {
    matrix = transformMatrix(tag);
    const transformed = matrix !== IDENTITY;
    // Demi-épaisseur du trait telle qu'elle est dessinée (la transformation l'agrandit aussi).
    stroke = Math.max(stroke, (number(tag, "stroke-width") / 2) * scale());
    if (kind === "rect") {
      const [x, y] = [number(tag, "x"), number(tag, "y")];
      const [w, h] = [number(tag, "width"), number(tag, "height")];
      for (const [px, py] of [
        [x, y],
        [x + w, y],
        [x, y + h],
        [x + w, y + h],
      ])
        point(px, py);
    } else if (kind === "circle" || kind === "ellipse") {
      const [cx, cy] = apply(matrix, number(tag, "cx"), number(tag, "cy"));
      const [rx, ry] =
        kind === "circle"
          ? [number(tag, "r"), number(tag, "r")]
          : [number(tag, "rx"), number(tag, "ry")];
      // Ellipse tournée : le plus grand rayon, à l'échelle ; sans rotation (translation et
      // échelle seulement), les rayons exacts.
      const rotated = matrix[1] !== 0 || matrix[2] !== 0;
      const r = Math.max(rx, ry) * scale();
      const [ex, ey] = !transformed
        ? [rx, ry]
        : rotated
          ? [r, r]
          : [rx * Math.abs(matrix[0]), ry * Math.abs(matrix[3])];
      include(cx - ex, cy - ey, cx + ex, cy + ey);
    } else {
      const d = tag.match(/\sd="([^"]+)"/)?.[1];
      if (!d) continue;
      for (const [x, y] of pathToPoints(d)) point(x, y);
    }
  }
  if (!Number.isFinite(minX))
    throw new Error("Dessin vide : aucune forme reconnue.");
  const round = (value: number) => Math.round(value * 10) / 10;
  return {
    x: round(minX),
    y: round(minY),
    width: round(maxX - minX),
    height: round(maxY - minY),
    stroke: Math.round(stroke * 100) / 100,
  };
}

/**
 * Plantes concernées : arbres et fleurs (tous les stades). Les calques d'épanouissement
 * (`…-epanoui`) se posent sur la plante adulte : ce ne sont pas des plantes à part.
 */
export const isPlant = (name: string) =>
  /^(arbre|fleur)-/.test(name) && !/-epanoui(\.svg)?$/.test(name);

export function generateBoundsModule(bounds: Record<string, Bounds>): string {
  const lines = Object.entries(bounds)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(
      ([name, b]) =>
        `  "${name}": { x: ${b.x}, y: ${b.y}, width: ${b.width}, height: ${b.height}, stroke: ${b.stroke} },`,
    );
  return [
    "// Généré par scripts/build-illustrations.ts (emprise du dessin de chaque plante) :",
    "// ne pas modifier. Régénérer avec `pnpm illustrations`.",
    "",
    "export const PLANT_BOUNDS: Record<",
    "  string,",
    "  { x: number; y: number; width: number; height: number; stroke: number }",
    "> = {",
    ...lines,
    "};",
    "",
  ].join("\n");
}
