// Catégories de l'outil « Fruits et légumes de saison », reprises de l'API Impact CO2 (paramètre
// `category`, documentation https://impactco2.fr/doc/api) : 1 fruits, 2 légumes, 3 herbes,
// 4 pâtes, riz et céréales, 5 pommes de terre et autres tubercules, 6 fruits à coque et graines
// oléagineuses. L'intitulé affiché est le nom de l'API avec une majuscule ; aucune catégorie
// n'est inventée : `pnpm build-saison` échoue si l'API en renvoie une autre.

export type SeasonCategory = {
  /** Nom exact dans l'API. */
  api: string;
  /** Identifiant de l'API (ordre d'affichage). */
  id: number;
  /** Intitulé affiché. */
  label: string;
  /** Couleur de la puce (token du thème). */
  dot: string;
};

export const SEASON_CATEGORIES: readonly SeasonCategory[] = [
  { api: "fruits", id: 1, label: "Fruits", dot: "bg-tomate" },
  { api: "légumes", id: 2, label: "Légumes", dot: "bg-pomme" },
  { api: "herbes", id: 3, label: "Herbes", dot: "bg-outremer" },
  {
    api: "pâtes, riz et céréales",
    id: 4,
    label: "Pâtes, riz et céréales",
    dot: "bg-soleil",
  },
  {
    api: "pommes de terre et autres tubercules",
    id: 5,
    label: "Pommes de terre et autres tubercules",
    dot: "bg-rose",
  },
  {
    api: "fruits à coque et graines oléagineuses",
    id: 6,
    label: "Fruits à coque et graines oléagineuses",
    dot: "bg-encre",
  },
];

export function seasonCategory(api: string): SeasonCategory | undefined {
  return SEASON_CATEGORIES.find((category) => category.api === api);
}
