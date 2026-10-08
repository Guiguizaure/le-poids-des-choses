// `pnpm images` (lancé aussi par `pnpm build`) : favicon.ico du logo « Horizon-balance ».
// Les autres fichiers du logo sont livrés tels quels et commités :
// - public/icons : embleme.svg, embleme-petit.svg (aussi favicon SVG), favicon-16.png,
//   favicon-32.png, apple-touch-icon-180.png, icone-192.png, icone-512.png (aussi « maskable » :
//   le dessin tient dans la zone sûre) ;
// - public/partage-1200x630.png : image de partage du site (Open Graph, carte Twitter) ;
// - assets/logo : sources (icone-appli.svg, partage-1200x630.svg) et favicon-48.png.
// Le .ico (16, 32 et 48 px, en PNG) sert aux clients qui demandent /favicon.ico sans lire la page.
import { readFileSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);

/** Fichier .ico contenant des images PNG (format accepté par tous les navigateurs récents). */
export function icoFromPngs(images: { png: Buffer; size: number }[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // type : icône
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ png, size }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map(({ png }) => png)]);
}

function main() {
  const png = (path: string) => readFileSync(new URL(path, root));
  writeFileSync(
    new URL("public/favicon.ico", root),
    icoFromPngs([
      { png: png("public/icons/favicon-16.png"), size: 16 },
      { png: png("public/icons/favicon-32.png"), size: 32 },
      { png: png("assets/logo/favicon-48.png"), size: 48 },
    ]),
  );
  console.log("favicon.ico généré (public/favicon.ico : 16, 32 et 48 px).");
}

if (
  process.argv[1] &&
  import.meta.url === new URL(`file://${process.argv[1]}`).href
) {
  main();
}
