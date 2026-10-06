// pnpm raconte:eval — à lancer à la main, jamais en CI : envoie les phrases de
// docs/raconte-phrases.md au vrai modèle (clé ANTHROPIC_API_KEY lue dans .dev.vars, jamais
// affichée) et donne le taux de bonnes détections. Chaque phrase coûte un appel payant.
import { readFileSync } from "node:fs";
import { sanitizeText } from "../src/lib/raconte/detections";
import type { Env } from "../server/env";
import { detectGestures } from "../server/raconte";
import { RACONTE_MODEL } from "../server/config";
import {
  detectionKeys,
  expectedKeys,
  parseCases,
  score,
} from "./raconte-eval-lib";

// Tarif public de Claude Haiku 4.5 ($ par million de jetons), pour un ordre de grandeur.
const PRICE_IN = 1;
const PRICE_OUT = 5;

function readDevVars(): Record<string, string> {
  let text = "";
  try {
    text = readFileSync(".dev.vars", "utf8");
  } catch {
    return {};
  }
  const vars: Record<string, string> = {};
  for (const line of text.split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match) vars[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
  return vars;
}

async function main() {
  if (process.env.CI) {
    console.error("raconte:eval ne tourne jamais en CI (appels payants).");
    process.exit(1);
  }
  const key = readDevVars().ANTHROPIC_API_KEY;
  if (!key) {
    console.error(
      "ANTHROPIC_API_KEY absente de .dev.vars : ajoute la ligne ANTHROPIC_API_KEY=… (fichier ignoré par git).",
    );
    process.exit(1);
  }
  const env: Env = { ANTHROPIC_API_KEY: key };
  const cases = parseCases(readFileSync("docs/raconte-phrases.md", "utf8"));
  console.log(`${cases.length} phrases, modèle ${RACONTE_MODEL}\n`);

  let exact = 0;
  let matched = 0;
  let extra = 0;
  let missed = 0;
  let inputTokens = 0;
  let outputTokens = 0;
  let failures = 0;
  for (const item of cases) {
    const text = sanitizeText(item.text);
    let got: string[] = [];
    if (text) {
      try {
        const outcome = await detectGestures(env, text);
        got = detectionKeys(outcome.detections);
        inputTokens += outcome.stats.inputTokens;
        outputTokens += outcome.stats.outputTokens;
      } catch {
        failures += 1;
        console.log(`✗ ${item.id}. appel en échec`);
        continue;
      }
    }
    const want = expectedKeys(item.expected);
    const result = score(want, got);
    matched += result.matched;
    extra += result.extra;
    missed += result.missed;
    if (result.exact) exact += 1;
    console.log(
      `${result.exact ? "✓" : "✗"} ${item.id}. ${item.trap}\n    attendu : ${want.join(", ") || "—"}\n    obtenu  : ${got.join(", ") || "—"}`,
    );
  }

  const percent = (value: number, total: number) =>
    total ? `${Math.round((value / total) * 100)} %` : "—";
  const cost = (inputTokens * PRICE_IN + outputTokens * PRICE_OUT) / 1e6;
  console.log(`
Phrases justes : ${exact} / ${cases.length} (${percent(exact, cases.length)})
Gestes : ${matched} bons, ${extra} en trop, ${missed} manqués
Précision : ${percent(matched, matched + extra)} · rappel : ${percent(matched, matched + missed)}
Appels en échec : ${failures}
Jetons : ${inputTokens} en entrée, ${outputTokens} en sortie (≈ ${cost.toFixed(4)} $ au total, ≈ ${(cost / Math.max(1, cases.length - failures)).toFixed(4)} $ par phrase)`);
}

void main();
