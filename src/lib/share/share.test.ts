import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { JournalEntry } from "@/lib/data/types";
import { buildGarden } from "@/lib/garden/model";
import { getSky } from "@/lib/garden/skies";
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
