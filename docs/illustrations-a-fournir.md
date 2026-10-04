# Illustrations à fournir

Pictos des nouvelles comparaisons (lot 5b). En attendant, `picto-generique` s'affiche.

Format : 64 × 64, groupes `fond` et `objet` (comme les autres pictos), export Figma avec
« Inclure l'attribut id ». Couleur de fond suggérée par famille : soleil pour « Boire »,
outremer pour « Se faire livrer » (à ton choix).

| Fichier                          | Geste                   | Catégorie       |
| -------------------------------- | ----------------------- | --------------- |
| `picto-eau-robinet.svg`          | Eau du robinet          | Boire           |
| `picto-eau-bouteille.svg`        | Eau en bouteille        | Boire           |
| `picto-cafe.svg`                 | Café                    | Boire           |
| `picto-the.svg`                  | Thé                     | Boire           |
| `picto-soda.svg`                 | Soda                    | Boire           |
| `picto-biere.svg`                | Bière                   | Boire           |
| `picto-vin.svg`                  | Vin                     | Boire           |
| `picto-lait-vache.svg`           | Lait de vache           | Boire           |
| `picto-boisson-soja.svg`         | Boisson au soja         | Boire           |
| `picto-livraison-domicile.svg`   | Livraison à domicile    | Se faire livrer |
| `picto-point-relais-pied.svg`    | Point relais à pied     | Se faire livrer |
| `picto-point-relais-voiture.svg` | Point relais en voiture | Se faire livrer |
| `picto-magasin-pied.svg`         | En magasin à pied       | Se faire livrer |
| `picto-magasin-voiture.svg`      | En magasin en voiture   | Se faire livrer |

Une fois déposés dans `public/illustrations/` : ajouter chaque nom au contrat
(`src/lib/illustrations/specs.ts`), le retirer de `PENDING_PICTOS`, puis `pnpm illustrations`.
