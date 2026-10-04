// Géométrie de scene-paysage.svg utile au jardin : le contour des collines (« colline-arriere »,
// « colline-avant ») et le haut du sol (« sol »). Extraite par `pnpm illustrations` dans
// src/lib/garden/scene.generated.ts : redessiner les collines met le jardin à jour tout seul.

export const HILL_PARTS = ["colline-arriere", "colline-avant"] as const;
export type HillPart = (typeof HILL_PARTS)[number];
type XY = readonly [number, number];

export type SceneGeometry = {
  /** Contour de chaque colline, échantillonné en ligne brisée (unités du SVG). */
  hills: Record<HillPart, XY[]>;
  /** Haut du calque « sol ». */
  groundTop: number;
};

const CURVE_STEPS = 32;

/** Contenu d'un groupe <g id="…">…</g> (groupes non imbriqués, comme dans les exports). */
function groupContent(svg: string, id: string): string | null {
  const match = svg.match(
    new RegExp(`<g\\b[^>]*\\bid="${id}"[^>]*>([\\s\\S]*?)</g>`),
  );
  return match ? match[1] : null;
}

function attribute(tag: string, name: string): string | null {
  const match = tag.match(new RegExp(`\\s${name}="([^"]*)"`));
  return match ? match[1] : null;
}

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * Chemin SVG → points (commandes M, L, H, V, C, Q, Z, absolues ou relatives). Les courbes sont
 * échantillonnées. Une commande non prise en charge lève une erreur explicite.
 */
export function pathToPoints(d: string): XY[] {
  const tokens = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) ?? [];
  const points: XY[] = [];
  let i = 0;
  let command = "";
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  const number = () => {
    const value = Number(tokens[i++]);
    if (!Number.isFinite(value)) throw new Error(`Chemin illisible : « ${d} »`);
    return value;
  };
  const push = (px: number, py: number) => points.push([round(px), round(py)]);

  while (i < tokens.length) {
    if (/[a-zA-Z]/.test(tokens[i])) command = tokens[i++];
    const relative = command === command.toLowerCase();
    const ox = relative ? x : 0;
    const oy = relative ? y : 0;
    switch (command.toUpperCase()) {
      case "M":
        x = ox + number();
        y = oy + number();
        startX = x;
        startY = y;
        push(x, y);
        command = relative ? "l" : "L"; // coordonnées suivantes : lignes
        break;
      case "L":
        x = ox + number();
        y = oy + number();
        push(x, y);
        break;
      case "H":
        x = ox + number();
        push(x, y);
        break;
      case "V":
        y = oy + number();
        push(x, y);
        break;
      case "Q": {
        const [x1, y1, x2, y2] = [
          ox + number(),
          oy + number(),
          ox + number(),
          oy + number(),
        ];
        for (let step = 1; step <= CURVE_STEPS; step++) {
          const t = step / CURVE_STEPS;
          const u = 1 - t;
          push(
            u * u * x + 2 * u * t * x1 + t * t * x2,
            u * u * y + 2 * u * t * y1 + t * t * y2,
          );
        }
        x = x2;
        y = y2;
        break;
      }
      case "C": {
        const [x1, y1, x2, y2, x3, y3] = [
          ox + number(),
          oy + number(),
          ox + number(),
          oy + number(),
          ox + number(),
          oy + number(),
        ];
        for (let step = 1; step <= CURVE_STEPS; step++) {
          const t = step / CURVE_STEPS;
          const u = 1 - t;
          push(
            u * u * u * x +
              3 * u * u * t * x1 +
              3 * u * t * t * x2 +
              t * t * t * x3,
            u * u * u * y +
              3 * u * u * t * y1 +
              3 * u * t * t * y2 +
              t * t * t * y3,
          );
        }
        x = x3;
        y = y3;
        break;
      }
      case "Z":
        x = startX;
        y = startY;
        push(x, y);
        break;
      default:
        throw new Error(
          `Commande de chemin « ${command} » non prise en charge dans « ${d} ».`,
        );
    }
  }
  return points;
}

/** Lit la géométrie de la scène ; échoue si une colline ou le sol est introuvable. */
export function extractSceneGeometry(svg: string): SceneGeometry {
  const missing: string[] = [];
  const hills = {} as Record<HillPart, XY[]>;
  for (const part of HILL_PARTS) {
    const content = groupContent(svg, part);
    const paths = content
      ? [...content.matchAll(/<path\b[^>]*>/g)].map((m) => attribute(m[0], "d"))
      : [];
    const outline = paths.filter((d): d is string => !!d).flatMap(pathToPoints);
    if (outline.length < 2) missing.push(part);
    else hills[part] = outline;
  }
  const ground = groupContent(svg, "sol")?.match(/<rect\b[^>]*>/)?.[0];
  if (!ground) missing.push("sol");
  if (missing.length) {
    throw new Error(
      `scene-paysage.svg : calque(s) introuvable(s) ou sans chemin : ${missing.join(", ")}.`,
    );
  }
  return { hills, groundTop: Number(attribute(ground!, "y") ?? 0) };
}

export function generateSceneModule(geometry: SceneGeometry): string {
  const hills = HILL_PARTS.map(
    (part) =>
      `  "${part}": [${geometry.hills[part].map(([x, y]) => `[${x}, ${y}]`).join(", ")}],`,
  );
  return [
    "// Généré par scripts/build-illustrations.ts depuis public/illustrations/scene-paysage.svg :",
    "// ne pas modifier. Régénérer avec `pnpm illustrations`.",
    "",
    "/** Contour des collines (ligne brisée, unités de la scène). */",
    "export const HILL_OUTLINES: Record<",
    `  ${HILL_PARTS.map((part) => `"${part}"`).join(" | ")},`,
    "  readonly (readonly [number, number])[]",
    "> = {",
    ...hills,
    "};",
    "",
    "/** Haut du calque « sol ». */",
    `export const GROUND_TOP = ${geometry.groundTop};`,
    "",
  ].join("\n");
}
