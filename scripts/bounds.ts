// Emprise réelle du dessin d'une plante dans son cadre (unités du SVG) : sert à la mettre à
// l'échelle dans la vitrine de révélation (une pousse n'occupe qu'un petit bout de son cadre).
// Approximation sûre : rectangles, cercles, ellipses (rotation prise en compte par le plus grand
// rayon), chemins échantillonnés. Le trait est compté à part (`stroke`, plus grande demi-épaisseur) :
// dans la vitrine il garde son épaisseur au lieu de grossir avec la plante.
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

export function contentBounds(svg: string): Bounds {
  let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];
  let stroke = 0;
  const include = (x0: number, y0: number, x1: number, y1: number) => {
    minX = Math.min(minX, x0);
    minY = Math.min(minY, y0);
    maxX = Math.max(maxX, x1);
    maxY = Math.max(maxY, y1);
  };
  for (const [tag, kind] of svg.matchAll(
    /<(rect|circle|ellipse|path)\b[^>]*>/g,
  )) {
    stroke = Math.max(stroke, number(tag, "stroke-width") / 2);
    if (kind === "rect") {
      const [x, y] = [number(tag, "x"), number(tag, "y")];
      include(x, y, x + number(tag, "width"), y + number(tag, "height"));
    } else if (kind === "circle") {
      const [cx, cy, r] = [
        number(tag, "cx"),
        number(tag, "cy"),
        number(tag, "r"),
      ];
      include(cx - r, cy - r, cx + r, cy + r);
    } else if (kind === "ellipse") {
      const [cx, cy] = [number(tag, "cx"), number(tag, "cy")];
      const rotated = /\stransform="rotate/.test(tag);
      const [rx, ry] = [number(tag, "rx"), number(tag, "ry")];
      const r = Math.max(rx, ry);
      include(
        cx - (rotated ? r : rx),
        cy - (rotated ? r : ry),
        cx + (rotated ? r : rx),
        cy + (rotated ? r : ry),
      );
    } else {
      const d = tag.match(/\sd="([^"]+)"/)?.[1];
      if (!d) continue;
      for (const [x, y] of pathToPoints(d)) include(x, y, x, y);
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
    stroke,
  };
}

/** Plantes concernées : arbres et fleurs (tous les stades). */
export const isPlant = (name: string) => /^(arbre|fleur)-/.test(name);

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
