import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { JournalEntry } from "@/lib/data/types";
import { buildGarden } from "@/lib/garden/model";
import { SEASONS, type Season } from "@/lib/garden/seasons";
import { plantLook, SPECIES } from "@/lib/garden/species";
import type { BloomLevel } from "@/lib/garden/watering";
import type { IllustrationName } from "@/lib/illustrations/specs";
import {
  composeGardenSvg,
  gardenIllustrations,
  keepBloomGroup,
  paintFoliage,
  type SvgSources,
} from "./garden-svg";
import { replaceGroups } from "./svg-groups";

const read = (name: string) =>
  readFileSync(
    new URL(`../../../public/illustrations/${name}.svg`, import.meta.url),
    "utf8",
  );

/**
 * Balisage bien formé : chaque balise ouvrante a sa fermante, dans l'ordre (ce qu'un navigateur
 * exige avant d'afficher un SVG en image). Renvoie le premier problème, ou null.
 */
function wellFormedError(svg: string): string | null {
  const stack: string[] = [];
  for (const [, closing, name, , selfClosing] of svg.matchAll(
    /<(\/?)([a-zA-Z][\w:-]*)((?:\s[^>]*?)?)(\/?)>/g,
  )) {
    if (selfClosing) continue;
    if (!closing) stack.push(name);
    else if (stack.pop() !== name) return `</${name}> inattendu`;
  }
  return stack.length > 0 ? `<${stack.at(-1)}> non fermé` : null;
}

describe("groupes d'un SVG, imbrications comprises", () => {
  const nested =
    '<svg><g id="a"><g><circle r="1"/></g><g transform="x"><rect/></g></g><g id="b"><path/></g></svg>';

  it("retire un groupe entier, avec ses groupes imbriqués", () => {
    const out = replaceGroups(nested, ["a"], () => "");
    expect(out).toBe('<svg><g id="b"><path/></g></svg>');
    expect(wellFormedError(out)).toBeNull();
  });

  it("rend la balise ouvrante, tout le contenu et la fermante", () => {
    const seen: string[] = [];
    const out = replaceGroups(nested, ["a", "b"], ({ open, body, close }) => {
      seen.push(body);
      return `${open} data-x="1">${body}${close}`;
    });
    expect(seen).toEqual([
      '<g><circle r="1"/></g><g transform="x"><rect/></g>',
      "<path/>",
    ]);
    expect(out).toContain('<g id="a" data-x="1"><g><circle');
    expect(wellFormedError(out)).toBeNull();
  });

  it("ne touche pas aux autres groupes ; un groupe non fermé est une erreur claire", () => {
    expect(replaceGroups(nested, ["absent"], () => "")).toBe(nested);
    expect(() => replaceGroups('<g id="a"><g></g>', ["a"], () => "")).toThrow(
      /non fermé/,
    );
  });

  it("le vérificateur repère bien l'ancien défaut (</g> orphelin)", () => {
    expect(wellFormedError("<svg><g></g></g></svg>")).toMatch(/inattendu/);
  });
});

describe("partage : chaque dessin reste un SVG valide", () => {
  const seasons: (Season | null)[] = [null, ...SEASONS];

  it.each(SPECIES)(
    "$id : chaque stade, chaque saison, chaque niveau d'épanouissement",
    (species) => {
      for (const season of seasons)
        for (const bloom of [0, 1, 2, 3] as BloomLevel[]) {
          const look = plantLook({ kind: species.kind, bloom }, season);
          for (const stage of species.stages) {
            const name = `${species.id}-${stage}`;
            const painted = paintFoliage(read(name), look.paint, stage, "t");
            expect(wellFormedError(painted), `${name} ${season}`).toBeNull();
          }
          const bloomSvg = keepBloomGroup(
            read(look.bloom.illustration),
            look.bloom.groups,
            look.bloom.level,
          );
          const where = `${look.bloom.illustration} ${season} niveau ${bloom}`;
          expect(wellFormedError(bloomSvg), where).toBeNull();
          // Un seul groupe d'épanouissement reste : celui du niveau affiché.
          look.bloom.groups.forEach((group, index) =>
            expect(bloomSvg.includes(`id="${group}"`), where).toBe(
              index + 1 === look.bloom.level,
            ),
          );
        }
    },
  );
});

describe("partage : une lavande épanouie, à chaque saison", () => {
  const DAY = 24 * 60 * 60 * 1000;
  const start = Date.UTC(2026, 3, 1, 10);
  // Trois lavandes fleuries, puis 12 jours arrosés : épanouissement au plus haut.
  const entries: JournalEntry[] = [
    ...[0, 1, 2].map((i) => ({
      id: `lavande-${i}`,
      date: new Date(start + i * 60_000).toISOString(),
      gestureA: "voiture",
      gestureB: "velo",
      quantity: 30,
      chosen: "b" as const,
      avoidedKg: 4.3,
      species: "fleur-5",
    })),
    ...Array.from({ length: 12 }, (_, day) => ({
      kind: "habit" as const,
      id: `arrose-${day}`,
      date: new Date(start + (day + 1) * DAY).toISOString(),
      gesture: "velo",
    })),
  ];
  const garden = buildGarden(entries, new Date(start + 14 * DAY));

  it("les lavandes sont bien épanouies", () => {
    expect(garden.plants.map((plant) => plant.bloom)).toEqual([3, 3, 3]);
  });

  it.each(SEASONS)(
    "%s : image valide, épanouissement selon la saison",
    (season) => {
      const names = gardenIllustrations(garden, season);
      const sources: SvgSources = Object.fromEntries(
        names.map((name) => [name, read(name)]),
      ) as Record<IllustrationName, string>;
      const svg = composeGardenSvg(garden, "jour", sources, undefined, season);
      expect(wellFormedError(svg)).toBeNull();
      // L'hiver, l'épanouissement de la lavande dort (rien d'affiché) ; sinon, le niveau 3.
      const blooming = names.includes("fleur-5-fleurie-epanoui");
      expect(blooming).toBe(season !== "hiver");
    },
  );
});
