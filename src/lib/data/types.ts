export type Category =
  "transport" | "alimentation" | "habillement" | "numerique";

export type Unit = "km" | "repas" | "objet" | "heure";

export type GestureSource = "fictive" | "impactco2";

/**
 * Mode d'acquisition d'un objet (unité « objet ») :
 * - neuf : valeur du CSV Impact CO2 ;
 * - occasion : aucune nouvelle fabrication, retrait sur place (hypothèse) ;
 * - occasion-livree : idem, plus l'envoi d'un colis (ligne « Livraison » du CSV) ;
 * - garder : on garde l'objet qu'on a déjà, 0 kg.
 */
export type AcquisitionMode =
  "neuf" | "occasion" | "occasion-livree" | "garder";

/** Origine d'une valeur : une ligne du CSV, ou une hypothèse de méthode (voir docs/methode.md). */
export type ValueMethod =
  "impactco2" | "hypothese-occasion" | "hypothese-garder";

export type ValuePart = {
  label: string;
  kgCo2e: number;
  method: ValueMethod;
  sourceId?: string;
  sourceUrl?: string;
};

export type ModeValue = {
  kgCo2e: number;
  method: ValueMethod;
  /** Présent quand la valeur vient directement d'une ligne du CSV. */
  sourceId?: string;
  sourceUrl?: string;
  /** Détail quand la valeur additionne plusieurs éléments (ex. fabrication évitée + colis). */
  parts?: ValuePart[];
};

export type Gesture = {
  id: string;
  /** Libellé affiché, en français. */
  label: string;
  /** Précision affichée en second (ex. « trajet court » pour l'avion). */
  detail?: string;
  category: Category;
  unit: Unit;
  kgCo2ePerUnit: number;
  /** Quantité proposée par défaut (ex. 10 km, 1 repas). */
  defaultQuantity: number;
  source: GestureSource;
  /** Identifiant dans le CSV Impact CO2 (absent des données fictives). */
  sourceId?: string;
  /** Page Impact CO2 du geste (absente des données fictives). */
  sourceUrl?: string;
  /** Valeurs par mode d'acquisition, pour les gestes à l'unité « objet » uniquement. */
  modes?: Partial<Record<AcquisitionMode, ModeValue>>;
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
  /** kg CO2e évités par ce choix (0 si on a pris le plus lourd), figés au moment du choix. */
  avoidedKg: number;
  /** Objets uniquement : mode d'acquisition de chaque côté (même objet, deux modes). */
  modeA?: AcquisitionMode;
  modeB?: AcquisitionMode;
};
