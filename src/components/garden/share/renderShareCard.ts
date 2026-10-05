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

/** Première famille d'une pile CSS (« "DM Sans", "DM Sans Fallback" » → « "DM Sans" »). */
const primaryFamily = (stack: string) => stack.split(",")[0].trim();

/**
 * Attend que chaque police utilisée soit chargée avant de dessiner. Seule la vraie police est
 * demandée : la pile entière inclurait la police de repli de next/font (local(Arial)),
 * absente d'Android, et Chromium refuse alors tout le chargement (NetworkError). Une police
 * qui ne se charge pas n'empêche pas l'image : elle est dessinée avec la police de repli.
 */
async function loadFonts(fonts: CardFonts): Promise<void> {
  const results = await Promise.allSettled(
    [
      `800 128px ${primaryFamily(fonts.titre)}`,
      `800 44px ${primaryFamily(fonts.titre)}`,
      `600 36px ${primaryFamily(fonts.texte)}`,
      `400 28px ${primaryFamily(fonts.texte)}`,
    ].map((font) => document.fonts.load(font)),
  );
  for (const result of results)
    if (result.status === "rejected")
      console.warn("Carte de partage : police non chargée.", result.reason);
  await document.fonts.ready;
}

/** Erreur d'une étape du rendu, avec sa cause (affichée dans la console par la feuille). */
async function step<T>(name: string, run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (cause) {
    throw new Error(`Carte de partage, étape « ${name} » en échec.`, { cause });
  }
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

/**
 * Charge le SVG du jardin dans une image. Événement load plutôt que decode() (rejeté pour
 * les SVG par d'anciennes versions de Safari) ; l'adresse blob reste valide jusqu'au dessin
 * (Safari peut redessiner un SVG à la demande), la fonction rendue la libère.
 */
function svgImage(
  svg: string,
): Promise<{ image: HTMLImageElement; release: () => void }> {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  const release = () => URL.revokeObjectURL(url);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ image, release });
    image.onerror = () => {
      release();
      reject(new Error(`SVG du jardin illisible (${svg.length} caractères).`));
    };
    image.src = url;
  });
}

/** Rectangle arrondi, avec un repli pour les navigateurs sans roundRect (Safari < 16). */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, width, height, radius);
    return;
  }
  const r = Math.min(radius, width / 2, height / 2);
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
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
      if (op.radius)
        roundRect(ctx, op.x, op.y, op.width, op.height, op.radius);
      else ctx.rect(op.x, op.y, op.width, op.height);
      ctx.fillStyle = op.fill;
      ctx.fill();
      if (op.stroke && op.strokeWidth) {
        // Bordure intérieure, comme en CSS.
        const inset = op.strokeWidth / 2;
        ctx.beginPath();
        roundRect(
          ctx,
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
    step("illustrations", () => loadSources(garden)),
  ]);
  const { image, release } = await step("image du jardin", async () =>
    svgImage(
      composeGardenSvg(garden, sky, sources, {
        width: CARD.garden.width,
        height: CARD.garden.height,
      }),
    ),
  );

  const canvas = document.createElement("canvas");
  try {
    await step("dessin", async () => {
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
    });
  } finally {
    release();
  }

  return step(
    "PNG",
    () =>
      new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (blob) =>
            blob
              ? resolve(blob)
              : reject(new Error("toBlob n'a rien produit.")),
          "image/png",
        ),
      ),
  );
}
