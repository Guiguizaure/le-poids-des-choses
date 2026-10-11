// Jardin de l'image de partage : le même rendu que <Garden> (mêmes plantes, mêmes animaux et
// visiteurs aux mêmes places, même ciel, jour ou nuit selon l'heure de création, brume s'il
// dort), en un seul SVG statique, sans navigateur.
import {
  animalIllustration,
  illustrationFor,
  type Box,
  type GardenState,
} from "@/lib/garden/model";
import { fallingParticles, particleAt } from "@/lib/geometry/fall";
import { STARS_OPACITY } from "@/lib/garden/daytime";
import { liveScene, type LiveScene } from "@/lib/garden/live";
import { SCENE } from "@/lib/garden/scene";
import type { Season } from "@/lib/garden/seasons";
import { skyColors, type SkyId } from "@/lib/garden/skies";
import { bareBranchesSvg, gradientTransformFor } from "@/lib/garden/foliage";
import { plantLook, type PlantLook } from "@/lib/garden/species";
import { replaceGroups } from "./svg-groups";
import { getSpec, type IllustrationName } from "@/lib/illustrations/specs";

/** Sources SVG des illustrations (contenu des fichiers de public/illustrations). */
export type SvgSources = Partial<Record<IllustrationName, string>>;

/** Brume du jardin assoupi : toute la largeur, à mi-hauteur (comme dans <Garden>). */
const MIST_TOP = SCENE.height / 2;

/** Moment de l'image : saison, nuit (heure de création), date (places des visiteurs). */
export type ShareMoment = {
  season?: Season | null;
  night?: boolean;
  date?: Date;
};

function liveFor(
  garden: GardenState,
  sky: SkyId,
  moment: ShareMoment,
): LiveScene {
  return liveScene(
    garden,
    { season: moment.season ?? null, night: moment.night ?? false },
    sky,
    moment.date ?? new Date(),
  );
}

/** Illustrations dont la composition a besoin, dans l'ordre d'affichage. */
export function gardenIllustrations(
  garden: GardenState,
  season: Season | null = null,
  moment: Omit<ShareMoment, "season"> & { sky?: SkyId } = {},
): IllustrationName[] {
  const live = liveFor(garden, moment.sky ?? "jour", { ...moment, season });
  return [
    "scene-paysage",
    ...(live.stars ? (["etoiles"] as const) : []),
    ...(season === "hiver" ? (["saison-hiver-neige"] as const) : []),
    ...live.visitors.map((visitor) => visitor.illustration),
    ...garden.plants.flatMap((plant) => {
      const look = plantLook(plant, season);
      return [
        illustrationFor(plant.kind, plant.level),
        ...(look.bloom.level > 0 ? [look.bloom.illustration] : []),
      ];
    }),
    ...live.animals.map((animal) =>
      animalIllustration(animal.kind, animal.asleep),
    ),
    ...(season === "hiver" ? (["saison-hiver-flocons"] as const) : []),
    ...fallingParticles(season).map((particle) => particle.name),
    ...(garden.asleep ? (["brume"] as const) : []),
  ];
}

/** Préfixe des id des dégradés d'automne (seuls id gardés dans l'image, voir `placed`). */
const GRADIENT_ID = "saison-";

/**
 * Feuillage de saison des formes des calques donnés : dégradé d'automne (un par forme, dans le
 * repère de l'arbre, ids uniques dans l'image grâce à `prefix`), ou arbre endormi l'hiver
 * (feuillage caché, branches nues et bourgeons par-dessus). Même rendu que StagedPlant.
 */
export function paintFoliage(
  svg: string,
  paint: PlantLook["paint"],
  stage: string,
  prefix: string,
): string {
  if (!paint) return svg;
  if (paint.mode === "asleep") {
    const bare = paint.bare[stage as keyof typeof paint.bare];
    if (!bare) return svg;
    return replaceGroups(
      svg,
      paint.layers,
      ({ open, body, close }) => `${open} visibility="hidden">${body}${close}`,
    ).replace(/<\/svg>\s*$/, `${bareBranchesSvg(bare)}</svg>`);
  }
  const range = paint.y[stage as keyof typeof paint.y];
  if (!range) return svg;
  const gradients: string[] = [];
  const painted = replaceGroups(
    svg,
    paint.layers,
    ({ open, body, close }) =>
      `${open}>${body.replace(
        /<(circle|ellipse|rect|path)\b([^>]*?)\s*(\/?)>/g,
        (_, tag: string, attributes: string, selfClosing: string) => {
          const id = `${GRADIENT_ID}${prefix}-${gradients.length}`;
          const inverse = gradientTransformFor(
            attributes.match(/\stransform="([^"]+)"/)?.[1],
          );
          gradients.push(
            `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="60" y1="${range[0]}" x2="60" y2="${range[1]}"${inverse ? ` gradientTransform="${inverse}"` : ""}><stop offset="0" stop-color="${paint.top}"/><stop offset="1" stop-color="${paint.bottom}"/></linearGradient>`,
          );
          const kept = attributes.replace(/\sfill="[^"]*"/g, "");
          return `<${tag}${kept} fill="url(#${id})"${selfClosing ? " /" : ""}>`;
        },
      )}${close}`,
  );
  return painted.replace(
    /(<svg\b[^>]*>)/,
    `$1<defs>${gradients.join("")}</defs>`,
  );
}

/** Épanouissement : seul le groupe du niveau affiché reste (les autres sont retirés). */
export function keepBloomGroup(
  svg: string,
  groups: readonly string[],
  level: number,
): string {
  return replaceGroups(
    svg,
    groups.filter((_, index) => index + 1 !== level),
    () => "",
  );
}

function inner(svg: string): string {
  const open = svg.indexOf(">", svg.search(/<svg\b/));
  const close = svg.lastIndexOf("</svg>");
  if (open < 0 || close < 0) throw new Error("Source SVG illisible.");
  return svg.slice(open + 1, close);
}

/**
 * Recolore les remplissages d'un calque (<g id="…">) du paysage, jusqu'au premier groupe
 * imbriqué ou à sa fin : les cratères, groupe dans le soleil, gardent leur couleur.
 */
function recolor(svg: string, layer: string, color: string): string {
  return svg.replace(
    new RegExp(`(<g id="${layer}"[^>]*>)((?:(?!<\\/?g[\\s>])[\\s\\S])*)`, "g"),
    (_, open: string, body: string) =>
      open + body.replace(/fill="#[0-9A-Fa-f]{3,8}"/g, `fill="${color}"`),
  );
}

/** La nuit, la lune montre ses cratères (invisibles le jour, opacité 0 dans le dessin). */
function showCraters(svg: string): string {
  return svg.replace(/(<g id="crateres"[^>]*?)\sopacity="0"/, "$1");
}

/**
 * Trait « non-scaling-stroke » (contour des petites bêtes) : à l'écran, la scène fait à peu
 * près 1 px par unité, donc un trait de 1,5 vaut 1,5 unité de scène. On le convertit en
 * épaisseur fixe dans les unités de l'illustration, pour que l'image agrandie garde ces
 * proportions.
 */
function fixedStrokes(svg: string, localPerScene: number): string {
  return svg.replace(
    /<[a-z]+\b[^>]*vector-effect="non-scaling-stroke"[^>]*>/g,
    (tag) =>
      tag
        .replace(/\s*vector-effect="non-scaling-stroke"/, "")
        .replace(
          /stroke-width="([\d.]+)"/,
          (_, width: string) =>
            `stroke-width="${round(Number(width) * localPerScene)}"`,
        ),
  );
}

const round = (value: number) => Math.round(value * 1000) / 1000;

function placed(
  name: IllustrationName,
  box: Pick<Box, "x" | "y" | "width">,
  sources: SvgSources,
  transform: (svg: string) => string = (svg) => svg,
): string {
  const source = sources[name];
  if (!source) throw new Error(`Illustration « ${name} » manquante.`);
  const spec = getSpec(name);
  const height = (spec.height * box.width) / spec.width;
  const localPerScene = spec.width / box.width;
  const body = fixedStrokes(transform(source), localPerScene)
    // Les id des calques ne servent plus : on les retire pour éviter les doublons (seuls
    // restent ceux des dégradés d'automne, uniques dans l'image).
    .replace(new RegExp(`\\s+id="(?!${GRADIENT_ID})[^"]*"`, "g"), "");
  return `<svg x="${round(box.x)}" y="${round(box.y)}" width="${round(box.width)}" height="${round(height)}" viewBox="0 0 ${spec.width} ${spec.height}" overflow="visible">${inner(body)}</svg>`;
}

/**
 * Le jardin en un SVG (unités de scène 390×300), dessiné à la taille demandée. Les animaux
 * qui volent sont figés à leur place ; rien ne bouge.
 */
export function composeGardenSvg(
  garden: GardenState,
  sky: SkyId,
  sources: SvgSources,
  size: { width: number; height: number } = SCENE,
  season: Season | null = null,
  moment: Omit<ShareMoment, "season"> = {},
): string {
  const live = liveFor(garden, sky, { ...moment, season });
  const colors = skyColors(live.sky, season);
  const landscape = placed(
    "scene-paysage",
    { x: 0, y: 0, width: SCENE.width },
    sources,
    (svg) =>
      [
        ["ciel", colors.ciel],
        ["soleil", colors.soleil],
        ["halo-soleil", colors.halo],
        ["nuage-1", colors.nuage],
        ["nuage-2", colors.nuage],
      ].reduce(
        (acc, [layer, color]) => recolor(acc, layer, color),
        live.night ? showCraters(svg) : svg,
      ),
  );
  const full = { x: 0, y: 0, width: SCENE.width };
  const stars = live.stars
    ? [`<g opacity="${STARS_OPACITY}">${placed("etoiles", full, sources)}</g>`]
    : [];
  const visitors = (ground: boolean) =>
    live.visitors
      .filter((visitor) => (visitor.rule.place === "plant") === ground)
      .map((visitor) => placed(visitor.illustration, visitor.box, sources));
  const snow =
    season === "hiver" ? [placed("saison-hiver-neige", full, sources)] : [];
  const plants = garden.plants.flatMap((plant, index) => {
    const look = plantLook(plant, season);
    const drawn = placed(
      illustrationFor(plant.kind, plant.level),
      plant.box,
      sources,
      (svg) => paintFoliage(svg, look.paint, plant.stage, String(index)),
    );
    if (look.bloom.level === 0) return [drawn];
    return [
      drawn,
      placed(look.bloom.illustration, plant.box, sources, (svg) =>
        keepBloomGroup(svg, look.bloom.groups, look.bloom.level),
      ),
    ];
  });
  const animals = live.animals.map((animal) =>
    placed(animalIllustration(animal.kind, animal.asleep), animal.box, sources),
  );
  // Ce qui tombe, figé : flocons l'hiver, quelques pétales ou feuilles en l'air.
  const falling = [
    ...(season === "hiver"
      ? [placed("saison-hiver-flocons", full, sources)]
      : []),
    ...fallingParticles(season).map((particle) => {
      const pose = particleAt(particle, particle.still);
      const center = particle.size / 2;
      return `<g transform="rotate(${round(pose.rotation)} ${round(pose.x + center)} ${round(pose.y + center)})">${placed(
        particle.name,
        { x: pose.x, y: pose.y, width: particle.size },
        sources,
      )}</g>`;
    }),
  ];
  const mist = garden.asleep
    ? [placed("brume", { x: 0, y: MIST_TOP, width: SCENE.width }, sources)]
    : [];
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${SCENE.width} ${SCENE.height}">`,
    landscape,
    ...stars,
    ...snow,
    ...visitors(true),
    ...plants,
    ...visitors(false),
    ...animals,
    ...falling,
    ...mist,
    "</svg>",
  ].join("");
}
