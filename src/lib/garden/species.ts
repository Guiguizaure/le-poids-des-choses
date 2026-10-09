// Espèces du jardin : une ligne par espèce décrit ses dessins, son épanouissement et son
// comportement selon la saison. Les six espèces d'origine forment le tirage au hasard
// (`randomPool`) : il ne doit jamais changer, sinon les jardins déjà là changeraient d'aspect.
// Les six suivantes se débloquent au fil du jardin (SPECIES_UNLOCKS) et se choisissent à la
// plantation ; le choix est gardé dans l'entrée du carnet (`species`). Noms et fiches :
// src/lib/i18n/messages/species.ts.
import type { IllustrationName } from "@/lib/illustrations/specs";
import { AUTUMN, WINTER, type SeasonalFoliage } from "./foliage";
import type { Season } from "./seasons";
import type { BloomLevel } from "./watering";

export type PlantType = "tree" | "flower";
export type PlantVariant = 1 | 2 | 3 | 4 | 5 | 6;
export type PlantKind = { type: PlantType; variant: PlantVariant };
export type PlantStage = "pousse" | "jeune" | "grand" | "fleurie";

export type Species = {
  /** Préfixe des fichiers d'illustration : « arbre-1 » → arbre-1-grand.svg. */
  id: string;
  kind: PlantKind;
  /** Fait partie du tirage au hasard (les six espèces d'origine, dans cet ordre). */
  randomPool: boolean;
  /** Stades, du plus petit au plus grand (le dernier est l'âge adulte). */
  stages: readonly PlantStage[];
  /** Épanouissement : dessin posé sur la plante adulte, un groupe par niveau (exclusifs). */
  bloom: {
    illustration: IllustrationName;
    groups: readonly [string, string, string];
  };
  /** Calques du feuillage (selon le stade : « feuilles » de la pousse, « feuillage » ensuite). */
  foliageLayers: readonly string[];
  /** Caduc : le feuillage change avec les saisons ; persistant : il reste tel que dessiné. */
  leaves: "caduc" | "persistant";
  /**
   * Feuillage par saison (src/lib/garden/foliage.ts) : dégradé d'automne, arbre endormi
   * l'hiver ; null : le dessin tel quel.
   */
  foliage: Record<Season, SeasonalFoliage | null>;
  /**
   * L'épanouissement « dort » l'hiver : le niveau atteint est gardé, mais aucun groupe n'est
   * affiché de décembre à février ; il réapparaît au printemps.
   */
  bloomRestsInWinter: boolean;
  /**
   * Arbres adultes (stade « grand ») : où se perche le hibou (bas du feuillage, au-dessus du
   * tronc) et où s'accroche la cigale (milieu du tronc visible), en unités du dessin. Lus sur
   * le dessin (un test les recalcule depuis le SVG).
   */
  perches?: { owl: { x: number; y: number }; cicada: { x: number; y: number } };
};

const BLOOM_GROUPS = ["epanoui-1", "epanoui-2", "epanoui-3"] as const;

/** Caduc (pommier, cerisier, figuier) : dégradé d'automne, endormi l'hiver. */
const deciduous = (id: keyof typeof AUTUMN) =>
  ({
    leaves: "caduc",
    foliage: {
      printemps: null,
      ete: null,
      automne: AUTUMN[id],
      hiver: WINTER[id],
    },
    bloomRestsInWinter: true,
  }) as const;

const evergreen = {
  leaves: "persistant",
  foliage: { printemps: null, ete: null, automne: null, hiver: null },
  bloomRestsInWinter: false,
} as const;

function tree(
  variant: PlantVariant,
  habit: ReturnType<typeof deciduous> | typeof evergreen,
  perches: Species["perches"],
): Species {
  return {
    id: `arbre-${variant}`,
    kind: { type: "tree", variant },
    randomPool: variant <= 3,
    stages: ["pousse", "jeune", "grand"],
    bloom: {
      illustration: `arbre-${variant}-grand-epanoui` as IllustrationName,
      groups: BLOOM_GROUPS,
    },
    foliageLayers: ["feuilles", "feuillage"],
    ...habit,
    perches,
  };
}

/** Fleur des espèces à débloquer : son épanouissement dort l'hiver, comme celui des caducs. */
const restingFlower = {
  leaves: "persistant",
  foliage: { printemps: null, ete: null, automne: null, hiver: null },
  bloomRestsInWinter: true,
} as const;

function flower(
  variant: PlantVariant,
  foliageLayers: readonly string[],
  habit: typeof evergreen | typeof restingFlower = evergreen,
): Species {
  return {
    id: `fleur-${variant}`,
    kind: { type: "flower", variant },
    randomPool: variant <= 3,
    stages: ["pousse", "fleurie"],
    bloom: {
      illustration: `fleur-${variant}-fleurie-epanoui` as IllustrationName,
      groups: BLOOM_GROUPS,
    },
    foliageLayers,
    ...habit,
  };
}

export const SPECIES: readonly Species[] = [
  tree(1, deciduous("arbre-1"), {
    owl: { x: 60, y: 98 },
    cicada: { x: 60, y: 127 },
  }),
  // Élancé, comme un cyprès : persistant.
  tree(2, evergreen, { owl: { x: 60, y: 118 }, cicada: { x: 60, y: 137 } }),
  tree(3, deciduous("arbre-3"), {
    owl: { x: 60, y: 97.5 },
    cicada: { x: 60, y: 127 },
  }),
  flower(1, ["feuilles"]),
  flower(2, ["feuilles"]),
  flower(3, ["brins"]),
  // Espèces à débloquer. Olivier et sapin persistants, figuier caduc. Le sapin n'a pas de
  // perchoir : son tronc est caché sous les étages d'aiguilles.
  // Olivier et figuier adultes réduits autour du pied (0,81 et 0,85) : perchoirs relus.
  tree(4, evergreen, {
    owl: { x: 58.4, y: 108.5 },
    cicada: { x: 60.3, y: 132.5 },
  }),
  tree(5, evergreen, undefined),
  tree(6, deciduous("arbre-6"), {
    owl: { x: 60, y: 103.7 },
    cicada: { x: 60, y: 136.5 },
  }),
  flower(4, ["feuilles"], restingFlower),
  flower(5, ["feuilles"], restingFlower),
  flower(6, ["feuilles"], restingFlower),
];

export type SpeciesId = (typeof SPECIES)[number]["id"];

/** Espèces disponibles dès le départ : les six d'origine. */
export const STARTING_SPECIES: readonly string[] = SPECIES.filter(
  (species) => species.randomPool,
).map((species) => species.id);

/**
 * Déblocage : une nouvelle espèce tous les SPECIES_UNLOCK_STEP pas de croissance du jardin
 * (choix légers et jours arrosés, voir `growthSteps`), en alternant fleur et arbre. Jamais lié
 * aux kg ; jamais de régression (le carnet ne fait que s'allonger).
 */
export const SPECIES_UNLOCK_STEP = 3;
export const SPECIES_UNLOCKS: readonly { id: string; steps: number }[] = [
  "fleur-4", // marguerite
  "arbre-4", // olivier
  "fleur-5", // lavande
  "arbre-6", // figuier
  "fleur-6", // pissenlit
  "arbre-5", // sapin
].map((id, index) => ({ id, steps: (index + 1) * SPECIES_UNLOCK_STEP }));

/** Espèces disponibles après `steps` pas de croissance (d'origine, puis débloquées). */
export function unlockedSpecies(steps: number): string[] {
  return [
    ...STARTING_SPECIES,
    ...SPECIES_UNLOCKS.filter((unlock) => steps >= unlock.steps).map(
      (unlock) => unlock.id,
    ),
  ];
}

/** Prochaine espèce à débloquer et pas qui manquent (null : toutes disponibles). */
export function nextSpecies(
  steps: number,
): { id: string; remaining: number } | null {
  const next = SPECIES_UNLOCKS.find((unlock) => steps < unlock.steps);
  return next ? { id: next.id, remaining: next.steps - steps } : null;
}

export function speciesById(id: string): Species | undefined {
  return SPECIES.find((species) => species.id === id);
}

export function speciesFor(kind: PlantKind): Species {
  const species = SPECIES.find(
    (s) => s.kind.type === kind.type && s.kind.variant === kind.variant,
  );
  if (!species)
    throw new Error(`Espèce inconnue : ${kind.type} ${kind.variant}`);
  return species;
}

/** Feuillage d'une espèce pour la saison (null : le dessin tel quel). */
export function foliageFor(
  kind: PlantKind,
  season: Season | null,
): SeasonalFoliage | null {
  return season ? speciesFor(kind).foliage[season] : null;
}

/** Niveau d'épanouissement affiché : celui atteint, sauf l'hiver pour une espèce qui dort. */
export function visibleBloom(
  kind: PlantKind,
  bloom: BloomLevel,
  season: Season | null,
): BloomLevel {
  return season === "hiver" && speciesFor(kind).bloomRestsInWinter ? 0 : bloom;
}

export type PlantLook = {
  /** Feuillage de saison à poser sur les calques `layers` (null : le dessin tel quel). */
  paint: (SeasonalFoliage & { layers: readonly string[] }) | null;
  bloom: {
    illustration: IllustrationName;
    groups: readonly string[];
    /** Niveau affiché (0 : aucun groupe). */
    level: BloomLevel;
  };
};

/** Vrai si l'espèce dort à cette saison (caduc en hiver : sans feuilles, en attendant le printemps). */
export function isDormant(kind: PlantKind, season: Season | null): boolean {
  return foliageFor(kind, season)?.mode === "asleep";
}

/** Aspect d'une plante pour une saison : feuillage et épanouissement affiché. */
export function plantLook(
  plant: { kind: PlantKind; bloom: BloomLevel },
  season: Season | null,
): PlantLook {
  const species = speciesFor(plant.kind);
  const paint = foliageFor(plant.kind, season);
  return {
    paint: paint ? { ...paint, layers: species.foliageLayers } : null,
    bloom: {
      illustration: species.bloom.illustration,
      groups: species.bloom.groups,
      level: visibleBloom(plant.kind, plant.bloom, season),
    },
  };
}

export type SpeciesCard = {
  id: string;
  kind: PlantKind;
  /** Vrai si on peut la planter maintenant. */
  available: boolean;
  /** Pas de croissance qui manquent (0 si disponible). */
  remaining: number;
};

/**
 * Cartes du choix « Que veux-tu planter ? » : les espèces disponibles (d'origine, puis
 * débloquées dans l'ordre), puis celles à débloquer, grisées, avec ce qui leur manque.
 */
export function speciesCards(steps: number): SpeciesCard[] {
  const available = unlockedSpecies(steps);
  const card = (id: string): SpeciesCard => {
    const unlock = SPECIES_UNLOCKS.find((u) => u.id === id);
    return {
      id,
      kind: speciesById(id)!.kind,
      available: available.includes(id),
      remaining: unlock ? Math.max(0, unlock.steps - steps) : 0,
    };
  };
  return [
    ...available.map(card),
    ...SPECIES_UNLOCKS.filter((u) => !available.includes(u.id)).map((u) =>
      card(u.id),
    ),
  ];
}

/** Dessin adulte d'une espèce (carte du choix, fiche). */
export function adultIllustration(id: string): IllustrationName {
  const species = speciesById(id)!;
  return `${id}-${species.stages.at(-1)}` as IllustrationName;
}

/**
 * Arbres du jardin pour l'astuce du changement de saison : chaque espèce caduque avec son
 * nombre d'arbres, puis les espèces persistantes, dans l'ordre où elles ont été plantées.
 */
export function treesBySeasonHabit(plants: readonly { kind: PlantKind }[]): {
  deciduous: { id: string; count: number }[];
  evergreen: string[];
} {
  const deciduous: { id: string; count: number }[] = [];
  const evergreen: string[] = [];
  for (const plant of plants) {
    if (plant.kind.type !== "tree") continue;
    const species = speciesFor(plant.kind);
    if (species.leaves === "caduc") {
      const known = deciduous.find((tree) => tree.id === species.id);
      if (known) known.count++;
      else deciduous.push({ id: species.id, count: 1 });
    } else if (!evergreen.includes(species.id)) evergreen.push(species.id);
  }
  return { deciduous, evergreen };
}
