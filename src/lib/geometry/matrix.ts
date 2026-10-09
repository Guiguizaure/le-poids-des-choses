// Matrices affines des attributs `transform` des dessins (translate, rotate avec ou sans centre,
// scale), partagées par l'extraction des emprises (scripts/bounds.ts) et le dégradé d'automne
// des feuillages (src/lib/garden/foliage.ts).

/** Matrice affine [a, b, c, d, e, f] : x' = a·x + c·y + e, y' = b·x + d·y + f. */
export type Matrix = readonly [number, number, number, number, number, number];
export const IDENTITY: Matrix = [1, 0, 0, 1, 0, 0];

export function multiply(m: Matrix, n: Matrix): Matrix {
  return [
    m[0] * n[0] + m[2] * n[1],
    m[1] * n[0] + m[3] * n[1],
    m[0] * n[2] + m[2] * n[3],
    m[1] * n[2] + m[3] * n[3],
    m[0] * n[4] + m[2] * n[5] + m[4],
    m[1] * n[4] + m[3] * n[5] + m[5],
  ];
}

export function invert(m: Matrix): Matrix {
  const det = m[0] * m[3] - m[1] * m[2];
  if (det === 0) throw new Error("Transformation non inversible.");
  return [
    m[3] / det,
    -m[1] / det,
    -m[2] / det,
    m[0] / det,
    (m[2] * m[5] - m[3] * m[4]) / det,
    (m[1] * m[4] - m[0] * m[5]) / det,
  ];
}

export const applyMatrix = (
  m: Matrix,
  x: number,
  y: number,
): [number, number] => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

/** Valeur d'un attribut `transform` (« translate(26 86) rotate(-20) scale(1.25) »). */
export function parseTransform(attribute: string | null | undefined): Matrix {
  if (!attribute) return IDENTITY;
  let matrix = IDENTITY;
  for (const [, name, args] of attribute.matchAll(/(\w+)\s*\(([^)]*)\)/g)) {
    const [p = 0, q, r] = args
      .trim()
      .split(/[\s,]+/)
      .map(Number);
    let step: Matrix;
    if (name === "translate") step = [1, 0, 0, 1, p, q ?? 0];
    else if (name === "scale") step = [p, 0, 0, q ?? p, 0, 0];
    else if (name === "rotate") {
      const angle = (p * Math.PI) / 180;
      const [cos, sin] = [Math.cos(angle), Math.sin(angle)];
      const rotation: Matrix = [cos, sin, -sin, cos, 0, 0];
      step =
        q === undefined
          ? rotation
          : multiply(multiply([1, 0, 0, 1, q, r ?? 0], rotation), [
              1,
              0,
              0,
              1,
              -q,
              -(r ?? 0),
            ]);
    } else throw new Error(`Transformation non prise en charge : ${name}`);
    matrix = multiply(matrix, step);
  }
  return matrix;
}

/** Attribut `transform` d'une balise (« <path transform="…" …> »). */
export function transformMatrix(tag: string): Matrix {
  return parseTransform(tag.match(/\stransform="([^"]+)"/)?.[1]);
}
