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

| Famille                                                                                                                                                                                                         | Cadre               | Point d'appui et calques                                                                                                                                                                                                                                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scene-paysage`                                                                                                                                                                                                 | 390 × 300           | `ciel`, `halo-soleil` (anneau derrière le disque, opacité 0 dans le dessin : le code l'anime), `soleil` (avec, dedans, le groupe `crateres` à l'opacité 0 : visible la nuit, la lune), `nuage-1`, `nuage-2`, `colline-arriere`, `colline-avant`, `sol`                                                     |
| `balance`                                                                                                                                                                                                       | 280 × 170           | pivot du fléau en **140,40** ; plateaux accrochés aux extrémités du fléau, en **40,40** et **240,40** ; `socle`, `mat`, `fleau`, `plateau-gauche`, `plateau-droit`                                                                                                                                         |
| `arbre-{1…6}-{pousse,jeune,grand}`                                                                                                                                                                              | 120 × 160           | pied en **60,156** ; pousse : `tige`, `feuilles` ; jeune et grand : `tronc`, `feuillage`                                                                                                                                                                                                                   |
| `fleur-{1…6}-{pousse,fleurie}`                                                                                                                                                                                  | 60 × 80             | pied en **30,78** ; calques selon la fleur (voir `specs.ts`)                                                                                                                                                                                                                                               |
| `arbre-{1…6}-grand-epanoui`, `fleur-{1…6}-fleurie-epanoui`                                                                                                                                                      | 120 × 160 / 60 × 80 | même cadre et même pied que la plante adulte, posé par-dessus ; `epanoui-1`, `epanoui-2`, `epanoui-3` : groupes EXCLUSIFS (un seul affiché, celui du niveau ; pour les arbres, le niveau 3 ne contient que les fruits). Table des espèces : `src/lib/garden/species.ts`                                    |
| `saison-hiver-neige`, `saison-hiver-flocons`                                                                                                                                                                    | 390 × 300           | même cadre que `scene-paysage` ; neige : `neige-colline-arriere`, `neige-colline-avant`, `neige-sol` (posée sous les plantes) ; flocons : `flocons` (par-dessus la scène)                                                                                                                                  |
| `saison-automne-feuille-{1,2}`, `saison-printemps-petale`                                                                                                                                                       | 16 × 16             | particules qui tombent ; feuilles : `feuille`, `nervure` ; pétale : `petale`                                                                                                                                                                                                                               |
| `rouge-gorge`, `rouge-gorge-endormi`, `cigale`, `ecureuil`, `renard`, `renard-endormi`                                                                                                                          | 64 × 48             | point d'appui au centre du bas (**32,48**) ; calques dans `specs.ts`                                                                                                                                                                                                                                       |
| `hirondelle`, `libellule`                                                                                                                                                                                       | 64 × 48             | volants, cadre centré ; hirondelle : `aile-avant`, `aile-arriere` (comme `oiseau-vol`) ; libellule : `ailes-avant`, `ailes-arriere`                                                                                                                                                                        |
| `hibou`, `hibou-endormi`                                                                                                                                                                                        | 48 × 56             | point d'appui au centre du bas (**24,56**) : il se perche sous le feuillage d'un grand arbre                                                                                                                                                                                                               |
| `perce-neige`, `houx`, `primevere`, `jonquille`, `coquelicot`, `tournesol`, `champignons`                                                                                                                       | 60 × 80             | plantes visiteuses, pied en **30,78**                                                                                                                                                                                                                                                                      |
| `etoiles`                                                                                                                                                                                                       | 390 × 300           | calque de ciel (`etoiles`), par-dessus le paysage la nuit                                                                                                                                                                                                                                                  |
| `lune`                                                                                                                                                                                                          | 64 × 64             | fournie, pas utilisée : la nuit, c'est le groupe `crateres` du soleil de `scene-paysage` qui fait la lune                                                                                                                                                                                                  |
| `oiseau`, `oiseau-endormi`, `papillon`                                                                                                                                                                          | 64 × 48             | papillon : corps sur l'axe **x = 32** (les ailes battent autour) ; `aile-gauche`, `aile-droite`, `corps` ; oiseau : `queue`, `corps`, `tete`, `bec`, `oeil`, `aile`, `pattes`                                                                                                                              |
| `abeille`, `escargot`, `escargot-endormi`, `herisson`, `herisson-endormi`                                                                                                                                       | 64 × 48             | point d'appui au centre du bas (**32,48**) ; abeille : `aile-gauche`, `aile-droite`, `corps`, `rayures`, `tete`, `oeil`, `dard` ; escargot : `corps`, `antennes`, `coquille` (endormi : `corps`, `coquille`) ; hérisson : `corps`, `piquants`, `museau`, `oeil`, `pattes` (endormi : `piquants`, `museau`) |
| `coccinelle`                                                                                                                                                                                                    | 48 × 40             | point d'appui au centre du bas (**24,40**) ; `corps`, `tete`, `pattes`, `elytre-gauche`, `elytre-droite` (les élytres pivotent depuis 24,12)                                                                                                                                                               |
| `picto-…`                                                                                                                                                                                                       | 64 × 64             | groupes `fond` et `objet`                                                                                                                                                                                                                                                                                  |
| `brume`                                                                                                                                                                                                         | 390 × 120           | `brume-1`, `brume-2`, `brume-3`                                                                                                                                                                                                                                                                            |
| `vent`                                                                                                                                                                                                          | 390 × 120           | `traits-1`, `traits-2`, `traits-3` (ils traversent la scène de gauche à droite)                                                                                                                                                                                                                            |
| `eclat`                                                                                                                                                                                                         | 80 × 80             | traits rayonnant depuis **40,50** ; `eclat-traits`                                                                                                                                                                                                                                                         |
| `saison-…` (21 produits : pomme, poire, carotte, courge, raisin, poireau, tomate, fraise, cerise, abricot, courgette, aubergine, melon, radis, asperge, petits-pois, chou, clementine, kiwi, endive, betterave) | 80 × 80             | décoratifs (encart de saison) ; calques de chaque produit dans `specs.ts` ; chaque dessin doit correspondre à un produit de `saison.generated.json` (`SEASON_DRAWINGS`, `src/lib/saison/drawn.ts`)                                                                                                         |

Les animations s'appuient sur ces points : la plante pousse depuis son pied, le fléau tourne
autour du pivot et les plateaux suivent ses extrémités, le feuillage se balance depuis sa base.

Plantes : le dessin reste DANS son cadre (rien au-dessus de y = 0 : le haut serait coupé).
L'emprise de chaque plante (`bounds.generated.ts`, vitrine de révélation) tient compte de
l'attribut `transform` d'une forme (`translate`, `rotate`, `scale`) ; ne pas poser de
`transform` sur un calque (`<g id="…">`) : les animations GSAP l'écraseraient. Le sapin
(`arbre-5-grand` et son épanouissement) a été ramené dans son cadre à l'intégration (échelle
0,85 autour du pied) : sa pointe montait à y = −20.

Le jardin pose ses plantes sur la ligne des collines de `scene-paysage` : `pnpm
illustrations` lit les chemins des calques `colline-arriere` et `colline-avant` et le
rectangle `sol` (commandes de chemin M, L, H, V, C, Z ; un arc ou une courbe quadratique fait
échouer la conversion avec un message clair).

## Export depuis Figma

1. Sélectionner le **cadre nommé** (son nom devient le nom du fichier : `arbre-1-pousse`).
2. Exporter au format **SVG**.
3. Cocher **« Inclure l'attribut id »** : les noms de calques deviennent les `id`.
4. Déposer le fichier dans `public/illustrations/`, puis lancer `pnpm illustrations`.

## Contours

Les petites bêtes (papillon, coccinelle, escargot, aile avant de l'oiseau en vol) ont un
contour encre de 1,5 avec `vector-effect="non-scaling-stroke"` sur leurs formes
principales : le trait garde environ 1,5 px à l'écran, même quand la bête est affichée
petite.

## Couleurs

Uniquement les couleurs du thème (`src/app/globals.css`) : crème #FFF3DC, encre #1F1A17,
tomate #FF4F2E, pomme #2FBF71, outremer #2D4BFF, soleil #FFC93C, rose #FF8FB1…

- **Sapin #1B6B45 est réservé aux feuilles** (`feuilles`, `feuillage` des pousses et des
  fleurs) : le vert pomme du sol les faisait disparaître.
- Le sol et les collines restent en pomme ; ne pas y poser de détail pomme.
- Les traits de `vent` sont en encre, pour se voir aussi sur le ciel crème.

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
