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

| Mode              | Valeur                        | Origine                                           |
| ----------------- | ----------------------------- | ------------------------------------------------- |
| Neuf              | valeur du CSV                 | `impactco2`                                       |
| D'occasion        | 0 kg                          | hypothèse `hypothese-occasion`                    |
| D'occasion, livré | 0 kg de fabrication + 1 colis | hypothèse + ligne « Livraison à domicile » du CSV |
| Garder le mien    | 0 kg                          | hypothèse `hypothese-garder`                      |

Le CSV ne contient aucune ligne « occasion », « reconditionné » ou « seconde main » : la
valeur d'occasion n'est donc pas mesurée, c'est une hypothèse.

## Hypothèse « occasion = pas de nouvelle fabrication »

Acheter un objet déjà fabriqué n'entraîne pas de nouvelle fabrication : on compte 0 kg pour
la fabrication. C'est un choix de lecture « à la marge » (ce qu'on provoque en plus avec cet
achat), pas une mesure du cycle de vie de l'objet.

## Ce qui est compté

- La fabrication d'un objet neuf (valeur du CSV, qui inclut les étapes amont de l'objet
  selon la méthode de l'ADEME).
- Pour « d'occasion, livré » : l'envoi d'un colis, ligne « Livraison à domicile » du CSV,
  dont le poids est choisi par objet (1 kg, 2 kg ou 15 kg, voir `PARCEL_BY_GESTURE_ID` dans
  `scripts/build-gestures.ts`). Ce choix de taille est une hypothèse.

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
