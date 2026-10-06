// `pnpm images` (lancé aussi par `pnpm build`) : génère les images du site depuis des SVG.
// - icônes PNG 192, 512, 512 « maskable », apple-touch-icon (180), favicon (ico + svg),
//   depuis assets/icon/icon.svg ;
// - image de partage Open Graph 1200×630 (public/og.png) : fond crème, titre, balance, jardin.
// Rendu par resvg (déterministe), avec les polices d'assets/fonts pour le texte.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";
import type { Locale } from "../src/lib/i18n/routes";
import { OG_IMAGE_TEXT } from "../src/lib/i18n/messages/common";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const FONTS = [
  "assets/fonts/BricolageGrotesque-ExtraBold.ttf",
  "assets/fonts/DMSans-Regular.ttf",
  "assets/fonts/DMSans-SemiBold.ttf",
].map((path) => new URL(path, root).pathname);

export function renderPng(svg: string, width: number): Buffer {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    font: {
      fontFiles: FONTS,
      loadSystemFonts: false,
      defaultFontFamily: "DM Sans",
    },
  });
  return resvg.render().asPng();
}

/** Icône « maskable » : le dessin réduit au centre, fond crème jusqu'aux bords. */
export function maskableSvg(icon: string): string {
  const inner = icon
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" fill="#FFF3DC"/><g transform="translate(51.2 51.2) scale(0.8)">${inner}</g></svg>`;
}

/** Fichier .ico contenant une image PNG (format accepté par tous les navigateurs récents). */
export function icoFromPng(png: Buffer, size: number): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // type : icône
  header.writeUInt16LE(1, 4); // une image
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0);
  entry.writeUInt8(size >= 256 ? 0 : size, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(6 + 16, 12);
  return Buffer.concat([header, entry, png]);
}

/** Contenu d'un SVG d'illustration, à imbriquer dans un autre SVG à la position voulue. */
function nested(name: string, x: number, y: number, width: number): string {
  const source = read(`public/illustrations/${name}.svg`);
  const viewBox = source.match(/viewBox="([^"]+)"/)?.[1] ?? "0 0 100 100";
  const [, , w, h] = viewBox.split(/\s+/).map(Number);
  const inner = source
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "");
  return `<svg x="${x}" y="${y}" width="${width}" height="${(width * h) / w}" viewBox="${viewBox}">${inner}</svg>`;
}

/** Image de partage : texte à gauche, paysage avec balance et plantes à droite. */
export function ogSvg(locale: Locale = "fr"): string {
  const t = OG_IMAGE_TEXT[locale];
  // Anglais : sous-titre discret « The weight of things » sous le nom, le reste descend.
  const shift = t.subtitle ? 30 : 0;
  const subtitle = t.subtitle
    ? `<text x="80" y="400" font-family="DM Sans" font-weight="400" font-size="28" fill="#6B625A">${t.subtitle}</text>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FFF3DC"/>
  ${nested("scene-paysage", 600, 120, 560)}
  ${nested("arbre-1-grand", 640, 268, 120)}
  ${nested("fleur-1-fleurie", 1060, 402, 70)}
  ${nested("balance", 720, 250, 330)}
  ${nested("picto-velo", 742, 318, 38)}
  ${nested("picto-voiture", 978, 318, 38)}
  ${nested("papillon", 900, 175, 54)}
  <text x="80" y="150" font-family="DM Sans" font-weight="600" font-size="22" fill="#6B625A" letter-spacing="1">${t.eyebrow}</text>
  <text font-family="Bricolage Grotesque" font-weight="800" font-size="92" fill="#1F1A17">
    <tspan x="76" y="260">Le poids</tspan><tspan x="76" y="350">des choses</tspan>
  </text>
  ${subtitle}
  <text font-family="DM Sans" font-weight="400" font-size="30" fill="#1F1A17">
    <tspan x="80" y="${430 + shift}">${t.line1}</tspan><tspan x="80" y="${472 + shift}">${t.line2}</tspan>
  </text>
  <text x="80" y="560" font-family="DM Sans" font-weight="400" font-size="20" fill="#6B625A">${t.footer}</text>
</svg>`;
}

function main() {
  const icon = read("assets/icon/icon.svg");
  mkdirSync(new URL("public/icons/", root), { recursive: true });
  const write = (path: string, data: Buffer | string) =>
    writeFileSync(new URL(path, root), data);
  write("public/icons/icon.svg", icon);
  write("public/icons/icon-192.png", renderPng(icon, 192));
  write("public/icons/icon-512.png", renderPng(icon, 512));
  write(
    "public/icons/icon-maskable-512.png",
    renderPng(maskableSvg(icon), 512),
  );
  write("public/icons/apple-touch-icon.png", renderPng(icon, 180));
  write("src/app/favicon.ico", icoFromPng(renderPng(icon, 48), 48));
  write("public/og.png", renderPng(ogSvg("fr"), 1200));
  write("public/og-en.png", renderPng(ogSvg("en"), 1200));
  console.log(
    "Icônes et images de partage générées (public/icons, public/og.png, public/og-en.png, favicon).",
  );
}

if (
  process.argv[1] &&
  import.meta.url === new URL(`file://${process.argv[1]}`).href
) {
  main();
}
