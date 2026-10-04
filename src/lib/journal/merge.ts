import type { JournalEntry } from "@/lib/data/types";
import { parseJournalText, sortEntries } from "./schema";

/** Ajoute une entrée au carnet (qui ne fait que s'allonger) ; ignorée si son id existe déjà. */
export function appendEntry(
  entries: readonly JournalEntry[],
  entry: JournalEntry,
): JournalEntry[] {
  if (entries.some((existing) => existing.id === entry.id)) return [...entries];
  return sortEntries([...entries, entry]);
}

/** Fusionne deux carnets par id, sans doublons ; en cas de conflit, l'entrée existante gagne. */
export function mergeEntries(
  existing: readonly JournalEntry[],
  incoming: readonly JournalEntry[],
): { entries: JournalEntry[]; added: number } {
  const ids = new Set(existing.map((entry) => entry.id));
  const additions = incoming.filter((entry) => {
    if (ids.has(entry.id)) return false;
    ids.add(entry.id);
    return true;
  });
  return {
    entries: sortEntries([...existing, ...additions]),
    added: additions.length,
  };
}

export const EXPORT_APP = "le-poids-des-choses";

/** Contenu du fichier d'export (JSON lisible). */
export function exportJournal(
  entries: readonly JournalEntry[],
  now: Date = new Date(),
): string {
  return JSON.stringify(
    { app: EXPORT_APP, version: 1, exportedAt: now.toISOString(), entries },
    null,
    2,
  );
}

export function exportFileName(now: Date = new Date()): string {
  return `le-poids-des-choses-carnet-${now.toISOString().slice(0, 10)}.json`;
}

export type ImportResult = {
  entries: JournalEntry[];
  added: number;
  invalid: number;
};

/** Importe un fichier exporté (ou un simple tableau d'entrées) en le fusionnant au carnet. */
export function importJournal(
  existing: readonly JournalEntry[],
  text: string,
): ImportResult {
  const parsed = parseJournalText(text);
  const { entries, added } = mergeEntries(existing, parsed.entries);
  return { entries, added, invalid: parsed.invalid.length };
}
