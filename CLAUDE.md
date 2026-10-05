@AGENTS.md

# Le poids des choses

Comparateur carbone illustré : deux gestes du quotidien sur une balance, un choix noté, un
jardin dessiné qui grandit à chaque choix plus léger. Projet vitrine pour webjuno.com.
Projet indépendant, non affilié à l'ADEME.

## Règles

- Vérifie la branche courante avant toute action git.
- Aucun commit ni push sur `main` sans accord explicite. Travail sur des branches
  (`feat/…`, `fix/…`, `docs/…`, `chore/…`), fusionnées par demande de fusion relue par
  l'utilisateur. Depuis le premier commit, plus aucun travail directement sur `main`.
- Messages de commit au format conventionnel, en français : `feat:`, `fix:`, `chore:`,
  `docs:`, `refactor:`, `test:`…
- Ne lance pas `pnpm dev` : l'utilisateur le lance dans un autre onglet. `build`, `lint`
  et `test` sont autorisés, ainsi que `wrangler pages dev` sur un port dédié pour les tests
  (à arrêter ensuite). Si une commande wrangler demande une connexion au compte Cloudflare,
  s'arrêter et donner la commande à l'utilisateur.
- Aucun secret dans le dépôt (`.env*`, `.dev.vars` ignorés). La clé API ADEME ne sert qu'au
  script de données, en local. Clés et secrets du compte : `.dev.vars` en local et secrets
  Cloudflare (saisis par l'utilisateur), jamais ailleurs.
- Toute valeur de test porte `fictive: true` (et `source: "fictive"`) et n'est jamais citée.
  Elles vivent dans `src/lib/data/test-gestures.ts`. `scripts/check-data.ts` (lancé par
  `pnpm build`) fait échouer la construction s'il reste une donnée fictive OU un
  emplacement des mentions légales ([NOM], [SIRET], [ADRESSE], [EMAIL] dans
  `src/lib/legal.ts`), mais seulement si `STRICT_DATA=1` est défini (à activer chez
  Cloudflare au lancement). Les mentions légales sont remplies : `STRICT_DATA=1 pnpm build`
  passe (un test le vérifie). Toujours bloquant, même sans `STRICT_DATA` : un gabarit « Le
  savais-tu ? » qui référence un geste ou un produit de saison disparu.
- Données Impact CO2 : réutilisation autorisée par l'équipe Impact CO2 de l'ADEME (e-mail
  du 5 octobre 2026), gratuite, avec la mention « Données : Impact CO2 – ADEME »
  (`DataCredit`) ; affichée sur /methode (`DATA_LICENSE`). La clé `IMPACTCO2_API_KEY` vit
  dans `.env.local` seulement : jamais affichée ni commitée.
- Projet en français (textes du site au tutoiement) ; code et noms de fichiers en anglais.
- Après chaque session, ajoute une entrée datée dans `docs/journal.md` : ce qui a été
  demandé, proposé, gardé ou changé.

## Stack

Next.js 16 (App Router, `src/`), React 19, TypeScript, Tailwind CSS 4 (thème dans
`src/app/globals.css`, bloc `@theme`), GSAP + `@gsap/react` (animations), Vitest, ESLint,
Prettier, pnpm. Compte facultatif : Cloudflare Pages Functions (`functions/`) et D1 (base
`DB`), e-mails Resend, anti-robot Turnstile. Site statique
(`output: 'export'`, images non optimisées) hébergé sur Cloudflare Pages.

## Commandes

- `pnpm dev` — développement (lancé par l'utilisateur uniquement)
- `pnpm build` — convertit les illustrations, génère les images (`images`), lance les
  garde-fous (`check-data`) puis l'export statique dans `out/`
- `pnpm images` — icônes PNG (192, 512, maskable, apple-touch-icon), favicon et image de
  partage 1200×630 (`public/og.png`) depuis `assets/icon/icon.svg` et les illustrations,
  rendues par resvg avec les polices d'`assets/fonts` ; fichiers commités
- `pnpm illustrations` — convertit `public/illustrations/*.svg` en composants
  (`src/components/illustrations/generated.tsx`) et extrait de `scene-paysage.svg` le
  contour des collines et le haut du sol (`src/lib/garden/scene.generated.ts`), et
  l'emprise du dessin de chaque plante (`src/lib/illustrations/bounds.generated.ts`) ; à relancer
  après chaque nouvel export, et à commiter (des tests échouent si les fichiers générés ne
  sont pas à jour ou si les deux collines sont introuvables)
- `pnpm build-gestures` — à la main : télécharge le CSV Impact CO2 et régénère
  `src/lib/data/gestures.generated.json` (jamais pendant le build). Commite le fichier généré.
- `pnpm build-saison` — à la main : interroge l'API publique « Fruits et légumes de
  saison » d'Impact CO2 pour les 12 mois et régénère `src/lib/data/saison.generated.json`
  (fiches des produits : colonne URL du CSV). Sans clé ; `IMPACTCO2_API_KEY` est lue dans
  `.env.local` seulement si elle existe (jamais dans le dépôt ni côté navigateur). Échoue
  sans rien écrire si l'API refuse l'accès, si une catégorie inconnue apparaît ou si les
  mois sont incohérents. Commite le fichier généré.
- `pnpm check-data` — lance seulement le garde-fou ; `STRICT_DATA=1 pnpm check-data` pour le mode strict
- `pnpm e2e` — tests de bout en bout et accessibilité (Playwright + axe, Chromium « Pixel 7 »
  et WebKit « iPhone 14 ») sur `out/`, servi par `e2e/static-server.mjs` avec les en-têtes
  de `public/_headers` ; toute erreur de console (CSP comprise) fait échouer un test.
  Lancer `pnpm build` avant. Clavier et focus : Chromium seulement (WebKit ne parcourt pas
  les liens avec Tab). Le compte (`e2e/compte.spec.ts`, projets `compte-chromium` et
  `compte-webkit`, 2 workers chacun) passe par `e2e/pages-server.mjs` (`wrangler pages dev`
  en HTTPS, port 4331, D1 locale neuve dans `.tmp/e2e-d1`) et `e2e/fake-services.mjs` (faux
  Resend et faux siteverify, port 4330) ; Turnstile est simulé par une route Playwright.
  Aucun vrai e-mail, aucune connexion à Cloudflare.
- `pnpm lighthouse` — scores Lighthouse mobile (accueil, choix des gestes, duel, jardin,
  carnet, saison, méthode) sur `pnpm serve:out` (port 4322) ; construire avec
  `SITE_LAUNCHED=1` pour mesurer le SEO sans le noindex.
- `pnpm captures` — captures du README (`docs/captures/`), dont le carnet et la feuille de
  partage (partage de fichiers simulé)
- `pnpm db:migrate:local` — applique `migrations/` à la base D1 locale (`wrangler.local.toml`)
- `pnpm db:migrate:production` · `pnpm db:migrate:preview` — appliquent `migrations/` aux
  bases distantes `lpdc-production` / `lpdc-preview` (retrouvées par leur nom) ; demandent
  une connexion Cloudflare : à lancer par l'utilisateur uniquement
- `pnpm pages:dev` — export + Pages Functions en local (port 8788, base locale, `.dev.vars`
  d'après `.dev.vars.example`) ; `pnpm build` avant
- `pnpm lint` · `pnpm test` · `pnpm format`

## Arborescence

- `src/app` — pages et layout : `/` (accueil, maquettes 01 et 07), `/comparer` (parcours
  de comparaison), `/jardin` (Mon jardin), `/jardin/carnet` (carnet analysé, « Tout
  voir »), `/saison` (fruits et légumes de saison),
  `/methode` (maquette 06, papiers découpés `PaperCutout`), `/mentions-legales`,
  `/confidentialite`, `/connexion` (lien magique, ou formulaire « Retrouve ton jardin » sans
  jeton ; toujours noindex et hors sitemap),
  404 (`not-found.tsx`, jardin dans la brume), `/labo` (banc d'essai ; non liée, toujours
  noindex et hors sitemap) ; `manifest.ts`, `robots.ts`, `sitemap.ts` ; pied de page
  commun (`SiteFooter`) dans le layout
- `src/lib/site.ts` — nom, adresse (`SITE_URL`, défaut `le-poids-des-choses.pages.dev`),
  lancement (`SITE_LAUNCHED`), métadonnées par page (`pageMetadata` : titre, description,
  Open Graph, carte Twitter), robots et sitemap ; `src/lib/legal.ts` — éditeur et hébergeur ;
  `src/lib/install.ts` — règles du bandeau d'installation
- `src/components/illustrations` — `<Illustration>` et le fichier généré
- `src/components/scene` — `Tree`, `Flower` (via `StagedPlant`), `Scale`, `Butterfly`, `Bird`,
  `Bee`, `Ladybug`, `Snail`, `Hedgehog`, `Sparkle`, `Wind` (animés)
- `src/components/motion` — GSAP, `MotionProvider`, `useMotion` (préférence de mouvement),
  `gust.ts` (`playGust`, `useGust`, `useAutoGusts`)
- `src/lib/illustrations/specs.ts` — contrat des SVG (tailles, points d'appui, calques)
- `src/lib/journal` — carnet sur l'appareil : format et validation (`schema.ts`), fusion,
  export et import (`merge.ts`), stockage avec repli en mémoire (`store.ts`), création
  d'une entrée (`entry.ts`), textes d'une entrée (`display.ts`), hook `useJournal`, carnet
  analysé (`analysis.ts` : tri, filtres, vue dans l'URL, choix légers sur 7 jours)
- `src/lib/milestones` — paliers de l'écart cumulé et leur équivalence calculée, garde-fou
  du build (`check.ts`)
- `src/lib/share` — carte de partage sans navigateur : description de dessin (`card.ts`)
  et jardin en SVG statique (`garden-svg.ts`)
- `src/lib/garden` — modèle pur du jardin (`buildGarden` : plantes, emplacements, animaux,
  endormissement), géométrie de la scène (`scene.ts`, d'après `scene.generated.ts`), textes
  (`text.ts`), ciels à débloquer (`skies.ts`)
- `src/components/garden` — `<Garden entries now highlightId sky />`, écran `/jardin`,
  `CarnetScreen` (`/jardin/carnet`), `WeekChart`, `MilestoneCard`, `SkyPicker` et
  `useSky`, partage (`share/` : `renderShareCard`, `useShareSupport`, `ShareSheet`)
- `src/components/compare` — parcours : `CompareFlow` (piloté par l'URL), `GestureChooser`
  (02), `Duel` (03), `ObjectDuel` (03b), `ChoiceResult` (05a v2 / 05b v2, carte de révélation)
- `src/components/home` — accueil ; `src/components/ui` — boutons, interrupteur, pastille
  « Mon jardin · X kg d’écart »
- `src/lib/compare` — règles pures du parcours : filtrage par unité, curseurs, inclinaison
  (`tiltFor`), phrase de résultat et équivalence (`sentence.ts`), noms et accords
  (`nouns.ts`), URL (`url.ts`), entrées du carnet (`duelEntry`, `objectEntry`)
- `src/lib/geometry` — géométrie pure (balance, délais et inclinaisons du coup de vent)
- `src/lib/data` — types, `gestures.generated.json` (données réelles), données de test (tests
  uniquement), adaptateur (`index.ts` : `getGestures`,
  `getGesture`, `getGesturesByCategory`, `hasFictiveData`) ; le reste du code ne lit les
  gestes que par cet adaptateur
- `src/lib/facts` — « Le savais-tu ? » : gabarits (`templates.ts`), faits calculés et choix
  déterministe (`pickFact`, graine : jour ou id d'entrée), garde-fou du build (`check.ts`) ;
  carte `FactCard` (`src/components/facts`) sous le duel, le duel objet et sur /jardin
- `src/lib/calc` — calculs purs (`emissions`, `compare`, `avoidedKg`, `gardenTotals`,
  `isAsleep`, `formatMass`, modes d'acquisition)
- `public/illustrations` — SVG (voir `docs/svg-conventions.md`)
- `scripts` — scripts de données et de conversion des illustrations
- `functions/api` — Pages Functions (routes minces) ; `server/` — logique de l'API (auth,
  limites, carnet, e-mail, entretien, origines), testée sur une D1 locale
  (`server/testing/d1.ts`, `getPlatformProxy`) ; `migrations/` — schéma D1 versionné ;
  `wrangler.local.toml` — configuration LOCALE seulement (voir Compte)
- `src/lib/sync` — compte côté navigateur : fusion (`merge.ts`), forme canonique, état de
  synchro (`lpdc:compte:v1`), client de l'API, moteur de synchro (`engine.ts`), textes,
  Turnstile ; `src/components/account` — `AccountSection` (/jardin), `ConnexionScreen`
- `docs` — conventions, `methode.md` (hypothèses de calcul) et `journal.md`

## Conventions

- Tokens de design : couleurs `creme`, `encre`, `texte-attenue`, `blanc`, `tomate`,
  `tomate-douce`, `pomme`, `pomme-douce`, `outremer`, `soleil`, `rose`, `sapin` (#1B6B45,
  réservée aux feuilles) ; polices
  `font-titre` (Bricolage Grotesque 800) et `font-texte` (DM Sans 400/600) ; tailles
  `text-display`, `text-titre-xl`, `text-titre-l`, `text-titre-m`, `text-chiffre-xl`,
  `text-corps-l`, `text-corps-m`, `text-corps-s`, `text-legende`.
- Formulation honnête : jamais « évité », « économisé », « sauvé » ni « gagné » pour les kg.
  Le site ne mesure qu'un écart avec l'autre option comparée : « X kg de CO2e d’écart avec
  les autres options » (bilan), « Mon jardin · X kg d’écart » (pastille), « X kg d’écart »
  (carte de révélation, sans « + ») ; expliqué dans /methode#ecart. Le champ `avoidedKg` garde son nom
  (carnets et exports existants) mais désigne cet écart.
- Règle du jardin : choisir le plus léger ajoute l'écart (lourd − léger) en kg ; choisir le plus
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
- Le site est en `noindex` tant qu'il n'est pas lancé (`SITE_LAUNCHED`, voir plus bas).
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
  05a v2 Révélation / 05b v2 Choix lourd (nœuds 37:58 et 37:96 ; remplacent 05a / 05b),
  07 Accueil ordinateur. Les lire avec le connecteur Figma avant de
  toucher à un écran ; tutoiement et textes repris tels quels.
- Parcours de comparaison (`/comparer`, état dans l'URL, lu côté client) :
  - Choix sur un seul écran (02) : premier toucher = geste 1, second = geste 2 (logique
    pure : `toggleGesture`, `isSelectable`) ; dès le premier choix, les gestes d'une autre
    unité sont grisés ; retoucher un geste le retire ; un objet ouvre directement 03b.
  - `?a=tgv` : premier geste choisi ; `?a=tgv&b=avion&q=50` : duel ;
    `?objet=jean&option=occasion&colis=1` : duel objet. URL invalide → premier choix avec
    `?lien=invalide`. Navigation par `history.pushState` / `replaceState` (Next les
    synchronise avec `useSearchParams`, sans recharger).
  - Unités : km (Se déplacer), repas (Manger), litre (Boire), achat (Se faire livrer,
    colis d'1 kg), objet (S'habiller, Numérique : appareils seulement). Seul curseur :
    distance 1 à 1 000 km (échelle logarithmique, défaut 50).
  - Balance : inclinaison ∝ log du rapport, maximale à partir de ×50 (`TILT_MAX_RATIO`).
  - Objets : Neuf / D'occasion (interrupteur « Livré en colis », activé par défaut) / Je
    garde le mien. L'option retenue est comparée au neuf ; le neuf, à l'occasion telle que
    réglée (donc un choix plus lourd).
  - « Je choisis … » : `useJournal().add(…)`, puis la carte de révélation (pas de jardin) :
    choix léger → vitrine avec la plante EXACTE du jardin (`revealForEntry` : même calcul
    que `buildGarden`, jardin avec / sans l'entrée) mise à l'échelle pour occuper la hauteur
    de la vitrine quel que soit son stade (`vitrineFit` ; une pousse est agrandie, les
    traits gardent l'épaisseur du jardin via `strokeScale` ; dans le jardin, vraie taille),
    sans éclat (réservé au jardin, quand la plante pousse à sa place), titre selon le stade
    (« Une petite pousse va sortir de terre », « Un arbre / Une fleur va pousser… », « … va
    grandir… » jardin plein), animal débloqué qui entre, « Et un papillon arrive ! »,
    « Aller la planter » → `/jardin?nouveau=<id>` ; choix lourd
    → balance qui oscille puis se pose, « C’est noté ». La carte se pose comme un papier.
  - `/jardin?nouveau=<id>` : la scène s'affiche sans ce choix (`Garden highlightId`), puis
    la plante pousse (ou grandit), rafale, animal qui entre par le bord, message
    `aria-live` ; le paramètre est retiré (`replaceState`) après 4 s. Lu avec
    `useSearchParam` (pas `useSearchParams`, qui ferait rendre toute la page côté client).
- Coup de vent : `playGust(scene)` ; chaque plante réagit quand le front l'atteint
  (`gustDelay`, selon sa position x) et se couche de 6 à 10° ; papillon et abeille sont
  déportés. Rafales automatiques (`useAutoGusts`) toutes les 25 à 45 s, onglet visible
  seulement. Rien en mouvement réduit.
- Ciel : `Landscape` remplace scene-paysage partout ; nuages qui traversent (60 à 90 s,
  `src/lib/geometry/sky.ts`) ; halo = calque `halo-soleil` du dessin (anneau soleil #FFC93C
  derrière le disque, invisible par défaut), opacité 0,35 à 0,6 et échelle 1 à 1,12 sur
  6 s. Ne jamais poser un calque HTML « derrière » un SVG opaque : il serait caché. Immobile
  en mouvement réduit et quand le jardin est assoupi.
- Pictos manquants : `PENDING_PICTOS` (`specs.ts`, vide aujourd'hui) et
  `docs/illustrations-a-fournir.md` ; `picto-generique` en attendant. Un test vérifie
  qu'aucun geste n'affiche `picto-generique` hors de cette liste.
- Objets : libellés courts (« Jean », « Smartphone ») ; « neuf » n'apparaît que dans
  l'option Neuf du 03b et dans les titres du carnet, accordés via `objectNoun`.
- Pousse : `GROWTH` (`StagedPlant`) — 0,7 s, montée depuis le pied avec dépassement
  (`back.out`), puis éclat. Le balancement au repos reste calme (±1,5°).
- Carnet : `localStorage`, clé versionnée `lpdc:journal:v1` (`{ version: 1, entries }`).
  Il ne fait que s'allonger ; entrées invalides ignorées mais conservées ; une future v2
  lira l'ancienne clé via `MIGRATIONS`. Stockage indisponible (navigation privée) : carnet
  en mémoire et message. Stockage persistant demandé au premier ajout. Export JSON, import
  qui fusionne par id. L'écart (kg) est figé dans l'entrée au moment du choix.
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
    coccinelle 3, oiseau 5, escargot 8, abeille 12, hérisson 20 ; message d'arrivée ; le
    « Encore N choix légers avant l’arrivée de … » (`nextAnimal`, `nextAnimalMessage`)
    uniquement sur /jardin, sous la scène (ni sur 05a / 05b, ni ailleurs ; pas de
    silhouette) ;
  - places (`ANIMAL_PLACES`) : papillon et abeille dans la bande de ciel, au-dessus des plus
    hauts feuillages ; coccinelle, escargot, hérisson et oiseau au sol ;
  - oiseau posé sur la colline verte (sautille, picore, dort au sol). Envol (V1.1) :
    toutes les 40 à 90 s (`flightDelay`, graine tirée une fois par session dans
    `sessionStorage`) ou quand on le touche (bouton « Faire s’envoler l’oiseau », posé sur
    lui hors de la scène `role="img"`), il passe sur `oiseau-vol` (ailes en scaleY de 1 à
    -0,6 autour de 28,30, en décalé), décolle sous le soleil, boucle dans la bande de ciel
    et revient se poser (`src/lib/geometry/flight.ts` : trajet testé, jamais devant le
    soleil ni hors scène ; `data-flight` donne la phase). Jamais quand le jardin dort ni en
    mouvement réduit (pas de bouton) ;
  - petites bêtes cernées d'encre 1,5 px (`vector-effect="non-scaling-stroke"` : le trait
    reste fin quelle que soit la taille d'affichage) ;
  - assoupi après 21 jours sans entrée : brume, oiseau/escargot/hérisson endormis, autres
    animaux partis, ni balancement ni vent ; réveil à l'entrée suivante.
- Lancement (`SITE_LAUNCHED=1`, activé par l'utilisateur dans Cloudflare) : au build, elle
  retire le noindex, remplit sitemap.xml et ouvre robots.txt (sauf /labo). Sans elle, tout
  reste en noindex. Penser aussi à `SITE_URL` si
  le domaine n'est pas `le-poids-des-choses.pages.dev`, à `STRICT_DATA=1`, et à activer
  Cloudflare Web Analytics dans le tableau de bord Pages (annoncé dans les mentions
  légales).
- Méthode : conditions de réutilisation des données ADEME dans `DATA_LICENSE`
  (`src/app/methode/page.tsx`), affichées dans #sources.
- Crédit des données (`DataCredit`) : « Données : Impact CO2 – ADEME » (lien) et la date
  de téléchargement des données affichées, sur chaque résultat (duel, duel objet, carte de
  révélation), sur /saison et sur /methode (#sources et #saison). Testé de bout en bout.
- Fruits et légumes de saison (`src/lib/saison`, `src/components/saison`) : /saison « De
  saison en octobre », mois dans l'URL (`?mois=10`, sinon le mois courant ; sélecteur qui
  fait `pushState` puis `popstate`), tous les produits de l'API regroupés par catégorie de
  l'API (`SEASON_CATEGORIES`, intitulé = nom de l'API avec majuscule, ordre des ids de
  l'API), triés par impact au kg ; puces colorées, pas d'illustration. Les deux mangues
  (avion, bateau) restent telles quelles ; aucune autre provenance (voir
  /methode#saison). Encart `SeasonTeaser` sur l'accueil et /comparer : « De saison en
  octobre » puis « Du plus léger au plus lourd au kilo : Ail (384 g CO2e/kg) … Noisette
  (4,8 kg CO2e/kg) » (`seasonRange` : produits de saison ce mois-ci hors toute l'année,
  égalité → ordre alphabétique ; `formatPerKilo` = `formatMass` + espaces insécables), lien
  /saison et `DataCredit`. Fruits et légumes dessinés flottants (`FloatingProduce`,
  21 `saison-*.svg` 80×80, pas de cagette) : correspondance `SEASON_DRAWINGS`
  (`src/lib/saison/drawn.ts`, dessin → slug des données, ex. `saison-petits-pois` →
  `petitpois` ; un dessin sans produit dans les données reste hors de la table ; testée,
  au moins 3 dessins de saison chaque mois), `drawnForMonth` (de saison ce mois-ci, saison la plus courte
  d'abord, 5 au plus ; moins de 3 → toute l'année ; aucun → mois le plus proche) ; places,
  flottement et parallaxe dans `src/lib/geometry/float.ts` (sans chevauchement, testé) ;
  4-5 à droite dès 28rem de large (requête de conteneur), rangée de 3 en dessous, masqués
  sous 15rem ; au-dessus, le mois en étiquette de papier découpé (soleil, encre, posée comme
  `PaperCutout`, aria-hidden) ; fondu décalé à l'entrée, rebond au toucher, pause onglet
  caché ou hors écran, immobiles en mouvement réduit ; démo dans /labo.
- Installation (PWA) : manifeste, icônes, bandeau « Garde ton jardin » sur /jardin
  (Android : invite `beforeinstallprompt` ; iPhone : « Partager, puis Sur l’écran
  d’accueil » ; masqué si installé ou fermé). Accès permanent « Installer l’appli »
  (`InstallButton`, règle `installAccess`) dans le pied de page et la sauvegarde de /jardin,
  même bandeau fermé : invite mémorisée, ou aide en deux gestes (en mots) sur iPhone et iPad ;
  masqué si installé ou impossible. État partagé : `src/components/install/useInstall.ts`,
  chargé par le pied de page (l'invite est gardée sur toutes les pages). Pas de service
  worker pour l'instant.
- Papiers découpés (`PaperCutout`, /methode) : illustrations existantes, 4 à 6 au plus,
  aria-hidden, cadre de taille fixe, rotation et ombre encre (`drop-shadow`) ; à côté des
  titres sur mobile (masquées sous 360 px), dans les marges dès `lg` ; se posent à l'entrée
  dans l'écran (`useMotion`, IntersectionObserver), rien en mouvement réduit.
- Qualité :
  - CI GitHub Actions (`.github/workflows/ci.yml`) : lint, tests, build, bout en bout à
    chaque demande de fusion ;
  - `public/_headers` : CSP (scripts et styles en ligne autorisés, nécessaires à l'export
    Next ; Cloudflare Web Analytics autorisé), Referrer-Policy, Permissions-Policy,
    nosniff, cache immuable de `/_next/static/*` ;
  - performance : la 404 racine est embarquée dans toutes les pages, elle doit rester sans
    composant client ; l'écran de résultat est chargé à la demande ; les animations
    d'ambiance démarrent deux images après l'affichage (`useMotion`) ;
  - micro-interactions (CSS, `globals.css`) : `press` (survol / toucher), `animate-enter`
    (apparition des pages et étapes, depuis une opacité de 0,35 pour ne pas retarder le
    LCP), `animate-pop` (badges), `animate-select` (cartes choisies) — toujours avec
    `motion-reduce:animate-none` ; compteur de l'écart cumulé (`CountUp`) ;
  - contraste : `src/lib/a11y/contrast.test.ts` vérifie chaque paire texte / fond du thème
    (à compléter si une nouvelle paire apparaît).
- « Le savais-tu ? » : aucun chiffre écrit à la main. Un gabarit ne rédige que la prémisse
  (« un jean neuf », « un repas ») ; la valeur vient des données via `src/lib/calc`, arrondie
  par `readableNumber` (2 chiffres significatifs au-delà de 100, entier dès 10, sinon un
  décimal) ou `formatMass`. Chaque fait renvoie à la fiche Impact CO2 du geste source et à
  `/methode#savais-tu`. Sur le duel, on préfère un fait sur les gestes comparés ; sur
  /jardin, graine = dernier choix noté. Tests : valeur finie et positive pour chaque gabarit.
  Un gabarit porte sur des gestes (`gestures`) ou sur des produits de saison (`products`,
  slugs de l'API : celui des deux mangues) ; un geste ou un produit disparu fait échouer
  le build.
- Carnet analysé : section Carnet de /jardin (graphique de la semaine, 5 derniers choix,
  « Tout voir » → /jardin/carnet). Sur /jardin/carnet : tri (date par défaut, écart,
  catégorie) et filtres (catégorie, choix légers ou notés) dans l'URL
  (`?tri=ecart&categorie=transport&choix=legers`, `pushState` puis `popstate`).
  Graphique en barres SVG faites main (outremer, aujourd'hui en tomate), tableau masqué
  visuellement, état vide.
- Paliers : 10, 50, 100, 250, 500, 1000 kg CO2e d'écart cumulé. Carte « Palier franchi »
  sur /jardin quand le dernier choix léger en franchit un (le plus haut), équivalence
  calculée comme « Le savais-tu ? » (`MILESTONE_EQUIVALENCES`) ; un geste disparu fait
  échouer le build.
- Ciels : Jour, Aube rose (15 choix légers), Midi soleil (30), Nuit encre (50) ; couleurs
  de la palette seulement, variables `--sky-*` sur la scène (calques ciel, soleil, halo,
  nuages, vent) ; collines et sol inchangés ; pas de ciel outremer (la colline du fond y
  disparaîtrait). Choix gardé sous `lpdc:ciel:v1` (`{ version: 1, sky }`) ; un ciel
  verrouillé n'est jamais appliqué. Le ciel s'applique aussi à l'image de partage.
- Partage du jardin (maquettes 41:310, 42:60 « 09a », 42:233 « 09b ») : « Exporter » et
  « Partager » (encre) dans la barre du haut de /jardin seulement si `navigator.canShare`
  accepte un PNG ET `(pointer: coarse)` ou `(display-mode: standalone)` ; ordinateur
  inchangé (l'export reste en bas). PNG 1080×1350 dessiné sur un canvas : même jardin
  (`composeGardenSvg`), même ciel, polices attendues (`document.fonts`), titre réduit s'il
  déborde, domaine dérivé de `SITE_URL` (passé par la page). Aucun kg ni choix lourd sur
  l'image. Feuille modale (`<dialog>`) : focus piégé, Échap, retour du focus ; AbortError
  sans effet, autre erreur : message discret.
- Compte (lot V2-2, facultatif ; le carnet local reste la source principale) :
  - routes : `POST /api/auth/link` (e-mail + Turnstile, réponse identique que l'adresse ait un
    compte ou non), `POST /api/auth/verify`, `GET /api/auth/session`,
    `POST /api/auth/logout`, `POST /api/journal/sync` (`since`, `entries`, 200 au plus),
    `GET /api/account/export`, `DELETE /api/account` (`{ confirm: "supprimer" }`) ;
  - lien magique vers `/connexion#jeton=…` (fragment : jamais envoyé au serveur ni ouvert par
    les antivirus de messagerie), 15 min, usage unique ; seules les empreintes SHA-256 des
    jetons sont en base ; cookie `__Host-lpdc_session` (HttpOnly, Secure, SameSite=Lax,
    90 jours) ; Origin vérifiée sur tout POST/DELETE ; origines autorisées
    (`server/origin.ts`) : lepoidsdeschoses.com, www, le-poids-des-choses.pages.dev et
    `*.le-poids-des-choses.pages.dev` (localhost seulement avec `ALLOW_LOCALHOST=1`) ;
  - limites (`server/config.ts`) : liens 3/15 min et 10/24 h par e-mail, 10/15 min et
    50/24 h par IP ; vérifications 30/15 min par IP ; clés HMAC (`HASH_SECRET`) ;
  - carnet en base append-only, une ligne par version d'entrée ; conflit (même id, contenu
    différent) : les deux versions gardées ; côté appareil, la version locale reste, l'autre
    va dans `conflicts` (jamais affichée, dans l'export du compte) ;
  - synchro à la connexion (tout le carnet), après chaque choix si connecté, à l'ouverture
    de /jardin et au retour en ligne ; file d'attente dans `lpdc:compte:v1` ;
  - retrouver son jardin : « J’ai déjà un jardin ? Le retrouver » (accueil) et
    `AccountLink` dans les en-têtes (accueil, pages de texte, /saison, carnet) vers
    /connexion, ou l'adresse connectée (tronquée sur mobile) vers `/jardin#compte` ;
    /jardin vide : section « Retrouve ton jardin » en haut (`AccountSection
variant="retrouver"`) ; choix arrivés pendant la visite (synchro, autre onglet, import) :
    fondu groupé (`Garden arriving`) et un seul message « Ton jardin est de retour : N
    choix retrouvés. » ;
  - entretien au plus une fois par jour, déclenché par les appels à l'API (pas de cron dans
    Pages) : comptes inactifs depuis 24 mois supprimés, liens et sessions expirés, compteurs
    de plus de 2 jours ;
  - `wrangler.local.toml` n'a pas de `pages_build_output_dir` et n'est pas nommé
    `wrangler.toml` : Pages ne le lit jamais ; liaisons, variables et secrets restent dans le
    tableau de bord (base liée sous le nom `DB`) ; `wrangler pages dev` reçoit la base par
    `--d1 DB=lpdc-local` ;
  - secrets : `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `HASH_SECRET` ; variable de build
    `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (sans elle : clé de test, avertissement au build) ;
    expéditeur `connexion@lepoidsdeschoses.com` ;
  - /confidentialite (pied de page, formulaire) et mentions légales : un seul cookie, posé
    seulement à la connexion ; Turnstile chargé seulement quand le formulaire sert (CSP :
    `challenges.cloudflare.com` en script et frame).
- Licences : code MIT ; illustrations, icône, image de partage et identité visuelle tous
  droits réservés (`LICENSE`).
