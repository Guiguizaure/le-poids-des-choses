// Carte de partage 1080×1350 (maquette Figma 41:310, variantes Éveillé 41:60 et Endormi
// 41:183) : description de dessin pure, testée sans navigateur. Le jardin y est une image
// (composeGardenSvg) ; aucun kg de CO2e, aucun choix lourd.
import { plural } from "@/lib/garden/text";
import { PALETTE } from "@/lib/garden/skies";

export const CARD = {
  width: 1080,
  height: 1350,
  /** Marge gauche des textes. */
  padX: 72,
  /** Haut de l'en-tête, écart entre ses lignes. */
  top: 64,
  gap: 20,
  /** Le jardin : la scène 390×300 à la largeur de la carte. */
  garden: { x: 0, y: 360, width: 1080, height: 831 },
  footer: { y: 1191, height: 159, padY: 44, gap: 8 },
} as const;

/** Hauteur de ligne « normale » des polices (rapport à la taille). */
const LINE = { texte: 1.302, titre: 1.23 } as const;

const PILL = { padX: 28, padY: 14, border: 3, gap: 16, size: 36 } as const;

export type ShareCardInput = {
  lightChoiceCount: number;
  /** Animaux installés (y compris ceux partis le temps du sommeil). */
  animalCount: number;
  asleep: boolean;
  /** Domaine du site (dérivé de SITE_URL), sans protocole. */
  siteHost: string;
};

export type ShareCardTexts = {
  kicker: string;
  title: string;
  /** Phrase de réveil (jardin endormi seulement). */
  wake: string | null;
  pills: [string, string];
  domain: string;
  tagline: string;
};

export function shareCardTexts(input: ShareCardInput): ShareCardTexts {
  return {
    kicker: "LE POIDS DES CHOSES",
    title: input.asleep ? "Mon jardin se repose" : "Mon jardin",
    wake: input.asleep ? "Il se réveille au prochain choix léger." : null,
    pills: [
      plural(input.lightChoiceCount, "choix léger", "choix légers"),
      plural(input.animalCount, "animal", "animaux"),
    ],
    domain: input.siteHost,
    tagline: "Chaque choix léger fait pousser quelque chose.",
  };
}

/** Familles CSS des deux polices du site (lues dans la page, voir renderShareCard). */
export type CardFonts = { titre: string; texte: string };

export type DrawOp =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
      fill: string;
      radius?: number;
      stroke?: string;
      strokeWidth?: number;
    }
  | {
      type: "text";
      text: string;
      /** Bord gauche ; y : milieu de la ligne (textBaseline « middle »). */
      x: number;
      y: number;
      font: string;
      color: string;
      letterSpacing?: number;
    }
  | { type: "garden"; x: number; y: number; width: number; height: number };

/** Largeur d'un texte dans une police (canvas.measureText dans le navigateur). */
export type Measure = (
  text: string,
  font: string,
  letterSpacing?: number,
) => number;

/** Composition de la carte, dans l'ordre de dessin (le jardin d'abord, l'en-tête par-dessus). */
export function shareCardLayout(
  input: ShareCardInput,
  measure: Measure,
  fonts: CardFonts,
): DrawOp[] {
  const texts = shareCardTexts(input);
  const ops: DrawOp[] = [
    {
      type: "rect",
      x: 0,
      y: 0,
      width: CARD.width,
      height: CARD.height,
      fill: PALETTE.creme,
    },
    { type: "garden", ...CARD.garden },
  ];

  // Pied : bandeau encre, domaine et phrase.
  const { footer } = CARD;
  const domainSize = 44;
  const taglineSize = 28;
  const domainLine = domainSize * LINE.titre;
  ops.push(
    {
      type: "rect",
      x: 0,
      y: footer.y,
      width: CARD.width,
      height: footer.height,
      fill: PALETTE.encre,
    },
    {
      type: "text",
      text: texts.domain,
      x: CARD.padX,
      y: footer.y + footer.padY + domainLine / 2,
      font: `800 ${domainSize}px ${fonts.titre}`,
      color: PALETTE.creme,
    },
    {
      type: "text",
      text: texts.tagline,
      x: CARD.padX,
      y:
        footer.y +
        footer.padY +
        domainLine +
        footer.gap +
        (taglineSize * LINE.texte) / 2,
      font: `400 ${taglineSize}px ${fonts.texte}`,
      color: PALETTE.creme,
    },
  );

  // En-tête : surtitre, titre, pastilles, phrase de réveil (empilés, 20 px d'écart).
  let y = CARD.top;
  const kickerSize = 28;
  ops.push({
    type: "text",
    text: texts.kicker,
    x: CARD.padX,
    y: y + (kickerSize * LINE.texte) / 2,
    font: `600 ${kickerSize}px ${fonts.texte}`,
    color: PALETTE.texteAttenue,
    letterSpacing: 3.36,
  });
  y += kickerSize * LINE.texte + CARD.gap;

  // Taille de la maquette (128, ou 104 endormi), réduite si le titre déborde des marges :
  // le rendu des polices du navigateur peut être plus large que celui de Figma.
  const baseSize = input.asleep ? 104 : 128;
  const maxWidth = CARD.width - 2 * CARD.padX;
  const titleWidth = measure(texts.title, `800 ${baseSize}px ${fonts.titre}`);
  const titleSize =
    titleWidth > maxWidth
      ? Math.floor((baseSize * maxWidth) / titleWidth)
      : baseSize;
  ops.push({
    type: "text",
    text: texts.title,
    x: CARD.padX,
    y: y + titleSize / 2,
    font: `800 ${titleSize}px ${fonts.titre}`,
    color: PALETTE.encre,
  });
  y += titleSize + CARD.gap;

  const pillFont = `600 ${PILL.size}px ${fonts.texte}`;
  const pillHeight = 2 * (PILL.border + PILL.padY) + PILL.size * LINE.texte;
  let x = CARD.padX;
  texts.pills.forEach((text, index) => {
    const width = 2 * (PILL.border + PILL.padX) + measure(text, pillFont);
    ops.push(
      {
        type: "rect",
        x,
        y,
        width,
        height: pillHeight,
        radius: pillHeight / 2,
        fill: index === 0 ? PALETTE.pommeDouce : PALETTE.soleil,
        stroke: PALETTE.encre,
        strokeWidth: PILL.border,
      },
      {
        type: "text",
        text,
        x: x + PILL.border + PILL.padX,
        y: y + pillHeight / 2,
        font: pillFont,
        color: PALETTE.encre,
      },
    );
    x += width + PILL.gap;
  });
  y += pillHeight + CARD.gap;

  if (texts.wake) {
    const wakeSize = 32;
    ops.push({
      type: "text",
      text: texts.wake,
      x: CARD.padX,
      y: y + (wakeSize * LINE.texte) / 2,
      font: `400 ${wakeSize}px ${fonts.texte}`,
      color: PALETTE.texteAttenue,
    });
  }
  return ops;
}

/** Domaine affiché sur la carte, dérivé de l'adresse du site (SITE_URL). */
export function siteHost(siteUrl: string): string {
  try {
    return new URL(siteUrl).host;
  } catch {
    return siteUrl.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  }
}
