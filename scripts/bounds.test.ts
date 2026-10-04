import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { boundsModuleFrom } from "./build-illustrations";
import { contentBounds } from "./bounds";
import { pathToPoints } from "./scene-geometry";

describe("emprise du dessin des plantes", () => {
  it("formes simples ; le trait est compté à part", () => {
    const svg = `<svg><rect x="10" y="20" width="5" height="5" stroke-width="2"/><path d="M40 40 L44 44" stroke-width="4"/></svg>`;
    expect(contentBounds(svg)).toEqual({
      x: 10,
      y: 20,
      width: 34,
      height: 24,
      stroke: 2,
    });
  });
  it("ellipse tournée : on prend le plus grand rayon", () => {
    const svg = `<svg><ellipse cx="50" cy="50" rx="10" ry="4" transform="rotate(25 50 50)"/></svg>`;
    expect(contentBounds(svg)).toEqual({
      x: 40,
      y: 40,
      width: 20,
      height: 20,
      stroke: 0,
    });
  });
  it("chemins avec courbes quadratiques", () => {
    const points = pathToPoints("M0 0 Q 10 20 20 0");
    expect(points.at(-1)).toEqual([20, 0]);
    expect(Math.max(...points.map(([, y]) => y))).toBeCloseTo(10, 5);
    expect(pathToPoints("M0 0 q 10 20 20 0").at(-1)).toEqual([20, 0]);
  });
  it("une pousse n'occupe qu'un petit bout de son cadre, un grand arbre presque tout", () => {
    const read = (name: string) =>
      readFileSync(
        new URL(`../public/illustrations/${name}.svg`, import.meta.url),
        "utf8",
      );
    expect(contentBounds(read("arbre-1-pousse")).height).toBeLessThan(50);
    expect(contentBounds(read("arbre-1-grand")).height).toBeGreaterThan(130);
  });
  it("le fichier généré est à jour (sinon : pnpm illustrations)", () => {
    const committed = readFileSync(
      new URL("../src/lib/illustrations/bounds.generated.ts", import.meta.url),
      "utf8",
    );
    expect(committed).toBe(boundsModuleFrom());
  });
});
