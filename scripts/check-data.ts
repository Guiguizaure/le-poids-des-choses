// Garde-fous du lancement, uniquement bloquants avec STRICT_DATA=1 : aucune donnée fictive
// (gestes et fruits et légumes de saison),
// et mentions légales remplies (plus d'emplacements [NOM], [SIRET], [ADRESSE], [EMAIL]).
// Toujours bloquant : un gabarit « Le savais-tu ? » ou une équivalence de palier qui
// référence un geste disparu ; un geste ou un produit sans nom anglais ; un animal volant, le soleil ou un nuage qui ne se voit pas sur un
// ciel ; une réplique d'animal mal formée ou un fait sans source de docs/animaux-sources.md.
// Simples avertissements : clé publique Turnstile absente, répliques d'animaux provisoires.
import { readFileSync } from "node:fs";
import { ANIMAL_SCRIPTS } from "../src/content/animaux";
import {
  animalScriptProblems,
  checkAnimalScripts,
  provisionalLineCount,
  sourceIdsFrom,
} from "../src/content/animaux/check";
import { checkData } from "../src/lib/data/check";
import { getGestures } from "../src/lib/data";
import { checkFacts } from "../src/lib/facts/check";
import { checkEnglishNames } from "../src/lib/i18n/check";
import { checkLegal, missingLegalFields } from "../src/lib/legal";
import { checkMilestones } from "../src/lib/milestones/check";
import {
  checkSkyContrast,
  SKY_FLYERS,
  skyContrastFailures,
} from "../src/lib/garden/sky-contrast";
import { getSeasonalProducts } from "../src/lib/saison";
import { checkTurnstileKey } from "../src/lib/sync/check";

const strict = process.env.STRICT_DATA === "1";
const flyerSources = Object.fromEntries(
  SKY_FLYERS.map(({ name }) => [
    name,
    readFileSync(
      new URL(`../public/illustrations/${name}.svg`, import.meta.url),
      "utf8",
    ),
  ]),
);
const results = [
  checkData([...getGestures(), ...getSeasonalProducts()], strict),
  checkLegal(missingLegalFields(), strict),
  checkFacts(),
  checkMilestones(),
  checkEnglishNames(),
  checkSkyContrast(skyContrastFailures(flyerSources)),
  checkTurnstileKey(),
  checkAnimalScripts(
    animalScriptProblems(
      ANIMAL_SCRIPTS,
      sourceIdsFrom(
        readFileSync(
          new URL("../docs/animaux-sources.md", import.meta.url),
          "utf8",
        ),
      ),
    ),
    provisionalLineCount(ANIMAL_SCRIPTS),
  ),
];
for (const result of results) console.log(result.message);
process.exit(results.every((result) => result.ok) ? 0 : 1);
