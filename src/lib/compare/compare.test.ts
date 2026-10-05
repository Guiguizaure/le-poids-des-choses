import { describe, expect, it } from "vitest";
import { compare } from "@/lib/calc";
import { getGesture, getGestures } from "@/lib/data";
import type { Gesture } from "@/lib/data/types";
import { createEntry } from "@/lib/journal/entry";
import { createJournalStore } from "@/lib/journal/store";
import {
  areComparable,
  compatibleGestures,
  duelEntry,
  isValidQuantity,
  modeFor,
  objectEntry,
  positionFromQuantity,
  quantityFromPosition,
  SLIDERS,
  tiltFor,
} from "./duel";
import { gestureNoun, objectNoun, possessive } from "./nouns";
import {
  carKmFor,
  equivalenceSentence,
  formatRatio,
  objectSentence,
  resultSentence,
} from "./sentence";
import {
  comparisonHref,
  comparisonQuery,
  parseComparison,
  type ComparisonState,
} from "./url";

function fake(id: string, kg: number): Gesture {
  return {
    id,
    label: id,
    category: "transport",
    unit: "km",
    kgCo2ePerUnit: kg,
    defaultQuantity: 1,
    source: "fictive",
    fictive: true,
  };
}
const nouns = { a: gestureNoun("tgv"), b: gestureNoun("avion") };

describe("resultSentence", () => {
  it("X fois plus léger, avec l'écart en masse", () => {
    const c = compare(fake("a", 0.1), 10, fake("b", 1.2), 10);
    expect(resultSentence(c, nouns, "km")).toBe(
      "Sur ce trajet, le TGV est 12 fois plus léger que l’avion, soit 11 kg de CO2e en moins.",
    );
  });
  it("une décimale sous 10 fois", () => {
    const c = compare(fake("a", 1), 1, fake("b", 1.8), 1);
    expect(resultSentence(c, nouns, "km")).toContain("1,8 fois plus léger");
  });
  it("accord au féminin, et le plus léger peut être le côté B", () => {
    const c = compare(fake("a", 2), 1, fake("b", 0.5), 1);
    const text = resultSentence(
      c,
      { a: gestureNoun("avion"), b: gestureNoun("voiture") },
      "km",
    );
    expect(text).toBe(
      "Sur ce trajet, la voiture est 4 fois plus légère que l’avion, soit 1,5 kg de CO2e en moins.",
    );
  });
  it("plus de 100 fois au-delà de 100", () => {
    const c = compare(fake("a", 0.001), 100, fake("b", 0.2), 100);
    expect(resultSentence(c, nouns, "km")).toContain(
      "plus de 100 fois plus léger",
    );
  });
  it("pile 100 fois : chiffre exact", () => {
    const c = compare(fake("a", 0.01), 1, fake("b", 1), 1);
    expect(resultSentence(c, nouns, "km")).toContain("est 100 fois plus léger");
  });
  it("presque autant si presque égaux", () => {
    const c = compare(fake("a", 1), 1, fake("b", 1.05), 1);
    expect(resultSentence(c, nouns, "km")).toBe(
      "Sur ce trajet, le TGV et l’avion pèsent presque autant.",
    );
  });
  it("zéro émission quand le plus léger vaut 0 (marche)", () => {
    const c = compare(getGesture("voiture")!, 10, getGesture("marche")!, 10);
    expect(
      resultSentence(
        c,
        { a: gestureNoun("voiture"), b: gestureNoun("marche") },
        "km",
      ),
    ).toBe(
      "Sur ce trajet, la marche, c’est zéro émission, contre 1,4 kg de CO2e pour la voiture.",
    );
  });
  it("repas : sans « sur ce trajet », majuscule en tête", () => {
    const c = compare(
      getGesture("repas-boeuf")!,
      1,
      getGesture("repas-vegetarien")!,
      1,
    );
    const text = resultSentence(
      c,
      { a: gestureNoun("repas-boeuf"), b: gestureNoun("repas-vegetarien") },
      "repas",
    );
    expect(text).toMatch(
      /^Le repas végétarien est 5,8 fois plus léger que le repas au bœuf, soit 4,1 kg/,
    );
  });
  it("boissons : « pour un litre », accord au féminin", () => {
    const c = compare(
      getGesture("eau-bouteille")!,
      1,
      getGesture("eau-robinet")!,
      1,
    );
    expect(
      resultSentence(
        c,
        { a: gestureNoun("eau-bouteille"), b: gestureNoun("eau-robinet") },
        "litre",
      ),
    ).toBe(
      "Pour un litre, l’eau du robinet est plus de 100 fois plus légère que l’eau en bouteille, soit 321 g de CO2e en moins.",
    );
  });
  it("livraisons : « pour un même achat »", () => {
    const c = compare(
      getGesture("magasin-voiture")!,
      1,
      getGesture("point-relais-pied")!,
      1,
    );
    expect(
      resultSentence(
        c,
        {
          a: gestureNoun("magasin-voiture"),
          b: gestureNoun("point-relais-pied"),
        },
        "achat",
      ),
    ).toBe(
      "Pour un même achat, le point relais à pied est 7,3 fois plus léger que l’achat en magasin en voiture, soit 4,2 kg de CO2e en moins.",
    );
  });
  it("formatRatio", () => {
    expect(formatRatio(1.84)).toBe("1,8");
    expect(formatRatio(9.96)).toBe("10");
    expect(formatRatio(76.4)).toBe("76");
  });
});

describe("objectSentence", () => {
  it("d'occasion plutôt que neuf : X fois plus léger", () => {
    expect(objectSentence("D’occasion", "neuf", 0.722, 25.09)).toBe(
      "D’occasion plutôt que neuf : 35 fois plus léger, soit 24,4 kg de CO2e en moins.",
    );
  });
  it("garder ou occasion sans colis : aucune nouvelle fabrication (pas « zéro émission »)", () => {
    expect(objectSentence("Garder le tien", "neuf", 0, 25.09)).toBe(
      "Garder le tien plutôt que neuf : aucune nouvelle fabrication, soit 25,1 kg de CO2e en moins.",
    );
    const used = objectSentence("D’occasion", "neuf", 0, 25.09);
    expect(used).toBe(
      "D’occasion plutôt que neuf : aucune nouvelle fabrication, soit 25,1 kg de CO2e en moins.",
    );
    expect(used).not.toContain("zéro émission");
  });
  it("neuf : plus lourd", () => {
    expect(objectSentence("Neuf", "d’occasion", 25.09, 0.722)).toContain(
      "35 fois plus lourd",
    );
    expect(objectSentence("Neuf", "d’occasion", 25.09, 0)).toBe(
      "Neuf plutôt que d’occasion : 25,1 kg de CO2e de plus.",
    );
  });
  it("presque autant", () => {
    expect(objectSentence("A", "b", 1, 1.05)).toBe(
      "A plutôt que b : presque autant.",
    );
    expect(objectSentence("A", "b", 0, 0)).toBe(
      "A plutôt que b : presque autant.",
    );
  });
});

describe("équivalence en voiture thermique", () => {
  const car = getGesture("voiture")!.kgCo2ePerUnit;
  it("convertit l'écart en km de voiture", () => {
    expect(carKmFor(car * 77, car)).toBeCloseTo(77);
    expect(equivalenceSentence(car * 77, car)).toBe(
      "L’écart équivaut à 77 km en voiture thermique.",
    );
    expect(equivalenceSentence(car * 1287, car)).toBe(
      "L’écart équivaut à 1 300 km en voiture thermique.",
    );
  });
  it("moins d'1 km, ou rien sans écart", () => {
    expect(equivalenceSentence(car * 0.4, car)).toBe(
      "L’écart équivaut à moins d’1 km en voiture thermique.",
    );
    expect(equivalenceSentence(0, car)).toBe("");
  });
});

describe("filtrage par unité", () => {
  it("km avec km, repas avec repas, litre avec litre, achat avec achat", () => {
    for (const first of getGestures().filter((g) => g.unit !== "objet")) {
      const seconds = compatibleGestures(first.id);
      expect(seconds.length).toBeGreaterThan(0);
      expect(
        seconds.every((g) => g.unit === first.unit && g.id !== first.id),
      ).toBe(true);
    }
    expect(
      compatibleGestures("eau-robinet").every((g) => g.category === "boisson"),
    ).toBe(true);
    expect(compatibleGestures("livraison-domicile").map((g) => g.id)).toEqual([
      "point-relais-pied",
      "point-relais-voiture",
      "magasin-pied",
      "magasin-voiture",
    ]);
  });
  it("les objets n'ont pas de second geste ; unités différentes refusées", () => {
    expect(compatibleGestures("jean")).toEqual([]);
    expect(areComparable("tgv", "repas-boeuf")).toBe(false);
    expect(areComparable("eau-robinet", "livraison-domicile")).toBe(false);
    expect(compatibleGestures("smartphone")).toEqual([]);
    expect(areComparable("tgv", "avion")).toBe(true);
  });
  it("chaque geste comparable a un nom avec article", () => {
    for (const gesture of getGestures().filter((g) => g.unit !== "objet")) {
      expect(gestureNoun(gesture.id).text).toMatch(/^(le |la |l’)/);
    }
  });
});

describe("curseurs et inclinaison", () => {
  const km = SLIDERS.km!;
  it("distance : 1 à 1 000 km, défaut 50, échelle logarithmique aller-retour", () => {
    expect(quantityFromPosition(km, 0)).toBe(1);
    expect(quantityFromPosition(km, 1000)).toBe(1000);
    expect(quantityFromPosition(km, positionFromQuantity(km, 50))).toBe(50);
    expect(km.default).toBe(50);
  });
  it("seules les distances ont un curseur (plus de durée)", () => {
    expect(Object.keys(SLIDERS)).toEqual(["km"]);
    expect(isValidQuantity("litre", 1)).toBe(true);
    expect(isValidQuantity("achat", 2)).toBe(false);
  });
  it("quantités valides selon l'unité", () => {
    expect(isValidQuantity("km", 50)).toBe(true);
    expect(isValidQuantity("km", 0)).toBe(false);
    expect(isValidQuantity("km", 1001)).toBe(false);
    expect(isValidQuantity("km", 2.5)).toBe(false);
    expect(isValidQuantity("repas", 1)).toBe(true);
    expect(isValidQuantity("repas", 3)).toBe(false);
  });
  it("inclinaison : logarithme du rapport, plafonnée, du côté le plus lourd", () => {
    const tilt = (ka: number, kb: number) =>
      tiltFor(compare(fake("a", ka), 1, fake("b", kb), 1));
    expect(tilt(1, 1)).toBe(0);
    expect(tilt(1, 2)).toBeCloseTo(Math.log(2) / Math.log(50));
    expect(tilt(2, 1)).toBeCloseTo(-Math.log(2) / Math.log(50));
    expect(tilt(1, 500)).toBe(1);
    expect(tilt(0, 1)).toBe(1); // le plus léger vaut 0
    expect(Math.abs(tilt(1, 10))).toBeLessThan(Math.abs(tilt(1, 40)));
  });
});

describe("URL partageable", () => {
  const roundTrip = (state: ComparisonState) =>
    parseComparison(new URLSearchParams(comparisonQuery(state))).state;

  it("écrit puis relit chaque étape", () => {
    const states: ComparisonState[] = [
      { step: "first" },
      { step: "second", first: "tgv" },
      { step: "duel", a: "tgv", b: "avion", quantity: 300 },
      { step: "duel", a: "repas-boeuf", b: "repas-vegetarien", quantity: 1 },
      { step: "object", object: "jean", option: "occasion", delivered: true },
      {
        step: "object",
        object: "television",
        option: "garder",
        delivered: false,
      },
    ];
    for (const state of states) expect(roundTrip(state)).toEqual(state);
    expect(comparisonHref({ step: "first" })).toBe("/comparer");
    expect(
      comparisonHref({ step: "duel", a: "tgv", b: "avion", quantity: 50 }),
    ).toBe("/comparer?a=tgv&b=avion&q=50");
  });
  it("quantité absente : valeur par défaut ; option et colis par défaut pour un objet", () => {
    expect(parseComparison(new URLSearchParams("a=tgv&b=avion")).state).toEqual(
      { step: "duel", a: "tgv", b: "avion", quantity: 50 },
    );
    expect(parseComparison(new URLSearchParams("objet=jean")).state).toEqual({
      step: "object",
      object: "jean",
      option: "occasion",
      delivered: true,
    });
  });
  it.each([
    ["geste inconnu", "a=fusee&b=avion&q=10"],
    ["unités différentes", "a=tgv&b=repas-boeuf"],
    ["même geste", "a=tgv&b=tgv"],
    ["quantité hors limites", "a=tgv&b=avion&q=5000"],
    ["quantité illisible", "a=tgv&b=avion&q=beaucoup"],
    ["repas en plusieurs exemplaires", "a=repas-boeuf&b=repas-vegetarien&q=3"],
    ["objet en duel", "a=jean&b=tshirt"],
    ["objet inconnu", "objet=fusee"],
    ["geste non objet en objet", "objet=tgv"],
    ["option inconnue", "objet=jean&option=voler"],
    ["colis illisible", "objet=jean&colis=oui"],
    ["quantité sans gestes", "q=10"],
  ])("URL invalide (%s) : retour propre au choix des gestes", (_, query) => {
    expect(parseComparison(new URLSearchParams(query))).toEqual({
      state: { step: "first" },
      invalid: true,
    });
  });
});

describe("ajout au carnet depuis le duel", () => {
  const now = new Date("2026-10-05T10:00:00Z");
  it("choix léger : écart compté = écart", () => {
    const entry = createEntry(duelEntry("avion", "tgv", 300, "b"), {
      now,
      id: "1",
    });
    const c = compare(getGesture("avion")!, 300, getGesture("tgv")!, 300);
    expect(entry.avoidedKg).toBeCloseTo(c.differenceKg, 2);
  });
  it("choix lourd : noté, 0 kg", () => {
    expect(
      createEntry(duelEntry("avion", "tgv", 300, "a"), { now }).avoidedKg,
    ).toBe(0);
  });
  it("objet d'occasion livré : neuf − colis, avec les modes", () => {
    const entry = createEntry(objectEntry("jean", "occasion", true), { now });
    expect(entry).toMatchObject({
      gestureA: "jean",
      gestureB: "jean",
      modeA: "neuf",
      modeB: "occasion-livree",
      chosen: "b",
    });
    const jean = getGesture("jean")!;
    expect(entry.avoidedKg).toBeCloseTo(
      jean.kgCo2ePerUnit - jean.modes!["occasion-livree"]!.kgCo2e,
      2,
    );
  });
  it("objet gardé : l’écart vaut tout le neuf", () => {
    const entry = createEntry(objectEntry("television", "garder", false), {
      now,
    });
    expect(entry.modeB).toBe("garder");
    expect(entry.avoidedKg).toBeCloseTo(
      getGesture("television")!.kgCo2ePerUnit,
      2,
    );
  });
  it("objet neuf : choix plus lourd, comparé à l'occasion telle que réglée", () => {
    const entry = createEntry(objectEntry("jean", "neuf", false), { now });
    expect(entry).toMatchObject({
      modeA: "neuf",
      modeB: "occasion",
      chosen: "a",
      avoidedKg: 0,
    });
    expect(modeFor("occasion", true)).toBe("occasion-livree");
  });
  it("l'entrée rejoint le carnet", () => {
    const store = createJournalStore(null);
    store.add(
      createEntry(duelEntry("avion", "tgv", 50, "b"), { now, id: "x" }),
    );
    store.add(
      createEntry(objectEntry("jean", "garder", true), { now, id: "y" }),
    );
    expect(store.getEntries().map((e) => e.id)).toEqual(["x", "y"]);
  });
});

describe("noms des objets", () => {
  it("accords du possessif", () => {
    expect(possessive(objectNoun("jean"), "toi")).toBe("le tien");
    expect(possessive(objectNoun("television"), "moi")).toBe("la mienne");
    expect(possessive(objectNoun("chaussures"), "toi")).toBe("les tiennes");
  });
  it("chaque objet a un nom", () => {
    for (const gesture of getGestures().filter((g) => g.unit === "objet")) {
      expect(objectNoun(gesture.id).indefinite).toMatch(/^(Un|Une|Des) /);
    }
  });
});
