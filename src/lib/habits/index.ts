// « Tenir une habitude » : gestes qu'on peut noter sans les comparer à rien. Une table écrite à
// la main, comme ALTERNATIVES : chaque habitude est plus légère que l'option qu'on aurait prise
// autrement (vérifié par un test, avec les données). Une habitude ne compte aucun kg : elle
// arrose le jardin.
import { gestureLabel, getGesture } from "@/lib/data";
import type { Locale } from "@/lib/i18n/routes";
import { HABIT_NAMES } from "@/lib/i18n/messages/garden";

export type Habit = {
  /** Id du geste dans le catalogue. */
  gesture: string;
  /** Nom court, sur les boutons et dans le carnet : « À vélo », « Repas végétarien ». */
  label: string;
  /** Ce que la personne déclare faire déjà (« Mes habitudes ») : « Je me déplace à vélo ». */
  declaration: string;
};

/** Gestes qu'on peut tenir comme habitude, dans l'ordre d'affichage. */
const HABIT_GESTURES = [
  "velo",
  "marche",
  "bus",
  "metro",
  "ter",
  "tgv",
  "repas-vegetarien",
  "repas-vegetalien",
  "eau-robinet",
  "boisson-soja",
  "magasin-pied",
  "point-relais-pied",
] as const;

/** Habitudes avec leurs noms dans une langue (src/lib/i18n/messages/garden.ts). */
export function habitsIn(locale: Locale): readonly Habit[] {
  return HABIT_GESTURES.map((gesture) => ({
    gesture,
    ...HABIT_NAMES[locale][gesture],
  }));
}

export const HABITS: readonly Habit[] = habitsIn("fr");

export function getHabit(gestureId: string): Habit | undefined {
  return HABITS.find((habit) => habit.gesture === gestureId);
}

/** Vrai si ce geste peut être noté comme habitude (et existe encore dans les données). */
export function isHabitGesture(gestureId: string): boolean {
  return (
    getHabit(gestureId) !== undefined && getGesture(gestureId) !== undefined
  );
}

/** Habitudes proposées, celles que la personne a déclarées d'abord (ordre de la table). */
export function orderedHabits(
  declared: readonly string[],
  locale: Locale = "fr",
): Habit[] {
  const mine = new Set(declared);
  const available = habitsIn(locale).filter((habit) =>
    getGesture(habit.gesture),
  );
  return [
    ...available.filter((habit) => mine.has(habit.gesture)),
    ...available.filter((habit) => !mine.has(habit.gesture)),
  ];
}

/** Nom d'une habitude notée (repli sur le libellé du geste, puis sur l'id). */
export function habitLabel(gestureId: string, locale: Locale = "fr"): string {
  return (
    HABIT_NAMES[locale][gestureId]?.label ?? gestureLabel(gestureId, locale)
  );
}
