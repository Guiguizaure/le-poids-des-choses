import { describe, expect, it } from "vitest";
import {
  ILLUSTRATION_SPECS,
  type IllustrationName,
} from "@/lib/illustrations/specs";
import { PLANT_KINDS } from "./model";
import { gardenMonth, seasonFor, seasonForMonth, SEASONS } from "./seasons";
import {
  getSky,
  PALETTE,
  SEASONAL_DAY_SKY,
  skyColors,
  skyStyle,
} from "./skies";
import {
  foliageFor,
  plantLook,
  SPECIES,
  speciesFor,
  visibleBloom,
} from "./species";

const COLORS = new Set<string>(Object.values(PALETTE));

describe("table des espèces", () => {
  it("le tirage au hasard reste figé sur les six espèces d'origine, dans cet ordre", () => {
    expect(PLANT_KINDS).toEqual([
      { type: "tree", variant: 1 },
      { type: "tree", variant: 2 },
      { type: "tree", variant: 3 },
      { type: "flower", variant: 1 },
      { type: "flower", variant: 2 },
      { type: "flower", variant: 3 },
    ]);
  });
  it.each(SPECIES)(
    "$id : dessins, calques et épanouissement présents dans le contrat",
    (species) => {
      for (const stage of species.stages)
        expect(`${species.id}-${stage}` in ILLUSTRATION_SPECS).toBe(true);
      const adult =
        `${species.id}-${species.stages.at(-1)}` as IllustrationName;
      const parts = ILLUSTRATION_SPECS[adult].parts as readonly string[];
      for (const layer of species.foliageLayers) expect(parts).toContain(layer);
      const bloom = ILLUSTRATION_SPECS[species.bloom.illustration];
      expect(bloom.parts).toEqual(species.bloom.groups);
      // Même cadre et même pied que la plante adulte.
      expect(bloom.width).toBe(ILLUSTRATION_SPECS[adult].width);
      expect(bloom.height).toBe(ILLUSTRATION_SPECS[adult].height);
      expect("anchor" in bloom ? bloom.anchor : null).toEqual(
        "anchor" in ILLUSTRATION_SPECS[adult]
          ? ILLUSTRATION_SPECS[adult].anchor
          : null,
      );
    },
  );
  it.each(SPECIES)(
    "$id : couleurs de feuillage de la palette seulement",
    (species) => {
      for (const season of SEASONS) {
        const paint = species.foliage[season];
        if (!paint) continue;
        expect(COLORS).toContain(paint.fill);
        if (paint.stroke) expect(COLORS).toContain(paint.stroke);
      }
    },
  );
  it("caducs : arbres 1 et 3 ; persistants : arbre 2 et les fleurs", () => {
    expect(
      SPECIES.filter((s) => s.leaves === "caduc").map((s) => s.id),
    ).toEqual(["arbre-1", "arbre-3"]);
    for (const species of SPECIES)
      expect(species.bloomRestsInWinter).toBe(species.leaves === "caduc");
  });
  it("feuillage : dessin au printemps et en été, tomate en automne, neige en hiver (caducs)", () => {
    const kind = { type: "tree", variant: 1 } as const;
    expect(foliageFor(kind, "printemps")).toBeNull();
    expect(foliageFor(kind, "ete")).toBeNull();
    expect(foliageFor(kind, "automne")).toEqual({ fill: PALETTE.tomate });
    expect(foliageFor(kind, "hiver")).toEqual({
      fill: PALETTE.blanc,
      stroke: PALETTE.encre,
      strokeWidth: 2.4,
    });
    expect(foliageFor({ type: "tree", variant: 2 }, "hiver")).toBeNull();
    expect(foliageFor(kind, null)).toBeNull();
  });
  it("l'épanouissement des caducs dort l'hiver et revient au printemps ; niveau gardé", () => {
    const deciduous = { type: "tree", variant: 3 } as const;
    const evergreen = { type: "tree", variant: 2 } as const;
    expect(visibleBloom(deciduous, 2, "hiver")).toBe(0);
    expect(visibleBloom(deciduous, 2, "printemps")).toBe(2);
    expect(visibleBloom(deciduous, 2, "automne")).toBe(2);
    expect(visibleBloom(evergreen, 2, "hiver")).toBe(2);
    expect(visibleBloom({ type: "flower", variant: 1 }, 3, "hiver")).toBe(3);
    const look = plantLook({ kind: deciduous, bloom: 3 }, "hiver");
    expect(look.bloom.level).toBe(0);
    expect(look.paint?.layers).toEqual(["feuillage"]);
  });
  it("espèce inconnue : erreur claire", () => {
    expect(() => speciesFor({ type: "tree", variant: 4 as 1 })).toThrow(
      /Espèce/,
    );
  });
});

describe("saisons", () => {
  it("saison météorologique de l'hémisphère nord", () => {
    expect([1, 2, 3, 5, 6, 8, 9, 11, 12].map(seasonForMonth)).toEqual([
      "hiver",
      "hiver",
      "printemps",
      "printemps",
      "ete",
      "ete",
      "automne",
      "automne",
      "hiver",
    ]);
  });
  it("mois à Paris : le 30 novembre à 23 h 30 UTC est déjà décembre", () => {
    const date = new Date(Date.UTC(2026, 10, 30, 23, 30));
    expect(gardenMonth(date)).toBe(12);
    expect(seasonFor(date)).toBe("hiver");
    expect(seasonFor(new Date(Date.UTC(2026, 9, 6, 12)))).toBe("automne");
  });
});

describe("ciel « Jour » selon la saison", () => {
  it("couleurs de la palette ; le printemps garde le ciel du dessin", () => {
    expect(SEASONAL_DAY_SKY.printemps).toEqual(getSky("jour").colors);
    for (const season of SEASONS)
      for (const color of Object.values(SEASONAL_DAY_SKY[season]))
        expect(COLORS).toContain(color);
  });
  it("le ciel ne se confond jamais avec la colline du fond (outremer)", () => {
    for (const season of SEASONS)
      expect(SEASONAL_DAY_SKY[season].ciel).not.toBe(PALETTE.outremer);
  });
  it("un ciel débloqué et choisi ne change pas avec la saison", () => {
    for (const season of SEASONS)
      expect(skyColors("nuit", season)).toEqual(getSky("nuit").colors);
    expect(skyStyle("jour", "hiver")["--sky-ciel"]).toBe(PALETTE.blanc);
    expect(skyStyle("jour", null)["--sky-ciel"]).toBe(
      getSky("jour").colors.ciel,
    );
  });
});
