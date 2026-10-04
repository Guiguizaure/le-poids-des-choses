// Contrat des illustrations de public/illustrations (voir docs/svg-conventions.md).
// Chaque fichier doit avoir exactement cette taille et contenir ces calques (id → data-part).
// scripts/build-illustrations.ts échoue si un fichier manque, est en trop ou ne respecte pas
// sa spécification : on peut redessiner librement tant que tailles et noms sont gardés.

export type Point = { x: number; y: number };

export type IllustrationSpec = {
  width: number;
  height: number;
  /** Calques indispensables (animations, couleurs pilotées par le code). */
  parts: readonly string[];
  /** Point d'appui, en coordonnées du SVG (pied d'une plante, pivot de la balance…). */
  anchor?: Point;
};

const TREE_FOOT = { x: 60, y: 156 };
const FLOWER_FOOT = { x: 30, y: 78 };

const treeShoot = {
  width: 120,
  height: 160,
  anchor: TREE_FOOT,
  parts: ["tige", "feuilles"],
} as const;
const tree = {
  width: 120,
  height: 160,
  anchor: TREE_FOOT,
  parts: ["tronc", "feuillage"],
} as const;
const flower = (parts: readonly string[]) =>
  ({ width: 60, height: 80, anchor: FLOWER_FOOT, parts }) as const;
const bird = {
  width: 64,
  height: 48,
  parts: ["queue", "corps", "tete", "bec", "oeil", "aile", "pattes"],
} as const;
const picto = { width: 64, height: 64, parts: ["fond", "objet"] } as const;

export const ILLUSTRATION_SPECS = {
  "scene-paysage": {
    width: 390,
    height: 300,
    parts: [
      "ciel",
      "soleil",
      "nuage-1",
      "nuage-2",
      "colline-arriere",
      "colline-avant",
      "sol",
    ],
  },
  balance: {
    width: 280,
    height: 170,
    // Pivot du fléau ; les plateaux sont accrochés aux extrémités du fléau (40,40 et 240,40).
    anchor: { x: 140, y: 40 },
    parts: ["socle", "mat", "fleau", "plateau-gauche", "plateau-droit"],
  },

  "arbre-1-pousse": treeShoot,
  "arbre-1-jeune": tree,
  "arbre-1-grand": tree,
  "arbre-2-pousse": treeShoot,
  "arbre-2-jeune": tree,
  "arbre-2-grand": tree,
  "arbre-3-pousse": treeShoot,
  "arbre-3-jeune": tree,
  "arbre-3-grand": tree,

  "fleur-1-pousse": flower(["tige", "feuilles"]),
  "fleur-1-fleurie": flower(["tige", "feuilles", "petales", "coeur"]),
  "fleur-2-pousse": flower(["tige", "feuilles"]),
  "fleur-2-fleurie": flower(["tige", "feuilles", "petales"]),
  "fleur-3-pousse": flower(["brins"]),
  "fleur-3-fleurie": flower(["brins", "baies"]),

  oiseau: bird,
  "oiseau-endormi": bird,
  // Le corps est l'axe de battement des ailes (x = 32).
  papillon: {
    width: 64,
    height: 48,
    anchor: { x: 32, y: 26 },
    parts: ["aile-gauche", "aile-droite", "corps"],
  },

  brume: { width: 390, height: 120, parts: ["brume-1", "brume-2", "brume-3"] },
  // Les traits rayonnent depuis ce point.
  eclat: {
    width: 80,
    height: 80,
    anchor: { x: 40, y: 50 },
    parts: ["eclat-traits"],
  },

  "picto-avion": picto,
  "picto-bus": picto,
  "picto-chaussures": picto,
  "picto-garder": picto,
  "picto-generique": picto,
  "picto-jean": picto,
  "picto-marche": picto,
  "picto-metro": picto,
  "picto-occasion": picto,
  "picto-ordinateur": picto,
  "picto-pull": picto,
  "picto-repas-boeuf": picto,
  "picto-repas-poisson": picto,
  "picto-repas-poulet": picto,
  "picto-repas-vegetalien": picto,
  "picto-repas-vegetarien": picto,
  "picto-smartphone": picto,
  "picto-streaming": picto,
  "picto-television": picto,
  "picto-ter": picto,
  "picto-tgv": picto,
  "picto-tshirt": picto,
  "picto-velo": picto,
  "picto-visio": picto,
  "picto-voiture": picto,
} as const satisfies Record<string, IllustrationSpec>;

export type IllustrationName = keyof typeof ILLUSTRATION_SPECS;

export const ILLUSTRATION_NAMES = Object.keys(
  ILLUSTRATION_SPECS,
) as IllustrationName[];

export function getSpec(name: IllustrationName): IllustrationSpec {
  return ILLUSTRATION_SPECS[name];
}

/** Point d'appui exprimé en pourcentage du cadre, pour un transform-origin CSS. */
export function anchorAsCssOrigin(name: IllustrationName): string {
  const spec = getSpec(name);
  const anchor = spec.anchor ?? { x: spec.width / 2, y: spec.height / 2 };
  const pct = (value: number) => `${Math.round(value * 1000) / 10}%`;
  return `${pct(anchor.x / spec.width)} ${pct(anchor.y / spec.height)}`;
}
