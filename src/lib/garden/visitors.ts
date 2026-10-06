// Visiteurs du jardin vivant : des animaux et des plantes de saison, et deux visiteurs de la
// nuit (hibou, renard). Ils apparaissent seuls, ne se débloquent pas et ne comptent nulle part.
// Table de données (comme species.ts), puis placement déterministe : même carnet et même
// saison = mêmes places, sur tous les appareils ; jamais devant les plantes de la personne.
import { PLANT_BOUNDS } from "@/lib/illustrations/bounds.generated";
import type { IllustrationName } from "@/lib/illustrations/specs";
import type { Presence } from "./fauna";
import { pickIndex } from "./hash";
import {
  animalBox,
  boxAt,
  GARDEN_SLOTS,
  illustrationFor,
  PLANT_FRAME_WIDTH,
  type Box,
  type GardenPlant,
  type GardenState,
} from "./model";
import { SCENE } from "./scene";
import type { Season } from "./seasons";
import type { SkyId } from "./skies";
import { speciesFor } from "./species";

export type VisitorKind =
  | "rouge-gorge"
  | "perce-neige"
  | "houx"
  | "hirondelle"
  | "primevere"
  | "jonquille"
  | "cigale"
  | "libellule"
  | "coquelicot"
  | "tournesol"
  | "ecureuil"
  | "champignons"
  | "hibou"
  | "renard";

/**
 * Où se pose un visiteur : une plante sur un emplacement libre, un animal au sol, dans la bande
 * de ciel, sur le tronc d'un arbre adulte (cigale) ou perché dessous son feuillage (hibou).
 */
export type VisitorPlace = "plant" | "ground" | "sky" | "trunk" | "perch";

export type VisitorRule = {
  kind: VisitorKind;
  place: VisitorPlace;
  seasons: readonly Season[];
  /** Présence le jour et la nuit (« asleep » : dessin endormi). */
  day: Presence;
  night: Presence;
  illustration: IllustrationName;
  sleeping?: IllustrationName;
  /** Largeur affichée, en unités de scène. */
  width: number;
  /** Ciels sur lesquels il n'apparaît pas (contraste insuffisant, voir sky-contrast.ts). */
  hiddenOnSkies?: readonly SkyId[];
  /** Nom accessible : « un rouge-gorge ». */
  name: string;
};

const ALL_SEASONS: readonly Season[] = ["printemps", "ete", "automne", "hiver"];

const plant = (
  kind: VisitorKind,
  season: Season,
  name: string,
): VisitorRule => ({
  kind,
  place: "plant",
  seasons: [season],
  day: "awake",
  night: "awake",
  illustration: kind as IllustrationName,
  width: PLANT_FRAME_WIDTH.flower,
  name,
});

export const VISITORS: readonly VisitorRule[] = [
  // Hiver
  {
    kind: "rouge-gorge",
    place: "ground",
    seasons: ["hiver"],
    day: "awake",
    night: "asleep",
    illustration: "rouge-gorge",
    sleeping: "rouge-gorge-endormi",
    width: 26,
    name: "un rouge-gorge",
  },
  plant("perce-neige", "hiver", "des perce-neige"),
  plant("houx", "hiver", "du houx"),
  // Printemps
  {
    kind: "hirondelle",
    place: "sky",
    seasons: ["printemps"],
    day: "awake",
    night: "absent",
    illustration: "hirondelle",
    width: 24,
    hiddenOnSkies: ["nuit"],
    name: "une hirondelle",
  },
  plant("primevere", "printemps", "des primevères"),
  plant("jonquille", "printemps", "une jonquille"),
  // Été
  {
    kind: "cigale",
    place: "trunk",
    seasons: ["ete"],
    day: "awake",
    night: "awake",
    illustration: "cigale",
    width: 12,
    name: "une cigale",
  },
  {
    kind: "libellule",
    place: "sky",
    seasons: ["ete"],
    day: "awake",
    night: "absent",
    illustration: "libellule",
    width: 24,
    name: "une libellule",
  },
  plant("coquelicot", "ete", "un coquelicot"),
  plant("tournesol", "ete", "un tournesol"),
  // Automne
  {
    kind: "ecureuil",
    place: "ground",
    seasons: ["automne"],
    day: "awake",
    night: "awake",
    illustration: "ecureuil",
    width: 28,
    name: "un écureuil",
  },
  plant("champignons", "automne", "des champignons"),
  // La nuit, toute l'année
  {
    kind: "hibou",
    place: "perch",
    seasons: ALL_SEASONS,
    day: "asleep",
    night: "awake",
    illustration: "hibou",
    sleeping: "hibou-endormi",
    width: 15,
    name: "un hibou",
  },
  {
    kind: "renard",
    place: "ground",
    seasons: ALL_SEASONS,
    day: "asleep",
    night: "awake",
    illustration: "renard",
    sleeping: "renard-endormi",
    width: 32,
    name: "un renard",
  },
];

export function visitorRule(kind: VisitorKind): VisitorRule {
  const rule = VISITORS.find((visitor) => visitor.kind === kind);
  if (!rule) throw new Error(`Visiteur inconnu : ${kind}`);
  return rule;
}

/** Le renard marche au sol la nuit : sa place compte ce va-et-vient (unités de scène). */
export const FOX_WALK = 10;

export type PlacedVisitor = {
  kind: VisitorKind;
  rule: VisitorRule;
  box: Box;
  /** Arbre sur lequel il est posé (cigale, hibou). */
  treeId?: string;
};

/** Année de la saison : décembre compte avec l'hiver de l'année suivante. */
export function seasonYear(date: Date, season: Season): number {
  const year = date.getFullYear();
  return season === "hiver" && date.getMonth() === 11 ? year + 1 : year;
}

/** Emprise dessinée d'une plante de la personne (plus serrée que son cadre). */
export function drawnBox(plant: GardenPlant): Box {
  const name = illustrationFor(plant.kind, plant.level);
  const bounds = PLANT_BOUNDS[name];
  if (!bounds) return plant.box;
  const scale = plant.box.width / (plant.kind.type === "tree" ? 120 : 60);
  return {
    x: plant.box.x + bounds.x * scale,
    y: plant.box.y + bounds.y * scale,
    width: bounds.width * scale,
    height: bounds.height * scale,
  };
}

export function overlaps(a: Box, b: Box): boolean {
  return (
    a.x < b.x + b.width &&
    b.x < a.x + a.width &&
    a.y < b.y + b.height &&
    b.y < a.y + a.height
  );
}

const inScene = (box: Box) =>
  box.x >= 0 &&
  box.y >= 0 &&
  box.x + box.width <= SCENE.width &&
  box.y + box.height <= SCENE.height;

/** Soleil et son halo (scene-paysage : disque en 318,66, halo de rayon 50). */
const SUN: Box = { x: 268, y: 16, width: 100, height: 100 };

/** Bande de ciel : au-dessus des collines (crête vers y = 175). */
const SKY_CANDIDATES: readonly { x: number; y: number }[] = [
  40, 75, 110, 145, 180, 215, 250,
].flatMap((x) => [50, 80, 110, 135].map((y) => ({ x, y })));

/** Les visiteurs volants n'ont pas de pied : leur cadre (64×48) est centré sur la place. */
function centeredBox(x: number, y: number, width: number): Box {
  const height = (width * 48) / 64;
  return { x: x - width / 2, y: y - height / 2, width, height };
}

/**
 * Place les visiteurs du moment (saison) dans le jardin. Les places ne dépendent pas de
 * l'heure : un visiteur ne saute pas d'un endroit à l'autre à 21 h. Un visiteur sans place
 * libre (jardin plein, pas d'arbre adulte) n'apparaît pas.
 */
export function placeVisitors(
  garden: Pick<GardenState, "plants" | "unlocked">,
  season: Season,
  year: number,
): PlacedVisitor[] {
  const key = (kind: VisitorKind, extra = "") =>
    `${year}:${season}:${kind}${extra}`;
  const blocked: Box[] = [
    ...garden.plants.map(drawnBox),
    ...garden.unlocked.map(animalBox),
  ];
  const taken = new Set(
    garden.plants.map((plant) =>
      GARDEN_SLOTS.findIndex(
        (slot) =>
          slot.row === plant.slot.row && slot.index === plant.slot.index,
      ),
    ),
  );
  const placed: PlacedVisitor[] = [];
  const free = (box: Box) =>
    inScene(box) &&
    ![...blocked, ...placed.map((v) => v.box)].some((b) => overlaps(box, b));

  const adultTrees = garden.plants
    .filter((plant) => plant.kind.type === "tree" && plant.stage === "grand")
    // Le plus haut d'abord (haut du cadre le plus haut), puis l'ordre du jardin.
    .sort((a, b) => a.box.y - b.box.y);

  const pick = <T>(candidates: readonly T[], k: string): T | undefined =>
    candidates.length ? candidates[pickIndex(k, candidates.length)] : undefined;

  const rules = VISITORS.filter((rule) => rule.seasons.includes(season));
  // Ordre : perchés (arbres), puis plantes, ciel, et le sol en dernier (renard à la fin).
  const order: VisitorPlace[] = ["perch", "trunk", "plant", "sky", "ground"];
  const sorted = [...rules].sort(
    (a, b) =>
      order.indexOf(a.place) - order.indexOf(b.place) ||
      Number(a.kind === "renard") - Number(b.kind === "renard"),
  );

  for (const rule of sorted) {
    const scale = (plant: GardenPlant) => plant.box.width / 120;
    switch (rule.place) {
      case "perch": {
        // Hibou : sur l'arbre adulte le plus haut.
        const tree = adultTrees[0];
        const perch = tree && speciesFor(tree.kind).perches?.owl;
        if (!tree || !perch) break;
        const box = boxAt(
          rule.illustration,
          tree.box.x + perch.x * scale(tree),
          tree.box.y + perch.y * scale(tree),
          rule.width,
        );
        placed.push({ kind: rule.kind, rule, box, treeId: tree.id });
        break;
      }
      case "trunk": {
        // Cigale : sur le tronc d'un arbre adulte (un autre que celui du hibou s'il y en a).
        const owlTree = placed.find((v) => v.kind === "hibou")?.treeId;
        const others = adultTrees.filter((tree) => tree.id !== owlTree);
        const tree = pick(others.length ? others : adultTrees, key(rule.kind));
        const spot = tree && speciesFor(tree.kind).perches?.cicada;
        if (!tree || !spot) break;
        const height = (rule.width * 48) / 64;
        const box = {
          x: tree.box.x + spot.x * scale(tree) - rule.width / 2,
          y: tree.box.y + spot.y * scale(tree) - height / 2,
          width: rule.width,
          height,
        };
        placed.push({ kind: rule.kind, rule, box, treeId: tree.id });
        break;
      }
      case "plant": {
        const candidates = GARDEN_SLOTS.map((slot, index) => ({ slot, index }))
          .filter(({ index }) => !taken.has(index))
          .map(({ slot, index }) => ({
            index,
            box: boxAt(rule.illustration, slot.x, slot.y, rule.width),
          }))
          .filter(({ box }) => free(box));
        const choice = pick(candidates, key(rule.kind));
        if (!choice) break;
        taken.add(choice.index);
        placed.push({ kind: rule.kind, rule, box: choice.box });
        break;
      }
      case "sky": {
        const candidates = SKY_CANDIDATES.map(({ x, y }) =>
          centeredBox(x, y, rule.width),
        ).filter((box) => free(box) && !overlaps(box, SUN));
        const box = pick(candidates, key(rule.kind));
        if (box) placed.push({ kind: rule.kind, rule, box });
        break;
      }
      case "ground": {
        const walk = rule.kind === "renard" ? FOX_WALK : 0;
        const candidates = GARDEN_SLOTS.map((slot) =>
          boxAt(rule.illustration, slot.x, slot.y + 2, rule.width),
        ).filter((box) =>
          free({ ...box, x: box.x - walk, width: box.width + 2 * walk }),
        );
        const box = pick(candidates, key(rule.kind));
        if (box) placed.push({ kind: rule.kind, rule, box });
        break;
      }
    }
  }
  return placed;
}

/** Visiteur affiché à ce moment : éveillé, endormi, ou absent (nuit, ciel). */
export function visitorPresence(
  rule: VisitorRule,
  moment: { night: boolean; sky: SkyId },
): Presence {
  if (rule.hiddenOnSkies?.includes(moment.sky)) return "absent";
  return moment.night ? rule.night : rule.day;
}

export function visitorIllustration(
  rule: VisitorRule,
  presence: Presence,
): IllustrationName {
  return presence === "asleep" && rule.sleeping
    ? rule.sleeping
    : rule.illustration;
}
