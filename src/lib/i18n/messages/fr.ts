// Textes de l'interface en français (langue de référence). Toute clé ajoutée ici doit
// exister dans en.ts : le type `Messages` fait échouer la vérification des types sinon.

export const fr = {
  site: {
    description:
      "Compare deux gestes du quotidien sur une balance et regarde ton jardin grandir à chaque choix plus léger.",
    ogAlt: "Le poids des choses : une balance et un jardin",
  },
  nav: {
    label: "Navigation principale",
    compare: "Comparer",
    garden: "Mon jardin",
    method: "Méthode",
    signIn: "Se connecter",
  },
  footer: {
    label: "Pied de page",
    method: "Méthode",
    legal: "Mentions légales",
    privacy: "Confidentialité",
    byline: "Un projet de Guillaume ·",
    install: "Installer l’appli",
  },
  language: {
    switchTo: "English",
    switchLabel: "Read this page in English",
  },
  home: {
    eyebrow: "COMPARATEUR CARBONE ILLUSTRÉ",
    intro:
      "Avant un trajet, un repas ou un achat, pose deux options sur la balance. Ton jardin grandit chaque fois que tu choisis la plus légère.",
    start: "Commencer",
    howItWorks: "Comment ça marche ?",
    findGardenQuestion: "J’ai déjà un jardin ?",
    findGardenAction: "Le retrouver",
    sources: "Données publiques de l’ADEME · Projet indépendant",
  },
  season: {
    title: "De saison",
    titleInMonth: "De saison en {month}",
    lightestToHeaviest: "Du plus léger au plus lourd au kilo :",
    perKilo: "Au kilo :",
    seeAll: "Tous les fruits et légumes de saison",
  },
  credit: {
    data: "Données :",
    downloadedOn: "téléchargées le {date}",
    base: "Données {name} (mise à jour du {updatedOn}), récupérées le {date}",
    independent: "projet indépendant",
  },
};

/** Forme commune des deux langues : mêmes clés, chaînes libres. */
type Shape<T> = { [K in keyof T]: T[K] extends string ? string : Shape<T[K]> };
export type Messages = Shape<typeof fr>;
