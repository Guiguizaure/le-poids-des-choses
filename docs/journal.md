# Journal de bord

Une entrée datée après chaque session : ce qui a été demandé, ce qui a été proposé,
ce qui a été gardé ou changé.

## 2026-10-03 — Lot 1 : initialisation

**Demandé** : initialiser « Le poids des choses » (Next.js statique, Tailwind, Prettier,
Vitest, thème Figma, page provisoire, arborescence, docs), sans aucune fonctionnalité.

**Proposé / fait** :

- Next.js 16.3.8, React 19, Tailwind 4, TypeScript, App Router, `src/`, pnpm.
- Export statique (`output: 'export'`, images non optimisées).
- Thème Tailwind 4 en CSS (`@theme` dans `globals.css`) : couleurs, polices, tailles.
- Polices via `next/font/google` : Bricolage Grotesque 800, DM Sans 400 et 600.
- Page d'accueil provisoire, `lang="fr"`, `robots: noindex`.
- Prettier + Vitest avec un test d'exemple.
- Arborescence de départ, `docs/svg-conventions.md`, `CLAUDE.md`, `README.md`.

**Gardé / changé** :

- `AGENTS.md` généré par `create-next-app` conservé (avertissement sur la version de Next) ;
  `CLAUDE.md` réécrit et y renvoie.
- Fichiers d'exemple de `public/` supprimés.
- Ajouts avant commit : `.nvmrc` (24), `packageManager` pnpm@11.3.0 (déjà présent),
  `prettier-plugin-tailwindcss`.
- Premier commit sur `main` (accord reçu). Push bloqué : clé d'hôte SSH GitHub inconnue.
- Nouvelle règle : messages de commit conventionnels, travail uniquement sur branches.

## 2026-10-04 — Lot 2 : données et calculs (branche feat/data)

**Demandé** : couche de données et calculs sans interface ; repérage du CSV Impact CO2 ;
garde-fou contre les données fictives.

**Proposé / fait** :

- Types (`Category`, `Gesture`, `JournalEntry`), 21 gestes de test tous `fictive: true`,
  adaptateur de données (`getGestures`, `getGesture`, `getGesturesByCategory`,
  `hasFictiveData`).
- Calculs purs : `emissions`, `compare`, `avoidedKg`, `gardenTotals`, `gardenStage`
  (seuils provisoires 1 / 10 / 50 / 150 / 400 kg), `isAsleep` (21 jours), `formatMass`.
- `scripts/check-data.ts` branché sur `pnpm build` ; n'échoue qu'avec `STRICT_DATA=1`.
- 50 tests Vitest, dont les cas limites et le garde-fou (y compris le script lui-même).

**Gardé / changé** :

- Choix de conception : à égalité, `lighter` vaut `'a'` (écart 0, donc rien d'évité) ; « choix
  léger » = entrée avec `avoidedKg > 0` ; `almostEqual` compare l'écart au plus lourd.
- Ajout de `tsx` pour lancer le script ; `esbuild` refusé dans `pnpm-workspace.yaml`
  (son script d'installation est inutile et bloquait `pnpm install`).
- `vitest.config.ts` renommé en `.mts` (avertissement ESM). `src/lib/calc/example.test.ts`
  (test d'exemple du lot 1) supprimé, remplacé par les vrais tests.
- CSV Impact CO2 : voir le résumé de la session (colonnes, unités, langue).

## 2026-10-04 — Lot 2b : données Impact CO2 (branche feat/data-csv)

**Demandé** : remplacer les valeurs fictives par les données du CSV Impact CO2 (ADEME).

**Proposé / fait** :

- `scripts/build-gestures.ts` (`pnpm build-gestures`, à la main) : télécharge le CSV,
  sélectionne 19 gestes par ID, écrit `src/lib/data/gestures.generated.json`
  (4 chiffres significatifs, date de téléchargement en tête, `sourceId`, `sourceUrl`).
- L'adaptateur lit ce fichier ; `hasFictiveData()` renvoie `false`. Les données fictives ne
  servent plus qu'aux tests. `STRICT_DATA=1 pnpm build` passe désormais.
- Tests : valeurs, unités, catégories, arrondis, marche → ratio `null`, et le script.

**Gardé / changé** :

- Retirés comme demandé : « vêtement d'occasion » et « appel audio » (pas de source).
- Unités confirmées sur les pages impactco2.fr (1 km, 1 repas, 1 jeans, 1 heure de
  streaming ou de visioconférence) : le CSV n'a pas de colonne d'unité.
- Choix à relire : voiture = `voiturethermique` (identique à « Moyenne – Diesel ») ; poisson
  = cabillaud ; pull = laine ; chaussures = sport. Rien d'autre à l'heure dans « Usage
  numérique » : seulement streaming et visioconférence (puis équipements, voir plus bas).
- Vélo mécanique n'est pas à 0 (0,00017 kg/km) ; seule la marche donne `ratio: null`.

**Ajustements après relecture (2026-10-04)** :

- Libellé « Repas au poisson blanc (cabillaud) ».
- Ajout de 3 équipements de la thématique « Numérique », unité `objet` (confirmée sur
  impactco2.fr : « 1 smartphone », « 1 ordinateur portable », « 1 télévision ») : 22 gestes.
- Le numérique mêle donc usages (`heure`) et équipements (`objet`) : l'interface devra
  comparer deux gestes de même unité.

## 2026-10-04 — Lot 2c : occasion et « garder le mien » (branche feat/data-objets)

**Demandé** : ajouter aux objets les modes « d'occasion » et « garder le mien », sans inventer
de valeur.

**Proposé / fait** :

- Repérage du CSV : aucune ligne « occasion », « reconditionné » ou « seconde main ». La
  thématique « Livraison » contient des colis (1, 2, 15, 30 kg) en livraison à domicile,
  point de retrait, magasin et click & collect. Unité vérifiée sur impactco2.fr : « 1 livraison ».
- Modèle : `AcquisitionMode`, `ModeValue` (avec `method`, `sourceId`, `parts`) ; 4 modes sur
  les 7 objets : neuf (CSV), occasion (0, hypothèse), occasion livrée (0 + colis du CSV),
  garder (0).
- `withMode`, `compareModes`, `acquisitionModes` dans `src/lib/calc/modes.ts`.
- `docs/methode.md` (brouillon).

**Gardé / changé** : à relire — livraison à domicile (et non point relais) ; taille du colis
par objet (1 kg vêtements et smartphone, 2 kg chaussures et portable, 15 kg télévision) ;
« occasion » sans livraison séparée de « occasion livrée ».

## 2026-10-04 — Lot 3 : illustrations et premières animations (branche feat/illustrations)

**Demandé** : intégrer 47 SVG provisoires, chaîne de conversion SVG → composants sans id en
double, animations GSAP (arbre, balance, papillon, oiseau, éclat) respectant
prefers-reduced-motion, page /labo, tests.

**Proposé / fait** :

- Zip décompressé dans `public/illustrations` (47 SVG, dont `picto-occasion`, `picto-garder`).
- `src/lib/illustrations/specs.ts` : contrat de chaque fichier (taille, point d'appui,
  calques). `scripts/build-illustrations.ts` (`pnpm illustrations`, lancé aussi par
  `pnpm build`) : id → `data-part`, id référencés gardés et préfixés par instance, attributs
  convertis, vérification du contrat. Composant `<Illustration name title? />`.
- GSAP 3.15 + `@gsap/react` ; `useMotion` (gsap.matchMedia + simulation via
  `MotionProvider`).
- `Arbre` (fondu + montée depuis le pied, balancement, éclat quand il grandit), `Balance`
  (géométrie pure `beamPosition`, rebond élastique), `Papillon`, `Oiseau` (sautille / respire
  endormi), `Eclat`.
- `/labo` (noindex) avec contrôles et la grille des 47 illustrations.
- Vérifié dans Chrome sur l'export statique (`out/` servi temporairement, sans `pnpm dev`) :
  crochet du plateau confondu avec l'extrémité du fléau pendant l'animation, mode réduit qui
  coupe balancement et ailes, éclat centré au sommet du feuillage.

**Gardé / changé** :

- Ajouts au contrat, à valider : extrémités du fléau en 40,40 et 240,40 ; axe du papillon
  x = 32 ; centre de l'éclat 40,50 (déduits des dessins).
- Le rebond élastique de la balance dépasse brièvement les 12° (environ 14°) avant de se
  poser.
- `docs/svg-conventions.md` réécrit pour l'export Figma (remplace les consignes Illustrator).
- Noms de composants en français (`Arbre`, `Balance`…), par cohérence avec les illustrations.

**Ajustement après relecture (2026-10-04)** : composants renommés en anglais pour respecter la
règle « code en anglais » sans exception : `Tree`, `Scale`, `Butterfly`, `Bird`, `Sparkle`
(et `playSparkle`, prop `sparkle` de `Tree`). Le français reste pour les fichiers
d'illustration et les `data-part`. Exception retirée de `CLAUDE.md`. Rebond de la balance
gardé tel quel.

## 2026-10-04 — Lot 3b : animaux, pousse plus visible, coup de vent (branche feat/wind-animals)

**Demandé** : 7 nouveaux SVG (abeille, coccinelle, escargot et hérisson avec versions
endormies, vent), composants animés, pousse plus marquée, coup de vent manuel et automatique,
/labo enrichi.

**Proposé / fait** :

- SVG ajoutés et contrat `specs.ts` complété (54 illustrations) ; points d'appui au centre
  du bas pour les petites bêtes.
- `StagedPlant` commun à `Tree` et au nouveau `Flower` : pousse en 0,7 s avec dépassement
  (`back.out(2)` depuis l'échelle 0,4), éclat ; balancement inchangé (±1,5°).
- Coup de vent : fonctions pures `gustDelay`, `gustDelays`, `gustLean`, `nextGustInterval`
  (testées) ; `playGust`, `useGust`, `useAutoGusts` ; `Wind` (traits qui traversent en
  1,2 s). Feuillage des arbres (et fleurs entières depuis le pied) couché de 6 à 10° ; le
  balancement et l'inclinaison s'additionnent. Papillon et abeille déportés.
- `Bee`, `Ladybug`, `Snail`, `Hedgehog` (versions endormies pour l'escargot et le hérisson).
- /labo : petites bêtes, scène « Coup de vent » avec rangée de plantes, bouton, rafales
  automatiques, bouton pour faire pousser.
- Vérifié dans Chrome sur l'export statique : traits de gauche à droite, plantes couchées
  l'une après l'autre, aucune erreur console. Correctif trouvé à cette occasion : passer en
  mouvement réduit pendant une rafale l'arrête désormais (traits cachés, plantes et insectes
  remis en place).

**Gardé / changé** :

- Les fleurs se couchent entières depuis leur pied (elles n'ont pas de calque `feuillage`).
- Les traits de `vent` sont crème comme le ciel de `scene-paysage` : ils ne se voient que
  sur les collines et le sol.
- `fleur-3-fleurie` : brins verts sur sol vert, seules les baies se voient sur la scène.

**Ajustements après relecture (2026-10-04)** :

- `vent.svg` : traits en encre #1F1A17, épaisseur 3 (mêmes calques) : visibles sur toute la
  scène, ciel compris.
- `fleur-3-pousse` et `fleur-3-fleurie` : brins en soleil #FFC93C (herbes sèches), baies
  inchangées.
- `Ladybug` : la tête pointe dans le sens de la marche (`headingAngle`, fonction pure
  testée) ; demi-tour animé à chaque changement de direction, y compris avant l'envol de
  retour. Déplacement, orientation et dandinement sont sur trois niveaux séparés.
- Contrat `specs.ts` inchangé ; `generated.tsx` régénéré.

**Correctifs d'illustrations (2026-10-04)** :

- 10 SVG remplacés depuis `le-poids-des-choses-illustrations-correctifs.zip` (pousses
  d'arbres, fleurs, vent) ; mêmes tailles et calques, contrat inchangé. Feuilles en sapin
  #1B6B45, baies de la fleur 3 en tomate, vent en encre (épaisseur 2,5 dans le fichier
  fourni). `fleur-3-pousse` était déjà identique à la version précédente.
- Couleur `sapin` (#1B6B45) ajoutée au thème Tailwind et documentée comme réservée aux
  feuilles.
- Orientation de la coccinelle : déjà faite dans le commit précédent (`headingAngle`), rien
  à changer.

## 2026-10-04 — Lot 4 : le jardin et le carnet (branche feat/garden)

**Demandé** : carnet sur l'appareil (localStorage versionné, export/import, repli en
mémoire), modèle pur du jardin, composant `<Garden>`, page /jardin d'après la maquette
« 04 · Mon jardin », simulateur de carnet dans /labo, tests.

**Proposé / fait** :

- Maquette lue avec le connecteur Figma (offre Professional) : mise en page, textes et
  styles repris ; icône de retour téléchargée dans `public/icons/retour.svg`.
- `src/lib/journal` : format `{ version: 1, entries }` sous `lpdc:journal:v1`, validation
  (entrées invalides ignorées et conservées), mécanisme de migration, stockage persistant
  demandé au premier ajout, export JSON et import fusionnant par id, hook `useJournal`
  (`useSyncExternalStore`, carnet partagé entre /jardin et /labo). `JournalEntry` gagne
  `modeA` / `modeB` pour les objets.
- `src/lib/garden` : `buildGarden` (une plante par choix léger, type et emplacement tirés
  de l'id, stade selon les kg, 40 emplacements sur la ligne des collines, plafond qui fait
  grandir les plus anciennes, animaux, endormissement), textes et description accessible.
- `<Garden>` : pousse + éclat à l'arrivée d'une entrée, rafale, message d'arrivée d'un
  animal (annonce `aria-live` séparée de la bulle visuelle), brume quand il s'assoupit,
  rafales automatiques quand il est éveillé.
- /jardin : bilan (`formatMass`), compteurs, 5 dernières entrées et « Tout voir », état vide
  avec lien vers /, boutons Exporter / Importer discrets à la place du bandeau.
- /labo : « Simulateur de carnet » (choix léger petit, moyen, gros ; choix lourd ; vieillir ;
  vider en deux temps) avec un jardin.
- Vérifié dans Chrome sur l'export statique : état vide, jardin rempli, carnet, « Tout
  voir », endormissement et réveil, import (identique, nouveau, illisible).

**Gardé / changé** :

- Fleurs plafonnées à « fleurie » (niveau 1) : les faire « grandir » au-delà ne changeait
  rien à l'écran.
- Tailles revues après essai : arbres 60, fleurs 30 (unités de scène), écart 45 entre
  emplacements, bords dans la scène.
- « Vieillir la dernière entrée » recule tout le carnet : reculer une seule entrée ne
  suffisait pas à assoupir le jardin et la faisait changer de place dans l'ordre.
- Catégorie numérique affichée « Écrans » (absente de la maquette, à valider).
- « Exporter » reste aussi dans la barre du haut, comme sur la maquette (doublon possible
  avec les boutons du bas).

**Ajustements après relecture (2026-10-04)** :

- Catégorie numérique affichée « Numérique », comme dans les maquettes.
- « Exporter » retiré de la barre du haut de /jardin ; restent les boutons du bas.
- Collines extraites automatiquement de `scene-paysage.svg` par `pnpm illustrations`
  (`scripts/scene-geometry.ts` → `src/lib/garden/scene.generated.ts`, avec le haut du sol) ;
  `scene.ts` ne recopie plus rien. Tests : extraction, échec si une colline manque ou n'a
  pas de chemin, fichier généré à jour.
- `gardenStage` et `GARDEN_STAGE_THRESHOLDS_KG` retirés avec leurs tests (remplacés par le
  modèle par plante).
