// Textes communs : site, navigation, pied de page, langue, accueil, encart et page de saison,
// crédit des données, 404, métadonnées des pages.
import { defineMessages } from "../index";

export const SITE = defineMessages(
  {
    description:
      "Compare deux gestes du quotidien sur une balance et regarde ton jardin grandir à chaque choix plus léger.",
    ogAlt:
      "Le poids des choses : un horizon qui penche comme une balance, entre une pousse et un caillou, sous le soleil",
    shortName: "Le poids",
  },
  {
    description:
      "The weight of things. Compare two everyday actions on the scales and watch your garden grow with every lighter choice.",
    ogAlt:
      "Le poids des choses: a horizon that tilts like the scales, between a sprout and a pebble, under the sun",
    shortName: "Le poids",
  },
);

export const NAV = defineMessages(
  {
    label: "Navigation principale",
    compare: "Comparer",
    garden: "Mon jardin",
    method: "Méthode",
    signIn: "Se connecter",
    back: "Retour",
    home: "Accueil",
  },
  {
    label: "Main navigation",
    compare: "Compare",
    garden: "My garden",
    method: "Method",
    signIn: "Sign in",
    back: "Back",
    home: "Home",
  },
);

export const FOOTER = defineMessages(
  {
    label: "Pied de page",
    method: "Méthode",
    legal: "Mentions légales",
    privacy: "Confidentialité",
    byline: "Un projet de Guillaume ·",
  },
  {
    label: "Footer",
    method: "Method",
    legal: "Legal notice",
    privacy: "Privacy",
    byline: "A project by Guillaume ·",
  },
);

/**
 * Sélecteur de langue : il mène à l'autre langue, donc s'écrit dans l'autre langue
 * (« English » sur une page française, « Français » sur une page anglaise).
 */
export const LANGUAGE = defineMessages(
  { other: "English", otherLang: "en" },
  { other: "Français", otherLang: "fr" },
);

/**
 * Bandeau proposé sur les pages françaises quand le navigateur est en anglais : il s'adresse
 * à quelqu'un qui lit l'anglais, il est donc en anglais (même texte dans les deux langues).
 */
export const LANGUAGE_BANNER = {
  text: "This site is also available in English.",
  action: "Read in English",
  close: "Close",
} as const;

export const HOME = defineMessages(
  {
    eyebrow: "COMPARATEUR CARBONE ILLUSTRÉ",
    subtitle: "",
    intro:
      "Avant un trajet, un repas ou un achat, pose deux options sur la balance. Ton jardin grandit chaque fois que tu choisis la plus légère.",
    start: "Commencer",
    howItWorks: "Comment ça marche ?",
    findGardenQuestion: "J’ai déjà un jardin ?",
    findGardenAction: "Le retrouver",
    backToGarden: "Retrouver mon jardin",
    grow: "Faire pousser une plante",
    sources: "Données publiques de l’ADEME · Projet indépendant",
  },
  {
    eyebrow: "ILLUSTRATED CARBON COMPARISON",
    subtitle: "The weight of things",
    intro:
      "Before a journey, a meal or a purchase, put two options on the scales. Your garden grows every time you choose the lighter one.",
    start: "Start comparing",
    howItWorks: "How does it work?",
    findGardenQuestion: "Already have a garden?",
    findGardenAction: "Find it here",
    backToGarden: "Back to my garden",
    grow: "Grow a plant",
    sources: "Public data from ADEME · Independent project",
  },
);

/** Mini-duel de l'accueil (maquettes 102:3, 102:419, 103:2) : une devinette, rien n'est noté. */
export const MINI_DUEL = defineMessages(
  {
    label: "Essaie tout de suite",
    question: "Pour 5 km, lequel est le plus léger ?",
    bike: "À vélo",
    car: "En voiture",
    or: "ou",
    help: "Touche ta réponse : l’écart s’affiche, calculé avec les données de l’ADEME.",
    right: "Bien vu !",
    rightAnswer: "Le vélo est le plus léger.",
    wrongAnswer: "Pas tout à fait : c’est le vélo le plus léger.",
    gap: "{mass} CO2e d’écart sur 5 km",
    firstPlant: "Faire pousser ma première plante",
    logChoice: "Noter ce choix",
    another: "Un autre duel",
    next: "Tu passes au duel complet, déjà rempli : c’est là que ton choix est noté.",
  },
  {
    label: "Try it now",
    question: "For 5 km, which one is lighter?",
    bike: "By bike",
    car: "By car",
    or: "or",
    help: "Tap your answer: the difference appears, calculated with ADEME’s data.",
    right: "Well spotted!",
    rightAnswer: "The bike is the lighter one.",
    wrongAnswer: "Not quite: the bike is the lighter one.",
    gap: "{mass} CO2e difference over 5 km",
    firstPlant: "Grow my first plant",
    logChoice: "Log this choice",
    another: "Another duel",
    next: "You go on to the full duel, already filled in: that’s where your choice is logged.",
  },
);

/** « Comment ça marche », sous le héros de l'accueil (maquettes 102:3 et 103:2). */
export const HOW_IT_WORKS = defineMessages(
  {
    title: "Comment ça marche",
    methodLink: "Tout sur la méthode",
    steps: [
      {
        title: "Compare deux gestes",
        text: "Un trajet, un repas, un jean… La balance penche et l’écart en CO2e s’affiche, calculé avec les données de l’ADEME.",
      },
      {
        title: "Choisis le plus léger, ton jardin pousse",
        text: "Une plante pousse à chaque choix plus léger. Un choix plus lourd est simplement noté : rien n’est retiré.",
      },
      {
        title: "Ton jardin vit",
        text: "Des espèces se débloquent, le jardin suit les vraies saisons, et des animaux s’installent… pour te parler.",
      },
    ],
  },
  {
    title: "How it works",
    methodLink: "All about the method",
    steps: [
      {
        title: "Compare two actions",
        text: "A journey, a meal, a pair of jeans… The scales tip and the CO2e difference appears, calculated with ADEME’s data.",
      },
      {
        title: "Choose the lighter one, your garden grows",
        text: "A plant grows with every lighter choice. A heavier choice is simply noted: nothing is taken away.",
      },
      {
        title: "Your garden is alive",
        text: "New species unlock, the garden follows the real seasons, and animals move in… to talk to you.",
      },
    ],
  },
);

export const SEASON = defineMessages(
  {
    title: "De saison",
    titleInMonth: "De saison en {month}",
    lightestToHeaviest: "Du plus léger au plus lourd au kilo :",
    perKilo: "Au kilo :",
    seeAll: "Tous les fruits et légumes de saison",
    lightestPerKilo: "Le plus léger au kilo :",
    seeAllProduce: "Voir tous les produits de saison",
    produce: "Quelques produits du mois",
    month: "Mois",
    count: (count: number, month: string) =>
      `${count} produits de saison en ${month}, du plus léger au plus lourd. L’impact est donné pour 1 kg de produit, en CO2e.`,
    perKg: " de CO2e par kg",
    origin:
      "La donnée ne précise pas d’où viennent les produits, sauf pour la mangue (import par avion ou par bateau).",
    method: "Méthode",
    source: "Source :",
    tool: "Fruits et légumes de saison, Impact CO2",
  },
  {
    title: "In season",
    titleInMonth: "In season in {month}",
    lightestToHeaviest: "Lightest to heaviest, per kilo:",
    perKilo: "Per kilo:",
    seeAll: "All the fruit and veg in season",
    lightestPerKilo: "Lightest per kilo:",
    seeAllProduce: "See all the produce in season",
    produce: "A few of this month’s products",
    month: "Month",
    count: (count: number, month: string) =>
      `${count} products in season in ${month}, from lightest to heaviest. The impact is given for 1 kg of produce, in CO2e.`,
    perKg: " of CO2e per kg",
    origin:
      "The data doesn’t say where the produce comes from, except for mangoes (imported by air or by sea).",
    method: "Method",
    source: "Source:",
    tool: "Seasonal fruit and vegetables, Impact CO2",
  },
);

/** Crédit des données (DataCredit). « Données : Impact CO2 – ADEME » est imposé. */
export const CREDIT = defineMessages(
  {
    data: "Données :",
    downloadedOn: ", téléchargées le {date}",
    base: " · Données {name} (mise à jour du {updatedOn}), récupérées le {date}",
    independent: " · projet indépendant",
  },
  {
    data: "Data:",
    downloadedOn: ", downloaded on {date}",
    base: " · {name} data (updated {updatedOn}), retrieved on {date}",
    independent: " · independent project",
  },
);

export const NOT_FOUND = defineMessages(
  {
    title: "Page introuvable",
    eyebrow: "ERREUR 404",
    heading: "Cette page s’est perdue dans la brume",
    text: "Même l’oiseau s’est endormi en la cherchant. Ton jardin, lui, t’attend toujours.",
    home: "Revenir à l’accueil",
  },
  {
    title: "Page not found",
    eyebrow: "ERROR 404",
    heading: "This page got lost in the mist",
    text: "Even the bird fell asleep looking for it. Your garden, though, is still waiting for you.",
    home: "Back to the home page",
  },
);

/** Titre et description de chaque page (métadonnées, partage). */
export const PAGES = defineMessages(
  {
    comparer: {
      title: "Comparer",
      description:
        "Pose deux gestes du quotidien sur la balance et regarde lequel pèse le moins.",
    },
    raconte: {
      title: "Raconte ta journée",
      description:
        "Écris ta journée en quelques phrases : Claude repère tes gestes, tu vérifies tout avant de les noter dans ton carnet.",
    },
    jardin: {
      title: "Mon jardin",
      description:
        "Ton jardin grandit chaque fois que tu choisis l’option la plus légère, choix après choix.",
    },
    carnet: {
      title: "Carnet",
      description:
        "Tous tes choix notés : les choix légers de la semaine, triés et filtrés comme tu veux.",
    },
    saison: {
      title: "De saison",
      description:
        "Les fruits et légumes de saison, mois par mois, classés par impact carbone au kilo (Impact CO2, ADEME).",
    },
    methode: {
      title: "Méthode et sources",
      description:
        "D’où viennent les chiffres (Impact CO2, ADEME), nos hypothèses, ce qui n’est pas compté et les limites.",
    },
    mentions: {
      title: "Mentions légales",
      description:
        "Éditeur, hébergeur et confidentialité : sans compte, ton carnet reste sur ton appareil.",
    },
    confidentialite: {
      title: "Confidentialité",
      description:
        "Sans compte, ton carnet reste sur ton appareil. Avec un compte facultatif : quelles données, pourquoi, où, combien de temps, et comment les exporter ou les supprimer.",
    },
    connexion: {
      title: "Connexion",
      description:
        "Connexion à ton compte : retrouve ton jardin sur cet appareil.",
    },
  },
  {
    comparer: {
      title: "Compare",
      description:
        "Put two everyday actions on the scales and see which one weighs less.",
    },
    raconte: {
      title: "Tell us about your day",
      description:
        "Write about your day in a few sentences: Claude spots your actions, and you check everything before noting them in your journal.",
    },
    jardin: {
      title: "My garden",
      description:
        "Your garden grows every time you choose the lighter option, choice after choice.",
    },
    carnet: {
      title: "Journal",
      description:
        "All your noted choices: this week’s lighter choices, sorted and filtered as you like.",
    },
    saison: {
      title: "In season",
      description:
        "Seasonal fruit and vegetables, month by month, ranked by carbon impact per kilo (Impact CO2, ADEME).",
    },
    methode: {
      title: "Method and sources",
      description:
        "Where the figures come from (Impact CO2, ADEME), our assumptions, what isn’t counted and the limits.",
    },
    mentions: {
      title: "Legal notice",
      description:
        "Publisher, host and privacy: without an account, your journal stays on your device.",
    },
    confidentialite: {
      title: "Privacy",
      description:
        "Without an account, your journal stays on your device. With an optional account: what data, why, where, for how long, and how to export or delete it.",
    },
    connexion: {
      title: "Sign in",
      description: "Sign in to your account: find your garden on this device.",
    },
  },
);
