// Fruits et légumes de saison : lecture des données (saison.generated.json, écrit par
// `pnpm build-saison`), filtrage par mois, tri par impact au kg, regroupement par catégorie.
import generated from "@/lib/data/saison.generated.json";
import type { SeasonalProduct } from "@/lib/data/types";
import {
  SEASON_CATEGORIES,
  seasonCategory,
  type SeasonCategory,
} from "./categories";

export { SEASON_CATEGORIES, seasonCategory, type SeasonCategory };

const products = generated.products as readonly SeasonalProduct[];

/** Date de téléchargement des données (ISO). */
export const SAISON_DOWNLOADED_AT: string = generated.downloadedAt;
/** Page de l'outil « Fruits et légumes de saison » d'Impact CO2. */
export const SAISON_TOOL_URL: string = generated.tool;

/**
 * Base des valeurs de saison et date de sa mise à jour : l'API ne les renvoie pas. Lues le
 * 5 octobre 2026 sur https://impactco2.fr/outils/fruitsetlegumes et sur les fiches des
 * produits (ex. https://impactco2.fr/outils/fruitsetlegumes/pomme) : « Source : Agribalyse
 * 3.2 - Mise à jour le 15/01/2025 ». À relire à chaque `pnpm build-saison`.
 */
export const SAISON_BASE = {
  name: "Agribalyse 3.2",
  updatedOn: "15/01/2025",
} as const;

export function getSeasonalProducts(): readonly SeasonalProduct[] {
  return products;
}

export function getSeasonalProduct(slug: string): SeasonalProduct | undefined {
  return products.find((product) => product.slug === slug);
}

export const MONTH_NAMES = [
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
] as const;

/** Mois de l'URL (« 10 » → 10) ; null si absent ou invalide. */
export function parseMonth(value: string | null | undefined): number | null {
  if (!value || !/^\d{1,2}$/.test(value)) return null;
  const month = Number(value);
  return month >= 1 && month <= 12 ? month : null;
}

/** Mois courant (1 à 12), en heure locale. */
export function monthOf(now: number): number {
  return new Date(now).getMonth() + 1;
}

/** Du plus léger au plus lourd au kg ; à égalité, par ordre alphabétique. */
function byImpact(a: SeasonalProduct, b: SeasonalProduct): number {
  return a.kgCo2ePerKg - b.kgCo2ePerKg || a.label.localeCompare(b.label, "fr");
}

/** Produits de saison ce mois-là, du plus léger au plus lourd au kg. */
export function productsForMonth(
  month: number,
  list: readonly SeasonalProduct[] = products,
): SeasonalProduct[] {
  return list
    .filter((product) => product.months.includes(month))
    .sort(byImpact);
}

export type SeasonGroup = {
  category: SeasonCategory;
  products: SeasonalProduct[];
};

/** Regroupe par catégorie de l'API (dans l'ordre de l'API), chaque groupe trié par impact. */
export function groupByCategory(
  list: readonly SeasonalProduct[],
): SeasonGroup[] {
  return SEASON_CATEGORIES.map((category) => ({
    category,
    products: list.filter((p) => p.category === category.api).sort(byImpact),
  })).filter((group) => group.products.length > 0);
}

/**
 * Trois produits pour l'encart « Ce mois-ci, c'est la saison de… » : les plus légers au kg
 * parmi ceux qui ont une saison (pas disponibles toute l'année), complétés au besoin par les
 * autres.
 */
export function seasonHighlights(
  month: number,
  count = 3,
  list: readonly SeasonalProduct[] = products,
): SeasonalProduct[] {
  const inSeason = productsForMonth(month, list);
  const seasonal = inSeason.filter((product) => product.months.length < 12);
  const yearRound = inSeason.filter((product) => product.months.length === 12);
  return [...seasonal, ...yearRound].slice(0, count);
}

/** Lien vers /saison pour un mois donné. */
export function saisonHref(month: number): string {
  return `/saison?mois=${month}`;
}
