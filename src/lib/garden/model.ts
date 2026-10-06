// Modèle du jardin : fonctions pures. Même carnet = même jardin, sur tous les appareils.
import { DEFAULT_ASLEEP_DAYS, isAsleep } from "@/lib/calc";
import type { JournalEntry } from "@/lib/data/types";
import {
  getSpec,
  ILLUSTRATION_SPECS,
  type IllustrationName,
} from "@/lib/illustrations/specs";
import { isHabit, isLightChoice } from "@/lib/journal/kind";
import { sortEntries } from "@/lib/journal/schema";
import { hashString, pickIndex } from "./hash";
import { SCENE, surfaceY } from "./scene";
import {
  SPECIES,
  type PlantKind,
  type PlantStage,
  type PlantType,
  type PlantVariant,
} from "./species";
import {
  daysToNextStep,
  MAX_BLOOM,
  wateredDayCount,
  wateredDaysSince,
  waterings,
  wateringSteps,
  type BloomLevel,
} from "./watering";

// ---- Plantes -------------------------------------------------------------------------------

export type { PlantKind, PlantStage, PlantType, PlantVariant };
/** 0 : pousse ; 1 : jeune (arbre) ou fleurie (fleur) ; 2 : grand (arbre) ou fleurie (fleur). */
export type GrowthLevel = 0 | 1 | 2;

/**
 * Espèces du tirage au hasard (table SPECIES, `randomPool`), dans un ordre figé : le changer
 * changerait l'espèce des plantes déjà là.
 */
export const PLANT_KINDS: readonly PlantKind[] = SPECIES.filter(
  (species) => species.randomPool,
).map((species) => species.kind);

/**
 * Seuils PROVISOIRES du stade d'une plante, selon l'écart (kg) du choix qui l'a fait
 * pousser (échelle douce) : moins de 1 kg → pousse ; 1 à 20 kg → jeune / fleurie ;
 * plus de 20 kg → grand.
 */
export const PLANT_STAGE_KG = { young: 1, grown: 20 } as const;

/** Au-delà, les nouveaux choix légers font grandir les plus anciennes plantes. */
export const MAX_PLANTS = 40;

export function plantKindFor(entryId: string): PlantKind {
  return PLANT_KINDS[pickIndex(`${entryId}:kind`, PLANT_KINDS.length)];
}

export function levelForKg(kg: number): GrowthLevel {
  if (!(kg >= PLANT_STAGE_KG.young)) return 0;
  return kg > PLANT_STAGE_KG.grown ? 2 : 1;
}

/** Niveau maximal visible : une fleur fleurie ne change plus d'aspect. */
export function maxLevel(kind: PlantKind): GrowthLevel {
  return kind.type === "flower" ? 1 : 2;
}

export function stageFor(kind: PlantKind, level: GrowthLevel): PlantStage {
  if (kind.type === "flower") return level === 0 ? "pousse" : "fleurie";
  return (["pousse", "jeune", "grand"] as const)[level];
}

export function illustrationFor(
  kind: PlantKind,
  level: GrowthLevel,
): IllustrationName {
  const prefix = kind.type === "tree" ? "arbre" : "fleur";
  return `${prefix}-${kind.variant}-${stageFor(kind, level)}` as IllustrationName;
}

/** Largeur d'affichage du cadre de chaque plante, en unités de la scène (390 de large). */
export const PLANT_FRAME_WIDTH: Record<PlantType, number> = {
  tree: 60,
  flower: 30,
};

/**
 * Largeur maximale dessinée d'une plante (feuillage d’arbre-3-grand, 90/120 d’un cadre de 60) : l'écart
 * entre deux emplacements d'une même rangée est au moins égal, donc pas de chevauchement.
 */
export const MAX_PLANT_WIDTH = 45;

export type Box = { x: number; y: number; width: number; height: number };

/** Cadre d'une illustration posée par son point d'appui en (footX, footY), unités de scène. */
export function boxAt(
  name: IllustrationName,
  footX: number,
  footY: number,
  width: number,
): Box {
  const spec = getSpec(name);
  const anchor = spec.anchor ?? { x: spec.width / 2, y: spec.height };
  const scale = width / spec.width;
  return {
    x: footX - anchor.x * scale,
    y: footY - anchor.y * scale,
    width,
    height: spec.height * scale,
  };
}

// ---- Emplacements --------------------------------------------------------------------------

export type Slot = { row: number; index: number; x: number; y: number };

const ROWS = 5;
const PER_ROW = 8;
const SLOT_SPACING = 45;
const ROW_STAGGER = 20;
const FRONT_Y = 292;

/**
 * 40 emplacements en 5 rangées décalées, de l'arrière (crête des collines) vers l'avant (bas
 * du sol). Dans une rangée, deux pieds sont espacés de 45, la largeur de la plante la plus large ; les bords restent dans la scène.
 */
export const GARDEN_SLOTS: readonly Slot[] = Array.from(
  { length: ROWS * PER_ROW },
  (_, n) => {
    const row = Math.floor(n / PER_ROW);
    const index = n % PER_ROW;
    const used = (PER_ROW - 1) * SLOT_SPACING + ROW_STAGGER;
    const x =
      (SCENE.width - used) / 2 + (row % 2) * ROW_STAGGER + index * SLOT_SPACING;
    const top = surfaceY(x) + 8;
    const y = top + ((FRONT_Y - top) * row) / (ROWS - 1);
    return {
      row,
      index,
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
    };
  },
);

/** Rangées à essayer selon la taille : les plus grands vers l'arrière, les pousses devant. */
const ROW_PREFERENCE: Record<GrowthLevel, readonly number[]> = {
  2: [0, 1, 2, 3, 4],
  1: [1, 2, 0, 3, 4],
  0: [4, 3, 2, 1, 0],
};

function pickSlot(
  entryId: string,
  level: GrowthLevel,
  taken: ReadonlySet<number>,
): number {
  for (const row of ROW_PREFERENCE[level]) {
    const free = GARDEN_SLOTS.map((slot, i) => ({ slot, i })).filter(
      ({ slot, i }) => slot.row === row && !taken.has(i),
    );
    if (free.length) return free[pickIndex(`${entryId}:slot`, free.length)].i;
  }
  return -1;
}

// ---- Animaux -------------------------------------------------------------------------------

export type AnimalKind =
  "butterfly" | "ladybug" | "bird" | "snail" | "bee" | "hedgehog";

/** Seuils PROVISOIRES : nombre de choix légers pour qu'un animal s'installe. */
export const ANIMAL_UNLOCKS: readonly {
  kind: AnimalKind;
  lightChoices: number;
}[] = [
  { kind: "butterfly", lightChoices: 1 },
  { kind: "ladybug", lightChoices: 3 },
  { kind: "bird", lightChoices: 5 },
  { kind: "snail", lightChoices: 8 },
  { kind: "bee", lightChoices: 12 },
  { kind: "hedgehog", lightChoices: 20 },
];

/** Animaux qui restent visibles (endormis) quand le jardin s'assoupit ; les autres partent. */
export const SLEEPERS: readonly AnimalKind[] = ["bird", "snail", "hedgehog"];

/**
 * Place de chaque animal (unités de scène) : centre du cadre pour ceux qui volent, point
 * d'appui au sol pour les autres.
 * - Papillon et abeille volent dans la bande de ciel, au-dessus des plus hauts feuillages
 *   (le haut du plus haut cadre d'arbre est vers y = 105), sans se poser sur une plante.
 * - Coccinelle, escargot, hérisson et oiseau sont posés au sol. L'oiseau, bleu, se pose
 *   sur la colline verte (il disparaîtrait sur la bleue) ; il s'envole de temps en temps
 *   (V1.1, `src/lib/geometry/flight.ts`) et revient à cette place.
 */
export const ANIMAL_PLACES: Record<
  AnimalKind,
  { x: number; y: number; width: number; flying: boolean }
> = {
  bird: { x: 372, y: surfaceY(372) + 4, width: 30, flying: false },
  butterfly: { x: 100, y: 84, width: 24, flying: true },
  bee: { x: 205, y: 76, width: 24, flying: true },
  ladybug: { x: 318, y: 293, width: 16, flying: false },
  snail: { x: 58, y: 294, width: 30, flying: false },
  hedgehog: { x: 206, y: 295, width: 34, flying: false },
};

const ANIMAL_ILLUSTRATION: Record<AnimalKind, IllustrationName> = {
  bird: "oiseau",
  butterfly: "papillon",
  bee: "abeille",
  ladybug: "coccinelle",
  snail: "escargot",
  hedgehog: "herisson",
};

/** Illustration d'un animal du jardin, endormie quand elle existe et que le jardin dort. */
export function animalIllustration(
  kind: AnimalKind,
  asleep: boolean,
): IllustrationName {
  const name = ANIMAL_ILLUSTRATION[kind];
  const sleeping = `${name}-endormi`;
  return asleep && sleeping in ILLUSTRATION_SPECS
    ? (sleeping as IllustrationName)
    : name;
}

export function unlockedAnimals(lightChoiceCount: number): AnimalKind[] {
  return ANIMAL_UNLOCKS.filter(
    (unlock) => lightChoiceCount >= unlock.lightChoices,
  ).map((unlock) => unlock.kind);
}

export type NextAnimal = { kind: AnimalKind; remaining: number };

/** Prochain animal à s'installer et nombre de choix légers qui manquent (null : tous là). */
export function nextAnimal(lightChoiceCount: number): NextAnimal | null {
  const next = ANIMAL_UNLOCKS.find(
    (unlock) => lightChoiceCount < unlock.lightChoices,
  );
  return next
    ? { kind: next.kind, remaining: next.lightChoices - lightChoiceCount }
    : null;
}

export function animalBox(kind: AnimalKind): Box {
  const place = ANIMAL_PLACES[kind];
  const name = ANIMAL_ILLUSTRATION[kind];
  if (!place.flying) return boxAt(name, place.x, place.y, place.width);
  const spec = getSpec(name);
  const height = (spec.height * place.width) / spec.width;
  return {
    x: place.x - place.width / 2,
    y: place.y - height / 2,
    width: place.width,
    height,
  };
}

// ---- Jardin --------------------------------------------------------------------------------

export type GardenPlant = {
  /** Id de l'entrée qui l'a fait pousser. */
  id: string;
  kind: PlantKind;
  /** Stade affiché (écart du choix, jardin plein, puis arrosage). */
  level: GrowthLevel;
  stage: PlantStage;
  /** Épanouissement atteint (0 à 3), une fois adulte ; l'affichage dépend de la saison. */
  bloom: BloomLevel;
  /** Jours arrosés depuis qu'elle a été plantée. */
  wateredDays: number;
  slot: Slot;
  box: Box;
};

export type GardenAnimal = { kind: AnimalKind; asleep: boolean; box: Box };

export type GardenState = {
  /** Triées de l'arrière vers l'avant (ordre d'affichage). */
  plants: GardenPlant[];
  /** Animaux visibles (endormis ou non). */
  animals: GardenAnimal[];
  /** Animaux installés, visibles ou partis le temps du sommeil. */
  unlocked: AnimalKind[];
  asleep: boolean;
  /** Comparaisons notées (les habitudes sont comptées à part). */
  choiceCount: number;
  lightChoiceCount: number;
  /** Écart cumulé : comparaisons seulement (une habitude ne compte aucun kg). */
  totalAvoidedKg: number;
  habitCount: number;
  /** Jours où au moins une habitude a été notée. */
  wateredDayCount: number;
};

const isLight = isLightChoice;

/** Rang de progression d'une plante : stade, puis épanouissement (pour comparer deux états). */
export function plantProgress(
  plant: Pick<GardenPlant, "level" | "bloom">,
): number {
  return plant.level + plant.bloom;
}

/** Vrai si la plante peut encore avancer (stade adulte et épanouissement maximal non atteints). */
export function canProgress(
  plant: Pick<GardenPlant, "kind" | "level" | "bloom">,
): boolean {
  return plant.level < maxLevel(plant.kind) || plant.bloom < MAX_BLOOM;
}

export function buildGarden(
  entries: readonly JournalEntry[],
  now: Date,
  asleepDays: number = DEFAULT_ASLEEP_DAYS,
): GardenState {
  const sorted = sortEntries(entries);
  const plants: {
    id: string;
    kind: PlantKind;
    level: GrowthLevel;
    slot: Slot;
    plantedAt: number;
  }[] = [];
  const taken = new Set<number>();
  let lightChoiceCount = 0;
  let totalAvoidedKg = 0;
  let habitCount = 0;

  for (const entry of sorted) {
    if (isHabit(entry)) habitCount += 1;
    // Un choix lourd n'ajoute rien et ne retire rien ; une habitude arrose (plus bas).
    if (!isLight(entry)) continue;
    lightChoiceCount += 1;
    totalAvoidedKg += entry.avoidedKg;
    if (plants.length < MAX_PLANTS) {
      const kind = plantKindFor(entry.id);
      const level = Math.min(
        levelForKg(entry.avoidedKg),
        maxLevel(kind),
      ) as GrowthLevel;
      // L'emplacement dépend du stade de départ seulement : l'arrosage ne déplace rien.
      const slotIndex = pickSlot(entry.id, level, taken);
      taken.add(slotIndex);
      plants.push({
        id: entry.id,
        kind,
        level,
        slot: GARDEN_SLOTS[slotIndex],
        plantedAt: Date.parse(entry.date),
      });
    } else {
      // Jardin plein : le choix fait grandir d'un cran la plus ancienne plante qui peut encore
      // grandir (jusqu'à son aspect maximal, puis on passe à la suivante).
      const oldest = plants.find((plant) => plant.level < maxLevel(plant.kind));
      if (oldest) oldest.level = (oldest.level + 1) as GrowthLevel;
    }
  }

  const last = sorted.at(-1);
  const asleep = last ? isAsleep(last.date, now, asleepDays) : false;
  const unlocked = unlockedAnimals(lightChoiceCount);

  const watered = waterings(sorted);

  return {
    plants: plants
      .map(({ plantedAt, ...plant }) => {
        // Arrosage : un cran tous les WATER_DAYS_PER_STEP jours arrosés depuis la plantation,
        // d'abord vers l'âge adulte, puis vers l'épanouissement.
        const wateredDays = wateredDaysSince(watered, plantedAt);
        const progress = plant.level + wateringSteps(wateredDays);
        const max = maxLevel(plant.kind);
        const level = Math.min(progress, max) as GrowthLevel;
        const bloom = Math.min(
          MAX_BLOOM,
          Math.max(0, progress - max),
        ) as BloomLevel;
        return {
          ...plant,
          level,
          bloom,
          wateredDays,
          stage: stageFor(plant.kind, level),
          box: boxAt(
            illustrationFor(plant.kind, level),
            plant.slot.x,
            plant.slot.y,
            PLANT_FRAME_WIDTH[plant.kind.type],
          ),
        };
      })
      .sort((a, b) => a.slot.y - b.slot.y || a.slot.x - b.slot.x),
    animals: unlocked
      .filter((kind) => !asleep || SLEEPERS.includes(kind))
      .map((kind) => ({ kind, asleep, box: animalBox(kind) })),
    unlocked,
    asleep,
    choiceCount: sorted.length - habitCount,
    lightChoiceCount,
    totalAvoidedKg,
    habitCount,
    wateredDayCount: wateredDayCount(watered),
  };
}

/** Animaux installés grâce à une entrée donnée (pour le message d'arrivée). */
export function animalsArrivedWith(
  entries: readonly JournalEntry[],
  entryId: string,
): AnimalKind[] {
  const sorted = sortEntries(entries);
  const index = sorted.findIndex((entry) => entry.id === entryId);
  if (index === -1 || !isLight(sorted[index])) return [];
  const lightBefore = sorted.slice(0, index).filter(isLight).length;
  const alreadyThere = new Set(unlockedAnimals(lightBefore));
  return unlockedAnimals(lightBefore + 1).filter(
    (kind) => !alreadyThere.has(kind),
  );
}

/** Empreinte stable du jardin (utile pour vérifier le déterminisme). */
export function gardenSignature(state: GardenState): number {
  return hashString(
    state.plants
      .map(
        (p) =>
          `${p.id}:${p.kind.type}${p.kind.variant}:${p.level}:${p.bloom}:${p.slot.row}.${p.slot.index}`,
      )
      .join("|"),
  );
}

// ---- Révélation d'un choix ----------------------------------------------------------------

export type Reveal = {
  /** Plante que ce choix fait pousser, ou fait grandir (jardin plein), à son stade final. */
  plant: GardenPlant;
  /** Vrai si c'est une nouvelle plante ; faux si le choix fait grandir une plante existante. */
  isNew: boolean;
  /** Animaux qui s'installent grâce à ce choix. */
  animals: AnimalKind[];
};

/**
 * Ce que l'entrée `entryId` apporte au jardin : même calcul que `buildGarden`, en comparant le
 * jardin avec et sans cette entrée. Null pour un choix plus lourd (rien ne pousse).
 */
export function revealForEntry(
  entries: readonly JournalEntry[],
  entryId: string,
  now: Date = new Date(),
): Reveal | null {
  if (!entries.some((entry) => entry.id === entryId && isLight(entry)))
    return null;
  const before = buildGarden(
    entries.filter((entry) => entry.id !== entryId),
    now,
  );
  const after = buildGarden(entries, now);
  const animals = animalsArrivedWith(entries, entryId);
  const fresh = after.plants.find((plant) => plant.id === entryId);
  if (fresh) return { plant: fresh, isNew: true, animals };
  const grown = after.plants.find((plant) => {
    const previous = before.plants.find((p) => p.id === plant.id);
    return previous && previous.level !== plant.level;
  });
  return grown ? { plant: grown, isNew: false, animals } : null;
}

// ---- Arrosage d'une habitude --------------------------------------------------------------

export type WaterReveal = {
  /** Premier arrosage de ce jour (sinon le jour était déjà arrosé : rien ne change). */
  newDay: boolean;
  /** Plantes qui avancent d'un cran grâce à cette habitude, à leur nouvel état. */
  moved: GardenPlant[];
  /** Plante à montrer : la plus avancée de celles qui bougent (la plus ancienne à égalité). */
  featured: GardenPlant | null;
  plantCount: number;
  /** Jours arrosés avant le prochain cran de la plante la plus proche (null : rien à faire). */
  nextStepIn: number | null;
};

/**
 * Ce que l'habitude `entryId` apporte au jardin : même calcul que `buildGarden`, avec et sans
 * cette entrée. Null si l'entrée n'est pas une habitude du carnet.
 */
export function waterRevealForEntry(
  entries: readonly JournalEntry[],
  entryId: string,
  now: Date = new Date(),
): WaterReveal | null {
  const sorted = sortEntries(entries);
  const index = sorted.findIndex((entry) => entry.id === entryId);
  const entry = sorted[index];
  if (!entry || !isHabit(entry)) return null;
  const day = waterings([entry])[0]?.day;
  const newDay = !waterings(sorted.slice(0, index)).some(
    (watering) => watering.day === day,
  );
  const before = buildGarden(
    sorted.filter((other) => other.id !== entryId),
    now,
  );
  const after = buildGarden(sorted, now);
  const previous = new Map(before.plants.map((plant) => [plant.id, plant]));
  const moved = after.plants.filter((plant) => {
    const old = previous.get(plant.id);
    return old !== undefined && plantProgress(plant) > plantProgress(old);
  });
  const featured =
    [...moved].sort(
      (a, b) =>
        plantProgress(b) - plantProgress(a) ||
        sorted.findIndex((e) => e.id === a.id) -
          sorted.findIndex((e) => e.id === b.id),
    )[0] ?? null;
  const growing = after.plants.filter(canProgress);
  const nextStepIn = growing.length
    ? Math.min(...growing.map((plant) => daysToNextStep(plant.wateredDays)))
    : null;
  return {
    newDay,
    moved,
    featured,
    plantCount: after.plants.length,
    nextStepIn,
  };
}
