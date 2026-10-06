import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { catalogIds } from "../src/lib/raconte/detections";
import { parseCases, parseExpectedItem, score } from "./raconte-eval-lib";

describe("jeu de phrases de « Raconte ta journée »", () => {
  const cases = parseCases(readFileSync("docs/raconte-phrases.md", "utf8"));

  it("27 phrases numérotées, dont 7 en anglais et un texte vide", () => {
    expect(cases.map((item) => item.id)).toEqual(
      Array.from({ length: 27 }, (_, i) => i + 1),
    );
    expect(
      cases.filter((item) => item.trap.startsWith("anglais")),
    ).toHaveLength(7);
    expect(cases.some((item) => item.text === "")).toBe(true);
  });

  it("chaque geste attendu existe dans le catalogue, avec un mode connu", () => {
    const ids = new Set(catalogIds());
    for (const item of cases)
      for (const expected of item.expected) {
        expect(
          ids.has(expected.gestureId),
          `${item.id} ${expected.gestureId}`,
        ).toBe(true);
        if (expected.mode)
          expect(["neuf", "occasion", "garder"]).toContain(expected.mode);
      }
  });

  it("lit distance et mode", () => {
    expect(parseExpectedItem("velo@12")).toEqual({
      gestureId: "velo",
      quantity: 12,
      mode: null,
    });
    expect(parseExpectedItem(" jean[occasion] ")).toEqual({
      gestureId: "jean",
      quantity: null,
      mode: "occasion",
    });
    expect(() => parseExpectedItem("vélo 12")).toThrow();
  });

  it("note : exact, en trop, manqué", () => {
    expect(score(["cafe", "ter"], ["ter", "cafe"])).toEqual({
      matched: 2,
      extra: 0,
      missed: 0,
      exact: true,
    });
    expect(score(["cafe"], ["cafe", "the"])).toMatchObject({
      extra: 1,
      exact: false,
    });
    expect(score(["cafe", "cafe"], ["cafe"])).toMatchObject({
      matched: 1,
      missed: 1,
    });
    expect(score([], [])).toMatchObject({ exact: true });
  });
});
