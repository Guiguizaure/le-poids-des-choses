// Contraste de la bande de ciel (garde-fou du build, toujours bloquant). Pour chaque ciel, et
// chaque variante de saison du ciel « Jour » :
// - les animaux qui volent (papillon, abeille, oiseau en vol, hirondelle, libellule) doivent
//   se voir sur le fond : 3:1 (seuil WCAG des éléments graphiques), par leur couleur principale
//   OU par leur contour encre ;
// - le soleil et les nuages, décoratifs (ils ne portent aucune information), doivent seulement
//   se distinguer du ciel (1,1:1).
import { contrastRatio } from "@/lib/a11y/contrast";
import type { IllustrationName } from "@/lib/illustrations/specs";
import {
  PALETTE,
  SEASONAL_DAY_SKY,
  SKIES,
  type SkyColors,
  type SkyId,
} from "./skies";
import { SEASONS } from "./seasons";
import { VISITORS } from "./visitors";
import { NO_FLIGHT_SKIES } from "./fauna";

export const GRAPHIC_MIN = 3;
export const DECOR_MIN = 1.1;

export type SkyVariant = { id: string; sky: SkyId; colors: SkyColors };

/** Les quatre ciels, puis le ciel « Jour » de chaque saison. */
export function skyVariants(): SkyVariant[] {
  return [
    ...SKIES.map((sky) => ({ id: sky.id, sky: sky.id, colors: sky.colors })),
    ...SEASONS.map((season) => ({
      id: `jour (${season})`,
      sky: "jour" as SkyId,
      colors: SEASONAL_DAY_SKY[season],
    })),
  ];
}

/** Animaux qui peuvent passer dans la bande de ciel, et les ciels où ils n'apparaissent pas. */
export const SKY_FLYERS: readonly {
  name: IllustrationName;
  hiddenOnSkies: readonly SkyId[];
}[] = [
  { name: "papillon", hiddenOnSkies: [] },
  { name: "abeille", hiddenOnSkies: [] },
  { name: "oiseau-vol", hiddenOnSkies: NO_FLIGHT_SKIES },
  ...VISITORS.filter((visitor) => visitor.place === "sky").map((visitor) => ({
    name: visitor.illustration,
    hiddenOnSkies: visitor.hiddenOnSkies ?? [],
  })),
];

export type FlyerColors = {
  /** Couleur la plus présente parmi les formes remplies. */
  main: string;
  /** Une forme remplie est cernée d'encre. */
  inkOutline: boolean;
};

/** Couleurs d'un dessin, lues dans son SVG. */
export function flyerColors(svg: string): FlyerColors {
  const counts = new Map<string, number>();
  let inkOutline = false;
  for (const [tag] of svg.matchAll(/<(?:circle|ellipse|rect|path)\b[^>]*>/g)) {
    const fill = tag.match(/\sfill="(#[0-9a-fA-F]{6})"/)?.[1]?.toUpperCase();
    if (!fill) continue;
    counts.set(fill, (counts.get(fill) ?? 0) + 1);
    if (
      tag.match(/\sstroke="(#[0-9a-fA-F]{6})"/)?.[1]?.toUpperCase() ===
      PALETTE.encre
    )
      inkOutline = true;
  }
  const main = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  if (!main) throw new Error("Dessin sans forme remplie.");
  return { main, inkOutline };
}

/** Contraste utile d'un dessin sur un fond : sa couleur principale, ou son contour encre. */
export function flyerContrast(colors: FlyerColors, background: string): number {
  return Math.max(
    contrastRatio(colors.main, background),
    colors.inkOutline ? contrastRatio(PALETTE.encre, background) : 0,
  );
}

/** Échecs de contraste (vide : tout va bien). */
export function skyContrastFailures(
  sources: Partial<Record<IllustrationName, string>>,
): string[] {
  const failures: string[] = [];
  const format = (value: number) => value.toFixed(2).replace(".", ",");
  for (const variant of skyVariants()) {
    const background = variant.colors.ciel;
    for (const [what, color] of [
      ["soleil", variant.colors.soleil],
      ["nuages", variant.colors.nuage],
    ] as const) {
      const ratio = contrastRatio(color, background);
      if (ratio < DECOR_MIN)
        failures.push(
          `${what} sur ${variant.id} : ${format(ratio)}:1 (< ${format(DECOR_MIN)})`,
        );
    }
    for (const flyer of SKY_FLYERS) {
      if (flyer.hiddenOnSkies.includes(variant.sky)) continue;
      const source = sources[flyer.name];
      if (!source) {
        failures.push(`${flyer.name} : dessin introuvable`);
        continue;
      }
      const ratio = flyerContrast(flyerColors(source), background);
      if (ratio < GRAPHIC_MIN)
        failures.push(
          `${flyer.name} sur ${variant.id} : ${format(ratio)}:1 (< ${GRAPHIC_MIN})`,
        );
    }
  }
  return failures;
}

export function checkSkyContrast(failures: readonly string[]): {
  ok: boolean;
  message: string;
} {
  if (failures.length === 0)
    return {
      ok: true,
      message:
        "Ciel : animaux volants, soleil et nuages se voient sur chaque ciel.",
    };
  return {
    ok: false,
    message: `Ciel : contraste insuffisant (src/lib/garden/sky-contrast.ts) : ${failures.join(" ; ")}.`,
  };
}
