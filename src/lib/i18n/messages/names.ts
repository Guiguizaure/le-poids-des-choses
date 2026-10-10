// Noms traduits : gestes, produits de saison et leurs catégories, catégories de gestes,
// animaux, visiteurs, ciels, saisons, mois. Les valeurs (kg CO2e) ne changent jamais : seuls
// les noms passent par ces tables. En français, les noms des gestes et des produits viennent
// des données (CSV Impact CO2, API) ; l'anglais doit couvrir chacun d'eux (test et garde-fou
// du build, scripts/check-data.ts).
import type { Category } from "@/lib/data/types";
import type { AnimalKind } from "@/lib/garden/model";
import type { Season } from "@/lib/garden/seasons";
import type { SkyId } from "@/lib/garden/skies";
import type { VisitorKind } from "@/lib/garden/visitors";
import { defineMessages } from "../index";

/** Nom anglais d'un geste (id du catalogue) et sa précision éventuelle. */
export const GESTURE_NAMES_EN: Record<
  string,
  { label: string; detail?: string }
> = {
  tgv: { label: "TGV", detail: "high-speed train" },
  ter: { label: "TER", detail: "regional train" },
  avion: { label: "Plane", detail: "short-haul flight" },
  voiture: { label: "Petrol or diesel car" },
  bus: { label: "Bus" },
  metro: { label: "Metro" },
  velo: { label: "Bike" },
  marche: { label: "Walking" },
  "repas-vegetarien": { label: "Vegetarian meal" },
  "repas-vegetalien": { label: "Plant-based meal" },
  "repas-poulet": { label: "Chicken meal" },
  "repas-boeuf": { label: "Beef meal" },
  "repas-poisson": { label: "White fish meal (cod)" },
  jean: { label: "Jeans" },
  tshirt: { label: "Cotton T-shirt" },
  pull: { label: "Wool jumper" },
  chaussures: { label: "Trainers" },
  smartphone: { label: "Smartphone" },
  "ordinateur-portable": { label: "Laptop" },
  television: { label: "Television" },
  "eau-robinet": { label: "Tap water" },
  "eau-bouteille": { label: "Bottled water" },
  cafe: { label: "Coffee" },
  the: { label: "Tea" },
  soda: { label: "Fizzy drink" },
  biere: { label: "Beer" },
  vin: { label: "Wine" },
  "lait-vache": { label: "Cow’s milk" },
  "boisson-soja": { label: "Soya drink" },
  "livraison-domicile": { label: "Home delivery", detail: "1 kg parcel" },
  "point-relais-pied": {
    label: "Pickup point on foot",
    detail: "1 kg parcel",
  },
  "point-relais-voiture": {
    label: "Pickup point by car",
    detail: "3.5 km by car, 1 kg parcel",
  },
  "magasin-pied": { label: "In store, on foot", detail: "1 kg parcel" },
  "magasin-voiture": {
    label: "In store, by car",
    detail: "15 km by car, 1 kg parcel",
  },
  "voiture-electrique": { label: "Electric car" },
  "voiture-hybride": { label: "Hybrid car" },
  covoiturage: {
    label: "Car-sharing, 2 people",
    detail: "petrol or diesel car, per person",
  },
  autocar: { label: "Coach" },
  intercites: { label: "Intercités", detail: "intercity train" },
  rer: { label: "RER or Transilien", detail: "Paris suburban train" },
  tram: { label: "Tram" },
  moto: { label: "Motorbike", detail: "over 250 cc" },
  scooter: { label: "Scooter", detail: "petrol" },
  trottinette: { label: "Electric scooter", detail: "kick scooter" },
  "velo-electrique": { label: "E-bike" },
  "velo-cargo": { label: "Cargo bike", detail: "electric tricycle" },
  manteau: { label: "Coat" },
  robe: { label: "Cotton dress" },
  chemise: { label: "Cotton shirt" },
  sweat: { label: "Cotton sweatshirt" },
  tablette: { label: "Tablet" },
  ecran: { label: "Computer screen" },
  "box-internet": { label: "Internet box", detail: "home router" },
  "casque-vr": { label: "VR headset" },
  "lave-linge": { label: "Washing machine" },
  refrigerateur: { label: "Fridge" },
  "lave-vaisselle": { label: "Dishwasher" },
  "micro-ondes": { label: "Microwave" },
  four: { label: "Electric oven" },
  aspirateur: { label: "Vacuum cleaner" },
  canape: { label: "Fabric sofa" },
  lit: { label: "Bed" },
  table: { label: "Wooden table" },
  chaise: { label: "Wooden chair" },
  armoire: { label: "Wardrobe" },
};

/** Nom anglais d'un produit de saison (slug de l'API Impact CO2). */
export const PRODUCT_NAMES_EN: Record<string, string> = {
  abricot: "Apricot",
  ail: "Garlic",
  ananas: "Pineapple",
  artichaut: "Artichoke",
  asperge: "Asparagus",
  aubergine: "Aubergine",
  avocat: "Avocado",
  banane: "Banana",
  betterave: "Beetroot",
  blette: "Chard",
  brocoli: "Broccoli",
  carambole: "Star fruit",
  carotte: "Carrot",
  cassis: "Blackcurrant",
  celeri: "Celery",
  cerise: "Cherry",
  champignonmorille: "Mushroom (raw morel)",
  chataigne: "Chestnut",
  chou: "Cabbage",
  choudebruxelles: "Brussels sprout",
  choufleur: "Cauliflower",
  citron: "Lemon",
  clementine: "Clementine",
  coing: "Quince",
  concombre: "Cucumber",
  courge: "Squash",
  courgette: "Courgette",
  cresson: "Watercress",
  datte: "Date",
  echalote: "Shallot",
  endive: "Chicory",
  epinard: "Spinach",
  fenouil: "Fennel",
  figue: "Fig",
  fraise: "Strawberry",
  framboise: "Raspberry",
  fruitdelapassion: "Passion fruit",
  grenade: "Pomegranate",
  groseille: "Redcurrant",
  haricotvert: "Green bean (raw)",
  kaki: "Persimmon",
  kiwi: "Kiwi",
  laitue: "Lettuce",
  mache: "Lamb’s lettuce",
  mais: "Sweetcorn",
  mandarine: "Mandarin",
  mangue: "Mango (imported by air)",
  manguebateau: "Mango (imported by sea)",
  melon: "Melon",
  mure: "Blackberry",
  myrtille: "Blueberry",
  navet: "Turnip",
  nectarine: "Nectarine",
  noisette: "Hazelnut",
  noix: "Walnut",
  noixdecoco: "Coconut",
  oignon: "Onion",
  orange: "Orange",
  pamplemousse: "Grapefruit",
  panais: "Parsnip",
  pasteque: "Watermelon",
  peche: "Peach",
  petitpois: "Pea",
  poire: "Pear",
  poireau: "Leek",
  poivron: "Pepper",
  pomme: "Apple",
  potiron: "Pumpkin",
  prune: "Plum",
  radis: "Radish",
  raisin: "Grape",
  reineclaude: "Greengage",
  rhubarbe: "Rhubarb",
  salsifis: "Salsify",
  tomate: "Tomato",
  topinambour: "Jerusalem artichoke",
};

/** Catégories de l'API « Fruits et légumes de saison » (nom exact de l'API → intitulé). */
export const PRODUCT_CATEGORIES = defineMessages<Record<string, string>>(
  {
    fruits: "Fruits",
    légumes: "Légumes",
    herbes: "Herbes",
    "pâtes, riz et céréales": "Pâtes, riz et céréales",
    "pommes de terre et autres tubercules":
      "Pommes de terre et autres tubercules",
    "fruits à coque et graines oléagineuses":
      "Fruits à coque et graines oléagineuses",
  },
  {
    fruits: "Fruit",
    légumes: "Vegetables",
    herbes: "Herbs",
    "pâtes, riz et céréales": "Pasta, rice and cereals",
    "pommes de terre et autres tubercules": "Potatoes and other tubers",
    "fruits à coque et graines oléagineuses": "Nuts and oilseeds",
  },
);

export const CATEGORY_NAMES = defineMessages<Record<Category, string>>(
  {
    transport: "Se déplacer",
    alimentation: "Manger",
    habillement: "S’habiller",
    numerique: "Numérique",
    boisson: "Boire",
    livraison: "Se faire livrer",
    maison: "Équiper la maison",
  },
  {
    transport: "Getting around",
    alimentation: "Eating",
    habillement: "Clothes",
    numerique: "Digital",
    boisson: "Drinking",
    livraison: "Deliveries",
    maison: "Furnish your home",
  },
);

/** Animaux du jardin : nom, et en français genre et « du / de la ». */
export type AnimalName = {
  name: string;
  /** Avec l'article indéfini : « une coccinelle », « a ladybird ». */
  indefinite: string;
  /** « du papillon », « de l’oiseau » (français) ; « the butterfly » (anglais). */
  of: string;
  feminine: boolean;
};

export const ANIMAL_NAMES = defineMessages<Record<AnimalKind, AnimalName>>(
  {
    butterfly: {
      name: "papillon",
      indefinite: "un papillon",
      of: "du papillon",
      feminine: false,
    },
    ladybug: {
      name: "coccinelle",
      indefinite: "une coccinelle",
      of: "de la coccinelle",
      feminine: true,
    },
    bird: {
      name: "oiseau",
      indefinite: "un oiseau",
      of: "de l’oiseau",
      feminine: false,
    },
    snail: {
      name: "escargot",
      indefinite: "un escargot",
      of: "de l’escargot",
      feminine: false,
    },
    bee: {
      name: "abeille",
      indefinite: "une abeille",
      of: "de l’abeille",
      feminine: true,
    },
    // h aspiré : « du hérisson »
    hedgehog: {
      name: "hérisson",
      indefinite: "un hérisson",
      of: "du hérisson",
      feminine: false,
    },
  },
  {
    butterfly: {
      name: "butterfly",
      indefinite: "a butterfly",
      of: "the butterfly",
      feminine: false,
    },
    ladybug: {
      name: "ladybird",
      indefinite: "a ladybird",
      of: "the ladybird",
      feminine: false,
    },
    bird: {
      name: "bird",
      indefinite: "a bird",
      of: "the bird",
      feminine: false,
    },
    snail: {
      name: "snail",
      indefinite: "a snail",
      of: "the snail",
      feminine: false,
    },
    bee: { name: "bee", indefinite: "a bee", of: "the bee", feminine: false },
    hedgehog: {
      name: "hedgehog",
      indefinite: "a hedgehog",
      of: "the hedgehog",
      feminine: false,
    },
  },
);

/** Visiteurs du jardin vivant, avec leur article (« un rouge-gorge », « a robin »). */
export const VISITOR_NAMES = defineMessages<Record<VisitorKind, string>>(
  {
    "rouge-gorge": "un rouge-gorge",
    "perce-neige": "des perce-neige",
    houx: "du houx",
    hirondelle: "une hirondelle",
    primevere: "des primevères",
    jonquille: "une jonquille",
    cigale: "une cigale",
    libellule: "une libellule",
    coquelicot: "un coquelicot",
    tournesol: "un tournesol",
    ecureuil: "un écureuil",
    champignons: "des champignons",
    hibou: "un hibou",
    renard: "un renard",
  },
  {
    "rouge-gorge": "a robin",
    "perce-neige": "snowdrops",
    houx: "holly",
    hirondelle: "a swallow",
    primevere: "primroses",
    jonquille: "a daffodil",
    cigale: "a cicada",
    libellule: "a dragonfly",
    coquelicot: "a poppy",
    tournesol: "a sunflower",
    ecureuil: "a squirrel",
    champignons: "mushrooms",
    hibou: "an owl",
    renard: "a fox",
  },
);

export const SKY_NAMES = defineMessages<Record<SkyId, string>>(
  { jour: "Jour", aube: "Aube rose", midi: "Midi soleil", nuit: "Nuit encre" },
  { jour: "Day", aube: "Pink dawn", midi: "Midday sun", nuit: "Ink night" },
);

/** « au printemps », « en été »… / « in spring »… */
export const IN_SEASON = defineMessages<Record<Season, string>>(
  {
    printemps: "au printemps",
    ete: "en été",
    automne: "en automne",
    hiver: "en hiver",
  },
  {
    printemps: "in spring",
    ete: "in summer",
    automne: "in autumn",
    hiver: "in winter",
  },
);

/** Mois, en minuscules en français (« en octobre »), avec majuscule en anglais. */
export const MONTHS = defineMessages<readonly string[]>(
  [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ],
  [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
);
