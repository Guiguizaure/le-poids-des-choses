// « Tenir une habitude » : gestes qu'on peut noter sans les comparer à rien. Une table écrite à
// la main, comme ALTERNATIVES : chaque habitude est plus légère que l'option qu'on aurait prise
// autrement (vérifié par un test, avec les données). Une habitude ne compte aucun kg : elle
// arrose le jardin.
import { getGesture } from "@/lib/data";

export type Habit = {
  /** Id du geste dans le catalogue. */
  gesture: string;
  /** Nom court, sur les boutons et dans le carnet : « À vélo », « Repas végétarien ». */
  label: string;
  /** Ce que la personne déclare faire déjà (« Mes habitudes ») : « Je me déplace à vélo ». */
  declaration: string;
};

export const HABITS: readonly Habit[] = [
  { gesture: "velo", label: "À vélo", declaration: "Je me déplace à vélo" },
  { gesture: "marche", label: "À pied", declaration: "Je me déplace à pied" },
  { gesture: "bus", label: "En bus", declaration: "Je prends le bus" },
  { gesture: "metro", label: "En métro", declaration: "Je prends le métro" },
  { gesture: "ter", label: "En TER", declaration: "Je prends le TER" },
  { gesture: "tgv", label: "En TGV", declaration: "Je prends le TGV" },
  {
    gesture: "repas-vegetarien",
    label: "Repas végétarien",
    declaration: "Je mange végétarien",
  },
  {
    gesture: "repas-vegetalien",
    label: "Repas végétal",
    declaration: "Je mange végétal",
  },
  {
    gesture: "eau-robinet",
    label: "Eau du robinet",
    declaration: "Je bois l’eau du robinet",
  },
  {
    gesture: "boisson-soja",
    label: "Boisson au soja",
    declaration: "Je bois des boissons au soja",
  },
  {
    gesture: "magasin-pied",
    label: "Courses à pied",
    declaration: "Je fais mes courses à pied",
  },
  {
    gesture: "point-relais-pied",
    label: "Colis à pied",
    declaration: "Je vais chercher mes colis à pied",
  },
];

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
export function orderedHabits(declared: readonly string[]): Habit[] {
  const mine = new Set(declared);
  const available = HABITS.filter((habit) => getGesture(habit.gesture));
  return [
    ...available.filter((habit) => mine.has(habit.gesture)),
    ...available.filter((habit) => !mine.has(habit.gesture)),
  ];
}

/** Nom d'une habitude notée (repli sur le libellé du geste, puis sur l'id). */
export function habitLabel(gestureId: string): string {
  return (
    getHabit(gestureId)?.label ?? getGesture(gestureId)?.label ?? gestureId
  );
}
