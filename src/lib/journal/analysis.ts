// Carnet analysé : tri, filtres (dans l'URL) et choix légers des 7 derniers jours.
// Fonctions pures : aucune ne lit l'horloge ni le stockage.
import { CATEGORY_ORDER } from "@/lib/compare/duel";
import { getGesture } from "@/lib/data";
import type { Category, JournalEntry } from "@/lib/data/types";
import { gardenDay } from "@/lib/garden/seasons";
import { doneGesture, entryKg, isHabit, isLightChoice } from "./kind";

export type JournalSort = "date" | "ecart" | "categorie";
export type ChoiceFilter = "tous" | "legers" | "notes" | "habitudes";

/** Vue du carnet : tri, catégorie (null : toutes), type de choix. */
export type JournalView = {
  tri: JournalSort;
  categorie: Category | null;
  choix: ChoiceFilter;
};

export const DEFAULT_VIEW: JournalView = {
  tri: "date",
  categorie: null,
  choix: "tous",
};

export const SORT_LABELS: Record<JournalSort, string> = {
  date: "Date",
  ecart: "Écart",
  categorie: "Catégorie",
};

export const CHOICE_LABELS: Record<ChoiceFilter, string> = {
  tous: "Tous les choix",
  legers: "Choix légers",
  notes: "Choix notés (plus lourds)",
  habitudes: "Habitudes tenues",
};

const SORTS = Object.keys(SORT_LABELS) as JournalSort[];
const CHOICES = Object.keys(CHOICE_LABELS) as ChoiceFilter[];

function oneOf<T extends string>(
  value: string | null | undefined,
  allowed: readonly T[],
): T | null {
  return value && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : null;
}

/** Vue lue dans l'URL (?tri=ecart&categorie=transport&choix=legers) ; valeur inconnue → défaut. */
export function parseView(params: {
  get(name: string): string | null;
}): JournalView {
  return {
    tri: oneOf(params.get("tri"), SORTS) ?? DEFAULT_VIEW.tri,
    categorie: oneOf(params.get("categorie"), CATEGORY_ORDER),
    choix: oneOf(params.get("choix"), CHOICES) ?? DEFAULT_VIEW.choix,
  };
}

/** Partie « ?… » de l'URL d'une vue ; vide pour la vue par défaut. */
export function viewQuery(view: JournalView): string {
  const params = new URLSearchParams();
  if (view.tri !== DEFAULT_VIEW.tri) params.set("tri", view.tri);
  if (view.categorie) params.set("categorie", view.categorie);
  if (view.choix !== DEFAULT_VIEW.choix) params.set("choix", view.choix);
  const query = params.toString();
  return query ? `?${query}` : "";
}

/** Catégorie du geste choisi (null s'il n'existe plus dans les données). */
export function entryCategoryId(entry: JournalEntry): Category | null {
  return getGesture(doneGesture(entry))?.category ?? null;
}

export const isLight = isLightChoice;

function matchesChoice(entry: JournalEntry, choix: ChoiceFilter): boolean {
  switch (choix) {
    case "tous":
      return true;
    case "legers":
      return isLight(entry);
    case "notes":
      return !isHabit(entry) && !isLight(entry);
    case "habitudes":
      return isHabit(entry);
  }
}

export function filterEntries(
  entries: readonly JournalEntry[],
  view: Pick<JournalView, "categorie" | "choix">,
): JournalEntry[] {
  return entries.filter(
    (entry) =>
      (!view.categorie || entryCategoryId(entry) === view.categorie) &&
      matchesChoice(entry, view.choix),
  );
}

const time = (entry: JournalEntry) => new Date(entry.date).getTime() || 0;
const newestFirst = (a: JournalEntry, b: JournalEntry) => time(b) - time(a);

/**
 * date : du plus récent au plus ancien ; écart : du plus grand au plus petit, les habitudes
 * (aucun kg) à la fin ; catégorie : dans l'ordre des catégories du parcours. À égalité, le plus
 * récent d'abord.
 */
export function sortEntries(
  entries: readonly JournalEntry[],
  sort: JournalSort,
): JournalEntry[] {
  const rank = (entry: JournalEntry) => {
    const category = entryCategoryId(entry);
    return category ? CATEGORY_ORDER.indexOf(category) : CATEGORY_ORDER.length;
  };
  return [...entries].sort((a, b) => {
    if (sort === "ecart") {
      if (isHabit(a) !== isHabit(b)) return isHabit(a) ? 1 : -1;
      if (entryKg(b) !== entryKg(a)) return entryKg(b) - entryKg(a);
    }
    if (sort === "categorie" && rank(a) !== rank(b)) return rank(a) - rank(b);
    return newestFirst(a, b);
  });
}

/** Le carnet tel que la vue le demande : filtré, puis trié. */
export function analyzeJournal(
  entries: readonly JournalEntry[],
  view: JournalView,
): JournalEntry[] {
  return sortEntries(filterEntries(entries, view), view.tri);
}

/** Catégories présentes dans le carnet, dans l'ordre du parcours (options du filtre). */
export function categoriesIn(entries: readonly JournalEntry[]): Category[] {
  const present = new Set(entries.map(entryCategoryId));
  return CATEGORY_ORDER.filter((category) => present.has(category));
}

export type DayCount = {
  /** Jour local (AAAA-MM-JJ). */
  key: string;
  /** Minuit local de ce jour. */
  date: Date;
  count: number;
};

function dayKey(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Nombre de choix légers par jour (heure locale) sur les `days` derniers jours, aujourd'hui
 * compris, du plus ancien au plus récent.
 */
export function lightChoicesByDay(
  entries: readonly JournalEntry[],
  now: Date,
  days = 7,
): DayCount[] {
  const result: DayCount[] = Array.from({ length: days }, (_, index) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - (days - 1 - index),
    );
    return { key: dayKey(date), date, count: 0 };
  });
  const byKey = new Map(result.map((day) => [day.key, day]));
  for (const entry of entries) {
    if (!isLight(entry)) continue;
    const date = new Date(entry.date);
    if (Number.isNaN(date.getTime())) continue;
    const day = byKey.get(dayKey(date));
    if (day) day.count++;
  }
  return result;
}

/**
 * Jours arrosés (au moins une habitude notée, jour du jardin à Paris) parmi les `days` derniers
 * jours, aujourd'hui compris.
 */
export function wateredDaysInLast(
  entries: readonly JournalEntry[],
  now: Date,
  days = 7,
): number {
  const keys = new Set(
    Array.from({ length: days }, (_, index) =>
      gardenDay(new Date(now.getTime() - index * 24 * 60 * 60 * 1000)),
    ),
  );
  const watered = new Set<string>();
  for (const entry of entries) {
    if (!isHabit(entry)) continue;
    const day = gardenDay(entry.date);
    if (day && keys.has(day)) watered.add(day);
  }
  return watered.size;
}
