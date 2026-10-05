import { describe, expect, it } from "vitest";
import type { JournalEntry } from "@/lib/data/types";
import {
  analyzeJournal,
  categoriesIn,
  DEFAULT_VIEW,
  filterEntries,
  lightChoicesByDay,
  parseView,
  sortEntries,
  viewQuery,
} from "./analysis";

const entry = (
  id: string,
  date: Date,
  gesture: string,
  avoidedKg: number,
): JournalEntry => ({
  id,
  date: date.toISOString(),
  gestureA: "autre",
  gestureB: gesture,
  quantity: 1,
  chosen: "b",
  avoidedKg,
});

const NOW = new Date(2026, 9, 5, 18, 0); // dimanche 5 octobre 2026, 18 h (heure locale)
const at = (daysAgo: number, hour = 12) =>
  new Date(2026, 9, 5 - daysAgo, hour, 0);

const ENTRIES = [
  entry("tgv", at(0, 9), "tgv", 66.5), // transport, léger
  entry("velo", at(1), "velo", 0.4), // transport, léger
  entry("vege", at(2), "repas-vegetarien", 4.1), // alimentation, léger
  entry("avion", at(3), "avion", 0), // transport, noté (plus lourd)
  entry("jean", at(8), "jean", 25.1), // habillement, léger, hors semaine
];
const ids = (list: JournalEntry[]) => list.map((e) => e.id);

describe("carnet : tri", () => {
  it("par date : du plus récent au plus ancien (par défaut)", () => {
    expect(ids(sortEntries(ENTRIES, "date"))).toEqual([
      "tgv",
      "velo",
      "vege",
      "avion",
      "jean",
    ]);
  });
  it("par écart : du plus grand au plus petit", () => {
    expect(ids(sortEntries(ENTRIES, "ecart"))).toEqual([
      "tgv",
      "jean",
      "vege",
      "velo",
      "avion",
    ]);
  });
  it("par catégorie : ordre du parcours, puis le plus récent", () => {
    expect(ids(sortEntries(ENTRIES, "categorie"))).toEqual([
      "tgv",
      "velo",
      "avion",
      "vege",
      "jean",
    ]);
  });
  it("ne modifie pas le carnet reçu", () => {
    const copy = [...ENTRIES];
    sortEntries(ENTRIES, "ecart");
    expect(ENTRIES).toEqual(copy);
  });
});

describe("carnet : filtres", () => {
  it("par catégorie", () => {
    expect(
      ids(filterEntries(ENTRIES, { categorie: "transport", choix: "tous" })),
    ).toEqual(["tgv", "velo", "avion"]);
  });
  it("choix légers ou notés (plus lourds)", () => {
    expect(
      ids(filterEntries(ENTRIES, { categorie: null, choix: "legers" })),
    ).toEqual(["tgv", "velo", "vege", "jean"]);
    expect(
      ids(filterEntries(ENTRIES, { categorie: null, choix: "notes" })),
    ).toEqual(["avion"]);
  });
  it("filtres et tri combinés", () => {
    expect(
      ids(
        analyzeJournal(ENTRIES, {
          tri: "ecart",
          categorie: "transport",
          choix: "legers",
        }),
      ),
    ).toEqual(["tgv", "velo"]);
  });
  it("catégories présentes, dans l'ordre du parcours", () => {
    expect(categoriesIn(ENTRIES)).toEqual([
      "transport",
      "alimentation",
      "habillement",
    ]);
  });
});

describe("carnet : vue dans l'URL", () => {
  it("lecture, valeurs inconnues ignorées", () => {
    const view = parseView(
      new URLSearchParams("tri=ecart&categorie=transport&choix=legers"),
    );
    expect(view).toEqual({
      tri: "ecart",
      categorie: "transport",
      choix: "legers",
    });
    expect(
      parseView(new URLSearchParams("tri=poids&categorie=x&choix=")),
    ).toEqual(DEFAULT_VIEW);
  });
  it("écriture : rien pour la vue par défaut, aller-retour fidèle", () => {
    expect(viewQuery(DEFAULT_VIEW)).toBe("");
    const view = {
      tri: "categorie",
      categorie: "alimentation",
      choix: "notes",
    } as const;
    expect(viewQuery(view)).toBe(
      "?tri=categorie&categorie=alimentation&choix=notes",
    );
    expect(parseView(new URLSearchParams(viewQuery(view)))).toEqual(view);
  });
});

describe("carnet : choix légers des 7 derniers jours", () => {
  it("7 jours, du plus ancien à aujourd'hui, choix légers seulement", () => {
    const days = lightChoicesByDay(ENTRIES, NOW);
    expect(days.map((d) => d.key)).toEqual([
      "2026-09-29",
      "2026-09-30",
      "2026-10-01",
      "2026-10-02",
      "2026-10-03",
      "2026-10-04",
      "2026-10-05",
    ]);
    expect(days.map((d) => d.count)).toEqual([0, 0, 0, 0, 1, 1, 1]);
  });
  it("le choix plus lourd et celui d'il y a 8 jours ne comptent pas", () => {
    const total = lightChoicesByDay(ENTRIES, NOW).reduce(
      (sum, d) => sum + d.count,
      0,
    );
    expect(total).toBe(3);
  });
  it("plusieurs choix le même jour, jour local (minuit)", () => {
    const list = [
      entry("a", new Date(2026, 9, 5, 0, 5), "tgv", 1),
      entry("b", new Date(2026, 9, 5, 23, 55), "tgv", 1),
      entry("c", new Date(2026, 9, 4, 23, 59), "tgv", 1),
    ];
    const days = lightChoicesByDay(list, NOW);
    expect(days.at(-1)!.count).toBe(2);
    expect(days.at(-2)!.count).toBe(1);
  });
  it("carnet vide : sept jours à zéro", () => {
    expect(lightChoicesByDay([], NOW).every((d) => d.count === 0)).toBe(true);
  });
});
