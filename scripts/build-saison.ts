// Lancé à la main : `pnpm build-saison`. Interroge l'API publique « Fruits et légumes de
// saison » d'Impact CO2 (ADEME) pour les 12 mois et écrit src/lib/data/saison.generated.json.
// Sans clé, l'API répond (avec un avertissement) ; si IMPACTCO2_API_KEY est définie dans
// .env.local, elle est envoyée (jamais écrite dans le dépôt ni envoyée au navigateur). Les fiches
// des produits viennent de la colonne URL du CSV public. Jamais lancé pendant le build.
import { existsSync, writeFileSync } from "node:fs";
import type { SeasonalProduct } from "../src/lib/data/types";
import { seasonCategory } from "../src/lib/saison/categories";
import { parseCsv, roundSignificant } from "./build-gestures";

export const API_URL = "https://impactco2.fr/api/v1/fruitsetlegumes";
const CSV_URL = "https://impactco2.fr/equivalents.csv";
const CSV_THEME = "Fruits et légumes";
const OUTPUT = new URL(
  "../src/lib/data/saison.generated.json",
  import.meta.url,
);
const ENV_FILE = new URL("../.env.local", import.meta.url);

export const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

type ApiItem = {
  name: string;
  slug: string;
  months: number[];
  ecv: number;
  category: string;
};

function isApiItem(value: unknown): value is ApiItem {
  const item = value as ApiItem;
  return (
    typeof item?.name === "string" &&
    typeof item.slug === "string" &&
    Array.isArray(item.months) &&
    item.months.every((m) => Number.isInteger(m) && m >= 1 && m <= 12) &&
    typeof item.ecv === "number" &&
    typeof item.category === "string"
  );
}

/** Fiches des produits (ID → URL) dans le CSV public, thématique « Fruits et légumes ». */
export function productUrls(csv: string): Map<string, string> {
  const [header, ...rows] = parseCsv(csv);
  const col = (name: string) =>
    header.findIndex((h) => h.trim().toLowerCase().startsWith(name));
  const [iTheme, iId, iUrl] = [col("thématique"), col("id"), col("url")];
  if (iTheme < 0 || iId < 0 || iUrl < 0)
    throw new Error("Colonnes thématique, ID ou URL introuvables dans le CSV.");
  return new Map(
    rows
      .filter((row) => row[iTheme]?.trim() === CSV_THEME && row[iUrl]?.trim())
      .map((row) => [row[iId].trim(), row[iUrl].trim()]),
  );
}

/**
 * Produits de saison à partir des réponses de l'API pour chaque mois. Échoue si la réponse
 * change de forme, si une catégorie inconnue apparaît, si une valeur est invalide, ou si les
 * mois d'un produit sont incohérents d'une réponse à l'autre.
 */
export function buildSaison(
  byMonth: ReadonlyMap<number, unknown>,
  urls: ReadonlyMap<string, string> = new Map(),
): SeasonalProduct[] {
  const products = new Map<string, SeasonalProduct>();
  for (const month of MONTHS) {
    const body = byMonth.get(month) as { data?: unknown } | undefined;
    if (!body || !Array.isArray(body.data))
      throw new Error(`Réponse inattendue de l'API pour le mois ${month}.`);
    for (const raw of body.data) {
      if (!isApiItem(raw))
        throw new Error(
          `Produit illisible pour le mois ${month} : ${JSON.stringify(raw)}`,
        );
      if (!raw.months.includes(month))
        throw new Error(
          `« ${raw.slug} » renvoyé pour le mois ${month} sans en être.`,
        );
      if (!seasonCategory(raw.category))
        throw new Error(
          `Catégorie inconnue « ${raw.category} » (${raw.slug}) : à ajouter dans src/lib/saison/categories.ts.`,
        );
      if (!Number.isFinite(raw.ecv) || raw.ecv < 0)
        throw new Error(`Valeur invalide pour « ${raw.slug} » : ${raw.ecv}`);
      const product: SeasonalProduct = {
        slug: raw.slug,
        label: raw.name.trim(),
        category: raw.category,
        months: [...raw.months].sort((a, b) => a - b),
        kgCo2ePerKg: roundSignificant(raw.ecv),
        source: "impactco2",
        fictive: false,
        ...(urls.get(raw.slug) ? { sourceUrl: urls.get(raw.slug) } : {}),
      };
      const known = products.get(raw.slug);
      if (known && JSON.stringify(known) !== JSON.stringify(product))
        throw new Error(`« ${raw.slug} » diffère d'un mois à l'autre.`);
      products.set(raw.slug, product);
    }
  }
  // Chaque produit doit avoir été renvoyé pour chacun de ses mois.
  for (const product of products.values()) {
    for (const month of product.months) {
      const body = byMonth.get(month) as { data: ApiItem[] };
      if (!body.data.some((item) => item.slug === product.slug))
        throw new Error(
          `« ${product.slug} » absent du mois ${month}, pourtant dans ses mois de saison.`,
        );
    }
  }
  return [...products.values()].sort((a, b) => a.slug.localeCompare(b.slug));
}

/** Clé facultative, lue dans .env.local seulement (jamais affichée). */
function apiKey(): string | undefined {
  if (existsSync(ENV_FILE)) process.loadEnvFile(ENV_FILE);
  return process.env.IMPACTCO2_API_KEY?.trim() || undefined;
}

async function fetchMonth(month: number, key: string | undefined) {
  const response = await fetch(`${API_URL}?month=${month}&language=fr`, {
    headers: key ? { Authorization: `Bearer ${key}` } : {},
  });
  if (response.status === 401 || response.status === 403)
    throw new Error(
      `L'API refuse l'accès ${key ? "avec cette clé" : "anonyme"} (HTTP ${response.status}) : arrêt, rien n'est écrit.`,
    );
  if (!response.ok)
    throw new Error(
      `Mois ${month} : HTTP ${response.status}, rien n'est écrit.`,
    );
  return response.json();
}

async function main() {
  const key = apiKey();
  const byMonth = new Map<number, unknown>();
  for (const month of MONTHS) byMonth.set(month, await fetchMonth(month, key));
  const warning = (byMonth.get(1) as { warning?: string }).warning;
  if (warning) console.warn(`Avertissement de l'API : ${warning}`);

  const csv = await fetch(CSV_URL);
  if (!csv.ok) throw new Error(`CSV : HTTP ${csv.status}, rien n'est écrit.`);
  const products = buildSaison(byMonth, productUrls(await csv.text()));
  const file = {
    downloadedAt: new Date().toISOString(),
    source: API_URL,
    tool: "https://impactco2.fr/outils/fruitsetlegumes",
    authenticated: Boolean(key),
    products,
  };
  writeFileSync(OUTPUT, JSON.stringify(file, null, 2) + "\n");
  console.log(
    `${products.length} produits écrits dans src/lib/data/saison.generated.json (${key ? "avec" : "sans"} clé d'API).`,
  );
  console.log(
    "À vérifier à la main : la base et sa date de mise à jour affichées sur l'outil Impact CO2 (SAISON_BASE, src/lib/saison/index.ts).",
  );
}

if (
  process.argv[1] &&
  import.meta.url === new URL(`file://${process.argv[1]}`).href
) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
