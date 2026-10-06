import { describe, expect, it } from "vitest";
import type {
  ComparisonEntry,
  HabitEntry,
  JournalEntry,
} from "@/lib/data/types";
import { milestoneCrossed } from "@/lib/milestones";
import {
  buildGarden,
  GARDEN_SLOTS,
  maxLevel,
  plantKindFor,
  plantProgress,
  waterRevealForEntry,
} from "./model";
import { gardenDescription, wateringMessage, wateringTitle } from "./text";
import {
  daysToNextStep,
  MAX_BLOOM,
  WATER_DAYS_PER_STEP,
  wateredDaysSince,
  waterings,
} from "./watering";

const DAY = 24 * 60 * 60 * 1000;
const START = Date.UTC(2026, 3, 1, 10); // 1er avril 2026, midi à Paris

const choice = (
  id: string,
  at: number,
  avoidedKg: number,
): ComparisonEntry => ({
  id,
  date: new Date(at).toISOString(),
  gestureA: "voiture",
  gestureB: "velo",
  quantity: 10,
  chosen: "b",
  avoidedKg,
});
const habit = (id: string, at: number, gesture = "velo"): HabitEntry => ({
  kind: "habit",
  id,
  date: new Date(at).toISOString(),
  gesture,
});
/** `count` habitudes, une par jour, à partir du lendemain de START. */
const dailyHabits = (count: number, from = START + DAY): HabitEntry[] =>
  Array.from({ length: count }, (_, i) => habit(`h${i}`, from + i * DAY));

/** Trouve un id dont la plante est du type voulu (le type est tiré de l'id). */
function idFor(type: "tree" | "flower", prefix = "p"): string {
  for (let i = 0; ; i++)
    if (plantKindFor(`${prefix}${i}`).type === type) return `${prefix}${i}`;
}

const at = (days: number) => new Date(START + days * DAY);

describe("jours arrosés", () => {
  it("un jour arrosé par jour distinct, heure de Paris", () => {
    const list = waterings([
      habit("a", Date.UTC(2026, 3, 2, 8)),
      habit("b", Date.UTC(2026, 3, 2, 18)),
      // 22 h 30 UTC le 2 avril = 0 h 30 le 3 avril à Paris (heure d'été).
      habit("c", Date.UTC(2026, 3, 2, 22, 30)),
    ]);
    expect(wateredDaysSince(list, 0)).toBe(2);
  });
  it("seules les habitudes notées après la plantation comptent", () => {
    const list = waterings(dailyHabits(5));
    expect(wateredDaysSince(list, START + 2.5 * DAY)).toBe(3);
  });
  it("prochain cran", () => {
    expect(WATER_DAYS_PER_STEP).toBe(3);
    expect(daysToNextStep(0)).toBe(3);
    expect(daysToNextStep(4)).toBe(2);
  });
});

describe("l'arrosage fait grandir puis s'épanouir, sans aucun kg", () => {
  const tree = idFor("tree");
  const flower = idFor("flower");

  it("une pousse d'arbre : jeune, grand, puis épanoui 1, 2, 3 (un cran tous les 3 jours)", () => {
    const steps = [0, 3, 6, 9, 12, 15, 30].map((days) => {
      const garden = buildGarden(
        [choice(tree, START, 0.5), ...dailyHabits(days)],
        at(40),
      );
      const plant = garden.plants[0];
      return `${plant.stage}+${plant.bloom}`;
    });
    expect(steps).toEqual([
      "pousse+0",
      "jeune+0",
      "grand+0",
      "grand+1",
      "grand+2",
      "grand+3",
      "grand+3",
    ]);
  });
  it("une fleur fleurie s'épanouit dès le premier cran", () => {
    const steps = [2, 3, 6, 9].map((days) => {
      const plant = buildGarden(
        [choice(flower, START, 5), ...dailyHabits(days)],
        at(40),
      ).plants[0];
      return `${plant.stage}+${plant.bloom}`;
    });
    expect(steps).toEqual(["fleurie+0", "fleurie+1", "fleurie+2", "fleurie+3"]);
  });
  it("noter plusieurs habitudes le même jour ne compte qu'une fois", () => {
    const sameDay = Array.from({ length: 10 }, (_, i) =>
      habit(`m${i}`, START + DAY + i * 60_000),
    );
    const plant = buildGarden([choice(flower, START, 5), ...sameDay], at(5))
      .plants[0];
    expect(plant.wateredDays).toBe(1);
    expect(plant.bloom).toBe(0);
  });
  it("les habitudes d'avant la plantation n'arrosent pas la nouvelle plante", () => {
    const plant = buildGarden(
      [...dailyHabits(9, START - 20 * DAY), choice(flower, START, 5)],
      at(5),
    ).plants[0];
    expect(plant.wateredDays).toBe(0);
    expect(plant.bloom).toBe(0);
  });
  it("aucun kg, aucun choix léger, aucun animal ni palier de plus", () => {
    const base: JournalEntry[] = [choice(flower, START, 5)];
    const watered = [...base, ...dailyHabits(20)];
    const a = buildGarden(base, at(30));
    const b = buildGarden(watered, at(30));
    expect(b.totalAvoidedKg).toBe(a.totalAvoidedKg);
    expect(b.lightChoiceCount).toBe(a.lightChoiceCount);
    expect(b.choiceCount).toBe(a.choiceCount);
    expect(b.unlocked).toEqual(a.unlocked);
    expect(b.habitCount).toBe(20);
    expect(b.wateredDayCount).toBe(20);
    expect(milestoneCrossed(watered)).toBe(milestoneCrossed(base));
  });
  it("l'arrosage ne déplace aucune plante", () => {
    const base = [choice(tree, START, 0.5), choice(flower, START + 1000, 5)];
    const a = buildGarden(base, at(30));
    const b = buildGarden([...base, ...dailyHabits(12)], at(30));
    expect(b.plants.map((p) => p.slot)).toEqual(a.plants.map((p) => p.slot));
  });
  it("une habitude garde le jardin éveillé", () => {
    const base = [choice(flower, START, 5)];
    expect(buildGarden(base, at(30)).asleep).toBe(true);
    expect(
      buildGarden([...base, habit("h", START + 25 * DAY)], at(30)).asleep,
    ).toBe(false);
  });
  it("jardin sans plante : les habitudes ne font rien pousser", () => {
    const garden = buildGarden(dailyHabits(10), at(20));
    expect(garden.plants).toEqual([]);
    expect(garden.wateredDayCount).toBe(10);
    expect(gardenDescription(garden, "printemps")).toBe(
      "Jardin vide, au printemps",
    );
  });
});

describe("jamais de régression", () => {
  // Petit générateur déterministe (pas de hasard dans les tests).
  function* sequence(seed: number) {
    let x = seed;
    for (;;) {
      x = (Math.imul(x, 1103515245) + 12345) >>> 0;
      yield x / 2 ** 32;
    }
  }
  it("ajouter des entrées (même datées d'avant) ne fait jamais reculer une plante", () => {
    for (let seed = 1; seed <= 25; seed++) {
      const random = sequence(seed);
      const next = () => random.next().value as number;
      let journal: JournalEntry[] = [];
      let previous = new Map<string, number>();
      for (let step = 0; step < 40; step++) {
        const when =
          START + Math.floor(next() * 60) * DAY + Math.floor(next() * DAY);
        const id = `s${seed}-${step}`;
        const kg = next() < 0.3 ? 0 : [0.4, 5, 30][Math.floor(next() * 3)];
        journal = [
          ...journal,
          next() < 0.6 ? habit(id, when) : choice(id, when, kg),
        ];
        const garden = buildGarden(journal, at(90));
        for (const plant of garden.plants) {
          const before = previous.get(plant.id);
          if (before !== undefined)
            expect(plantProgress(plant)).toBeGreaterThanOrEqual(before);
          expect(plant.bloom).toBeLessThanOrEqual(MAX_BLOOM);
          expect(plant.level).toBeLessThanOrEqual(maxLevel(plant.kind));
          expect(GARDEN_SLOTS).toContainEqual(plant.slot);
        }
        previous = new Map(garden.plants.map((p) => [p.id, plantProgress(p)]));
      }
    }
  });
  it("même carnet, même jardin (déterministe)", () => {
    const journal = [choice(idFor("tree"), START, 5), ...dailyHabits(7)];
    expect(buildGarden(journal, at(10))).toEqual(
      buildGarden([...journal].reverse(), at(10)),
    );
  });
});

describe("révélation d'un arrosage", () => {
  const flower = idFor("flower", "f");
  it("la plante qui avance est montrée, à son nouvel état", () => {
    const journal = [choice(flower, START, 5), ...dailyHabits(3)];
    const reveal = waterRevealForEntry(journal, "h2", at(5))!;
    expect(reveal.newDay).toBe(true);
    expect(reveal.moved.map((p) => p.id)).toEqual([flower]);
    expect(reveal.featured?.bloom).toBe(1);
    expect(wateringTitle(reveal)).toBe("Une fleur s’épanouit");
    expect(wateringMessage(reveal)).toBe(
      "Ton jardin est arrosé : 1 plante avance d’un cran.",
    );
  });
  it("pas encore de cran : combien de jours arrosés il manque", () => {
    const journal = [choice(flower, START, 5), ...dailyHabits(1)];
    const reveal = waterRevealForEntry(journal, "h0", at(5))!;
    expect(reveal.moved).toEqual([]);
    expect(reveal.nextStepIn).toBe(2);
    expect(wateringTitle(reveal)).toBe("Ton jardin est arrosé");
    expect(wateringMessage(reveal)).toBe(
      "Ton jardin est arrosé. Encore 2 jours arrosés avant le prochain cran.",
    );
  });
  it("déjà arrosé aujourd'hui : rien ne change, c'est noté", () => {
    const journal = [
      choice(flower, START, 5),
      habit("matin", START + DAY),
      habit("soir", START + DAY + 3600_000),
    ];
    const reveal = waterRevealForEntry(journal, "soir", at(5))!;
    expect(reveal.newDay).toBe(false);
    expect(reveal.moved).toEqual([]);
    expect(wateringMessage(reveal)).toBe(
      "Ton jardin est déjà arrosé aujourd’hui : c’est noté.",
    );
  });
  it("jardin sans plante : invitation à comparer", () => {
    const reveal = waterRevealForEntry(dailyHabits(1), "h0", at(5))!;
    expect(reveal.plantCount).toBe(0);
    expect(wateringMessage(reveal)).toMatch(/première pousse/);
  });
  it("une comparaison n'est pas un arrosage", () => {
    expect(waterRevealForEntry([choice(flower, START, 5)], flower)).toBeNull();
  });
});
