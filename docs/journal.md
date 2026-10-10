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

## 2026-10-04 — Lot 5 : le parcours de comparaison (branche feat/duel)

**Demandé** : accueil (01 / 07), choix des gestes (02), duel (03), duel objet (03b), résultats
(05a / 05b) d'après les maquettes ; URL partageable ; ajout au carnet ; accessibilité ; tests.

**Proposé / fait** :

- Maquettes lues avec le connecteur Figma ; icône « fermer » téléchargée dans
  `public/icons/fermer.svg`. Les scènes « formes provisoires » sont composées avec nos
  illustrations (paysage, balance avec pictos sur les plateaux, jardin).
- `src/lib/compare` (fonctions pures testées) : gestes de même unité, curseurs (distance en
  échelle logarithmique), inclinaison ∝ log du rapport plafonnée à ×50, phrase de résultat
  (X fois, plus de 100 fois, presque autant, zéro émission, écart en masse), équivalence en
  km de voiture thermique, noms et accords (le / la, plus léger / plus légère, le tien / la
  tienne), lecture et écriture de l'URL, entrées du carnet (gestes et objets avec modes).
- Écrans : accueil avec balance animée (statique en mouvement réduit) ; 02 en deux étapes ;
  03 avec pastille « Mon jardin · X kg évités », curseur, phrase annoncée (`aria-live`) ;
  03b avec options en boutons radio et interrupteur ; 05a / 05b avec le jardin qui réagit.
  Focus déplacé sur le titre à chaque étape.
- `/methode` provisoire (les liens « Comment ça marche ? », « Méthode » et « Comment on
  compte l’occasion ? » y mènent).
- Vérifié dans Chrome sur l'export statique (serveur local qui sert `/comparer` comme
  Cloudflare) : URL partagée qui ouvre le duel, curseur au clavier et URL qui suit, choix
  léger (plante, papillon annoncé), objet (interrupteur, garder), choix lourd, URL invalide,
  filtrage par unité, accueil et 02 en largeur mobile.

**Gardé / changé** :

- Phrases et libellés hors maquette, à relire : titre de l'étape 2 « Avec quoi le
  comparer ? », sous-titre « Se déplacer · à comparer avec le TGV », note « Ensuite,
  pose-les sur la balance. », message d'URL invalide, phrases des objets.
- Pastille « Mon jardin » sans montant tant que rien n'est évité (au lieu de « 0 g »).
- Pas du curseur de distance : 1 % de la course (sinon les flèches ne bougeaient pas la
  valeur aux petites distances).

**Ajustements après relecture (2026-10-04)** :

- Objets : « aucune nouvelle fabrication » remplace « zéro émission » pour « garder » et
  « d’occasion sans colis » (hypothèse de méthode : entretien et fin de vie non comptés) ;
  « zéro émission » reste réservé à la marche.
- Avion : libellé « Avion », précision « trajet court » (nouveau champ `detail` des gestes,
  réglé dans `scripts/build-gestures.ts`, données régénérées), affichée sous le libellé dans
  les cartes des écrans 02 et 03.
- Gardés : pastille sur le 03b, textes ajoutés de l'étape 2.

## 2026-10-04 — Lot 5b : retours de test (branche feat/feedback-1)

**Demandé** : scène plus vivante, numérique recentré sur les appareils, choix des deux gestes
sur un seul écran, prochain animal en silhouette, nouvelles comparaisons « Boire » et « Se
faire livrer » si le CSV le permet.

**Proposé / fait** :

- `Landscape` : nuages qui traversent la scène (72, 86 s ; boucle sans saut,
  `cloudDrift`), halo du soleil qui respire (6 s) ; rafales automatiques toutes les 25 à
  45 s. Tout s'arrête en mouvement réduit (vérifié dans le labo) et dans le jardin assoupi.
- Numérique : streaming et visioconférence retirés ; ne restent que les appareils (Neuf /
  D'occasion / Je garde le mien). Unité heure et curseur de durée supprimés.
- Choix des gestes sur un seul écran : `toggleGesture` / `isSelectable` (fonctions pures
  testées), badges « 1 » et « 2 », gestes d'une autre unité grisés, retoucher pour retirer,
  bouton « Comparer », état annoncé (zone `aria-live`), boutons à bascule (`aria-pressed`).
- Jardin : prochain animal en silhouette (encre, 16 % d'opacité, immobile) et « Encore N
  choix légers avant l’arrivée de … » ; rien quand tous sont là.
- CSV : thématique Boisson (9 boissons, par litre) et Livraison (5 façons de recevoir un
  colis d'1 kg, par livraison ou achat). Unités confirmées sur impactco2.fr. Nouvelles
  unités `litre` et `achat`. 14 pictos à fournir (`docs/illustrations-a-fournir.md`),
  `picto-generique` en attendant.
- Vérifié dans Chrome sur l'export statique : choix sur un seul écran (sélection,
  désélection, grisé, Comparer), duels « Boire » et « Se faire livrer », ancien lien
  streaming qui ramène proprement au choix, numérique vers les trois options, silhouette et
  message du jardin, ciel animé puis figé en mouvement réduit.

**Gardé / changé** :

- Pastille « Mon jardin » sans montant tant que rien n'est évité (correctif oublié au lot 5).
- Libellés des livraisons : « En magasin à pied / en voiture », « Point relais à pied / en
  voiture », précision du trajet en voiture et du colis d'1 kg en ligne secondaire.

**Ajustements après relecture (2026-10-04)** :

- 14 pictos « Boire » et « Se faire livrer » intégrés depuis
  `le-poids-des-choses-pictos-boire-livrer.zip` (64×64, `fond` et `objet`) ; contrat à 68
  illustrations, `PENDING_PICTOS` vidé, `docs/illustrations-a-fournir.md` vidé ; test :
  plus aucun geste sur `picto-generique` (vérifié aussi dans Chrome).
- Objets : libellés courts dans les cartes (« Smartphone », « Jean »…). Les titres du carnet
  tirent désormais l'accord de `objectNoun` (« Télévision gardée plutôt que neuve »).
- Pas de Click & Collect.

## 2026-10-04 — Lot 5c : retours de test (branche feat/feedback-2)

**Demandé** : message du prochain animal seulement sur /jardin, plus de silhouettes,
petites bêtes plus lisibles, oiseau au sol (V1), halo du soleil visible.

**Proposé / fait** :

- « Encore N choix légers… » : affiché seulement sur /jardin sous la scène ; retiré du
  composant `Garden` (donc de 05a / 05b et du labo). Silhouettes supprimées (code, styles,
  test, `animalIllustration`).
- Contour encre 1,5 (`non-scaling-stroke`) sur papillon (lobes des ailes), coccinelle
  (élytres), escargot et escargot endormi (corps, coquille) ; calques et tailles inchangés.
- Places : papillon (100, 84) et abeille (205, 76) dans la bande de ciel, au-dessus du plus
  haut cadre d'arbre (y ≈ 105) ; coccinelle, escargot, hérisson au sol ; oiseau posé sur la
  colline verte (x = 372, hauteur tirée de la ligne de la colline), sautille et picore.
  Tests : volants au-dessus des feuillages, autres au sol, oiseau sur la colline verte.
- Halo : il était invisible partout car c'était un `div` placé derrière le SVG, dont le
  calque `ciel` est opaque (ma vérification précédente ne lisait que l'opacité calculée).
  Corrigé par un calque `halo-soleil` ajouté à `scene-paysage.svg` (anneau #FFC93C, r = 50,
  derrière le disque, opacité 0 par défaut), animé de 0,35 à 0,6 et de 1 à 1,12 sur 6 s.
- Vérifié dans Chrome : jardin avec arbre jaune, papillon cerné dans le ciel, coccinelle,
  oiseau sur la colline verte, halo visible sur /jardin, l'accueil et 05a ; pas de message
  sur 05a.

**Gardé / changé** :

- Escargot endormi cerné aussi, par cohérence avec l'escargot éveillé.
- Note V1.1 dans CLAUDE.md : envol de l'oiseau.

## 2026-10-04 — Lot 6 : pages et finitions (branche feat/pages)

**Demandé** : pages Méthode et Mentions légales, 404 illustrée, pied de page, installation
(PWA), images de partage, lancement préparé (SITE_LAUNCHED).

**Proposé / fait** :

- /methode d'après la maquette 06 et `docs/methode.md` : sources (Impact CO2, ADEME, Base
  Carbone, Agribalyse, liens vers impactco2.fr et le CSV), date des données (lue dans le
  fichier généré), unités, hypothèses (ancre `#occasion` pour « Comment on compte
  l’occasion ? »), ce qui n'est pas compté, limites, « Et ton jardin ? », « Comment ce site
  est fait » (dépôt GitHub public vérifié). Emplacement `DATA_LICENSE` dans le code.
- /mentions-legales : éditeur avec emplacements surlignés, hébergeur Cloudflare, Inc.
  (101 Townsend St, San Francisco, CA 94107, vérifié sur cloudflare.com), confidentialité.
  `STRICT_DATA=1 pnpm build` échoue tant que les emplacements ne sont pas remplis (vérifié,
  code 1) ; `pnpm build` passe (code 0).
- 404 : le jardin dans la brume, l'oiseau endormi devant ; lien vers l'accueil.
- Pied de page commun ; métadonnées par page (titre, description, Open Graph, Twitter).
- PWA : manifeste, icônes générées depuis `assets/icon/icon.svg` (balance sur fond
  crème), favicon, bandeau « Garde ton jardin » (Android / iPhone / masqué). Vérifié dans
  Chrome : invite d'installation, fermeture mémorisée.
- Image de partage 1200×630 générée au build (resvg, polices OFL dans `assets/fonts`).
- `SITE_LAUNCHED=1` : vérifié (robots ouvert sauf /labo, sitemap des 5 pages publiques,
  index, follow) ; sans elle, noindex, robots fermé, sitemap vide.

**Gardé / changé** :

- Maquette 06 : « récupérées via l’API Impact CO2 » remplacé par « publiées par Impact
  CO2 » + lien vers le fichier public : le site lit le CSV, pas l'API.
- Adresse du site par défaut `https://le-poids-des-choses.pages.dev` (à confirmer, ou
  `SITE_URL`).
- Cloudflare Web Analytics annoncé dans les mentions légales : à activer dans le tableau de
  bord Cloudflare Pages au lancement (aucun script ajouté au code).

## 2026-10-04 — Lot 7 : qualité avant lancement (branche feat/quality)

**Demandé** : Lighthouse ≥ 95 partout, axe et contraste, focus, clavier, tests de bout en
bout (Chromium et WebKit), CI, en-têtes de sécurité et de cache, README final, licences.

**Proposé / fait** :

- Lighthouse mobile (`pnpm lighthouse`, build `SITE_LAUNCHED=1`), avant → après :

  | Page              | Performance             | Accessibilité | Bonnes pratiques | SEO       |
  | ----------------- | ----------------------- | ------------- | ---------------- | --------- |
  | Accueil           | 93 → 97-100             | 100 → 100     | 100 → 100        | 100 → 100 |
  | Duel (TGV, avion) | 93 → 94-95 (médiane 95) | 100 → 100     | 100 → 100        | 100 → 100 |
  | Mon jardin        | 93 → 94-96 (médiane 95) | 100 → 100     | 100 → 100        | 100 → 100 |
  | Méthode           | 100 → 99-100            | 100 → 100     | 100 → 100        | 100 → 100 |

  Corrections : la 404 racine (embarquée dans toutes les pages) chargeait GSAP et les
  scènes animées → rendue statique, sans composant client (-134 Ko de JS sur les pages de
  texte) ; écran de résultat chargé à la demande ; repli à hauteur d'écran sur /comparer
  (CLS 0,022 → 0) ; animations d'ambiance et rebond d'arrivée de la balance démarrés après
  le premier affichage. Polices : déjà en sous-ensemble latin et préchargées.

- Accessibilité : axe (WCAG 2.1 AA) sans violation sur 11 écrans ; test de contraste de
  toutes les paires du thème, qui a révélé les badges « 1 / 2 » crème sur tomate (2,98) →
  encre sur tomate (5,26) ; focus visible vérifié au clavier ; parcours complet au clavier.
- Bout en bout (Playwright, Chromium et WebKit) : comparaison jusqu'au jardin, URL partagée
  et invalide, objet avec ses trois options, export puis import, 404, bandeau iPhone,
  en-têtes. 47 tests, toute erreur de console (CSP comprise) fait échouer.
- CI GitHub Actions, `public/_headers`, README final avec captures, `LICENSE` (MIT pour le
  code, illustrations et identité visuelle tous droits réservés).

**Gardé / changé** :

- CSP : `upgrade-insecure-requests` retiré (inutile sur Cloudflare Pages, toutes les URL
  sont relatives, et il cassait WebKit en http local). `'unsafe-inline'` nécessaire aux
  scripts que Next insère dans chaque page de l'export.
- Duel et jardin restent au seuil de 95 : leur contenu dépend de l'URL ou du carnet, lus
  côté client dans un export statique ; le socle React/Next représente l'essentiel du JS.

## 2026-10-04 — Lot 5d : révélation et micro-interactions (branche feat/reveal)

**Demandé** : carte de révélation après un choix (maquettes 05a v2 et 05b v2), arrivée dans
le jardin par `?nouveau=`, micro-interactions discrètes, sans régression Lighthouse.

**Proposé / fait** :

- `revealForEntry` (pure, testée) : la plante exacte qu'un choix fait pousser, ou fait
  grandir quand le jardin est plein, et l'animal débloqué ; textes « Une fleur va pousser
  dans ton jardin », « Et un papillon arrive ! » (accords).
- Carte de révélation : posée comme un papier (descente, légère rotation, petit rebond),
  vitrine (bout de colline, plante qui pousse avec l'éclat, animal qui entre en volant ou en
  marchant) ; choix lourd : balance qui oscille puis se stabilise. Focus sur le titre de la
  carte, arrivée de l'animal annoncée (`aria-live`).
- `/jardin?nouveau=<id>` : scène sans le choix, puis plante, rafale, animal par le bord,
  message, URL nettoyée. Sans paramètre, rien ne change.
- Micro-interactions en CSS (aucune bibliothèque) et compteur du total évité en GSAP.
- Vérifié dans Chrome : carte, éclat, papillon, arrivée au jardin, URL nettoyée, compteur ;
  choix lourd avec focus sur « C’est noté ».
- Lighthouse (5 passages, build `SITE_LAUNCHED=1`) : Accueil 97-100, Duel 95, Jardin
  94-96, Méthode 98-100 ; accessibilité, bonnes pratiques et SEO à 100.

**Gardé / changé** :

- L'apparition des pages partait d'une opacité nulle : le duel tombait à 92-93 (LCP
  retardé) ; elle part maintenant de 0,35.
- Le test axe attend la fin des apparitions : sinon, un texte en plein fondu faisait
  échouer le contraste de temps en temps.
- La légende « Animation : … » des maquettes est une note de conception, non affichée.

## 2026-10-04 — Lot 5d, ajustement : la plante à l'échelle de la vitrine (branche feat/reveal)

**Demandé** : dans la vitrine de la carte de révélation, mettre la plante à l'échelle pour
qu'elle occupe la hauteur de la vitrine quel que soit son stade (une pousse est donc
agrandie ; dans le jardin, elle garde sa vraie taille). Titre selon le stade : « Une petite
pousse va sortir de terre » pour une pousse, « Une fleur va pousser… » et « Un arbre va
pousser… » sinon, « … va grandir… » quand le jardin est plein.

**Proposé / fait** :

- `pnpm illustrations` calcule l'emprise réelle du dessin de chaque arbre et de chaque fleur
  (rectangles, cercles, ellipses, chemins échantillonnés, plus la moitié du trait) dans
  `src/lib/illustrations/bounds.generated.ts` ; les courbes quadratiques (Q) sont prises en
  charge. Un test échoue si le fichier n'est pas à jour.
- `vitrineFit` (pure, testée sur les 15 dessins) : pied au sommet de la colline, hauteur du
  dessin 130 sur 190, largeur bornée à 120 pour laisser passer l'animal. Une pousse d'arbre
  est agrandie environ 3 fois, une pousse de fleur 4 à 5 fois ; un grand arbre garde à peu
  près sa taille.
- `zoom` sur `Tree` / `Flower` : l'éclat garde sa taille habituelle sur une plante agrandie.
  Le jardin ne passe pas de `zoom` : rien n'y change.
- `revealTitle` selon le stade et le jardin plein (« Une fleur va grandir… » remplace « Une
  fleur va s’épanouir… »).
- Test de parcours : un petit choix (vélo plutôt que voiture sur 2 km) affiche la petite
  pousse, plus haute que 80 px dans la vitrine.
- Vérifié sur l'export statique (captures Playwright, Pixel 7) : pousses, fleurs fleuries et
  grands arbres occupent tous la hauteur de la vitrine.

**Gardé / changé** :

- Les traits grossissent avec la pousse agrandie (épaisseur proportionnelle) : c'est le
  dessin agrandi, sans retouche.
- Dans Chrome, l'onglet piloté était ralenti (la carte encore en train de tomber après 3 s) :
  vérification visuelle faite avec Playwright ; le choix noté dans Chrome a été effacé.

## 2026-10-04 — Lot 5d, derniers ajustements : trait constant, dates du journal (branche feat/reveal)

**Demandé** : dans la vitrine, garder l'épaisseur des traits constante quand la plante est
agrandie, pour que la pousse ait le même trait que dans le jardin ; corriger les dates des
entrées des lots 7 et 5d (2026-10-04 et non 2026-10-05).

**Proposé / fait** :

- `vitrineFit` renvoie `strokeScale` : le facteur qui ramène chaque trait du SVG à son
  épaisseur dans le jardin. Le jardin dessine le cadre d'une plante à `PLANT_FRAME_WIDTH`
  unités de scène (60 pour un arbre de 120, 30 pour une fleur de 60), soit à moitié : un
  trait de 4 y fait 2 unités. `StagedPlant` l'applique aux éléments qui ont un
  `stroke-width` (les tiges), seule la forme est agrandie.
- Préféré à `vector-effect: non-scaling-stroke`, qui fixerait le trait en pixels d'écran
  (4 px) au lieu de suivre l'échelle du jardin (environ 2 px sur téléphone).
- L'emprise générée sépare la forme et le trait (`stroke`, plus grande demi-épaisseur), pour
  que la plante occupe toujours la hauteur de la vitrine sans dépasser.
- Tests : `strokeScale × zoom` vaut l'échelle du jardin pour les 15 dessins ; parcours d'un
  petit choix : le trait de la pousse mesuré à l'écran dans la vitrine puis dans le jardin
  diffère de moins de 0,5 px (avant : 3 à 4 px de plus dans la vitrine).
- Dates des entrées des lots 7 et 5d corrigées.
- Vérifié sur l'export statique (captures Playwright, Pixel 7) : pousses et fleurs ont des
  tiges fines comme dans le jardin.

**Gardé / changé** :

- Les dates des lots 5, 5b, 5c et 6 portent aussi 2026-10-05 : laissées telles quelles en
  attendant confirmation.

## 2026-10-04 — Lot 5d, dates du journal (branche feat/reveal)

**Demandé** : corriger aussi les dates des lots 5, 5b, 5c et 6, puis vérifier tout le journal
avec la règle : lot 1 le 2026-10-03, tous les autres lots et ajustements (2, 2b, 2c, 3, 3b,
4, 5, 5b, 5c, 5d, 6, 7) le 2026-10-04.

**Proposé / fait** :

- Entrées des lots 5, 5b, 5c et 6, et notes « Ajustements après relecture » des lots 5 et
  5b, ramenées au 2026-10-04.
- Vérification par script de chaque titre d'entrée et de chaque note datée : les 13 lots
  sont présents, toutes les dates suivent la règle. Les mentions de 2026-10-05 qui restent
  décrivent l'erreur corrigée, ce ne sont pas des dates d'entrée.

**Gardé / changé** :

- Les dates des tests (`compare.test.ts`, `journal.test.ts`, `display.test.ts`) et de
  téléchargement du CSV ne sont pas des dates de session : inchangées.

## 2026-10-04 — Lot final avant lancement (branche fix/launch)

**Demandé** : retirer l'éclat de la vitrine de la carte de révélation (la pousse de la plante
et l'arrivée de l'animal suffisent) en le gardant dans le jardin ; remplir les mentions
légales et vérifier que `STRICT_DATA=1 pnpm build` passe.

**Proposé / fait** :

- Vitrine : `sparkle={false}` sur la plante. Le jardin garde l'éclat quand la plante pousse
  à sa place (`/jardin?nouveau=…`).
- La prop `zoom` de `StagedPlant`, `Tree` et `Flower` ne servait qu'à garder l'éclat de la
  vitrine à sa taille habituelle : retirée. `vitrineFit` garde son `zoom` pour placer la
  plante ; `strokeScale` reste (trait du jardin).
- L'éclat d'une plante porte `data-sparkle` ; le test de parcours d'un petit choix vérifie
  qu'il n'y en a aucun dans la vitrine et qu'il apparaît dans le jardin.
- `src/lib/legal.ts` rempli (nom, SIRET, adresse, e-mail). `STRICT_DATA=1 pnpm build` passe
  (« Données : aucune valeur fictive. », « Mentions légales : complètes. ») ; le test du
  garde-fou attend maintenant un succès en mode strict.

**Gardé / changé** :

- Adresse reprise telle que donnée : « 193 impasse d’azur, 83140, Six-Fours-Les-Plages ».

## 2026-10-04 — Lot V2-1 : briques V1.1 (branche feat/v1-1)

**Demandé** : retirer l'éclat de la vitrine s'il est encore sur main ; envol de l'oiseau ;
fruits et légumes de saison (vérifier d'abord la source et la montrer avant de coder
l'interface) ; « Le savais-tu ? » avec des faits calculés depuis nos données ;
vérifications complètes, captures, journal, push de feat/v1-1.

**Proposé / fait** :

- Éclat : fix/launch n'était pas fusionnée, main avait encore l'éclat dans la vitrine.
  Même changement repris sur feat/v1-1 (fichiers identiques à fix/launch, sans les mentions
  légales), pour que les deux fusions ne se contredisent pas.
- Envol de l'oiseau : `oiseau-vol.svg` (archive dézippée telle quelle), spec,
  `pnpm illustrations` (69 illustrations). Trajet pur et testé
  (`src/lib/geometry/flight.ts`) : décollage vers la gauche sous le soleil, boucle dans la
  bande de ciel (y ≤ 105, comme le papillon et l'abeille), retour exact à sa place ; jamais
  devant le soleil, halo compris (rayon 56), ni hors scène. Ailes en scaleY de 1 à -0,6
  autour de (28, 30), en décalé. Envols spontanés toutes les 40 à 90 s (graine tirée une
  fois par session dans `sessionStorage`, délais reproductibles), onglet visible seulement.
  Bouton « Faire s’envoler l’oiseau » posé sur lui, hors de la scène (`role="img"`
  masquerait un bouton intérieur), focus visible, sans effet pendant le vol. Ni bouton ni
  envol quand le jardin dort ou en mouvement réduit. Démo dans /labo (carnet en mémoire).
- « Le savais-tu ? » : 10 gabarits (`src/lib/facts`). Seule la prémisse est rédigée (« un
  jean neuf », « un repas ») ; la valeur vient des données via `src/lib/calc`, arrondie
  lisiblement. Chaque fait renvoie à la fiche Impact CO2 du geste source et à
  `/methode#savais-tu` (nouvelle section). Choix sans hasard : graine du jour sur les
  duels (en préférant un fait sur les gestes comparés), dernier choix noté sur /jardin.
  Carte discrète sous les boutons du duel et du duel objet, et sur /jardin. Un gabarit sur
  un geste disparu fait échouer `check-data`, donc `pnpm build` (vérifié en renommant un
  geste, puis remis).
- Fruits et légumes de saison : source vérifiée, interface non codée (voir plus bas).
- Vérifications : lint, typecheck, 423 tests unitaires, 68 tests de bout en bout
  (Chromium et WebKit, axe compris, dont le jardin avec l'oiseau), Lighthouse mobile
  (3 passages, `SITE_LAUNCHED=1`) : Accueil 97-100, Comparer 95-96, Duel 95, Jardin 94-96,
  Méthode 98-100 ; accessibilité, bonnes pratiques et SEO à 100. `STRICT_DATA=1 pnpm
build` : seule l'erreur des mentions légales (attendue). Captures : duel avec « Le
  savais-tu ? », jardin avec l'oiseau en vol au milieu de sa boucle.

**Source « Fruits et légumes de saison » (vérifiée le 2026-10-04)** :

- API publique `https://impactco2.fr/api/v1/fruitsetlegumes?month=1…12` : par produit,
  `name`, `slug`, `months` (mois de saison), `ecv` (kg CO2e par kg, confirmé sur la fiche :
  « 408 g CO₂e par kg » pour la pomme), `category` (fruits, légumes, herbes, fruits à
  coque, pommes de terre et tubercules, pâtes riz et céréales). Sans `month`, seul le mois
  courant est renvoyé : il faut interroger les 12 mois. Union : 76 produits, cohérente
  (chaque produit est renvoyé pour chacun de ses mois), valeurs identiques aux 76 lignes
  « Fruits et légumes » du CSV public (qui, lui, n'a pas les mois). Source affichée :
  Agribalyse 3.2, mise à jour le 15/01/2025.
- Sans clé, l'API répond avec un avertissement : l'accès anonyme peut être coupé ; une clé
  gratuite s'obtient auprès de l'équipe Impact CO2.
- Licence : aucune licence ouverte affichée pour l'API ni le CSV. Les mentions légales
  d'impactco2.fr autorisent la réutilisation non commerciale et pédagogique avec mention
  de l'ADEME, et demandent une licence pour un usage commercial ou promotionnel (même
  gratuit pour des tiers). Le code du site Impact CO2 est sous MIT.
- Origine : la donnée ne donne pas la provenance, sauf deux lignes qui la portent dans le
  nom (« Mangue (importée par avion) », « Mangue (importée par bateau) »).

**Gardé / changé** :

- Fruits et légumes de saison : arrêt avant le script et l'interface, en attente de tes
  décisions (clé d'API, licence, mangues) ; donc pas de /saison, ni de Lighthouse, de
  capture ou de test e2e de /saison dans ce lot.
- Le libellé du bouton prend l'apostrophe typographique du site : « Faire s’envoler
  l’oiseau ».
- `oiseau-vol.svg` a un trait encre de 1,5 sur l'aile avant, sans
  `vector-effect="non-scaling-stroke"` (contrairement au papillon) : gardé tel que livré.
- « 27 000 km » se coupait en fin de ligne sur la capture : espace insécable ajouté.

## 2026-10-04 — Lot V2-1, suite : fruits et légumes de saison (branche feat/v1-1)

**Demandé** : décisions sur la source des fruits et légumes de saison (pas de clé d'API
pour l'instant, licence en cours auprès de l'ADEME, mangues gardées, toutes les catégories
de l'API), contour de l'aile avant d'oiseau-vol ; puis le point 2 du lot (script, /saison,
encarts, /methode#saison, tests) et toutes les vérifications.

**Règle ajoutée** : pas de `SITE_LAUNCHED=1` tant que l'ADEME n'a pas confirmé les
conditions de réutilisation des données Impact CO2. `DATA_LICENSE` reste à null. (Aussi
dans CLAUDE.md.)

**Proposé / fait** :

- Accès anonyme vérifié avant de commencer : l'API répond (HTTP 200, avec l'avertissement).
- `pnpm build-saison` : les 12 mois de l'API, sans clé ; `IMPACTCO2_API_KEY` lue dans
  `.env.local` seulement si elle existe (envoyée en `Authorization: Bearer`, jamais écrite
  ni affichée). Fiches des produits depuis la colonne URL du CSV public. Échoue sans rien
  écrire si l'API refuse l'accès (401, 403), si une catégorie inconnue apparaît, si une
  valeur est invalide ou si les mois sont incohérents. 76 produits, aucune donnée fictive ;
  la garde `STRICT_DATA` couvre aussi ces produits. Fichier généré ignoré par Prettier.
- Catégories : celles de l'API, dans l'ordre de ses ids, intitulé = nom de l'API avec une
  majuscule (« Pommes de terre et autres tubercules »…), aucune inventée.
- /saison « De saison en octobre » : tous les produits du mois, regroupés par catégorie,
  du plus léger au plus lourd au kg, puce et barre de la couleur de la catégorie ; mois dans
  l'URL (`?mois=10`, sinon le mois courant) avec un sélecteur, retour arrière compris ;
  lien vers l'outil Impact CO2. Les deux mangues restent telles quelles. Ajoutée au sitemap
  (rempli seulement au lancement).
- Encart « Ce mois-ci, c’est la saison de… » sur l'accueil et /comparer : les 3 produits
  les plus légers au kg parmi ceux qui ont une saison (complétés au besoin par ceux de
  toute l'année), place réservée pour que rien ne bouge.
- /methode#saison : la donnée ne précise pas l’origine des produits, sauf pour la mangue,
  où elle distingue l’import par avion et l’import par bateau.
- Crédit `DataCredit` : « Données : Impact CO2 – ADEME » (lien) et date de téléchargement,
  sur le duel, le duel objet, la carte de révélation (légère ou lourde), /saison et
  /methode (#sources et #saison). Testé de bout en bout.
- « Le savais-tu ? » : gabarit des deux mangues (« … émet 16 fois plus … »), rapport
  calculé par `compare()` depuis les deux lignes des données ; `emissions()` et `compare()`
  acceptent désormais tout ce qui a une valeur unitaire. Un produit disparu fait échouer le
  build, comme un geste.
- Aile avant d'oiseau-vol : `vector-effect="non-scaling-stroke"`, comme le papillon.
- Vérifications : lint, typecheck, 444 tests unitaires, 86 tests de bout en bout (Chromium
  et WebKit, axe compris, /saison et /saison?mois=5 inclus). Lighthouse mobile, 3 passages
  sur le build normal (noindex) : Accueil 97-100, Comparer 95-96, Duel 94-95, Jardin
  94-95, De saison 97, Méthode 98-100 ; accessibilité et bonnes pratiques à 100 ; SEO 66-69,
  uniquement `is-crawlable` (le noindex). `STRICT_DATA=1 pnpm build` : seule l'erreur des
  mentions légales. Captures : /saison (octobre) et /methode#saison.

**Gardé / changé** :

- Lighthouse mesuré sans `SITE_LAUNCHED=1`, pour respecter la nouvelle règle à la lettre
  (le lot précédent l'avait fait sur un build local) : le SEO reste bas jusqu'au lancement.
- Le gabarit des mangues porte à 11 le nombre de faits (10 sur les gestes, 1 sur les
  produits de saison) ; le test l'écrit ainsi.
- Deux échecs ponctuels sous la charge de la suite complète, non reproduits isolément :
  une erreur de console sur l'accueil (WebKit, 1 fois, message non conservé) et l'éclat du
  jardin manqué par `toBeVisible` (WebKit) ; ce dernier test guette désormais l'éclat à
  chaque image. Les deux suites complètes suivantes : 86/86.
- « 1 kg » se coupait en fin de ligne sur /saison : espace insécable.

## 2026-10-05 — Lot V2-1, fusion de main et dernières retouches (branche feat/v1-1)

**Demandé** : ramener main (fix/launch fusionnée) dans feat/v1-1 par fusion, en gardant
les deux côtés des conflits ; afficher les deux dates des données de saison ; joindre le
texte complet de toute erreur console au rapport Playwright ; relancer toutes les
vérifications (`STRICT_DATA=1 pnpm build` doit passer).

**Proposé / fait** :

- Fusion de main (sans rebase). Conflits : CLAUDE.md (mentions légales remplies et garde-fou
  des faits, plus la règle ADEME), journal (entrée fix/launch remise avant les entrées V2-1,
  ordre chronologique), `e2e/journeys.spec.ts` (même vérification de l'éclat des deux
  côtés : gardée dans sa version image par image, `toBeVisible` l'avait manquée une fois).
- Données de saison : « Données Agribalyse 3.2 (mise à jour du 15/01/2025), récupérées le
  4 octobre 2026 » sur /saison et /methode#saison. `SAISON_BASE` (src/lib/saison/index.ts)
  cite la page lue le 2026-10-05 (https://impactco2.fr/outils/fruitsetlegumes et les
  fiches produits) ; `pnpm build-saison` rappelle de la relire.
- Rapport Playwright : chaque erreur console (texte, emplacement, page, pile d'une
  exception) est jointe au test (`erreurs-console.txt`), même tolérée ; vérifié sur le test
  de la 404. Rapport HTML activé et conservé en CI à chaque passage.
- Vérifications : lint, typecheck, 444 tests unitaires, 2 suites de bout en bout complètes
  (86/86, Chromium et WebKit, axe compris), `pnpm build` et `STRICT_DATA=1 pnpm build`
  passent (« Mentions légales : complètes »). Lighthouse mobile, 3 passages sur le build
  normal (noindex) : Accueil 97-100, Comparer 95-96, Duel 94, Jardin 92-95, De saison 97,
  Méthode 97-100 ; accessibilité et bonnes pratiques à 100 ; SEO 66-69 (noindex). Captures
  mises à jour.

**Gardé / changé** :

- L'erreur console WebKit de l'accueil n'est pas revenue sur ces deux suites ; si elle
  revient, son texte complet sera dans le rapport.

## 2026-10-05 — Lot V2-4, point 0 : formulation honnête (branche feat/journal-partage)

**Demandé** : le site ne peut pas affirmer que des kg ont été « évités » : lister toutes
les occurrences (« évité », « économisé », « sauvé »…), proposer une reformulation sur
l'écart avec l'autre option, l'appliquer partout et l'expliquer dans /methode ; s'arrêter
là pour validation avant la suite du lot.

**Proposé / fait** :

- Inventaire (UI, méta, OG, docs, code, tests) : 39 occurrences de « évité(s) » / « évite »,
  aucune de « économisé », « sauvé », « épargné » ou « gagné » au sens des kg. L'image de
  partage (OG) et le manifeste ne disaient « évités » que via `SITE_DESCRIPTION`.
- Reformulation appliquée : « X kg de CO2e d’écart avec les autres options » (bilan de
  /jardin), « Mon jardin · X kg d’écart » (pastille), « +X kg d’écart » (carte de
  révélation), « Ton jardin grandit chaque fois que tu choisis la plus légère » (accueil),
  descriptions du site et de /jardin, deux faits « Le savais-tu ? » (« c’est X de CO2e
  d’écart »), labo, README, CLAUDE.md (avec la règle d'écriture), commentaires et titres de
  tests.
- /methode#ecart : « Le site ne mesure pas des kilos évités ou économisés : il compte l’écart
  entre l’option que tu choisis et l’autre option comparée, sans savoir ce que tu aurais
  fait sans lui. »
- Vérifications : lint, typecheck, 444 tests unitaires, 86 tests de bout en bout ; captures
  du duel et du jardin refaites.

**Gardé / changé** :

- Gardé : « soit X de CO2e en moins » dans la phrase du duel (comparaison explicite avec
  l'autre option), le nom du champ `avoidedKg` (carnets et exports existants ; commentaire
  précisé), les anciennes entrées du journal (historique).
- En attente : le libellé « Fabrication évitée (hypothèse) » des données générées (non
  affiché sur le site) ; le changer demande de relancer `pnpm build-gestures`.
- Écart avec la maquette Figma 03, qui écrivait « X kg évités » dans la pastille.

## 2026-10-05 — Lot V2-4 : carnet analysé, paliers, ciels, partage (branche feat/journal-partage)

**Demandé** : points 1 à 5 du lot V2-4 après validation du point 0 ; décisions : libellé
« Pas de nouvelle fabrication (hypothèse) » avec données regénérées, « en moins » gardé dans
la phrase du duel, Figma déjà à jour, carte de révélation sans « + ».

**Fait et commité** :

- Libellé des données : seuls ce libellé (7 objets) et la date de téléchargement changent
  (date acceptée : « téléchargées le 5 octobre 2026 »). Carte de révélation : « X kg
  d’écart ».
- Point 1 : `src/lib/journal/analysis.ts` (tri date, écart, catégorie ; filtres catégorie
  et choix légers ou notés ; vue dans l'URL ; choix légers par jour sur 7 jours), page
  /jardin/carnet (« Tout voir »), graphique de la semaine en barres SVG avec tableau masqué
  et état vide, aussi dans la section Carnet de /jardin. Tests unitaires et e2e.
- Point 2 : paliers 10, 50, 100, 250, 500, 1000 kg CO2e (`src/lib/milestones`), carte
  « Palier franchi » sur /jardin quand le dernier choix léger en franchit un, équivalence
  calculée (70 km en voiture thermique, 10 repas au bœuf, 16 T-shirts en coton neufs,
  10 jeans neufs, 2 200 km en avion, 7 000 km en voiture), garde-fou du build. Tests.
- Point 3 : ciels Jour, Aube rose (15), Midi soleil (30), Nuit encre (50) ; pas de ciel
  outremer (la colline du fond est outremer) ; choix sur /jardin gardé sous `lpdc:ciel:v1` ;
  démo /labo. Tests.
- Point 4, partie pure : maquettes Figma lues (41:60, 41:183, 42:60, 42:233) ;
  `src/lib/share/card.ts` (description de dessin 1080×1350 : en-tête, pastilles accordées,
  jardin à y = 360, bandeau encre, variante endormie) et `src/lib/share/garden-svg.ts`
  (même jardin que `<Garden>`, ciel appliqué, brume, contours des petites bêtes à
  l'échelle) ; `animalIllustration` dans le modèle. Tests unitaires sans navigateur.

**Reprise après la mise en veille du Mac** : état écrit ici et travail fini commité
(composition de la carte), puis suite du point 4.

- Point 4, partie navigateur : `public/icons/partager.svg` (icône de la maquette 09a),
  `src/components/garden/share/` : `renderShareCard.ts` (canvas 1080×1350, polices attendues
  avec document.fonts, PNG), `useShareSupport.ts` (canShare avec un PNG ET pointeur tactile
  ou appli installée), `ShareSheet.tsx` (feuille 09b : aperçu, confidentialité, « Partager
  l’image », « Annuler », `<dialog>` modal, focus piégé, Échap, retour du focus, AbortError
  sans effet, autre erreur : message discret). Barre du haut de /jardin : « Exporter » et
  « Partager » sur mobile seulement ; domaine de la carte dérivé de `SITE_URL` (passé par
  la page). Titre de la carte réduit s'il déborde : « Mon jardin se repose » dépassait à
  104 px (police plus large dans le navigateur que dans Figma).
- Images générées dans .tmp/ : `partage-eveille.png` et `partage-endormi.png` (1080×1350),
  plus `partage-feuille-*.png`.
- Point 5 : lint, typecheck, 494 tests unitaires, 110 tests de bout en bout (Chromium et
  WebKit, axe compris, dont la feuille de partage ouverte), `STRICT_DATA=1 pnpm build`
  passe en entier. Lighthouse mobile (3 passages, build normal avec noindex, règle
  ADEME) : Jardin 92-94, Carnet 95-96 (autres pages : Accueil 97-100, Comparer 90-95,
  Duel 94-96, Saison 97-98, Méthode 98-100) ; accessibilité et bonnes pratiques à 100, SEO
  66-69 (noindex). Captures : carnet, feuille de partage, jardin et duel mis à jour ;
  carnet de démonstration des captures corrigé (jean sans modes : « Jean plutôt que
  jean »).

**Gardé / changé** :

- Maquette 09a : « Exporter » revient dans la barre du haut, à côté de « Partager », sur
  mobile seulement ; la section de sauvegarde du bas reste.
- Carte endormie : la maquette garde la coccinelle ; l'image suit le vrai rendu du jardin
  (seuls oiseau, escargot et hérisson restent, endormis).
- Ciel « Midi soleil » : les feuillages jaunes et l'abeille ressortent moins sur le ciel
  jaune.
- Le bouton « Partager » n'apparaît que si le carnet a au moins un choix (pas d'image d'un
  jardin vide).
- Tests e2e : le parcours au clavier dans la feuille (Tab) n'est vérifié que sous Chromium,
  comme les autres tests clavier (WebKit ne parcourt pas les boutons avec Tab).

## 2026-10-05 — Correctif : partage du jardin bloqué sur téléphone (branche feat/journal-partage)

**Demandé** : sur la preview, « Partager » restait sur « Préparation de l’image » puis
affichait « L’image n’a pas pu être préparée ». Piste proposée : la CSP de `public/_headers`
(img-src, font-src) qui bloquerait blob: / data:, non appliquée par le serveur des tests.

**Constaté** :

- Piste CSP écartée : la preview renvoie exactement les en-têtes de `public/_headers`
  (`img-src 'self' data: blob:` y est déjà), et `e2e/static-server.mjs` les appliquait déjà.
  Le parcours rejoué sur la preview elle-même (Chromium « Pixel 7 » et WebKit « iPhone 14 »,
  `.tmp/repro-partage.mjs`) produisait bien l’image : le test e2e générait déjà le vrai PNG
  (seul `navigator.share` est simulé).
- Vraie cause : les polices de repli de next/font sont déclarées en `src: local(Arial)`,
  police absente d’Android. `renderShareCard` demandait `document.fonts.load()` avec toute
  la pile (« Bricolage Grotesque », « Bricolage Grotesque Fallback ») ; dans Chromium, une
  police correspondante qui échoue fait rejeter tout le chargement (`NetworkError`, vérifié
  dans `.tmp/font-load.mjs` ; WebKit, lui, résout). Invisible sur ordinateur, où Arial
  existe. L’erreur était avalée sans trace.

**Fait** :

- `renderShareCard.ts` : seules les vraies polices sont chargées (première famille de la
  pile), une police non chargée n’empêche plus l’image (avertissement en console) ; étapes
  nommées (illustrations, image du jardin, dessin, PNG) avec la cause ; SVG chargé par
  l’événement `load` plutôt que `decode()` (refusé pour les SVG par d’anciens Safari),
  adresse blob gardée jusqu’au dessin ; repli de `roundRect` pour Safari < 16.
- `ShareSheet.tsx` : `console.error` avec l’étape et la cause, à l’écran le message discret
  reste le même ; échec de `navigator.share` (hors annulation) aussi journalisé.
- Tests e2e : « police de repli absente (Android, sans Arial) » (CSS servie sans Arial,
  vrai PNG 1080×1350 généré, CSP de production vérifiée sur la réponse) — échouait avant
  le correctif sous Chromium ; « image impossible à préparer » (illustration en 500 :
  message discret, étape dans la console).
- Vérifications : lint, typecheck, 494 tests unitaires, 114 tests de bout en bout (Chromium
  et WebKit), `STRICT_DATA=1 pnpm build`.

**Gardé / changé** : CSP inchangée (rien à élargir). Le dessin de la carte garde la pile
complète (repli si la police manque).

## 2026-10-05 — Autorisation de l'ADEME (branche chore/licence-ademe)

**Demandé** : l'équipe Impact CO2 de l'ADEME a répondu par e-mail le 5 octobre 2026 à la
demande de réutilisation (usage en portfolio) : réutilisation gratuite et sans limite, mention
« Données : Impact CO2 – ADEME » validée. Renseigner `DATA_LICENSE` et l'afficher sur
/methode, retirer la règle « pas de `SITE_LAUNCHED` » de CLAUDE.md, relancer
`pnpm build-gestures` et `pnpm build-saison` avec la clé (dans `.env.local`, jamais affichée
ni commitée) et vérifier que seules les dates changent.

**Fait** :

- `DATA_LICENSE` (/methode#sources) : « Réutilisation des données autorisée par l’équipe
  Impact CO2 de l’ADEME (e-mail du 5 octobre 2026), gratuitement, avec la mention « Données :
  Impact CO2 – ADEME ». » Vérifié de bout en bout (`e2e/saison.spec.ts`).
- CLAUDE.md : règle d'attente remplacée par l'autorisation ; lancement (`SITE_LAUNCHED=1`)
  activé par l'utilisateur dans Cloudflare. README (licences) et commentaire de
  `scripts/lighthouse.mjs` mis à jour.
- Données regénérées : aucune valeur ne change (34 gestes, 76 produits). Seuls changent les
  deux `downloadedAt` et `authenticated: true` dans `saison.generated.json` (requête faite
  avec la clé). La date affichée des données de saison passe au 5 octobre 2026.
- Vérifications : lint, typecheck, 494 tests unitaires, `STRICT_DATA=1 pnpm build`, 114 tests
  de bout en bout (Chromium et WebKit, axe compris). Au premier passage, trois tests axe
  WebKit (accueil, choix des gestes, duel) ont échoué, puis sont passés seuls et dans un
  second passage complet, sans changement de code.

## 2026-10-05 — Lot V2-2 : compte optionnel, lien magique, synchronisation (branche feat/comptes)

**Demandé** : compte facultatif (lien magique par e-mail, Turnstile, Resend) pour retrouver son
jardin sur un autre appareil, le carnet local restant la source principale ; Pages Functions
et D1 à côté de l'export statique ; fusion append-only par id ; export, déconnexion,
suppression ; page /confidentialite ; section en bas de /jardin ; tests unitaires, Functions
sur D1 locale avec faux Resend, e2e complet. Point 1 (schéma, routes) validé avec décisions :
purge des comptes inactifs déclenchée par les appels à l'API (au plus une fois par jour),
liaisons D1 dans le tableau de bord (le fichier wrangler ne doit pas devenir la source de
vérité), expéditeur connexion@lepoidsdeschoses.com sans mail d'avertissement, origine
le-poids-des-choses.pages.dev gardée, getPlatformProxy pour les tests.

**Fait** :

- `migrations/0001_comptes.sql` : `users`, `login_tokens`, `sessions`, `journal_entries` (une
  ligne par version, `seq` pour la synchro incrémentale), `rate_limits`, `maintenance`.
- `wrangler.local.toml` (local seulement) : pas nommé `wrangler.toml` et sans
  `pages_build_output_dir` ; d'après la doc Cloudflare (« Wrangler configuration » des
  Pages Functions), sans cette clé le fichier ne sert qu'en local. `wrangler pages dev`
  n'accepte pas de fichier personnalisé : la base lui est passée par `--d1 DB=lpdc-local`
  (vérifié : même base locale que les migrations). Les options `-b` l'emportent sur
  `.dev.vars` (vérifié) : les tests ne peuvent jamais utiliser une vraie clé Resend.
- `server/` (logique, types D1 minimaux, sans types globaux de Workers) et `functions/api/`
  (routes minces, middleware : en-têtes, erreurs, entretien quotidien). Lien vers
  `/connexion#jeton=…` : jeton dans le fragment, envoyé en POST par la page (les antivirus
  de messagerie qui ouvrent les liens ne le consomment pas). Empreintes SHA-256 des jetons,
  cookie `__Host-lpdc_session`, Origin vérifiée, limites par HMAC de l'e-mail et de l'IP,
  réponse identique que l'adresse ait un compte ou non.
- Navigateur : `src/lib/sync` (fusion, forme canonique, état `lpdc:compte:v1`, client,
  moteur avec file d'attente et pagination), `JournalStore.mergeRemote` (n'écrase rien),
  carnet partagé déplacé dans `src/lib/journal/browser.ts`, synchro après chaque choix
  (`useJournal().add`). `AccountSection` sur /jardin (non connecté, lien envoyé, connecté
  avec dernière synchro, confirmation de suppression, erreurs), `/connexion`,
  `/confidentialite` (lien dans le pied de page et le formulaire), mentions légales mises à
  jour (« Aucun compte », « Aucun cookie » n'étaient plus vrais). Turnstile chargé au premier
  usage du formulaire ; CSP : `challenges.cloudflare.com` en script et frame.
- Vérifié pour /confidentialite : Resend est exploité par Plus Five Five, Inc. et garde ses
  données aux États-Unis quelle que soit la région d'envoi ; une base D1 peut être limitée à
  l'UE (juridiction choisie à la création, non modifiable) ; Turnstile utilise notamment
  l'IP et des caractéristiques du navigateur, pour détecter les robots seulement.
- Tests : 596 unitaires (fusion : vide, doublons, conflit, ordre ; jetons : expiration,
  réutilisation, clics simultanés ; limites ; synchro, pagination, export ; entretien
  24 mois ; routes complètes sur D1 locale avec faux Resend et faux Turnstile, `fetch`
  remplacé). E2e : `wrangler pages dev` en HTTPS (WebKit refuse le cookie Secure en http
  local) avec D1 neuve et faux services ; parcours complet sur deux appareils (lien
  intercepté, connexion, synchro croisée, nouveau choix, export, suppression, session
  disparue sur l'autre appareil), lien à usage unique, déconnexion, panne réseau puis
  retour, limite de demandes, axe sur chaque état ; 134 tests passent (Chromium, WebKit).
  `STRICT_DATA=1 pnpm build` passe (avertissement : clé Turnstile publique absente en local).
  Lint, typecheck. Lighthouse mobile (3 passages, noindex) : Mon jardin 92-95 (92-94 avant
  le lot), Carnet 95-97, Accueil 98-100 ; accessibilité et bonnes pratiques à 100, SEO 66-69.

**Gardé / changé** :

- Export du compte : format de l'export local, plus `account` (adresse, date de création)
  et `conflicts` s'il y en a ; « Importer » le relit.
- Après la suppression du compte sur un appareil, l'autre appareil voit « Ta session a pris
  fin » à sa visite suivante ; son carnet reste.
- Tests du compte dans deux projets Playwright (`compte-chromium`, `compte-webkit`,
  2 workers, après les autres) : en parallèle avec le reste, la machine (8 cœurs, charge
  jusqu'à 50) faisait dépasser les délais. Préchargements Next interrompus tolérés dans
  WebKit pour ces tests seulement ; test de limite décalé s'il tombe à moins d'une minute
  d'une fenêtre de 15 minutes.
- Lien « Confidentialité » de la section sans préchargement.
- `main` fusionnée dans la branche après la PR #17 (licence ADEME) : seul conflit, ce
  journal (les deux entrées gardées).

## 2026-10-05 — Finitions UX : retrouver son jardin, /methode illustrée, installer l'appli (branche fix/finitions-ux)

**Demandé** : retours de test sur téléphone et ordinateur. (1) Retrouver son jardin sur un
nouvel appareil sans devoir d'abord faire un choix : lien « J’ai déjà un jardin ? Le
retrouver » sur l'accueil, « Se connecter » (ou l'adresse) dans l'en-tête, formulaire en haut
d'un /jardin vide, formulaire sur /connexion sans jeton, arrivée sobre des plantes après
connexion. (2) /methode moins austère : 4 à 6 illustrations existantes en papiers découpés,
décoratives, animées à l'entrée (GSAP), coupées en mouvement réduit. (3) « Installer
l’appli » toujours disponible (pied de page, sauvegarde de /jardin), même bandeau fermé.

**État au point d'étape** (reprise après une mise en veille du Mac) : le code des trois points
est écrit et commité en trois commits ; lint, typecheck, 598 tests unitaires et `pnpm build`
passent. Restaient : vérification visuelle de /methode, tests de bout en bout (nouveaux
parcours, et mise à jour des tests qui attendaient « Ce lien ne marche plus » sur /connexion
sans jeton), Lighthouse, captures.

**Correction du point d'étape** : le typecheck avait été lancé avant l'écriture du test de
`installAccess` ; le commit 567a1cb contient une erreur de type dans `install.test.ts`
(propriété `dismissed` en trop), corrigée ensuite. Les autres vérifications annoncées étaient
exactes.

**Fait ensuite** :

- /methode vérifiée à l'écran (mobile, ordinateur, 340 px) : 5 papiers découpés (oiseau près
  du titre, coccinelle « Nos hypothèses », balance « Et ton jardin ? » où se trouve #ecart,
  picto végétalien « Fruits et légumes de saison », escargot en fin de page) ; sur mobile, la
  ligne du titre ne grandit plus (marge négative).
- `/connexion` : un lien ouvert dans un onglet déjà sur /connexion ne changeait que le
  fragment (pas de rechargement), donc le jeton n'était pas lu : écoute de `hashchange`.
  « N choix retrouvés » compté sur le carnet de l'appareil (avant / après), et non plus sur
  le compteur de la synchro de l'onglet : un autre onglet ouvert sur /jardin peut fusionner
  les mêmes choix en premier.
- Lien « J’ai déjà un jardin ? Le retrouver » de l'accueil avec préchargement (chemin
  principal) ; « Se connecter » des en-têtes sans préchargement.
- Tests de bout en bout : « retrouver son jardin depuis l'accueil, sur un appareil vide »
  (lien de l'accueil, Turnstile absent avant le formulaire, lien ouvert dans le même onglet,
  jardin ouvert dans un autre onglet qui se remplit avec un seul message et sans fenêtre,
  adresse dans l'en-tête vers /jardin#compte) ; « installer après avoir fermé le bandeau »
  (iPhone : aide en deux gestes, axe ; Android et Chrome : invite simulée puis plus d'accès
  une fois installée ; appli déjà installée : rien). Tests mis à jour : /connexion sans jeton
  montre le formulaire (et « déjà connecté » si c'est le cas), lien usé : formulaire sur
  place.
- Captures : `accueil-mobile.png`, `methode-mobile.png`, `methode-ordinateur.png` ajoutées ;
  les autres regénérées.

**Vérifications** : lint, typecheck, 598 tests unitaires, `STRICT_DATA=1 pnpm build`,
142 tests de bout en bout (Chromium et WebKit, axe compris ; 14 ignorés, clavier sous
WebKit). Pendant le travail, des tests du compte ont dépassé leurs délais sous forte charge
de la machine (charge ~30 sur 8 cœurs, une machine virtuelle Docker à 100 %) : délai de
15 s pour l'ouverture de /connexion dans le nouveau test, préchargement du lien de
l'accueil ; le passage complet final est vert. Lighthouse mobile (2 passages, noindex) :
Accueil 99, Mon jardin 93, Méthode 95-97 ; accessibilité et bonnes pratiques à 100, SEO 66-69
(noindex).

**Gardé / changé** :

- « Se connecter » n'est pas dans les barres du parcours de comparaison ni de /jardin
  (déjà chargées : retour, progression, pastille, partage) ; il est sur l'accueil (mobile et
  ordinateur), les pages de texte, /saison et le carnet.
- Après connexion, les plantes arrivées pendant la visite apparaissent en un fondu groupé
  (moins d'1,5 s en tout), sans éclat, rafale ni message d'animal ; un jardin ouvert après la
  connexion s'affiche simplement rempli.
- Le texte du bandeau « Garde ton jardin » (maquette 04) est inchangé.

## 2026-10-05 — Encart de saison : du plus léger au plus lourd, fruits et légumes flottants (branche feat/saison-accueil)

**Demandé** : (1) remplacer les 3 produits de l'encart « Ce mois-ci, c'est la saison de… »
(accueil et /comparer) par deux repères calculés : le produit de saison le plus léger et le
plus lourd au kilo, valeurs arrondies comme sur /saison, ton neutre, égalité → ordre
alphabétique, lien /saison et crédit gardés ; (2) fruits et légumes dessinés (zip
`le-poids-des-choses-saison`, sans la cagette) qui flottent à droite de l'encart, seulement
ceux de saison, animés avec GSAP (flottement, parallaxe, rebond au toucher, fondu décalé,
pause onglet caché, rien en mouvement réduit), décoratifs, sans décalage de mise en page ;
(3) vérifications, captures, démo /labo.

**Fait** :

- `seasonRange` (`src/lib/saison`) : parmi les produits de saison ce mois-ci, **hors
  produits disponibles toute l'année**, le plus léger et le plus lourd au kg ; [] si aucun,
  un seul s'il n'y en a qu'un. Avec les produits de toute l'année, le plus lourd serait la
  mangue importée par avion tous les mois (11,7 kg) : ni « de saison », ni informatif.
  Octobre : Ail (384 g CO2e/kg) … Noisette (4,8 kg CO2e/kg).
- `formatPerKilo` : `formatMass` (même arrondi que /saison, donc « 384 g » sous 1 kg et non
  « 0,38 kg ») suivi de « CO2e/kg », espaces insécables avant les unités.
- Encart : titre « De saison en octobre », puis « Du plus léger au plus lourd au kilo : » et
  les deux produits sur deux lignes (hauteur fixe de trois lignes réservée, le mois n'étant
  connu que côté client) ; `DataCredit` de la saison (base Agribalyse, date) ajouté, puisque
  des valeurs sont affichées. Même composant sur /comparer.
- Dessins : 7 SVG 80×80 ajoutés aux specs (`saison-pomme`, `poire`, `carotte`, `courge`,
  `raisin`, `poireau`, `tomate`) ; `saison-cagette.svg` n'est pas copié dans
  `public/illustrations` (le build refuse tout fichier sans spec). Correspondance explicite
  `SEASON_DRAWINGS` (dessin → slug, testée sur les noms et les données) ; `drawnForMonth` :
  de saison ce mois-ci, saison la plus courte d'abord (octobre : raisin, courge, carotte,
  poire, poireau), 5 au plus ; moins de 3 → ceux de toute l'année (aucun aujourd'hui) ;
  aucun (mai) → mois le plus proche, celui qui en a le plus, sinon le mois à venir (mai :
  avril, poireau et pomme). Juin et juillet n'ont que la tomate : un seul produit flotte.
- `FloatingProduce` : zone fixe 210×160 à droite dès 28rem de large (requête de conteneur
  sur l'encart, donc juste aussi sur /comparer), rangée de 3 (76 px) sous le texte en
  dessous, masquée sous 15rem. Places, tailles (50 à 72 px), inclinaisons, flottement et
  parallaxe dans `src/lib/geometry/float.ts`, avec un test qui vérifie l'absence de
  chevauchement au pire du mouvement (rotation, dérives en opposition, écart de parallaxe).
  Calques : place (inclinaison CSS) › parallaxe › flottement › rebond. Flottement en pause
  quand l'onglet est caché ou la zone hors de l'écran ; rebond au `pointerdown`, sans focus
  ni rôle ; tout immobile et visible en mouvement réduit.
- /labo : panneau « Encart de saison », mois au choix, en large et en étroit (prop `month`
  de `SeasonTeaser`, id du titre par `useId`).
- Tests : unitaires (mois sans produit, égalité, un seul produit, données réelles de chaque
  mois, correspondance des dessins, repli sur le mois le plus proche, places) ; bout en bout
  de l'encart réécrits (deux valeurs croissantes, espaces insécables, crédit, dessins
  aria-hidden et sans élément focalisable, mouvement réduit : immobiles et sans rebond).

**Vérifications** : lint, typecheck, 632 tests unitaires, `STRICT_DATA=1 pnpm build`, CLS
mesuré à 0 sur / et /comparer (ordinateur et Pixel 7). Bout en bout : 143 passés, 14 ignorés,
1 échec sous forte charge (charge ~30) dans `compte-webkit` (préchargement de
/confidentialite interrompu, sans rapport avec l'encart) ; relancés seuls, `compte-webkit`
et `partage` (Chromium) passent. Lighthouse mobile sur `serve:out` (noindex) : Accueil 97
puis 99, Comparer 93, autres pages 93-99 ; accessibilité et bonnes pratiques 100. Mesuré
d'abord par erreur sur `e2e/static-server.mjs` (sans compression) : ~80 partout, y compris
sur les pages non touchées. Captures `accueil.png` et `accueil-mobile.png` régénérées.

**Gardé / changé** :

- La formulation est découpée en titre (« De saison en octobre ») et texte (« Du plus
  léger au plus lourd au kilo : … ») : un titre de section reste lisible au lecteur d'écran.
- Les valeurs sous 1 kg s'écrivent en grammes, comme sur /saison.

## 2026-10-05 — Encart de saison : 14 produits dessinés de plus, étiquette du mois (branche feat/saison-produits)

**Demandé** : ajouter les 14 dessins du zip `le-poids-des-choses-saison-2` (fraise, cerise,
abricot, courgette, aubergine, melon, radis, asperge, petits-pois, chou, clémentine, kiwi,
endive, betterave), compléter la table de correspondance avec les noms exacts des données
(sans rien inventer), donner le tableau mois par mois des produits qui flottent (objectif :
au moins 3), afficher le mois en étiquette de papier découpé près des produits, démo /labo.

**Fait** :

- 14 SVG 80×80 ajoutés aux specs (calques de chaque fichier), `pnpm illustrations`
  (90 illustrations).
- Les 14 produits existent dans `saison.generated.json` ; deux noms diffèrent du fichier :
  `saison-petits-pois` → `petitpois` (« Petit pois »), `saison-clementine` → `clementine`
  (« Clémentine »). « Chou » est le chou (pas le chou de Bruxelles ni le chou-fleur). Le
  test de la table compare désormais nom du dessin et intitulé sans accents, tirets ni « s »
  final, et vérifie que tout dessin `saison-*` est dans la table.
- Mois par mois (tous les dessins de saison ; 5 flottent au plus, saison la plus courte
  d'abord) : janvier 10, février 9, mars 9, avril 5, mai 6, juin 10, juillet 8, août 7,
  septembre 10, octobre 10, novembre 9, décembre 9. Plus aucun mois sous 3 (mai, qui en
  avait 0, en a 6) ; un test le garantit sur les données actuelles.
- Étiquette du mois (« octobre ») au-dessus des produits : papier soleil, texte encre en
  Bricolage, inclinée de -4°, ombre encre ; elle se pose comme les papiers de /methode
  (`CUTOUT_ENTRY`) juste avant le fondu des produits ; aria-hidden (le titre dit déjà le
  mois) ; hauteur réservée ; visible et immobile en mouvement réduit. Paire encre / soleil
  déjà vérifiée par le test de contraste (usage ajouté à sa description).
- /labo : le sélecteur de mois du panneau « Encart de saison » montre les nouveaux produits.
- `e2e/partage.spec.ts` : le test « police de repli absente » lisait le partage juste après
  le clic ; il échouait sous charge dans les passages complets (2 fois sur 3). Il attend
  maintenant le partage (`expect.poll`).

**Vérifications** : lint, typecheck, 647 tests unitaires, `STRICT_DATA=1 pnpm build`, CLS à
0 sur / et /comparer (ordinateur et Pixel 7), bout en bout complet vert (144 passés,
14 ignorés, Chromium et WebKit, axe compris). Lighthouse mobile sur `serve:out` (noindex) :
Accueil 99 puis 100, Comparer 94-95, autres pages 93-100 ; accessibilité et bonnes
pratiques 100. Captures `accueil.png` et `accueil-mobile.png` régénérées.

## 2026-10-05 — « Raconte ta journée » (lot V2-3, branche feat/raconte)

**Demandé** : la personne écrit sa journée, Claude repère les gestes du catalogue et propose
de les ajouter au carnet, chaque proposition validée par la personne ; l'IA ne calcule rien.
Pages Function `POST /api/raconte` (Turnstile, origine, Content-Type, texte limité),
`claude-haiku-4-5` en sortie structurée (enum exact des ids), validation stricte, résistance
aux injections, table d'alternatives dans le code, limites par IP et par compte, plafond
global en D1, coupe-circuit `AI_ENABLED`, journal de compteurs seulement ; confidentialité
(conservation chez Anthropic citée telle quelle), empreinte sans chiffre faute de source ;
écran 08 de Figma ; tests (faux Anthropic, 20 phrases + 3 en anglais, `raconte:eval`).
Arrêt après le point 1 pour validation du schéma, du prompt, de la table et des limites.

**Proposé puis validé** (point 1) : schéma `{ excerpt, gestureId, certainty, quantity, mode }`,
prompt système (catalogue généré, 9 règles), table `ALTERNATIVES` (l'option qu'on aurait le
plus probablement prise, pas la plus lourde), limites (IP 3/15 min et 5/24 h, compte 5/24 h,
300 par jour UTC ou `AI_DAILY_CAP`), ordre des contrôles. Texte limité à 280 caractères
(compteur de la maquette) au lieu des 500 évoqués.

**Ajustements demandés** : liste à cases de la maquette avec « Ajouter au carnet », gestes
`explicit` cochés et `inferred` (« À vérifier ») décochés, bouton désactivé tant qu'un geste
coché n'a pas sa distance ou son option ; extrait comparé après normalisation des deux côtés
(NFC, apostrophes et guillemets, espaces, casse) ; récits en anglais analysés (règle 9) et
3 phrases anglaises ; geste plus lourd « simplement noté » ; note de la maquette et mention
sous le champ. Maquette 08 mise à jour (café, « distance à préciser », phrase sans chiffre).

**Fait** :

- Serveur : `server/raconte.ts` (SDK officiel `@anthropic-ai/sdk`, température 0,
  600 jetons, 15 s, sans nouvel essai ; refus du modèle → liste vide ; sortie illisible ou
  API en erreur → 502 `ai-failed`), `server/raconte-prompt.ts`, route dans
  `server/handlers.ts` et `GET /api/raconte` (`{ enabled }`, pour prévenir dès l'arrivée sur
  l'écran). Compteurs dans `rate_limits` : aucune migration. Les refus comptent aussi.
- Validation partagée (`src/lib/raconte/detections.ts`), appliquée par le serveur puis de
  nouveau par le navigateur. Extrait vérifié sur le texte nettoyé (chevrons remplacés),
  normalisation étendue aux tirets (« Toulon–Marseille ») et aux espaces des guillemets
  français.
- Écran `/raconte` (`RaconteScreen`) : champ avec label, compteur, mention, Turnstile partagé
  avec le formulaire de connexion (`useTurnstile`, factorisé depuis `SignInForm`), état
  « Claude lit ta journée… » annoncé, titre des résultats focalisé, cases natives (nom = le
  geste, détails en description), « Modifier » (`aria-expanded`) : distance, option comparée,
  ou option d'objet et colis ; « Ajouter au carnet » → `useJournal().add` (synchro du compte
  comprise), puis la liste des entrées (« +X kg » ou « noté »), « Voir mon jardin »
  (`?nouveau=` du dernier choix léger). Pictos du projet à la place des ronds « à dessiner » ;
  icône « poids » de la maquette (`public/icons/poids.svg`).
- Écarts à la maquette : « Boire · 1 litre » (au lieu de « 1 boisson ») puisque les
  boissons sont comparées au litre ; une ligne « Comparé à : … » sous chaque geste, pour que
  l'option notée soit visible sans ouvrir « Modifier ».
- Points d'entrée (`RaconteLink`) : /comparer (sous le choix des gestes) et /jardin (jardin
  vide, et sous le carnet). `/raconte` ajoutée au sitemap.
- /confidentialite#raconte (envoi à Anthropic, rien de stocké chez nous, conservation citée
  depuis la page officielle d'Anthropic mise à jour le 1er juillet 2026, Turnstile),
  /methode#raconte (fonctionnement, table, empreinte sans chiffre).
- Tests : unitaires (schéma, ids inconnus, extraits inventés, normalisation, quantités,
  modes, table des alternatives, propositions et écarts calculés par `src/lib/calc`, textes,
  limites, plafond global, `AI_ENABLED`, `GET`, journal sans texte, texte jamais en base,
  injection) ; faux Anthropic dans `e2e/fake-services.mjs` ; `e2e/raconte.spec.ts` (parcours
  complet, objet, clavier, rien de reconnu, panne, fonction coupée, points d'entrée, axe) ;
  `docs/raconte-phrases.md` (23 phrases dont 3 en anglais) lu par `scripts/raconte-eval.ts`
  (`pnpm raconte:eval`) et vérifié par un test (ids du catalogue).
- Bout en bout : lancés en même temps que le compte, les tests /raconte faisaient échouer
  deux tests du compte sous charge (synchro trop lente sur le serveur local) ; ils ont leurs
  propres projets (`raconte-chromium`, `raconte-webkit`), lancés après le compte.

**Vérifications** : lint, typecheck, 704 tests unitaires, `STRICT_DATA=1 pnpm build`, bout
en bout complet vert (155 passés, 15 ignorés, Chromium et WebKit, axe compris), sous une
charge machine de 25 à 40. Lighthouse mobile sur `serve:out` (noindex) : Comparer 95,
accessibilité et bonnes pratiques 100 partout. `pnpm raconte:eval` pas encore lancé (clé
réelle nécessaire, à faire par Guillaume).

### 2026-10-05 (soir) — CI de la PR #22 : incident GitHub Actions

Les trois premiers lancements de la CI de la PR #22 ont été annulés après 15 minutes sans
qu'aucune étape ne démarre (aucun journal, `runner_name` vide, annotation « The job was not
acquired by Runner of type hosted even after multiple attempts »). Ce n'était pas le
`timeout-minutes` du workflow (20 min, jamais atteint : la CI dure ~5 min, bout en bout
~3 min) mais un incident GitHub (« delays in assigning GitHub-hosted runners », ouvert à
19 h 12 UTC, résolu vers 23 h 27 UTC). Relancée après la résolution : verte en 5 min 04
(bout en bout 3 min 08). Workflow inchangé.

## 2026-10-06 — « Raconte ta journée » : gestes à compléter (branche fix/raconte-ajout)

**Demandé** (retour de test sur téléphone) : « Ajouter au carnet » restait désactivé à cause
d'un trajet sans distance, et le message sous le bouton passait inaperçu. Mettre le manque
dans la carte, un message bien visible, un bouton qui mène au premier manque.

**Fait** :

- Carte à compléter (cochée, distance ou option manquante) : bordure tomate ; le champ
  « Distance du trajet (km) » (ou le choix neuf / d'occasion / je garde) est affiché dans la
  carte dès l'analyse, sans passer par « Modifier », et y reste une fois rempli (le focus ne
  saute pas). « Modifier » ne garde alors que l'option comparée ; pour un objet à compléter,
  il disparaît (il n'aurait rien d'autre à montrer).
- Sous le bouton : « 1 geste à compléter » / « N gestes à compléter » (texte encre, gras, sur
  pastille tomate douce), lui-même un bouton ; aucun geste coché : « Coche au moins un geste
  pour l'ajouter au carnet. ».
- « Ajouter au carnet » : `aria-disabled` au lieu de `disabled` (toujours touchable, annoncé
  comme indisponible, décrit par le message) ; le toucher, ou toucher le message, fait
  défiler jusqu'au premier geste à compléter (carte au centre, sans animation en mouvement
  réduit) et place le focus sur son champ (ou sur sa case quand rien n'est coché).
- « décoche-le » : le code l'écrivait déjà avec le trait d'union ; l'ancienne phrase
  « Précise la distance de … avec « Modifier », ou décoche-le » est remplacée par le compte.
- Logique pure dans `src/lib/raconte/text.ts` (`blockingFor`, `inlineNeed`, ids stables
  `rowFieldId` / `rowCheckboxId`), testée.
- Bout en bout : nouveau test mobile (Pixel 7 et iPhone 14) : marche sans distance → carte
  bordée et message visible → toucher le bouton → défilement et focus sur le champ → saisie
  → ajout ; parcours complet adapté. Faux Anthropic : « à pied » → marche.

## 2026-10-06 — « Tenir une habitude » et jardin des saisons (branche feat/habitudes-saisons)

**Demandé** : une deuxième façon de nourrir le jardin. Comparer (existant) fait pousser une
plante et compte des kg d'écart ; tenir une habitude (« repas végé », « vélo pour le
travail ») se note sans comparaison, ne compte AUCUN kg et arrose le jardin (les plantes
s'épanouissent, le jardin reste éveillé). Plus un jardin qui suit les saisons. Illustrations
fournies (zip) ; conception à montrer avant de coder.

**Conception proposée puis validée** : règle B (l'arrosage fait d'abord grandir les pousses
jusqu'à l'âge adulte, puis s'épanouir), jours arrosés à l'heure de Paris, un cran tous les 3
jours arrosés (constante), liste HABITS de 12 gestes sans objet, feuillage des caducs blanc
cerné d'encre l'hiver, « Mes habitudes » sur l'appareil seulement. Ajout de Guillaume :
l'épanouissement des caducs dort l'hiver (niveau gardé, rien d'affiché de décembre à
février), champ par espèce, testé et expliqué sur /methode.

**Fait** :

- Illustrations : 11 fichiers dans `public/illustrations`, contrat dans `specs.ts`. Écart au
  brief : les feuilles d'automne font 16×16 (pas 24×24). Le test des dessins de produits de
  saison ignore `saison-hiver-…`, `saison-automne-…`, `saison-printemps-…` ; les fichiers
  `-epanoui` sont exclus de l'emprise des plantes (vitrine).
- Carnet : union `ComparisonEntry | HabitEntry` ; une comparaison reste sans `kind` (jamais
  réécrite) ; une habitude `{ kind: "habit", id, date, gesture }` est refusée si elle porte
  un champ de comparaison. Même clé, même export ; serveur et D1 inchangés (payload JSON),
  testé côté serveur.
- Modèle : `watering.ts` (jours arrosés, crans), `species.ts` (table des espèces, tirage figé),
  `seasons.ts`, ciel « Jour » de saison, `waterRevealForEntry` ; totaux, paliers, filtres et
  graphique n'additionnent que les comparaisons.
- Rendu : `StagedPlant` (couleur de saison du feuillage, épanouissement qui suit le
  balancement et s'ouvre avec l'éclat), `SeasonGround` / `SeasonFall` (neige, flocons,
  pétales, feuilles ; pause onglet caché ou hors écran ; rien en mouvement réduit ni jardin
  assoupi), image de partage à la même saison.
- Interface : /comparer « Noter une habitude » (`?habitude=`), raccourci pour une habitude
  déclarée, `HabitResult` ; /jardin « Mes habitudes » (un toucher pour arroser, déclaration),
  « N jours arrosés » au bilan et sous le graphique ; carnet « arrosé » et filtre
  « Habitudes tenues » ; « Raconte ta journée » : « Comparer » / « Habitude tenue » par
  geste de la table (une habitude ne demande plus de distance) ; /methode#habitudes (texte
  validé + phrase sur l'hiver + saisons = décor), renvoi depuis #ecart ; /confidentialite
  (« Mes habitudes » sur l'appareil).
- /labo : « Saisons et épanouissement » (curseurs saison, niveau d'épanouissement sur les six
  espèces, jours arrosés sur un jardin de démonstration).
- Libellés renommés pour ne pas doubler des noms existants dans les tests (« Mes habitudes »
  plutôt que « Arroser mon jardin », qui contenait « Mon jardin » ; bouton « Noter une
  habitude », sans « comparer »). Description du jardin : la saison vient en dernier
  (« Jardin : 3 plantes, 1 animal, en automne »).
- `e2e/fixtures.ts` : une animation CSS annulée avant la mesure axe (AbortError, WebKit) ne
  fait plus échouer le test.

**Vérifications** : lint, typecheck, 808 tests unitaires (dont une propriété « jamais de
régression » sur des carnets générés), `STRICT_DATA=1 pnpm build`, bout en bout complet
(172 passés, 16 ignorés, Chromium et WebKit, axe compris ; nouveau `e2e/habitudes.spec.ts`
et un test « habitude » dans `e2e/raconte.spec.ts`). Lighthouse mobile (`serve:out`,
noindex) : Mon jardin 95 / 100 / 100. Contrôle visuel de /labo (automne, hiver, printemps)
dans Chrome ; la chute des pétales n'a pas pu être vue dans l'onglet piloté (onglet tenu
pour caché, animations en pause) : elle est vérifiée par le bout en bout.

## 2026-10-06 (après-midi) — Jardin vivant toute l'année (branche feat/jardin-vivant)

**Demandé** : dernier lot de fonctionnalités avant la version anglaise. Les plantes ne meurent
jamais ; ce sont des visiteurs de saison (non débloqués) qui font vivre le jardin, et le ciel
suit l'heure. Deux zips d'illustrations (visiteurs et nuit, nocturnes).

**Questions posées avant de coder** : (1) la PR #24 n'était pas encore fusionnée au premier
essai (main encore sur la PR #23) : Guillaume l'a fusionnée, la branche part de main à jour ;
(2) le test de contraste demandé (3:1) échouait sur des ciels déjà validés (soleil 1,39:1
sur Aube, nuages de 1,10 à 2,89:1, sans contour). Choix de Guillaume : animaux volants 3:1
(contour encre compris), soleil et nuages décoratifs ≥ 1,1:1, hirondelle masquée sur Nuit
encre même le jour.

**Fait** :

- Illustrations : 19 fichiers, contrat dans `specs.ts`. Groupe `crateres` ajouté dans le
  soleil de `scene-paysage.svg` (3 cercles soleil à 45 %, opacité 0 ; visibles la nuit).
  `lune.svg` gardé (contrat) mais pas utilisé.
- Faune (`fauna.ts`) et visiteurs (`visitors.ts`) en tables de données ; scène du moment
  (`live.ts`) partagée par le jardin et l'image de partage ; placement déterministe (saison +
  année de saison), jamais sur les plantes ni les animaux de la personne.
- Nuit (`daytime.ts`) : 21 h à 6 h, heure de l'appareil ; Nuit encre sans déblocage, lune à
  cratères, étoiles (0,6 d'opacité : plus discrètes qu'à pleine opacité, vu dans /labo),
  transitions de 2 s coupées en mouvement réduit ; mention sous le sélecteur de ciel.
- Garde-fou du build `sky-contrast.ts`. Il a trouvé deux cas, corrigés : les nuages blancs du
  ciel Jour d'été (1,099:1 sur crème) passent en soleil ; l'oiseau en vol sur Nuit encre
  (corps bleu, 2,92:1) : il ne s'envole pas sur ce ciel (il reste posé), comme l'hirondelle
  n'y apparaît pas.
- Messages d'arrivée : un animal débloqué pendant son absence « … : tu le verras au
  printemps / demain matin ».
- /methode#visiteurs ; /labo « Jardin vivant » (curseurs saison et heure, liste des présents
  et des absents).
- e2e : `e2e/jardin-vivant.spec.ts` (nuit, hiver de jour, papillon débloqué en hiver,
  mouvement réduit) ; le navigateur vit dans un fuseau où il est vers 13 h (les tests ne
  dépendent plus de l'heure du lancement), les tests de saison fixent Europe/Paris.

**Choix faits sans demander** : la cigale est absente s'il n'y a pas d'arbre adulte ; elle
se pose sur un autre arbre que le hibou quand il y en a plusieurs ; hibou et renard
s'ajoutent aux 2 à 4 visiteurs de saison (donc 6 au plus le jour, en été) ; le jardin vide
reçoit aussi ses visiteurs.

**À signaler** : `renard-endormi.svg` montre un renard debout aux yeux fermés, pas « en
boule ».

**Vérifications** : lint, typecheck, 861 tests unitaires, `STRICT_DATA=1 pnpm build` (garde-fou
du ciel compris). Bout en bout Chromium et WebKit avec axe : 163 passés au premier lancement
complet, mais la machine était très chargée (charge 70 à 110) : deux tests du compte ont
échoué (délai), avec des échecs différents à chaque relance. Relancés seuls, compte (16) et
« Raconte ta journée » (15) passent. Lighthouse mobile (`serve:out`, noindex, machine
chargée) : Mon jardin 90 puis 93, accessibilité et bonnes pratiques 100.

### 2026-10-06 (soir) — Jardin vivant : renard en boule, 4 visiteurs au plus

- `renard-endormi.svg` remplacé par le renard roulé en boule. Il n'a pas de calque `pattes`
  (le brief disait « mêmes calques ») : contrat adapté (`corps`, `queue`, `tete`, `oeil`).
- 4 visiteurs visibles au plus, nocturnes compris (`MAX_VISIBLE_VISITORS`, `capVisitors`) : le
  hibou et le renard passent d'abord, puis les visiteurs de saison dans un ordre tiré de la
  saison et de l'année. Les places ne bougent pas. Tests unitaires et e2e (hiver) adaptés.
- Poussé sur la PR #25 : la CI GitHub tranche pour les tests du compte qui échouaient sous la
  charge locale.

## 2026-10-06 (soir) — Version anglaise du site (branche feat/anglais)

**Demandé** : gel des fonctionnalités jusqu'à la version anglaise et l'étude de cas (règle
ajoutée en tête de CLAUDE.md), puis le site en anglais britannique sous `/en`, le français
restant à la racine : table des adresses, sélecteur de langue qui garde la page, bandeau
proposé aux navigateurs en anglais (sans redirection), hreflang, canonical, sitemap et image
de partage par langue, tous les textes dans des fichiers de traduction (build en échec si une
clé manque), noms des gestes, produits, animaux et visiteurs par table, e-mail de connexion et
image de partage dans la langue de la page, /method, /privacy et la notice légale en anglais.

**Proposé, puis validé avec retouches** (arrêt avant la traduction complète) : table des
adresses, glossaire de 41 termes (`docs/glossaire-en.md`), accueil traduit en échantillon.
Retouches de Guillaume : nom « Le poids des choses » partout, avec le sous-titre « The weight
of things » sur l'accueil anglais et dans la description de partage ; « Tell us about your
day » gardé ; TGV et TER gardés, précisés « high-speed train » / « regional train » ;
paramètres et ancres identiques ; `/en/garden/notebook` → `/en/garden/journal` ; carnet →
« journal » partout ; écart → « difference » dans les phrases (« gap » seulement dans les
explications de /en/method) ; « Find it » → « Find it here ».

**Fait** :

- Structure : deux mises en page racines (`(fr)` et `(en)/en`, `lang` propre à chacune,
  `RootDocument` commun). Changer de langue recharge la page (deux documents), voulu. La 404
  française passe par `global-not-found.tsx` (option expérimentale `globalNotFound` : sans
  elle, le 404.html exporté n'avait ni `lang` ni styles) ; l'anglaise est une page
  `/en/404`, exportée en `out/en/404.html`, que Cloudflare Pages sert pour toute adresse
  inconnue sous `/en` (le serveur de test fait de même). Manifeste anglais (ouverture sur
  `/en`, même `id`).
- Dictionnaires `src/lib/i18n/messages/` : `defineMessages(fr, en)`, l'anglais typé sur la
  forme du français (une clé oubliée casse la vérification des types, donc le build) ; les
  textes à accords (pluriels, genre) sont des fonctions. Les modules de texte existants
  (`garden/text`, `compare/sentence`, `journal/display`, `raconte/text`, `sync/messages`,
  faits, paliers, carte de partage) prennent une langue, français par défaut : tous les
  tests français passent sans changement.
- Noms : 34 gestes, 76 produits de saison et leurs 6 catégories, 6 animaux (« ladybird »),
  14 visiteurs, 4 ciels, mois, 12 habitudes. Garde-fou du build : un geste ou un produit des
  données sans nom anglais fait échouer `check-data` (toujours bloquant).
- Sélecteur « English / Français » dans les en-têtes (accueil, pages de texte, /saison) et
  le pied de page ; bandeau anglais sur les pages françaises (première langue du navigateur
  en anglais), en bas d'écran (aucun décalage), fermable, mémorisé (`lpdc:langue:v1`) ;
  mentionné sur les deux pages de confidentialité.
- E-mail : `locale: "en"` envoyé à `/api/auth/link`, e-mail anglais et lien vers
  `/en/sign-in#jeton=…` ; toute autre valeur donne le français.
- Image de partage OG anglaise (`public/og-en.png`, sous-titre « The weight of things ») ;
  carte de partage du jardin en anglais depuis /en (« My garden », « 12 lighter choices »).
- Pages de texte anglaises écrites en anglais dans leur page, mêmes ancres (testé) ; notice
  légale : « The French version of the legal notice is the authoritative one. ».
- `docs/raconte-phrases.md` : 4 phrases en anglais britannique de plus (27, dont 7 en
  anglais).

**Choix faits sans demander** : `/labo` reste en français (non liée, noindex) ; la 404
globale n'a pas de pied de page (elle n'a pas de mise en page) ; « voiture thermique » →
« Petrol or diesel car » ; « Repas végétal » → « Plant-based meal » ; « S’habiller » →
« Clothes » ; le bouton du duel pour la marche dit « I’ll walk » ; la date des données sur
/en/method est écrite « 5 October 2026 ».

**Finition hors glossaire** : Lighthouse classait « Start » parmi les textes de lien trop
vagues (SEO 92 sur l'accueil anglais) : le bouton dit « Start comparing » (glossaire mis à
jour). À valider.

**À signaler** : sous forte charge, WebKit refuse parfois à axe-core la lecture d'un petit
canvas (sa détection des ligatures d'icônes) et l'écrit en console ; ce seul message est
ignoré par `e2e/fixtures.ts` (le site n'appelle jamais `getImageData`). Les tests du compte
sur WebKit restent sensibles à la charge locale (un `ECONNRESET` du faux Resend, un
chargement annulé) : relancés seuls, ils passent.

**Vérifications** : lint, types, 1 053 tests unitaires (dont `english.test.ts`,
`messages.test.ts`, qui couvre tous les dictionnaires, et un test serveur de l'e-mail
anglais), `STRICT_DATA=1 pnpm build` (29 pages), `pnpm raconte:eval` sur le vrai modèle :
27 / 27, précision et rappel 100 % (≈ 0,06 $). Bout en bout Chromium et WebKit avec axe :
suite complète 213 passés, 2 échecs WebKit du compte dus à la charge, puis compte et
« Raconte ta journée » relancés seuls : 35 passés ; `e2e/anglais.spec.ts` : 46 passés, deux
fois de suite. Lighthouse mobile (`SITE_LAUNCHED=1`, `serve:out`) : Home 98 / 100 / 100 /
100, Compare 94, Duel 92, My garden 91, Journal 94, In season 96, Method 96 (accessibilité,
bonnes pratiques et SEO à 100 partout) ; français inchangé (accueil 100, jardin 91).

### 2026-10-06 (soir) — Relecture de la PR #26

Tout validé par Guillaume : « Start comparing » (écart documenté dans le glossaire : SEO et
clarté), « Petrol or diesel car », « Plant-based meal », « Clothes », « I’ll walk », 404
globale sans pied de page. Filtre WebKit de `e2e/fixtures.ts` resserré au message exact
(« Unable to get image data from canvas. Requested size was N x N »).

**À revérifier à chaque montée de version de Next** : la 404 française repose sur l'option
expérimentale `experimental.globalNotFound` (`next.config.ts`, `src/app/global-not-found.tsx`).
Après une mise à jour, vérifier que `out/404.html` a toujours `lang="fr"`, les polices et la
feuille de style, et que `out/en/404.html` existe.

## 2026-10-06 (nuit) — Maintenance de la CI (branche chore/ci-maintenance)

**Demandé** : Node 20 retiré des runners GitHub ; passer les actions sur Node 22 ou plus,
rendre la version de Node du projet cohérente, épingler Ubuntu avant le passage
d'`ubuntu-latest` à Ubuntu 26, vérifier que la CI passe en entier. Pas de fonctionnalité
(gel).

**Fait** :

- Actions à leur dernière version majeure, toutes sur Node 24 (vérifié dans leur
  `action.yml`) : `actions/checkout@v7`, `actions/setup-node@v7`, `pnpm/action-setup@v6`,
  `actions/upload-artifact@v7` (la CI n'utilise pas `actions/cache` à part : le cache pnpm
  passe par `setup-node`, `cache: pnpm`, gardé explicite car setup-node v6+ ne met plus en
  cache automatiquement que npm). Aucun changement cassant pour nous dans leurs notes de
  version.
- Node : `.nvmrc` = 24 (lu par setup-node et par Cloudflare Pages), `engines.node` = `>=24`
  ajouté à `package.json`, `@types/node` passé de `^20` à `^24`.
- `runs-on: ubuntu-24.04` au lieu d'`ubuntu-latest`.
- Build de la CI en mode strict (`STRICT_DATA=1`) : les mentions légales sont remplies
  depuis le lot du compte, le commentaire qui disait le contraire était périmé.
- `pnpm raconte:eval` ne tourne pas en CI (vrai modèle, clé, coût) : il reste manuel.

**Remonter Ubuntu (quand et comment)** : quand GitHub annonce la fin d'`ubuntu-24.04` (en
général un an et demi à deux ans après la sortie de la version suivante), ou quand
Playwright n'y publie plus ses navigateurs. Sur une branche `chore/…` : remplacer
`ubuntu-24.04` par la nouvelle version dans `.github/workflows/ci.yml`, mettre Playwright à
jour si besoin (`pnpm up @playwright/test`), ouvrir la demande de fusion et vérifier que
`playwright install --with-deps chromium webkit` et les tests WebKit passent avant de
fusionner.

## 2026-10-06 (nuit) — Lot « Espèces » (branche feat/especes)

**Demandé** : dernière exception au gel avant l'étude de cas. Six nouvelles espèces dessinées
(olivier, sapin, figuier ; marguerite, lavande, pissenlit, 21 SVG), des fiches FR/EN pour les
12 espèces avec anecdotes vérifiées, un choix « Que veux-tu planter ? » à chaque nouvelle
plante, un déblocage progressif, des jardins existants inchangés, le choix gardé avec la
plante (synchronisé si simple).

**Fait** :

- Dessins : 21 fichiers dans `public/illustrations`, contrat dans `specs.ts`. Les nouveaux
  SVG utilisent `transform` sur leurs formes : l'extraction des emprises
  (`scripts/bounds.ts`) les applique maintenant (translate, rotate, scale) ; les emprises
  des anciens dessins sont identiques à l'octet près. Le sapin adulte montait à y = −20
  (pointe coupée par son cadre) : `arbre-5-grand` et son épanouissement ramenés dans le
  cadre (échelle 0,85 autour du pied, rien d'autre ne change).
- Noms : aucune espèce n'était nommée dans le code ; noms du brouillon, tous gardés
  (pommier, poirier, cerisier, églantine, tulipe, herbes folles ; olivier, sapin, figuier,
  marguerite, lavande, pissenlit).
- `species.ts` : olivier et sapin persistants, figuier caduc ; marguerite, lavande, pissenlit
  avec `bloomRestsInWinter`. Perchoirs relus sur les dessins pour l'olivier et le figuier ;
  le sapin n'en a pas (tronc caché sous les étages).
- Déblocage : compteur `growthSteps` = choix légers + jours arrosés (deux compteurs du
  carnet qui ne font que monter, aucun kg). Une espèce tous les 3 pas : marguerite (3),
  olivier (6), lavande (9), figuier (12), pissenlit (15), sapin (18). Annonce « Nouvelle
  espèce : … » sur les cartes de résultat et après « Raconte ta journée ».
- Choix : `SpeciesPicker` (`<dialog>`, feuille en bas sur mobile, fenêtre au centre sur grand
  écran), ouvert AVANT que le choix léger soit noté (une entrée ne change plus ensuite) ;
  « Laisse le jardin choisir », Échap ou la croix = tirage habituel. Un seul choix pour
  toutes les plantes d'un ajout de « Raconte ta journée ».
- Stockage : champ `species` de l'entrée (choix léger seulement). Le carnet tolérait déjà
  les champs inconnus, côté navigateur comme côté serveur : synchro du compte et export sans
  migration ni changement d'API. Une espèce inconnue retombe sur le tirage.
- Jardins existants : empreinte d'un carnet de référence calculée sur main puis figée dans
  un test (même valeur sur la branche).
- Fiches : `messages/species.ts` ; sources dans `docs/especes-sources.md`. Douze anecdotes
  confirmées, dont quatre réécrites pour coller à la source : poirier (« mûrissent mal sur
  l'arbre »), églantine en anglais (la source parle de poil à gratter fabriqué, pas
  d'enfants), marguerite (« nombreuses » fleurs, pas « des centaines »), lavande (« en
  France », les surfaces de la source sont nationales).
- Bonus (toucher une plante ouvre sa fiche) : pas fait. La scène est une image unique pour
  les lecteurs d'écran ; ajouter un bouton par plante (jusqu'à 40) demandait plus qu'un
  bonus simple.

**À signaler** :

- Poirier (arbre-2) : la fiche dit « Caduc » (vrai pour un poirier), mais l'arbre-2 est
  persistant dans le jardin depuis le début (« élancé, comme un cyprès ») ; le changer
  modifierait l'automne et l'hiver des jardins existants. Choix à faire.
- Contrastes sur les collines (rapport de luminance) : vert sapin (olivier, sapin, feuilles
  foncées du figuier) 1,10:1 sur la colline bleue, 2,72:1 sur le vert ; feuilles claires du
  figuier (pomme) 1:1 sur l'herbe ; épis de la lavande (outremer) 1:1 sur la colline bleue,
  où ils disparaissent. Teinte différente pour le vert sapin sur le bleu (lisible à l'œil),
  mais pas pour la lavande. Dessins non retouchés : piste, un contour encre sur les épis,
  ou une autre couleur de la palette.
- Olivier (110 unités de large) et figuier (103) dépassent la plus large plante d'origine
  (90) : deux voisins d'une même rangée peuvent se chevaucher un peu.

**Vérifications** : lint, types, 1 141 tests unitaires (dont `especes.test.ts` : jardins
existants à l'empreinte figée, choix, déblocage, jamais de régression, jamais de kg, fiches
complètes dans les deux langues), `STRICT_DATA=1 pnpm build`. Bout en bout Chromium et
WebKit avec axe : 207 passés (dont `e2e/especes.spec.ts` : choix de l'olivier gardé avec la
plante, Échap et « Laisse le jardin choisir », choix plus lourd sans feuille, annonce
« Nouvelle espèce : la marguerite », version anglaise) ; compte et « Raconte ta journée »
relancés seuls : 35 passés. Dans la suite complète, sous la charge locale, l'axe de /labo
(douze espèces à analyser) dépassait 30 s sur WebKit : `test.slow()` pour cette page ; un
test du compte WebKit a perdu sa connexion au serveur local (connu), il passe relancé.

### 2026-10-06 (nuit) — Relecture de la PR #28

Décisions de Guillaume, appliquées sur feat/especes :

- arbre-2 devient le **citronnier** (persistant, fleurs blanches, fruits jaunes : colle au
  dessin et au comportement d'origine, aucun jardin ne change). Fiche FR/EN réécrite ;
  source du poirier retirée. L'anecdote proposée (« fleurs et fruits en même temps,
  refleurit plusieurs fois par an ») n'est confirmée qu'en partie mot pour mot : UF/IFAS
  (HS1153) écrit « Trees may bloom again in June and November » et « fruit at different
  stages of development at the same time », le CIRAD parle de floraisons échelonnées
  (« everbearing »). Anecdote retenue : « Le citronnier peut refleurir plusieurs fois par
  an : le même arbre porte alors des citrons à différents stades. »
- **Lavande** : `fleur-5-pousse`, `fleur-5-fleurie`, `fleur-5-fleurie-epanoui` remplacés
  (épis cernés d'encre). Sur la colline bleue : contour encre / outremer 2,92:1 (au lieu de
  1:1 sans contour) ; sur le vert, 7,23:1.
- **Largeur** : figuier adulte réduit à 0,85 autour du pied (87,7 unités), épanouissement
  compris. L'olivier, à 0,85, aurait fait 93,5 unités, au-dessus des 90 visés : il est réduit
  à 0,81 (89,1 unités). Traits gardés à leur épaisseur, perchoirs relus. L'extraction des
  emprises calcule maintenant les rayons exacts d'une ellipse seulement agrandie ou
  déplacée, et l'épaisseur du trait à l'échelle ; emprises des anciens dessins inchangées.

**Note pour la V3** : rendre les fiches des espèces accessibles par une page ou une liste
« Herbier » (alternative accessible au toucher sur une plante, que la scène, une seule image
pour les lecteurs d'écran, ne permet pas simplement).

### 2026-10-06 (nuit) — « Que veux-tu planter ? » plus visuel

Retours UX de Guillaume, appliqués sur feat/especes :

- Grille de cartes (2 colonnes sur mobile, 4 sur grand écran) : dessin, nom, ligne de type
  courte (« Arbre · Caduc · Fleurit au printemps », champ `short` des fiches). Toucher une
  carte plante l'espèce. Plus de description ni d'anecdote sur la carte.
- Bouton « i » à côté du bouton de la carte (jamais dedans), « En savoir plus sur
  l’olivier » : fiche dans la même feuille (grand dessin, type complet, description,
  encadré « Le savais-tu ? », « Planter l’olivier », « Retour aux espèces »). Au retour, le
  focus revient sur la carte (ou sur son bouton « i » pour une espèce verrouillée). Échap
  depuis une fiche revient à la grille ; depuis la grille, le jardin choisit.
- « Le savais-tu ? » : fond vert sapin, texte blanc, 6,49:1 (le vert pomme n'aurait donné que
  2,38:1) ; paire ajoutée au test de contraste du thème.
- Espèces verrouillées : carte grisée, cadenas, « Dans 2 pas » ; leur fiche reste lisible,
  avec « Se débloque bientôt. Encore 2 pas de croissance : choix légers ou jours arrosés. »,
  sans bouton pour planter.
- « Laisse le jardin choisir » inchangé, en bas.
- Bout en bout : `e2e/especes.spec.ts` réécrit (grille, fiche, retour du focus, Échap à deux
  niveaux, espèce verrouillée, « i » jamais imbriqué, couleurs de l'encadré, axe), en
  français et en anglais, sur Chromium et WebKit.

### 2026-10-06 (fin) — Un seul encadré « Le savais-tu ? »

Demande de Guillaume : l'encadré « Le savais-tu ? » de /jardin (et /en/garden) n'avait pas le
style vert sapin de la fiche d'espèce ; un seul composant partagé pour tout le site.

- Nouveau `DidYouKnow` (`src/components/facts/DidYouKnow.tsx`) : fond sapin #1B6B45, titre,
  texte et liens blancs soulignés, contour de focus blanc (l'outremer habituel ne ferait que
  1,10:1 sur sapin). Titre h2 sur une page, h4 dans la fiche d'une espèce.
- Occurrences recensées et migrées : `FactCard` (duel, duel objet, /jardin, en français et en
  anglais) et la fiche d'espèce de « Que veux-tu planter ? » (après un choix léger au duel,
  au duel objet et dans « Raconte ta journée »).
- Laissées telles quelles : le titre de section « Le savais-tu ? » de /methode#savais-tu
  (/en/method), qui explique les faits et n'est pas un encadré ; la carte « Palier franchi »
  (`MilestoneCard`), qui reprend les textes de `FACT_CARD` sans être un « Le savais-tu ? ».
- Test de contraste : la paire blanc / sapin couvre désormais tous les encadrés (texte, liens,
  contour de focus).
- Bout en bout : helper `expectDidYouKnow` (fond, couleur du texte, du titre et des liens) dans
  `e2e/facts.spec.ts` (duel, duel objet, jardin, en français et en anglais, avec axe),
  `e2e/accessibility.spec.ts` (jardin) et `e2e/especes.spec.ts` (fiche, FR et EN).

### 2026-10-06 — Barre « Comparer » fixe (feat/barre-comparer)

Demande de Guillaume : dans le choix de deux gestes (pas au duel objet), une barre fixe en bas
de l'écran dès le second choix, qui rappelle les deux gestes et porte « Comparer ».

- `CompareBar` (`src/components/compare`) : « Voiture thermique vs Vélo » et « Comparer »
  (anglais : « Petrol or diesel car vs Bike », « Compare »), sous le nom de région « Ta
  comparaison » / « Your comparison ». Elle part dès qu'un geste est retiré et se met à jour
  si on change de choix.
- Le bouton de la page reste en place et passe le premier au clavier : la barre est rendue
  après `<main>`.
- Lecteurs d'écran : la barre est dans une région `aria-live="polite"` toujours présente ;
  elle annonce « Voiture thermique et Vélo choisis : tu peux comparer. » (la phrase
  qu'annonçait déjà le choix des gestes, qui ne la répète plus) ; aucun focus pris.
- Rien de masqué : tant qu'elle est affichée, sa hauteur mesurée (ResizeObserver) est
  réservée en bas de `body` et en `scroll-padding-bottom` (le défilement au focus s'arrête
  au-dessus d'elle) ; zone sûre d'iOS par `env(safe-area-inset-bottom)`. Le site n'a pas
  `viewport-fit=cover` : Safari garde déjà la page hors de la zone de l'indicateur
  d'accueil, et la barre suit sans changement si on l'active un jour.
- Animation `animate-bar-in` (montée de 0,3 s), coupée en mouvement réduit.
- Bout en bout : `e2e/barre-comparer.spec.ts` (apparition, région polite, focus jamais pris,
  barre collée en bas, retrait et mise à jour, pied de page au-dessus de la barre, mouvement
  réduit, pas de barre pour un objet, ordre du clavier, anglais, axe) ; les deux parcours qui
  touchaient « Comparer » visent maintenant le bouton de la page.
- Test du compte instable en local, à surveiller s'il revient en CI : « retrouver son jardin
  depuis l'accueil, sur un appareil vide » (`e2e/compte.spec.ts`) a échoué une fois en local
  sur les deux navigateurs : après le clic sur le lien d'en-tête (l'adresse connectée), la
  page restait sur l'accueil au lieu d'aller à `/jardin#compte`. Il est passé à la relance ;
  un autre test du compte a alors échoué sur une coupure du `wrangler pages dev` local
  (« Network connection lost »). La CI de la PR #29 est passée. Cause non cherchée.

Relecture de la PR #29 : bandeau de langue et barre empilés au lieu d'être superposés.

- Choix : la barre se pose juste au-dessus du bandeau. Le bandeau est déjà là quand on
  choisit le second geste ; il ne bouge pas, et la barre monte dans la place libre au lieu de
  pousser vers le haut un élément qu'on était en train de lire. Le bandeau reste où il est sur
  toutes les autres pages. La barre et son « Comparer » restent à portée du pouce, juste
  au-dessus. Bandeau fermé, la barre redescend tout en bas (transition de 0,2 s, aucune en
  mouvement réduit).
- Mécanique : le bandeau publie la place qu'il occupe (hauteur + décalage du bas, 1 rem sur
  grand écran) dans `--language-banner-space`, la barre la sienne dans
  `--compare-bar-space` (ResizeObserver tous les deux). La barre se place à
  `bottom: var(--language-banner-space)`. La marge du bas de page et le
  `scroll-padding-bottom` additionnent les deux tant que la barre est là (`globals.css`,
  `:has([data-compare-bar])`).
- Bout en bout : navigateur en anglais sur /comparer, bandeau visible, deux gestes : les deux
  sont visibles, la barre finit au-dessus du bandeau (aucun chevauchement), la marge couvre
  les deux, le pied de page reste au-dessus de la barre, axe. Bandeau fermé : la barre reprend
  le bas de l'écran et la marge ne garde que sa hauteur. En anglais (par le lien du bandeau) :
  pas de bandeau, barre en bas, axe. Chromium et WebKit.

### 2026-10-07 — Corrections UX : espèces, « Raconte ta journée », Mon jardin (fix/especes-raconte)

Demande de Guillaume, cinq points :

1. Fiche d'espèce : la croix est remplacée par une flèche retour en haut à gauche (« Retour
   aux espèces », aussi en info-bulle), qui fait la même chose que « Retour aux espèces »,
   désormais en bas de la fiche. Sur la grille, la croix reste ; son nom et son info-bulle :
   « Fermer : le jardin choisira » / “Close: the garden will choose”.
2. « Raconte ta journée » avec plusieurs plantes : une seule feuille, compteur « 0 / N
   plantes » (région polite : « 1 plante choisie sur 3 »), une place par plante. « Ajouter
   … » remplit la première place vide, la même espèce peut revenir (« ×2 » sur la carte),
   chaque place se retire (« Retirer le pommier (plante 1) »). « Planter » est `aria-disabled`
   tant qu'une place est vide ; « Le jardin choisit le reste » plante tout de suite, les
   places vides au tirage habituel (le tirage dépend de l'id de l'entrée : il ne peut pas
   s'afficher dans une place avant). La croix et Échap font de même : les choix faits sont
   gardés. Les espèces vont aux nouvelles plantes dans l'ordre des choix légers.
3. /comparer : carte discrète « Plus rapide : raconte ta journée » / “Quicker: tell us about
   your day” sous la sélection, après le bouton Comparer, seulement si l'IA est active (`GET
/api/raconte`, question partagée avec l'écran : `useRaconteAvailability`). Elle remplace
   l'ancien `RaconteLink` en bas de l'écran (un seul point d'entrée). En anglais, « us » et
   non « me » : le nom validé de la fonction est “Tell us about your day”. Le serveur de test
   statique répond `{ enabled: false }` à `GET /api/raconte`, comme une fonction coupée
   (sinon chaque page /comparer écrirait un 404 en console).
4. /jardin : « Faire pousser une plante » / « Compare deux gestes du quotidien » juste sous
   le jardin (après le message du prochain animal), tomate, pleine largeur, vers /comparer.
   Texte encre : le blanc sur tomate ne fait que 3,3:1, l'encre 5,3:1 (paire déjà vérifiée par
   le test du thème, emplacement ajouté). « Mes habitudes » reste dessous, séparée. Le jardin
   vide perd son second lien « Comparer deux gestes ».
5. /jardin : le lien « Comparer » en haut à gauche devient le nom du site, avec le composant
   `Logo` déjà utilisé sur le duel et les résultats, vers / ou /en. Nom accessible « Le poids
   des choses – Accueil » / « – Home » (et non « Accueil » seul : le texte visible doit
   figurer dans le nom, WCAG 2.5.3) ; changé pour tous les `Logo`. Les pages de texte et
   /saison gardent leur « ← Retour » vers l'accueil : à harmoniser si besoin.

Bout en bout : `e2e/especes.spec.ts` (flèche, croix, FR et EN), `e2e/raconte.spec.ts`
(plusieurs plantes : même espèce deux fois, retirer, « Planter », « Le jardin choisit le
reste », anglais ; carte sur /comparer ; le faux modèle reconnaît aussi « second-hand
jeans »), `e2e/raccourcis.spec.ts` (carte avec IA active ou coupée, en-tête et bouton de
/jardin, FR et EN, axe).

PR #29 (barre « Comparer ») n'était pas encore fusionnée : cette branche part de main sans
elle. La carte est dans le flux de la page, sous le bouton : la marge réservée par la barre
la garde visible. Conflit attendu dans `GestureChooser.tsx` à la fusion de la seconde PR.

Relecture de la PR #30 (même jour) :

- PR #29 fusionnée : main repris dans la branche (fusion, sans réécriture). Conflit de
  `GestureChooser.tsx` résolu : version de main (fragment, `CompareBar`) avec la carte
  `RaconteQuickLink` après l'habitude déclarée et sans l'ancien `RaconteLink`. Nouveau test :
  barre et carte ensemble (FR et EN) ; défilée jusqu'à elle, puis tout en bas de la page, la
  carte reste entière au-dessus de la barre, rien ne la recouvre en son centre, axe.
- Validés par Guillaume : « Le poids des choses – Accueil » et « Quicker: tell us about your
  day ».
- Pages de texte (méthode, mentions légales, confidentialité, FR et EN) et /saison : `Logo`
  remplace « ← Retour ». `Logo` passe dans son propre fichier client
  (`src/components/ui/Logo.tsx`), utilisable depuis `ContentPage`, composant serveur ; la
  prop `locale` de `ContentPage` disparaît (le `Logo` lit la langue lui-même). « Raconte ta
  journée » (« ← Comparer ») et le carnet (« ← Mon jardin ») gardent leur retour : il mène à
  une page nommée, pas à l'accueil.
- Lighthouse : `pnpm serve:out` lance `e2e/static-server.mjs` sur le port 4322 (paquet
  `serve` retiré). Premier passage : performance 76 sur /comparer et /jardin (LCP 7,5 s) : le
  serveur de test ne compressait pas, alors que `serve` et Cloudflare compressent ; il
  compresse maintenant en gzip. `LH_PATHS` choisit les adresses.
- Lighthouse a aussi relevé une cible tactile trop petite sur /jardin : les liens « Source »
  et « Méthode » de « Le savais-tu ? », collés l'un sous l'autre quand le libellé de la
  source passe à la ligne (selon le fait du jour, d'où le 97 de main). Ils font maintenant
  24 px de haut, avec un espacement vertical ; `Logo` a une cible de 28 px.
- Scores (mobile, `SITE_LAUNCHED=1`, même serveur gzip, même machine, 3 passages ; main
  mesuré juste avant dans les mêmes conditions) :

  | Page       | Performance (main) | Accessibilité (main) | Bonnes pratiques | SEO |
  | ---------- | ------------------ | -------------------- | ---------------- | --- |
  | Accueil    | 94-99 (95-99)      | 100 (100)            | 100              | 100 |
  | Comparer   | 90-91 (92)         | 100 (100)            | 100              | 100 |
  | Mon jardin | 90-92 (92-93)      | 100 (97)             | 100              | 100 |

- Disque du poste presque plein pendant la session (de 350 Mo à 5,6 Go libres) : quelques
  tests ont échoué sur « ENOSPC: no space left on device » puis sont passés à la relance (le
  compte, en série). Les 15 Go de `/private/tmp/claude-501` viennent d'autres sessions et le
  magasin pnpm fait 9,3 Go (`pnpm store prune`) : laissés à Guillaume.

### 2026-10-07 — Cache des navigateurs Playwright en CI (chore/ci-cache-playwright)

Demande de Guillaume : l'installation des navigateurs Playwright avait pris 8 à 18 min sur le
runner (environ 1 min avant), près de la limite de 20 min du job.

- `actions/cache@v6` sur `~/.cache/ms-playwright`. Clé : `playwright-<système>-<image du
runner>-<version exacte de @playwright/test installée>`, par exemple
  `playwright-Linux-ubuntu24-1.63.0` (la version est lue dans `node_modules`, pas dans la plage
  `^1.63.0` de package.json).
- Cache trouvé : seulement `playwright install-deps chromium webkit` (paquets système, qui ne
  se mettent pas en cache) ; sinon, installation complète `install --with-deps`.
- Limite du job : 20 → 30 min, filet de sécurité.
- **À savoir** : la clé change avec la version de Playwright (et avec l'image Ubuntu). La
  première CI après une mise à jour de Playwright retélécharge les navigateurs et sera donc
  plus lente : c'est normal, les suivantes reprennent le cache.
- Mesures (PR #31, run 37603246247, même runner `ubuntu-24.04`) :

  | Passage    | Installation des navigateurs                                | Job complet |
  | ---------- | ----------------------------------------------------------- | ----------- |
  | Sans cache | 56 s (installation complète)                                | 9 min 38 s  |
  | Avec cache | 73 s (restauration du cache 5 s + dépendances système 68 s) | 8 min 37 s  |

  Cache enregistré : `playwright-Linux-ubuntu24-1.63.0`, 366 Mo.

- **Constat** : le jour de ces mesures, le téléchargement des navigateurs était rapide ; le
  cache ne fait donc rien gagner sur l'étape. Surtout, la lenteur de la veille (run 37533726382) venait des paquets système d'Ubuntu, pas des navigateurs : « Fetched 126 MB in
  17min 42s (118 kB/s) » sur le miroir apt. Ces paquets passent toujours par
  `install-deps`, cache ou non : le cache ne protège que du téléchargement des navigateurs
  (CDN de Playwright). Contre un miroir apt lent, seul le filet des 30 min protège le job ;
  mettre aussi les paquets `.deb` en cache serait l'étape suivante, si cela revient.
- Portée du cache : un cache créé sur une demande de fusion ne sert qu'à elle ; celui de `main`
  sert à toutes les branches. Le premier passage sur `main` après la fusion le recréera
  (installation complète, une fois).

### 2026-10-07 — Refonte des habitudes : arrosage ciblé (feat/habitudes-arrosage)

Demande de Guillaume, en deux temps : un plan d'abord (validé avec une modification), puis le
code. **Gel des fonctionnalités : exception validée** pour ce lot, dernier gros lot avant
les testeurs (noté dans CLAUDE.md).

Plan proposé, puis décisions :

- Ma première proposition faisait de l'arrosage ciblé un remplacement (une plante par
  habitude) : la pousse aurait été environ N fois plus lente dans un jardin de N plantes.
  **Décision : l'arrosage ciblé est un bonus.** La règle actuelle reste la base pour toutes
  les habitudes (chaque jour arrosé compte pour toutes les plantes plantées avant lui) ; en
  plus, chaque nouvelle habitude donne un arrosage à sa plante cible, au plus un par plante
  et par jour (heure de Paris). Compteur d'une plante = jours arrosés + arrosages bonus ; un
  cran tous les 3, même échelle (stade, puis épanouissement).
- Validés : cible enregistrée dans l'habitude (`plant`, choisie au moment du toucher : une
  entrée synchronisée plus tard, même datée d'avant, ne change jamais une cible passée ; un
  recalcul aurait pu faire reculer une plante) ; cible = la moins avancée, puis la plus
  proche de son prochain cran, puis la plus ancienne, parmi les plantes qui peuvent encore
  avancer et sans bonus aujourd'hui ; anciennes habitudes sans `plant` : règle de base
  seule, aucune entrée réécrite ; cas limites (jardin vide, tout épanoui, même habitude deux
  fois le même jour : `plant: null`) ; `aria-disabled` pour « Arrosée aujourd'hui ».

Règles de pousse :

- Avant : compteur = jours arrosés depuis la plantation (toutes les habitudes) ; un cran
  tous les 3.
- Après : compteur = jours arrosés depuis la plantation (inchangé) + arrosages bonus (jours
  distincts où une habitude l'a visée) ; un cran tous les 3.

Impact sur les jardins existants : **aucun ne bouge au déploiement** (aucune habitude
existante n'a de `plant`, donc aucun bonus) ; aucun n'avancera moins vite ensuite. Testé
(`src/lib/garden/arrosage.test.ts`) : empreinte de référence identique (1344701095) ; sur
30 carnets tirés (comparaisons, anciennes habitudes, habitudes ciblées vers une plante, une
inconnue ou aucune, dates dans le désordre comme après une synchro) : aucune plante ne
recule quand une entrée s'ajoute, et pour tout carnet, compteur nouveau ≥ compteur de la
règle de base, progression ≥, mêmes emplacements ; sans habitude ciblée, jardin identique.

Livré :

- Modèle : `bonusDaysByPlant`, `waterCount` / `bonusDays` par plante, `wateringTarget`,
  révélation (`target`, `targetMoved`, `targetToNext`) ; habitude `plant?: string | null`
  (validée, tolérée par les anciennes versions, gardée telle quelle par la synchro : test
  serveur). `addHabit` choisit la cible pour tous les chemins (/jardin, /comparer,
  « Raconte ta journée » : plusieurs habitudes, plusieurs plantes).
- Messages : « Tu as arrosé le pommier : il grandira au prochain arrosage. », « … : elle
  s’épanouit d’un cran. », « Et 2 autres plantes avancent d’un cran. » ; pronom ajouté aux
  fiches d'espèces (il, elle, elles ; it, they). Le message sans cible parle désormais
  d'« arrosages » au lieu de « jours arrosés » (bonus compris). En anglais, « Confirm » et non
  « Save » (le garde-fou interdit « save » partout).
- « Mes habitudes » : pastille `badge-arrosage`, premier passage en cases à cocher avec
  « Valider » dans la page et dans la barre fixe (`StickyBar`, généralisée depuis
  `CompareBar`), icônes, « Arrosée aujourd’hui » jusqu'à minuit (heure de Paris),
  « Modifier mes habitudes » / « Annuler ».
- Arrosoir (`arrosage.svg`, 80×80) au-dessus de la plante visée : apparition, inclinaison,
  gouttes 1 à 5 en décalé, fondu (environ 2,4 s) ; rien en mouvement réduit (le message
  reste). Le jardin revient à l'écran au toucher.
- Astuces de première utilisation (`FirstHint`, `lpdc:indices:v1`) : jardin vide, première
  plante, premier arrosage ; une seule fois chacune, fermées d'un geste ou par l'action ;
  annoncées sans prendre le focus.
- Dessins : `arrosage`, `badge-arrosage`, `picto-arrosoir` (144 illustrations ;
  `picto-arrosoir` sur la carte d’habitude notée quand aucune plante n’avance encore).
- /methode#habitudes (FR, EN) et `docs/methode.md` : le bonus expliqué.
- Bout en bout : `e2e/arrosage.spec.ts` (premier passage et barre, arrosoir au-dessus de la
  plante visée, deux habitudes vers deux plantes, mouvement réduit, remise à minuit avec
  l'horloge de Playwright, « Modifier » et « Annuler », astuces une seule fois, anglais,
  axe) ; `e2e/habitudes.spec.ts` réécrit pour le nouveau parcours.

Relecture de la PR #32 (même jour), deux retouches :

1. « Faire pousser une plante » : papier découpé jaune soleil (#FFC93C) au lieu de tomate,
   texte encre (paire encre / soleil du test du thème), contour encre 2 px, ombre décalée
   nette de 4 px sans flou. À gauche, la petite pousse `fleur-1-pousse` (décorative, 32 px) :
   son dessin n'occupe que 26 × 23 unités d'un cadre de 60 × 80 ; affichée telle quelle, elle
   aurait fait une dizaine de pixels, elle est donc recadrée sur son emprise
   (`PLANT_BOUNDS`, `viewBox`). Appuyé : ombre de 2 px et descente de 2 px ; rien en
   mouvement réduit. Focus : contour outremer, 3,8:1 sur le soleil et 5,4:1 sur la crème
   (deux paires ajoutées au test du thème, minimum 3:1 pour un élément non textuel).
2. Carte « De saison en octobre » / “In season in October” sous « Mes habitudes »
   (`GardenSeasonCard`) : 4 produits dessinés au plus (mêmes dessins et même choix que
   l'encart de l'accueil, `drawnForMonth`), le plus léger au kilo en une ligne
   (`seasonRange`), « Voir tous les produits de saison » vers /saison (/en/in-season) et le
   crédit des données. Mois en heure de Paris (`gardenMonth`, testé avec un appareil à New
   York le 31 octobre au soir : « novembre »). Fond blanc, titre en corps de texte, lien
   texte : rien qui rivalise avec le bouton. Aucune animation (les dessins ne flottent pas
   ici).

Bout en bout : `e2e/raccourcis.spec.ts` (couleurs, contour, ombre, pousse de 32 px, focus,
état appuyé, mouvement réduit ; carte : nombre de produits, ligne du plus léger, lien, place
sous « Mes habitudes », fuseau, mouvement réduit, anglais, axe), Chromium et WebKit.

## 2026-10-08 — Nouveau logo « Horizon-balance » (branche feat/logo)

**Demandé** : intégrer le logo livré (`le-poids-des-choses-logo-final.zip`) : favicon SVG et
PNG de secours, icône Apple, icônes de l'appli installable (dont « maskable »), emblème à
gauche du nom dans l'en-tête, image de partage du site avec texte alternatif FR/EN ; ne pas
toucher à l'image de partage du jardin ; vérifier Méthode et mentions légales.

**Fait** :

- Favicon : `embleme-petit.svg` (lien SVG `sizes="any"`, que Chrome préfère aux PNG),
  `favicon-32.png` et `favicon-16.png` en secours, `apple-touch-icon-180.png`. Les anciens
  liens envoyaient deux fois `/favicon.ico`, dont un `sizes="any"` qui faisait choisir le .ico
  à Chrome : `src/app/favicon.ico` (lien automatique de Next) devient `public/favicon.ico`
  (16, 32, 48 px, généré par `pnpm images` depuis les PNG livrés), servi sans lien.
- Manifestes FR et EN : `icone-192.png`, `icone-512.png` (aussi en `maskable` : l'emblème
  occupe un cercle de 29 % du côté, la zone sûre en tolère 40 %). Couleur de thème inchangée
  (#FFF3DC). Chrome : aucune erreur de manifeste ni d'installabilité, sur / et /en.
- En-tête (`Logo`) : emblème 28 px à gauche du nom, `embleme-petit.svg` (moins de 48 px ;
  `emblemSrc` prendrait `embleme.svg` au-delà), `alt=""` et aria-hidden, nom accessible
  inchangé. Il déborde dans la marge intérieure du lien : un en-tête d'une ligne garde sa
  hauteur, cible tactile de 28 px. Mesuré : en ligne, le nom et son emblème demandent 409 px
  sur les pages de texte françaises (373 sans emblème) ; le nom y passait déjà sur deux
  lignes à 320 et 360 px, il y passe aussi à 390 px (et sur le duel à 320 px). La coupure est
  désormais imposée au milieu, comme le logo empilé : « Le poids / des choses », jamais
  « Le poids des / choses ».
- Image de partage du site : `public/partage-1200x630.png`, la même dans les deux langues
  (nouvelle adresse : les aperçus en cache se renouvellent), `og:image:alt` et désormais
  `twitter:image:alt` dans la langue de la page (`SITE.ogAlt`). `og.png`, `og-en.png`, leur
  rendu (`ogSvg`, `OG_IMAGE_TEXT`) et `@resvg/resvg-js` retirés. Image de partage du jardin
  inchangée.
- Sources livrées gardées dans `assets/logo/` (`icone-appli.svg`, `partage-1200x630.svg`,
  `favicon-48.png`) ; `assets/icon/` retiré ; LICENSE à jour.
- Méthode et mentions légales : aucun ancien logo, rien changé.
- Bout en bout (`e2e/raccourcis.spec.ts`) : emblème décoratif, 28 px, centré sur le lien, à
  320 px sur /jardin, /methode, le duel, /en/garden, /en/in-season (coupure au milieu, pas
  de débordement, axe) ; `e2e/anglais.spec.ts` : image et textes alternatifs FR/EN.

**Vérifié** : lint, 1169 tests, build strict. Bout en bout : 330 réussis ; seul échec, le
« parcours complet » du compte (bouton resté sur « Envoi… » plus de 5 s derrière
`wrangler pages dev`), une fois sur deux dans les deux navigateurs, et autant sur `main` :
instable avant ce lot. Lighthouse mobile : / 99 · 100 · 100, /en 94 · 100 · 100
(performance, accessibilité, bonnes pratiques ; SEO 66 = noindex). Lighthouse 13 n'a plus
de catégorie PWA : installabilité vérifiée par Chrome (aucune erreur sur / et /en).
Repéré en passant, déjà sur `main` : /jardin a un décalage de mise en page de 0,50 (tout le
bloc sous l'en-tête), performance 69 ; à corriger dans une branche `fix/`.

## 2026-10-08 — Décalage de Mon jardin et test du compte (branche fix/jardin-cls)

**Demandé** : supprimer le décalage de mise en page de /jardin au chargement (CLS 0,50 ;
objectif < 0,05, performance mobile ≥ 90 sur /jardin et /en/garden), avec un test qui échoue
au-delà de 0,1 ; rendre fiable le « parcours complet » du compte, instable aussi sur `main`,
en disant si c'était le test ou l'appli.

**Trouvé (CLS)** : le carnet n'est lu qu'après l'hydratation. Trois blocs arrivaient alors au
milieu de ce qui était déjà affiché : la phrase « Encore N choix… » au-dessus du bouton
(+25 px), l'astuce du jardin vide sous le bouton (+88 px), et tout le bas de page (« Retrouve
ton jardin », habitudes…) inséré avant la carte de saison, seule rendue côté serveur. Le bloc
du bas descendait de 118 px : 0,51. Quatrième décalage, invisible pour Lighthouse (jardin
vide) : sur un téléphone qui partage, « Exporter » et « Partager » (30 px) agrandissaient la
barre du haut (0,007).

**Fait** :

- Ligne du prochain animal réservée dès le rendu serveur (espace insécable tant que le carnet
  n'est pas lu, ou s'il n'y a plus d'animal à attendre).
- Bas de page monté d'un bloc à la lecture du carnet, sous ce qui est déjà affiché : plus rien
  ne bouge (la carte de saison n'est plus rendue côté serveur ; elle arrive avec le reste).
- Boutons de partage en marge négative : la barre garde sa hauteur.
- `e2e/decalage.spec.ts` (Chromium : l'API « layout-shift » n'existe pas dans WebKit) :
  /jardin et /en/garden vides, /jardin avec un carnet, téléphone qui partage. Vérifié sur un
  build sans la correction : 0,51 (0,96 avec les boutons de partage), les 4 tests échouent ;
  le seuil de 0,1 ne voit pas les 0,007 de la barre, d'où un seuil de 0,001 pour ce cas.
- Résultat : CLS 0 partout, y compris à 320 px. Lighthouse mobile, 5 passages : /jardin 90 à
  92, /en/garden 90 à 92 (médiane 91 ; avant : 69). Le LCP reste vers 3,4 s : c'est le texte
  du bas de page, qui n'existe qu'après l'hydratation. Essayé sans gain mesurable (352 →
  349 ko de JS), puis retiré : charger à la demande la feuille de partage et « Le savais-tu ? ».
  Pour aller nettement au-delà, il faudrait rendre côté serveur l'état « jardin vide » (avec un
  script en ligne qui le masque si le carnet a des choix) : `AccountSection`, l'astuce, les
  habitudes et le fait du jour dépendent tous d'un état lu sur l'appareil ; pas fait.

**Trouvé (compte)** : c'était le **test**, pas l'appli. Les traces montrent que le bouton
restait sur « Envoi… » (Turnstile avait répondu) parce que `POST /api/auth/link` mettait
jusqu'à 5,7 s à répondre ; il revenait ensuite à son état normal (le client remet toujours le
bouton à zéro après une réponse ou une erreur). Les échecs tombaient à cinq étapes
différentes, toutes en attente du serveur local (pages à 7-8 s, synchro), avec une fois un 500
de miniflare (« Network connection lost »). Cause : quatre tests à la fois (2 workers × 2
navigateurs) sur l'unique `wrangler pages dev`. Mesuré : 3 réussites sur 8 à quatre à la fois,
16 sur 16 à deux. La CI relance une fois chaque échec (`retries: 1`), ce qui le masquait.

**Fait** : un worker par navigateur pour les projets du compte (deux tests à la fois), sans
toucher aux délais. Les 18 tests du compte passent en 1,2 min ; suite complète : 349
réussis, 0 échec, 6,3 min (9,3 min avant).

**Remarqué** : l'appel au serveur (`call`, `src/lib/sync/api.ts`) n'a pas de délai maximal :
si une requête ne répond jamais (réseau qui se fige), le bouton resterait sur « Envoi… ».
Pas observé ici, non corrigé. `server/journal.test.ts` (pagination) a dépassé une fois les
5 s de Vitest pendant la suite complète, puis a passé en 1,6 s à chaque relance.

### Suite (même jour, même branche) : délai maximal des appels, test de pagination

**Demandé** : rebaser sur `main` (logo fusionné, les deux entrées du journal gardées) ; délai
maximal d'environ 15 s sur les appels réseau des formulaires, avec bouton rendu et message
annoncé ; limite de temps dédiée pour le test de pagination de la synchro.

**Fait** :

- `src/lib/net/deadline.ts` : un `AbortController` par appel, minuteur levé une fois le corps
  de la réponse lu (une réponse dont le corps n'arrive jamais est aussi coupée). setTimeout
  plutôt que `AbortSignal.timeout`, pour que l'horloge des tests puisse l'avancer.
- Compte (`src/lib/sync/api.ts`) : lien de connexion, vérification, session, déconnexion,
  synchro, export, suppression : 15 s, nouvelle erreur `timeout`. FR « Le serveur met trop
  de temps à répondre, réessaie dans un instant. », EN “The server is taking too long to
  respond, please try again in a moment.”, dans les régions d'état `polite` déjà présentes.
  Une synchro coupée garde sa file d'attente et repart à la synchro suivante.
- « Raconte ta journée » (`src/lib/raconte/api.ts`) : 20 s et non 15 : le serveur attend déjà
  Claude jusqu'à 15 s, après Turnstile et les compteurs ; couper à 15 s perdrait des réponses
  arrivées à temps. Message terminé comme tous ceux de l'écran (règle testée : toujours une
  autre voie) : « …, réessaie dans un instant, ou choisis tes gestes toi-même. » / “…,
  please try again in a moment, or choose your actions yourself.” L'erreur est maintenant
  annoncée par la région d'état du formulaire, toujours présente ; l'encadré visible perd son
  rôle `status` (inséré avec son texte, il n'était pas annoncé à coup sûr ; plus de double
  annonce).
- Partage : aucun appel au serveur (l'image est dessinée sur l'appareil), rien à faire. La
  question « Raconte est-il actif ? » (`GET /api/raconte`) n'est pas un formulaire : inchangée.
- Tests : `src/lib/sync/api.test.ts` (requête sans réponse : `timeout` à 15 s et pas avant ;
  synchro et export ; corps qui n'arrive jamais ; panne réseau toujours `offline` ; réponse à
  temps jamais coupée ensuite), `src/lib/raconte/api.test.ts` (20 s, pas coupée à 15 s) ;
  `e2e/delai.spec.ts` (Chromium et WebKit, horloge de Playwright, requête jamais servie) :
  /jardin et /en/garden (lien), /raconte et /en/your-day, bouton rendu, texte gardé, message
  dans une région `polite`, axe.
- `server/journal.test.ts` : 30 s pour le seul test de pagination (1,6 s seul, plus de 5 s
  quand toute la suite tourne).

**Pour plus tard** : rendu serveur de l'état jardin vide pour améliorer le LCP de /jardin
(~3,4 s).

## 2026-10-08 — « Les animaux parlent » (branche feat/animaux-parlent)

**Demandé** : toucher un animal du jardin (papillon, coccinelle, oiseau, escargot, renard)
ouvre une conversation façon jeu vidéo ; amitié par chapitres, une nouvelle réplique par
jour ; sommeil ; liste accessible « Les habitants du jardin » ; contenu typé FR/EN avec
répliques et portraits provisoires (les vrais arriveront plus tard). Exception au gel des
fonctionnalités, validée par l'utilisateur (notée dans CLAUDE.md).

**Fait** :

- Contenu : `src/content/animaux/` (types, un fichier par animal, 8 répliques provisoires
  « [Réplique provisoire N · chapitre C] » / “[Placeholder line N · chapter C]”, dont une
  conditionnelle chacun : papillon au printemps, coccinelle si une églantine est plantée,
  oiseau en hiver, escargot en automne, renard la nuit ; 2 répliques de sommeil, 3 « déjà
  parlé »). Une langue oubliée fait échouer les types, donc le build ; garde-fou bloquant
  dans `scripts/check-data.ts` (ids, chapitres, conditions, faits sourcés) ; les répliques
  provisoires sont seulement signalées (la CI construit en mode strict). Sources :
  `docs/animaux-sources.md`, vide pour l'instant (aucun fait dans les répliques provisoires).
- Amitié (`src/lib/friends`, pure et testée) dans `lpdc:amis:v1`, sur l'appareil seulement.
  Écart à la demande : la présentation (chapitre 1) passe toujours en premier, même si une
  conditionnelle est vraie (sinon un escargot rencontré en automne commencerait par sa
  réplique d'automne, avant de se présenter).
- Conversation (`AnimalTalk`) : feuille en bas, portrait provisoire (illustration du jardin
  agrandie, 96 px / 140 px), étiquette du nom, texte lettre à lettre (28 ms par lettre).
- Zones de toucher (`TalkTargets`) : vrais boutons hors de l'image, au moins 44 px
  (en pixels, quelle que soit la largeur de l'écran), recentrés à chaque image sur le dessin
  de l'animal, transformations comprises (marche de la coccinelle, vol de l'oiseau, rafales).
- Oiseau : choix fait, le toucher ouvre la conversation (plus d'envol au toucher) ; pas
  d'envol spontané pendant une conversation ; à sa fermeture, il reprend son envol (s'il
  peut voler : réveillé, pas sur Nuit encre, mouvement normal). Le bouton « Faire s'envoler
  l'oiseau » et son texte sont retirés ; le labo explique le nouveau comportement.
- Endormi = dessiné endormi : « Zzz » (pseudo-élément CSS, décoratif, axe ne le mesure pas),
  réplique de sommeil, rien n'avance. Le renard d'un jardin assoupi la nuit reste dessiné
  éveillé (visiteurs immobiles « tels quels ») : il parle normalement.
- « Les habitants du jardin » sous « Mes habitudes » : portrait, nom, progression, « Parler »
  (même nom accessible que la zone de la scène) ou la raison de son absence ; inconnus :
  « ? ». Le renard est « rencontré » dès qu'il a été dans la scène.
- Tests : unitaires (amitié, contenu, sources) ; `e2e/animaux.spec.ts` (Chromium et WebKit :
  ouverture, focus, Échap / croix / toucher en dehors, zones de 44 px qui suivent, une
  réplique par jour avec l'horloge de Playwright et minuit à Paris, conditionnelle
  « églantine », sommeil, liste, anglais, mouvement réduit, axe) ; `bird.spec.ts` réécrit.

**Complément (même jour)** : portraits livrés (`le-poids-des-choses-portraits.zip`) et
répliques en étapes.

- Portraits : 15 fichiers `portrait-{animal}-{content|surpris|dort}.svg` dans
  `public/portraits/`, affichés en `<img>` décoratif (ils ont un `id` de clipPath, interdit
  dans `public/illustrations/`, et dessinent eux-mêmes leur cadre et leur « Zzz ») ; les
  trois expressions sont superposées, fondu de 200 ms, rien en mouvement réduit ; LICENSE.
- Format : `steps: [{ expr, fr, en }]`, 1 à 3 étapes, pour les répliques, le sommeil
  (« dort » obligatoire, vérifié au build) et « déjà parlé ». Noms de champs en anglais
  (`chapter`, `steps`) selon la règle du code ; le vrai contenu reçu en `chapitre` / `etapes`
  sera converti. Répliques provisoires gardées, de 1 à 3 étapes pour tester.
- Conversation : « Suite ▶ » / “Next ▶”, puis « Fermer » / “Close” à la dernière étape ;
  toucher la boîte finit d'écrire, puis passe à l'étape suivante, sans jamais fermer (choix :
  un toucher ne doit pas faire perdre une étape à moitié lue). Focus sur ce bouton dès
  l'ouverture, remis dessus à chaque étape (Safari ne donne pas le focus à un bouton
  touché). Chaque étape est annoncée par une région polie, qui décrit aussi la fenêtre.
- Amitié : une réplique entière par jour, pas une étape (testé).
- Zones de toucher : la boucle de suivi lit d'abord, écrit ensuite, une image sur trois, et
  s'arrête hors écran ; mesuré sous WebKit, sans effet sur la durée des tests (5,5 s avec,
  6,0 s sans).

**Pas de synchro du compte pour ce lot** : `lpdc:amis:v1` reste sur l'appareil (pas dans le
carnet, ni dans l'export, ni en D1). À prévoir si l'amitié doit suivre la personne.

**À venir** : les vraies répliques (avec leurs sources pour les faits) et les portraits.

### Vrai contenu (même jour, même branche)

**Demandé** : intégrer `animaux-dialogues.json` (textes mot pour mot), vérifier chaque source
avec une citation exacte et une deuxième source quand c'est possible, trouver une source plus
solide pour la queue du renard, ne compter que les répliques sans condition, vérifier quand
chaque animal est dessiné endormi, retirer l'`id` des portraits.

**Fait** :

- Conversion du JSON vers `src/content/animaux/*.ts` (`chapitre` → `chapter`, `etapes` →
  `steps`, `condition.saison` / `nuit` / `espece` → `season` / `night` / `planted`,
  `sommeilSource` → `sleepSourceId`, `dejaParle` → `again`). Textes inchangés. Espèces :
  olivier → `arbre-4`, lavande → `fleur-5`, pommier → `arbre-1` ; aucune condition sans
  correspondance. Les six `kind` du fichier sont gardés tels quels.
- Sources : `docs/animaux-sources.md` réécrit, une citation exacte par fait et une deuxième
  source pour la plupart (voir la colonne « Remarques »). Vikidia refuse les robots : lu par
  son API (révisions notées). « renard-queue » : le dossier d'une ferme pédagogique est
  remplacé par la National Wildlife Federation (_Ranger Rick_, 2013) et New Hampshire PBS ;
  réplique gardée.
- Doutes signalés, textes non modifiés : nombre d'œufs de la mésange (9 à 13 chez Vikidia, 6
  à 12 chez Futura ; ois-3 dit « Treize ! ») ; dents de la radula (1 500 à 2 500 chez
  Vikidia, 12 000 à 14 000 sur des sites de vulgarisation) ; vitesse de l'escargot (seule
  source, dans une devinette) ; « goût âcre » (coc-3) quand les sources disent « âpre » ;
  ouïe du renard « mieux que n'importe quel mammifère terrestre » (seule source).
- Sommeil : l'oiseau la nuit, l'escargot l'hiver, et les deux quand le jardin s'assoupit ;
  le renard le jour ; papillon et coccinelle jamais (ils s'absentent) : pas de répliques de
  sommeil pour eux (les répliques de secours proposées ne servent pas).
- Compteur : seulement les répliques sans condition (6 par animal) ; testé N sur N sans
  aucune conditionnelle.
- Portraits : le `clipPath` (seul `id`) retiré des 15 SVG, coins arrondis en CSS ; testé
  (aucun `id`, chaque expression utilisée a son portrait).
- Tests stabilisés : « toucher la boîte » (horloge de la page figée avant d'ouvrir, sinon une
  première étape courte avait déjà fini de s'écrire) ; `e2e/delai.spec.ts` (instable sous
  WebKit, environ une fois sur trois : l'horloge de la page continuait d'avancer en temps
  réel et une page lente sautait les 15 s ; elle est maintenant figée, le temps n'avance que
  par le test, et reprend avant axe). 32 sur 32 en répétition, suite complète 389 sur 389.
- CI : « une nouvelle réplique par jour » (quatre conversations d'affilée) dépassait 30 s sous
  le WebKit de la CI ; coupé en deux scénarios indépendants (le même jour ; le passage de
  minuit, à partir d'une amitié commencée la veille), délais inchangés.

### Arbitrage des doutes (même jour, même branche)

Règle de l'utilisateur : ne garder que ce que toutes les sources confirment. Textes remplacés
par les formulations fournies : ois-3 (« souvent une dizaine d'œufs », « Une dizaine ! »),
esc-4 étape 2 (« des milliers de minuscules dents »), esc-3 étape 1 (« quelques centimètres
par minute »), coc-3 (« goût âpre », “tastes harsh”), ren-2 étape 2 (« une ouïe incroyable,
surtout pour les sons très graves ») ; queue du renard gardée (NWF, New Hampshire PBS).
`docs/animaux-sources.md` : citations qui appuient les nouvelles formulations ; « des milliers
de dents » confirmé par le Muséum d'histoire naturelle de Los Angeles. Vitesse de l'escargot :
aucune source fiable ne confirme seule « quelques centimètres par minute » (1,7 cm/min au plus
pour l'université d'Exeter, 6 cm pour Vikidia, 10 à 15 cm en course, jusqu'à 80 cm dans le
Physics Factbook ; Wikipédia semble se tromper d'un facteur 10 sur sa propre source) : signalé.

- Test « toucher l'oiseau » : horloge figée avant l'ouverture, comme « toucher la boîte » (même course sous WebKit).

### Vitesse de l'escargot (même jour, même branche)

esc-3, étape 1 : « Je fais à peu près un mètre par heure, au mieux. » / “I manage about a
metre an hour, at best.” (étapes 2 et 3 inchangées). Nouvelle source `escargot-exeter` : le
communiqué de l'université d'Exeter du 23 août 2013 (« reaching a top speed of one metre per
hour », et la bave des autres escargots qui les aide à avancer), avec Vikidia (mucus) et la
dépêche AAP en deuxième source ; la note de doute est retirée.

**Pour plus tard (non traité)** : en CI, les tests « petit choix : une petite pousse, agrandie
dans la vitrine… » (`e2e/journeys.spec.ts`) et « le sélecteur de langue garde la page, les
paramètres et l'ancre » (`e2e/anglais.spec.ts`) ne passent parfois qu'au second essai.

- Point ouvert, déjà sur `main` (logo #33 + CLS #34) : sur un téléphone qui partage, avec un
  carnet, « Exporter » et « Partager » arrivent après l'hydratation ; le nom et son emblème
  n'ont plus la place sur une ligne (412 px), le nom passe sur deux lignes et tout le haut de
  /jardin descend de 20 px (CLS 0,053). `e2e/decalage.spec.ts` ne le voit qu'une fois sur
  huit (selon le chargement des polices). Choix de mise en page à faire.

## 2026-10-09 — Lot de stabilité avant les testeurs (branche fix/stabilite)

Production : le déploiement Cloudflare du commit de fusion de #35 (`8db5f44`) a réussi.

### 1. Polices locales

**Demandé** : ne plus dépendre de Google Fonts au build (le build Cloudflare de #35 avait
échoué en téléchargeant DM Sans), sans rien changer au rendu ni au poids.

**Fait** : `src/app/fonts.ts` passe à `next/font/local`. Les cinq fichiers woff2 (Bricolage
Grotesque 800 : latin, latin étendu, vietnamien ; DM Sans 400/600 variable : latin, latin
étendu) sont ceux que Google Fonts sert, téléchargés sur `fonts.gstatic.com` et vérifiés
octet pour octet contre ceux que le site servait. Un appel `localFont` par sous-ensemble, même
nom de famille déclaré, même plage unicode, même `font-stretch`, `display: swap`, latin seul
préchargé. Deux écarts de `next/font/local` contournés : la variable CSS prendrait le nom de
la constante et le repli serait recalculé depuis le fichier (Bricolage 82,39 % au lieu de
88,21 %) ; variables `--font-bricolage` / `--font-dm-sans` et polices de repli déclarées dans
`globals.css` aux valeurs exactes d'avant. Licences OFL (dépôt google/fonts) et README dans
`assets/fonts` ; les TTF qui servaient à l'ancienne image de partage (plus utilisés) sont
retirés. Vérifié : aucune requête vers Google, ni au build ni dans `out/` ; mêmes deux
fichiers chargés par page (58,8 ko), captures identiques à `main` au pixel près.

### 2. Décalage de l'en-tête de /jardin

**Demandé** : la hauteur de l'en-tête ne dépend jamais de son contenu ; sur téléphone, nom
toujours sur deux lignes ; Exporter et Partager sans rien pousser, en icônes s'il manque de la
place ; ordinateur inchangé ; test qui reproduit le défaut à chaque fois.

**Fait** : `Logo stacked` (deuxième moitié du nom en bloc sous `lg`) ; ligne d'en-tête de
hauteur fixe ; boutons regroupés à droite, conteneur en marge négative ; libellés masqués
visuellement (gardés pour les lecteurs d'écran) sous 340 px utiles et sur ordinateur, où les
boutons deviennent des ronds de 30 px avec une zone de toucher de 44 px (pseudo-élément) ;
icône « Exporter » dessinée en pendant de `partager.svg`, seulement en mode icône. Mesuré de
320 à 430 px : titre à 78,8 px dans tous les cas (avant : 58,4 puis 78,8 quand les boutons
arrivaient) ; à 390 px, les pastilles avec libellé tiennent ; ordinateur : nom sur une ligne,
captures identiques à `main` au pixel près (y compris /jardin). Choix signalé : sur ordinateur
avec écran tactile ou appli installée, Exporter et Partager s'affichent en icônes (sinon le
nom ne tiendrait pas sur une ligne).

**Test** : `e2e/decalage.spec.ts` compare la position de mise en page du titre (offsetTop,
sans l'animation d'arrivée) et le nombre de lignes du nom entre « sans carnet » et
« téléphone qui partage, avec un carnet », à 320 et 412 px, Chromium et WebKit, plus CLS = 0
(Chromium), noms accessibles et zone de toucher. Sur `main`, l'écart de 20 px apparaît à
chaque mesure ; sur la branche, 80 passages sur 80. `e2e/anglais.spec.ts` : le nom coupé
sur deux lignes est accepté comme nom du site.

### 3. Tests instables

**« petit choix… vitrine »** (`e2e/journeys.spec.ts`) — cause : le test lisait l'épaisseur de
référence du trait dans la vitrine dès qu'elle passait sous 3 px, pendant que la pousse
grandissait encore (avec dépassement, `back.out`) ; sous charge la valeur lue était fausse et
la comparaison avec le jardin ne convergeait pas (échec de la CI). Second risque : l'éclat du
jardin, visible environ 1 s peu après l'arrivée, n'était guetté qu'après plusieurs
vérifications. Correctif (test) : épaisseur lue une fois immobile (deux lectures égales à deux
images d'écart), éclat guetté dès avant de cliquer « Aller la planter » (navigation dans la
même page) et noté s'il a brillé. 40 sur 40 (Chromium et WebKit, 20 fois chacun).

**« le sélecteur de langue garde la page »** (`e2e/anglais.spec.ts`) — cause : le sélecteur
recharge toute la page, et le test naviguait de nouveau dès que l'adresse avait changé, page
encore en chargement et préchargements de Next en cours ; WebKit signalait en console les
requêtes interrompues (« due to access control checks ») ou refusait la navigation suivante
(« WebKit encountered an internal error », vu en CI). Correctif (test) : attendre le chargement
de la page puis le réseau au repos avant chaque navigation. 40 sur 40. Pas un bug de l'appli ;
à noter tout de même : un clic sur le sélecteur avant l'hydratation suivrait le lien brut, sans
les paramètres ni l'ancre (l'export statique ne les connaît pas) ; jamais observé en 40 essais.

**En plus : « appuyé : le bouton descend de 2 px »** (`e2e/raccourcis.spec.ts`, instable aussi) —
deux causes : la position de départ était prise pendant l'animation d'arrivée de la page
(glissement de 8 px), corrigé en attendant sa fin réelle (`getAnimations().finished`) ; sous
WebKit en émulation iPhone, `:active` ne tient pas pendant un appui prolongé à la souris (12 fois
sur 12), limite de l'outil (un vrai iPhone le déclenche au toucher) : test limité à Chromium,
raison écrite dans le test. 20 sur 20 sous Chromium.

**En plus : « carnet : graphique de la semaine »** (`e2e/carnet.spec.ts`) — échoue chaque nuit
entre minuit et 2 h (Paris) : les entrées étaient datées « à midi, heure de la machine », encore
à venir pour le navigateur des tests (fuseau où il est midi). Datées maintenant « il y a N
jours » à partir de l'instant présent. Vu en lançant la suite à 0 h 05 ; 40 sur 40 ensuite.

**En plus : « bandeau d'installation en mode iPhone »** (`e2e/journeys.spec.ts`, WebKit) — même
cause que le sélecteur de langue : rechargement pendant les préchargements du pied de page.
Attente du réseau au repos avant de recharger.

## 2026-10-09 — Finitions avant les testeurs (branche feat/finitions-testeurs)

**Demandé** : quatre commits (portraits v3 ; l'écureuil et l'abeille parlent ; le jardin au
fil des saisons ; accueil pour quelqu'un qui revient), puis toutes les vérifications, la PR
et la preview.

### 1. Portraits v3

21 portraits (7 animaux × content, surpris, dort) depuis `le-poids-des-choses-portraits-v3.zip`
: papillon et oiseau raccord avec le jardin, écureuil et abeille nouveaux. Figma avait ajouté
un `mask` (coins arrondis) et un `clipPath` (cadre) par fichier : retirés (script dans
`.tmp/`), coins arrondis en CSS comme avant. Rendu comparé à `apercu-portraits.png` : identique.
Test : exactement 21 portraits, aucun `id` ; LICENSE précise les 21.

### 2. L'écureuil et l'abeille parlent — en attente

`animaux-dialogues-ecureuil-abeille.json` n'est ni dans ~/Downloads ni ailleurs sur le disque
(recherche Spotlight) : commit non fait, en attente du fichier. Ce qui est déjà vérifié dans
le code : l'**écureuil** est un visiteur d'automne seulement (septembre à novembre), présent de
jour comme de nuit, jamais dessiné endormi (pas de dessin endormi ; jardin assoupi : visiteurs
gardés, immobiles), et il peut être écarté par le plafond de 4 visiteurs ; l'**abeille** est
débloquée au 12e choix léger, présente au printemps, en été et en automne, le jour seulement,
absente l'hiver, la nuit et quand le jardin s'assoupit : jamais dessinée endormie (sa réplique
de sommeil sera gardée sans être affichée). Condition « ete » pour l'écureuil : jamais vraie
(il n'est là qu'en automne) ; à signaler si le fichier l'utilise pour lui.

### 3. Le jardin au fil des saisons

**Avant** : caducs en aplat tomate à l'automne (pousse non recolorée), blancs cernés d'encre
l'hiver, épanouissement caché l'hiver ; persistants inchangés ; fleurs : couleur inchangée,
épanouissement caché l'hiver pour marguerite, lavande et pissenlit (pas pour églantine,
tulipe, herbes folles), neige au sol et flocons pour tous.

**Fait** :

- `src/lib/garden/foliage.ts` : dégradés de la planche (pommier orange → rouille, cerisier
  rouge → bordeaux, figuier jaune → or) avec hauteurs par stade (figuier : hauteurs de la
  planche ramenées au dessin réduit à 0,85 du jardin) ; hiver : branches nues du JSON pour
  pommier et cerisier adultes, bourgeons seuls pour le figuier adulte (ses branches sont dans
  son tronc), proposition pour « pousse » (tige, deux brindilles, trois bourgeons) et « jeune »
  (branches de l'adulte ramenées au houppier, cinq bourgeons ; figuier : trois bourgeons).
- Dégradé créé par le code (aucun `id` dans les SVG publiés) : un dégradé par forme, avec
  l'inverse de la transformation de la forme (les feuilles du figuier sont tournées et
  agrandies : sans cela, le dégradé de la planche, en `userSpaceOnUse`, tombait tout entier
  hors des feuilles ; c'est d'ailleurs ce que montre l'aperçu livré, où le figuier d'automne
  est uni). Matrices partagées avec l'extraction des emprises (`src/lib/geometry/matrix.ts`).
  Même rendu dans l'image de partage.
- Toucher un arbre endormi sur /jardin : « Le pommier dort jusqu’au printemps. » (bulle et
  région polie), zone de 44 px au moins, un arrêt du clavier par espèce.
- Fiche d'un arbre : bloc « Au fil des saisons » (maquette, nœud 84:326) ; sapin : « garde ses
  aiguilles » plutôt que « feuilles ». Astuce avant la grille au premier choix d'espèce
  (`saisons-especes`), astuce par saison sur /jardin construite avec les arbres du jardin
  (`saison-automne-2026`…, une fois par saison). /methode#habitudes et `docs/methode.md`.
- Sources : `docs/especes-sources.md`, « Au fil des saisons ». Couleurs : figuier (jaune)
  confirmé ; cerisier : rouge chez la RHS et Wikipédia, jaune orangé pour la Ville de Paris ;
  pommier : jaune ou jaune-brun dans les trois sources, la planche est plus orangée en haut
  (signalé, intégré). Les bourgeons verts sont un code du dessin (dans la réalité, plutôt
  bruns) : aucun texte ne l'affirme.
- Transitions entre saisons : aucune animation (le changement se fait au chargement), donc
  rien à couper en mouvement réduit.

**Pour la V3, noté sans le faire — « 4 saisons, le jardin s'endort »** :

- fleurs en sommeil l'hiver : une rosette de feuilles au ras du sol avec un « Zzz » (esquisse
  Figma, « Idée V3 · fleur endormie », nœud 87:39) ;
- des invités par saison (rouge-gorge, houx, perce-neige en hiver, etc.) avec leurs répliques.

### 4. Accueil pour quelqu'un qui revient

Carnet d'au moins une entrée sur l'appareil : « Retrouver mon jardin » (/jardin) en action
principale, « Faire pousser une plante » (/comparer, même cible que le bouton jaune de
/jardin, vérifié) en secondaire, « Comment ça marche ? » ; le petit lien « J’ai déjà un
jardin ? Le retrouver » disparaît (doublon). Script en ligne qui pose `data-garden` sur <html>
avant les boutons ; les deux versions dans la même case de grille, la cachée en `invisible` :
même hauteur. Tests : CLS = 0 avec et sans jardin, attribut présent dès `DOMContentLoaded`,
même boîte, anglais (“Back to my garden”, “Grow a plant”).

### Suite (même jour) : l'écureuil et l'abeille, arbitrages

**Reçu** : `animaux-dialogues-ecureuil-abeille.json` (version corrigée : ecu-c1 devient une
réplique d'automne). Arbitrages de Guillaume sur les saisons.

**Fait** :

- Commit 2 : contenu converti (`src/content/animaux/ecureuil.ts`, `abeille.ts`), textes mot
  pour mot ; conditions : écureuil « automne » (ecu-c1, ecu-c2) et sapin (`arbre-5`) ;
  abeille « ete » (abe-c1, voulu), « printemps » et lavande (`fleur-5`). L'abeille rejoint les
  animaux débloqués qui parlent ; l'écureuil rejoint le renard parmi les visiteurs qui parlent
  (`TALKING_VISITORS`) : zones de toucher, « Les habitants du jardin » (rencontré dès qu'il est
  passé ; hors de l'automne, « Pas là en cette saison »), compteur sur 6 pour les deux.
  Répliques de sommeil gardées sans être affichées (aucun des deux n'est dessiné endormi).
  Le test « N sur N sans conditionnelle » choisit désormais, pour chaque animal, une saison
  qu'aucune de ses répliques n'attend (l'abeille a des répliques d'été et de printemps).
- Sources (`docs/animaux-sources.md`) : les quatre sources du fichier lues, chaque citation
  confirmée mot pour mot ; deuxièmes sources : Wikipédia (écureuil roux : n'hiberne pas,
  pinceaux plus visibles en hiver, nid, queue-balancier), Trees for Life, Iowa DNR
  (incisives), NC State Extension (danse et soleil), _Plants_ 2020 (coquelicot et
  ultraviolets), Vikidia (durée de vie), Humanité et Biodiversité (espèces, sol). Doutes :
  1 000 à 1 500 fleurs de trèfle (Larousse seul) ; « environ 38 jours » (Larousse seul,
  d'autres sources disent cinq à six ou six à sept semaines) ; coquelicot : vrai des
  coquelicots d'Europe centrale ; « plusieurs milliers de graines » (Futura seul) ;
  « près de 1 000 » espèces contre « plus de 1 000 » chez Humanité et Biodiversité.
- Pommier : dégradé d'automne du jaune au brun (#F2B73A → #9A5B2B), comme les sources.
- Astuce d'automne : « L’olivier, lui, ne change pas. » / « Le sapin et l’olivier, eux, ne
  changent pas. » (EN “stays the same” / “stay the same”). Astuce du premier choix
  d'espèce : « d’autres gardent leur feuillage » (au lieu de « leurs feuilles ») pour inclure
  le sapin. Fiche du sapin et bloc « Au fil des saisons » : déjà « aiguilles ».
- Bourgeons verts : gardés (code du dessin).

**CI** : le nouveau test « l'abeille et l'écureuil parlent aussi » a échoué sous WebKit en CI
(deux fois) : la zone de l'abeille, qui vole sans arrêt, n'était jamais « stable » pour le clic
de Playwright. Cause : le test, pas l'appli. Correctif : la zone est vérifiée (taille, posée sur
le dessin) et la conversation s'ouvre depuis la ligne de « Les habitants du jardin » ; 20 sur
20 en local (Chromium et WebKit).

**Pour le prochain lot (non corrigé)** : deux tests ont échoué une fois puis réussi à la
relance pendant ce lot, à rendre fiables : « premier passage : liste à cases, barre
« Valider » fixe… » (`e2e/arrosage.spec.ts`, Chromium) et « en-tête de /jardin à 320 px :
même hauteur sans carnet et avec Exporter et Partager » (`e2e/decalage.spec.ts`, WebKit).

### Retouches (même jour)

- abe-c1, étape 1 : « En été, une ouvrière comme moi ne vit que quelques semaines. » / “In
  summer, a worker like me only lives a few weeks.” (étape 2 inchangée) ; appuyée sur
  Larousse (38 jours en été) et Vikidia (six à sept semaines) ; le doute est retiré.
- Coquelicot : `docs/animaux-sources.md` précise que l'étude de _Plants_ porte sur les
  coquelicots d'Europe centrale, de la même espèce (_Papaver rhoeas_) que ceux de France, et
  non sur ceux de la Méditerranée orientale.

## 2026-10-10 (soir) — Lot « Comparer plus » (branche feat/comparer-plus)

**Demandé** (exception au gel validée le 10 octobre) : nouveaux gestes et pictos d'après le
CSV ADEME, catégorie « Équiper la maison », recherche dans Comparer, duels prêts à jouer et Duel
du jour, mini-duel sur l'accueil (une devinette), « Comment ça marche », tests et docs.
Maquettes : page « Accueil v2 · duels » (v2b), notes de conception 105:170.

**Méthode décidée en cours de lot** : pour l'électroménager, la valeur du CSV compte surtout
l'usage (lave-linge : 513 kg, dont 341 de fabrication, 217 d'électricité sur 12 ans, −45 de fin
de vie). Choix de Guillaume : « neuf » = part fabrication (champ `footprint` de l'API détaillée
Impact CO2), sans usage ni fin de vie ; « écart de fabrication » affiché ; phrase dans
/methode#appareils. Le mobilier n'a pas d'usage : valeur du CSV.

**Catalogue** : 31 gestes ajoutés (65 en tout), une variante par geste (variantes écartées dans
`docs/gestes-sources.md`). Écartés : console de jeux et montre connectée (absentes du CSV) ;
avion moyen, moyen à long et long-courrier (au-delà du curseur de 1 000 km). Occasion livrée :
colis du CSV par objet (hypothèse de taille, comme avant) ; aucun pour lave-linge,
réfrigérateur, lave-vaisselle, four, canapé, lit, table, armoire (plus de 30 kg) : neuf,
d'occasion (sans colis) et garder. Les valeurs des 34 gestes d'avant sont identiques au CSV du
5 octobre. « Raconte ta journée » ne reconnaît pas encore les nouveaux gestes (consignes et
évaluation inchangées, `NOT_YET_RECOGNIZED`).

**Objets déjà en ligne, valeur du CSV (non corrigés, à décider)** — fabrication / usage / fin de
vie, d'après l'API détaillée : jean 25,09 = 23,20 / 1,25 / 0,64 ; t-shirt 6,43 = 5,20 / 0,98 /
0,25 ; pull en laine 56,70 = 52,90 / 2,52 / 1,28 ; chaussures de sport 20,13 = 18,70 / 0 / 1,43 ;
smartphone 80,16 = 79,27 / 0,64 / 0,25 ; ordinateur portable 192,6 = 182,3 / 7,53 / 2,79 ;
télévision 369,7 = 328,3 / 29,55 / 11,9. Nouveaux objets gardés à la valeur du CSV : manteau
101,4 = 85,8 / 13,2 / 2,4 ; robe 56,91 = 49,8 / 5,81 / 1,29 ; chemise 13,23 = 11,2 / 1,57 /
0,46 ; sweat 32,49 = 27,4 / 3,58 / 1,52 ; tablette 87,14 = 83,93 / 2,84 / 0,36 ; écran 92,57 =
65,89 / 22,73 / 3,95 ; box 81,23 = 61,41 / 18,19 / 1,63 ; casque VR 72,59 = 70,73 / 0,19 /
1,68. /methode dit que l'usage des appareils n'est pas compté : vrai pour l'électroménager
seulement.

**Comparer** : duels prêts à jouer en haut (8, Duel du jour d'abord), puis « Ou compose ton
duel », la recherche (FR et EN, sans accents), puis les catégories. Paris–Marseille : 752 km,
moitié des 1 504 km du cas pratique ADEME « A/R Paris - Marseille en TGV ». La maquette 105:2
mettait la recherche au-dessus des duels : la consigne écrite (duels, recherche, catégories) a
été suivie. Pas de lien « Tout voir » dans Comparer (tous les duels y sont déjà).

**Accueil** : le haut ne bouge pas ; le mini-duel remplace l'encart de saison (descendu en bas).
La balance du héros est à l'équilibre, puis penche (même calcul que le duel). Mauvaise réponse :
« Pas tout à fait : c'est le vélo le plus léger. », sans l'étiquette « Bien vu ! ». Sur mobile,
l'illustration reste au-dessus du texte (ordre actuel gardé, la maquette 103:2 la plaçait après
les boutons). Le lien « Comment ça marche ? » du héros mène maintenant à la section de
l'accueil (il menait à /methode). Phrases de la maquette vérifiées : « l'écart de CO₂ » →
« l'écart en CO2e » ; « les arbres suivent les vraies saisons » → « le jardin suit les vraies
saisons » (olivier et sapin ne changent pas). Mesures (Lighthouse mobile, médianes, même
session, en alternance) : `/` 2,42 s sur `main` contre 2,56 s, `/en` 2,42 s contre 2,11 s, CLS 0
partout ; écarts dans le bruit de la machine (même FCP, 0,76 s). Pour ne pas alourdir
l'accueil : mini-duel et cartes calculés au rendu serveur, illustrations de « Comment ça
marche » chargées à la demande sur ordinateur seulement.

**Typographie** : espace fine insécable (U+202F) avant « : », « ? », « ! » dans les textes de
ce lot ; le reste du site garde l'espace ordinaire (à harmoniser plus tard si voulu).

**Hors périmètre, noté** : mode trajet, usages numériques et « Surprenant » (notes de
conception : après les testeurs) ; ouvrir les nouveaux gestes à « Raconte ta journée » ;
harmoniser la valeur des objets numériques et textiles.

### Suite (même soir, même branche) : décisions sur la PR #39

**Décidé par Guillaume** : une seule règle pour les objets (« neuf » = fabrication seule, champ
`footprint` de l'API détaillée, pour les vêtements, le numérique, l'électroménager et le
mobilier ; le mobilier a son détail : fabrication = valeur du CSV) ; nouvelle phrase de
/methode#appareils et liste « Ce qui n'est pas compté » mise en accord ; Comparer selon la
maquette 105:2 (recherche, duels, catégories) ; aide du mini-duel « l'écart s'affiche » ; lien
« Tout sur la méthode » à la fin de « Comment ça marche ».

**Carnet** : chaque choix garde l'écart calculé au moment du choix (`avoidedKg`) ; jardin,
carnet, paliers, pastille et image de partage lisent cette valeur, jamais recalculée. Aucun
ancien choix ne change ; rien n'est réécrit. Seuls les encadrés « Le savais-tu ? » sur les
objets (calculés avec les données du moment) montrent les nouvelles valeurs.

**Objets en ligne, « neuf » affiché (kg CO2e), avant → après** : jean 25,09 → 23,2 ; t-shirt
6,434 → 5,2 ; pull 56,7 → 52,9 ; chaussures 20,13 → 18,7 ; smartphone 80,16 → 79,27 ;
ordinateur portable 192,6 → 182,3 ; télévision 369,7 → 328,3. Nouveaux : manteau 85,8, robe
49,8, chemise 11,2, sweat 27,4, tablette 83,93, écran 65,89, box 61,41, casque VR 70,73.

**Pour plus tard** :

- « Raconte ta journée » et les nouveaux gestes : leur écrire des lignes de reconnaissance et
  des alternatives, puis relancer `pnpm raconte:eval` (`NOT_YET_RECOGNIZED` aujourd'hui).
- Espace fine insécable (U+202F) avant « : », « ? », « ! » sur tout le site (seuls les textes
  du lot « Comparer plus » l'ont).
- Tests instables, à ajouter à la liste : « premier choix d'espèce : astuce des saisons, une
  seule fois ; fiche « Au fil des saisons » » (`e2e/feuillage.spec.ts`, WebKit), relancé une
  fois en CI sur la PR #39, passé à la relance ; cause non cherchée.
