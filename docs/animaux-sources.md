# Les animaux parlent : sources des faits

Règle : une réplique de `kind: "fait"` (`src/content/animaux/`) dit quelque chose de vrai sur
l'animal réel ; elle cite une source de ce tableau par son identifiant (`sourceId`). Un
`sourceId` absent d'ici fait échouer le build (`scripts/check-data.ts`) et les tests
(`src/content/animaux/check.test.ts`). Comme pour les espèces (`especes-sources.md`) : source
fiable, lue, citation reprise telle quelle ; un fait non confirmé n'entre pas.

Identifiant : première colonne, entre accents graves, en minuscules et tirets
(`papillon-migration`, `renard-ouie`…).

| Id | Animal | Fait | Source | Ce que dit la source |
| --- | ------ | ---- | ------ | -------------------- |

Aucune source pour l'instant : les répliques sont provisoires et ne contiennent aucun fait.
