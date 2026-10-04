import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  effectiveSky,
  getSky,
  LANDSCAPE,
  PALETTE,
  parseStoredSky,
  serializeSky,
  SKIES,
  skyStyle,
  unlockedSkies,
} from "./skies";

/** Distance entre deux couleurs (RVB). */
function distance(a: string, b: string): number {
  const rgb = (hex: string) =>
    [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const [x, y] = [rgb(a), rgb(b)];
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
}

describe("ciels du jardin", () => {
  it("le ciel actuel et trois ciels à 15, 30 et 50 choix légers", () => {
    expect(SKIES.map((sky) => [sky.id, sky.unlockAt])).toEqual([
      ["jour", 0],
      ["aube", 15],
      ["midi", 30],
      ["nuit", 50],
    ]);
  });
  it("uniquement des couleurs de la palette du thème", () => {
    const css = readFileSync(
      new URL("../../app/globals.css", import.meta.url),
      "utf8",
    ).toLowerCase();
    for (const hex of Object.values(PALETTE))
      expect(css, hex).toContain(hex.toLowerCase());
    const palette = Object.values(PALETTE);
    for (const sky of SKIES)
      for (const color of Object.values(sky.colors))
        expect(palette, `${sky.id} : ${color}`).toContain(color);
  });
  it("le ciel « Jour » est exactement celui de scene-paysage", () => {
    const svg = readFileSync(
      new URL(
        "../../../public/illustrations/scene-paysage.svg",
        import.meta.url,
      ),
      "utf8",
    );
    const fill = (layer: string) =>
      svg.match(
        new RegExp(`<g id="${layer}"[^>]*>\\s*<[^>]*fill="(#[0-9A-Fa-f]{6})"`),
      )?.[1];
    const jour = getSky("jour").colors;
    expect(fill("ciel")).toBe(jour.ciel);
    expect(fill("soleil")).toBe(jour.soleil);
    expect(fill("halo-soleil")).toBe(jour.halo);
    expect(fill("nuage-1")).toBe(jour.nuage);
    expect(fill("colline-arriere")).toBe(LANDSCAPE.collineArriere);
    expect(fill("colline-avant")).toBe(LANDSCAPE.collineAvant);
  });
  it.each(SKIES.map((sky) => [sky.id, sky]))(
    "%s : soleil, nuages, vent et collines se détachent du ciel",
    (_, sky) => {
      const { ciel, soleil, nuage, vent } = sky.colors;
      for (const color of [
        soleil,
        nuage,
        vent,
        LANDSCAPE.collineArriere,
        LANDSCAPE.collineAvant,
      ])
        expect(distance(ciel, color), `${sky.id} : ${color}`).toBeGreaterThan(
          80,
        );
    },
  );
  it("débloqués selon le nombre de choix légers", () => {
    expect(unlockedSkies(0).map((s) => s.id)).toEqual(["jour"]);
    expect(unlockedSkies(14).map((s) => s.id)).toEqual(["jour"]);
    expect(unlockedSkies(15).map((s) => s.id)).toEqual(["jour", "aube"]);
    expect(unlockedSkies(50).map((s) => s.id)).toEqual([
      "jour",
      "aube",
      "midi",
      "nuit",
    ]);
  });
  it("un ciel pas encore débloqué n'est jamais appliqué", () => {
    expect(effectiveSky(null, 100)).toBe("jour");
    expect(effectiveSky("nuit", 49)).toBe("jour");
    expect(effectiveSky("nuit", 50)).toBe("nuit");
    expect(effectiveSky("aube", 20)).toBe("aube");
  });
  it("stockage versionné, lecture tolérante", () => {
    expect(serializeSky("midi")).toBe('{"version":1,"sky":"midi"}');
    expect(parseStoredSky(serializeSky("midi"))).toBe("midi");
    for (const bad of [
      null,
      "",
      "midi",
      "{",
      '{"version":2,"sky":"midi"}',
      '{"version":1,"sky":"crépuscule"}',
    ])
      expect(parseStoredSky(bad)).toBeNull();
  });
  it("variables CSS de la scène", () => {
    expect(skyStyle("nuit")).toEqual({
      "--sky-ciel": PALETTE.encre,
      "--sky-soleil": PALETTE.creme,
      "--sky-halo": PALETTE.texteAttenue,
      "--sky-nuage": PALETTE.texteAttenue,
      "--sky-vent": PALETTE.creme,
    });
  });
});
