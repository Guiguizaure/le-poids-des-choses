import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { sceneModuleFrom } from "./build-illustrations";
import {
  extractSceneGeometry,
  HILL_PARTS,
  pathToPoints,
} from "./scene-geometry";

const SCENE_SVG = readFileSync(
  new URL("../public/illustrations/scene-paysage.svg", import.meta.url),
  "utf8",
);

describe("pathToPoints", () => {
  it("lignes absolues et relatives, H, V, Z", () => {
    expect(pathToPoints("M0 0 L10 0 l0 5 H20 v5 Z")).toEqual([
      [0, 0],
      [10, 0],
      [10, 5],
      [20, 5],
      [20, 10],
      [0, 0],
    ]);
  });
  it("échantillonne une courbe cubique jusqu'à son point d'arrivée", () => {
    const points = pathToPoints("M0 100 C 0 0, 100 0, 100 100");
    expect(points.at(-1)).toEqual([100, 100]);
    expect(Math.min(...points.map(([, y]) => y))).toBeCloseTo(25, 0);
  });
  it("refuse une commande non prise en charge", () => {
    expect(() => pathToPoints("M0 0 A 5 5 0 0 1 10 10")).toThrow(
      /non prise en charge/,
    );
  });
});

describe("extractSceneGeometry", () => {
  it("trouve les deux collines et le sol dans scene-paysage.svg", () => {
    const geometry = extractSceneGeometry(SCENE_SVG);
    for (const part of HILL_PARTS)
      expect(geometry.hills[part].length).toBeGreaterThan(10);
    expect(geometry.groundTop).toBe(240);
    // Sommet de la colline arrière vers (115, 175) d'après le dessin.
    const top = geometry.hills["colline-arriere"].reduce((a, b) =>
      b[1] < a[1] ? b : a,
    );
    expect(top[0]).toBeCloseTo(114, -1);
    expect(top[1]).toBeCloseTo(175, 0);
  });
  it("échoue si une colline manque", () => {
    const without = SCENE_SVG.replace('id="colline-avant"', 'id="autre"');
    expect(() => extractSceneGeometry(without)).toThrow(/colline-avant/);
  });
  it("échoue si les deux collines manquent, en les nommant", () => {
    const without = SCENE_SVG.replace(/colline-(arriere|avant)/g, "x-$1");
    expect(() => extractSceneGeometry(without)).toThrow(
      /colline-arriere, colline-avant/,
    );
  });
  it("échoue si une colline n'a pas de chemin", () => {
    const empty = SCENE_SVG.replace(
      /(<g id="colline-arriere">)[\s\S]*?(<\/g>)/,
      "$1$2",
    );
    expect(() => extractSceneGeometry(empty)).toThrow(/colline-arriere/);
  });
  it("le fichier généré est à jour (sinon : pnpm illustrations)", () => {
    const committed = readFileSync(
      new URL("../src/lib/garden/scene.generated.ts", import.meta.url),
      "utf8",
    );
    expect(committed).toBe(sceneModuleFrom());
  });
});
