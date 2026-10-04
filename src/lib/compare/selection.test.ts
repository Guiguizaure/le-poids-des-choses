import { describe, expect, it } from "vitest";
import {
  badgeFor,
  EMPTY_SELECTION,
  isSelectable,
  selectionCount,
  toggleGesture,
  type PairSelection,
} from "./selection";

const select = (selection: PairSelection, id: string): PairSelection => {
  const result = toggleGesture(selection, id);
  if (result.kind !== "selection")
    throw new Error(`attendu une sélection, reçu ${result.kind}`);
  return result.selection;
};

describe("choix des deux gestes sur un seul écran", () => {
  it("premier toucher = geste 1, second toucher = geste 2", () => {
    const one = select(EMPTY_SELECTION, "tgv");
    expect(one).toEqual({ first: "tgv", second: null });
    expect(badgeFor(one, "tgv")).toBe(1);
    const two = select(one, "avion");
    expect(two).toEqual({ first: "tgv", second: "avion" });
    expect(badgeFor(two, "avion")).toBe(2);
    expect(selectionCount(two)).toBe(2);
  });
  it("dès le premier choix, les gestes d'une autre unité ne sont plus sélectionnables", () => {
    const one = select(EMPTY_SELECTION, "tgv");
    expect(isSelectable(one, "avion")).toBe(true);
    expect(isSelectable(one, "repas-boeuf")).toBe(false);
    expect(isSelectable(one, "eau-robinet")).toBe(false);
    expect(isSelectable(one, "jean")).toBe(false);
    expect(toggleGesture(one, "repas-boeuf")).toEqual({ kind: "ignored" });
  });
  it("retoucher un geste choisi le désélectionne ; le 2 devient alors le 1", () => {
    const two = select(select(EMPTY_SELECTION, "tgv"), "avion");
    expect(select(two, "avion")).toEqual({ first: "tgv", second: null });
    expect(select(two, "tgv")).toEqual({ first: "avion", second: null });
    expect(select(select(EMPTY_SELECTION, "tgv"), "tgv")).toEqual(
      EMPTY_SELECTION,
    );
  });
  it("un troisième geste compatible remplace le second", () => {
    const two = select(select(EMPTY_SELECTION, "tgv"), "avion");
    expect(select(two, "bus")).toEqual({ first: "tgv", second: "bus" });
  });
  it("un objet choisi en premier mène directement aux trois options", () => {
    expect(toggleGesture(EMPTY_SELECTION, "jean")).toEqual({
      kind: "object",
      object: "jean",
    });
    expect(toggleGesture(EMPTY_SELECTION, "smartphone")).toEqual({
      kind: "object",
      object: "smartphone",
    });
  });
  it("tout est sélectionnable au départ ; geste inconnu ignoré", () => {
    expect(isSelectable(EMPTY_SELECTION, "repas-boeuf")).toBe(true);
    expect(toggleGesture(EMPTY_SELECTION, "fusee")).toEqual({
      kind: "ignored",
    });
  });
});
