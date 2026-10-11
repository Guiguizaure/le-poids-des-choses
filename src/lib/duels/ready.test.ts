import { describe, expect, it } from "vitest";
import { parseComparison } from "@/lib/compare/url";
import { comparisonQuery } from "@/lib/compare/url";
import { getGesture } from "@/lib/data";
import {
  dailyDuel,
  DUEL_TITLES,
  duelGestures,
  duelsFromToday,
  duelUnits,
  parisDayNumber,
  PARIS_MARSEILLE_KM,
  READY_DUELS,
} from "./ready";

describe("duels prêts à jouer", () => {
  it("aucun duel ne mélange deux unités ; un objet se compare à lui-même", () => {
    for (const duel of READY_DUELS) {
      const [a, b] = duelUnits(duel);
      expect(a, duel.id).toBe(b);
      if (duel.state.step === "object") expect(a).toBe("objet");
      else expect(a).not.toBe("objet");
    }
  });

  it("chaque duel ouvre un duel valide du parcours, avec les mêmes paramètres", () => {
    for (const duel of READY_DUELS) {
      const params = new URLSearchParams(comparisonQuery(duel.state));
      const parsed = parseComparison(params);
      expect(parsed.invalid, duel.id).toBe(false);
      expect(parsed.state).toEqual(duel.state);
      for (const id of duelGestures(duel))
        expect(getGesture(id), id).toBeDefined();
    }
  });

  it("ids uniques, titres en français et en anglais, espace fine avant « ? » en français", () => {
    const ids = READY_DUELS.map((duel) => duel.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(DUEL_TITLES.fr[id], id).toMatch(/ \?$/);
      expect(DUEL_TITLES.en[id], id).toMatch(/[^\s]\?$/);
    }
    expect(Object.keys(DUEL_TITLES.fr).sort()).toEqual([...ids].sort());
  });

  it("Paris–Marseille : 752 km (cas pratique ADEME, 1 504 km aller-retour), dans le curseur", () => {
    expect(PARIS_MARSEILLE_KM).toBe(1504 / 2);
    expect(READY_DUELS[0].state).toEqual({
      step: "duel",
      a: "tgv",
      b: "avion",
      quantity: 752,
    });
  });

  it("vélo ou voiture sur 5 km, comme le mini-duel de l'accueil", () => {
    const duel = READY_DUELS.find((d) => d.id === "velo-voiture")!;
    expect(comparisonQuery(duel.state)).toBe("a=velo&b=voiture&q=5");
  });
});

describe("Duel du jour", () => {
  it("le même toute la journée, à Paris, quel que soit le fuseau du téléphone", () => {
    // 10 octobre 2026 : de 0 h à 23 h 59, heure de Paris (UTC+2).
    const morning = new Date("2026-10-09T22:00:00Z");
    const night = new Date("2026-10-10T21:59:59Z");
    expect(dailyDuel(morning).id).toBe(dailyDuel(night).id);
    expect(parisDayNumber(morning)).toBe(parisDayNumber(night));
  });

  it("change à minuit, heure de Paris", () => {
    const before = new Date("2026-10-10T21:59:59Z");
    const after = new Date("2026-10-10T22:00:00Z");
    expect(parisDayNumber(after)).toBe(parisDayNumber(before) + 1);
    expect(dailyDuel(after).id).not.toBe(dailyDuel(before).id);
  });

  it("déterministe : chaque duel revient tous les N jours, dans l'ordre de la liste", () => {
    const start = new Date("2026-10-10T10:00:00Z");
    const seen = Array.from(
      { length: READY_DUELS.length },
      (_, i) => dailyDuel(new Date(start.getTime() + i * 86_400_000)).id,
    );
    expect(new Set(seen).size).toBe(READY_DUELS.length);
    const later = new Date(start.getTime() + READY_DUELS.length * 86_400_000);
    expect(dailyDuel(later).id).toBe(seen[0]);
  });

  it("la liste du jour commence par le Duel du jour et contient chaque duel une fois", () => {
    const now = new Date("2026-10-10T10:00:00Z");
    const list = duelsFromToday(now);
    expect(list[0]).toBe(dailyDuel(now));
    expect(new Set(list.map((d) => d.id)).size).toBe(READY_DUELS.length);
  });
});
