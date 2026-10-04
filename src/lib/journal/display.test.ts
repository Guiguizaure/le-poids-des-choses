import { describe, expect, it } from "vitest";
import type { JournalEntry } from "@/lib/data/types";
import { ILLUSTRATION_SPECS } from "@/lib/illustrations/specs";
import { getGestures } from "@/lib/data";
import {
  entryCategory,
  entryPicto,
  entryTitle,
  pictoFor,
  relativeDay,
} from "./display";

const base: JournalEntry = {
  id: "x",
  date: "2026-10-04T10:00:00.000Z",
  gestureA: "avion",
  gestureB: "tgv",
  quantity: 100,
  chosen: "b",
  avoidedKg: 20,
};

describe("entryTitle", () => {
  it("élision devant une voyelle", () => {
    expect(entryTitle(base)).toBe("TGV plutôt qu’avion (court courrier)");
  });
  it("garde les sigles en majuscules", () => {
    expect(
      entryTitle({ ...base, gestureA: "tgv", gestureB: "velo", chosen: "b" }),
    ).toBe("Vélo plutôt que TGV");
  });
  it("raccourcit le mot commun : repas", () => {
    expect(
      entryTitle({
        ...base,
        gestureA: "repas-boeuf",
        gestureB: "repas-vegetarien",
      }),
    ).toBe("Repas végétarien plutôt que bœuf");
  });
  it("objets : modes accordés", () => {
    const jean = {
      ...base,
      gestureA: "jean",
      gestureB: "jean",
      modeA: "neuf",
      modeB: "occasion",
    } as const;
    expect(entryTitle({ ...jean, chosen: "a" })).toBe(
      "Jean neuf plutôt que d’occasion",
    );
    expect(entryTitle({ ...jean, chosen: "b" })).toBe(
      "Jean d’occasion plutôt que neuf",
    );
    expect(
      entryTitle({
        ...base,
        gestureA: "television",
        gestureB: "television",
        modeA: "garder",
        modeB: "occasion-livree",
        chosen: "a",
      }),
    ).toBe("Télévision gardée plutôt que d’occasion livrée");
  });
});

describe("relativeDay", () => {
  const now = new Date(2026, 9, 7, 15); // mercredi 7 octobre 2026
  it("aujourd'hui, hier, jour de la semaine, date", () => {
    expect(relativeDay(new Date(2026, 9, 7, 8).toISOString(), now)).toBe(
      "Aujourd’hui",
    );
    expect(relativeDay(new Date(2026, 9, 6, 23).toISOString(), now)).toBe(
      "Hier",
    );
    expect(relativeDay(new Date(2026, 9, 5, 9).toISOString(), now)).toBe(
      "Lundi",
    );
    expect(relativeDay(new Date(2026, 8, 12, 9).toISOString(), now)).toMatch(
      /^12 sept\.?$/,
    );
    expect(relativeDay(new Date(2025, 8, 12, 9).toISOString(), now)).toMatch(
      /2025/,
    );
  });
  it("date illisible : vide", () => {
    expect(relativeDay("?", now)).toBe("");
  });
});

describe("pictos et catégories", () => {
  it("chaque geste a un picto qui existe", () => {
    for (const gesture of getGestures()) {
      const picto = pictoFor(gesture.id);
      expect(picto in ILLUSTRATION_SPECS).toBe(true);
      expect(picto).not.toBe("picto-generique");
    }
  });
  it("modes : occasion et garder", () => {
    expect(pictoFor("jean", "occasion")).toBe("picto-occasion");
    expect(pictoFor("jean", "occasion-livree")).toBe("picto-occasion");
    expect(pictoFor("jean", "garder")).toBe("picto-garder");
    expect(pictoFor("inconnu")).toBe("picto-generique");
    expect(entryPicto(base)).toBe("picto-tgv");
  });
  it("catégorie du geste choisi", () => {
    expect(entryCategory(base)).toBe("Se déplacer");
    expect(
      entryCategory({
        ...base,
        gestureA: "repas-boeuf",
        gestureB: "repas-vegetarien",
      }),
    ).toBe("Manger");
  });
});
