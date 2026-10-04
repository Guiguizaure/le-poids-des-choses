import { missingFactGestures } from "./index";

/** Garde-fou du build (toujours bloquant) : chaque gabarit doit trouver ses gestes. */
export function checkFacts(
  missing: readonly string[] = missingFactGestures(),
): {
  ok: boolean;
  message: string;
} {
  if (missing.length === 0)
    return {
      ok: true,
      message: "Le savais-tu ? : tous les gestes et produits existent.",
    };
  return {
    ok: false,
    message: `Le savais-tu ? : gabarit(s) sur un geste ou un produit disparu, à corriger dans src/lib/facts/templates.ts (${missing.join(", ")}).`,
  };
}
