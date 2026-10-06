// Espèces du jardin : une ligne par espèce décrit ses dessins, son épanouissement et son
// comportement selon la saison. Préparé pour la V3 : une espèce choisie par la personne (sapin,
// cerisier…) n'aura qu'à ajouter ses dessins (specs.ts) et sa ligne ici, avec
// `randomPool: false` — le tirage au hasard des plantes existantes ne doit jamais changer,
// sinon les jardins déjà là changeraient d'aspect.
import type { IllustrationName } from "@/lib/illustrations/specs";
import { PALETTE } from "./skies";
import type { Season } from "./seasons";
import type { BloomLevel } from "./watering";

export type PlantType = "tree" | "flower";
export type PlantVariant = 1 | 2 | 3;
export type PlantKind = { type: PlantType; variant: PlantVariant };
export type PlantStage = "pousse" | "jeune" | "grand" | "fleurie";

/** Couleur du feuillage pour une saison (trait en unités du dessin). */
export type FoliagePaint = {
  fill: string;
  stroke?: string;
  strokeWidth?: number;
};

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
  /** Calques du feuillage recolorés selon la saison. */
  foliageLayers: readonly string[];
  /** Caduc : le feuillage change avec les saisons ; persistant : il reste tel que dessiné. */
  leaves: "caduc" | "persistant";
  /** Couleur du feuillage par saison ; null : couleur du dessin. */
  foliage: Record<Season, FoliagePaint | null>;
  /**
   * L'épanouissement « dort » l'hiver : le niveau atteint est gardé, mais aucun groupe n'est
   * affiché de décembre à février ; il réapparaît au printemps.
   */
  bloomRestsInWinter: boolean;
};

const BLOOM_GROUPS = ["epanoui-1", "epanoui-2", "epanoui-3"] as const;

/** Hiver d'un caduc : ramure sous la neige, blanche cernée d'encre (comme la neige au sol). */
const SNOWY: FoliagePaint = {
  fill: PALETTE.blanc,
  stroke: PALETTE.encre,
  // 2,4 unités d'un cadre de 120 dessiné sur 60 unités de scène : 1,2, comme la neige.
  strokeWidth: 2.4,
};

const deciduous = {
  leaves: "caduc",
  foliage: {
    printemps: null,
    ete: null,
    automne: { fill: PALETTE.tomate },
    hiver: SNOWY,
  },
  bloomRestsInWinter: true,
} as const;

const evergreen = {
  leaves: "persistant",
  foliage: { printemps: null, ete: null, automne: null, hiver: null },
  bloomRestsInWinter: false,
} as const;

function tree(
  variant: PlantVariant,
  habit: typeof deciduous | typeof evergreen,
): Species {
  return {
    id: `arbre-${variant}`,
    kind: { type: "tree", variant },
    randomPool: true,
    stages: ["pousse", "jeune", "grand"],
    bloom: {
      illustration: `arbre-${variant}-grand-epanoui` as IllustrationName,
      groups: BLOOM_GROUPS,
    },
    foliageLayers: ["feuillage"],
    ...habit,
  };
}

function flower(
  variant: PlantVariant,
  foliageLayers: readonly string[],
): Species {
  return {
    id: `fleur-${variant}`,
    kind: { type: "flower", variant },
    randomPool: true,
    stages: ["pousse", "fleurie"],
    bloom: {
      illustration: `fleur-${variant}-fleurie-epanoui` as IllustrationName,
      groups: BLOOM_GROUPS,
    },
    foliageLayers,
    ...evergreen,
  };
}

export const SPECIES: readonly Species[] = [
  tree(1, deciduous),
  // Élancé, comme un cyprès : persistant.
  tree(2, evergreen),
  tree(3, deciduous),
  flower(1, ["feuilles"]),
  flower(2, ["feuilles"]),
  flower(3, ["brins"]),
];

export function speciesFor(kind: PlantKind): Species {
  const species = SPECIES.find(
    (s) => s.kind.type === kind.type && s.kind.variant === kind.variant,
  );
  if (!species)
    throw new Error(`Espèce inconnue : ${kind.type} ${kind.variant}`);
  return species;
}

/** Couleur du feuillage d'une espèce pour la saison (null : celle du dessin). */
export function foliageFor(
  kind: PlantKind,
  season: Season | null,
): FoliagePaint | null {
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
  /** Couleur du feuillage à poser sur les calques `layers` (null : celle du dessin). */
  paint: (FoliagePaint & { layers: readonly string[] }) | null;
  bloom: {
    illustration: IllustrationName;
    groups: readonly string[];
    /** Niveau affiché (0 : aucun groupe). */
    level: BloomLevel;
  };
};

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
