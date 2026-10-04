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

## 2026-10-05 — Lot 5 : le parcours de comparaison (branche feat/duel)

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

**Ajustements après relecture (2026-10-05)** :

- Objets : « aucune nouvelle fabrication » remplace « zéro émission » pour « garder » et
  « d’occasion sans colis » (hypothèse de méthode : entretien et fin de vie non comptés) ;
  « zéro émission » reste réservé à la marche.
- Avion : libellé « Avion », précision « trajet court » (nouveau champ `detail` des gestes,
  réglé dans `scripts/build-gestures.ts`, données régénérées), affichée sous le libellé dans
  les cartes des écrans 02 et 03.
- Gardés : pastille sur le 03b, textes ajoutés de l'étape 2.

## 2026-10-05 — Lot 5b : retours de test (branche feat/feedback-1)

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

**Ajustements après relecture (2026-10-05)** :

- 14 pictos « Boire » et « Se faire livrer » intégrés depuis
  `le-poids-des-choses-pictos-boire-livrer.zip` (64×64, `fond` et `objet`) ; contrat à 68
  illustrations, `PENDING_PICTOS` vidé, `docs/illustrations-a-fournir.md` vidé ; test :
  plus aucun geste sur `picto-generique` (vérifié aussi dans Chrome).
- Objets : libellés courts dans les cartes (« Smartphone », « Jean »…). Les titres du carnet
  tirent désormais l'accord de `objectNoun` (« Télévision gardée plutôt que neuve »).
- Pas de Click & Collect.

## 2026-10-05 — Lot 5c : retours de test (branche feat/feedback-2)

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

## 2026-10-05 — Lot 6 : pages et finitions (branche feat/pages)

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

## 2026-10-05 — Lot 7 : qualité avant lancement (branche feat/quality)

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

## 2026-10-05 — Lot 5d : révélation et micro-interactions (branche feat/reveal)

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
