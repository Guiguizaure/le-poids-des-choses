function decimal(value: number): string {
  return String(value).replace(".", ",");
}

/** Masse lisible en français : « 350 g », « 1,2 kg », « 1,4 t ». */
export function formatMass(kg: number): string {
  if (!Number.isFinite(kg) || kg <= 0) return "0 g";

  const grams = Math.round(kg * 1000);
  if (grams < 1000) return `${grams} g`;

  const kilos = Math.round(kg * 10) / 10;
  if (kilos < 1000) return `${decimal(kilos)} kg`;

  return `${decimal(Math.round(kg / 100) / 10)} t`;
}
