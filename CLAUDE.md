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
  (`src/components/illustrations/generated.tsx`) et extrait de `scene-paysage.svg` le
  contour des collines et le haut du sol (`src/lib/garden/scene.generated.ts`) ; à relancer
  après chaque nouvel export, et à commiter (des tests échouent si les fichiers générés ne
  sont pas à jour ou si les deux collines sont introuvables)
- `pnpm build-gestures` — à la main : télécharge le CSV Impact CO2 et régénère
  `src/lib/data/gestures.generated.json` (jamais pendant le build). Commite le fichier généré.
- `pnpm check-data` — lance seulement le garde-fou ; `STRICT_DATA=1 pnpm check-data` pour le mode strict
- `pnpm lint` · `pnpm test` · `pnpm format`

## Arborescence

- `src/app` — pages et layout : `/` (accueil, maquettes 01 et 07), `/comparer` (parcours
  de comparaison), `/jardin` (Mon jardin), `/methode` (PROVISOIRE, complétée au lot
  pages), `/labo` (banc d'essai des illustrations, animations et du carnet ; non liée)
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
  endormissement), géométrie de la scène (`scene.ts`, d'après `scene.generated.ts`), textes (`text.ts`)
- `src/components/garden` — `<Garden entries now highlightId />`, écran `/jardin`
- `src/components/compare` — parcours : `CompareFlow` (piloté par l'URL), `GestureChooser`
  (02), `Duel` (03), `ObjectDuel` (03b), `ChoiceResult` (05a / 05b)
- `src/components/home` — accueil ; `src/components/ui` — boutons, interrupteur, pastille
  « Mon jardin · X kg évités »
- `src/lib/compare` — règles pures du parcours : filtrage par unité, curseurs, inclinaison
  (`tiltFor`), phrase de résultat et équivalence (`sentence.ts`), noms et accords
  (`nouns.ts`), URL (`url.ts`), entrées du carnet (`duelEntry`, `objectEntry`)
- `src/lib/geometry` — géométrie pure (balance, délais et inclinaisons du coup de vent)
- `src/lib/data` — types, `gestures.generated.json` (données réelles), données de test (tests
  uniquement), adaptateur (`index.ts` : `getGestures`,
  `getGesture`, `getGesturesByCategory`, `hasFictiveData`) ; le reste du code ne lit les
  gestes que par cet adaptateur
- `src/lib/calc` — calculs purs (`emissions`, `compare`, `avoidedKg`, `gardenTotals`,
  `isAsleep`, `formatMass`, modes d'acquisition)
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
  sans entrée le jardin s'assoupit (`isAsleep`), il ne meurt jamais. Stades : par plante
  (`PLANT_STAGE_KG`, voir le modèle du jardin plus bas).
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
- Maquettes Figma (fichier `PZ5vEqe5GthiUzst3AfsYU`, page « Écrans mobiles · Papiers
  découpés ») : 01 Accueil, 02 Choisir un geste, 03 Duel, 03b Duel objet, 04 Mon jardin,
  05a / 05b Choix noté, 07 Accueil ordinateur. Les lire avec le connecteur Figma avant de
  toucher à un écran ; tutoiement et textes repris tels quels.
- Parcours de comparaison (`/comparer`, état dans l'URL, lu côté client) :
  - `?a=tgv` : second geste parmi ceux de MÊME UNITÉ ; `?a=tgv&b=avion&q=50` : duel ;
    `?objet=jean&option=occasion&colis=1` : duel objet. URL invalide → premier choix avec
    `?lien=invalide`. Navigation par `history.pushState` / `replaceState` (Next les
    synchronise avec `useSearchParams`, sans recharger).
  - Curseurs : distance 1 à 1 000 km (échelle logarithmique, défaut 50), durée 1 à 10 h ;
    rien pour les repas et les objets.
  - Balance : inclinaison ∝ log du rapport, maximale à partir de ×50 (`TILT_MAX_RATIO`).
  - Objets : Neuf / D'occasion (interrupteur « Livré en colis », activé par défaut) / Je
    garde le mien. L'option retenue est comparée au neuf ; le neuf, à l'occasion telle que
    réglée (donc un choix plus lourd).
  - « Je choisis … » : `useJournal().add(…)`, puis 05a (plante, rafale, animal) ou 05b.
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
    `scene-paysage`, extraite automatiquement du SVG (calques `colline-arriere`,
    `colline-avant`, `sol`) : redessiner les collines suffit, puis `pnpm illustrations` ;
    les plus grands vers l'arrière ; au-delà de 40, les nouveaux choix font grandir les
    plus anciennes plantes ;
  - animaux selon le nombre de choix légers (`ANIMAL_UNLOCKS`, provisoire) : papillon 1,
    coccinelle 3, oiseau 5, escargot 8, abeille 12, hérisson 20 ; message d'arrivée ;
  - assoupi après 21 jours sans entrée : brume, oiseau/escargot/hérisson endormis, autres
    animaux partis, ni balancement ni vent ; réveil à l'entrée suivante.
- Lot pages (à venir) : page Méthode complète (remplace `/methode` provisoire), bandeau
  d'installation et manifeste ; levée du `noindex` au lancement.
