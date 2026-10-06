import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { ComparisonEntry } from "@/lib/data/types";
import {
  ILLUSTRATION_SPECS,
  type IllustrationName,
} from "@/lib/illustrations/specs";
import { isNightAt, isNightHour, NIGHT_HOURS } from "./daytime";
import { FAUNA, presenceOf, type Presence } from "./fauna";
import { animalPresence, liveScene, shownSky, type Moment } from "./live";
import {
  ANIMAL_UNLOCKS,
  animalBox,
  animalIllustration,
  buildGarden,
  plantKindFor,
  type AnimalKind,
  type GardenState,
} from "./model";
import { SCENE } from "./scene";
import { SEASONS, type Season } from "./seasons";
import {
  checkSkyContrast,
  flyerColors,
  flyerContrast,
  GRAPHIC_MIN,
  SKY_FLYERS,
  skyContrastFailures,
} from "./sky-contrast";
import { getSky, PALETTE, SKIES } from "./skies";
import { SPECIES, speciesFor } from "./species";
import { arrivalMessage, gardenDescription } from "./text";
import {
  drawnBox,
  MAX_VISIBLE_VISITORS,
  overlaps,
  placeVisitors,
  seasonYear,
  visitorPresence,
  VISITORS,
  type VisitorKind,
} from "./visitors";
import { transformMatrix } from "../../../scripts/bounds";
import { pathToPoints } from "../../../scripts/scene-geometry";

const read = (name: IllustrationName) =>
  readFileSync(
    new URL(`../../../public/illustrations/${name}.svg`, import.meta.url),
    "utf8",
  );

const START = Date.UTC(2026, 3, 1, 10);
const NOW = new Date(START + 60 * 60_000);

/** Un choix léger ; `kg` > 20 → grand arbre ou fleur fleurie, selon l'id. */
const choice = (id: string, kg: number, minute = 0): ComparisonEntry => ({
  id,
  date: new Date(START + minute * 60_000).toISOString(),
  gestureA: "voiture",
  gestureB: "velo",
  quantity: 10,
  chosen: "b",
  avoidedKg: kg,
});

function idsOf(type: "tree" | "flower", count: number, prefix: string) {
  const ids: string[] = [];
  for (let i = 0; ids.length < count; i++)
    if (plantKindFor(`${prefix}${i}`).type === type) ids.push(`${prefix}${i}`);
  return ids;
}

/** Jardin avec `trees` grands arbres, `flowers` fleurs, et tous les animaux (20 choix). */
function gardenWith(trees: number, flowers: number, small = 20): GardenState {
  const entries = [
    ...idsOf("tree", trees, "t").map((id, i) => choice(id, 30, i)),
    ...idsOf("flower", flowers, "f").map((id, i) => choice(id, 5, 100 + i)),
    ...Array.from({ length: Math.max(0, small - trees - flowers) }, (_, i) =>
      choice(`petit${i}`, 0.5, 200 + i),
    ),
  ];
  return buildGarden(entries, NOW);
}

const MOMENTS: Moment[] = SEASONS.flatMap((season) => [
  { season, night: false },
  { season, night: true },
]);

describe("jour et nuit", () => {
  it("nuit de 21 h à 6 h (6 h exclue)", () => {
    expect(NIGHT_HOURS).toEqual({ start: 21, end: 6 });
    expect([20, 21, 23, 0, 5, 6, 12].map(isNightHour)).toEqual([
      false,
      true,
      true,
      true,
      true,
      false,
      false,
    ]);
    expect(isNightAt(0)).toBe(false);
  });
  it("la nuit, le ciel passe en Nuit encre ; le jour, le ciel choisi", () => {
    expect(shownSky("aube", true)).toBe("nuit");
    expect(shownSky("aube", false)).toBe("aube");
    const garden = gardenWith(0, 1);
    const night = liveScene(
      garden,
      { season: "ete", night: true },
      "midi",
      NOW,
    );
    expect(night.sky).toBe("nuit");
    expect(night.stars).toBe(true);
    const day = liveScene(garden, { season: "ete", night: false }, "midi", NOW);
    expect(day.sky).toBe("midi");
    expect(day.stars).toBe(false);
  });
});

describe("animaux débloqués selon la saison et l'heure", () => {
  const rule = (kind: AnimalKind, season: Season, night: boolean) =>
    presenceOf(FAUNA[kind], { season, night });

  it("papillon, abeille, coccinelle absents l'hiver ; papillon et abeille absents la nuit", () => {
    for (const kind of ["butterfly", "bee", "ladybug"] as const)
      expect(rule(kind, "hiver", false)).toBe("absent");
    for (const kind of ["butterfly", "bee"] as const)
      for (const season of SEASONS)
        expect(rule(kind, season, true)).toBe("absent");
    expect(rule("ladybug", "ete", true)).toBe("awake");
    expect(rule("butterfly", "printemps", false)).toBe("awake");
  });
  it("oiseau toute l'année, endormi la nuit", () => {
    for (const season of SEASONS) {
      expect(rule("bird", season, false)).toBe("awake");
      expect(rule("bird", season, true)).toBe("asleep");
    }
  });
  it("escargot endormi l'hiver ; hérisson actif la nuit, endormi le jour, hiberne l'hiver", () => {
    expect(rule("snail", "hiver", false)).toBe("asleep");
    expect(rule("snail", "hiver", true)).toBe("asleep");
    expect(rule("snail", "ete", true)).toBe("awake");
    for (const season of SEASONS)
      expect(rule("hedgehog", season, false)).toBe("asleep");
    expect(rule("hedgehog", "automne", true)).toBe("awake");
    expect(rule("hedgehog", "hiver", true)).toBe("asleep");
  });
  it("un animal endormi a toujours son dessin endormi", () => {
    for (const [kind, dayNight] of Object.entries(FAUNA) as [
      AnimalKind,
      (typeof FAUNA)[AnimalKind],
    ][])
      for (const presence of [
        ...Object.values(dayNight.day),
        ...Object.values(dayNight.night),
      ] as Presence[])
        if (presence === "asleep")
          expect(animalIllustration(kind, true)).toMatch(/-endormi$/);
  });
  it("aucun animal débloqué n'est jamais perdu : présent, endormi, ou absent pour un temps", () => {
    const garden = gardenWith(2, 3);
    expect(garden.unlocked).toHaveLength(ANIMAL_UNLOCKS.length);
    for (const moment of MOMENTS) {
      const live = liveScene(garden, moment, "jour", NOW);
      const seen = [
        ...live.animals.map((animal) => animal.kind),
        ...live.away.map((away) => away.kind),
      ].sort();
      expect(seen).toEqual([...garden.unlocked].sort());
      // Le compteur ne bouge pas : c'est toujours garden.unlocked.
      expect(gardenDescription(garden, moment.season)).toContain("6 animaux");
    }
  });
  it("jardin assoupi : ceux qui dorment restent, les autres partent (comme avant)", () => {
    expect(animalPresence("bird", { season: "ete", night: false }, true)).toBe(
      "asleep",
    );
    expect(
      animalPresence("butterfly", { season: "ete", night: false }, true),
    ).toBe("absent");
  });
  it("message d'arrivée d'un animal qu'on ne voit pas encore", () => {
    expect(arrivalMessage("butterfly", "saison")).toBe(
      "Un papillon s’est installé dans ton jardin : tu le verras au printemps",
    );
    expect(arrivalMessage("bee", "nuit")).toBe(
      "Une abeille s’est installée dans ton jardin : tu la verras demain matin",
    );
    expect(arrivalMessage("bird")).toBe(
      "Un oiseau s’est installé dans ton jardin",
    );
  });
});

describe("visiteurs : table", () => {
  const kinds = (season: Season) =>
    VISITORS.filter((v) => v.seasons.includes(season))
      .map((v) => v.kind)
      .sort();
  it("visiteurs de chaque saison, et de la nuit toute l'année", () => {
    expect(kinds("hiver")).toEqual(
      ["hibou", "houx", "perce-neige", "renard", "rouge-gorge"].sort(),
    );
    expect(kinds("printemps")).toEqual(
      ["hibou", "hirondelle", "jonquille", "primevere", "renard"].sort(),
    );
    expect(kinds("ete")).toEqual(
      [
        "cigale",
        "coquelicot",
        "hibou",
        "libellule",
        "renard",
        "tournesol",
      ].sort(),
    );
    expect(kinds("automne")).toEqual(
      ["champignons", "ecureuil", "hibou", "renard"].sort(),
    );
  });
  it("2 à 4 visiteurs de saison", () => {
    for (const season of SEASONS) {
      const seasonal = VISITORS.filter(
        (v) => v.seasons.length === 1 && v.seasons[0] === season,
      );
      expect(seasonal.length).toBeGreaterThanOrEqual(2);
      expect(seasonal.length).toBeLessThanOrEqual(4);
    }
  });
  it("chaque dessin existe ; un visiteur endormi a son dessin endormi", () => {
    for (const visitor of VISITORS) {
      expect(visitor.illustration in ILLUSTRATION_SPECS).toBe(true);
      if (visitor.day === "asleep" || visitor.night === "asleep")
        expect(visitor.sleeping && visitor.sleeping in ILLUSTRATION_SPECS).toBe(
          true,
        );
    }
  });
  it("la nuit : hirondelle et libellule absentes, rouge-gorge endormi, hibou et renard éveillés", () => {
    const at = (kind: VisitorKind, night: boolean) =>
      visitorPresence(
        VISITORS.find((v) => v.kind === kind)!,
        { night, sky: night ? "nuit" : "jour" },
      );
    expect(at("hirondelle", true)).toBe("absent");
    expect(at("libellule", true)).toBe("absent");
    expect(at("rouge-gorge", true)).toBe("asleep");
    expect(at("hibou", true)).toBe("awake");
    expect(at("hibou", false)).toBe("asleep");
    expect(at("renard", true)).toBe("awake");
    expect(at("renard", false)).toBe("asleep");
    expect(at("ecureuil", true)).toBe("awake");
  });
  it("l'hirondelle ne vole pas sur Nuit encre, même choisi le jour (contraste)", () => {
    const swallow = VISITORS.find((v) => v.kind === "hirondelle")!;
    expect(visitorPresence(swallow, { night: false, sky: "nuit" })).toBe(
      "absent",
    );
  });
  it("année de saison : décembre compte avec l'hiver suivant", () => {
    expect(seasonYear(new Date(2026, 11, 20), "hiver")).toBe(2027);
    expect(seasonYear(new Date(2027, 0, 20), "hiver")).toBe(2027);
    expect(seasonYear(new Date(2026, 9, 20), "automne")).toBe(2026);
  });
});

describe("visiteurs : placement", () => {
  const gardens = [
    gardenWith(0, 0, 0),
    gardenWith(0, 3),
    gardenWith(2, 3),
    gardenWith(4, 10, 40),
  ];

  it("déterministe : même jardin et même saison, mêmes places", () => {
    for (const garden of gardens)
      for (const season of SEASONS)
        expect(placeVisitors(garden, season, 2027)).toEqual(
          placeVisitors(garden, season, 2027),
        );
  });
  it("même carnet dans un autre ordre : même jardin, mêmes visiteurs", () => {
    const entries = idsOf("tree", 3, "o").map((id, i) => choice(id, 30, i));
    const a = buildGarden(entries, NOW);
    const b = buildGarden([...entries].reverse(), NOW);
    expect(placeVisitors(a, "ete", 2026)).toEqual(
      placeVisitors(b, "ete", 2026),
    );
  });
  it("jamais devant les plantes de la personne, ni sur un autre visiteur, dans la scène", () => {
    for (const garden of gardens)
      for (const season of SEASONS) {
        const placed = placeVisitors(garden, season, 2027);
        for (const visitor of placed) {
          const { box } = visitor;
          expect(box.x).toBeGreaterThanOrEqual(0);
          expect(box.x + box.width).toBeLessThanOrEqual(SCENE.width);
          if (visitor.rule.place === "trunk" || visitor.rule.place === "perch")
            continue;
          for (const plant of garden.plants)
            expect(overlaps(box, drawnBox(plant))).toBe(false);
          for (const kind of garden.unlocked)
            expect(overlaps(box, animalBox(kind))).toBe(false);
          for (const other of placed)
            if (
              other !== visitor &&
              other.rule.place !== "trunk" &&
              other.rule.place !== "perch"
            )
              expect(overlaps(box, other.box)).toBe(false);
        }
      }
  });
  it("hibou sur l'arbre adulte le plus haut, dans son feuillage (jamais dans le ciel) ; absent sans arbre adulte", () => {
    expect(
      placeVisitors(gardenWith(0, 5), "automne", 2026).some(
        (v) => v.kind === "hibou",
      ),
    ).toBe(false);
    const garden = gardenWith(3, 2);
    const owl = placeVisitors(garden, "automne", 2026).find(
      (v) => v.kind === "hibou",
    )!;
    const trees = garden.plants.filter(
      (p) => p.kind.type === "tree" && p.stage === "grand",
    );
    const tallest = [...trees].sort((a, b) => a.box.y - b.box.y)[0];
    expect(owl.treeId).toBe(tallest.id);
    expect(overlaps(owl.box, tallest.box)).toBe(true);
    expect(owl.box.y).toBeGreaterThan(tallest.box.y);
  });
  it("cigale sur le tronc d'un arbre adulte ; absente sans arbre adulte", () => {
    expect(
      placeVisitors(gardenWith(0, 5), "ete", 2026).some(
        (v) => v.kind === "cigale",
      ),
    ).toBe(false);
    const garden = gardenWith(3, 2);
    const placed = placeVisitors(garden, "ete", 2026);
    const cicada = placed.find((v) => v.kind === "cigale")!;
    const tree = garden.plants.find((p) => p.id === cicada.treeId)!;
    expect(tree.stage).toBe("grand");
    // Un autre arbre que celui du hibou.
    expect(cicada.treeId).not.toBe(
      placed.find((v) => v.kind === "hibou")?.treeId,
    );
    const centerX = cicada.box.x + cicada.box.width / 2;
    expect(centerX).toBeCloseTo(tree.box.x + tree.box.width / 2, 5);
  });
  it("hirondelle et libellule dans la bande de ciel, jamais sur le soleil", () => {
    for (const garden of gardens)
      for (const season of ["printemps", "ete"] as const)
        for (const visitor of placeVisitors(garden, season, 2027).filter(
          (v) => v.rule.place === "sky",
        )) {
          expect(visitor.box.y + visitor.box.height).toBeLessThan(150);
          expect(
            overlaps(visitor.box, { x: 268, y: 16, width: 100, height: 100 }),
          ).toBe(false);
        }
  });
  it("jardin vide : les visiteurs de saison qui ne demandent pas d'arbre sont là", () => {
    const empty = gardenWith(0, 0, 0);
    const kinds = (season: Season) =>
      placeVisitors(empty, season, 2027)
        .map((v) => v.kind)
        .sort();
    expect(kinds("hiver")).toEqual([
      "houx",
      "perce-neige",
      "renard",
      "rouge-gorge",
    ]);
    expect(kinds("automne")).toEqual(["champignons", "ecureuil", "renard"]);
  });
  it("les places ne dépendent pas de l'heure", () => {
    const garden = gardenWith(2, 3);
    const day = liveScene(
      garden,
      { season: "hiver", night: false },
      "jour",
      NOW,
    );
    const night = liveScene(
      garden,
      { season: "hiver", night: true },
      "jour",
      NOW,
    );
    const box = (scene: typeof day, kind: VisitorKind) =>
      scene.visitors.find((v) => v.kind === kind)?.box;
    expect(box(night, "rouge-gorge")).toEqual(box(day, "rouge-gorge"));
    expect(
      night.visitors.find((v) => v.kind === "rouge-gorge")?.illustration,
    ).toBe("rouge-gorge-endormi");
  });
});

describe("perchoirs des arbres (relus dans les dessins)", () => {
  /** Bas du feuillage à l'abscisse x (cercles et ellipses du calque feuillage). */
  function canopyBottom(svg: string, x: number): number {
    const layer = svg.match(/<g id="feuillage">([\s\S]*?)<\/g>/)![1];
    let bottom = -Infinity;
    for (const [tag] of layer.matchAll(/<(circle|ellipse)\b[^>]*>/g)) {
      const n = (name: string) =>
        Number(tag.match(new RegExp(`\\s${name}="([\\d.]+)"`))?.[1]);
      const [cx, cy] = [n("cx"), n("cy")];
      const [rx, ry] = tag.startsWith("<circle")
        ? [n("r"), n("r")]
        : [n("rx"), n("ry")];
      const dx = (x - cx) / rx;
      if (Math.abs(dx) <= 1)
        bottom = Math.max(bottom, cy + ry * Math.sqrt(1 - dx * dx));
    }
    return bottom;
  }
  it.each(SPECIES.filter((s) => s.perches && s.randomPool))(
    "$id",
    (species) => {
      const svg = read(`${species.id}-grand` as IllustrationName);
      const trunk = svg.match(
        /<g id="tronc"><rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/,
      )!;
      const [x, y, w, h] = trunk.slice(1).map(Number);
      const center = x + w / 2;
      const { owl, cicada } = species.perches!;
      expect(owl.x).toBe(center);
      expect(owl.y).toBeCloseTo(canopyBottom(svg, center), 0);
      expect(cicada.x).toBe(center);
      expect(cicada.y).toBeCloseTo((Math.max(y, owl.y) + y + h) / 2, 0);
    },
  );
});

describe("perchoirs des arbres à débloquer (tronc et feuillage dessinés en chemins)", () => {
  /** Points du calque (formes échantillonnées, transformations appliquées). */
  function points(svg: string, layer: string): [number, number][] {
    const content = svg.match(
      new RegExp(`<g id="${layer}">([\\s\\S]*?)</g>`),
    )![1];
    const result: [number, number][] = [];
    for (const [tag, kind] of content.matchAll(
      /<(path|ellipse|circle|rect)\b[^>]*>/g,
    )) {
      // Reflets crème posés sur le feuillage : pas du feuillage.
      if (/fill="#FFF3DC"/.test(tag)) continue;
      const m = transformMatrix(tag);
      const at = (x: number, y: number): [number, number] => [
        m[0] * x + m[2] * y + m[4],
        m[1] * x + m[3] * y + m[5],
      ];
      const n = (name: string) =>
        Number(tag.match(new RegExp(`\\s${name}="(-?[\\d.]+)"`))?.[1] ?? 0);
      if (kind === "path")
        for (const [x, y] of pathToPoints(tag.match(/\sd="([^"]+)"/)![1]))
          result.push(at(x, y));
      else if (kind === "rect")
        for (const [x, y] of [
          [n("x"), n("y")],
          [n("x") + n("width"), n("y") + n("height")],
        ])
          result.push(at(x, y));
      else {
        const [rx, ry] =
          kind === "circle" ? [n("r"), n("r")] : [n("rx"), n("ry")];
        for (let a = 0; a < 360; a += 2) {
          const t = (a * Math.PI) / 180;
          result.push(
            at(n("cx") + rx * Math.cos(t), n("cy") + ry * Math.sin(t)),
          );
        }
      }
    }
    return result;
  }
  it("le sapin n'a pas de perchoir (tronc caché sous les étages)", () => {
    expect(speciesFor({ type: "tree", variant: 5 }).perches).toBeUndefined();
  });
  it.each(SPECIES.filter((s) => s.perches && !s.randomPool))(
    "$id",
    (species) => {
      const svg = read(`${species.id}-grand` as IllustrationName);
      const { owl, cicada } = species.perches!;
      const canopy = points(svg, "feuillage").filter(
        ([x]) => Math.abs(x - owl.x) < 1.5,
      );
      // Hibou : sous le bas du feuillage, au-dessus du tronc.
      expect(owl.y).toBeCloseTo(Math.max(...canopy.map(([, y]) => y)), 0);
      // Cigale : sur le tronc (à moins de 2 unités du tracé), sous le hibou. Chaque
      // sous-chemin (M…) du tronc est un tracé à part : on mesure la distance à ses segments.
      const trunkLayer = svg.match(/<g id="tronc">([\s\S]*?)<\/g>/)![1];
      const strokes = [...trunkLayer.matchAll(/\sd="([^"]+)"/g)].flatMap(
        ([, d]) =>
          d
            .split(/(?=M)/)
            .filter(Boolean)
            .map((sub) => pathToPoints(sub)),
      );
      const toSegment = (
        [ax, ay]: [number, number],
        [bx, by]: [number, number],
      ) => {
        const [dx, dy] = [bx - ax, by - ay];
        const along =
          ((cicada.x - ax) * dx + (cicada.y - ay) * dy) / (dx * dx + dy * dy);
        const t = Math.max(0, Math.min(1, along || 0));
        return Math.hypot(ax + t * dx - cicada.x, ay + t * dy - cicada.y);
      };
      const nearest = Math.min(
        ...strokes.flatMap((line) =>
          line
            .slice(1)
            .map((point, i) =>
              toSegment(line[i] as [number, number], point as [number, number]),
            ),
        ),
      );
      expect(nearest).toBeLessThan(2);
      expect(cicada.y).toBeGreaterThan(owl.y);
    },
  );
});

describe("contraste de la bande de ciel", () => {
  const sources = Object.fromEntries(
    SKY_FLYERS.map(({ name }) => [name, read(name)]),
  );
  it("aucun échec sur les ciels et dessins actuels (le build échouerait sinon)", () => {
    expect(skyContrastFailures(sources)).toEqual([]);
    expect(checkSkyContrast([]).ok).toBe(true);
    expect(checkSkyContrast(["x"]).ok).toBe(false);
  });
  it("le contour encre compte, sauf sur un fond encre", () => {
    const colors = flyerColors(read("papillon"));
    expect(colors).toEqual({ main: PALETTE.soleil, inkOutline: true });
    expect(
      flyerContrast(colors, getSky("midi").colors.ciel),
    ).toBeGreaterThanOrEqual(GRAPHIC_MIN);
  });
  it("hirondelle et oiseau en vol sur Nuit encre : sous le seuil, d'où leur absence de ce ciel", () => {
    const night = getSky("nuit").colors.ciel;
    for (const name of ["hirondelle", "oiseau-vol"] as const) {
      expect(flyerContrast(flyerColors(read(name)), night)).toBeLessThan(
        GRAPHIC_MIN,
      );
      expect(SKY_FLYERS.find((f) => f.name === name)?.hiddenOnSkies).toContain(
        "nuit",
      );
    }
  });
  it("un dessin qui ne se verrait pas est signalé", () => {
    const pale = `<svg><path fill="${PALETTE.creme}" d="M0 0"/></svg>`;
    const failures = skyContrastFailures({ ...sources, papillon: pale });
    expect(failures.some((f) => f.startsWith("papillon sur jour"))).toBe(true);
  });
  it("chaque ciel est vérifié, y compris les variantes de saison du ciel Jour", () => {
    expect(SKIES.map((s) => s.id)).toEqual(["jour", "aube", "midi", "nuit"]);
  });
});

describe("description accessible", () => {
  it("visiteurs et nuit, après les plantes et les animaux", () => {
    const garden = gardenWith(0, 1, 1);
    expect(
      gardenDescription(garden, "hiver", { visitors: 3, night: true }),
    ).toBe("Jardin : 1 plante, 1 animal, 3 visiteurs, en hiver, la nuit");
  });
});

describe("au plus 4 visiteurs visibles en même temps", () => {
  const gardens = [gardenWith(0, 0, 0), gardenWith(0, 3), gardenWith(3, 2)];
  it("jamais plus de 4, nocturnes compris, de jour comme de nuit", () => {
    expect(MAX_VISIBLE_VISITORS).toBe(4);
    for (const garden of gardens)
      for (const moment of MOMENTS)
        expect(
          liveScene(garden, moment, "jour", NOW).visitors.length,
        ).toBeLessThanOrEqual(MAX_VISIBLE_VISITORS);
  });
  it("le hibou et le renard prennent la place de visiteurs de saison", () => {
    const garden = gardenWith(3, 2);
    for (const moment of MOMENTS) {
      const kinds = liveScene(garden, moment, "jour", NOW).visitors.map(
        (v) => v.kind,
      );
      expect(kinds).toEqual(expect.arrayContaining(["hibou", "renard"]));
      expect(kinds.length).toBe(MAX_VISIBLE_VISITORS);
    }
  });
  it("même jardin, même moment : mêmes visiteurs ; un visiteur gardé ne change pas de place", () => {
    const garden = gardenWith(3, 2);
    const a = liveScene(garden, { season: "ete", night: false }, "jour", NOW);
    const b = liveScene(garden, { season: "ete", night: false }, "jour", NOW);
    expect(a.visitors).toEqual(b.visitors);
    const placed = placeVisitors(garden, "ete", seasonYear(NOW, "ete"));
    for (const visitor of a.visitors)
      expect(visitor.box).toEqual(
        placed.find((p) => p.kind === visitor.kind)!.box,
      );
  });
  it("assez de place pour moins de 4 : tous restent", () => {
    const empty = gardenWith(0, 0, 0);
    const kinds = liveScene(
      empty,
      { season: "automne", night: false },
      "jour",
      NOW,
    )
      .visitors.map((v) => v.kind)
      .sort();
    expect(kinds).toEqual(["champignons", "ecureuil", "renard"]);
  });
});
