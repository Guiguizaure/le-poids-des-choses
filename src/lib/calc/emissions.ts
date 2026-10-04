import type { Gesture } from "@/lib/data/types";

/** kg CO2e d'un geste pour une quantité donnée (négatif ou non fini → 0). */
export function emissions(gesture: Gesture, quantity: number): number {
  if (!Number.isFinite(quantity) || quantity <= 0) return 0;
  return gesture.kgCo2ePerUnit * quantity;
}
