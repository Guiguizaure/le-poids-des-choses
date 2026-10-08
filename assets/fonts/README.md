# Polices du site

Chargées par `src/app/fonts.ts` (`next/font/local`) : le build ne télécharge rien. Ce sont
les fichiers que Google Fonts sert (API CSS `css2`, `display=swap`), enregistrés tels quels le
8 octobre 2026 : mêmes octets que ceux que `next/font/google` servait jusqu'ici, donc même
rendu et même poids. Un fichier par sous-ensemble (sa plage unicode est dans `fonts.ts`) ; seul
le latin est préchargé, les autres ne se chargent que si un caractère de leur plage apparaît.

- Bricolage Grotesque, graisse 800 (Google Fonts v9) — © 2022 The Bricolage Grotesque Project
  Authors (https://github.com/ateliertriay/bricolage) ; licence : `OFL-BricolageGrotesque.txt`.
- DM Sans, graisses 400 et 600, un même fichier variable (Google Fonts v17) — © 2014 The DM Sans
  Project Authors (https://github.com/googlefonts/dm-fonts) ; licence : `OFL-DMSans.txt`.

Licences : SIL Open Font License 1.1, textes repris du dépôt officiel
https://github.com/google/fonts (`ofl/bricolagegrotesque/OFL.txt`, `ofl/dmsans/OFL.txt`).

| Fichier                                    | Police                               | Sous-ensemble | Octets | SHA-256 (début)    | Source                                                                                                                                                       |
| ------------------------------------------ | ------------------------------------ | ------------- | ------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `bricolage-grotesque-800-vietnamese.woff2` | Bricolage Grotesque 800              | vietnamese    | 5096   | `74ffc1451ca0802a` | https://fonts.gstatic.com/s/bricolagegrotesque/v9/3y9U6as8bTXq_nANBjzKo3IeZx8z6up5BeSl5jBNz_19PpbpMXuECpwUxJBOm_OJWiaaD30YfKfjZZoLvZvl-MUlss4MHt0GOSj5.woff2 |
| `bricolage-grotesque-800-latin-ext.woff2`  | Bricolage Grotesque 800              | latin-ext     | 10572  | `61e63568b1e77584` | https://fonts.gstatic.com/s/bricolagegrotesque/v9/3y9U6as8bTXq_nANBjzKo3IeZx8z6up5BeSl5jBNz_19PpbpMXuECpwUxJBOm_OJWiaaD30YfKfjZZoLvZvl-MQlss4MHt0GOSj5.woff2 |
| `bricolage-grotesque-800-latin.woff2`      | Bricolage Grotesque 800              | latin         | 21820  | `1786311c41bb9261` | https://fonts.gstatic.com/s/bricolagegrotesque/v9/3y9U6as8bTXq_nANBjzKo3IeZx8z6up5BeSl5jBNz_19PpbpMXuECpwUxJBOm_OJWiaaD30YfKfjZZoLvZvl-Molss4MHt0GOQ.woff2   |
| `dm-sans-latin-ext.woff2`                  | DM Sans 400 et 600 (police variable) | latin-ext     | 18192  | `219b02c7d8884817` | https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu6-K6z9mXgjU0.woff2                                                                 |
| `dm-sans-latin.woff2`                      | DM Sans 400 et 600 (police variable) | latin         | 36980  | `468d56b6b25b05b7` | https://fonts.gstatic.com/s/dmsans/v17/rP2Yp2ywxg089UriI5-g4vlH9VoD8Cmcqbu0-K6z9mXg.woff2                                                                    |

Pour mettre à jour : interroger `https://fonts.googleapis.com/css2?family=…&display=swap` avec
un navigateur récent (woff2), télécharger les fichiers `fonts.gstatic.com`, reporter les
plages unicode dans `fonts.ts`, puis vérifier le rendu (les valeurs des polices de repli sont
dans `globals.css`).
