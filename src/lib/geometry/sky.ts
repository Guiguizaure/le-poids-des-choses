// Ciel de la scène : dérive des nuages (boucle continue) et respiration du halo du soleil.

export const SKY = {
  /** Durées de traversée de la scène par les nuages, en secondes (une par nuage). */
  cloudSeconds: [72, 86, 64] as readonly number[],
  minCloudSeconds: 60,
  maxCloudSeconds: 90,
  /** Cycle complet du halo du soleil (grandit puis rétrécit), en secondes. */
  sunBreathSeconds: 6,
} as const;

export type CloudDrift = {
  /** Distance parcourue en une traversée (unités de la scène). */
  distance: number;
  /** Bornes du déplacement x : sortie à droite = réapparition à gauche. */
  min: number;
  max: number;
};

/**
 * Dérive d'un nuage occupant [x, x + width] dans une scène de `sceneWidth` : il part vers la
 * droite, sort entièrement, puis réapparaît entièrement caché à gauche (boucle sans saut).
 */
export function cloudDrift(
  x: number,
  width: number,
  sceneWidth: number,
): CloudDrift {
  const w = Math.max(0, width);
  return { distance: sceneWidth + w, min: -(x + w), max: sceneWidth - x };
}

/** Ramène un déplacement dans [min, max[ (même calcul que gsap.utils.wrap). */
export function wrapOffset(offset: number, drift: CloudDrift): number {
  const range = drift.max - drift.min;
  return ((((offset - drift.min) % range) + range) % range) + drift.min;
}

/** Durée de traversée du nuage n (vitesses différentes, entre 60 et 90 s). */
export function cloudSeconds(index: number): number {
  const list = SKY.cloudSeconds;
  return list[((index % list.length) + list.length) % list.length];
}
