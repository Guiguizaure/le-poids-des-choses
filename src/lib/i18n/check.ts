// Garde-fou du build (toujours bloquant) : chaque geste et chaque produit de saison des
// données doit avoir son nom anglais (src/lib/i18n/messages/names.ts). Les clés des
// dictionnaires, elles, sont vérifiées par les types (le build échoue si l'une manque).
import { missingEnglishGestureNames } from "@/lib/data";
import { missingEnglishProductNames } from "@/lib/saison";

export function checkEnglishNames(
  gestures: readonly string[] = missingEnglishGestureNames(),
  products: readonly string[] = missingEnglishProductNames(),
): { ok: boolean; message: string } {
  if (gestures.length === 0 && products.length === 0)
    return {
      ok: true,
      message: "Version anglaise : chaque geste et chaque produit a son nom.",
    };
  const missing = [
    ...gestures.map((id) => `geste ${id}`),
    ...products.map((slug) => `produit ${slug}`),
  ];
  return {
    ok: false,
    message: `Version anglaise : nom(s) à ajouter dans src/lib/i18n/messages/names.ts (${missing.join(", ")}).`,
  };
}
