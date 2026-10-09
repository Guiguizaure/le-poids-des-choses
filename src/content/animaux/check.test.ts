import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { converse, emptyFriends, progress } from "@/lib/friends/friendship";
import {
  ANIMAL_SCRIPTS,
  TALKERS,
  type AnimalScript,
  type Line,
  type TalkerId,
} from ".";
import { SEASONS } from "@/lib/garden/seasons";
import { animalScriptProblems, drawnAsleep, sourceIdsFrom } from "./check";

const SOURCES = readFileSync(
  new URL("../../../docs/animaux-sources.md", import.meta.url),
  "utf8",
);
const PORTRAITS = new URL("../../../public/portraits/", import.meta.url);
const SLUG: Record<TalkerId, string> = {
  butterfly: "papillon",
  ladybug: "coccinelle",
  bird: "oiseau",
  snail: "escargot",
  bee: "abeille",
  fox: "renard",
  squirrel: "ecureuil",
};

/**
 * Les animaux ne parlent jamais de kg ni de CO2 (la règle d'honnêteté « jamais évité,
 * économisé… » porte sur les kg : « I saved you a feather » est permis).
 */
const KG = /\b(kg|kilos?|CO2|CO₂|carbone|carbon)\b/i;

const withLine = (line: Line) =>
  ({
    ...ANIMAL_SCRIPTS,
    fox: { ...ANIMAL_SCRIPTS.fox, lines: [...ANIMAL_SCRIPTS.fox.lines, line] },
  }) as Record<TalkerId, AnimalScript>;

describe("contenu « Les animaux parlent »", () => {
  it("valide : ids uniques, chapitres, sortes, conditions, sources citées", () => {
    expect(
      animalScriptProblems(ANIMAL_SCRIPTS, sourceIdsFrom(SOURCES)),
    ).toEqual([]);
  });

  it("chaque réplique « fait » (et chaque source citée) a une citation dans docs/animaux-sources.md", () => {
    const cited = sourceIdsFrom(SOURCES);
    const used = TALKERS.flatMap((talker) => [
      ...ANIMAL_SCRIPTS[talker].lines.map((line) => ({
        id: line.id,
        kind: line.kind,
        sourceId: line.sourceId,
      })),
      {
        id: `${talker}:sommeil`,
        kind: "",
        sourceId: ANIMAL_SCRIPTS[talker].sleepSourceId,
      },
    ]);
    for (const line of used) {
      if (line.kind === "fait") expect(line.sourceId, line.id).toBeTruthy();
      if (line.sourceId) expect(cited.has(line.sourceId), line.id).toBe(true);
    }
    // Il y a bien des faits, et une source sans citation ne compte pas.
    expect(used.filter((line) => line.kind === "fait").length).toBeGreaterThan(
      10,
    );
    expect(
      sourceIdsFrom("| `sans-citation` | Renard | … | lien | | | |").size,
    ).toBe(0);
    expect(
      sourceIdsFrom("| `cite` | Renard | … | lien | « texte » | | |"),
    ).toEqual(new Set(["cite"]));
  });

  it("garde-fou : fait sans source, source sans citation, id en double, condition inconnue", () => {
    const ids = sourceIdsFrom(SOURCES);
    const step = { expr: "content", fr: "a", en: "a" } as const;
    const fact: Line = {
      id: "renard-x",
      chapter: 5,
      kind: "fait",
      steps: [step],
    };
    expect(animalScriptProblems(withLine(fact), ids)).toEqual([
      "fox : « renard-x » : fait sans sourceId",
    ]);
    expect(
      animalScriptProblems(withLine({ ...fact, sourceId: "inconnue" }), ids),
    ).toEqual([
      "fox : « renard-x » : source « inconnue » sans citation dans docs/animaux-sources.md",
    ]);
    expect(
      animalScriptProblems(
        withLine({ ...ANIMAL_SCRIPTS.fox.lines[0], chapter: 5 }),
        ids,
      ),
    ).toContain(`fox : id en double « ${ANIMAL_SCRIPTS.fox.lines[0].id} »`);
    expect(
      animalScriptProblems(
        withLine({
          id: "renard-y",
          chapter: 1,
          kind: "humeur",
          steps: [step],
          condition: { planted: "arbre-99" },
        }),
        ids,
      ),
    ).toEqual(["fox : « renard-y » : espèce inconnue"]);
  });

  it("séquences : 1 à 3 étapes, « dort » en dormant", () => {
    const ids = sourceIdsFrom(SOURCES);
    const step = { expr: "content", fr: "a", en: "a" } as const;
    expect(
      animalScriptProblems(
        withLine({ id: "renard-z", chapter: 5, kind: "souvenir", steps: [] }),
        ids,
      ),
    ).toEqual(["fox : « renard-z » : 0 étape(s), 1 à 3 attendues"]);
    const awakeSleep = {
      ...ANIMAL_SCRIPTS,
      fox: { ...ANIMAL_SCRIPTS.fox, sleep: [[step]] },
    } as Record<TalkerId, AnimalScript>;
    expect(animalScriptProblems(awakeSleep, ids)).toEqual([
      "fox : sommeil 1 : expression « dort » attendue en dormant",
    ]);
  });

  it("chaque étape a un texte FR et EN non vide, jamais de kg", () => {
    for (const talker of TALKERS) {
      const script = ANIMAL_SCRIPTS[talker];
      for (const text of [
        script.name,
        script.talk,
        ...script.lines.flatMap((line) => line.steps),
        ...script.sleep.flat(),
        ...script.again.flat(),
      ]) {
        expect(text.fr.trim(), talker).not.toBe("");
        expect(text.en.trim(), talker).not.toBe("");
        expect(text.en).not.toMatch(KG);
        expect(text.fr).not.toMatch(KG);
      }
      // Plus aucune réplique provisoire.
      expect(JSON.stringify(script)).not.toMatch(/provisoire|placeholder/i);
    }
  });

  it("chaque expression a son portrait, et les portraits n'ont aucun id", () => {
    const files = new Set(readdirSync(PORTRAITS));
    for (const talker of TALKERS) {
      const script = ANIMAL_SCRIPTS[talker];
      const exprs = new Set(
        [
          ...script.lines.flatMap((line) => line.steps),
          ...script.sleep.flat(),
          ...script.again.flat(),
        ].map((step) => step.expr),
      );
      // Le portrait endormi sert aussi à la liste quand il dort.
      if (drawnAsleep(talker)) exprs.add("dort");
      for (const expr of exprs)
        expect(
          files.has(`portrait-${SLUG[talker]}-${expr}.svg`),
          `${talker} ${expr}`,
        ).toBe(true);
    }
    for (const file of files) {
      const svg = readFileSync(new URL(file, PORTRAITS), "utf8");
      expect(svg, file).not.toMatch(/\sid="|url\(#/);
    }
  });

  it("écureuil et abeille : conditions du contenu reçu (automne, sapin ; été, printemps, lavande)", () => {
    const conditions = (talker: TalkerId) =>
      ANIMAL_SCRIPTS[talker].lines
        .filter((line) => line.condition)
        .map((line) => [line.id, line.condition]);
    expect(conditions("squirrel")).toEqual([
      ["ecu-c1", { season: "automne" }],
      ["ecu-c2", { season: "automne" }],
      ["ecu-c3", { planted: "arbre-5" }],
    ]);
    expect(conditions("bee")).toEqual([
      ["abe-c1", { season: "ete" }],
      ["abe-c2", { season: "printemps" }],
      ["abe-c3", { planted: "fleur-5" }],
    ]);
    expect(
      progress(ANIMAL_SCRIPTS.squirrel, emptyFriends().squirrel).total,
    ).toBe(6);
    expect(progress(ANIMAL_SCRIPTS.bee, emptyFriends().bee).total).toBe(6);
  });

  it("les 21 portraits livrés : 7 animaux × 3 expressions, rien d'autre", () => {
    const animals = [
      "papillon",
      "coccinelle",
      "oiseau",
      "escargot",
      "renard",
      "ecureuil",
      "abeille",
    ];
    expect(readdirSync(PORTRAITS).sort()).toEqual(
      animals
        .flatMap((animal) =>
          ["content", "surpris", "dort"].map(
            (expr) => `portrait-${animal}-${expr}.svg`,
          ),
        )
        .sort(),
    );
  });

  it("sommeil : répliques pour ceux qui sont dessinés endormis (oiseau, escargot, renard)", () => {
    expect(TALKERS.filter(drawnAsleep)).toEqual(["bird", "snail", "fox"]);
    // L'abeille et l'écureuil ne sont jamais dessinés endormis : leurs répliques de sommeil
    // restent dans le contenu, sans être affichées.
    expect(drawnAsleep("bee")).toBe(false);
    expect(drawnAsleep("squirrel")).toBe(false);
    expect(ANIMAL_SCRIPTS.bee.sleep.length).toBeGreaterThan(0);
    for (const talker of TALKERS.filter(drawnAsleep))
      expect(ANIMAL_SCRIPTS[talker].sleep.length, talker).toBeGreaterThan(0);
  });

  it("le compteur atteint N sur N sans aucune réplique conditionnelle", () => {
    for (const talker of TALKERS) {
      const script = ANIMAL_SCRIPTS[talker];
      // Une saison qu'aucune réplique n'attend, de jour, rien de planté : aucune condition
      // n'est vraie (l'été pour la plupart ; l'abeille a des répliques d'été et de printemps).
      const season = SEASONS.find(
        (candidate) =>
          !script.lines.some((line) => line.condition?.season === candidate),
      )!;
      let record = emptyFriends()[talker];
      const total = script.lines.filter((line) => !line.condition).length;
      for (let day = 1; day <= total; day++)
        record = converse(talker, script, record, {
          day: `2026-07-${String(day).padStart(2, "0")}`,
          season,
          night: false,
          planted: new Set(),
          asleep: false,
        }).record;
      expect(progress(script, record), talker).toEqual({ seen: total, total });
      expect(
        record.seen.every(
          (id) => !script.lines.find((l) => l.id === id)?.condition,
        ),
      ).toBe(true);
    }
  });
});
