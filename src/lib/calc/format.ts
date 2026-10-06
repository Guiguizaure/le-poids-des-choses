import type { Locale } from "@/lib/i18n/routes";

function decimal(value: number, locale: Locale): string {
  return locale === "en" ? String(value) : String(value).replace(".", ",");
}

/**
 * Masse lisible : « 350 g », « 1,2 kg », « 1,4 t » (français) ; « 1.2 kg » (anglais, point
 * décimal).
 */
export function formatMass(kg: number, locale: Locale = "fr"): string {
  if (!Number.isFinite(kg) || kg <= 0) return "0 g";

  const grams = Math.round(kg * 1000);
  if (grams < 1000) return `${grams} g`;

  const kilos = Math.round(kg * 10) / 10;
  if (kilos < 1000) return `${decimal(kilos, locale)} kg`;

  return `${decimal(Math.round(kg / 100) / 10, locale)} t`;
}
