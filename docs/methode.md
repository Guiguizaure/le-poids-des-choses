# Méthode (brouillon)

> La version publiée est la page /methode (`src/app/methode/page.tsx`), d'après la
> maquette 06. Ce brouillon garde le raisonnement détaillé.

Ce document décrit ce que le site compte, ce qu'il ne compte pas, et les hypothèses de
calcul. Brouillon à relire avant le lancement ; à reprendre dans une page « Méthode » du site.

## Données

- Facteurs d'émission : CSV public Impact CO2 (ADEME), `pnpm build-gestures`. Chaque valeur
  garde son identifiant (`sourceId`) et sa page (`sourceUrl`). Projet indépendant, non affilié
  à l'ADEME.
- Les valeurs sont des ordres de grandeur arrondis (4 chiffres significatifs).

## Objets : trois façons de les avoir

| Mode              | Valeur                                             | Origine                                           |
| ----------------- | -------------------------------------------------- | ------------------------------------------------- |
| Neuf              | valeur du CSV (électroménager : fabrication seule) | `impactco2` (`impactco2-fabrication`)             |
| D'occasion        | 0 kg                                               | hypothèse `hypothese-occasion`                    |
| D'occasion, livré | 0 kg de fabrication + 1 colis                      | hypothèse + ligne « Livraison à domicile » du CSV |
| Garder le mien    | 0 kg                                               | hypothèse `hypothese-garder`                      |

Le CSV ne contient aucune ligne « occasion », « reconditionné » ou « seconde main » : la
valeur d'occasion n'est donc pas mesurée, c'est une hypothèse.

## Appareils : seule la fabrication est comptée

Pour l'électroménager (« Équiper la maison », lot du 10 octobre 2026), la valeur du CSV
additionne fabrication, usage (électricité sur 8 à 12 ans) et fin de vie. Le site ne compte que
la fabrication (champ `footprint` de l'API détaillée Impact CO2, voir
`docs/gestes-sources.md`) : l'électricité, on la consomme que l'appareil soit neuf ou gardé.
Le mobilier n'a pas d'usage : sa valeur reste celle du CSV. Phrase publiée dans
/methode#appareils.

Limite connue, non corrigée (décision à prendre) : pour le numérique et l'habillement, la
valeur du CSV comprend aussi un peu d'usage et de fin de vie (télévision : 29,6 kg d'usage sur
369,7 ; détail objet par objet dans le journal du 10 octobre 2026), alors que /methode dit que
l'usage des appareils n'est pas compté.

## Hypothèse « occasion = pas de nouvelle fabrication »

Acheter un objet déjà fabriqué n'entraîne pas de nouvelle fabrication : on compte 0 kg pour
la fabrication. C'est un choix de lecture « à la marge » (ce qu'on provoque en plus avec cet
achat), pas une mesure du cycle de vie de l'objet.

## Ce qui est compté

- La fabrication d'un objet neuf (valeur du CSV, qui inclut les étapes amont de l'objet
  selon la méthode de l'ADEME).
- Pour « d'occasion, livré » : l'envoi d'un colis, ligne « Livraison à domicile » du CSV,
  dont le poids est choisi par objet (1 kg, 2 kg ou 15 kg, voir `PARCEL_BY_GESTURE_ID` dans
  `scripts/build-gestures.ts`). Ce choix de taille est une hypothèse. Au-delà du plus gros colis
  du CSV (30 kg : lave-linge, réfrigérateur, lave-vaisselle, four, canapé, lit, table, armoire),
  pas d'option « d'occasion, livré ».

## Ce qui n'est pas compté

- Le trajet pour aller acheter d'occasion (friperie, brocante, remise en main propre).
- L'entretien, le lavage, la réparation ou la remise en état d'un objet, neuf ou non.
- La fin de vie (revente, don, déchet) et le transport du neuf jusqu'au magasin au-delà de
  ce que contient déjà la valeur du CSV.
- L'usage de l'objet (électricité d'un téléviseur, etc.) : le site compare l'acquisition.

## Limite : répartition entre plusieurs vies d'un objet

Un objet d'occasion a déjà eu une première vie. Mettre 0 kg de fabrication suppose que
l'empreinte a été « payée » par le premier propriétaire. D'autres méthodes répartissent
l'empreinte de fabrication entre tous les utilisateurs successifs (ou selon la durée
d'usage), ce qui donnerait une valeur non nulle à l'occasion. Notre choix est favorable à
l'occasion et ne dit rien de la durée de vie réelle. À mentionner honnêtement sur le site.

## Habitudes : aucun kg, le jardin est arrosé

- Une habitude (« Tenir une habitude ») est un geste noté sans comparaison : un repas
  végétarien, le vélo pour le travail. Sans comparaison, pas d'écart : elle ne compte aucun
  kg, n'entre ni dans le total, ni dans les paliers, ni dans les choix légers (animaux,
  ciels). Seuls les gestes de la table `HABITS` (`src/lib/habits`) peuvent l'être ; un test
  vérifie, avec les données, que chacun est plus léger que l'option qu'il remplace dans
  `ALTERNATIVES`.
- Elle arrose le jardin : un « jour arrosé » est un jour (heure de Paris) où au moins une
  habitude est notée ; il compte pour toutes les plantes déjà là. En plus, chaque habitude
  touchée arrose en bonus une plante (la moins avancée, puis la plus proche de son prochain
  cran, puis la plus ancienne ; au plus un bonus par plante et par jour ; une même habitude
  une fois par jour). Chaque plante avance d'un cran tous les `WATER_DAYS_PER_STEP` (3,
  provisoire) arrosages (jours arrosés depuis sa plantation + bonus) : pousse → jeune →
  grand (arbres), pousse → fleurie (fleurs), puis épanouissement 1, 2 et 3. C'est une règle
  de jeu, pas une mesure.
- Saisons (hémisphère nord, d'après le mois) : un décor seulement. L'hiver, l'épanouissement
  des arbres caducs dort (niveau gardé, rien d'affiché) jusqu'au printemps. Les caducs
  (pommier, cerisier, figuier) prennent leur dégradé d'automne, puis dorment l'hiver, sans
  feuilles, avec des bourgeons ; les persistants ne changent pas (sources :
  `docs/especes-sources.md`, « Au fil des saisons »).

## Jardin vivant : visiteurs et nuit

- Les plantes ne meurent jamais et un animal installé n'est jamais perdu : selon la saison
  et l'heure, il est seulement absent pour un temps ou endormi.
- Des visiteurs de saison et de la nuit (hibou, renard) apparaissent d'eux-mêmes : ils ne se
  débloquent pas et ne comptent nulle part.
- De 21 h à 6 h (heure de l'appareil), le jardin passe en Nuit encre. Un décor : aucun
  chiffre ne change.

## Version anglaise

La version anglaise (`/en`) ne change aucune valeur : seuls les noms passent par des tables
(gestes, produits de saison, catégories, animaux, visiteurs), et les nombres sont écrits à
l'anglaise (point décimal). Les phrases anglaises disent « difference » là où le français dit
« écart » ; « gap » n'apparaît que dans les explications de /en/method. Le crédit reste celui
demandé par l'ADEME, traduit : « Data: Impact CO2 – ADEME ». Les fiches Impact CO2 vers
lesquelles renvoient les faits sont en français.
