export type Category =
  | "transport"
  | "alimentation"
  | "habillement"
  | "numerique"
  | "boisson"
  | "livraison";

/** km : trajets ; repas ; objet : modes d'acquisition ; litre : boissons ; achat : livraisons. */
export type Unit = "km" | "repas" | "objet" | "litre" | "achat";

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
  /** Détail quand la valeur additionne plusieurs éléments (ex. pas de fabrication + colis). */
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

/**
 * Entrée « comparaison » : deux gestes comparés, l'un choisi. Sans champ `kind` (les carnets
 * existants ne sont jamais réécrits : leur empreinte changerait sur le compte).
 */
export type ComparisonEntry = {
  kind?: undefined;
  id: string;
  /** Date ISO 8601. */
  date: string;
  gestureA: string;
  gestureB: string;
  quantity: number;
  chosen: Choice;
  /**
   * Écart en kg CO2e avec l'autre option comparée (0 si on a pris le plus lourd), figé au
   * moment du choix. Le nom du champ est gardé (carnets et exports existants) ; ce n'est pas
   * un gain mesuré.
   */
  avoidedKg: number;
  /** Objets uniquement : mode d'acquisition de chaque côté (même objet, deux modes). */
  modeA?: AcquisitionMode;
  modeB?: AcquisitionMode;
  /**
   * Espèce choisie à la plantation (« fleur-4 »…), choix léger seulement ; absente quand le
   * jardin a choisi (tirage figé d'après l'id, comme avant). Gardée avec l'entrée : elle part
   * avec la synchro du compte et l'export.
   */
  species?: string;
};

/**
 * Entrée « habitude » : un geste tenu, noté sans comparaison. Elle ne compte aucun kg (pas de
 * comparaison, donc pas d'écart) : elle arrose le jardin. Jamais de `avoidedKg`, `gestureB`
 * ni `chosen` (la validation refuse une habitude qui en porterait).
 */
export type HabitEntry = {
  kind: "habit";
  id: string;
  /** Date ISO 8601. */
  date: string;
  gesture: string;
  /**
   * Plante arrosée en bonus (id de l'entrée qui l'a fait pousser), choisie au moment où
   * l'habitude est notée ; null : aucune plante (jardin vide, tout épanoui, habitude déjà
   * notée ce jour-là). Absent sur les habitudes notées avant l'arrosage ciblé : elles ne
   * donnent aucun bonus (la règle de base, elle, vaut pour toutes).
   */
  plant?: string | null;
};

export type JournalEntry = ComparisonEntry | HabitEntry;

/**
 * Produit de l'outil « Fruits et légumes de saison » d'Impact CO2 (API publique), tel que
 * l'écrit `pnpm build-saison` dans saison.generated.json.
 */
export type SeasonalProduct = {
  /** Identifiant de l'API (« pomme », « manguebateau »). */
  slug: string;
  /** Nom renvoyé par l'API (« Mangue (importée par avion) »). */
  label: string;
  /** Catégorie de l'API, telle quelle (« fruits », « légumes »…). */
  category: string;
  /** Mois de saison (1 à 12). */
  months: number[];
  /** kg CO2e par kg de produit. */
  kgCo2ePerKg: number;
  source: GestureSource;
  fictive: boolean;
  /** Fiche Impact CO2 du produit (colonne URL du CSV public), si elle existe. */
  sourceUrl?: string;
};
