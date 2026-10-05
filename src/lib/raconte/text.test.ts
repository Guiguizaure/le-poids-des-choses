import { describe, expect, it } from "vitest";
import type { Detection } from "./detections";
import { toProposal } from "./proposal";
import {
  blockingMessage,
  comparedToLabel,
  ERROR_MESSAGES,
  proposalSubtitle,
} from "./text";

const detection = (over: Partial<Detection> = {}): Detection => ({
  excerpt: "le train",
  gestureId: "ter",
  certainty: "explicit",
  quantity: null,
  mode: null,
  ...over,
});

describe("textes de l'écran 08", () => {
  it("lignes des gestes comme sur la maquette", () => {
    expect(proposalSubtitle(toProposal(detection(), 0))).toBe(
      "Se déplacer · distance à préciser",
    );
    expect(
      proposalSubtitle(
        toProposal(
          detection({
            gestureId: "repas-boeuf",
            certainty: "inferred",
            excerpt: "burger",
          }),
          0,
        ),
      ),
    ).toBe("Manger · 1 repas · d’après « burger »");
    expect(
      proposalSubtitle(toProposal(detection({ gestureId: "cafe" }), 0)),
    ).toBe("Boire · 1 litre");
    expect(
      proposalSubtitle(
        toProposal(detection({ gestureId: "jean", mode: null }), 0),
      ),
    ).toBe("S’habiller · option à préciser");
    expect(comparedToLabel(toProposal(detection(), 0))).toBe(
      "Comparé à : Voiture thermique",
    );
    expect(
      comparedToLabel(toProposal(detection({ gestureId: "jean" }), 0)),
    ).toBeNull();
  });

  it("ce qui bloque l'ajout : seulement les gestes cochés", () => {
    const ter = toProposal(detection(), 0);
    const cafe = toProposal(detection({ gestureId: "cafe" }), 1);
    expect(blockingMessage([{ proposal: ter, checked: false }])).toBe(
      "Coche au moins un geste pour l’ajouter au carnet.",
    );
    expect(
      blockingMessage([
        { proposal: ter, checked: true },
        { proposal: cafe, checked: true },
      ]),
    ).toBe("Précise la distance de « TER » avec « Modifier », ou décoche-le.");
    expect(
      blockingMessage([
        { proposal: ter, checked: false },
        { proposal: cafe, checked: true },
      ]),
    ).toBeNull();
    expect(
      blockingMessage([{ proposal: { ...ter, quantity: 65 }, checked: true }]),
    ).toBeNull();
  });

  it("aucun mot qui juge, aucun mot interdit pour les kg", () => {
    const all = Object.values(ERROR_MESSAGES).join(" ");
    expect(all).not.toMatch(/évité|économisé|sauvé|gagné|mauvais|dommage/i);
    for (const message of Object.values(ERROR_MESSAGES))
      expect(message).toMatch(
        /choisi[rs] tes gestes toi-même|relance l’analyse/,
      );
  });
});
