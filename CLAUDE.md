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
`src/app/globals.css`, bloc `@theme`), GSAP + `@gsap/react` (animations), Vitest, ESLint,
Prettier, pnpm. Site statique
(`output: 'export'`, images non optimisées) hébergé sur Cloudflare Pages.

## Commandes

- `pnpm dev` — développement (lancé par l'utilisateur uniquement)
- `pnpm build` — convertit les illustrations, vérifie les données (`check-data`) puis export
  statique dans `out/`
- `pnpm illustrations` — convertit `public/illustrations/*.svg` en composants
  (`src/components/illustrations/generated.tsx`) ; à relancer après chaque nouvel export,
  et à commiter (un test échoue si le fichier généré n'est pas à jour)
- `pnpm build-gestures` — à la main : télécharge le CSV Impact CO2 et régénère
  `src/lib/data/gestures.generated.json` (jamais pendant le build). Commite le fichier généré.
- `pnpm check-data` — lance seulement le garde-fou ; `STRICT_DATA=1 pnpm check-data` pour le mode strict
- `pnpm lint` · `pnpm test` · `pnpm format`

## Arborescence

- `src/app` — pages et layout ; `/jardin` (Mon jardin) ; `/labo` : banc d'essai des
  illustrations, animations et du carnet (noindex, non liée)
- `src/components/illustrations` — `<Illustration>` et le fichier généré
- `src/components/scene` — `Tree`, `Flower` (via `StagedPlant`), `Scale`, `Butterfly`, `Bird`,
  `Bee`, `Ladybug`, `Snail`, `Hedgehog`, `Sparkle`, `Wind` (animés)
- `src/components/motion` — GSAP, `MotionProvider`, `useMotion` (préférence de mouvement),
  `gust.ts` (`playGust`, `useGust`, `useAutoGusts`)
- `src/lib/illustrations/specs.ts` — contrat des SVG (tailles, points d'appui, calques)
- `src/lib/journal` — carnet sur l'appareil : format et validation (`schema.ts`), fusion,
  export et import (`merge.ts`), stockage avec repli en mémoire (`store.ts`), création
  d'une entrée (`entry.ts`), textes d'une entrée (`display.ts`), hook `useJournal`
- `src/lib/garden` — modèle pur du jardin (`buildGarden` : plantes, emplacements, animaux,
  endormissement), géométrie de la scène (`scene.ts`), textes (`text.ts`)
- `src/components/garden` — `<Garden entries now highlightId />`, écran `/jardin`
- `src/lib/geometry` — géométrie pure (balance, délais et inclinaisons du coup de vent)
- `src/lib/data` — types, `gestures.generated.json` (données réelles), données de test (tests
  uniquement), adaptateur (`index.ts` : `getGestures`,
  `getGesture`, `getGesturesByCategory`, `hasFictiveData`) ; le reste du code ne lit les
  gestes que par cet adaptateur
- `src/lib/calc` — calculs purs (`emissions`, `compare`, `avoidedKg`, `gardenTotals`,
  `gardenStage`, `isAsleep`, `formatMass`)
- `public/illustrations` — SVG (voir `docs/svg-conventions.md`)
- `scripts` — scripts de données et de conversion des illustrations
- `docs` — conventions, `methode.md` (hypothèses de calcul) et `journal.md`

## Conventions

- Tokens de design : couleurs `creme`, `encre`, `texte-attenue`, `blanc`, `tomate`,
  `tomate-douce`, `pomme`, `pomme-douce`, `outremer`, `soleil`, `rose`, `sapin` (#1B6B45,
  réservée aux feuilles) ; polices
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
- Objets (unité `objet`) : chaque geste porte `modes` (`neuf`, `occasion`, `occasion-livree`,
  `garder`), chaque valeur avec `method` (`impactco2` + `sourceId`, ou `hypothese-occasion` /
  `hypothese-garder`). `withMode` / `compareModes` (`src/lib/calc/modes.ts`) comparent les
  modes d'un même objet. Le colis de l'option « livrée » est choisi par objet dans
  `PARCEL_BY_GESTURE_ID` (script) ; pas de ligne adaptée = pas d'option, jamais de valeur
  inventée. Hypothèses détaillées dans `docs/methode.md`.
- Le site est en `noindex` tant qu'il n'est pas lancé (`metadata.robots` du layout).
- SVG : voir `docs/svg-conventions.md`. Jamais d'`id` dans le rendu : les calques sont des
  `data-part`, ciblés par `[data-part="…"]` dans la ref de l'instance.
- Animations : GSAP via `useMotion` (`gsap.matchMedia`). Tout mouvement est coupé ou réduit à
  un fondu court sous `prefers-reduced-motion` (ou `MotionProvider forceReduced`). Les
  calculs géométriques vont dans des fonctions pures testées (`src/lib/geometry`).
- Code en anglais sans exception (composants : `Tree`, `Scale`, `Butterfly`, `Bird`,
  `Sparkle`). Restent en français : les noms de fichiers d'illustration, les `data-part` (noms
  de calques) et les valeurs qui les reprennent (`stage="pousse"`). Fichiers composants en
  PascalCase.
- Lot interface (à venir) : pour les objets, trois options (Neuf / D'occasion / Je garde le
  mien), avec sous « D'occasion » un interrupteur « Livré en colis » activé par défaut.
- Coup de vent : `playGust(scene)` ; chaque plante réagit quand le front l'atteint
  (`gustDelay`, selon sa position x) et se couche de 6 à 10° ; papillon et abeille sont
  déportés. Rafales automatiques (`useAutoGusts`) toutes les 8 à 15 s, onglet visible
  seulement. Rien en mouvement réduit.
- Pousse : `GROWTH` (`StagedPlant`) — 0,7 s, montée depuis le pied avec dépassement
  (`back.out`), puis éclat. Le balancement au repos reste calme (±1,5°).
- Carnet : `localStorage`, clé versionnée `lpdc:journal:v1` (`{ version: 1, entries }`).
  Il ne fait que s'allonger ; entrées invalides ignorées mais conservées ; une future v2
  lira l'ancienne clé via `MIGRATIONS`. Stockage indisponible (navigation privée) : carnet
  en mémoire et message. Stockage persistant demandé au premier ajout. Export JSON, import
  qui fusionne par id. Les kg évités sont figés dans l'entrée au moment du choix.
- Jardin (`buildGarden`, déterministe : même carnet = même jardin) :
  - une plante par choix léger (`avoidedKg > 0`) ; un choix lourd ne change rien ;
  - type (arbre ou fleur 1-3) tiré de l'id de l'entrée ; stade selon les kg du choix
    (`PLANT_STAGE_KG`, provisoire : < 1 kg pousse, 1-20 jeune/fleurie, > 20 grand) ;
  - 40 emplacements (`GARDEN_SLOTS`, 5 rangées) posés sur la ligne des collines de
    `scene-paysage` (`src/lib/garden/scene.ts` : à mettre à jour si les collines changent) ;
    les plus grands vers l'arrière ; au-delà de 40, les nouveaux choix font grandir les
    plus anciennes plantes ;
  - animaux selon le nombre de choix légers (`ANIMAL_UNLOCKS`, provisoire) : papillon 1,
    coccinelle 3, oiseau 5, escargot 8, abeille 12, hérisson 20 ; message d'arrivée ;
  - assoupi après 21 jours sans entrée : brume, oiseau/escargot/hérisson endormis, autres
    animaux partis, ni balancement ni vent ; réveil à l'entrée suivante.
- Lot duel (5, à venir) : valider un choix appelle `useJournal().add(…)` ; le jardin réagit
  seul (pousse, éclat, rafale, message). Le bandeau d'installation viendra au lot pages.
