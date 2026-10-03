# Conventions SVG

Règles pour les illustrations exportées d'Illustrator, rangées dans `public/illustrations/`.

## Structure

- **Un calque ou groupe par élément qui bouge.** Ce qui est animé ou affiché
  conditionnellement doit avoir son propre groupe.
- **Noms en minuscules avec tirets**, en anglais ou en français selon l'élément mais sans
  accents ni espaces : `arbre-1-feuillage`, `balance-plateau-gauche`.
- **Les états vivent dans des groupes séparés** : `arbre-1-pousse` (en train de pousser),
  `arbre-1-grand` (adulte). Le code bascule d'un groupe à l'autre, il ne déforme pas un
  seul dessin.
- **Une scène par fichier**, avec le **même plan de travail** (mêmes dimensions) pour
  tous les fichiers, afin de pouvoir les superposer.

## Export Illustrator

- Style CSS : **« Attributs de présentation »** (et non « Éléments `<style>` » ni
  « Attributs de style »), pour pouvoir surcharger les couleurs depuis le code.
- Les `id` des calques sont conservés tels que nommés ci-dessus.
- Pas de texte vectorisé inutile, pas de métadonnées Illustrator.
