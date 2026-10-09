// Garde-fous du contenu « Les animaux parlent » (lancés par scripts/check-data.ts, toujours
// bloquants, et par les tests) : identifiants uniques, chapitres, séquences de 1 à 3 étapes,
// expressions connues (« dort » en dormant), conditions connues, et toute réplique « fait »
// adossée à une source de docs/animaux-sources.md.
import { FAUNA } from "@/lib/garden/fauna";
import { SLEEPERS } from "@/lib/garden/model";
import { SEASONS } from "@/lib/garden/seasons";
import { speciesById } from "@/lib/garden/species";
import { visitorRule } from "@/lib/garden/visitors";
import {
  EXPRESSIONS,
  isTalkingVisitor,
  LINE_KINDS,
  TALKERS,
  TALKING_VISITORS,
  type AnimalScript,
  type Bilingual,
  type Sequence,
  type TalkerId,
} from "./types";

/**
 * Identifiants de sources : la première colonne du tableau, entre accents graves, seulement
 * si la ligne cite la source (une citation entre « », “ ” ou " ").
 */
export function sourceIdsFrom(markdown: string): Set<string> {
  return new Set(
    [...markdown.matchAll(/^\|\s*`([a-z0-9-]+)`\s*\|(.*)$/gm)]
      .filter((m) => /«[^»]+»|“[^”]+”|"[^"]+"/.test(m[2]))
      .map((m) => m[1]),
  );
}

/**
 * Dessiné endormi à un moment ou un autre dans le jardin (d'après les tables du jardin) :
 * l'oiseau la nuit, l'escargot l'hiver, les deux quand le jardin s'assoupit ; le renard le
 * jour. Papillon, coccinelle et abeille ne dorment jamais à l'écran : ils s'absentent ;
 * l'écureuil, visiteur d'automne, n'a pas de dessin endormi.
 */
export function drawnAsleep(talker: TalkerId): boolean {
  if (isTalkingVisitor(talker)) {
    const visitor = visitorRule(TALKING_VISITORS[talker]);
    return visitor.day === "asleep" || visitor.night === "asleep";
  }
  const rule = FAUNA[talker];
  return (
    SLEEPERS.includes(talker) ||
    [rule.day, rule.night].some((when) =>
      Object.values(when).includes("asleep"),
    )
  );
}

const empty = (text: Bilingual) => !text.fr.trim() || !text.en.trim();

/** Problèmes d'une séquence : 1 à 3 étapes, textes non vides, expressions connues. */
function sequenceProblems(steps: Sequence, sleeping: boolean): string[] {
  const problems: string[] = [];
  if (steps.length < 1 || steps.length > 3)
    problems.push(`${steps.length} étape(s), 1 à 3 attendues`);
  for (const step of steps) {
    if (empty(step)) problems.push("étape vide");
    if (!EXPRESSIONS.includes(step.expr))
      problems.push(`expression inconnue « ${step.expr} »`);
    else if (sleeping && step.expr !== "dort")
      problems.push("expression « dort » attendue en dormant");
  }
  return problems;
}

/** Problèmes du contenu (liste vide : tout va bien). */
export function animalScriptProblems(
  scripts: Record<TalkerId, AnimalScript>,
  sourceIds: ReadonlySet<string>,
): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  for (const talker of TALKERS) {
    const script = scripts[talker];
    const where = (detail: string) => `${talker} : ${detail}`;
    if (empty(script.name) || empty(script.talk))
      problems.push(where("nom ou libellé vide"));
    if (script.lines.length === 0) problems.push(where("aucune réplique"));
    if (script.sleep.length === 0 && drawnAsleep(talker))
      problems.push(
        where("aucune réplique de sommeil (il est dessiné endormi)"),
      );
    if (script.sleepSourceId && !sourceIds.has(script.sleepSourceId))
      problems.push(
        where(
          `sommeil : source « ${script.sleepSourceId} » sans citation dans docs/animaux-sources.md`,
        ),
      );
    if (script.again.length < 2 || script.again.length > 3)
      problems.push(where("2 ou 3 répliques « déjà parlé » attendues"));
    script.sleep.forEach((steps, index) =>
      sequenceProblems(steps, true).forEach((problem) =>
        problems.push(where(`sommeil ${index + 1} : ${problem}`)),
      ),
    );
    script.again.forEach((steps, index) =>
      sequenceProblems(steps, false).forEach((problem) =>
        problems.push(where(`« déjà parlé » ${index + 1} : ${problem}`)),
      ),
    );
    // Ordre des chapitres : celui des répliques sans condition (les conditionnelles, des
    // bonus, peuvent être rangées à la fin).
    let chapter = 1;
    for (const line of script.lines) {
      if (ids.has(line.id)) problems.push(where(`id en double « ${line.id} »`));
      ids.add(line.id);
      for (const problem of sequenceProblems(line.steps, false))
        problems.push(where(`« ${line.id} » : ${problem}`));
      if (!LINE_KINDS.includes(line.kind))
        problems.push(
          where(`« ${line.id} » : sorte inconnue « ${line.kind} »`),
        );
      if (!line.condition) {
        if (line.chapter < chapter)
          problems.push(where(`« ${line.id} » : chapitres dans le désordre`));
        chapter = line.chapter;
      }
      if (line.kind === "fait" && !line.sourceId)
        problems.push(where(`« ${line.id} » : fait sans sourceId`));
      if (line.sourceId && !sourceIds.has(line.sourceId))
        problems.push(
          where(
            `« ${line.id} » : source « ${line.sourceId} » sans citation dans docs/animaux-sources.md`,
          ),
        );
      const condition = line.condition;
      if (condition?.season && !SEASONS.includes(condition.season))
        problems.push(where(`« ${line.id} » : saison inconnue`));
      if (condition?.planted && !speciesById(condition.planted))
        problems.push(where(`« ${line.id} » : espèce inconnue`));
    }
  }
  return problems;
}

/** Étapes encore provisoires (signalées au build, sans le bloquer). */
export function provisionalLineCount(
  scripts: Record<TalkerId, AnimalScript>,
): number {
  return TALKERS.flatMap((talker) => [
    ...scripts[talker].lines.flatMap((line) => line.steps),
    ...scripts[talker].sleep.flat(),
    ...scripts[talker].again.flat(),
  ]).filter((step) => step.fr.includes("provisoire")).length;
}

/**
 * Garde-fou du build (toujours bloquant) : `problems` vide. Les répliques provisoires sont
 * signalées sans bloquer (la CI construit en mode strict).
 */
export function checkAnimalScripts(
  problems: readonly string[],
  provisional: number,
): { ok: boolean; message: string } {
  if (problems.length > 0)
    return {
      ok: false,
      message: `Les animaux parlent : à corriger dans src/content/animaux (${problems.join(" ; ")}).`,
    };
  return {
    ok: true,
    message:
      provisional > 0
        ? `Les animaux parlent : contenu valide ; attention, ${provisional} étape(s) de réplique encore provisoire(s).`
        : "Les animaux parlent : contenu valide.",
  };
}
