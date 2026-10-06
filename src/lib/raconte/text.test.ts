import { describe, expect, it } from "vitest";
import type { Detection } from "./detections";
import { toProposal } from "./proposal";
import {
  blockingFor,
  comparedToLabel,
  ERROR_MESSAGES,
  inlineNeed,
  proposalSubtitle,
  rowCheckboxId,
  rowFieldId,
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

  it("ce qui bloque l'ajout : nombre de gestes cochés à compléter, et le premier", () => {
    const ter = toProposal(detection(), 0);
    const marche = toProposal(detection({ gestureId: "marche" }), 1);
    const cafe = toProposal(detection({ gestureId: "cafe" }), 2);
    const jean = toProposal(detection({ gestureId: "jean", mode: null }), 3);

    expect(blockingFor([{ proposal: ter, checked: false }])).toEqual({
      message: "Coche au moins un geste pour l’ajouter au carnet.",
      focusId: rowCheckboxId(ter.key),
    });
    expect(
      blockingFor([
        { proposal: cafe, checked: true },
        { proposal: ter, checked: true },
      ]),
    ).toEqual({ message: "1 geste à compléter", focusId: rowFieldId(ter.key) });
    expect(
      blockingFor([
        { proposal: jean, checked: true },
        { proposal: ter, checked: true },
        { proposal: marche, checked: true },
      ]),
    ).toEqual({
      message: "3 gestes à compléter",
      focusId: rowFieldId(jean.key),
    });
    // Un geste décoché n'est jamais à compléter.
    expect(
      blockingFor([
        { proposal: ter, checked: false },
        { proposal: marche, checked: true },
      ])?.message,
    ).toBe("1 geste à compléter");
    expect(
      blockingFor([
        { proposal: ter, checked: false },
        { proposal: cafe, checked: true },
      ]),
    ).toBeNull();
    expect(
      blockingFor([{ proposal: { ...ter, quantity: 65 }, checked: true }]),
    ).toBeNull();
  });

  it("champ dans la carte : distance d'un trajet ou option d'un objet manquante", () => {
    expect(inlineNeed(toProposal(detection(), 0))).toBe("quantity");
    expect(inlineNeed(toProposal(detection({ quantity: 12 }), 0))).toBeNull();
    expect(inlineNeed(toProposal(detection({ gestureId: "jean" }), 0))).toBe(
      "object-option",
    );
    expect(
      inlineNeed(toProposal(detection({ gestureId: "jean", mode: "neuf" }), 0)),
    ).toBeNull();
    expect(
      inlineNeed(toProposal(detection({ gestureId: "cafe" }), 0)),
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
