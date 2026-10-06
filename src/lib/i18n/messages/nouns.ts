// Noms des gestes dans les phrases (article, genre en français), et noms des objets.
import { defineMessages } from "../index";

export type Noun = {
  text: string;
  feminine: boolean;
  /** Bouton « Je choisis … » quand la forme générale sonne mal (« I’ll walk »). */
  choose?: string;
};

/** Gestes comparables (km, repas, litre, achat) : « le train », « la voiture »… */
export const GESTURE_NOUNS = defineMessages<Record<string, Noun>>(
  {
    tgv: { text: "le TGV", feminine: false },
    ter: { text: "le TER", feminine: false },
    avion: { text: "l’avion", feminine: false },
    voiture: { text: "la voiture", feminine: true },
    bus: { text: "le bus", feminine: false },
    metro: { text: "le métro", feminine: false },
    velo: { text: "le vélo", feminine: false },
    marche: { text: "la marche", feminine: true },
    "repas-vegetarien": { text: "le repas végétarien", feminine: false },
    "repas-vegetalien": { text: "le repas végétal", feminine: false },
    "repas-poulet": { text: "le repas au poulet", feminine: false },
    "repas-boeuf": { text: "le repas au bœuf", feminine: false },
    "repas-poisson": { text: "le repas au poisson", feminine: false },
    "eau-robinet": { text: "l’eau du robinet", feminine: true },
    "eau-bouteille": { text: "l’eau en bouteille", feminine: true },
    cafe: { text: "le café", feminine: false },
    the: { text: "le thé", feminine: false },
    soda: { text: "le soda", feminine: false },
    biere: { text: "la bière", feminine: true },
    vin: { text: "le vin", feminine: false },
    "lait-vache": { text: "le lait de vache", feminine: false },
    "boisson-soja": { text: "la boisson au soja", feminine: true },
    "livraison-domicile": { text: "la livraison à domicile", feminine: true },
    "point-relais-pied": { text: "le point relais à pied", feminine: false },
    "point-relais-voiture": {
      text: "le point relais en voiture",
      feminine: false,
    },
    "magasin-pied": { text: "l’achat en magasin à pied", feminine: false },
    "magasin-voiture": {
      text: "l’achat en magasin en voiture",
      feminine: false,
    },
  },
  {
    tgv: { text: "the TGV", feminine: false },
    ter: { text: "the TER", feminine: false },
    avion: { text: "the plane", feminine: false },
    voiture: { text: "the car", feminine: false },
    bus: { text: "the bus", feminine: false },
    metro: { text: "the metro", feminine: false },
    velo: { text: "the bike", feminine: false },
    marche: { text: "walking", feminine: false, choose: "I’ll walk" },
    "repas-vegetarien": { text: "the vegetarian meal", feminine: false },
    "repas-vegetalien": { text: "the plant-based meal", feminine: false },
    "repas-poulet": { text: "the chicken meal", feminine: false },
    "repas-boeuf": { text: "the beef meal", feminine: false },
    "repas-poisson": { text: "the fish meal", feminine: false },
    "eau-robinet": { text: "tap water", feminine: false },
    "eau-bouteille": { text: "bottled water", feminine: false },
    cafe: { text: "coffee", feminine: false },
    the: { text: "tea", feminine: false },
    soda: { text: "the fizzy drink", feminine: false },
    biere: { text: "beer", feminine: false },
    vin: { text: "wine", feminine: false },
    "lait-vache": { text: "cow’s milk", feminine: false },
    "boisson-soja": { text: "the soya drink", feminine: false },
    "livraison-domicile": { text: "home delivery", feminine: false },
    "point-relais-pied": {
      text: "the pickup point on foot",
      feminine: false,
    },
    "point-relais-voiture": {
      text: "the pickup point by car",
      feminine: false,
    },
    "magasin-pied": { text: "shopping in store on foot", feminine: false },
    "magasin-voiture": { text: "shopping in store by car", feminine: false },
  },
);

export type ObjectNoun = {
  /** « Un jean », « A pair of jeans » */
  indefinite: string;
  /** « d’un jean neuf » (Fabrication …), « a new pair of jeans » (Making …) */
  newOne: string;
  /** Nom en milieu de phrase (anglais : « jeans », « smartphone ») ; vide en français. */
  bare: string;
  feminine: boolean;
  plural: boolean;
};

export const OBJECT_NOUNS = defineMessages<Record<string, ObjectNoun>>(
  {
    jean: {
      indefinite: "Un jean",
      newOne: "d’un jean neuf",
      bare: "jean",
      feminine: false,
      plural: false,
    },
    tshirt: {
      indefinite: "Un t-shirt en coton",
      newOne: "d’un t-shirt neuf",
      bare: "t-shirt",
      feminine: false,
      plural: false,
    },
    pull: {
      indefinite: "Un pull en laine",
      newOne: "d’un pull neuf",
      bare: "pull",
      feminine: false,
      plural: false,
    },
    chaussures: {
      indefinite: "Des chaussures de sport",
      newOne: "de chaussures neuves",
      bare: "chaussures",
      feminine: true,
      plural: true,
    },
    smartphone: {
      indefinite: "Un smartphone",
      newOne: "d’un smartphone neuf",
      bare: "smartphone",
      feminine: false,
      plural: false,
    },
    "ordinateur-portable": {
      indefinite: "Un ordinateur portable",
      newOne: "d’un ordinateur portable neuf",
      bare: "ordinateur portable",
      feminine: false,
      plural: false,
    },
    television: {
      indefinite: "Une télévision",
      newOne: "d’une télévision neuve",
      bare: "télévision",
      feminine: true,
      plural: false,
    },
  },
  {
    jean: {
      indefinite: "A pair of jeans",
      newOne: "a new pair of jeans",
      bare: "jeans",
      feminine: false,
      plural: true,
    },
    tshirt: {
      indefinite: "A cotton T-shirt",
      newOne: "a new T-shirt",
      bare: "T-shirt",
      feminine: false,
      plural: false,
    },
    pull: {
      indefinite: "A wool jumper",
      newOne: "a new jumper",
      bare: "jumper",
      feminine: false,
      plural: false,
    },
    chaussures: {
      indefinite: "A pair of trainers",
      newOne: "new trainers",
      bare: "trainers",
      feminine: false,
      plural: true,
    },
    smartphone: {
      indefinite: "A smartphone",
      newOne: "a new smartphone",
      bare: "smartphone",
      feminine: false,
      plural: false,
    },
    "ordinateur-portable": {
      indefinite: "A laptop",
      newOne: "a new laptop",
      bare: "laptop",
      feminine: false,
      plural: false,
    },
    television: {
      indefinite: "A television",
      newOne: "a new television",
      bare: "television",
      feminine: false,
      plural: false,
    },
  },
);
