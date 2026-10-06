import { describe, expect, it } from "vitest";
import type { ComparisonEntry, HabitEntry } from "@/lib/data/types";
import { canonicalJson } from "@/lib/sync/canonical";
import {
  analyzeJournal,
  categoriesIn,
  DEFAULT_VIEW,
  lightChoicesByDay,
  parseView,
  wateredDaysInLast,
} from "./analysis";
import { entryCategory, entryPicto, entryTitle } from "./display";
import { createEntry, createHabitEntry } from "./entry";
import {
  doneGesture,
  entryKg,
  isComparison,
  isHabit,
  isLightChoice,
} from "./kind";
import { exportJournal, importJournal } from "./merge";
import { isJournalEntry, parseJournal, serializeJournal } from "./schema";

const NOW = new Date("2026-10-06T10:00:00.000Z");

const habit = (id: string, date: string, gesture = "velo"): HabitEntry => ({
  kind: "habit",
  id,
  date,
  gesture,
});

const comparison = (
  id: string,
  date: string,
  avoidedKg = 2,
): ComparisonEntry => ({
  id,
  date,
  gestureA: "voiture",
  gestureB: "velo",
  quantity: 10,
  chosen: "b",
  avoidedKg,
});

describe("entrée habitude : format et validation", () => {
  it("createHabitEntry : un geste, une date, aucun kg", () => {
    const entry = createHabitEntry("repas-vegetarien", { now: NOW, id: "h" });
    expect(entry).toEqual({
      kind: "habit",
      id: "h",
      date: NOW.toISOString(),
      gesture: "repas-vegetarien",
    });
    expect(isJournalEntry(entry)).toBe(true);
    expect("avoidedKg" in entry).toBe(false);
  });
  it("seuls les gestes de la table HABITS se notent en habitude", () => {
    expect(() => createHabitEntry("avion")).toThrow(/habitude/);
    expect(() => createHabitEntry("inconnu")).toThrow();
  });
  it("une habitude qui porte des champs de comparaison est refusée", () => {
    const base = habit("h", NOW.toISOString());
    for (const field of [
      "avoidedKg",
      "gestureA",
      "gestureB",
      "chosen",
      "quantity",
      "modeA",
      "modeB",
    ])
      expect(isJournalEntry({ ...base, [field]: 0 }), field).toBe(false);
  });
  it("kind inconnu, geste manquant ou date illisible : refusée", () => {
    const base = habit("h", NOW.toISOString());
    expect(isJournalEntry({ ...base, kind: "autre" })).toBe(false);
    expect(isJournalEntry({ ...base, kind: "comparison" })).toBe(false);
    expect(isJournalEntry({ ...base, gesture: "" })).toBe(false);
    expect(isJournalEntry({ ...base, date: "hier" })).toBe(false);
  });
  it("champs inconnus tolérés dans une habitude", () => {
    expect(
      isJournalEntry({ ...habit("h", NOW.toISOString()), note: "x" }),
    ).toBe(true);
  });
  it("les carnets existants restent lisibles et ne sont jamais réécrits", () => {
    const old = createEntry(
      { gestureA: "voiture", gestureB: "velo", quantity: 10, chosen: "b" },
      { now: NOW, id: "c" },
    );
    expect("kind" in old).toBe(false);
    const text = serializeJournal([old]);
    const parsed = parseJournal(JSON.parse(text));
    expect(parsed.entries).toHaveLength(1);
    // Même forme canonique : même empreinte sur le compte, aucun conflit.
    expect(canonicalJson(parsed.entries[0])).toBe(canonicalJson(old));
  });
  it("carnet mêlé : export puis import gardent les deux sortes d'entrées", () => {
    const entries = [
      comparison("c", "2026-10-01T10:00:00.000Z"),
      habit("h", "2026-10-02T10:00:00.000Z"),
    ];
    const text = exportJournal(entries, NOW);
    const result = importJournal([], text);
    expect(result.entries).toEqual(entries);
    expect(result.invalid).toBe(0);
  });
});

describe("sortes d'entrées", () => {
  const h = habit("h", NOW.toISOString(), "repas-vegetarien");
  const c = comparison("c", NOW.toISOString());
  it("habitude ou comparaison", () => {
    expect(isHabit(h)).toBe(true);
    expect(isComparison(h)).toBe(false);
    expect(isComparison(c)).toBe(true);
    expect(isLightChoice(h)).toBe(false);
    expect(isLightChoice(c)).toBe(true);
    expect(isLightChoice(comparison("lourd", NOW.toISOString(), 0))).toBe(
      false,
    );
  });
  it("une habitude ne compte aucun kg", () => {
    expect(entryKg(h)).toBe(0);
    expect(entryKg(c)).toBe(2);
  });
  it("geste fait", () => {
    expect(doneGesture(h)).toBe("repas-vegetarien");
    expect(doneGesture(c)).toBe("velo");
  });
  it("titre, catégorie et picto d'une habitude", () => {
    expect(entryTitle(h)).toBe("Repas végétarien");
    expect(entryTitle(habit("v", NOW.toISOString(), "velo"))).toBe("À vélo");
    expect(entryCategory(h)).toBe("Manger");
    expect(entryPicto(h)).toBe("picto-repas-vegetarien");
  });
});

describe("carnet analysé avec des habitudes", () => {
  const entries = [
    comparison("leger", "2026-10-04T10:00:00.000Z", 5),
    comparison("lourd", "2026-10-05T10:00:00.000Z", 0),
    habit("velo", "2026-10-05T12:00:00.000Z", "velo"),
    habit("repas", "2026-10-06T08:00:00.000Z", "repas-vegetarien"),
  ];
  it("filtre « habitudes », et les autres filtres les écartent", () => {
    const ids = (choix: string) =>
      analyzeJournal(entries, parseView(new URLSearchParams({ choix }))).map(
        (e) => e.id,
      );
    expect(ids("habitudes")).toEqual(["repas", "velo"]);
    expect(ids("legers")).toEqual(["leger"]);
    expect(ids("notes")).toEqual(["lourd"]);
  });
  it("tri par écart : les habitudes (aucun kg) à la fin", () => {
    const sorted = analyzeJournal(entries, { ...DEFAULT_VIEW, tri: "ecart" });
    expect(sorted.map((e) => e.id)).toEqual([
      "leger",
      "lourd",
      "repas",
      "velo",
    ]);
  });
  it("catégorie d'une habitude : celle de son geste", () => {
    expect(categoriesIn([entries[3]])).toEqual(["alimentation"]);
  });
  it("les barres de la semaine ne comptent que les choix légers", () => {
    const total = lightChoicesByDay(entries, NOW).reduce(
      (sum, day) => sum + day.count,
      0,
    );
    expect(total).toBe(1);
  });
  it("jours arrosés de la semaine : jours distincts, heure de Paris", () => {
    expect(wateredDaysInLast(entries, NOW)).toBe(2);
    // Deux habitudes le même jour : un seul jour arrosé.
    expect(
      wateredDaysInLast(
        [...entries, habit("encore", "2026-10-06T09:00:00.000Z", "marche")],
        NOW,
      ),
    ).toBe(2);
    expect(
      wateredDaysInLast([habit("vieux", "2026-09-01T10:00:00.000Z")], NOW),
    ).toBe(0);
  });
});
