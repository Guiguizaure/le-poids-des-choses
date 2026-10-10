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
// Épanouissement : posé par-dessus la plante adulte, même cadre et même pied. Trois groupes
// exclusifs (un seul affiché, celui du niveau atteint).
const BLOOM_PARTS = ["epanoui-1", "epanoui-2", "epanoui-3"] as const;
const treeBloom = { ...tree, parts: BLOOM_PARTS } as const;
const flowerBloom = flower(BLOOM_PARTS);
// Particules de saison (feuilles d'automne, pétales de printemps) qui tombent sur la scène.
const particle = (parts: readonly string[]) =>
  ({ width: 16, height: 16, parts }) as const;
const bird = {
  width: 64,
  height: 48,
  parts: ["queue", "corps", "tete", "bec", "oeil", "aile", "pattes"],
} as const;
// Petites bêtes du jardin : point d'appui au centre du bas (là où elles se posent).
const critter = (parts: readonly string[]) =>
  ({ width: 64, height: 48, anchor: { x: 32, y: 48 }, parts }) as const;
// Hibou : point d'appui au centre du bas (là où il se perche).
const owl = {
  width: 48,
  height: 56,
  anchor: { x: 24, y: 56 },
  parts: ["corps", "aigrettes", "ventre", "ailes", "yeux", "bec", "pattes"],
} as const;
const picto = { width: 64, height: 64, parts: ["fond", "objet"] } as const;
const produce = (parts: readonly string[]) =>
  ({ width: 80, height: 80, parts }) as const;

export const ILLUSTRATION_SPECS = {
  "scene-paysage": {
    width: 390,
    height: 300,
    parts: [
      "ciel",
      // Anneau couleur soleil derrière le disque, invisible par défaut (animé par Landscape).
      "halo-soleil",
      "soleil",
      // Dans le groupe soleil : cratères de la lune, invisibles le jour (opacité 0).
      "crateres",
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
  // Espèces à débloquer : olivier, sapin, figuier ; marguerite, lavande, pissenlit.
  "arbre-4-pousse": treeShoot,
  "arbre-4-jeune": tree,
  "arbre-4-grand": tree,
  "arbre-5-pousse": treeShoot,
  "arbre-5-jeune": tree,
  "arbre-5-grand": tree,
  "arbre-6-pousse": treeShoot,
  "arbre-6-jeune": tree,
  "arbre-6-grand": tree,
  "fleur-4-pousse": flower(["tige", "feuilles"]),
  "fleur-4-fleurie": flower(["tige", "feuilles", "petales", "coeur"]),
  "fleur-5-pousse": flower(["feuilles"]),
  "fleur-5-fleurie": flower(["tige", "feuilles", "petales"]),
  "fleur-6-pousse": flower(["feuilles"]),
  "fleur-6-fleurie": flower(["tige", "feuilles", "petales", "coeur"]),

  "arbre-1-grand-epanoui": treeBloom,
  "arbre-2-grand-epanoui": treeBloom,
  "arbre-3-grand-epanoui": treeBloom,
  "fleur-1-fleurie-epanoui": flowerBloom,
  "fleur-2-fleurie-epanoui": flowerBloom,
  "fleur-3-fleurie-epanoui": flowerBloom,
  "arbre-4-grand-epanoui": treeBloom,
  "arbre-5-grand-epanoui": treeBloom,
  "arbre-6-grand-epanoui": treeBloom,
  "fleur-4-fleurie-epanoui": flowerBloom,
  "fleur-5-fleurie-epanoui": flowerBloom,
  "fleur-6-fleurie-epanoui": flowerBloom,

  // Visiteurs de saison et de la nuit (jardin vivant) : ils ne se débloquent pas.
  "rouge-gorge": critter([
    "queue",
    "corps",
    "poitrail",
    "tete",
    "bec",
    "oeil",
    "pattes",
  ]),
  "rouge-gorge-endormi": critter([
    "queue",
    "corps",
    "poitrail",
    "tete",
    "bec",
    "oeil",
    "pattes",
  ]),
  // Comme oiseau-vol : les deux ailes battent en décalé.
  hirondelle: {
    width: 64,
    height: 48,
    anchor: { x: 32, y: 24 },
    parts: [
      "aile-arriere",
      "queue",
      "corps",
      "ventre",
      "gorge",
      "oeil",
      "aile-avant",
    ],
  },
  cigale: critter(["ailes", "corps", "tete", "pattes"]),
  libellule: {
    width: 64,
    height: 48,
    anchor: { x: 32, y: 24 },
    parts: ["ailes-arriere", "ailes-avant", "corps", "tete"],
  },
  ecureuil: critter([
    "queue",
    "corps",
    "ventre",
    "tete",
    "oeil",
    "noisette",
    "pattes",
  ]),
  renard: critter(["queue", "corps", "pattes", "tete", "oeil"]),
  // Roulé en boule : pas de pattes visibles.
  "renard-endormi": critter(["corps", "queue", "tete", "oeil"]),
  hibou: owl,
  "hibou-endormi": owl,
  "perce-neige": flower(["feuilles", "tige", "clochette"]),
  houx: flower(["feuilles", "baies"]),
  primevere: flower(["feuilles", "tiges", "fleurs"]),
  jonquille: flower(["feuilles", "tige", "petales", "coeur"]),
  coquelicot: flower(["tige", "feuille", "petales", "coeur"]),
  tournesol: flower(["tige", "feuilles", "petales", "coeur"]),
  champignons: flower(["pieds", "chapeaux", "points"]),
  // Nuit : étoiles (calque de ciel, même cadre que la scène). La lune est fournie mais pas
  // utilisée : la nuit, c'est le soleil de la scène qui devient lune (cratères).
  etoiles: { width: 390, height: 300, parts: ["etoiles"] },
  lune: { width: 64, height: 64, parts: ["lune", "cratere"] },

  // Saisons du jardin : neige posée sur les collines et le haut du sol, flocons par-dessus
  // la scène (même cadre que scene-paysage) ; feuilles et pétales qui tombent.
  "saison-hiver-neige": {
    width: 390,
    height: 300,
    parts: ["neige-colline-arriere", "neige-colline-avant", "neige-sol"],
  },
  "saison-hiver-flocons": { width: 390, height: 300, parts: ["flocons"] },
  "saison-automne-feuille-1": particle(["feuille", "nervure"]),
  "saison-automne-feuille-2": particle(["feuille", "nervure"]),
  "saison-printemps-petale": particle(["petale"]),

  oiseau: bird,
  "oiseau-endormi": bird,
  // En vol (V1.1) : mêmes cadre et calques de tête que oiseau.svg ; les deux ailes battent en
  // scaleY autour de l'épaule (28, 30), en décalé.
  "oiseau-vol": {
    width: 64,
    height: 48,
    parts: [
      "aile-arriere",
      "queue",
      "corps",
      "tete",
      "bec",
      "oeil",
      "aile-avant",
    ],
  },
  // Le corps est l'axe de battement des ailes (x = 32).
  papillon: {
    width: 64,
    height: 48,
    anchor: { x: 32, y: 26 },
    parts: ["aile-gauche", "aile-droite", "corps"],
  },

  abeille: critter([
    "aile-gauche",
    "aile-droite",
    "corps",
    "rayures",
    "tete",
    "oeil",
    "dard",
  ]),
  coccinelle: {
    width: 48,
    height: 40,
    anchor: { x: 24, y: 40 },
    parts: ["corps", "tete", "pattes", "elytre-gauche", "elytre-droite"],
  },
  escargot: critter(["corps", "antennes", "coquille"]),
  "escargot-endormi": critter(["corps", "coquille"]),
  herisson: critter(["corps", "piquants", "museau", "oeil", "pattes"]),
  "herisson-endormi": critter(["piquants", "museau"]),

  brume: { width: 390, height: 120, parts: ["brume-1", "brume-2", "brume-3"] },
  // Traits de vent : ils traversent la scène de gauche à droite (coup de vent).
  vent: {
    width: 390,
    height: 120,
    parts: ["traits-1", "traits-2", "traits-3"],
  },
  // Les traits rayonnent depuis ce point.
  eclat: {
    width: 80,
    height: 80,
    anchor: { x: 40, y: 50 },
    parts: ["eclat-traits"],
  },

  // Arrosage ciblé (« Mes habitudes ») : l'arrosoir penche au-dessus de la plante arrosée, les
  // gouttes tombent l'une après l'autre ; pastille de la section ; picto de l'indice.
  arrosage: {
    width: 80,
    height: 80,
    parts: [
      "arrosoir",
      "gouttes",
      "goutte-1",
      "goutte-2",
      "goutte-3",
      "goutte-4",
      "goutte-5",
    ],
  },
  "badge-arrosage": { width: 24, height: 24, parts: ["fond", "objet"] },
  "picto-arrosoir": picto,
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
  // Boire et Se faire livrer (lot 5b)
  "picto-eau-robinet": picto,
  "picto-eau-bouteille": picto,
  "picto-cafe": picto,
  "picto-the": picto,
  "picto-soda": picto,
  "picto-biere": picto,
  "picto-vin": picto,
  "picto-lait-vache": picto,
  "picto-boisson-soja": picto,
  "picto-livraison-domicile": picto,
  "picto-point-relais-pied": picto,
  "picto-point-relais-voiture": picto,
  "picto-magasin-pied": picto,
  "picto-magasin-voiture": picto,
  // Lot « Comparer plus » : nouveaux gestes (même cadre, mêmes calques).
  "picto-voiture-electrique": picto,
  "picto-voiture-hybride": picto,
  "picto-covoiturage": picto,
  "picto-autocar": picto,
  "picto-intercites": picto,
  "picto-rer": picto,
  "picto-tram": picto,
  "picto-moto": picto,
  "picto-scooter": picto,
  "picto-trottinette": picto,
  "picto-velo-electrique": picto,
  "picto-velo-cargo": picto,
  "picto-manteau": picto,
  "picto-robe": picto,
  "picto-chemise": picto,
  "picto-sweat": picto,
  "picto-tablette": picto,
  "picto-ecran": picto,
  "picto-box-internet": picto,
  "picto-casque-vr": picto,
  "picto-lave-linge": picto,
  "picto-refrigerateur": picto,
  "picto-lave-vaisselle": picto,
  "picto-micro-ondes": picto,
  "picto-four": picto,
  "picto-aspirateur": picto,
  "picto-canape": picto,
  "picto-lit": picto,
  "picto-table": picto,
  "picto-chaise": picto,
  "picto-armoire": picto,

  // Fruits et légumes flottants de l'encart de saison (décoratifs, sans cagette).
  "saison-pomme": produce(["fruit", "queue", "feuille", "reflet"]),
  "saison-poire": produce(["fruit", "queue", "feuille", "tache"]),
  "saison-carotte": produce(["fanes", "racine", "stries"]),
  "saison-courge": produce(["fruit", "cotes", "queue"]),
  "saison-raisin": produce(["feuille", "tige", "grains", "reflets"]),
  "saison-poireau": produce(["feuilles", "fut", "racines"]),
  "saison-tomate": produce(["fruit", "collerette", "reflet"]),
  "saison-fraise": produce(["fruit", "graines", "collerette"]),
  "saison-cerise": produce(["queues", "feuille", "fruits", "reflets"]),
  "saison-abricot": produce(["fruit", "joue", "sillon", "feuille"]),
  "saison-courgette": produce(["legume", "stries", "pedoncule"]),
  "saison-aubergine": produce(["legume", "calice", "queue", "reflet"]),
  "saison-melon": produce(["ecorce", "chair", "graines", "bord"]),
  "saison-radis": produce(["fanes", "racine", "pointe"]),
  "saison-asperge": produce(["tiges", "pointes", "ecailles", "lien"]),
  "saison-petits-pois": produce(["cosse", "pois", "queue"]),
  "saison-chou": produce(["feuilles-ext", "coeur", "nervures"]),
  "saison-clementine": produce(["fruit", "pores", "feuilles"]),
  "saison-kiwi": produce(["peau", "chair", "coeur", "pepins"]),
  "saison-endive": produce(["feuilles", "pointes", "lignes"]),
  "saison-betterave": produce(["fanes", "racine"]),
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

/**
 * Pictos À FOURNIR (64×64, groupes `fond` et `objet`) pour des gestes déjà proposés : en
 * attendant, `picto-generique` s'affiche. Quand un fichier arrive, l'ajouter au contrat
 * ci-dessus et le retirer de cette liste (un test le vérifie). Voir
 * docs/illustrations-a-fournir.md.
 */
export const PENDING_PICTOS: readonly string[] = [];
