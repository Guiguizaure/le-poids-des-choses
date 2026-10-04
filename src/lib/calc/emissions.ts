import type { Gesture } from "@/lib/data/types";

/** Tout ce qui a une valeur unitaire : un geste, ou un produit de saison (par kg). */
export type Emitter = Pick<Gesture, "kgCo2ePerUnit">;

/** kg CO2e d'un geste pour une quantité donnée (négatif ou non fini → 0). */
export function emissions(gesture: Emitter, quantity: number): number {
  if (!Number.isFinite(quantity) || quantity <= 0) return 0;
  return gesture.kgCo2ePerUnit * quantity;
}
