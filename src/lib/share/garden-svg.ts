// Jardin de l'image de partage : le même rendu que <Garden> (mêmes plantes, mêmes animaux aux
// mêmes places, même ciel, brume s'il dort), en un seul SVG statique, sans navigateur.
import {
  animalIllustration,
  illustrationFor,
  type Box,
  type GardenState,
} from "@/lib/garden/model";
import { SCENE } from "@/lib/garden/scene";
import { getSky, type SkyId } from "@/lib/garden/skies";
import { getSpec, type IllustrationName } from "@/lib/illustrations/specs";

/** Sources SVG des illustrations (contenu des fichiers de public/illustrations). */
export type SvgSources = Partial<Record<IllustrationName, string>>;

/** Brume du jardin assoupi : toute la largeur, à mi-hauteur (comme dans <Garden>). */
const MIST_TOP = SCENE.height / 2;

/** Illustrations dont la composition a besoin, dans l'ordre d'affichage. */
export function gardenIllustrations(garden: GardenState): IllustrationName[] {
  return [
    "scene-paysage",
    ...garden.plants.map((plant) => illustrationFor(plant.kind, plant.level)),
    ...garden.animals.map((animal) =>
      animalIllustration(animal.kind, animal.asleep),
    ),
    ...(garden.asleep ? (["brume"] as const) : []),
  ];
}

function inner(svg: string): string {
  const open = svg.indexOf(">", svg.search(/<svg\b/));
  const close = svg.lastIndexOf("</svg>");
  if (open < 0 || close < 0) throw new Error("Source SVG illisible.");
  return svg.slice(open + 1, close);
}

/** Recolore les remplissages d'un calque (<g id="…">) du paysage. */
function recolor(svg: string, layer: string, color: string): string {
  return svg.replace(
    new RegExp(`(<g id="${layer}"[^>]*>)([\\s\\S]*?)(</g>)`, "g"),
    (_, open: string, body: string, close: string) =>
      open +
      body.replace(/fill="#[0-9A-Fa-f]{3,8}"/g, `fill="${color}"`) +
      close,
  );
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
    // Les id (calques) ne servent plus : on les retire pour éviter les doublons.
    .replace(/\s+id="[^"]*"/g, "");
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
): string {
  const { colors } = getSky(sky);
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
      ].reduce((acc, [layer, color]) => recolor(acc, layer, color), svg),
  );
  const plants = garden.plants.map((plant) =>
    placed(illustrationFor(plant.kind, plant.level), plant.box, sources),
  );
  const animals = garden.animals.map((animal) =>
    placed(animalIllustration(animal.kind, animal.asleep), animal.box, sources),
  );
  const mist = garden.asleep
    ? [placed("brume", { x: 0, y: MIST_TOP, width: SCENE.width }, sources)]
    : [];
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${SCENE.width} ${SCENE.height}">`,
    landscape,
    ...plants,
    ...animals,
    ...mist,
    "</svg>",
  ].join("");
}
