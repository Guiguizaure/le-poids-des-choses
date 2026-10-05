// Fruits et légumes flottants de l'encart de saison : places dans la zone à droite de
// l'encart, flottement (dérive verticale et petite rotation) et parallaxe au défilement.

export const FLOAT = {
  /** Zone réservée à droite de l'encart (px). */
  zone: { width: 210, height: 160 },
  /** Dérive verticale maximale du flottement, de part et d'autre du repos (px). */
  maxDrift: 4,
  /** Rotation maximale du flottement, de part et d'autre de l'inclinaison (degrés). */
  maxSwing: 3,
  /** Décalage maximal de la parallaxe (px). */
  maxParallax: 6,
  /** Rebond au toucher : hauteur (px), montée puis retombée (s). */
  bounce: { height: 12, up: 0.18, down: 0.6 },
  /** Apparition à l'entrée dans l'écran : durée et décalage entre deux produits (s). */
  enter: { duration: 0.6, stagger: 0.12 },
} as const;

export type FloatSlot = {
  /** Coin haut gauche dans la zone (px). */
  x: number;
  y: number;
  /** Côté du cadre carré (px). */
  size: number;
  /** Inclinaison au repos (degrés). */
  tilt: number;
};

export type FloatMotion = {
  /** Dérive verticale (px) et rotation (degrés) du flottement, aller-retour. */
  drift: number;
  swing: number;
  /** Durée d'un aller (s) et départ décalé (s) : jamais deux produits synchrones. */
  duration: number;
  delay: number;
  /** Parallaxe (px) quand la zone passe d'un bord à l'autre de l'écran. */
  parallax: number;
};

// Places selon le nombre de produits : tailles un peu différentes, inclinaisons douces, sans
// chevauchement même en flottant (vérifié par les tests).
const LAYOUTS: Record<number, readonly FloatSlot[]> = {
  1: [{ x: 69, y: 44, size: 72, tilt: -6 }],
  2: [
    { x: 27, y: 22, size: 66, tilt: -7 },
    { x: 115, y: 70, size: 70, tilt: 6 },
  ],
  3: [
    { x: 15, y: 10, size: 60, tilt: -7 },
    { x: 132, y: 14, size: 56, tilt: 6 },
    { x: 74, y: 89, size: 62, tilt: -4 },
  ],
  4: [
    { x: 11, y: 11, size: 58, tilt: -7 },
    { x: 123, y: 9, size: 54, tilt: 6 },
    { x: 42, y: 94, size: 56, tilt: 5 },
    { x: 130, y: 90, size: 60, tilt: -5 },
  ],
  5: [
    { x: 4, y: 8, size: 56, tilt: -6 },
    { x: 80, y: 8, size: 50, tilt: 6 },
    { x: 149, y: 10, size: 54, tilt: -4 },
    { x: 35, y: 96, size: 54, tilt: 7 },
    { x: 118, y: 90, size: 60, tilt: -5 },
  ],
};

// Rangée mobile (3 au plus), sous le texte : seules la taille et l'inclinaison comptent.
const ROW: readonly Pick<FloatSlot, "size" | "tilt">[] = [
  { size: 54, tilt: -7 },
  { size: 60, tilt: 5 },
  { size: 52, tilt: -4 },
];

/** Hauteur réservée à la rangée mobile (px). */
export const FLOAT_ROW_HEIGHT = 76;

export function floatLayout(count: number): FloatSlot[] {
  const n = Math.max(0, Math.min(5, Math.floor(count)));
  return n === 0 ? [] : [...LAYOUTS[n]];
}

export function floatRow(count: number): Pick<FloatSlot, "size" | "tilt">[] {
  return ROW.slice(0, Math.max(0, Math.min(ROW.length, Math.floor(count))));
}

const DURATIONS = [3.4, 4.1, 2.9, 3.8, 4.6];
const DELAYS = [0, 1.3, 0.6, 2.1, 0.9];
const DRIFTS = [4, 3, 3.5, 4, 3];
const SWINGS = [2.5, -2, 3, -2.5, 2];
const PARALLAX = [6, 4, 5, 3, 6];

/** Flottement du produit n° `index` : durées, phases et amplitudes toutes différentes. */
export function floatMotion(index: number): FloatMotion {
  const i = ((Math.floor(index) % 5) + 5) % 5;
  return {
    drift: DRIFTS[i],
    swing: SWINGS[i],
    duration: DURATIONS[i],
    delay: DELAYS[i],
    parallax: PARALLAX[i],
  };
}

/**
 * Parallaxe : décalage vertical (px) d'après la place de la zone dans l'écran. Centre de la
 * zone au milieu de l'écran : 0 ; vers le haut ou le bas de l'écran : jusqu'à ±`amplitude`
 * (le produit file un peu plus vite que la page).
 */
export function parallaxOffset(
  zoneCenterY: number,
  viewportHeight: number,
  amplitude: number,
): number {
  if (viewportHeight <= 0) return 0;
  const t = (zoneCenterY - viewportHeight / 2) / (viewportHeight / 2);
  const clamped = Math.max(-1, Math.min(1, t));
  return Math.round(clamped * amplitude * 100) / 100 || 0;
}

/** Cadre d'un produit tourné au plus fort (inclinaison et flottement), au repos vertical. */
export function rotatedBox(slot: FloatSlot, motion: FloatMotion) {
  const degrees = Math.abs(slot.tilt) + Math.abs(motion.swing);
  const angle = (degrees * Math.PI) / 180;
  const half =
    (slot.size / 2) * (Math.abs(Math.cos(angle)) + Math.abs(Math.sin(angle)));
  const cx = slot.x + slot.size / 2;
  const cy = slot.y + slot.size / 2;
  return {
    left: cx - half,
    right: cx + half,
    top: cy - half,
    bottom: cy + half,
  };
}

/**
 * Deux produits ne se touchent jamais : séparés en largeur, ou en hauteur d'au moins leurs
 * deux dérives (en opposition de phase) et l'écart de leurs parallaxes (même sens).
 */
export function keepApart(
  a: { slot: FloatSlot; motion: FloatMotion },
  b: { slot: FloatSlot; motion: FloatMotion },
): boolean {
  const boxA = rotatedBox(a.slot, a.motion);
  const boxB = rotatedBox(b.slot, b.motion);
  if (boxA.right <= boxB.left || boxB.right <= boxA.left) return true;
  const gap = Math.max(boxB.top - boxA.bottom, boxA.top - boxB.bottom);
  const travel =
    Math.abs(a.motion.drift) +
    Math.abs(b.motion.drift) +
    Math.abs(a.motion.parallax - b.motion.parallax);
  return gap >= travel;
}
