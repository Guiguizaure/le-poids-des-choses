// Garde-fous du lancement, uniquement bloquants avec STRICT_DATA=1 : aucune donnée fictive,
// et mentions légales remplies (plus d'emplacements [NOM], [SIRET], [ADRESSE], [EMAIL]).
// Toujours bloquant : un gabarit « Le savais-tu ? » qui référence un geste disparu.
import { checkData } from "../src/lib/data/check";
import { getGestures } from "../src/lib/data";
import { checkFacts } from "../src/lib/facts/check";
import { checkLegal, missingLegalFields } from "../src/lib/legal";

const strict = process.env.STRICT_DATA === "1";
const results = [
  checkData(getGestures(), strict),
  checkLegal(missingLegalFields(), strict),
  checkFacts(),
];
for (const result of results) console.log(result.message);
process.exit(results.every((result) => result.ok) ? 0 : 1);
