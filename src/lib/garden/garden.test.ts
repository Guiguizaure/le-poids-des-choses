import { describe, expect, it } from "vitest";
import type { JournalEntry } from "@/lib/data/types";
import {
  ANIMAL_UNLOCKS,
  animalsArrivedWith,
  buildGarden,
  GARDEN_SLOTS,
  gardenSignature,
  levelForKg,
  maxLevel,
  MAX_PLANT_WIDTH,
  MAX_PLANTS,
  plantKindFor,
  stageFor,
} from "./model";
import { SCENE, surfaceY } from "./scene";
import { arrivalMessage, gardenDescription } from "./text";

const DAY = 24 * 60 * 60 * 1000;
const start = Date.UTC(2026, 0, 1);

function entries(
  count: number,
  kg: number | ((i: number) => number) = 5,
  prefix = "e",
): JournalEntry[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}${i}`,
    date: new Date(start + i * 60_000).toISOString(),
    gestureA: "avion",
    gestureB: "tgv",
    quantity: 10,
    chosen: "b" as const,
    avoidedKg: typeof kg === "function" ? kg(i) : kg,
  }));
}

const soon = new Date(start + DAY);

describe("une plante par choix léger", () => {
  it("chaque choix léger fait pousser une plante", () => {
    expect(buildGarden(entries(7), soon).plants).toHaveLength(7);
  });
  it("un choix lourd n'ajoute rien et ne retire rien", () => {
    const light = entries(3);
    const withHeavy = [...light, ...entries(2, 0, "lourd")];
    const a = buildGarden(light, soon);
    const b = buildGarden(withHeavy, soon);
    expect(b.plants).toEqual(a.plants);
    expect(b.choiceCount).toBe(5);
    expect(b.lightChoiceCount).toBe(3);
  });
  it("jardin vide sans entrée", () => {
    const garden = buildGarden([], soon);
    expect(garden.plants).toEqual([]);
    expect(garden.asleep).toBe(false);
    expect(gardenDescription(garden)).toBe("Jardin vide");
  });
});

describe("déterminisme", () => {
  it("même carnet = même jardin, quel que soit l'ordre de stockage", () => {
    const list = entries(25, (i) => (i % 3) * 12 + 0.5);
    const shuffled = [...list].reverse();
    expect(gardenSignature(buildGarden(shuffled, soon))).toBe(
      gardenSignature(buildGarden(list, soon)),
    );
    expect(buildGarden(shuffled, soon).plants).toEqual(
      buildGarden(list, soon).plants,
    );
  });
  it("le type de plante dépend seulement de l'id", () => {
    expect(plantKindFor("abc")).toEqual(plantKindFor("abc"));
    const kinds = new Set(
      entries(60).map((e) => JSON.stringify(plantKindFor(e.id))),
    );
    expect(kinds.size).toBe(6);
  });
  it("ajouter une entrée ne déplace pas les plantes existantes", () => {
    const list = entries(10);
    const before = buildGarden(list, soon).plants;
    const next = {
      ...entries(1, 5, "new")[0],
      date: new Date(start + DAY / 2).toISOString(),
    };
    const after = buildGarden([...list, next], soon).plants;
    for (const plant of before) {
      expect(after.find((p) => p.id === plant.id)?.slot).toEqual(plant.slot);
    }
  });
});

describe("stades", () => {
  it("échelle douce : < 1 kg pousse, 1 à 20 kg jeune, > 20 kg grand", () => {
    expect(levelForKg(0.2)).toBe(0);
    expect(levelForKg(0.999)).toBe(0);
    expect(levelForKg(1)).toBe(1);
    expect(levelForKg(20)).toBe(1);
    expect(levelForKg(20.01)).toBe(2);
    expect(levelForKg(Number.NaN)).toBe(0);
  });
  it("fleurs : pousse puis fleurie", () => {
    expect(stageFor({ type: "flower", variant: 1 }, 0)).toBe("pousse");
    expect(stageFor({ type: "flower", variant: 1 }, 1)).toBe("fleurie");
    expect(stageFor({ type: "flower", variant: 1 }, 2)).toBe("fleurie");
    expect(stageFor({ type: "tree", variant: 2 }, 2)).toBe("grand");
  });
});

describe("emplacements", () => {
  it("40 emplacements dans la scène, sur la terre", () => {
    expect(GARDEN_SLOTS).toHaveLength(MAX_PLANTS);
    for (const slot of GARDEN_SLOTS) {
      expect(slot.x).toBeGreaterThan(0);
      expect(slot.x).toBeLessThan(SCENE.width);
      expect(slot.y).toBeLessThanOrEqual(SCENE.height);
      expect(slot.y).toBeGreaterThanOrEqual(surfaceY(slot.x));
    }
  });
  it("pas de chevauchement dans une rangée", () => {
    for (const a of GARDEN_SLOTS) {
      for (const b of GARDEN_SLOTS) {
        if (a !== b && a.row === b.row)
          expect(Math.abs(a.x - b.x)).toBeGreaterThanOrEqual(MAX_PLANT_WIDTH);
      }
    }
  });
  it("une plante par emplacement", () => {
    const slots = buildGarden(
      entries(40, (i) => (i % 4) * 9 + 0.5),
      soon,
    ).plants.map((p) => `${p.slot.row}.${p.slot.index}`);
    expect(new Set(slots).size).toBe(40);
  });
  it("les plus grands vers l'arrière, affichage de l'arrière vers l'avant", () => {
    const garden = buildGarden(
      entries(12, (i) => (i < 6 ? 50 : 0.5)),
      soon,
    );
    const rows = (level: number) =>
      garden.plants.filter((p) => p.level === level).map((p) => p.slot.row);
    expect(Math.max(...rows(2))).toBeLessThan(Math.min(...rows(0)));
    const ys = garden.plants.map((p) => p.slot.y);
    expect(ys).toEqual([...ys].sort((a, b) => a - b));
  });
});

describe("plafond de 40 plantes", () => {
  it("au-delà, les nouvelles font grandir les plus anciennes", () => {
    const list = entries(45, 0.5); // que des pousses : 5 crans de croissance à répartir
    const garden = buildGarden(list, soon);
    expect(garden.plants).toHaveLength(40);
    const byAge = list
      .slice(0, 40)
      .map((e) => garden.plants.find((p) => p.id === e.id)!);
    expect(byAge.reduce((sum, p) => sum + p.level, 0)).toBe(5);
    // Les plus anciennes d'abord : une plante ne grandit que si les précédentes sont au maximum.
    const grownCount = byAge.findIndex((p) => p.level === 0);
    for (const plant of byAge.slice(0, grownCount - 1))
      expect(plant.level).toBe(maxLevel(plant.kind));
    for (const plant of byAge.slice(grownCount)) expect(plant.level).toBe(0);
  });
  it("les fleurs s'arrêtent à « fleurie »", () => {
    const garden = buildGarden(entries(60, 50), soon);
    for (const plant of garden.plants)
      expect(plant.level).toBe(maxLevel(plant.kind));
  });
  it("une plante déjà grande n'est plus agrandie : on passe à la suivante", () => {
    const list = entries(41, (i) => (i === 0 ? 50 : 0.5));
    const plants = buildGarden(list, soon).plants;
    const first = plants.find((p) => p.id === "e0")!;
    expect(first.level).toBe(maxLevel(first.kind));
    expect(plants.find((p) => p.id === "e1")?.level).toBe(1);
  });
});

describe("animaux", () => {
  it("seuils : papillon 1, coccinelle 3, oiseau 5, escargot 8, abeille 12, hérisson 20", () => {
    expect(ANIMAL_UNLOCKS.map((a) => [a.kind, a.lightChoices])).toEqual([
      ["butterfly", 1],
      ["ladybug", 3],
      ["bird", 5],
      ["snail", 8],
      ["bee", 12],
      ["hedgehog", 20],
    ]);
    expect(buildGarden(entries(2), soon).unlocked).toEqual(["butterfly"]);
    expect(buildGarden(entries(5), soon).unlocked).toEqual([
      "butterfly",
      "ladybug",
      "bird",
    ]);
    expect(buildGarden(entries(20), soon).unlocked).toHaveLength(6);
  });
  it("les choix lourds ne comptent pas", () => {
    expect(
      buildGarden([...entries(2), ...entries(5, 0, "lourd")], soon).unlocked,
    ).toEqual(["butterfly"]);
  });
  it("message d'arrivée pour l'entrée qui débloque un animal", () => {
    const list = entries(3);
    expect(animalsArrivedWith(list, "e2")).toEqual(["ladybug"]);
    expect(animalsArrivedWith(list, "e1")).toEqual([]);
    expect(arrivalMessage("ladybug")).toBe(
      "Une coccinelle s’est installée dans ton jardin",
    );
    expect(arrivalMessage("hedgehog")).toBe(
      "Un hérisson s’est installé dans ton jardin",
    );
  });
  it("l'oiseau reste dans le ciel", () => {
    const bird = buildGarden(entries(5), soon).animals.find(
      (a) => a.kind === "bird",
    )!;
    expect(bird.box.y + bird.box.height).toBeLessThan(
      surfaceY(bird.box.x + bird.box.width / 2),
    );
  });
});

describe("endormissement", () => {
  const list = entries(20);
  const last = Date.parse(list.at(-1)!.date);

  it("éveillé avant 21 jours", () => {
    const garden = buildGarden(list, new Date(last + 20 * DAY));
    expect(garden.asleep).toBe(false);
    expect(garden.animals).toHaveLength(6);
  });
  it("assoupi à 21 jours : seuls oiseau, escargot et hérisson restent, endormis", () => {
    const garden = buildGarden(list, new Date(last + 21 * DAY));
    expect(garden.asleep).toBe(true);
    expect(garden.animals.map((a) => a.kind).sort()).toEqual([
      "bird",
      "hedgehog",
      "snail",
    ]);
    expect(garden.animals.every((a) => a.asleep)).toBe(true);
    expect(garden.unlocked).toHaveLength(6);
    expect(garden.plants).toHaveLength(20);
    expect(gardenDescription(garden)).toBe(
      "Jardin : 20 plantes, 6 animaux, assoupi sous la brume",
    );
  });
  it("il se réveille à l'entrée suivante (même un choix lourd)", () => {
    const later = new Date(last + 40 * DAY);
    const next = { ...entries(1, 0, "reveil")[0], date: later.toISOString() };
    expect(buildGarden([...list, next], later).asleep).toBe(false);
  });
  it("description au singulier", () => {
    expect(gardenDescription(buildGarden(entries(1), soon))).toBe(
      "Jardin : 1 plante, 1 animal",
    );
  });
});

describe("bords de la scène", () => {
  it("la plante la plus large reste dans la scène, quel que soit l'emplacement", () => {
    for (const slot of GARDEN_SLOTS) {
      expect(slot.x - MAX_PLANT_WIDTH / 2).toBeGreaterThanOrEqual(0);
      expect(slot.x + MAX_PLANT_WIDTH / 2).toBeLessThanOrEqual(SCENE.width);
    }
  });
});
