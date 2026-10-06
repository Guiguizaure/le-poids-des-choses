// Particules de saison qui tombent sur le jardin (pétales au printemps, feuilles en automne),
// en unités de la scène (390×300). Fonctions pures et déterministes : même saison = mêmes
// particules, à l'écran comme sur l'image de partage (où elles sont figées).
import { hashString } from "@/lib/garden/hash";
import { SCENE, surfaceY } from "@/lib/garden/scene";
import type { Season } from "@/lib/garden/seasons";
import type { IllustrationName } from "@/lib/illustrations/specs";

export const FALL = {
  /** Particules à la fois. */
  count: 8,
  /** Durée d'une chute, en secondes. */
  minSeconds: 9,
  maxSeconds: 14,
  /** Amplitude du balancement de part et d'autre (unités de scène). */
  maxSway: 14,
  /** Balancements complets pendant une chute. */
  swings: 2,
  /** Part de la chute pendant laquelle la particule s'efface, une fois au sol. */
  fadeFrom: 0.88,
} as const;

const DRAWINGS: Partial<Record<Season, readonly IllustrationName[]>> = {
  printemps: ["saison-printemps-petale"],
  automne: ["saison-automne-feuille-1", "saison-automne-feuille-2"],
};

export type FallingParticle = {
  name: IllustrationName;
  /** Taille affichée (carré, unités de scène). */
  size: number;
  /** Abscisse du coin gauche, au centre du balancement. */
  x: number;
  /** Ordonnée du coin haut au départ (au-dessus de la scène) et à l'arrivée (au sol). */
  startY: number;
  endY: number;
  sway: number;
  /** Rotation totale pendant la chute (degrés). */
  spin: number;
  duration: number;
  /** Décalage de départ (secondes) : les particules ne tombent pas ensemble. */
  delay: number;
  /** Moment (0 à 1) où la particule est figée sur l'image de partage. */
  still: number;
};

/** Valeur pseudo-aléatoire dans [0, 1[, tirée d'une clé. */
function unit(key: string): number {
  return hashString(key) / 2 ** 32;
}

/** Particules qui tombent pendant une saison (aucune en été ; l'hiver a ses flocons). */
export function fallingParticles(season: Season | null): FallingParticle[] {
  const drawings = season ? DRAWINGS[season] : undefined;
  if (!drawings) return [];
  return Array.from({ length: FALL.count }, (_, index) => {
    const r = (name: string) => unit(`${season}:${index}:${name}`);
    const size = season === "automne" ? 10 + r("size") * 3 : 7 + r("size") * 2;
    const sway = 6 + r("sway") * (FALL.maxSway - 6);
    // Une colonne par particule, pour qu'elles se répartissent sur toute la largeur.
    const column = (SCENE.width - 2 * FALL.maxSway - size) / FALL.count;
    const x = FALL.maxSway + column * (index + r("x"));
    const footX = x + size / 2;
    return {
      name: drawings[index % drawings.length],
      size,
      x,
      startY: -size - 4 - r("start") * 20,
      // Elles se posent sur la colline ou le sol qui est sous elles, un peu plus bas.
      endY: Math.min(SCENE.height - size, surfaceY(footX) + 6 + r("end") * 20),
      sway,
      spin: (r("spin") - 0.5) * 360,
      duration:
        FALL.minSeconds + r("duration") * (FALL.maxSeconds - FALL.minSeconds),
      delay: (index / FALL.count) * FALL.maxSeconds + r("delay") * 2,
      still: 0.15 + r("still") * 0.6,
    };
  });
}

export type ParticlePose = {
  x: number;
  y: number;
  rotation: number;
  opacity: number;
};

/** Position d'une particule à l'instant `t` de sa chute (0 : départ, 1 : arrivée). */
export function particleAt(particle: FallingParticle, t: number): ParticlePose {
  const p = Math.min(1, Math.max(0, t));
  return {
    x: particle.x + particle.sway * Math.sin(2 * Math.PI * FALL.swings * p),
    y: particle.startY + (particle.endY - particle.startY) * p,
    rotation: particle.spin * p,
    opacity: p < FALL.fadeFrom ? 1 : (1 - p) / (1 - FALL.fadeFrom),
  };
}

/** Flocons : la couche glisse lentement vers le bas, en boucle (secondes par traversée). */
export const SNOW_DRIFT_SECONDS = 40;
