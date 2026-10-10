import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";

// Couleurs lues dans le thème (src/app/globals.css) : le test suit toute modification.
const css = readFileSync(
  new URL("../../app/globals.css", import.meta.url),
  "utf8",
);
const theme = Object.fromEntries(
  [...css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [
    m[1],
    m[2],
  ]),
);

/**
 * Toutes les paires texte / fond utilisées sur le site, avec le seuil WCAG AA : 4,5 pour le
 * texte courant, 3 pour le grand texte (titres ≥ 24 px, ou ≥ 18,7 px en gras).
 */
const PAIRS: {
  text: string;
  background: string;
  minimum: number;
  where: string;
}[] = [
  {
    text: "encre",
    background: "creme",
    minimum: 4.5,
    where: "texte courant, titres",
  },
  {
    text: "encre",
    background: "blanc",
    minimum: 4.5,
    where: "cartes, feuille de résultat",
  },
  {
    text: "texte-attenue",
    background: "creme",
    minimum: 4.5,
    where: "légendes, pied de page",
  },
  {
    text: "texte-attenue",
    background: "blanc",
    minimum: 4.5,
    where: "légendes dans les cartes",
  },
  {
    text: "creme",
    background: "encre",
    minimum: 4.5,
    where: "boutons principaux, puces actives",
  },
  {
    text: "encre",
    background: "tomate-douce",
    minimum: 4.5,
    where: "pastilles « plus léger », « Mon jardin »",
  },
  {
    text: "encre",
    background: "pomme-douce",
    minimum: 4.5,
    where: "pastilles « +X kg »",
  },
  {
    text: "encre",
    background: "soleil",
    minimum: 4.5,
    where:
      "bandeau « Garde ton jardin », étiquette du mois de l’encart de saison, bouton « Faire pousser une plante », astuces",
  },
  {
    text: "encre",
    background: "tomate",
    minimum: 4.5,
    where:
      "badges « 1 » et « 2 » du choix des gestes, bouton « Faire pousser une plante » de Mon jardin",
  },
  {
    text: "outremer",
    background: "soleil",
    minimum: 3,
    where:
      "contour de focus sur le bouton « Faire pousser une plante » (élément non textuel)",
  },
  {
    text: "outremer",
    background: "creme",
    minimum: 3,
    where:
      "contour de focus autour du bouton « Faire pousser une plante », sur le fond de page",
  },
  {
    text: "encre",
    background: "lavande",
    minimum: 4.5,
    where:
      "pastille « Nouveau » de la catégorie « Équiper la maison » (jamais de texte blanc sur lavande : 3,4:1)",
  },
  {
    text: "blanc",
    background: "sapin",
    minimum: 4.5,
    where:
      "encadrés « Le savais-tu ? » (DidYouKnow : duels, jardin, fiche d'une espèce), texte, liens et contour de focus",
  },
];

describe("contraste du thème (WCAG AA)", () => {
  it("toutes les couleurs nécessaires sont dans le thème", () => {
    for (const pair of PAIRS) {
      expect(theme[pair.text], pair.text).toBeDefined();
      expect(theme[pair.background], pair.background).toBeDefined();
    }
  });
  it.each(PAIRS)(
    "$text sur $background ($where) : au moins $minimum",
    (pair) => {
      expect(
        contrastRatio(theme[pair.text], theme[pair.background]),
      ).toBeGreaterThanOrEqual(pair.minimum);
    },
  );
  it("le calcul suit la WCAG : noir sur blanc = 21, même couleur = 1", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21);
    expect(contrastRatio("#ff4f2e", "#ff4f2e")).toBeCloseTo(1);
  });
});
