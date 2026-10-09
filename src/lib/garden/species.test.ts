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
import type { AutumnFoliage } from "./foliage";
import {
  foliageFor,
  isDormant,
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
      expect(parts).toContain(
        species.kind.type === "tree" ? "feuillage" : species.foliageLayers[0],
      );
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
    "$id : calques du feuillage présents dans au moins un stade",
    (species) => {
      for (const layer of species.foliageLayers)
        expect(
          species.stages.some((stage) =>
            (
              ILLUSTRATION_SPECS[`${species.id}-${stage}` as IllustrationName]
                .parts as readonly string[]
            ).includes(layer),
          ),
        ).toBe(true);
    },
  );
  it("caducs : arbres 1, 3 et 6 (figuier) ; persistants : arbres 2, 4 (olivier), 5 (sapin) et les fleurs", () => {
    expect(
      SPECIES.filter((s) => s.leaves === "caduc").map((s) => s.id),
    ).toEqual(["arbre-1", "arbre-3", "arbre-6"]);
    // L'épanouissement dort l'hiver : caducs et fleurs à débloquer (marguerite, lavande,
    // pissenlit) ; les trois fleurs d'origine gardent le leur (jardins existants inchangés).
    expect(
      SPECIES.filter((s) => s.bloomRestsInWinter).map((s) => s.id),
    ).toEqual([
      "arbre-1",
      "arbre-3",
      "arbre-6",
      "fleur-4",
      "fleur-5",
      "fleur-6",
    ]);
  });
  it("feuillage des caducs : dessin au printemps et en été, dégradé de la planche en automne, endormi l'hiver", () => {
    const planche = {
      1: ["#F2B73A", "#9A5B2B"],
      3: ["#FF4F2E", "#9E1F3D"],
      6: ["#FFD84A", "#D99A1E"],
    } as const;
    for (const variant of [1, 3, 6] as const) {
      const kind = { type: "tree", variant } as const;
      expect(foliageFor(kind, "printemps")).toBeNull();
      expect(foliageFor(kind, "ete")).toBeNull();
      const autumn = foliageFor(kind, "automne");
      expect(autumn?.mode).toBe("autumn");
      if (autumn?.mode !== "autumn") continue;
      expect([autumn.top, autumn.bottom]).toEqual(planche[variant]);
      for (const [start, end] of Object.values(autumn.y)) {
        expect(start).toBeLessThan(end);
        expect(start).toBeGreaterThanOrEqual(0);
        expect(end).toBeLessThanOrEqual(160);
      }
      expect(foliageFor(kind, "hiver")?.mode).toBe("asleep");
      expect(isDormant(kind, "hiver")).toBe(true);
      expect(isDormant(kind, "automne")).toBe(false);
      expect(foliageFor(kind, null)).toBeNull();
    }
    // Hauteurs de la planche pour l'adulte (figuier : dessin réduit à 0,85 autour du pied).
    expect(
      (foliageFor({ type: "tree", variant: 1 }, "automne") as AutumnFoliage).y
        .grand,
    ).toEqual([10, 98]);
    expect(
      (foliageFor({ type: "tree", variant: 3 }, "automne") as AutumnFoliage).y
        .grand,
    ).toEqual([16, 104]);
    const fig = foliageFor(
      { type: "tree", variant: 6 },
      "automne",
    ) as AutumnFoliage;
    expect(fig.y.grand[0]).toBeCloseTo(23.4 + 0.85 * 50, 5);
    expect(fig.y.grand[1]).toBeCloseTo(23.4 + 0.85 * 112, 5);
  });
  it("citronnier, olivier, sapin et toutes les fleurs : jamais de changement de feuillage", () => {
    for (const species of SPECIES.filter((s) => s.leaves === "persistant"))
      for (const season of SEASONS) {
        expect(species.foliage[season], `${species.id} ${season}`).toBeNull();
        expect(isDormant(species.kind, season)).toBe(false);
      }
  });
  it("hiver : branches nues de la planche pour le pommier et le cerisier adultes, bourgeons verts partout", () => {
    for (const variant of [1, 3, 6] as const) {
      const winter = foliageFor({ type: "tree", variant }, "hiver");
      if (winter?.mode !== "asleep") throw new Error("endormi attendu");
      for (const stage of ["pousse", "jeune", "grand"] as const)
        expect(winter.bare[stage].buds.length).toBeGreaterThan(0);
    }
    const apple = foliageFor({ type: "tree", variant: 1 }, "hiver");
    if (apple?.mode !== "asleep") throw new Error("endormi attendu");
    expect(apple.bare.grand.branches[0].d).toBe(
      "M60 104 L 26 60 M60 94 L 96 50 M60 84 L 60 16",
    );
    expect(apple.bare.grand.buds).toHaveLength(9);
    // Le figuier adulte a déjà ses branches : seulement les bourgeons, au bout.
    const fig = foliageFor({ type: "tree", variant: 6 }, "hiver");
    if (fig?.mode !== "asleep") throw new Error("endormi attendu");
    expect(fig.bare.grand.branches).toEqual([]);
    expect(fig.bare.grand.transform).toBe("translate(9 23.4) scale(0.85)");
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
    expect(look.paint?.layers).toEqual(["feuilles", "feuillage"]);
    expect(look.paint?.mode).toBe("asleep");
  });
  it("espèce inconnue : erreur claire", () => {
    expect(() => speciesFor({ type: "tree", variant: 9 as 1 })).toThrow(
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
