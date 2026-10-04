// Envol de l'oiseau (V1.1) : trajet dans la scène (unités 390×300), cap de l'oiseau le long du
// trajet et intervalle entre deux envols. Fonctions pures, testées.
import { animalBox } from "@/lib/garden/model";

type Point = readonly [number, number];
/** Courbe de Bézier cubique : départ, deux points de contrôle, arrivée. */
type Cubic = readonly [Point, Point, Point, Point];

/** Soleil de scene-paysage (disque r 42), halo compris à son plus grand (r 50 × 1,12). */
export const SUN = { x: 318, y: 66, radius: 56 } as const;
/** Bande de ciel où volent papillon et abeille : au-dessus des plus hauts feuillages. */
export const SKY_BAND = { top: 0, bottom: 105 } as const;

export const FLIGHT = {
  /** Durée d'un envol complet (décollage, boucle, retour), en secondes. */
  duration: 6.5,
  /** Intervalle entre deux envols spontanés, en secondes. */
  interval: [40, 90] as readonly [number, number],
  /** Inclinaison maximale du corps selon la pente du trajet, en degrés. */
  maxTilt: 35,
} as const;

/** Place de l'oiseau posé (centre de son cadre) et taille de son cadre. */
const HOME_BOX = animalBox("bird");
export const BIRD_HOME: Point = [
  HOME_BOX.x + HOME_BOX.width / 2,
  HOME_BOX.y + HOME_BOX.height / 2,
];
export const BIRD_SIZE = {
  width: HOME_BOX.width,
  height: HOME_BOX.height,
} as const;

/** Boucle : centre et rayon, dans la bande de ciel, à gauche du soleil. */
export const LOOP = { x: 150, y: 58, radius: 32 } as const;
/** Bézier d'un quart de cercle. */
const K = 0.5523 * LOOP.radius;

const [hx, hy] = BIRD_HOME;
const loopBottom: Point = [LOOP.x, LOOP.y + LOOP.radius];
const loopLeft: Point = [LOOP.x - LOOP.radius, LOOP.y];
const loopTop: Point = [LOOP.x, LOOP.y - LOOP.radius];
const loopRight: Point = [LOOP.x + LOOP.radius, LOOP.y];

/**
 * Trajet du centre de l'oiseau : il décolle vers la gauche en passant sous le soleil, entre dans
 * la boucle par le bas, la parcourt (gauche, haut, droite) puis redescend se poser chez lui.
 * Les tangentes se raccordent d'un segment à l'autre (pas d'à-coup).
 */
const SEGMENTS: readonly { curve: Cubic; loop: boolean }[] = [
  {
    curve: [
      [hx, hy],
      [hx, hy - 18],
      [330, 155],
      [300, 150],
    ],
    loop: false,
  },
  {
    curve: [
      [300, 150],
      [270, 145],
      [loopBottom[0] + 40, loopBottom[1]],
      loopBottom,
    ],
    loop: false,
  },
  {
    curve: [
      loopBottom,
      [LOOP.x - K, loopBottom[1]],
      [loopLeft[0], LOOP.y + K],
      loopLeft,
    ],
    loop: true,
  },
  {
    curve: [
      loopLeft,
      [loopLeft[0], LOOP.y - K],
      [LOOP.x - K, loopTop[1]],
      loopTop,
    ],
    loop: true,
  },
  {
    curve: [
      loopTop,
      [LOOP.x + K, loopTop[1]],
      [loopRight[0], LOOP.y - K],
      loopRight,
    ],
    loop: true,
  },
  {
    curve: [loopRight, [loopRight[0], LOOP.y + 30], [220, 118], [250, 128]],
    loop: false,
  },
  {
    curve: [
      [250, 128],
      [280, 138],
      [hx - 22, hy - 22],
      [hx, hy],
    ],
    loop: false,
  },
];

function bezier([p0, p1, p2, p3]: Cubic, t: number): [number, number] {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [
    a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0],
    a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1],
  ];
}

/** Échantillons du trajet à vitesse constante (table des longueurs). */
const STEPS_PER_SEGMENT = 64;
const SAMPLES = (() => {
  const points: { x: number; y: number; length: number; loop: boolean }[] = [];
  let length = 0;
  let previous: [number, number] | null = null;
  for (const { curve, loop } of SEGMENTS) {
    for (let step = previous ? 1 : 0; step <= STEPS_PER_SEGMENT; step++) {
      const [x, y] = bezier(curve, step / STEPS_PER_SEGMENT);
      if (previous) length += Math.hypot(x - previous[0], y - previous[1]);
      previous = [x, y];
      points.push({ x, y, length, loop });
    }
  }
  return points;
})();
const TOTAL_LENGTH = SAMPLES[SAMPLES.length - 1].length;

/** Part du trajet (0 à 1) où commence et où finit la boucle. */
export const LOOP_SPAN: readonly [number, number] = [
  SAMPLES.find((s) => s.loop)!.length / TOTAL_LENGTH,
  SAMPLES.findLast((s) => s.loop)!.length / TOTAL_LENGTH,
];

export type FlightPhase = "depart" | "boucle" | "retour";

export type FlightPose = {
  /** Centre de l'oiseau (unités de scène). */
  x: number;
  y: number;
  /** 1 : il regarde à droite (sens du dessin) ; -1 : retourné, il regarde à gauche. */
  facing: 1 | -1;
  /** Inclinaison du corps (degrés, sens horaire), selon la pente du trajet. */
  tilt: number;
  phase: FlightPhase;
};

function sampleAt(progress: number) {
  const target = Math.min(1, Math.max(0, progress)) * TOTAL_LENGTH;
  let low = 0;
  let high = SAMPLES.length - 1;
  while (low < high) {
    const middle = (low + high) >> 1;
    if (SAMPLES[middle].length < target) low = middle + 1;
    else high = middle;
  }
  const after = SAMPLES[low];
  const before = SAMPLES[Math.max(0, low - 1)];
  const span = after.length - before.length;
  const t = span > 0 ? (target - before.length) / span : 0;
  return {
    x: before.x + (after.x - before.x) * t,
    y: before.y + (after.y - before.y) * t,
    index: low,
  };
}

/** Pose de l'oiseau à une avancée donnée du trajet (0 : posé, 1 : reposé). */
export function flightPose(progress: number): FlightPose {
  const { x, y, index } = sampleAt(progress);
  // Direction locale : entre l'échantillon d'avant et celui d'après.
  const from = SAMPLES[Math.max(0, index - 1)];
  const to = SAMPLES[Math.min(SAMPLES.length - 1, index + 1)];
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const facing = dx < 0 ? -1 : 1;
  // Retourné, le dessin pointe vers la gauche : l'angle se mesure depuis (-1, 0).
  const angle =
    (Math.atan2(facing === 1 ? dy : -dy, facing === 1 ? dx : -dx) * 180) /
    Math.PI;
  const tilt = Math.max(-FLIGHT.maxTilt, Math.min(FLIGHT.maxTilt, angle));
  const phase: FlightPhase =
    progress < LOOP_SPAN[0]
      ? "depart"
      : progress <= LOOP_SPAN[1]
        ? "boucle"
        : "retour";
  return { x, y, facing, tilt: Object.is(tilt, -0) ? 0 : tilt, phase };
}

/** Points du trajet, pour les tests et le labo. */
export function flightSamples(count = 400): FlightPose[] {
  return Array.from({ length: count + 1 }, (_, i) => flightPose(i / count));
}

/** Générateur pseudo-aléatoire reproductible (mulberry32). */
function random(seed: number): number {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * Délai avant le n-ième envol spontané (secondes), entre 40 et 90 s. Même graine (une par
 * session de navigation), mêmes délais : aucun hasard non reproductible.
 */
export function flightDelay(seed: number, index: number): number {
  const [min, max] = FLIGHT.interval;
  return min + (max - min) * random(Math.imul(seed, 31) + index);
}
