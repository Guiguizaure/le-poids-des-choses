import { describe, expect, it } from "vitest";
import { emissions } from "@/lib/calc";
import { getGesture } from "@/lib/data";
import { ALTERNATIVES } from "@/lib/raconte/alternatives";
import {
  DECLARED_HABITS_KEY,
  parseDeclared,
  serializeDeclared,
} from "./declared";
import {
  getHabit,
  HABITS,
  habitLabel,
  isHabitGesture,
  orderedHabits,
} from "./index";

describe("table HABITS", () => {
  it("les 12 habitudes validées, sans objet", () => {
    expect(HABITS.map((habit) => habit.gesture)).toEqual([
      "velo",
      "marche",
      "bus",
      "metro",
      "ter",
      "tgv",
      "repas-vegetarien",
      "repas-vegetalien",
      "eau-robinet",
      "boisson-soja",
      "magasin-pied",
      "point-relais-pied",
    ]);
  });
  it.each(HABITS)(
    "$gesture : geste réel, plus léger que l'option qu'il remplace",
    (habit) => {
      const gesture = getGesture(habit.gesture);
      expect(gesture).toBeDefined();
      expect(gesture!.fictive).toBe(false);
      expect(gesture!.unit).not.toBe("objet");
      const other = getGesture(ALTERNATIVES[habit.gesture]);
      expect(other, `alternative de ${habit.gesture}`).toBeDefined();
      expect(emissions(gesture!, gesture!.defaultQuantity)).toBeLessThan(
        emissions(other!, gesture!.defaultQuantity),
      );
    },
  );
  it("noms et déclarations uniques, en français", () => {
    const labels = HABITS.map((habit) => habit.label);
    expect(new Set(labels).size).toBe(HABITS.length);
    for (const habit of HABITS) expect(habit.declaration).toMatch(/^Je /);
  });
  it("isHabitGesture, getHabit, habitLabel", () => {
    expect(isHabitGesture("velo")).toBe(true);
    expect(isHabitGesture("avion")).toBe(false);
    expect(isHabitGesture("jean")).toBe(false);
    expect(getHabit("velo")?.label).toBe("À vélo");
    expect(habitLabel("velo")).toBe("À vélo");
    expect(habitLabel("avion")).toBe("Avion");
    expect(habitLabel("inconnu")).toBe("inconnu");
  });
  it("habitudes déclarées en premier, puis les autres dans l'ordre de la table", () => {
    const order = orderedHabits(["repas-vegetarien", "tgv"]).map(
      (h) => h.gesture,
    );
    expect(order.slice(0, 2)).toEqual(["tgv", "repas-vegetarien"]);
    expect(order).toHaveLength(HABITS.length);
  });
});

describe("« Mes habitudes » sur l'appareil", () => {
  it("clé versionnée, lecture tolérante", () => {
    expect(DECLARED_HABITS_KEY).toBe("lpdc:habitudes:v1");
    expect(parseDeclared(null)).toEqual([]);
    expect(parseDeclared("pas du json")).toEqual([]);
    expect(parseDeclared('{"version":2,"gestures":["velo"]}')).toEqual([]);
  });
  it("aller-retour : habitudes connues, sans doublon, dans l'ordre de la table", () => {
    const text = serializeDeclared([
      "repas-vegetarien",
      "velo",
      "velo",
      "avion",
    ]);
    expect(parseDeclared(text)).toEqual(["velo", "repas-vegetarien"]);
  });
});
