import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ANIMAL_SCRIPTS, TALKERS, type AnimalScript, type TalkerId } from ".";
import { animalScriptProblems, sourceIdsFrom } from "./check";

const SOURCES = readFileSync(
  new URL("../../../docs/animaux-sources.md", import.meta.url),
  "utf8",
);
/** Même règle que les dictionnaires : jamais « saved », « avoided »… */
const DISHONEST = /\b(sav(e|ed|ing)|avoid(ed|ing)?|won|reduc(e|ed|ing))\b/i;
const FORBIDDEN_FR = /\b(évité|économisé|sauvé|gagné)/i;

const withLine = (line: AnimalScript["lines"][number]) =>
  ({
    ...ANIMAL_SCRIPTS,
    fox: { ...ANIMAL_SCRIPTS.fox, lines: [...ANIMAL_SCRIPTS.fox.lines, line] },
  }) as Record<TalkerId, AnimalScript>;

describe("contenu « Les animaux parlent »", () => {
  it("valide : ids uniques, chapitres, conditions connues, faits sourcés", () => {
    expect(
      animalScriptProblems(ANIMAL_SCRIPTS, sourceIdsFrom(SOURCES)),
    ).toEqual([]);
  });

  it("toute réplique « fait » a un sourceId qui existe dans docs/animaux-sources.md", () => {
    const ids = sourceIdsFrom(SOURCES);
    for (const talker of TALKERS)
      for (const line of ANIMAL_SCRIPTS[talker].lines.filter(
        (l) => l.kind === "fait",
      )) {
        expect(line.sourceId, line.id).toBeTruthy();
        expect(ids.has(line.sourceId!), line.id).toBe(true);
      }
    // Le garde-fou les voit bien.
    const fact = {
      id: "renard-x",
      chapter: 5,
      kind: "fait",
      steps: [{ expr: "content", fr: "a", en: "a" }],
    } as const;
    expect(animalScriptProblems(withLine(fact), ids)).toEqual([
      "fox : « renard-x » : fait sans sourceId",
    ]);
    expect(
      animalScriptProblems(withLine({ ...fact, sourceId: "inconnue" }), ids),
    ).toEqual([
      "fox : « renard-x » : source « inconnue » absente de docs/animaux-sources.md",
    ]);
    expect(
      animalScriptProblems(
        withLine({ ...fact, sourceId: "renard-ouie" }),
        sourceIdsFrom("| `renard-ouie` | Renard | … |"),
      ),
    ).toEqual([]);
  });

  it("garde-fou : id en double, chapitres dans le désordre, condition inconnue", () => {
    const ids = sourceIdsFrom(SOURCES);
    const duplicate = withLine({
      ...ANIMAL_SCRIPTS.fox.lines[0],
      chapter: 5,
    });
    expect(animalScriptProblems(duplicate, ids)).toContain(
      "fox : id en double « renard-1 »",
    );
    expect(
      animalScriptProblems(
        withLine({
          id: "renard-y",
          chapter: 1,
          kind: "recit",
          steps: [{ expr: "content", fr: "a", en: "a" }],
          condition: { planted: "arbre-99" },
        }),
        ids,
      ),
    ).toEqual([
      "fox : « renard-y » : chapitres dans le désordre",
      "fox : « renard-y » : espèce inconnue",
    ]);
  });

  it("séquences : 1 à 3 étapes, expression connue, « dort » en dormant", () => {
    const ids = sourceIdsFrom(SOURCES);
    const step = { expr: "content", fr: "a", en: "a" } as const;
    expect(
      animalScriptProblems(
        withLine({ id: "renard-z", chapter: 5, kind: "recit", steps: [] }),
        ids,
      ),
    ).toEqual(["fox : « renard-z » : 0 étape(s), 1 à 3 attendues"]);
    expect(
      animalScriptProblems(
        withLine({
          id: "renard-z",
          chapter: 5,
          kind: "recit",
          steps: [step, step, step, step],
        }),
        ids,
      ),
    ).toEqual(["fox : « renard-z » : 4 étape(s), 1 à 3 attendues"]);
    const awakeSleep = {
      ...ANIMAL_SCRIPTS,
      fox: { ...ANIMAL_SCRIPTS.fox, sleep: [[step]] },
    } as Record<TalkerId, AnimalScript>;
    expect(animalScriptProblems(awakeSleep, ids)).toEqual([
      "fox : sommeil 1 : expression « dort » attendue en dormant",
    ]);
  });

  it("chaque animal : 5 chapitres, du sommeil, 2 ou 3 « déjà parlé » ; aucun mot interdit", () => {
    for (const talker of TALKERS) {
      const script = ANIMAL_SCRIPTS[talker];
      expect(new Set(script.lines.map((l) => l.chapter))).toEqual(
        new Set([1, 2, 3, 4, 5]),
      );
      expect(script.lines[0].condition, talker).toBeUndefined();
      expect(script.sleep.length).toBeGreaterThan(0);
      expect(script.again.length).toBeGreaterThanOrEqual(2);
      expect(script.again.length).toBeLessThanOrEqual(3);
      for (const text of [
        script.name,
        script.talk,
        ...script.lines.flatMap((line) => line.steps),
        ...script.sleep.flat(),
        ...script.again.flat(),
      ]) {
        expect(text.fr.trim()).not.toBe("");
        expect(text.en.trim()).not.toBe("");
        expect(text.en).not.toMatch(DISHONEST);
        expect(text.fr).not.toMatch(FORBIDDEN_FR);
      }
    }
  });
});
