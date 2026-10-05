// « Raconte ta journée » : forme des gestes repérés par l'IA et validation stricte. Le modèle ne
// fait que reconnaître des gestes du catalogue ; tout ce qui sort du schéma est ignoré, et aucun
// chiffre de CO2e ne vient de lui (les écarts sont calculés par src/lib/calc à la validation).
import { getGesture, getGestures } from "@/lib/data";

/** Longueur maximale du texte (compteur de l'écran 08). */
export const RACONTE_MAX_CHARS = 280;
/** Gestes gardés au plus par analyse (les suivants sont ignorés). */
export const RACONTE_MAX_GESTURES = 8;
/** Longueur maximale d'un extrait (au-delà, la détection est ignorée). */
export const RACONTE_MAX_EXCERPT = 140;
/** Distances acceptées telles quelles (mêmes bornes que le curseur du duel). */
export const RACONTE_KM_RANGE = { min: 1, max: 1000 } as const;

/** Mode d'acquisition écrit pour un objet (« d'occasion », « je garde le mien »). */
export type DetectedMode = "neuf" | "occasion" | "garder";
/** explicit : le geste est nommé ; inferred : il est déduit (« un burger » → repas au bœuf). */
export type Certainty = "explicit" | "inferred";

export type Detection = {
  /** Extrait du texte qui justifie la détection, tel qu'écrit. */
  excerpt: string;
  gestureId: string;
  certainty: Certainty;
  /** Distance en km si elle est écrite (trajets seulement), sinon null. */
  quantity: number | null;
  /** Objets seulement : mode écrit, sinon null. */
  mode: DetectedMode | null;
};

export const DETECTED_MODES: readonly DetectedMode[] = [
  "neuf",
  "occasion",
  "garder",
];
export const CERTAINTIES: readonly Certainty[] = ["explicit", "inferred"];

/** Ids des gestes que le modèle peut renvoyer (l'enum exact du schéma de sortie). */
export function catalogIds(): string[] {
  return getGestures().map((gesture) => gesture.id);
}

/**
 * Texte comparable, appliqué au texte et à l'extrait : NFC, minuscules, apostrophes et
 * guillemets droits ou typographiques confondus (espaces intérieurs des guillemets français
 * compris), tirets confondus, espaces multiples et insécables réduits à une espace.
 */
export function normalizeForMatch(value: string): string {
  return value
    .normalize("NFC")
    .toLowerCase()
    .replace(/[’‘‚‛`´ʼ′]/g, "'")
    .replace(/[«»“”„‟″]/g, '"')
    .replace(/[‐‑‒–—―−]/g, "-")
    .replace(/[\s\u00a0\u202f\u2007\u2009\u200a]+/g, " ")
    .replace(/" /g, '"')
    .replace(/ "/g, '"')
    .trim();
}

/**
 * Texte envoyé au modèle : les chevrons sont remplacés pour que le texte ne puisse pas fermer
 * la balise qui l'entoure. Les extraits sont vérifiés sur ce même texte.
 */
export function sanitizeText(text: string): string {
  return text.replace(/</g, "‹").replace(/>/g, "›").trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

const FIELDS = new Set([
  "excerpt",
  "gestureId",
  "certainty",
  "quantity",
  "mode",
]);

/** Distance retenue : un nombre écrit, arrondi au km, dans les bornes ; sinon null (demandée). */
function validQuantity(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  const km = Math.round(value);
  return km >= RACONTE_KM_RANGE.min && km <= RACONTE_KM_RANGE.max ? km : null;
}

/** Une détection validée, ou null si quoi que ce soit sort du schéma. */
export function parseDetection(value: unknown, text: string): Detection | null {
  if (!isRecord(value)) return null;
  if (Object.keys(value).some((key) => !FIELDS.has(key))) return null;
  const { excerpt, gestureId, certainty, quantity, mode } = value;
  if (typeof gestureId !== "string") return null;
  const gesture = getGesture(gestureId);
  if (!gesture || gesture.fictive) return null;
  if (!CERTAINTIES.includes(certainty as Certainty)) return null;
  if (typeof excerpt !== "string") return null;
  const cleanExcerpt = excerpt.trim();
  if (!cleanExcerpt || cleanExcerpt.length > RACONTE_MAX_EXCERPT) return null;
  // L'extrait doit figurer dans le texte : sinon le modèle l'a inventé.
  if (!normalizeForMatch(text).includes(normalizeForMatch(cleanExcerpt)))
    return null;
  if (quantity !== null && typeof quantity !== "number") return null;
  if (mode !== null && !DETECTED_MODES.includes(mode as DetectedMode))
    return null;
  return {
    excerpt: cleanExcerpt,
    gestureId,
    certainty: certainty as Certainty,
    // La quantité n'a de sens que pour les trajets (les autres unités valent toujours 1).
    quantity: gesture.unit === "km" ? validQuantity(quantity) : null,
    mode: gesture.unit === "objet" ? (mode as DetectedMode | null) : null,
  };
}

/**
 * Sortie du modèle → détections valides. Les éléments hors schéma sont ignorés un par un, les
 * doublons (même geste, même extrait) retirés, et la liste coupée à RACONTE_MAX_GESTURES.
 */
export function parseDetections(raw: unknown, text: string): Detection[] {
  if (!isRecord(raw) || !Array.isArray(raw.gestures)) return [];
  const detections: Detection[] = [];
  const seen = new Set<string>();
  for (const item of raw.gestures) {
    const detection = parseDetection(item, text);
    if (!detection) continue;
    const key = `${detection.gestureId}|${normalizeForMatch(detection.excerpt)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    detections.push(detection);
    if (detections.length >= RACONTE_MAX_GESTURES) break;
  }
  return detections;
}
