// « Le savais-tu ? » : faits calculés depuis nos données, choisis de façon déterministe.
import { formatMass } from "@/lib/calc";
import { getGesture } from "@/lib/data";
import type { Gesture } from "@/lib/data/types";
import { pickIndex } from "@/lib/garden/hash";
import { getSeasonalProduct } from "@/lib/saison";
import {
  FACT_TEMPLATES,
  resolveProduct,
  resolveRef,
  type FactKind,
  type FactTemplate,
} from "./templates";
import type { SeasonalProduct } from "@/lib/data/types";

export { FACT_TEMPLATES, type FactTemplate } from "./templates";

const NUMBER = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });

/** Arrondi lisible : 2 chiffres significatifs au-delà de 100, entier dès 10, sinon un décimal. */
export function readableNumber(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0";
  if (value >= 100) {
    const magnitude = 10 ** (Math.floor(Math.log10(value)) - 1);
    return NUMBER.format(Math.round(value / magnitude) * magnitude);
  }
  if (value >= 10) return NUMBER.format(Math.round(value));
  return NUMBER.format(Math.round(value * 10) / 10);
}

/** Espace insécable entre la valeur et son unité (« 27 000 km » ne se coupe pas). */
const NBSP = "\u00a0";

function formatValue(kind: FactKind, value: number): string {
  switch (kind) {
    case "km":
      return `${readableNumber(value)}${NBSP}km`;
    case "mass":
      return formatMass(value).replace(" ", NBSP);
    case "count":
    case "ratio":
      return readableNumber(value);
  }
}

export type Fact = {
  id: string;
  text: string;
  /** Valeur exacte, avant arrondi. */
  value: number;
  /** Geste ou produit source : son nom et sa fiche Impact CO2. */
  source: { label: string; url?: string };
  /** Ids (sans mode) des gestes utilisés (vide pour un fait sur des produits de saison). */
  gestureIds: readonly string[];
  /** Page de méthode. */
  methodHref: string;
};

type Lookup = (id: string) => Gesture | undefined;
type ProductLookup = (slug: string) => SeasonalProduct | undefined;

/**
 * Gestes ou produits demandés par les gabarits qui n'existent plus dans les données (vide :
 * tout va bien).
 */
export function missingFactGestures(
  templates: readonly FactTemplate[] = FACT_TEMPLATES,
  lookup: Lookup = getGesture,
  productLookup: ProductLookup = getSeasonalProduct,
): string[] {
  return templates.flatMap((template) =>
    "products" in template
      ? template.products
          .filter((slug) => !resolveProduct(slug, productLookup))
          .map((slug) => `${template.id} → produit ${slug}`)
      : template.gestures
          .filter((ref) => !resolveRef(ref, lookup))
          .map(
            (ref) =>
              `${template.id} → ${ref.id}${ref.mode ? ` (${ref.mode})` : ""}`,
          ),
  );
}

/** Fait calculé depuis un gabarit, ou null si un geste ou un produit manque. */
export function buildFact(
  template: FactTemplate,
  lookup: Lookup = getGesture,
  productLookup: ProductLookup = getSeasonalProduct,
): Fact | null {
  const fact = (value: number, source: Fact["source"], ids: string[]) => ({
    id: template.id,
    text: template.text(formatValue(template.kind, value)),
    value,
    source,
    gestureIds: ids,
    methodHref: "/methode#savais-tu",
  });
  if ("products" in template) {
    const products = template.products.map((slug) =>
      resolveProduct(slug, productLookup),
    );
    if (products.some((product) => !product)) return null;
    const resolved = products as NonNullable<(typeof products)[number]>[];
    const [base] = resolved;
    return fact(
      template.compute(resolved),
      { label: base.label, url: base.sourceUrl },
      [],
    );
  }
  const gestures = template.gestures.map((ref) => resolveRef(ref, lookup));
  if (gestures.some((gesture) => !gesture)) return null;
  const base = lookup(template.gestures[0].id)!;
  return fact(
    template.compute(gestures as Gesture[]),
    { label: base.label, url: base.sourceUrl },
    template.gestures.map((ref) => ref.id),
  );
}

/**
 * Fait du moment, sans hasard : la graine (le jour, ou l'id d'une entrée du carnet) choisit
 * toujours le même gabarit. Avec `related`, on préfère un fait sur ces gestes s'il en existe.
 */
export function pickFact(
  seed: string,
  related: readonly string[] = [],
  lookup: Lookup = getGesture,
): Fact | null {
  const facts = FACT_TEMPLATES.map((template) =>
    buildFact(template, lookup),
  ).filter((fact): fact is Fact => fact !== null);
  const matching = facts.filter((fact) =>
    fact.gestureIds.some((id) => related.includes(id)),
  );
  const pool = matching.length > 0 ? matching : facts;
  if (pool.length === 0) return null;
  return pool[pickIndex(seed, pool.length)];
}

/** Graine du jour (date locale, AAAA-MM-JJ). */
export function daySeed(now: number): string {
  const date = new Date(now);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
