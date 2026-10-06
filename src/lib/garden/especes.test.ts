// Espèces : choix à la plantation, déblocage par les pas de croissance, jardins existants
// inchangés.
import { describe, expect, it } from "vitest";
import type { JournalEntry } from "@/lib/data/types";
import { createEntry } from "@/lib/journal/entry";
import { isJournalEntry } from "@/lib/journal/schema";
import {
  buildGarden,
  gardenSignature,
  growthSteps,
  plantKindFor,
  plantKindForEntry,
} from "./model";
import { SPECIES_SHEETS } from "@/lib/i18n/messages/species";
import {
  nextSpecies,
  SPECIES,
  SPECIES_UNLOCKS,
  STARTING_SPECIES,
  unlockedSpecies,
} from "./species";

const day = (i: number) => new Date(Date.UTC(2026, 0, 1 + i, 10)).toISOString();

/** Carnet de référence : comparaisons de tailles variées et habitudes, sans espèce choisie. */
function referenceJournal(): JournalEntry[] {
  const entries: JournalEntry[] = [];
  for (let i = 0; i < 60; i++) {
    if (i % 5 === 4)
      entries.push({
        kind: "habit",
        id: `h-${i}`,
        date: day(i),
        gesture: "velo",
      });
    else
      entries.push({
        id: `e-${i}`,
        date: day(i),
        gestureA: "tgv",
        gestureB: "avion",
        quantity: 50,
        chosen: "a",
        avoidedKg: [0.4, 3, 12, 25, 0][i % 5],
      });
  }
  return entries;
}

describe("jardins existants", () => {
  it("même jardin qu'avant le lot Espèces (empreinte calculée sur main)", () => {
    const garden = buildGarden(
      referenceJournal(),
      new Date(Date.UTC(2026, 2, 10)),
    );
    expect(gardenSignature(garden)).toBe(1344701095);
  });
  it("sans espèce choisie, le tirage figé d'après l'id ne change pas", () => {
    for (let i = 0; i < 200; i++)
      expect(plantKindForEntry({ id: `x-${i}` })).toEqual(
        plantKindFor(`x-${i}`),
      );
  });
});

describe("espèce choisie à la plantation", () => {
  it("l'espèce choisie est celle de la plante", () => {
    expect(plantKindForEntry({ id: "a", species: "arbre-4" })).toEqual({
      type: "tree",
      variant: 4,
    });
    expect(plantKindForEntry({ id: "a", species: "fleur-1" })).toEqual({
      type: "flower",
      variant: 1,
    });
  });
  it("espèce inconnue (version plus récente) : le tirage reprend", () => {
    expect(plantKindForEntry({ id: "a", species: "arbre-9" })).toEqual(
      plantKindFor("a"),
    );
  });
  it("gardée dans l'entrée d'un choix léger, jamais dans un choix lourd", () => {
    const light = createEntry({
      gestureA: "tgv",
      gestureB: "avion",
      quantity: 50,
      chosen: "a",
      species: "fleur-4",
    });
    expect(light.species).toBe("fleur-4");
    const heavy = createEntry({
      gestureA: "tgv",
      gestureB: "avion",
      quantity: 50,
      chosen: "b",
      species: "fleur-4",
    });
    expect(heavy.species).toBeUndefined();
  });
  it("le carnet accepte une espèce, refuse une valeur étrange ou une habitude qui en porte une", () => {
    const base = {
      id: "a",
      date: day(0),
      gestureA: "tgv",
      gestureB: "avion",
      quantity: 50,
      chosen: "a",
      avoidedKg: 5,
    };
    expect(isJournalEntry({ ...base, species: "arbre-5" })).toBe(true);
    expect(isJournalEntry({ ...base, species: "<script>" })).toBe(false);
    expect(isJournalEntry({ ...base, species: 4 })).toBe(false);
    expect(
      isJournalEntry({
        kind: "habit",
        id: "h",
        date: day(0),
        gesture: "velo",
        species: "arbre-4",
      }),
    ).toBe(false);
  });
  it("le jardin dessine l'espèce choisie, au même emplacement qu'avant", () => {
    const entry = { ...referenceJournal()[1] } as JournalEntry;
    const now = new Date(Date.UTC(2026, 2, 10));
    const before = buildGarden([entry], now).plants[0];
    const after = buildGarden(
      [{ ...entry, species: "arbre-5" } as JournalEntry],
      now,
    ).plants[0];
    expect(after.kind).toEqual({ type: "tree", variant: 5 });
    expect(after.slot).toEqual(before.slot);
  });
});

describe("déblocage des espèces", () => {
  it("au départ, les six espèces d'origine", () => {
    expect(STARTING_SPECIES).toEqual([
      "arbre-1",
      "arbre-2",
      "arbre-3",
      "fleur-1",
      "fleur-2",
      "fleur-3",
    ]);
    expect(unlockedSpecies(0)).toEqual(STARTING_SPECIES);
  });
  it("une espèce tous les 3 pas, en alternant : marguerite, olivier, lavande, figuier, pissenlit, sapin", () => {
    expect(SPECIES_UNLOCKS).toEqual([
      { id: "fleur-4", steps: 3 },
      { id: "arbre-4", steps: 6 },
      { id: "fleur-5", steps: 9 },
      { id: "arbre-6", steps: 12 },
      { id: "fleur-6", steps: 15 },
      { id: "arbre-5", steps: 18 },
    ]);
    expect(unlockedSpecies(2)).toHaveLength(6);
    expect(unlockedSpecies(3)).toContain("fleur-4");
    expect(unlockedSpecies(18)).toHaveLength(SPECIES.length);
    expect(nextSpecies(4)).toEqual({ id: "arbre-4", remaining: 2 });
    expect(nextSpecies(18)).toBeNull();
  });
  it("pas de croissance : choix légers et jours arrosés, gestes et habitudes confondus", () => {
    const garden = buildGarden(
      referenceJournal(),
      new Date(Date.UTC(2026, 2, 10)),
    );
    expect(growthSteps(garden)).toBe(
      garden.lightChoiceCount + garden.wateredDayCount,
    );
    expect(garden.species).toEqual(unlockedSpecies(growthSteps(garden)));
  });
  it("jamais lié aux kg : un petit ou un grand écart compte un pas", () => {
    const one = (avoidedKg: number) =>
      buildGarden(
        [{ ...(referenceJournal()[0] as object), avoidedKg } as JournalEntry],
        new Date(Date.UTC(2026, 2, 10)),
      );
    expect(growthSteps(one(0.01))).toBe(growthSteps(one(500)));
  });
  it("jamais de régression : chaque entrée ajoutée garde (au moins) les espèces déjà là", () => {
    const entries = referenceJournal();
    let previous: string[] = [];
    for (let i = 1; i <= entries.length; i++) {
      const species = buildGarden(
        entries.slice(0, i),
        new Date(Date.UTC(2026, 2, 10)),
      ).species;
      for (const id of previous) expect(species).toContain(id);
      previous = species;
    }
    expect(previous.length).toBeGreaterThan(6);
  });
});

describe("fiches", () => {
  it("chaque espèce a sa fiche complète en français et en anglais", () => {
    for (const species of SPECIES)
      for (const locale of ["fr", "en"] as const) {
        const sheet = SPECIES_SHEETS[locale][species.id];
        expect(sheet, `${locale} ${species.id}`).toBeDefined();
        for (const field of Object.values(sheet))
          expect(field.trim(), `${locale} ${species.id}`).not.toBe("");
      }
    expect(Object.keys(SPECIES_SHEETS.fr).sort()).toEqual(
      SPECIES.map((s) => s.id).sort(),
    );
  });
  it("fiches anglaises : aucune fiche n'est restée en français", () => {
    for (const species of SPECIES)
      expect(SPECIES_SHEETS.en[species.id].anecdote).not.toBe(
        SPECIES_SHEETS.fr[species.id].anecdote,
      );
  });
});
