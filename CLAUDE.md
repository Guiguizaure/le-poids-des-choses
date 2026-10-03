@AGENTS.md

# Le poids des choses

Comparateur carbone illustré : deux gestes du quotidien sur une balance, un choix noté, un
jardin dessiné qui grandit avec les kg de CO2e évités. Projet vitrine pour webjuno.com.
Projet indépendant, non affilié à l'ADEME.

## Règles

- Vérifie la branche courante avant toute action git.
- Aucun commit ni push sur `main` sans accord explicite. Travail sur des branches
  (`feat/…`, `fix/…`), fusionnées par demande de fusion relue par l'utilisateur.
- Ne lance pas `pnpm dev` : l'utilisateur le lance dans un autre onglet. `build`, `lint`
  et `test` sont autorisés.
- Aucun secret dans le dépôt (`.env*` ignorés). La clé API ADEME ne sert qu'au script de
  données, en local.
- Toute valeur de test porte `fictive: true`. Plus tard, la construction de production
  devra échouer s'il en reste une.
- Projet en français (textes du site au tutoiement) ; code et noms de fichiers en anglais.
- Après chaque session, ajoute une entrée datée dans `docs/journal.md` : ce qui a été
  demandé, proposé, gardé ou changé.

## Stack

Next.js 16 (App Router, `src/`), React 19, TypeScript, Tailwind CSS 4 (thème dans
`src/app/globals.css`, bloc `@theme`), Vitest, ESLint, Prettier, pnpm. Site statique
(`output: 'export'`, images non optimisées) hébergé sur Cloudflare Pages.

## Commandes

- `pnpm dev` — développement (lancé par l'utilisateur uniquement)
- `pnpm build` — export statique dans `out/`
- `pnpm lint` · `pnpm test` · `pnpm format`

## Arborescence

- `src/app` — pages et layout
- `src/components` — composants
- `src/lib/data` — adaptateur de données
- `src/lib/calc` — calculs
- `public/illustrations` — SVG (voir `docs/svg-conventions.md`)
- `scripts` — scripts de données (locaux)
- `docs` — conventions et `journal.md`

## Conventions

- Tokens de design : couleurs `creme`, `encre`, `texte-attenue`, `blanc`, `tomate`,
  `tomate-douce`, `pomme`, `pomme-douce`, `outremer`, `soleil`, `rose` ; polices
  `font-titre` (Bricolage Grotesque 800) et `font-texte` (DM Sans 400/600) ; tailles
  `text-display`, `text-titre-xl`, `text-titre-l`, `text-titre-m`, `text-chiffre-xl`,
  `text-corps-l`, `text-corps-m`, `text-corps-s`, `text-legende`.
- Le site est en `noindex` tant qu'il n'est pas lancé (`metadata.robots` du layout).
- SVG : voir `docs/svg-conventions.md`.
