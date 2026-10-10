# Gestes du catalogue : sources

Chaque geste du catalogue (`src/lib/data/gestures.generated.json`, écrit par
`pnpm build-gestures`) vient d'une ligne du CSV public Impact CO2 (ADEME),
<https://impactco2.fr/equivalents.csv>, téléchargé le 10 octobre 2026 (les valeurs des gestes
présents avant ce jour sont identiques à celles du 5 octobre). Aucune valeur n'est écrite à la
main. Un test vérifie que chaque geste du catalogue figure ici avec son identifiant ADEME et sa
fiche (`src/lib/data/sources.test.ts`).

## Objets : fabrication seule

Pour tous les objets (vêtements, numérique, électroménager, meubles), la valeur du CSV additionne
la fabrication, l'usage (lavage, électricité sur plusieurs années) et la fin de vie. Le site ne
garde que la fabrication : champ `footprint` de l'API détaillée Impact CO2,
`https://impactco2.fr/api/v1/thematiques/ecv/{1,5,6,7}?detail=1` (numérique, habillement,
électroménager, mobilier ; mêmes identifiants que le CSV), lue le 10 octobre 2026. L'usage
existe que l'objet soit neuf ou gardé (/methode#appareils). Le mobilier a bien son détail dans
l'API : ni usage ni fin de vie, sa fabrication est égale à la valeur du CSV. Usage : par an ×
années, tels que l'API les donne.

| Objet                                      | Valeur du CSV (kg CO2e) | Fabrication (`footprint`) | Usage  | Fin de vie |
| ------------------------------------------ | ----------------------- | ------------------------- | ------ | ---------- |
| Jean (`jeans`)                             | 25,09                   | 23,20                     | 1,25   | 0,64       |
| T-shirt en coton (`tshirtencoton`)         | 6,43                    | 5,20                      | 0,98   | 0,25       |
| Pull en laine (`pullenlaine`)              | 56,70                   | 52,90                     | 2,52   | 1,28       |
| Chaussures de sport (`chaussuresdesport`)  | 20,13                   | 18,70                     | 0      | 1,43       |
| Manteau (`manteau`)                        | 101,42                  | 85,80                     | 13,22  | 2,40       |
| Robe en coton (`robeencoton`)              | 56,91                   | 49,80                     | 5,81   | 1,29       |
| Chemise en coton (`chemiseencoton`)        | 13,23                   | 11,20                     | 1,57   | 0,46       |
| Sweat en coton (`sweatencoton`)            | 32,49                   | 27,40                     | 3,58   | 1,52       |
| Smartphone (`smartphone`)                  | 80,16                   | 79,27                     | 0,64   | 0,25       |
| Ordinateur portable (`ordinateurportable`) | 192,62                  | 182,30                    | 7,53   | 2,79       |
| Télévision (`television`)                  | 369,71                  | 328,26                    | 29,55  | 11,90      |
| Tablette (`tabletteclassique`)             | 87,14                   | 83,93                     | 2,84   | 0,36       |
| Écran d’ordinateur (`ecran`)               | 92,57                   | 65,89                     | 22,73  | 3,95       |
| Box internet (`box`)                       | 81,23                   | 61,41                     | 18,19  | 1,63       |
| Casque de réalité virtuelle (`casquevr`)   | 72,59                   | 70,73                     | 0,19   | 1,68       |
| Lave-linge (`lavelinge`)                   | 513,42                  | 341,10                    | 216,96 | −44,64     |
| Réfrigérateur (`refrigirateur`)            | 338,71                  | 257,30                    | 88,32  | −6,91      |
| Lave-vaisselle (`lavevaisselle`)           | 460,79                  | 271,19                    | 219,00 | −29,40     |
| Micro-ondes (`microondes`)                 | 121,35                  | 98,34                     | 29,40  | −6,39      |
| Four électrique (`fourelectrique`)         | 272,61                  | 217,59                    | 75,57  | −20,55     |
| Aspirateur (`aspirateur`)                  | 73,43                   | 47,31                     | 29,86  | −3,74      |
| Canapé en textile (`canapetextile`)        | 179,10                  | 179,10                    | 0      | —          |
| Lit (`lit`)                                | 443,81                  | 443,81                    | 0      | —          |
| Table en bois (`tableenbois`)              | 80,22                   | 80,22                     | 0      | —          |
| Chaise en bois (`chaiseenbois`)            | 18,63                   | 18,63                     | 0      | —          |
| Armoire (`armoire`)                        | 906,88                  | 906,88                    | 0      | —          |

## Duels prêts à jouer : distance Paris–Marseille

752 km : moitié de la « Distance totale parcourue : 1504 km » du cas pratique ADEME
« A/R Paris - Marseille en TGV » (`tgv-paris-marseille`,
<https://impactco2.fr/outils/caspratiques/tgv-paris-marseille>, rubrique « Hypothèses », lue
le 10 octobre 2026). Le site compare l'avion sur la même distance, comme dans tout duel de
trajets.

## Catalogue

| Id                     | Nom                                | Catégorie         | Unité             | Id ADEME                  | kg CO2e par unité | Valeur                            | Source                                                                    |
| ---------------------- | ---------------------------------- | ----------------- | ----------------- | ------------------------- | ----------------- | --------------------------------- | ------------------------------------------------------------------------- |
| `tgv`                  | TGV                                | Se déplacer       | km (par personne) | `tgv`                     | 0,00293           | valeur du CSV                     | [fiche](https://impactco2.fr/outils/transport/tgv)                        |
| `ter`                  | TER                                | Se déplacer       | km (par personne) | `ter`                     | 0,02769           | valeur du CSV                     | [fiche](https://impactco2.fr/outils/transport/ter)                        |
| `avion`                | Avion                              | Se déplacer       | km (par personne) | `avion-courtcourrier`     | 0,2246            | valeur du CSV                     | [fiche](https://impactco2.fr/outils/transport/avion-courtcourrier)        |
| `voiture`              | Voiture thermique                  | Se déplacer       | km (par personne) | `voiturethermique`        | 0,1423            | valeur du CSV                     | [fiche](https://impactco2.fr/outils/transport/voiturethermique)           |
| `bus`                  | Bus                                | Se déplacer       | km (par personne) | `busthermique`            | 0,1224            | valeur du CSV                     | [fiche](https://impactco2.fr/outils/transport/busthermique)               |
| `metro`                | Métro                              | Se déplacer       | km (par personne) | `metro`                   | 0,00444           | valeur du CSV                     | [fiche](https://impactco2.fr/outils/transport/metro)                      |
| `velo`                 | Vélo                               | Se déplacer       | km (par personne) | `velo`                    | 0,00017           | valeur du CSV                     | [fiche](https://impactco2.fr/outils/transport/velo)                       |
| `marche`               | Marche                             | Se déplacer       | km (par personne) | `marche`                  | 0                 | valeur du CSV                     | [fiche](https://impactco2.fr/outils/transport/marche)                     |
| `voiture-electrique`   | Voiture électrique                 | Se déplacer       | km (par personne) | `voitureelectrique`       | 0,06737           | valeur du CSV                     | [fiche](https://impactco2.fr/outils/transport/voitureelectrique)          |
| `voiture-hybride`      | Voiture hybride                    | Se déplacer       | km (par personne) | `voiturehybride`          | 0,1466            | valeur du CSV                     | [fiche](https://impactco2.fr/outils/transport/voiturehybride)             |
| `covoiturage`          | Covoiturage, 2 personnes           | Se déplacer       | km (par personne) | `voiturethermique+1`      | 0,07113           | valeur du CSV                     | [fiche](https://impactco2.fr/outils/transport/voiturethermique+1)         |
| `autocar`              | Autocar                            | Se déplacer       | km (par personne) | `autocar`                 | 0,03756           | valeur du CSV                     | [fiche](https://impactco2.fr/outils/transport/autocar)                    |
| `intercites`           | Intercités                         | Se déplacer       | km (par personne) | `intercites`              | 0,00898           | valeur du CSV                     | [fiche](https://impactco2.fr/outils/transport/intercites)                 |
| `rer`                  | RER ou Transilien                  | Se déplacer       | km (par personne) | `rer`                     | 0,00978           | valeur du CSV                     | [fiche](https://impactco2.fr/outils/transport/rer)                        |
| `tram`                 | Tramway                            | Se déplacer       | km (par personne) | `tramway`                 | 0,00428           | valeur du CSV                     | [fiche](https://impactco2.fr/outils/transport/tramway)                    |
| `moto`                 | Moto                               | Se déplacer       | km (par personne) | `moto`                    | 0,2147            | valeur du CSV                     | [fiche](https://impactco2.fr/outils/transport/moto)                       |
| `scooter`              | Scooter                            | Se déplacer       | km (par personne) | `scooter`                 | 0,0763            | valeur du CSV                     | [fiche](https://impactco2.fr/outils/transport/scooter)                    |
| `trottinette`          | Trottinette électrique             | Se déplacer       | km (par personne) | `trottinette`             | 0,0249            | valeur du CSV                     | [fiche](https://impactco2.fr/outils/transport/trottinette)                |
| `velo-electrique`      | Vélo électrique                    | Se déplacer       | km (par personne) | `veloelectrique`          | 0,01095           | valeur du CSV                     | [fiche](https://impactco2.fr/outils/transport/veloelectrique)             |
| `velo-cargo`           | Vélo cargo                         | Se déplacer       | km (par personne) | `triporteurelectrique`    | 0,01483           | valeur du CSV                     | [fiche](https://impactco2.fr/outils/transport/triporteurelectrique)       |
| `repas-vegetarien`     | Repas végétarien                   | Manger            | repas             | `repasvegetarien`         | 0,85              | valeur du CSV                     | [fiche](https://impactco2.fr/outils/alimentation/repasvegetarien)         |
| `repas-vegetalien`     | Repas végétal                      | Manger            | repas             | `repasvegetalien`         | 0,54              | valeur du CSV                     | [fiche](https://impactco2.fr/outils/alimentation/repasvegetalien)         |
| `repas-poulet`         | Repas au poulet                    | Manger            | repas             | `repasavecdupoulet`       | 1,46              | valeur du CSV                     | [fiche](https://impactco2.fr/outils/alimentation/repasavecdupoulet)       |
| `repas-boeuf`          | Repas au bœuf                      | Manger            | repas             | `repasavecduboeuf`        | 4,97              | valeur du CSV                     | [fiche](https://impactco2.fr/outils/alimentation/repasavecduboeuf)        |
| `repas-poisson`        | Repas au poisson blanc (cabillaud) | Manger            | repas             | `repasavecdupoissonblanc` | 2,43              | valeur du CSV                     | [fiche](https://impactco2.fr/outils/alimentation/repasavecdupoissonblanc) |
| `jean`                 | Jean                               | S’habiller        | objet             | `jeans`                   | 23,2              | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/habillement/jeans)                    |
| `tshirt`               | T-shirt en coton                   | S’habiller        | objet             | `tshirtencoton`           | 5,2               | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/habillement/tshirtencoton)            |
| `pull`                 | Pull en laine                      | S’habiller        | objet             | `pullenlaine`             | 52,9              | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/habillement/pullenlaine)              |
| `chaussures`           | Chaussures de sport                | S’habiller        | objet             | `chaussuresdesport`       | 18,7              | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/habillement/chaussuresdesport)        |
| `manteau`              | Manteau                            | S’habiller        | objet             | `manteau`                 | 85,8              | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/habillement/manteau)                  |
| `robe`                 | Robe en coton                      | S’habiller        | objet             | `robeencoton`             | 49,8              | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/habillement/robeencoton)              |
| `chemise`              | Chemise en coton                   | S’habiller        | objet             | `chemiseencoton`          | 11,2              | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/habillement/chemiseencoton)           |
| `sweat`                | Sweat en coton                     | S’habiller        | objet             | `sweatencoton`            | 27,4              | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/habillement/sweatencoton)             |
| `smartphone`           | Smartphone                         | Numérique         | objet             | `smartphone`              | 79,27             | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/numerique/smartphone)                 |
| `ordinateur-portable`  | Ordinateur portable                | Numérique         | objet             | `ordinateurportable`      | 182,3             | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/numerique/ordinateurportable)         |
| `television`           | Télévision                         | Numérique         | objet             | `television`              | 328,3             | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/numerique/television)                 |
| `tablette`             | Tablette                           | Numérique         | objet             | `tabletteclassique`       | 83,93             | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/numerique/tabletteclassique)          |
| `ecran`                | Écran d’ordinateur                 | Numérique         | objet             | `ecran`                   | 65,89             | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/numerique/ecran)                      |
| `box-internet`         | Box internet                       | Numérique         | objet             | `box`                     | 61,41             | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/numerique/box)                        |
| `casque-vr`            | Casque de réalité virtuelle        | Numérique         | objet             | `casquevr`                | 70,73             | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/numerique/casquevr)                   |
| `lave-linge`           | Lave-linge                         | Équiper la maison | objet             | `lavelinge`               | 341,1             | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/electromenager/lavelinge)             |
| `refrigerateur`        | Réfrigérateur                      | Équiper la maison | objet             | `refrigirateur`           | 257,3             | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/electromenager/refrigirateur)         |
| `lave-vaisselle`       | Lave-vaisselle                     | Équiper la maison | objet             | `lavevaisselle`           | 271,2             | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/electromenager/lavevaisselle)         |
| `micro-ondes`          | Micro-ondes                        | Équiper la maison | objet             | `microondes`              | 98,34             | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/electromenager/microondes)            |
| `four`                 | Four électrique                    | Équiper la maison | objet             | `fourelectrique`          | 217,6             | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/electromenager/fourelectrique)        |
| `aspirateur`           | Aspirateur                         | Équiper la maison | objet             | `aspirateur`              | 47,31             | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/electromenager/aspirateur)            |
| `canape`               | Canapé en textile                  | Équiper la maison | objet             | `canapetextile`           | 179,1             | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/mobilier/canapetextile)               |
| `lit`                  | Lit                                | Équiper la maison | objet             | `lit`                     | 443,8             | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/mobilier/lit)                         |
| `table`                | Table en bois                      | Équiper la maison | objet             | `tableenbois`             | 80,22             | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/mobilier/tableenbois)                 |
| `chaise`               | Chaise en bois                     | Équiper la maison | objet             | `chaiseenbois`            | 18,63             | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/mobilier/chaiseenbois)                |
| `armoire`              | Armoire                            | Équiper la maison | objet             | `armoire`                 | 906,9             | fabrication seule (API détaillée) | [fiche](https://impactco2.fr/outils/mobilier/armoire)                     |
| `eau-robinet`          | Eau du robinet                     | Boire             | litre             | `eaudurobinet`            | 0,000132          | valeur du CSV                     | [fiche](https://impactco2.fr/outils/boisson/eaudurobinet)                 |
| `eau-bouteille`        | Eau en bouteille                   | Boire             | litre             | `eauenbouteille`          | 0,3207            | valeur du CSV                     | [fiche](https://impactco2.fr/outils/boisson/eauenbouteille)               |
| `cafe`                 | Café                               | Boire             | litre             | `cafe`                    | 0,6355            | valeur du CSV                     | [fiche](https://impactco2.fr/outils/boisson/cafe)                         |
| `the`                  | Thé                                | Boire             | litre             | `the`                     | 0,04359           | valeur du CSV                     | [fiche](https://impactco2.fr/outils/boisson/the)                          |
| `soda`                 | Soda                               | Boire             | litre             | `soda`                    | 0,4933            | valeur du CSV                     | [fiche](https://impactco2.fr/outils/boisson/soda)                         |
| `biere`                | Bière                              | Boire             | litre             | `biere`                   | 1,347             | valeur du CSV                     | [fiche](https://impactco2.fr/outils/boisson/biere)                        |
| `vin`                  | Vin                                | Boire             | litre             | `vin`                     | 1,269             | valeur du CSV                     | [fiche](https://impactco2.fr/outils/boisson/vin)                          |
| `lait-vache`           | Lait de vache                      | Boire             | litre             | `laitdevache`             | 1,151             | valeur du CSV                     | [fiche](https://impactco2.fr/outils/boisson/laitdevache)                  |
| `boisson-soja`         | Boisson au soja                    | Boire             | litre             | `soja`                    | 0,4272            | valeur du CSV                     | [fiche](https://impactco2.fr/outils/boisson/soja)                         |
| `livraison-domicile`   | Livraison à domicile               | Se faire livrer   | achat             | `livraisondomicile`       | 0,722             | valeur du CSV                     | [fiche](https://impactco2.fr/outils/livraison/livraisondomicile)          |
| `point-relais-pied`    | Point relais à pied                | Se faire livrer   | achat             | `pointrelaisdouce`        | 0,6561            | valeur du CSV                     | [fiche](https://impactco2.fr/outils/livraison/pointrelaisdouce)           |
| `point-relais-voiture` | Point relais en voiture            | Se faire livrer   | achat             | `pointrelais`             | 1,652             | valeur du CSV                     | [fiche](https://impactco2.fr/outils/livraison/pointrelais)                |
| `magasin-pied`         | En magasin à pied                  | Se faire livrer   | achat             | `magasindouce`            | 0,5448            | valeur du CSV                     | [fiche](https://impactco2.fr/outils/livraison/magasindouce)               |
| `magasin-voiture`      | En magasin en voiture              | Se faire livrer   | achat             | `magasin`                 | 4,812             | valeur du CSV                     | [fiche](https://impactco2.fr/outils/livraison/magasin)                    |

## Variantes de l'ADEME non retenues (lot « Comparer plus »)

Une seule variante par geste ; les autres restent possibles plus tard :

- covoiturage : électrique et hybride, de 2 à 5 personnes, et thermique de 3 à 5 personnes
  (`voitureelectrique+1…+4`, `voiturehybride+1…+4`, `voiturethermique+2…+4`), plus les
  variantes par taille de voiture ; retenu : thermique, 2 personnes (`voiturethermique+1`) ;
- voitures électriques, hybrides et thermiques par taille (petite, moyenne, berline, SUV ;
  essence ou diesel ; hybride rechargeable ou non) ; retenues : les valeurs moyennes
  (`voitureelectrique`, `voiturehybride`) ;
- moto de 250 cm³ ou moins (`moto-petite`) ; retenue : plus de 250 cm³ (`moto`) ;
- scooter électrique (`scooterelectrique`) ; retenu : thermique (`scooter`) ;
- bus électrique (`buselectrique`) ;
- robe en polyester ou en viscose ; retenue : en coton ;
- chemise en viscose ; retenue : en coton ;
- canapé convertible (`canapeconvertible`) ; retenu : en textile (`canapetextile`) ;
- avion moyen, moyen à long et long-courrier (`avion-moyencourrier`,
  `avion-moyenlongcourrier`, `avion-longcourrier`) : l'ADEME les donne séparément, mais pour
  des vols de plus de 1 000 km, au-delà du curseur (1 à 1 000 km) ; non ajoutés.

Pictos fournis sans ligne dans le CSV, non retenus (restent hors du dépôt) : console de jeux,
montre connectée.
