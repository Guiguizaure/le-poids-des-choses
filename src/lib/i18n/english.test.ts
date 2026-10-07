// Version anglaise : les textes calculés (phrases, carnet, jardin, faits, paliers, compte,
// partage) sont en anglais, sans chiffre inventé ni mot malhonnête, et le français ne change pas.
import { describe, expect, it } from "vitest";
import { formatMass } from "@/lib/calc";
import {
  duelComparison,
  equivalenceSentence,
  gestureNoun,
  objectSentence,
  resultSentence,
} from "@/lib/compare";
import {
  gestureDetail,
  gestureLabel,
  getGesture,
  getGestures,
} from "@/lib/data";
import type { ComparisonEntry, JournalEntry } from "@/lib/data/types";
import { buildFact, FACT_TEMPLATES } from "@/lib/facts";
import {
  arrivalExclamation,
  arrivalMessage,
  gardenDescription,
  nextAnimalMessage,
  revealTitle,
  wateringMessage,
} from "@/lib/garden/text";
import { buildGarden, type WaterReveal } from "@/lib/garden/model";
import { habitLabel, orderedHabits } from "@/lib/habits";
import { entryTitle, relativeDay } from "@/lib/journal/display";
import { milestoneCard, MILESTONES_KG } from "@/lib/milestones";
import { blockingFor, proposalSubtitle } from "@/lib/raconte/text";
import { toProposal } from "@/lib/raconte/proposal";
import {
  formatPerKilo,
  getSeasonalProduct,
  productLabel,
  seasonRange,
} from "@/lib/saison";
import { shareCardTexts } from "@/lib/share/card";
import { syncDateLabel } from "@/lib/sync/messages";
import { getSeasonalProducts } from "@/lib/saison";
import { localizeHref } from "./index";
import {
  prefersEnglish,
  readDismissed,
  shouldOfferEnglish,
} from "./language-banner";

const DISHONEST = /\b(sav(e|ed|ing)|avoid(ed|ing)?|won|reduc(e|ed|ing))\b/i;
/** Mots français qui n'ont rien à faire dans une phrase anglaise. */
const FRENCH =
  /\b(le|la|les|du|des|ton|tes|avec|pour|plus|que|jardin|carnet|écart|geste)\b/i;

const comparison = (
  id: string,
  over: Partial<ComparisonEntry> = {},
): ComparisonEntry => ({
  id,
  date: "2026-10-06T10:00:00.000Z",
  gestureA: "tgv",
  gestureB: "avion",
  quantity: 50,
  chosen: "a",
  avoidedKg: 5,
  ...over,
});

describe("formats anglais", () => {
  it("masses : point décimal, mêmes unités", () => {
    expect(formatMass(1.25, "en")).toBe("1.3 kg");
    expect(formatMass(1.25)).toBe("1,3 kg");
    expect(formatMass(0.35, "en")).toBe("350 g");
    expect(formatMass(1400, "en")).toBe("1.4 t");
  });
  it("impact au kilo : espaces insécables gardées", () => {
    expect(formatPerKilo(4.811, "en")).toBe("4.8 kg CO2e/kg");
    expect(formatPerKilo(4.811)).toBe("4,8 kg CO2e/kg");
  });
  it("jours relatifs et dates à l'anglaise", () => {
    const now = new Date(2026, 9, 6, 12);
    expect(relativeDay(new Date(2026, 9, 6, 9).toISOString(), now, "en")).toBe(
      "Today",
    );
    expect(relativeDay(new Date(2026, 9, 5, 9).toISOString(), now, "en")).toBe(
      "Yesterday",
    );
    expect(relativeDay(new Date(2026, 8, 12, 9).toISOString(), now, "en")).toBe(
      "12 Sept",
    );
    expect(
      syncDateLabel(new Date(2026, 9, 6, 14, 32).toISOString(), now, "en"),
    ).toBe("today at 14:32");
  });
});

describe("noms traduits", () => {
  it("gestes : nom anglais, valeurs inchangées", () => {
    expect(gestureLabel("voiture", "en")).toBe("Petrol or diesel car");
    expect(gestureLabel("voiture")).toBe("Voiture thermique");
    expect(gestureDetail("tgv", "en")).toBe("high-speed train");
    expect(gestureDetail("ter", "en")).toBe("regional train");
    expect(gestureDetail("tgv")).toBeUndefined();
  });
  it("produits de saison : nom anglais, valeurs inchangées", () => {
    const garlic = getSeasonalProduct("ail")!;
    expect(productLabel(garlic, "en")).toBe("Garlic");
    expect(productLabel(garlic)).toBe("Ail");
    const [lightest, heaviest] = seasonRange(10, undefined, "en");
    const [fr1, fr2] = seasonRange(10);
    expect(lightest.kgCo2ePerKg).toBe(fr1.kgCo2ePerKg);
    expect(heaviest.kgCo2ePerKg).toBe(fr2.kgCo2ePerKg);
  });
  it("habitudes : nom court anglais, même ordre", () => {
    expect(habitLabel("velo", "en")).toBe("By bike");
    expect(habitLabel("velo")).toBe("À vélo");
    expect(orderedHabits([], "en").map((h) => h.gesture)).toEqual(
      orderedHabits([]).map((h) => h.gesture),
    );
  });
});

describe("phrases du duel en anglais", () => {
  it("rapport, différence, sans mot malhonnête", () => {
    const result = duelComparison("tgv", "avion", 50)!;
    const nouns = {
      a: gestureNoun("tgv", "en"),
      b: gestureNoun("avion", "en"),
    };
    const sentence = resultSentence(result, nouns, "km", "en");
    expect(sentence).toMatch(
      /^On this journey, the TGV is [\d.]+ times lighter than the plane, which is [\d.]+ k?g CO2e less\.$/,
    );
    expect(sentence).not.toMatch(DISHONEST);
  });
  it("chaque paire du catalogue donne une phrase anglaise", () => {
    const byUnit = new Map<string, string[]>();
    for (const gesture of getGestures())
      if (gesture.unit !== "objet")
        byUnit.set(gesture.unit, [
          ...(byUnit.get(gesture.unit) ?? []),
          gesture.id,
        ]);
    for (const [unit, ids] of byUnit)
      for (const a of ids)
        for (const b of ids) {
          if (a === b) continue;
          const result = duelComparison(a, b, getGesture(a)!.defaultQuantity)!;
          const text = resultSentence(
            result,
            { a: gestureNoun(a, "en"), b: gestureNoun(b, "en") },
            getGesture(a)!.unit,
            "en",
          );
          expect(text, `${unit} ${a}/${b}`).not.toMatch(FRENCH);
          expect(text).not.toMatch(DISHONEST);
        }
  });
  it("objets et équivalence", () => {
    expect(objectSentence("Second-hand", "new", 1, 25, "en")).toMatch(
      /^Second-hand rather than new: 25 times lighter, which is 24 kg CO2e less\.$/,
    );
    expect(objectSentence("Keeping yours", "new", 0, 25, "en")).toBe(
      "Keeping yours rather than new: nothing new to make, which is 25 kg CO2e less.",
    );
    expect(equivalenceSentence(240, 0.2, "en")).toBe(
      "The difference equals 1,200 km in a petrol or diesel car.",
    );
    expect(gestureNoun("marche", "en").choose).toBe("I’ll walk");
  });
});

describe("carnet en anglais", () => {
  it("titres des choix", () => {
    expect(entryTitle(comparison("a"), "en")).toBe("TGV rather than plane");
    expect(
      entryTitle(
        comparison("b", {
          gestureA: "jean",
          gestureB: "jean",
          quantity: 1,
          chosen: "b",
          modeA: "neuf",
          modeB: "occasion",
        }),
        "en",
      ),
    ).toBe("Second-hand jeans rather than new");
    expect(
      entryTitle(
        comparison("c", {
          gestureA: "ordinateur-portable",
          gestureB: "ordinateur-portable",
          quantity: 1,
          chosen: "b",
          modeA: "neuf",
          modeB: "garder",
        }),
        "en",
      ),
    ).toBe("Kept my laptop rather than new");
    expect(
      entryTitle(
        { kind: "habit", id: "h", date: "2026-10-06", gesture: "velo" },
        "en",
      ),
    ).toBe("By bike");
  });
});

describe("jardin en anglais", () => {
  const entries: JournalEntry[] = [comparison("a"), comparison("b")];
  const garden = buildGarden(entries, new Date("2026-10-06T12:00:00Z"));

  it("description accessible", () => {
    expect(
      gardenDescription(garden, "automne", { visitors: 2, night: true }, "en"),
    ).toBe("Garden: 2 plants, 1 animal, 2 visitors, in autumn, at night");
  });
  it("arrivées, révélation, prochain animal", () => {
    expect(arrivalExclamation("ladybug", "en")).toBe(
      "And here comes a ladybird!",
    );
    expect(arrivalMessage("butterfly", "saison", "en")).toBe(
      "A butterfly has moved into your garden: you’ll see it in spring",
    );
    expect(nextAnimalMessage({ kind: "ladybug", remaining: 1 }, "en")).toBe(
      "1 more lighter choice until the ladybird arrives",
    );
    expect(
      revealTitle(
        { plant: { kind: { type: "tree" }, stage: "pousse" }, isNew: true },
        "en",
      ),
    ).toBe("A little sprout is about to come up");
  });
  it("arrosage, jamais de kg", () => {
    const reveal: WaterReveal = {
      newDay: true,
      moved: [],
      featured: null,
      plantCount: 3,
      nextStepIn: 2,
      target: null,
      targetMoved: false,
      targetToNext: null,
    };
    expect(wateringMessage(reveal, "en")).toBe(
      "Your garden’s been watered. 2 more waterings until the next step.",
    );
  });
});

describe("faits et paliers en anglais : valeurs calculées, mêmes que le français", () => {
  it("chaque gabarit « Did you know? »", () => {
    for (const template of FACT_TEMPLATES) {
      const en = buildFact(template, getGesture, getSeasonalProduct, "en")!;
      const fr = buildFact(template)!;
      expect(en.value, template.id).toBe(fr.value);
      expect(en.text, template.id).not.toMatch(/NaN|Infinity|undefined|\{|\}/);
      expect(en.text, template.id).not.toMatch(FRENCH);
      expect(en.text, template.id).not.toMatch(DISHONEST);
    }
  });
  it("chaque palier", () => {
    for (const milestone of MILESTONES_KG) {
      const card = milestoneCard(milestone, getGesture, "en")!;
      expect(card.value).toBe(milestoneCard(milestone)!.value);
      expect(card.title).toBe(
        `${milestone.toLocaleString("en-GB")} kg CO2e difference from the other options`,
      );
      expect(card.text).toMatch(/^That’s as much as [\d,.]+ .+\.$/);
      expect(`${card.title} ${card.text}`).not.toMatch(DISHONEST);
    }
  });
});

describe("raconte, partage, adresses, bandeau", () => {
  it("lignes de « Tell us about your day »", () => {
    const proposal = toProposal(
      {
        excerpt: "a burger",
        gestureId: "repas-boeuf",
        certainty: "inferred",
        quantity: null,
        mode: null,
      },
      0,
    );
    expect(proposalSubtitle(proposal, "en")).toBe(
      "Eating · 1 meal · from “a burger”",
    );
    expect(blockingFor([{ proposal, checked: false }], "en")?.message).toBe(
      "Tick at least one action to add it to your journal.",
    );
  });
  it("image de partage en anglais, sans kg", () => {
    const texts = shareCardTexts({
      lightChoiceCount: 1,
      animalCount: 2,
      asleep: false,
      siteHost: "x.fr",
      locale: "en",
    });
    expect(texts.title).toBe("My garden");
    expect(texts.pills).toEqual(["1 lighter choice", "2 animals"]);
    expect(JSON.stringify(texts)).not.toMatch(/kg|CO2/);
  });
  it("liens internes traduits, paramètres gardés", () => {
    expect(localizeHref("/jardin?nouveau=x", "en")).toBe(
      "/en/garden?nouveau=x",
    );
    expect(localizeHref("/methode#habitudes", "en")).toBe(
      "/en/method#habitudes",
    );
    expect(localizeHref("/comparer", "fr")).toBe("/comparer");
    expect(localizeHref("https://impactco2.fr", "en")).toBe(
      "https://impactco2.fr",
    );
    expect(localizeHref("/labo", "en")).toBe("/labo");
    expect(localizeHref("/en/garden", "en")).toBe("/en/garden");
  });
  it("bandeau de langue : navigateur en anglais, jamais refermé", () => {
    expect(prefersEnglish(["en-GB", "fr"])).toBe(true);
    expect(prefersEnglish(["fr-FR", "en"])).toBe(false);
    expect(prefersEnglish([])).toBe(false);
    expect(shouldOfferEnglish(["en-US"], false)).toBe(true);
    expect(shouldOfferEnglish(["en-US"], true)).toBe(false);
    expect(readDismissed(JSON.stringify({ version: 1, dismissed: true }))).toBe(
      true,
    );
    expect(readDismissed("{")).toBe(false);
    expect(readDismissed(null)).toBe(false);
  });
  it("chaque produit de saison a un nom anglais distinct", () => {
    const names = getSeasonalProducts().map((p) => productLabel(p, "en"));
    expect(new Set(names).size).toBe(names.length);
  });
});
