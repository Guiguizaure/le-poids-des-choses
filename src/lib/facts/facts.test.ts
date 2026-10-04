import { describe, expect, it } from "vitest";
import { getGesture, getGestures } from "@/lib/data";
import {
  buildFact,
  daySeed,
  FACT_TEMPLATES,
  missingFactGestures,
  pickFact,
  readableNumber,
} from "./index";

describe("Le savais-tu ? : gabarits", () => {
  it("8 à 10 gabarits, ids uniques", () => {
    expect(FACT_TEMPLATES.length).toBeGreaterThanOrEqual(8);
    expect(FACT_TEMPLATES.length).toBeLessThanOrEqual(10);
    const ids = FACT_TEMPLATES.map((template) => template.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(FACT_TEMPLATES.map((template) => [template.id, template]))(
    "%s : valeur finie et positive avec les données actuelles",
    (_, template) => {
      const fact = buildFact(template)!;
      expect(fact).not.toBeNull();
      expect(Number.isFinite(fact.value)).toBe(true);
      expect(fact.value).toBeGreaterThan(0);
      // Les phrases au pluriel (« 12 repas végétariens ») demandent plus d'une unité.
      if (template.kind !== "mass") expect(fact.value).toBeGreaterThan(1.5);
      expect(fact.text).not.toMatch(/NaN|Infinity|undefined|\{|\}/);
      expect(fact.source.url).toMatch(/^https:\/\/impactco2\.fr\//);
    },
  );

  it("aucun chiffre écrit à la main : la phrase suit les données", () => {
    // Même gabarit, données doublées pour le jean : la valeur double.
    const template = FACT_TEMPLATES.find((t) => t.id === "jean-voiture")!;
    const jean = getGesture("jean")!;
    const doubled = {
      ...jean,
      modes: {
        ...jean.modes,
        neuf: { ...jean.modes!.neuf!, kgCo2e: jean.modes!.neuf!.kgCo2e * 2 },
      },
    };
    const fact = buildFact(template)!;
    const twice = buildFact(template, (id) =>
      id === "jean" ? doubled : getGesture(id),
    )!;
    expect(twice.value).toBeCloseTo(fact.value * 2, 6);
  });

  it("chaque gabarit référence des gestes qui existent", () => {
    expect(missingFactGestures()).toEqual([]);
  });

  it("un geste disparu est signalé (le build échoue alors)", () => {
    const lookup = (id: string) => (id === "tgv" ? undefined : getGesture(id));
    expect(missingFactGestures(FACT_TEMPLATES, lookup)).toEqual([
      "smartphone-tgv → tgv",
      "avion-tgv → tgv",
    ]);
    // Un mode d'acquisition disparu aussi.
    const noNew = (id: string) => {
      const gesture = getGesture(id);
      return id === "jean" && gesture
        ? { ...gesture, modes: { garder: gesture.modes!.garder! } }
        : gesture;
    };
    expect(missingFactGestures(FACT_TEMPLATES, noNew)).toEqual([
      "jean-voiture → jean (neuf)",
    ]);
  });
});

describe("Le savais-tu ? : choix et mise en forme", () => {
  it("arrondi lisible", () => {
    expect(readableNumber(0.53)).toBe("0,5");
    expect(readableNumber(7.26)).toBe("7,3");
    expect(readableNumber(12.6)).toBe("13");
    expect(readableNumber(78.6)).toBe("79");
    expect(readableNumber(109)).toBe("110");
    expect(readableNumber(1234)).toMatch(/^1\s200$/);
    expect(readableNumber(12_345)).toMatch(/^12\s000$/);
  });

  it("même graine, même fait ; graines différentes, faits variés", () => {
    expect(pickFact("2026-10-04")).toEqual(pickFact("2026-10-04"));
    const days = Array.from({ length: 60 }, (_, i) =>
      daySeed(Date.UTC(2026, 0, 1, 12) + i * 86_400_000),
    );
    const ids = new Set(days.map((day) => pickFact(day)!.id));
    expect(ids.size).toBeGreaterThan(5);
  });

  it("en lien avec les gestes comparés quand c'est possible", () => {
    for (const day of ["2026-10-04", "2026-10-05", "2026-10-06"]) {
      expect(pickFact(day, ["tgv", "avion"])!.gestureIds).toEqual(
        expect.arrayContaining([expect.stringMatching(/^(tgv|avion)$/)]),
      );
    }
    // Aucun fait sur ces gestes : on retombe sur tous les faits.
    expect(pickFact("2026-10-04", ["marche"])).not.toBeNull();
  });

  it("chaque fait renvoie au geste source et à la méthode", () => {
    for (const template of FACT_TEMPLATES) {
      const fact = buildFact(template)!;
      expect(fact.source.label).toBe(
        getGesture(template.gestures[0].id)!.label,
      );
      expect(fact.methodHref).toBe("/methode#savais-tu");
    }
  });

  it("graine du jour en date locale", () => {
    expect(daySeed(new Date(2026, 9, 4, 23, 30).getTime())).toBe("2026-10-04");
  });

  it("couvre plusieurs familles de gestes", () => {
    const categories = new Set(
      FACT_TEMPLATES.map(
        (t) => getGestures().find((g) => g.id === t.gestures[0].id)!.category,
      ),
    );
    expect(categories.size).toBeGreaterThanOrEqual(4);
  });
});

describe("Le savais-tu ? : garde-fou du build", () => {
  it("passe avec les données actuelles, échoue sur un geste disparu", async () => {
    const { checkFacts } = await import("./check");
    expect(checkFacts().ok).toBe(true);
    const failed = checkFacts(["avion-tgv → tgv"]);
    expect(failed.ok).toBe(false);
    expect(failed.message).toContain("avion-tgv → tgv");
  });
});
