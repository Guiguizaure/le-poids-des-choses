"use client";

// Rendu de la carte de partage dans le navigateur : la description de dessin (shareCardLayout)
// et le jardin (composeGardenSvg) sur un canvas 1080×1350, puis un PNG.
import type { GardenState } from "@/lib/garden/model";
import type { SkyId } from "@/lib/garden/skies";
import {
  CARD,
  shareCardLayout,
  type CardFonts,
  type DrawOp,
} from "@/lib/share/card";
import {
  composeGardenSvg,
  gardenIllustrations,
  type SvgSources,
} from "@/lib/share/garden-svg";

/** Familles CSS réelles des polices du site (noms générés par next/font). */
function siteFonts(): CardFonts {
  const probe = document.createElement("span");
  probe.className = "font-titre";
  probe.hidden = true;
  document.body.append(probe);
  const titre = getComputedStyle(probe).fontFamily;
  probe.remove();
  return { titre, texte: getComputedStyle(document.body).fontFamily };
}

/** Attend que chaque police utilisée soit chargée avant de dessiner. */
async function loadFonts(fonts: CardFonts): Promise<void> {
  await Promise.all(
    [
      `800 128px ${fonts.titre}`,
      `800 44px ${fonts.titre}`,
      `600 36px ${fonts.texte}`,
      `400 28px ${fonts.texte}`,
    ].map((font) => document.fonts.load(font)),
  );
  await document.fonts.ready;
}

async function loadSources(garden: GardenState): Promise<SvgSources> {
  const names = [...new Set(gardenIllustrations(garden))];
  const entries = await Promise.all(
    names.map(async (name) => {
      const response = await fetch(`/illustrations/${name}.svg`);
      if (!response.ok) throw new Error(`Illustration ${name} introuvable.`);
      return [name, await response.text()] as const;
    }),
  );
  return Object.fromEntries(entries);
}

async function svgImage(svg: string): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return image;
  } finally {
    // L'image décodée reste utilisable après la libération de l'adresse.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}

function measureWith(ctx: CanvasRenderingContext2D) {
  return (text: string, font: string, letterSpacing = 0) => {
    ctx.font = font;
    return (
      ctx.measureText(text).width +
      letterSpacing * Math.max(0, [...text].length - 1)
    );
  };
}

function drawOp(
  ctx: CanvasRenderingContext2D,
  op: DrawOp,
  garden: HTMLImageElement,
) {
  switch (op.type) {
    case "rect": {
      ctx.beginPath();
      if (op.radius) ctx.roundRect(op.x, op.y, op.width, op.height, op.radius);
      else ctx.rect(op.x, op.y, op.width, op.height);
      ctx.fillStyle = op.fill;
      ctx.fill();
      if (op.stroke && op.strokeWidth) {
        // Bordure intérieure, comme en CSS.
        const inset = op.strokeWidth / 2;
        ctx.beginPath();
        ctx.roundRect(
          op.x + inset,
          op.y + inset,
          op.width - op.strokeWidth,
          op.height - op.strokeWidth,
          Math.max(0, (op.radius ?? 0) - inset),
        );
        ctx.lineWidth = op.strokeWidth;
        ctx.strokeStyle = op.stroke;
        ctx.stroke();
      }
      return;
    }
    case "text": {
      ctx.font = op.font;
      ctx.fillStyle = op.color;
      ctx.textBaseline = "middle";
      if (!op.letterSpacing) {
        ctx.fillText(op.text, op.x, op.y);
        return;
      }
      // Espacement des lettres dessiné à la main (pas de letterSpacing partout).
      let x = op.x;
      for (const char of op.text) {
        ctx.fillText(char, x, op.y);
        x += ctx.measureText(char).width + op.letterSpacing;
      }
      return;
    }
    case "garden":
      ctx.drawImage(garden, op.x, op.y, op.width, op.height);
  }
}

/** PNG 1080×1350 du jardin, prêt à partager. */
export async function renderShareCard({
  garden,
  sky,
  siteHost,
  unlockedCount,
}: {
  garden: GardenState;
  sky: SkyId;
  siteHost: string;
  unlockedCount: number;
}): Promise<Blob> {
  const fonts = siteFonts();
  const [, sources] = await Promise.all([
    loadFonts(fonts),
    loadSources(garden),
  ]);
  const image = await svgImage(
    composeGardenSvg(garden, sky, sources, {
      width: CARD.garden.width,
      height: CARD.garden.height,
    }),
  );

  const canvas = document.createElement("canvas");
  canvas.width = CARD.width;
  canvas.height = CARD.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponible.");
  const ops = shareCardLayout(
    {
      lightChoiceCount: garden.lightChoiceCount,
      animalCount: unlockedCount,
      asleep: garden.asleep,
      siteHost,
    },
    measureWith(ctx),
    fonts,
  );
  for (const op of ops) drawOp(ctx, op, image);

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("PNG impossible à produire.")),
      "image/png",
    ),
  );
}
