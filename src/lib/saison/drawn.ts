// Fruits et légumes dessinés (public/illustrations/saison-*.svg) flottant à côté de l'encart
// de saison : seulement ceux qui sont de saison ce mois-là d'après saison.generated.json.
import type { SeasonalProduct } from "@/lib/data/types";
import type { IllustrationName } from "@/lib/illustrations/specs";
import { getSeasonalProducts, isYearRound } from "./index";

/** Dessin → produit de l'API (slug), par nom. Un test vérifie chaque correspondance. */
export const SEASON_DRAWINGS = {
  "saison-pomme": "pomme",
  "saison-poire": "poire",
  "saison-carotte": "carotte",
  "saison-courge": "courge",
  "saison-raisin": "raisin",
  "saison-poireau": "poireau",
  "saison-tomate": "tomate",
  "saison-fraise": "fraise",
  "saison-cerise": "cerise",
  "saison-abricot": "abricot",
  "saison-courgette": "courgette",
  "saison-aubergine": "aubergine",
  "saison-melon": "melon",
  "saison-radis": "radis",
  "saison-asperge": "asperge",
  "saison-petits-pois": "petitpois",
  "saison-chou": "chou",
  "saison-clementine": "clementine",
  "saison-kiwi": "kiwi",
  "saison-endive": "endive",
  "saison-betterave": "betterave",
} as const satisfies Partial<Record<IllustrationName, string>>;

export type SeasonDrawing = keyof typeof SEASON_DRAWINGS;

/** Au plus 5 à côté de l'encart (3 sur mobile). */
export const MAX_DRAWN = 5;

type Drawn = { name: SeasonDrawing; product: SeasonalProduct };

function drawnProducts(list: readonly SeasonalProduct[]): Drawn[] {
  return (Object.keys(SEASON_DRAWINGS) as SeasonDrawing[]).flatMap((name) => {
    const product = list.find((p) => p.slug === SEASON_DRAWINGS[name]);
    return product ? [{ name, product }] : [];
  });
}

/** Les plus « du moment » d'abord (saison la plus courte), puis le plus léger, puis l'alphabet. */
function byShortestSeason(a: Drawn, b: Drawn): number {
  return (
    a.product.months.length - b.product.months.length ||
    a.product.kgCo2ePerKg - b.product.kgCo2ePerKg ||
    a.product.label.localeCompare(b.product.label, "fr")
  );
}

function seasonalIn(month: number, drawn: Drawn[]): Drawn[] {
  return drawn
    .filter((d) => !isYearRound(d.product) && d.product.months.includes(month))
    .sort(byShortestSeason);
}

/**
 * Dessins à afficher ce mois-là : ceux de saison ; moins de 3, complétés par ceux de toute
 * l'année ; aucun, ceux du mois le plus proche (à égale distance, celui qui en a le plus,
 * puis le mois à venir).
 */
export function drawnForMonth(
  month: number,
  list: readonly SeasonalProduct[] = getSeasonalProducts(),
  max = MAX_DRAWN,
): SeasonDrawing[] {
  const drawn = drawnProducts(list);
  let chosen = seasonalIn(month, drawn);
  if (chosen.length < 3)
    chosen = [
      ...chosen,
      ...drawn.filter((d) => isYearRound(d.product)).sort(byShortestSeason),
    ];
  for (let distance = 1; chosen.length === 0 && distance <= 6; distance++) {
    const next = seasonalIn(((month - 1 + distance) % 12) + 1, drawn);
    const previous = seasonalIn(((month - 1 - distance + 12) % 12) + 1, drawn);
    chosen = previous.length > next.length ? previous : next;
  }
  return chosen.slice(0, max).map((d) => d.name);
}
