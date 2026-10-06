import { describe, expect, it } from "vitest";
import gestures from "@/lib/data/gestures.generated.json";
import saison from "@/lib/data/saison.generated.json";
import { missingEnglishGestureNames } from "@/lib/data";
import { FACT_TEMPLATES } from "@/lib/facts";
import { MILESTONES_KG } from "@/lib/milestones";
import { missingEnglishProductNames } from "@/lib/saison";
import { HABITS } from "@/lib/habits";
import * as all from "./index";
import { FACT_TEXTS, MILESTONE_UNITS } from "./facts";
import { HABIT_NAMES } from "./garden";
import { GESTURE_NOUNS, OBJECT_NOUNS } from "./nouns";
import {
  GESTURE_NAMES_EN,
  PRODUCT_CATEGORIES,
  PRODUCT_NAMES_EN,
} from "./names";

type Leaf = { path: string; value: unknown };

/** Feuilles d'un dictionnaire : chaînes, fonctions, nombres et booléens. */
function leaves(tree: unknown, prefix = ""): Leaf[] {
  if (tree === null || typeof tree !== "object")
    return [{ path: prefix, value: tree }];
  return Object.entries(tree).flatMap(([key, value]) =>
    leaves(value, prefix ? `${prefix}.${key}` : key),
  );
}

/** Champs propres à une langue (« I’ll walk » : forme du bouton quand l'anglais l'exige). */
const OPTIONAL = /\.choose$/;
const shared = (list: Leaf[]) =>
  list.filter((leaf) => !OPTIONAL.test(leaf.path));

/** Tous les dictionnaires { fr, en } déclarés dans src/lib/i18n/messages. */
const dictionaries = Object.entries(all).flatMap(([file, exports]) =>
  Object.entries(exports as Record<string, unknown>)
    .filter(
      ([, value]) =>
        value !== null &&
        typeof value === "object" &&
        "fr" in (value as object) &&
        "en" in (value as object),
    )
    .map(([name, value]) => ({
      name: `${file}.${name}`,
      ...(value as { fr: unknown; en: unknown }),
    })),
);

const placeholders = (text: string) =>
  [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

/** Jamais « saved », « avoided », « won » ni « reduced » pour des kg. */
const DISHONEST = /\b(sav(e|ed|ing)|avoid(ed|ing)?|won|reduc(e|ed|ing))\b/i;

describe("fichiers de traduction", () => {
  it("on les trouve tous", () => {
    expect(dictionaries.length).toBeGreaterThan(15);
  });

  for (const dictionary of dictionaries) {
    describe(dictionary.name, () => {
      const fr = shared(leaves(dictionary.fr));
      const en = shared(leaves(dictionary.en));

      it("mêmes clés en français et en anglais", () => {
        expect(en.map((leaf) => leaf.path)).toEqual(
          fr.map((leaf) => leaf.path),
        );
      });
      it("même nature de valeur (texte, fonction…) des deux côtés", () => {
        const kinds = (list: Leaf[]) =>
          list.map((leaf) => `${leaf.path}:${typeof leaf.value}`);
        expect(kinds(en)).toEqual(kinds(fr));
      });
      it("mêmes emplacements ({month}, {date}…) dans les deux langues", () => {
        const byPath = new Map(en.map((leaf) => [leaf.path, leaf.value]));
        for (const leaf of fr) {
          if (typeof leaf.value !== "string") continue;
          expect(
            placeholders(String(byPath.get(leaf.path))),
            leaf.path,
          ).toEqual(placeholders(leaf.value));
        }
      });
      it("anglais : aucune chaîne vide, jamais « saved », « avoided »…", () => {
        const frByPath = new Map(fr.map((leaf) => [leaf.path, leaf.value]));
        for (const leaf of en) {
          if (typeof leaf.value !== "string") continue;
          if (frByPath.get(leaf.path) !== "")
            expect(leaf.value.trim(), leaf.path).not.toBe("");
          expect(leaf.value, leaf.path).not.toMatch(DISHONEST);
        }
      });
    });
  }
});

describe("tables de noms", () => {
  it("chaque geste des données a un nom anglais (et rien de plus)", () => {
    expect(missingEnglishGestureNames()).toEqual([]);
    const ids = gestures.gestures.map((gesture) => gesture.id).sort();
    expect(Object.keys(GESTURE_NAMES_EN).sort()).toEqual(ids);
  });
  it("chaque produit de saison a un nom anglais (et rien de plus)", () => {
    expect(missingEnglishProductNames()).toEqual([]);
    const slugs = saison.products.map((product) => product.slug).sort();
    expect(Object.keys(PRODUCT_NAMES_EN).sort()).toEqual(slugs);
  });
  it("chaque catégorie de saison a son intitulé anglais", () => {
    for (const product of saison.products)
      expect(
        PRODUCT_CATEGORIES.en[product.category],
        product.category,
      ).toBeTruthy();
  });
  it("les noms anglais ne trahissent pas la donnée (mangue par avion / par bateau)", () => {
    expect(PRODUCT_NAMES_EN.mangue).toMatch(/air/);
    expect(PRODUCT_NAMES_EN.manguebateau).toMatch(/sea/);
  });
  it("chaque gabarit « Le savais-tu ? » a sa phrase dans les deux langues", () => {
    for (const template of FACT_TEMPLATES) {
      expect(FACT_TEXTS.fr[template.id], template.id).toBeTypeOf("function");
      expect(FACT_TEXTS.en[template.id], template.id).toBeTypeOf("function");
    }
  });
  it("chaque palier a son unité dans les deux langues", () => {
    for (const milestone of MILESTONES_KG) {
      expect(MILESTONE_UNITS.fr[milestone]).toBeTypeOf("function");
      expect(MILESTONE_UNITS.en[milestone]).toBeTypeOf("function");
    }
  });
  it("chaque habitude a son nom et sa déclaration dans les deux langues", () => {
    for (const habit of HABITS) {
      expect(HABIT_NAMES.en[habit.gesture]?.label, habit.gesture).toBeTruthy();
      expect(HABIT_NAMES.en[habit.gesture]?.declaration).toBeTruthy();
    }
  });
  it("noms dans les phrases : mêmes gestes et objets en français et en anglais", () => {
    expect(Object.keys(GESTURE_NOUNS.en).sort()).toEqual(
      Object.keys(GESTURE_NOUNS.fr).sort(),
    );
    expect(Object.keys(OBJECT_NOUNS.en).sort()).toEqual(
      Object.keys(OBJECT_NOUNS.fr).sort(),
    );
  });
});
