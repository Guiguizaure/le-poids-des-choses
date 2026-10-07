// Format du carnet enregistré sur l'appareil, validation et migrations.
import type { AcquisitionMode, JournalEntry } from "@/lib/data/types";

/** Clé versionnée : une future version du format utilisera une autre clé et migrera celle-ci. */
export const STORAGE_KEY = "lpdc:journal:v1";
export const FORMAT_VERSION = 1;

export type StoredJournal = {
  version: typeof FORMAT_VERSION;
  entries: unknown[];
};

const MODES: readonly AcquisitionMode[] = [
  "neuf",
  "occasion",
  "occasion-livree",
  "garder",
];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

/** Champs d'une comparaison, interdits dans une habitude (qui ne compte aucun kg). */
const COMPARISON_FIELDS = [
  "gestureA",
  "gestureB",
  "quantity",
  "chosen",
  "avoidedKg",
  "modeA",
  "modeB",
  "species",
] as const;

/**
 * Vrai si `value` est une entrée de carnet utilisable : une comparaison (sans `kind`) ou une
 * habitude (`kind: "habit"`). Les champs inconnus sont tolérés, sauf ceux d'une comparaison
 * dans une habitude ; une autre valeur de `kind` rend l'entrée illisible (mise de côté).
 */
export function isJournalEntry(value: unknown): value is JournalEntry {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const entry = value as Record<string, unknown>;
  if (!isNonEmptyString(entry.id)) return false;
  if (!isNonEmptyString(entry.date) || Number.isNaN(Date.parse(entry.date)))
    return false;
  if ("kind" in entry) {
    if (entry.kind !== "habit" || !isNonEmptyString(entry.gesture))
      return false;
    // Plante arrosée en bonus : l'id d'une entrée, ou null (aucune).
    if (
      entry.plant !== undefined &&
      entry.plant !== null &&
      !isNonEmptyString(entry.plant)
    )
      return false;
    return COMPARISON_FIELDS.every((field) => !(field in entry));
  }
  if (!isNonEmptyString(entry.gestureA) || !isNonEmptyString(entry.gestureB))
    return false;
  if (
    !isNonNegativeNumber(entry.quantity) ||
    !isNonNegativeNumber(entry.avoidedKg)
  )
    return false;
  if (entry.chosen !== "a" && entry.chosen !== "b") return false;
  for (const mode of [entry.modeA, entry.modeB]) {
    if (mode !== undefined && !MODES.includes(mode as AcquisitionMode))
      return false;
  }
  // Espèce choisie : un identifiant de dessin ; une espèce inconnue est ignorée au rendu.
  if (
    entry.species !== undefined &&
    !/^(arbre|fleur)-\d+$/.test(String(entry.species))
  )
    return false;
  return true;
}

export type ParsedJournal = {
  entries: JournalEntry[];
  /** Éléments illisibles, conservés tels quels pour ne rien perdre. */
  invalid: unknown[];
};

/**
 * Lit un carnet (objet { version, entries } ou simple tableau). Ne lève jamais d'erreur :
 * un contenu illisible donne un carnet vide, une entrée invalide est mise de côté.
 */
export function parseJournal(data: unknown): ParsedJournal {
  const list = Array.isArray(data)
    ? data
    : data &&
        typeof data === "object" &&
        Array.isArray((data as { entries?: unknown }).entries)
      ? (data as { entries: unknown[] }).entries
      : [];
  const entries: JournalEntry[] = [];
  const invalid: unknown[] = [];
  const seen = new Set<string>();
  for (const item of list) {
    if (!isJournalEntry(item)) invalid.push(item);
    else if (!seen.has(item.id)) {
      seen.add(item.id);
      entries.push(item);
    }
  }
  return { entries: sortEntries(entries), invalid };
}

/** Lit du texte JSON sans jamais lever d'erreur. */
export function parseJournalText(text: string | null): ParsedJournal {
  if (!text) return { entries: [], invalid: [] };
  try {
    return parseJournal(JSON.parse(text));
  } catch {
    return { entries: [], invalid: [] };
  }
}

export function serializeJournal(
  entries: readonly JournalEntry[],
  invalid: readonly unknown[] = [],
): string {
  const stored: StoredJournal = {
    version: FORMAT_VERSION,
    entries: [...entries, ...invalid],
  };
  return JSON.stringify(stored);
}

/** Ordre stable : date, puis id (même carnet = même ordre sur tous les appareils). */
export function sortEntries(entries: readonly JournalEntry[]): JournalEntry[] {
  return [...entries].sort(
    (a, b) =>
      Date.parse(a.date) - Date.parse(b.date) ||
      (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
  );
}

/**
 * Migrations depuis d'anciens formats : chacune lit une ancienne clé et renvoie des données
 * pour le format actuel. Aucune pour l'instant (v1 est le premier format) ; une v2 ajoutera
 * ici la lecture de « lpdc:journal:v1 ».
 */
export type Migration = { fromKey: string; migrate: (raw: string) => unknown };
export const MIGRATIONS: readonly Migration[] = [];
