import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { gestureNoun, objectNoun } from "@/lib/compare/nouns";
import { pictoFor } from "@/lib/journal/display";
import { GESTURE_NOUNS, OBJECT_NOUNS } from "@/lib/i18n/messages/nouns";
import { CATEGORY_NAMES, GESTURE_NAMES_EN } from "@/lib/i18n/messages/names";
import { PENDING_PICTOS } from "@/lib/illustrations/specs";
import { getGestures } from "./index";

const SOURCES = readFileSync(
  new URL("../../../docs/gestes-sources.md", import.meta.url),
  "utf8",
);

describe("catalogue : chaque geste est sourcé, dessiné et traduit", () => {
  const gestures = getGestures();

  it.each(gestures.map((g) => [g.id, g] as const))(
    "%s : ligne dans docs/gestes-sources.md (id, id ADEME, fiche)",
    (_, gesture) => {
      const row = SOURCES.split("\n").find((line) =>
        new RegExp(`^\\| \`${gesture.id}\` +\\|`).test(line),
      );
      expect(row, gesture.id).toBeDefined();
      expect(row).toContain(`\`${gesture.sourceId}\``);
      expect(row).toContain(gesture.sourceUrl!);
    },
  );

  it.each(gestures.map((g) => [g.id] as const))(
    "%s : un picto à lui (jamais le picto générique)",
    (id) => {
      if (PENDING_PICTOS.includes(id)) return;
      expect(pictoFor(id)).not.toBe("picto-generique");
    },
  );

  it.each(gestures.map((g) => [g.id, g] as const))(
    "%s : nom en français et en anglais, dans les phrases aussi",
    (id, gesture) => {
      expect(gesture.label.trim()).not.toBe("");
      expect(GESTURE_NAMES_EN[id]?.label.trim(), id).toBeTruthy();
      if (gesture.detail) expect(GESTURE_NAMES_EN[id].detail, id).toBeTruthy();
      if (gesture.unit === "objet") {
        expect(OBJECT_NOUNS.fr[id], id).toBeDefined();
        expect(OBJECT_NOUNS.en[id], id).toBeDefined();
        expect(objectNoun(id, "fr").newOne).toMatch(/^d[’e]/);
      } else {
        expect(GESTURE_NOUNS.fr[id], id).toBeDefined();
        expect(GESTURE_NOUNS.en[id], id).toBeDefined();
        expect(gestureNoun(id, "en").text).not.toBe("");
      }
      expect(CATEGORY_NAMES.fr[gesture.category]).toBeTruthy();
      expect(CATEGORY_NAMES.en[gesture.category]).toBeTruthy();
    },
  );

  it("« Équiper la maison » : électroménager et meubles, tous des objets", () => {
    const maison = gestures.filter((g) => g.category === "maison");
    expect(maison).toHaveLength(11);
    expect(new Set(maison.map((g) => g.unit))).toEqual(new Set(["objet"]));
    expect(CATEGORY_NAMES.fr.maison).toBe("Équiper la maison");
    expect(CATEGORY_NAMES.en.maison).toBe("Furnish your home");
  });
});
