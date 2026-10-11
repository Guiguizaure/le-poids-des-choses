// Groupes d'un SVG source (<g id="…">) délimités en comptant les balises ouvrantes et fermantes :
// un groupe garde tout son contenu, groupes imbriqués compris. (Une expression régulière non
// gourmande, `…?</g>`, s'arrêtait au premier </g> intérieur et laissait un SVG invalide : la
// lavande épanouie, dont les groupes contiennent des groupes, cassait l'image de partage.)

/** Une balise de groupe : ouvrante, auto-fermante ou fermante. */
const GROUP_TAG = /<g\b[^>]*>|<\/g\s*>/g;

/** Fin du groupe qui commence juste après `bodyStart` : début et fin de sa balise fermante. */
function closingTag(
  svg: string,
  bodyStart: number,
): { start: number; end: number } {
  const tags = new RegExp(GROUP_TAG.source, "g");
  tags.lastIndex = bodyStart;
  let depth = 1;
  for (let tag = tags.exec(svg); tag; tag = tags.exec(svg)) {
    if (tag[0].startsWith("</")) depth--;
    else if (!tag[0].endsWith("/>")) depth++;
    if (depth === 0)
      return { start: tag.index, end: tag.index + tag[0].length };
  }
  throw new Error("SVG illisible : groupe non fermé.");
}

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Remplace chaque groupe <g id="…"> dont l'id est dans `ids` par ce que rend `replace` (balise
 * ouvrante sans son « > », contenu complet, balise fermante) ; une chaîne vide le retire.
 */
export function replaceGroups(
  svg: string,
  ids: readonly string[],
  replace: (group: { open: string; body: string; close: string }) => string,
): string {
  if (ids.length === 0) return svg;
  const opener = new RegExp(
    `<g id="(?:${ids.map(escape).join("|")})"[^>]*>`,
    "g",
  );
  let out = "";
  let last = 0;
  for (let match = opener.exec(svg); match; match = opener.exec(svg)) {
    const bodyStart = match.index + match[0].length;
    if (match[0].endsWith("/>")) continue; // groupe vide auto-fermant : rien à faire
    const close = closingTag(svg, bodyStart);
    out +=
      svg.slice(last, match.index) +
      replace({
        open: match[0].slice(0, -1),
        body: svg.slice(bodyStart, close.start),
        close: svg.slice(close.start, close.end),
      });
    last = close.end;
    opener.lastIndex = last;
  }
  return out + svg.slice(last);
}
