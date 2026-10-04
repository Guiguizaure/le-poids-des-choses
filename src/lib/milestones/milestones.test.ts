import { describe, expect, it } from "vitest";
import { emissions, withMode } from "@/lib/calc";
import { getGesture } from "@/lib/data";
import type { JournalEntry } from "@/lib/data/types";
import {
  MILESTONES_KG,
  milestoneCard,
  milestoneCrossed,
  missingMilestoneGestures,
  reachedMilestones,
} from "./index";

const entry = (id: string, avoidedKg: number): JournalEntry => ({
  id,
  date: "2026-10-05T10:00:00.000Z",
  gestureA: "avion",
  gestureB: "tgv",
  quantity: 1,
  chosen: avoidedKg > 0 ? "b" : "a",
  avoidedKg,
});

describe("paliers de l'écart cumulé", () => {
  it("10, 50, 100, 250, 500 et 1000 kg CO2e", () => {
    expect([...MILESTONES_KG]).toEqual([10, 50, 100, 250, 500, 1000]);
  });
  it("paliers atteints", () => {
    expect(reachedMilestones(0)).toEqual([]);
    expect(reachedMilestones(9.99)).toEqual([]);
    expect(reachedMilestones(10)).toEqual([10]);
    expect(reachedMilestones(260)).toEqual([10, 50, 100, 250]);
    expect(reachedMilestones(5000)).toEqual([...MILESTONES_KG]);
  });
  it("franchi par le dernier choix léger seulement", () => {
    expect(milestoneCrossed([])).toBeNull();
    expect(milestoneCrossed([entry("a", 6), entry("b", 3)])).toBeNull();
    expect(milestoneCrossed([entry("a", 6), entry("b", 4)])).toBe(10);
    // Déjà franchi avant : plus rien au choix suivant.
    expect(
      milestoneCrossed([entry("a", 6), entry("b", 4), entry("c", 1)]),
    ).toBeNull();
    // Un choix plus lourd noté ensuite ne cache pas le palier.
    expect(
      milestoneCrossed([entry("a", 6), entry("b", 4), entry("c", 0)]),
    ).toBe(10);
  });
  it("plusieurs paliers d'un coup : le plus haut", () => {
    expect(milestoneCrossed([entry("a", 5), entry("b", 66.5)])).toBe(50);
    expect(milestoneCrossed([entry("a", 120)])).toBe(100);
  });
});

describe("équivalence de chaque palier", () => {
  it.each(MILESTONES_KG.map((m) => [m]))(
    "%s kg : valeur finie et positive, formulation honnête, source",
    (milestone) => {
      const card = milestoneCard(milestone)!;
      expect(card).not.toBeNull();
      expect(Number.isFinite(card.value)).toBe(true);
      expect(card.value).toBeGreaterThan(1);
      expect(card.title).toBe(
        `${milestone === 1000 ? "1 000" : milestone} kg de CO2e d’écart avec les autres options`,
      );
      expect(card.text).toMatch(/^C’est autant que [\d\s ,]+ .+\.$/);
      expect(`${card.title} ${card.text}`).not.toMatch(
        /évit|économis|sauv|NaN|Infinity|undefined/,
      );
      expect(card.source.url).toMatch(/^https:\/\/impactco2\.fr\//);
      expect(card.methodHref).toBe("/methode#ecart");
    },
  );
  it("calculée avec nos données et nos fonctions (rien d'écrit à la main)", () => {
    const voiture = getGesture("voiture")!;
    expect(milestoneCard(10)!.value).toBeCloseTo(10 / emissions(voiture, 1), 8);
    const jean = withMode(getGesture("jean")!, "neuf")!;
    expect(milestoneCard(250)!.value).toBeCloseTo(250 / emissions(jean, 1), 8);
  });
  it("accords : « jean neuf » au singulier, « jeans neufs » au pluriel", () => {
    expect(milestoneCard(250)!.text).toMatch(/jeans neufs\.$/);
    const oneJean = (id: string) => {
      const gesture = getGesture(id);
      return id === "jean" && gesture
        ? {
            ...gesture,
            modes: {
              ...gesture.modes,
              neuf: { ...gesture.modes!.neuf!, kgCo2e: 250 },
            },
          }
        : gesture;
    };
    expect(milestoneCard(250, oneJean)!.text).toBe(
      "C’est autant que 1 jean neuf.",
    );
  });
  it("un geste disparu est signalé (le build échoue alors)", () => {
    expect(missingMilestoneGestures()).toEqual([]);
    const noCar = (id: string) =>
      id === "voiture" ? undefined : getGesture(id);
    expect(missingMilestoneGestures(noCar)).toEqual([
      "palier 10 kg → voiture",
      "palier 1000 kg → voiture",
    ]);
    expect(milestoneCard(10, noCar)).toBeNull();
  });
});

describe("paliers : garde-fou du build", () => {
  it("passe avec les données actuelles, échoue sur un geste disparu", async () => {
    const { checkMilestones } = await import("./check");
    expect(checkMilestones().ok).toBe(true);
    const failed = checkMilestones(["palier 10 kg → voiture"]);
    expect(failed.ok).toBe(false);
    expect(failed.message).toContain("palier 10 kg → voiture");
  });
});
