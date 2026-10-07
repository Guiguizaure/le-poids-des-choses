// Arrosage ciblé : chaque nouvelle habitude donne un arrosage bonus à une plante, EN PLUS de la
// règle de base (chaque jour arrosé compte pour toutes les plantes plantées avant lui).
import { describe, expect, it } from "vitest";
import type {
  ComparisonEntry,
  HabitEntry,
  JournalEntry,
} from "@/lib/data/types";
import {
  buildGarden,
  canProgress,
  maxLevel,
  plantKindFor,
  plantProgress,
  waterRevealForEntry,
  wateringTarget,
} from "./model";
import { wateringMessage, wateringTitle } from "./text";
import { MAX_BLOOM, WATER_DAYS_PER_STEP } from "./watering";

const DAY = 24 * 60 * 60 * 1000;
const START = Date.UTC(2026, 3, 1, 10); // 1er avril 2026, midi à Paris
const at = (days: number) => new Date(START + days * DAY);

const choice = (id: string, when: number, avoidedKg = 5): ComparisonEntry => ({
  id,
  date: new Date(when).toISOString(),
  gestureA: "voiture",
  gestureB: "velo",
  quantity: 10,
  chosen: "b",
  avoidedKg,
});
const habit = (
  id: string,
  when: number,
  plant?: string | null,
  gesture = "velo",
): HabitEntry => ({
  kind: "habit",
  id,
  date: new Date(when).toISOString(),
  gesture,
  ...(plant === undefined ? {} : { plant }),
});

/** Le même carnet, sans aucun arrosage ciblé : la règle de base seule. */
const baseOnly = (entries: readonly JournalEntry[]): JournalEntry[] =>
  entries.map((entry) => {
    if (!("kind" in entry) || !("plant" in entry)) return entry;
    const { plant: _plant, ...rest } = entry;
    void _plant;
    return rest;
  });

/** Id dont la plante tirée est du type voulu. */
function idFor(type: "tree" | "flower", prefix: string): string {
  for (let i = 0; ; i++)
    if (plantKindFor(`${prefix}${i}`).type === type) return `${prefix}${i}`;
}

/** Petit générateur déterministe (pas de hasard dans les tests). */
function* sequence(seed: number) {
  let x = seed;
  for (;;) {
    x = (Math.imul(x, 1103515245) + 12345) >>> 0;
    yield x / 2 ** 32;
  }
}

describe("arrosage bonus", () => {
  const flower = idFor("flower", "f");
  const tree = idFor("tree", "t");

  it("une habitude ciblée ajoute un arrosage à sa plante, en plus du jour arrosé de tout le jardin", () => {
    const journal = [
      choice(flower, START, 0.4),
      choice(tree, START, 0.4),
      habit("h1", START + DAY, flower),
    ];
    const garden = buildGarden(journal, at(2));
    const byId = new Map(garden.plants.map((p) => [p.id, p]));
    expect(byId.get(flower)).toMatchObject({
      wateredDays: 1,
      bonusDays: 1,
      waterCount: 2,
    });
    expect(byId.get(tree)).toMatchObject({
      wateredDays: 1,
      bonusDays: 0,
      waterCount: 1,
    });
  });

  it("au plus un bonus par plante et par jour (heure de Paris)", () => {
    const journal = [
      choice(flower, START, 0.4),
      habit("matin", START + DAY, flower),
      habit("soir", START + DAY + 6 * 3600_000, flower, "marche"),
      habit("lendemain", START + 2 * DAY, flower),
    ];
    const plant = buildGarden(journal, at(3)).plants[0];
    expect(plant.wateredDays).toBe(2);
    expect(plant.bonusDays).toBe(2);
    expect(plant.waterCount).toBe(4);
  });

  it("un cran tous les 3 arrosages, même échelle : pousse, fleurie, puis épanouissement", () => {
    // Pousse (0,4 kg) : 2 jours avec bonus = 4 arrosages → un cran (fleurie), 1 de plus.
    const journal = [
      choice(flower, START, 0.4),
      habit("h1", START + DAY, flower),
      habit("h2", START + 2 * DAY, flower),
    ];
    const plant = buildGarden(journal, at(3)).plants[0];
    expect(plant.waterCount).toBe(4);
    expect(plant.level).toBe(1);
    expect(plant.stage).toBe("fleurie");
    expect(plant.bloom).toBe(0);
  });

  it("sans cible (null), ou vers une plante inconnue : aucun bonus, la base reste", () => {
    const journal = [
      choice(flower, START, 0.4),
      habit("h1", START + DAY, null),
      habit("h2", START + 2 * DAY, "inconnue"),
    ];
    const plant = buildGarden(journal, at(3)).plants[0];
    expect(plant.bonusDays).toBe(0);
    expect(plant.waterCount).toBe(2);
  });

  it("anciennes habitudes (sans `plant`) : exactement la règle d'avant", () => {
    const journal = [
      choice(flower, START, 0.4),
      habit("h1", START + DAY),
      habit("h2", START + 2 * DAY),
      habit("h3", START + 3 * DAY),
    ];
    const plant = buildGarden(journal, at(4)).plants[0];
    expect(plant).toMatchObject({
      wateredDays: 3,
      bonusDays: 0,
      waterCount: 3,
    });
    expect(plant.level).toBe(1);
  });
});

describe("plante visée", () => {
  it("la moins avancée, puis la plus proche de son prochain cran, puis la plus ancienne", () => {
    const a = idFor("flower", "a");
    const b = idFor("flower", "b");
    const c = idFor("flower", "c");
    // Trois pousses : b a déjà eu un bonus hier (plus proche de son prochain cran).
    const journal = [
      choice(a, START, 0.4),
      choice(b, START + 1000, 0.4),
      choice(c, START + 2000, 0.4),
      habit("hier", START + DAY, b),
    ];
    expect(wateringTarget(journal, "marche", at(2))).toBe(b);
    // Sans ce bonus : à égalité, la plus ancienne.
    expect(wateringTarget(journal.slice(0, 3), "marche", at(2))).toBe(a);
    // Une plante plus avancée passe après les pousses.
    const grown = idFor("flower", "g");
    expect(
      wateringTarget(
        [choice(grown, START - 1000, 5), ...journal.slice(0, 3)],
        "marche",
        at(2),
      ),
    ).toBe(a);
  });

  it("jamais une plante qui a déjà eu son bonus aujourd'hui : deux habitudes, deux plantes", () => {
    const a = idFor("flower", "a");
    const b = idFor("flower", "b");
    const journal: JournalEntry[] = [
      choice(a, START, 0.4),
      choice(b, START + 1000, 0.4),
    ];
    const now = at(1);
    const first = wateringTarget(journal, "velo", now);
    journal.push(habit("h-velo", now.getTime(), first));
    const second = wateringTarget(
      journal,
      "marche",
      new Date(now.getTime() + 1000),
    );
    expect(first).toBe(a);
    expect(second).toBe(b);
    journal.push(habit("h-marche", now.getTime() + 1000, second));
    // Toutes ont eu leur bonus aujourd'hui : plus de cible.
    expect(
      wateringTarget(journal, "bus", new Date(now.getTime() + 2000)),
    ).toBeNull();
  });

  it("la même habitude n'arrose qu'une fois par jour ; le lendemain, de nouveau", () => {
    const a = idFor("flower", "a");
    const journal = [choice(a, START, 0.4), habit("h", START + DAY, a)];
    expect(
      wateringTarget(journal, "velo", new Date(START + DAY + 3600_000)),
    ).toBeNull();
    expect(
      wateringTarget(journal, "marche", new Date(START + DAY + 3600_000)),
    ).toBeNull(); // a a déjà son bonus
    expect(wateringTarget(journal, "velo", at(2))).toBe(a);
  });

  it("jardin vide, ou toutes les plantes épanouies : aucune cible", () => {
    expect(wateringTarget([], "velo", at(1))).toBeNull();
    const tree = idFor("tree", "t");
    const journal: JournalEntry[] = [choice(tree, START, 30)];
    for (let d = 1; d <= 3 * (MAX_BLOOM + 2); d++)
      journal.push(habit(`h${d}`, START + d * DAY));
    const plant = buildGarden(journal, at(40)).plants[0];
    expect(plant.level).toBe(maxLevel(plant.kind));
    expect(plant.bloom).toBe(MAX_BLOOM);
    expect(canProgress(plant)).toBe(false);
    expect(wateringTarget(journal, "velo", at(40))).toBeNull();
  });

  it("déterministe : même carnet, même heure, même cible (ordre des entrées indifférent)", () => {
    const journal = [
      choice(idFor("flower", "a"), START, 0.4),
      choice(idFor("tree", "t"), START + 5000, 5),
      habit("h", START + DAY, null),
    ];
    expect(wateringTarget(journal, "bus", at(2))).toBe(
      wateringTarget([...journal].reverse(), "bus", at(2)),
    );
  });
});

describe("garanties", () => {
  /** Carnet tiré : comparaisons, anciennes habitudes, habitudes ciblées (vers une plante du
   * moment, une inconnue ou aucune), dans le désordre des dates (synchro). */
  function randomJournal(seed: number, length = 45): JournalEntry[][] {
    const random = sequence(seed);
    const next = () => random.next().value as number;
    const steps: JournalEntry[][] = [];
    let journal: JournalEntry[] = [];
    for (let step = 0; step < length; step++) {
      const when =
        START + Math.floor(next() * 50) * DAY + Math.floor(next() * DAY);
      const id = `s${seed}-${step}`;
      const roll = next();
      let entry: JournalEntry;
      if (roll < 0.35) {
        const kg = next() < 0.3 ? 0 : [0.4, 5, 30][Math.floor(next() * 3)];
        entry = choice(id, when, kg);
      } else if (roll < 0.55) {
        entry = habit(id, when);
      } else {
        const plants = buildGarden(journal, new Date(when)).plants;
        const pick = next();
        const plant =
          pick < 0.15
            ? null
            : pick < 0.25
              ? "inconnue"
              : plants.length
                ? plants[Math.floor(next() * plants.length)].id
                : null;
        entry = habit(
          id,
          when,
          plant,
          ["velo", "marche", "bus"][Math.floor(next() * 3)],
        );
      }
      journal = [...journal, entry];
      steps.push(journal);
    }
    return steps;
  }

  it("aucun jardin ne recule : chaque entrée ajoutée (même datée d'avant) garde chaque plante au moins où elle était", () => {
    for (let seed = 1; seed <= 30; seed++) {
      let previous = new Map<string, { progress: number; water: number }>();
      for (const journal of randomJournal(seed)) {
        const garden = buildGarden(journal, at(80));
        for (const plant of garden.plants) {
          const before = previous.get(plant.id);
          if (before) {
            expect(plantProgress(plant)).toBeGreaterThanOrEqual(
              before.progress,
            );
            expect(plant.waterCount).toBeGreaterThanOrEqual(before.water);
          }
          expect(plant.bloom).toBeLessThanOrEqual(MAX_BLOOM);
          expect(plant.level).toBeLessThanOrEqual(maxLevel(plant.kind));
        }
        previous = new Map(
          garden.plants.map((p) => [
            p.id,
            { progress: plantProgress(p), water: p.waterCount },
          ]),
        );
      }
    }
  });

  it("aucune plante ne pousse moins vite qu'avec la règle actuelle : compteur nouveau ≥ compteur actuel, pour tout carnet", () => {
    for (let seed = 1; seed <= 30; seed++) {
      for (const journal of randomJournal(seed)) {
        const now = at(80);
        const withBonus = new Map(
          buildGarden(journal, now).plants.map((p) => [p.id, p]),
        );
        const current = buildGarden(baseOnly(journal), now);
        expect(withBonus.size).toBe(current.plants.length);
        for (const plant of current.plants) {
          const next = withBonus.get(plant.id)!;
          expect(next.waterCount).toBeGreaterThanOrEqual(plant.waterCount);
          expect(next.wateredDays).toBe(plant.wateredDays);
          expect(plantProgress(next)).toBeGreaterThanOrEqual(
            plantProgress(plant),
          );
          // Même place : l'arrosage ne déplace rien.
          expect(next.slot).toEqual(plant.slot);
        }
      }
    }
  });

  it("sans habitude ciblée, le jardin est exactement celui de la règle actuelle", () => {
    for (let seed = 1; seed <= 10; seed++) {
      const journal = baseOnly(randomJournal(seed).at(-1)!);
      expect(buildGarden(journal, at(80))).toEqual(
        buildGarden(baseOnly(journal), at(80)),
      );
      for (const plant of buildGarden(journal, at(80)).plants)
        expect(plant.bonusDays).toBe(0);
    }
  });

  it(`un cran tous les ${WATER_DAYS_PER_STEP} arrosages, toujours`, () => {
    for (let seed = 1; seed <= 10; seed++) {
      for (const plant of buildGarden(randomJournal(seed).at(-1)!, at(80))
        .plants)
        expect(plant.waterCount).toBe(plant.wateredDays + plant.bonusDays);
    }
  });
});

describe("révélation d'un arrosage ciblé", () => {
  const flower = idFor("flower", "f");
  it("la plante visée, si elle avance, et combien d'arrosages il lui manque", () => {
    const journal = [
      choice(flower, START, 0.4),
      habit("h1", START + DAY, flower),
    ];
    const reveal = waterRevealForEntry(journal, "h1", at(2))!;
    expect(reveal.target?.id).toBe(flower);
    expect(reveal.targetMoved).toBe(false);
    expect(reveal.targetToNext).toBe(1);
    const third = [...journal, habit("h2", START + 2 * DAY, flower)];
    const moved = waterRevealForEntry(third, "h2", at(3))!;
    expect(moved.targetMoved).toBe(true);
    expect(moved.target?.level).toBe(1);
  });
  it("sans cible : comme avant", () => {
    const reveal = waterRevealForEntry(
      [choice(flower, START, 0.4), habit("h1", START + DAY, null)],
      "h1",
      at(2),
    )!;
    expect(reveal.target).toBeNull();
    expect(reveal.targetToNext).toBeNull();
  });
});

describe("messages de l'arrosage ciblé", () => {
  // Une fleur (tulipe, fleur-2) pour l'accord au féminin.
  const tulip = (id: string) => ({
    ...choice(id, START, 0.4),
    species: "fleur-2",
  });
  it("« Tu as arrosé la tulipe : elle grandira au prochain arrosage. »", () => {
    const journal = [tulip("t"), habit("h1", START + DAY, "t")];
    const reveal = waterRevealForEntry(journal, "h1", at(2))!;
    expect(wateringMessage(reveal)).toBe(
      "Tu as arrosé la tulipe : elle grandira au prochain arrosage.",
    );
    expect(wateringMessage(reveal, "en")).toBe(
      "You watered the tulip: it will grow with the next watering.",
    );
  });
  it("le cran gagné, puis l'épanouissement, et les autres plantes qui avancent", () => {
    const journal = [
      tulip("t"),
      habit("h1", START + DAY, "t"),
      habit("h2", START + 2 * DAY, "t"),
    ];
    const reveal = waterRevealForEntry(journal, "h2", at(3))!;
    expect(wateringMessage(reveal)).toBe(
      "Tu as arrosé la tulipe : elle grandit d’un cran.",
    );
    expect(wateringTitle(reveal)).toBe("Une fleur grandit");
    // Fleurie (adulte) : les crans suivants épanouissent.
    const third = [...journal, habit("h3", START + 3 * DAY, "t")];
    expect(wateringMessage(waterRevealForEntry(third, "h3", at(4))!)).toBe(
      "Tu as arrosé la tulipe : elle s’épanouit d’un cran.",
    );
    const fourth = [...third, habit("h4", START + 4 * DAY, "t")];
    expect(wateringMessage(waterRevealForEntry(fourth, "h4", at(5))!)).toBe(
      "Tu as arrosé la tulipe : elle s’épanouira au prochain arrosage.",
    );
    expect(
      wateringMessage(waterRevealForEntry(fourth, "h4", at(5))!, "en"),
    ).toBe(
      "You watered the tulip: it will bloom a little more with the next watering.",
    );
  });
  it("au pluriel : les herbes folles", () => {
    const journal = [
      { ...choice("g", START, 0.4), species: "fleur-3" },
      habit("h1", START + DAY, "g"),
    ];
    expect(wateringMessage(waterRevealForEntry(journal, "h1", at(2))!)).toBe(
      "Tu as arrosé les herbes folles : elles grandiront au prochain arrosage.",
    );
  });
  it("jamais de kg", () => {
    const journal = [tulip("t"), habit("h1", START + DAY, "t")];
    const reveal = waterRevealForEntry(journal, "h1", at(2))!;
    expect(wateringMessage(reveal)).not.toMatch(/kg|CO2/);
    expect(wateringMessage(reveal, "en")).not.toMatch(/kg|CO2/);
  });
});
