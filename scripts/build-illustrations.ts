// `pnpm illustrations` (aussi lancé au début de `pnpm build`) : convertit chaque SVG de
// public/illustrations en composant React typé, dans src/components/illustrations/generated.tsx.
//
// Un même SVG peut être affiché plusieurs fois sur la page (le jardin multiplie les arbres) :
// les attributs id deviennent donc data-part="…", que les animations ciblent à l'intérieur de
// chaque instance. Seuls les id référencés dans le fichier (url(#…), href="#…", ex. dégradés ou
// masques exportés par Figma) restent des id, préfixés par un identifiant propre à l'instance.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { contentBounds, generateBoundsModule, isPlant } from "./bounds";
import { extractSceneGeometry, generateSceneModule } from "./scene-geometry";
import {
  ILLUSTRATION_NAMES,
  ILLUSTRATION_SPECS,
  type IllustrationName,
} from "../src/lib/illustrations/specs";

const SOURCE_DIR = new URL("../public/illustrations/", import.meta.url);
const OUTPUT = new URL(
  "../src/components/illustrations/generated.tsx",
  import.meta.url,
);

export type ConvertedSvg = {
  name: string;
  width: number;
  height: number;
  viewBox: string;
  /** Valeurs data-part présentes, dans l'ordre du fichier. */
  parts: string[];
  /** id conservés car référencés (préfixés par instance). */
  referencedIds: string[];
  /** Corps JSX du composant (le contenu de <svg>). */
  body: string;
  /** Attributs JSX de la balise <svg> racine (hors taille et viewBox). */
  rootAttributes: string;
};

const TAG =
  /<(\/?)([A-Za-z][\w:.-]*)((?:\s+[^\s=/>]+(?:\s*=\s*(?:"[^"]*"|'[^']*'))?)*)\s*(\/?)>/g;
const ATTRIBUTE = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g;
const URL_REF = /url\(\s*['"]?#([^'")\s]+)['"]?\s*\)/g;

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
};

function decodeEntities(value: string): string {
  return value.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const n =
        code[1].toLowerCase() === "x"
          ? parseInt(code.slice(2), 16)
          : Number(code.slice(1));
      return String.fromCodePoint(n);
    }
    return ENTITIES[code] ?? match;
  });
}

function parseAttributes(source: string): [string, string][] {
  const attributes: [string, string][] = [];
  for (const match of source.matchAll(ATTRIBUTE)) {
    attributes.push([match[1], decodeEntities(match[2] ?? match[3] ?? "")]);
  }
  return attributes;
}

/** Nom d'attribut SVG → nom de prop React (stroke-width → strokeWidth, class → className). */
export function toJsxAttributeName(name: string): string | null {
  if (name === "xmlns" || name.startsWith("xmlns:")) return null;
  if (name === "class") return "className";
  if (name === "xlink:href") return "href";
  if (name.startsWith("data-") || name.startsWith("aria-")) return name;
  return name.replace(/[:-]([a-z])/g, (_, letter: string) =>
    letter.toUpperCase(),
  );
}

function styleToObject(style: string): string {
  const entries = style
    .split(";")
    .map((declaration) => declaration.split(":").map((piece) => piece.trim()))
    .filter(([property, value]) => property && value)
    .map(([property, value]) => {
      const key = property.startsWith("--")
        ? property
        : property.replace(/-([a-z])/g, (_, letter: string) =>
            letter.toUpperCase(),
          );
      return `${JSON.stringify(key)}: ${JSON.stringify(value)}`;
    });
  return `{{ ${entries.join(", ")} }}`;
}

/** Valeur JSX : chaîne simple, ou gabarit qui préfixe les références internes par instance. */
function jsxValue(value: string, referencedIds: Set<string>): string {
  const rewritten = value
    .replace(URL_REF, (match, id: string) =>
      referencedIds.has(id) ? `url(#\${uid}-${id})` : match,
    )
    .replace(/^#(.+)$/, (match, id: string) =>
      referencedIds.has(id) ? `#\${uid}-${id}` : match,
    );
  if (rewritten !== value) return `{\`${rewritten.replace(/`/g, "\\`")}\`}`;
  return value.includes('"') ? `{${JSON.stringify(value)}}` : `"${value}"`;
}

function convertAttributes(
  attributes: [string, string][],
  referencedIds: Set<string>,
  parts: string[],
): string {
  const output: string[] = [];
  for (const [name, value] of attributes) {
    if (name === "id") {
      if (referencedIds.has(value)) output.push(`id={\`\${uid}-${value}\`}`);
      else {
        parts.push(value);
        output.push(`data-part=${jsxValue(value, referencedIds)}`);
      }
      continue;
    }
    const jsxName = toJsxAttributeName(name);
    if (!jsxName) continue;
    if (jsxName === "style") output.push(`style=${styleToObject(value)}`);
    else output.push(`${jsxName}=${jsxValue(value, referencedIds)}`);
  }
  return output.length ? ` ${output.join(" ")}` : "";
}

export function convertSvg(name: string, source: string): ConvertedSvg {
  const svg = source
    .replace(/<\?xml[\s\S]*?\?>/g, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<metadata[\s\S]*?<\/metadata>/gi, "");

  const referencedIds = new Set<string>();
  for (const match of svg.matchAll(URL_REF)) referencedIds.add(match[1]);
  for (const match of svg.matchAll(
    /(?:xlink:)?href\s*=\s*["']#([^"']+)["']/g,
  )) {
    referencedIds.add(match[1]);
  }

  const parts: string[] = [];
  const chunks: string[] = [];
  let root: [string, string][] | null = null;
  let depth = 0;
  let cursor = 0;

  for (const match of svg.matchAll(TAG)) {
    const text = svg.slice(cursor, match.index).trim();
    if (text && depth > 0)
      chunks.push(`{${JSON.stringify(decodeEntities(text))}}`);
    cursor = match.index + match[0].length;

    const [, closing, tag, rawAttributes, selfClosing] = match;
    if (!root) {
      if (tag !== "svg")
        throw new Error(
          `${name} : la racine doit être <svg>, trouvé <${tag}>.`,
        );
      root = parseAttributes(rawAttributes);
      depth = 1;
      continue;
    }
    if (closing) {
      depth -= 1;
      if (depth > 0) chunks.push(`</${tag}>`);
      continue;
    }
    const attributes = convertAttributes(
      parseAttributes(rawAttributes),
      referencedIds,
      parts,
    );
    if (selfClosing) chunks.push(`<${tag}${attributes} />`);
    else {
      depth += 1;
      chunks.push(`<${tag}${attributes}>`);
    }
  }
  if (!root) throw new Error(`${name} : aucune balise <svg>.`);
  if (depth !== 0) throw new Error(`${name} : balises mal fermées.`);

  const rootMap = new Map(root);
  const viewBox =
    rootMap.get("viewBox") ??
    `0 0 ${rootMap.get("width")} ${rootMap.get("height")}`;
  const [, , viewWidth, viewHeight] = viewBox.split(/[\s,]+/).map(Number);
  const width = Number.parseFloat(rootMap.get("width") ?? "") || viewWidth;
  const height = Number.parseFloat(rootMap.get("height") ?? "") || viewHeight;

  const rootAttributes = convertAttributes(
    root.filter(
      ([attribute]) =>
        !["width", "height", "viewBox", "id"].includes(attribute),
    ),
    referencedIds,
    [],
  );

  return {
    name,
    width,
    height,
    viewBox,
    parts,
    referencedIds: [...referencedIds],
    body: chunks.join(""),
    rootAttributes,
  };
}

/** Écarts entre un SVG converti et sa spécification (vide si conforme). */
export function checkAgainstSpec(converted: ConvertedSvg): string[] {
  const spec = ILLUSTRATION_SPECS[converted.name as IllustrationName];
  if (!spec)
    return [`${converted.name} : fichier inattendu (absent de specs.ts).`];
  const problems: string[] = [];
  if (converted.width !== spec.width || converted.height !== spec.height) {
    problems.push(
      `${converted.name} : ${converted.width}×${converted.height}, attendu ${spec.width}×${spec.height}.`,
    );
  }
  for (const part of spec.parts) {
    if (!converted.parts.includes(part))
      problems.push(`${converted.name} : calque « ${part} » manquant.`);
  }
  return problems;
}

export function componentName(name: string): string {
  return name
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");
}

export function generateModule(converted: readonly ConvertedSvg[]): string {
  const sorted = [...converted].sort((a, b) => a.name.localeCompare(b.name));
  const components = sorted.map((svg) => {
    const usesUid = svg.referencedIds.length > 0;
    const props = usesUid
      ? "{ uid, svgProps, children }"
      : "{ svgProps, children }";
    return [
      `function ${componentName(svg.name)}(${props}: GeneratedSvgProps) {`,
      `  return (`,
      `    <svg width={${svg.width}} height={${svg.height}} viewBox="${svg.viewBox}"${svg.rootAttributes} {...svgProps}>`,
      `      {children}`,
      `      ${svg.body}`,
      `    </svg>`,
      `  );`,
      `}`,
    ].join("\n");
  });
  const registry = sorted.map(
    (svg) => `  "${svg.name}": ${componentName(svg.name)},`,
  );

  return [
    "// Généré par scripts/build-illustrations.ts depuis public/illustrations : ne pas modifier.",
    "// Régénérer avec `pnpm illustrations`.",
    'import type { ComponentType, ReactNode, SVGProps } from "react";',
    'import type { IllustrationName } from "@/lib/illustrations/specs";',
    "",
    "export type GeneratedSvgProps = {",
    "  /** Préfixe propre à l'instance, pour les id référencés (dégradés, masques). */",
    "  uid: string;",
    "  svgProps?: SVGProps<SVGSVGElement>;",
    "  /** Rendu en premier dans <svg> (ex. <title>). */",
    "  children?: ReactNode;",
    "};",
    "",
    ...components.flatMap((component) => [component, ""]),
    "export const generatedIllustrations: Record<IllustrationName, ComponentType<GeneratedSvgProps>> = {",
    ...registry,
    "};",
    "",
  ].join("\n");
}

export function convertDirectory(directory: URL = SOURCE_DIR): ConvertedSvg[] {
  const files = readdirSync(directory).filter((file) => file.endsWith(".svg"));
  const converted = files.map((file) =>
    convertSvg(
      file.replace(/\.svg$/, ""),
      readFileSync(new URL(file, directory), "utf8"),
    ),
  );
  const found = new Set(converted.map((svg) => svg.name));
  const problems = [
    ...ILLUSTRATION_NAMES.filter((name) => !found.has(name)).map(
      (name) => `${name}.svg manquant.`,
    ),
    ...converted.flatMap(checkAgainstSpec),
  ];
  if (problems.length)
    throw new Error(
      `Illustrations non conformes :\n- ${problems.join("\n- ")}`,
    );
  return converted;
}

const SCENE_OUTPUT = new URL(
  "../src/lib/garden/scene.generated.ts",
  import.meta.url,
);

/** Géométrie de la scène pour le jardin (collines, sol), lue dans scene-paysage.svg. */
export function sceneModuleFrom(directory: URL = SOURCE_DIR): string {
  const svg = readFileSync(new URL("scene-paysage.svg", directory), "utf8");
  return generateSceneModule(extractSceneGeometry(svg));
}

const BOUNDS_OUTPUT = new URL(
  "../src/lib/illustrations/bounds.generated.ts",
  import.meta.url,
);

/** Emprise du dessin de chaque plante (vitrine de révélation). */
export function boundsModuleFrom(directory: URL = SOURCE_DIR): string {
  const bounds = Object.fromEntries(
    readdirSync(directory)
      .filter((file) => file.endsWith(".svg") && isPlant(file))
      .map((file) => [
        file.replace(/\.svg$/, ""),
        contentBounds(readFileSync(new URL(file, directory), "utf8")),
      ]),
  );
  return generateBoundsModule(bounds);
}

function main() {
  const converted = convertDirectory();
  writeFileSync(OUTPUT, generateModule(converted));
  writeFileSync(SCENE_OUTPUT, sceneModuleFrom());
  writeFileSync(BOUNDS_OUTPUT, boundsModuleFrom());
  console.log(
    `${converted.length} illustrations converties dans src/components/illustrations/generated.tsx`,
  );
  console.log(
    "Collines et sol extraits dans src/lib/garden/scene.generated.ts",
  );
}

if (
  process.argv[1] &&
  import.meta.url === new URL(`file://${process.argv[1]}`).href
) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
