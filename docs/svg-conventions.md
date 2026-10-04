# Conventions SVG

Règles pour les illustrations rangées dans `public/illustrations/`. Le contrat exact (taille,
point d'appui, calques attendus de chaque fichier) est dans `src/lib/illustrations/specs.ts` :
`pnpm illustrations` (et donc `pnpm build`) échoue si un fichier manque, est en trop, n'a pas
la bonne taille ou perd un calque attendu. On peut redessiner librement tant que les noms de
fichiers, les tailles et les noms de calques sont gardés.

## Structure

- **Un calque ou groupe par élément qui bouge**, nommé en minuscules avec tirets, sans accents
  ni espaces : `feuillage`, `plateau-gauche`, `aile-droite`.
- **Un fichier par stade**, dans le même cadre : `arbre-1-pousse`, `arbre-1-jeune`,
  `arbre-1-grand` ; `fleur-1-pousse`, `fleur-1-fleurie`. Le code fait le fondu d'un fichier à
  l'autre, il ne déforme pas un seul dessin.
- **Une scène par fichier**, avec toujours le même cadre pour une même famille, afin de
  pouvoir les superposer.

## Tailles et points d'appui

Coordonnées en unités du SVG (origine en haut à gauche).

| Famille                                | Cadre     | Point d'appui et calques                                                                                                                                                      |
| -------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scene-paysage`                        | 390 × 300 | `ciel`, `soleil`, `nuage-1`, `nuage-2`, `colline-arriere`, `colline-avant`, `sol`                                                                                             |
| `balance`                              | 280 × 170 | pivot du fléau en **140,40** ; plateaux accrochés aux extrémités du fléau, en **40,40** et **240,40** ; `socle`, `mat`, `fleau`, `plateau-gauche`, `plateau-droit`            |
| `arbre-{1,2,3}-{pousse,jeune,grand}`   | 120 × 160 | pied en **60,156** ; pousse : `tige`, `feuilles` ; jeune et grand : `tronc`, `feuillage`                                                                                      |
| `fleur-{1,2,3}-{pousse,fleurie}`       | 60 × 80   | pied en **30,78** ; calques selon la fleur (voir `specs.ts`)                                                                                                                  |
| `oiseau`, `oiseau-endormi`, `papillon` | 64 × 48   | papillon : corps sur l'axe **x = 32** (les ailes battent autour) ; `aile-gauche`, `aile-droite`, `corps` ; oiseau : `queue`, `corps`, `tete`, `bec`, `oeil`, `aile`, `pattes` |
| `picto-…`                              | 64 × 64   | groupes `fond` et `objet`                                                                                                                                                     |
| `brume`                                | 390 × 120 | `brume-1`, `brume-2`, `brume-3`                                                                                                                                               |
| `eclat`                                | 80 × 80   | traits rayonnant depuis **40,50** ; `eclat-traits`                                                                                                                            |

Les animations s'appuient sur ces points : la plante pousse depuis son pied, le fléau tourne
autour du pivot et les plateaux suivent ses extrémités, le feuillage se balance depuis sa base.

## Export depuis Figma

1. Sélectionner le **cadre nommé** (son nom devient le nom du fichier : `arbre-1-pousse`).
2. Exporter au format **SVG**.
3. Cocher **« Inclure l'attribut id »** : les noms de calques deviennent les `id`.
4. Déposer le fichier dans `public/illustrations/`, puis lancer `pnpm illustrations`.

Garder les couleurs en attributs de présentation (`fill`, `stroke`), pas de texte non
vectorisé, pas d'image intégrée.

## Ce que fait la conversion

`scripts/build-illustrations.ts` transforme chaque SVG en composant React typé
(`src/components/illustrations/generated.tsx`, à ne pas modifier à la main) :

- un même SVG est affiché plusieurs fois (le jardin multiplie les arbres) : chaque attribut
  `id` devient `data-part="…"`, pour qu'il n'y ait jamais d'`id` en double dans la page ;
- les `id` référencés dans le fichier (`url(#…)`, `href="#…"` : dégradés, masques, découpes
  exportés par Figma) restent des `id`, préfixés par un identifiant propre à chaque instance ;
- les attributs sont convertis pour React (`stroke-width` → `strokeWidth`, `class` →
  `className`).

Dans le code : `<Illustration name="arbre-1-pousse" title="…" />` (sans `title`,
l'illustration est décorative et `aria-hidden`). Les animations ciblent les calques avec
`[data-part="…"]` à l'intérieur de la ref de leur instance.
