export type Category =
  "transport" | "alimentation" | "habillement" | "numerique";

export type Unit = "km" | "repas" | "objet" | "heure";

export type GestureSource = "fictive" | "impactco2";

export type Gesture = {
  id: string;
  /** Libellé affiché, en français. */
  label: string;
  category: Category;
  unit: Unit;
  kgCo2ePerUnit: number;
  /** Quantité proposée par défaut (ex. 10 km, 1 repas). */
  defaultQuantity: number;
  source: GestureSource;
  /** Vrai pour toute valeur de test : la construction stricte doit alors échouer. */
  fictive: boolean;
};

export type Choice = "a" | "b";

export type JournalEntry = {
  id: string;
  /** Date ISO 8601. */
  date: string;
  gestureA: string;
  gestureB: string;
  quantity: number;
  chosen: Choice;
  avoidedKg: number;
};
