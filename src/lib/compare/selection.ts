// Choix des deux gestes sur un seul écran : premier toucher = geste 1, second = geste 2.
import { getGesture } from "@/lib/data";
import { areComparable } from "./duel";

export type PairSelection = { first: string | null; second: string | null };

export const EMPTY_SELECTION: PairSelection = { first: null, second: null };

export type ToggleResult =
  | { kind: "selection"; selection: PairSelection }
  /** Un objet mène directement aux trois options (neuf, d'occasion, garder). */
  | { kind: "object"; object: string }
  /** Geste d'une autre unité : non sélectionnable. */
  | { kind: "ignored" };

/** Un geste peut-il être touché ? Après le premier choix, seuls ceux de même unité. */
export function isSelectable(selection: PairSelection, id: string): boolean {
  if (!selection.first) return !!getGesture(id);
  return (
    id === selection.first ||
    id === selection.second ||
    areComparable(selection.first, id)
  );
}

/** Numéro affiché sur la carte (badge « 1 » ou « 2 »), ou null. */
export function badgeFor(selection: PairSelection, id: string): 1 | 2 | null {
  if (id === selection.first) return 1;
  if (id === selection.second) return 2;
  return null;
}

/**
 * Touche un geste : le choisit (1 puis 2), le désélectionne s'il l'était déjà (le 2 devient
 * alors le 1), remplace le second, ou ouvre directement un objet.
 */
export function toggleGesture(
  selection: PairSelection,
  id: string,
): ToggleResult {
  const gesture = getGesture(id);
  if (!gesture || !isSelectable(selection, id)) return { kind: "ignored" };
  if (id === selection.first)
    return {
      kind: "selection",
      selection: { first: selection.second, second: null },
    };
  if (id === selection.second)
    return { kind: "selection", selection: { ...selection, second: null } };
  if (!selection.first) {
    if (gesture.unit === "objet") return { kind: "object", object: id };
    return { kind: "selection", selection: { first: id, second: null } };
  }
  return { kind: "selection", selection: { ...selection, second: id } };
}

export function selectionCount(selection: PairSelection): number {
  return (selection.first ? 1 : 0) + (selection.second ? 1 : 0);
}
