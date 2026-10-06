import { describe, expect, it } from "vitest";
import type { Detection } from "./detections";
import {
  canBeHabit,
  missingFor,
  proposalEntry,
  proposalHabit,
  toProposal,
} from "./proposal";
import { blockingFor, comparedToLabel, proposalSubtitle } from "./text";

const detection = (over: Partial<Detection> = {}): Detection => ({
  gestureId: "velo",
  excerpt: "vélo",
  certainty: "explicit",
  quantity: null,
  mode: null,
  ...over,
});

describe("« Raconte ta journée » : habitude ou comparaison, par geste", () => {
  it("comparaison par défaut ; habitude par défaut si elle est dans « Mes habitudes »", () => {
    expect(toProposal(detection(), 0).asHabit).toBe(false);
    expect(toProposal(detection(), 0, ["velo"]).asHabit).toBe(true);
    // Un geste hors de la table HABITS n'est jamais une habitude, même déclaré.
    expect(
      toProposal(detection({ gestureId: "voiture" }), 0, ["voiture"]).asHabit,
    ).toBe(false);
  });
  it("seuls les gestes de la table HABITS peuvent être notés en habitude", () => {
    expect(canBeHabit(toProposal(detection(), 0))).toBe(true);
    expect(canBeHabit(toProposal(detection({ gestureId: "avion" }), 0))).toBe(
      false,
    );
    expect(
      canBeHabit(toProposal(detection({ gestureId: "jean", mode: "neuf" }), 0)),
    ).toBe(false);
  });
  it("une habitude ne demande ni distance ni autre option, et ne donne aucune comparaison", () => {
    const habit = toProposal(detection(), 0, ["velo"]);
    expect(missingFor(habit)).toBeNull();
    expect(proposalEntry(habit)).toBeNull();
    expect(proposalHabit(habit)).toBe("velo");
    expect(comparedToLabel(habit)).toBeNull();
    expect(proposalSubtitle(habit)).toBe("Se déplacer · habitude, aucun kg");
    expect(blockingFor([{ proposal: habit, checked: true }])).toBeNull();
  });
  it("repassée en comparaison : la distance manque de nouveau", () => {
    const compared = {
      ...toProposal(detection(), 0, ["velo"]),
      asHabit: false,
    };
    expect(missingFor(compared)).toBe("quantity");
    expect(proposalHabit(compared)).toBeNull();
    expect(blockingFor([{ proposal: compared, checked: true }])?.message).toBe(
      "1 geste à compléter",
    );
  });
});
