@AGENTS.md

# Le poids des choses

Comparateur carbone illustré : deux gestes du quotidien sur une balance, un choix noté, un
jardin dessiné qui grandit avec les kg de CO2e évités. Projet vitrine pour webjuno.com.
Projet indépendant, non affilié à l'ADEME.

## Règles

- Vérifie la branche courante avant toute action git.
- Aucun commit ni push sur `main` sans accord explicite. Travail sur des branches
  (`feat/…`, `fix/…`, `docs/…`, `chore/…`), fusionnées par demande de fusion relue par
  l'utilisateur. Depuis le premier commit, plus aucun travail directement sur `main`.
- Messages de commit au format conventionnel, en français : `feat:`, `fix:`, `chore:`,
  `docs:`, `refactor:`, `test:`…
- Ne lance pas `pnpm dev` : l'utilisateur le lance dans un autre onglet. `build`, `lint`
  et `test` sont autorisés.
- Aucun secret dans le dépôt (`.env*` ignorés). La clé API ADEME ne sert qu'au script de
  données, en local.
- Toute valeur de test porte `fictive: true` (et `source: "fictive"`) et n'est jamais citée.
  Elles vivent dans `src/lib/data/test-gestures.ts`. `scripts/check-data.ts` (lancé par
  `pnpm build`) fait échouer la construction s'il reste une donnée fictive, mais seulement
  si `STRICT_DATA=1` est défini (à activer chez Cloudflare au lancement).
- Projet en français (textes du site au tutoiement) ; code et noms de fichiers en anglais.
- Après chaque session, ajoute une entrée datée dans `docs/journal.md` : ce qui a été
  demandé, proposé, gardé ou changé.

## Stack

Next.js 16 (App Router, `src/`), React 19, TypeScript, Tailwind CSS 4 (thème dans
`src/app/globals.css`, bloc `@theme`), Vitest, ESLint, Prettier, pnpm. Site statique
(`output: 'export'`, images non optimisées) hébergé sur Cloudflare Pages.

## Commandes

- `pnpm dev` — développement (lancé par l'utilisateur uniquement)
- `pnpm build` — vérifie les données (`check-data`) puis export statique dans `out/`
- `pnpm build-gestures` — à la main : télécharge le CSV Impact CO2 et régénère
  `src/lib/data/gestures.generated.json` (jamais pendant le build). Commite le fichier généré.
- `pnpm check-data` — lance seulement le garde-fou ; `STRICT_DATA=1 pnpm check-data` pour le mode strict
- `pnpm lint` · `pnpm test` · `pnpm format`

## Arborescence

- `src/app` — pages et layout
- `src/components` — composants
- `src/lib/data` — types, `gestures.generated.json` (données réelles), données de test (tests
  uniquement), adaptateur (`index.ts` : `getGestures`,
  `getGesture`, `getGesturesByCategory`, `hasFictiveData`) ; le reste du code ne lit les
  gestes que par cet adaptateur
- `src/lib/calc` — calculs purs (`emissions`, `compare`, `avoidedKg`, `gardenTotals`,
  `gardenStage`, `isAsleep`, `formatMass`)
- `public/illustrations` — SVG (voir `docs/svg-conventions.md`)
- `scripts` — scripts de données (locaux)
- `docs` — conventions et `journal.md`

## Conventions

- Tokens de design : couleurs `creme`, `encre`, `texte-attenue`, `blanc`, `tomate`,
  `tomate-douce`, `pomme`, `pomme-douce`, `outremer`, `soleil`, `rose` ; polices
  `font-titre` (Bricolage Grotesque 800) et `font-texte` (DM Sans 400/600) ; tailles
  `text-display`, `text-titre-xl`, `text-titre-l`, `text-titre-m`, `text-chiffre-xl`,
  `text-corps-l`, `text-corps-m`, `text-corps-s`, `text-legende`.
- Règle du jardin : choisir le plus léger ajoute (lourd − léger) kg évités ; choisir le plus
  lourd ajoute 0 et ne retire jamais rien. Le carnet ne fait que s'allonger. Après 21 jours
  sans entrée le jardin s'assoupit (`isAsleep`), il ne meurt jamais. Seuils des stades
  provisoires : `GARDEN_STAGE_THRESHOLDS_KG`.
- Source des données : CSV public Impact CO2 (ADEME), https://impactco2.fr/equivalents.csv,
  sans clé API. La sélection des gestes (ID du CSV, libellé, catégorie, unité) est la
  constante `SELECTION` de `scripts/build-gestures.ts` ; le script échoue si un ID disparaît
  ou change de thématique. Valeurs arrondies à 4 chiffres significatifs, date de
  téléchargement en tête du fichier. Pas de source, pas de geste : ne jamais ajouter de
  valeur à la main dans le JSON généré.
- Le site est en `noindex` tant qu'il n'est pas lancé (`metadata.robots` du layout).
- SVG : voir `docs/svg-conventions.md`.
