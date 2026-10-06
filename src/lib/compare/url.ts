// La comparaison est encodée dans l'URL (/comparer?…), lue côté client (export statique).
import { getGesture } from "@/lib/data";
import { isHabitGesture } from "@/lib/habits";
import {
  areComparable,
  defaultQuantity,
  isValidQuantity,
  type ObjectOption,
} from "./duel";

export type ComparisonState =
  | { step: "first" }
  /** Noter une habitude, sans comparer (?habitude, ou ?habitude=velo une fois choisie). */
  | { step: "habit"; habit: string | null }
  | { step: "second"; first: string }
  | { step: "duel"; a: string; b: string; quantity: number }
  | {
      step: "object";
      object: string;
      option: ObjectOption;
      delivered: boolean;
    };

export type ParsedComparison = {
  state: ComparisonState;
  /** Vrai si l'URL contenait une comparaison illisible (on revient au choix des gestes). */
  invalid: boolean;
};

const OPTIONS: readonly ObjectOption[] = ["neuf", "occasion", "garder"];
const FIRST: ParsedComparison = { state: { step: "first" }, invalid: false };
const INVALID: ParsedComparison = { state: { step: "first" }, invalid: true };

type Params = { get(name: string): string | null; has(name: string): boolean };

export function parseComparison(params: Params): ParsedComparison {
  const habit = params.get("habitude");
  if (habit !== null) {
    if (habit === "")
      return { state: { step: "habit", habit: null }, invalid: false };
    return isHabitGesture(habit)
      ? { state: { step: "habit", habit }, invalid: false }
      : INVALID;
  }
  const objectId = params.get("objet");
  if (objectId !== null) {
    const object = getGesture(objectId);
    if (!object || object.unit !== "objet") return INVALID;
    const option = (params.get("option") ?? "occasion") as ObjectOption;
    if (!OPTIONS.includes(option)) return INVALID;
    const colis = params.get("colis");
    if (colis !== null && colis !== "0" && colis !== "1") return INVALID;
    return {
      state: {
        step: "object",
        object: objectId,
        option,
        delivered: colis !== "0",
      },
      invalid: false,
    };
  }

  const a = params.get("a");
  const b = params.get("b");
  if (a === null && b === null && !params.has("q")) return FIRST;
  const first = a === null ? undefined : getGesture(a);
  if (!first || first.unit === "objet") return INVALID;
  if (b === null) {
    return params.has("q")
      ? INVALID
      : { state: { step: "second", first: first.id }, invalid: false };
  }
  if (!areComparable(first.id, b)) return INVALID;
  const raw = params.get("q");
  const quantity = raw === null ? defaultQuantity(first.unit) : Number(raw);
  if (!isValidQuantity(first.unit, quantity)) return INVALID;
  return { state: { step: "duel", a: first.id, b, quantity }, invalid: false };
}

/** Requête (sans « ? ») pour un état ; chaîne vide pour le premier choix. */
export function comparisonQuery(state: ComparisonState): string {
  const params = new URLSearchParams();
  switch (state.step) {
    case "first":
      break;
    case "habit":
      params.set("habitude", state.habit ?? "");
      break;
    case "second":
      params.set("a", state.first);
      break;
    case "duel":
      params.set("a", state.a);
      params.set("b", state.b);
      params.set("q", String(state.quantity));
      break;
    case "object":
      params.set("objet", state.object);
      params.set("option", state.option);
      params.set("colis", state.delivered ? "1" : "0");
      break;
  }
  return params.toString();
}

export const COMPARE_PATH = "/comparer";

export function comparisonHref(state: ComparisonState): string {
  const query = comparisonQuery(state);
  return query ? `${COMPARE_PATH}?${query}` : COMPARE_PATH;
}
