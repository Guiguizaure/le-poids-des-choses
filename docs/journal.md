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
