import { describe, expect, it } from "vitest";
import { en } from "./en";
import { fr } from "./fr";

/** Chemins de toutes les chaînes d'un dictionnaire (« home.start »…). */
function keys(tree: object, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === "string"
      ? [`${prefix}${key}`]
      : keys(value as object, `${prefix}${key}.`),
  );
}

function at(tree: object, path: string): string {
  return path
    .split(".")
    .reduce<unknown>(
      (node, key) => (node as Record<string, unknown>)[key],
      tree,
    ) as string;
}

const placeholders = (text: string) =>
  [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe("fichiers de traduction", () => {
  it("mêmes clés en français et en anglais", () => {
    expect(keys(en)).toEqual(keys(fr));
  });
  it("aucune chaîne vide", () => {
    for (const key of keys(fr)) {
      expect(at(fr, key).trim(), `fr ${key}`).not.toBe("");
      expect(at(en, key).trim(), `en ${key}`).not.toBe("");
    }
  });
  it("mêmes emplacements ({month}, {date}…) dans les deux langues", () => {
    for (const key of keys(fr)) {
      expect(placeholders(at(en, key)), key).toEqual(placeholders(at(fr, key)));
    }
  });
  it("anglais : jamais « saved », « avoided » ni « won » (règle d'honnêteté)", () => {
    for (const key of keys(en)) {
      expect(at(en, key), key).not.toMatch(
        /\b(saved?|avoided?|won|reduced)\b/i,
      );
    }
  });
});
