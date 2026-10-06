import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { JournalEntry } from "@/lib/data/types";
import { buildGarden } from "@/lib/garden/model";
import { SCENE } from "@/lib/garden/scene";
import { getSky, PALETTE } from "@/lib/garden/skies";
import type { IllustrationName } from "@/lib/illustrations/specs";
import {
  CARD,
  shareCardLayout,
  shareCardTexts,
  siteHost,
  type DrawOp,
  type ShareCardInput,
} from "./card";
import {
  keepBloomGroup,
  composeGardenSvg,
  gardenIllustrations,
  type SvgSources,
} from "./garden-svg";

const FONTS = { titre: "Bricolage", texte: "DM" };
/** Mesure approchée sans navigateur : 0,55 em par caractère. */
const measure = (text: string, font: string) =>
  text.length * Number(font.match(/(\d+)px/)![1]) * 0.55;

const texts = (ops: DrawOp[]) =>
  ops.flatMap((op) => (op.type === "text" ? [op.text] : []));

const AWAKE: ShareCardInput = {
  lightChoiceCount: 12,
  animalCount: 5,
  asleep: false,
  siteHost: "lepoidsdeschoses.com",
};

describe("carte de partage : composition", () => {
  it("éveillé : en-tête, deux pastilles, jardin, bandeau encre (maquette 41:60)", () => {
    const ops = shareCardLayout(AWAKE, measure, FONTS);
    expect(texts(ops)).toEqual([
      "lepoidsdeschoses.com",
      "Chaque choix léger fait pousser quelque chose.",
      "LE POIDS DES CHOSES",
      "Mon jardin",
      "12 choix légers",
      "5 animaux",
    ]);
    expect(ops).toContainEqual({
      type: "garden",
      x: 0,
      y: 360,
      width: 1080,
      height: 831,
    });
    expect(ops[0]).toMatchObject({ type: "rect", width: 1080, height: 1350 });
    expect(ops).toContainEqual(
      expect.objectContaining({
        type: "rect",
        y: CARD.footer.y,
        height: 159,
        fill: "#1F1A17",
      }),
    );
    // Le jardin est dessiné avant l'en-tête et le bandeau : rien ne le recouvre par erreur.
    const garden = ops.findIndex((op) => op.type === "garden");
    expect(garden).toBe(1);
  });
  it("endormi : « Mon jardin se repose » et la phrase de réveil (maquette 41:183)", () => {
    // Mesure étroite : le titre tient dans les marges, il garde sa taille de maquette.
    const narrow = (text: string, font: string) =>
      text.length * Number(font.match(/(\d+)px/)![1]) * 0.4;
    const ops = shareCardLayout({ ...AWAKE, asleep: true }, narrow, FONTS);
    expect(texts(ops)).toContain("Mon jardin se repose");
    expect(texts(ops).at(-1)).toBe("Il se réveille au prochain choix léger.");
    const title = ops.find(
      (op) => op.type === "text" && op.text === "Mon jardin se repose",
    );
    expect(title).toMatchObject({ font: "800 104px Bricolage" });
  });
  it("titre réduit s'il déborde des marges (936 px), jamais agrandi", () => {
    const wide = (text: string, font: string) =>
      text.length * Number(font.match(/(\d+)px/)![1]) * 0.6;
    const ops = shareCardLayout({ ...AWAKE, asleep: true }, wide, FONTS);
    const title = ops.find(
      (op): op is Extract<DrawOp, { type: "text" }> =>
        op.type === "text" && op.text === "Mon jardin se repose",
    )!;
    const size = Number(title.font.match(/(\d+)px/)![1]);
    expect(size).toBeLessThan(104);
    expect(wide(title.text, title.font)).toBeLessThanOrEqual(936);
  });
  it("accords des pastilles au singulier et au pluriel", () => {
    expect(
      shareCardTexts({ ...AWAKE, lightChoiceCount: 1, animalCount: 1 }).pills,
    ).toEqual(["1 choix léger", "1 animal"]);
    expect(
      shareCardTexts({ ...AWAKE, lightChoiceCount: 2, animalCount: 2 }).pills,
    ).toEqual(["2 choix légers", "2 animaux"]);
  });
  it("aucun kg de CO2e ni choix lourd sur l'image", () => {
    for (const asleep of [false, true]) {
      const all = texts(
        shareCardLayout({ ...AWAKE, asleep }, measure, FONTS),
      ).join(" ");
      expect(all).not.toMatch(/kg|CO2|CO₂|écart|noté|lourd|évit/i);
    }
  });
  it("pastilles côte à côte, largeur selon le texte, 16 px d'écart", () => {
    const pills = shareCardLayout(AWAKE, measure, FONTS).filter(
      (op): op is Extract<DrawOp, { type: "rect" }> =>
        op.type === "rect" && op.stroke !== undefined,
    );
    expect(pills).toHaveLength(2);
    expect(pills[0].x).toBe(CARD.padX);
    expect(pills[1].x).toBeCloseTo(pills[0].x + pills[0].width + 16, 6);
    expect(pills[0].fill).toBe("#D9F4E4");
    expect(pills[1].fill).toBe("#FFC93C");
    expect(pills[0].width).toBeCloseTo(
      62 + measure("12 choix légers", "600 36px DM"),
      6,
    );
  });
  it("domaine dérivé de SITE_URL", () => {
    expect(siteHost("https://lepoidsdeschoses.com")).toBe(
      "lepoidsdeschoses.com",
    );
    expect(siteHost("https://le-poids-des-choses.pages.dev/")).toBe(
      "le-poids-des-choses.pages.dev",
    );
  });
});

const read = (name: IllustrationName) =>
  readFileSync(
    new URL(`../../../public/illustrations/${name}.svg`, import.meta.url),
    "utf8",
  );
const sourcesFor = (names: IllustrationName[]): SvgSources =>
  Object.fromEntries(names.map((name) => [name, read(name)]));

const DAY = 24 * 60 * 60 * 1000;
const NOW = new Date(Date.UTC(2026, 9, 5, 12));
const journal = (count: number, daysAgo = 0): JournalEntry[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `partage-${i}`,
    date: new Date(
      NOW.getTime() - daysAgo * DAY - (count - i) * 60_000,
    ).toISOString(),
    gestureA: "avion",
    gestureB: "tgv",
    quantity: 300,
    chosen: "b",
    avoidedKg: i % 2 ? 66.5 : 0.4,
  }));

describe("carte de partage : jardin", () => {
  it("mêmes plantes et mêmes animaux que le jardin, aux mêmes places", () => {
    const garden = buildGarden(journal(12), NOW);
    const names = gardenIllustrations(garden);
    const svg = composeGardenSvg(garden, "jour", sourcesFor(names));
    // Le paysage, puis une illustration par plante et par animal.
    expect(svg.match(/<svg x=/g)).toHaveLength(
      1 + garden.plants.length + garden.animals.length,
    );
    for (const plant of garden.plants)
      expect(svg).toContain(`x="${Math.round(plant.box.x * 1000) / 1000}"`);
    expect(names).toContain("papillon");
    expect(svg).not.toMatch(/\sid="/);
    expect(svg).not.toContain("non-scaling-stroke");
    expect(svg).not.toMatch(/href=|url\(/);
  });
  it("le ciel choisi s'applique aussi à la carte", () => {
    const garden = buildGarden(journal(3), NOW);
    const sources = sourcesFor(gardenIllustrations(garden));
    const night = composeGardenSvg(garden, "nuit", sources);
    const day = composeGardenSvg(garden, "jour", sources);
    expect(night).toContain(`fill="${getSky("nuit").colors.ciel}"`);
    expect(day).toContain(`fill="${getSky("jour").colors.ciel}"`);
    expect(night).not.toContain('fill="#FF4F2E"/></svg>'); // plus de soleil tomate en fond
  });
  it("jardin endormi : brume et animaux endormis, papillon et abeille partis", () => {
    const garden = buildGarden(journal(12, 30), NOW);
    expect(garden.asleep).toBe(true);
    const names = gardenIllustrations(garden);
    expect(names).toContain("brume");
    expect(names).toContain("oiseau-endormi");
    expect(names).not.toContain("papillon");
    expect(names).not.toContain("abeille");
    expect(() =>
      composeGardenSvg(garden, "jour", sourcesFor(names)),
    ).not.toThrow();
  });
  it("une illustration manquante est une erreur claire", () => {
    const garden = buildGarden(journal(1), NOW);
    expect(() => composeGardenSvg(garden, "jour", {})).toThrow(
      /scene-paysage.*manquante/,
    );
  });
});

describe("carte de partage : saisons et épanouissement", () => {
  const DAYS = 24 * 60 * 60 * 1000;
  const habits = (count: number): JournalEntry[] =>
    Array.from({ length: count }, (_, i) => ({
      kind: "habit" as const,
      id: `arrose-${i}`,
      date: new Date(NOW.getTime() + (i + 1) * DAYS).toISOString(),
      gesture: "velo",
    }));
  const later = new Date(NOW.getTime() + 20 * DAYS);
  const watered = buildGarden([...journal(6), ...habits(9)], later);

  it("hiver : neige sous les plantes, flocons figés, feuillage des caducs sous la neige", () => {
    const names = gardenIllustrations(watered, "hiver");
    expect(names).toContain("saison-hiver-neige");
    expect(names).toContain("saison-hiver-flocons");
    const svg = composeGardenSvg(
      watered,
      "jour",
      sourcesFor(names),
      SCENE,
      "hiver",
    );
    const deciduous = watered.plants.some(
      (plant) =>
        plant.kind.type === "tree" &&
        plant.kind.variant !== 2 &&
        plant.level > 0,
    );
    expect(deciduous).toBe(true);
    expect(svg).toContain(
      `fill="${PALETTE.blanc}" stroke="${PALETTE.encre}" stroke-width="2.4"`,
    );
    expect(svg).not.toMatch(/\sid="/);
  });
  it("épanouissement : un seul groupe par plante, aucun l'hiver pour un caduc", () => {
    const bloomed = watered.plants.filter((plant) => plant.bloom > 0);
    expect(bloomed.length).toBeGreaterThan(0);
    const spring = gardenIllustrations(watered, "printemps");
    const winter = gardenIllustrations(watered, "hiver");
    const blooms = (names: string[]) =>
      names.filter((n) => n.endsWith("-epanoui"));
    expect(blooms(spring)).toHaveLength(bloomed.length);
    const evergreen = bloomed.filter(
      (plant) => !(plant.kind.type === "tree" && plant.kind.variant !== 2),
    );
    expect(blooms(winter)).toHaveLength(evergreen.length);
    // Chaque dessin d'épanouissement ne garde qu'un groupe : jamais deux niveaux à la fois.
    const source = read("arbre-1-grand-epanoui");
    const groups = ["epanoui-1", "epanoui-2", "epanoui-3"];
    for (const level of [1, 2, 3]) {
      const kept = keepBloomGroup(source, groups, level);
      expect(kept.match(/<g id="/g)).toHaveLength(1);
      expect(kept).toContain(`<g id="epanoui-${level}"`);
    }
  });
  it("printemps et automne : pétales ou feuilles figés ; été : rien ne tombe", () => {
    const spring = gardenIllustrations(watered, "printemps");
    expect(spring).toContain("saison-printemps-petale");
    expect(gardenIllustrations(watered, "automne")).toContain(
      "saison-automne-feuille-1",
    );
    expect(
      gardenIllustrations(watered, "ete").some((n) => n.startsWith("saison-")),
    ).toBe(false);
    expect(() =>
      composeGardenSvg(watered, "jour", sourcesFor(spring), SCENE, "printemps"),
    ).not.toThrow();
  });
  it("automne : ciel « Jour » de saison", () => {
    const names = gardenIllustrations(watered, "automne");
    const svg = composeGardenSvg(
      watered,
      "jour",
      sourcesFor(names),
      SCENE,
      "automne",
    );
    expect(svg).toContain(`fill="${PALETTE.tomateDouce}"`);
  });
});
