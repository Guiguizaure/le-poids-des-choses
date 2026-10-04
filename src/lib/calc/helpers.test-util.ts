import type { Gesture } from "@/lib/data/types";

/** Geste fictif de test (kg CO2e par km). */
export function fakeGesture(id: string, kgCo2ePerUnit: number): Gesture {
  return {
    id,
    label: id,
    category: "transport",
    unit: "km",
    kgCo2ePerUnit,
    defaultQuantity: 10,
    source: "fictive",
    fictive: true,
  };
}
