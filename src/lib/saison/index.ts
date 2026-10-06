// Fruits et légumes de saison : lecture des données (saison.generated.json, écrit par
// `pnpm build-saison`), filtrage par mois, tri par impact au kg, regroupement par catégorie.
import { formatMass } from "@/lib/calc";
import { PRODUCT_NAMES_EN } from "@/lib/i18n/messages/names";
import type { Locale } from "@/lib/i18n/routes";
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

/** Nom affiché d'un produit : celui de l'API en français, la table des noms en anglais. */
export function productLabel(
  product: Pick<SeasonalProduct, "slug" | "label">,
  locale: Locale = "fr",
): string {
  return (locale === "en" && PRODUCT_NAMES_EN[product.slug]) || product.label;
}

/** Produits des données sans nom anglais (vide : tout va bien). */
export function missingEnglishProductNames(
  list: readonly SeasonalProduct[] = products,
): string[] {
  return list.filter((p) => !PRODUCT_NAMES_EN[p.slug]).map((p) => p.slug);
}

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

/** Du plus léger au plus lourd au kg ; à égalité, par ordre alphabétique (dans la langue). */
const byImpact =
  (locale: Locale) =>
  (a: SeasonalProduct, b: SeasonalProduct): number =>
    a.kgCo2ePerKg - b.kgCo2ePerKg ||
    productLabel(a, locale).localeCompare(productLabel(b, locale), locale);

/** Produits de saison ce mois-là, du plus léger au plus lourd au kg. */
export function productsForMonth(
  month: number,
  list: readonly SeasonalProduct[] = products,
  locale: Locale = "fr",
): SeasonalProduct[] {
  return list
    .filter((product) => product.months.includes(month))
    .sort(byImpact(locale));
}

export type SeasonGroup = {
  category: SeasonCategory;
  products: SeasonalProduct[];
};

/** Regroupe par catégorie de l'API (dans l'ordre de l'API), chaque groupe trié par impact. */
export function groupByCategory(
  list: readonly SeasonalProduct[],
  locale: Locale = "fr",
): SeasonGroup[] {
  return SEASON_CATEGORIES.map((category) => ({
    category,
    products: list
      .filter((p) => p.category === category.api)
      .sort(byImpact(locale)),
  })).filter((group) => group.products.length > 0);
}

/** Disponible toute l'année : pas « de saison » au sens de l'encart de l'accueil. */
export function isYearRound(product: SeasonalProduct): boolean {
  return product.months.length >= 12;
}

/**
 * Repères de l'encart de l'accueil et de /comparer : parmi les produits qui ont une saison et
 * sont de saison ce mois-là (ceux de toute l'année sont exclus), le plus léger et le plus
 * lourd au kg. À égalité d'impact, le premier par ordre alphabétique. [] si aucun produit,
 * un seul produit s'il n'y en a qu'un.
 */
export function seasonRange(
  month: number,
  list: readonly SeasonalProduct[] = products,
  locale: Locale = "fr",
): SeasonalProduct[] {
  const inSeason = productsForMonth(month, list, locale).filter(
    (p) => !isYearRound(p),
  );
  if (inSeason.length < 2) return inSeason;
  const lightest = inSeason[0];
  const rest = inSeason.slice(1);
  const max = rest[rest.length - 1].kgCo2ePerKg;
  const heaviest = rest.find((p) => p.kgCo2ePerKg === max)!;
  return [lightest, heaviest];
}

/** Impact au kg, arrondi comme sur /saison : « 384 g CO2e/kg », « 4,8 kg CO2e/kg ». */
export function formatPerKilo(
  kgCo2ePerKg: number,
  locale: Locale = "fr",
): string {
  return `${formatMass(kgCo2ePerKg, locale).replace(" ", "\u00a0")}\u00a0CO2e/kg`;
}

/** Lien vers /saison pour un mois donné. */
export function saisonHref(month: number): string {
  return `/saison?mois=${month}`;
}
