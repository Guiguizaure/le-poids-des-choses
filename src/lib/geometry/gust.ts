// Coup de vent : le front de la rafale traverse la scène de gauche à droite ; chaque élément
// réagit quand le front l'atteint.

export const GUST = {
  /** Durée de traversée de la scène par les traits de vent, en secondes. */
  crossDuration: 1.2,
  /** Inclinaison du feuillage, en degrés (sens du vent : horaire). */
  minLean: 6,
  maxLean: 10,
  /** Intervalle entre deux rafales automatiques, en secondes. */
  minInterval: 8,
  maxInterval: 15,
} as const;

export type SceneBox = { left: number; width: number };

/**
 * Délai (s) avant que le front de la rafale atteigne un élément centré en `x` (même repère que
 * la scène, ex. pixels de l'écran). Avant la scène : 0 ; au-delà : la durée de traversée.
 */
export function gustDelay(
  x: number,
  scene: SceneBox,
  crossDuration: number = GUST.crossDuration,
): number {
  if (!Number.isFinite(x) || !(scene.width > 0)) return 0;
  const progress = (x - scene.left) / scene.width;
  return Math.min(1, Math.max(0, progress)) * crossDuration;
}

/** Délais pour plusieurs éléments, dans l'ordre donné (les plus à gauche plient en premier). */
export function gustDelays(
  xs: readonly number[],
  scene: SceneBox,
  crossDuration: number = GUST.crossDuration,
): number[] {
  return xs.map((x) => gustDelay(x, scene, crossDuration));
}

/** Inclinaison d'une plante, entre minLean et maxLean ; `random` renvoie une valeur dans [0, 1[. */
export function gustLean(random: () => number = Math.random): number {
  return GUST.minLean + clamp01(random()) * (GUST.maxLean - GUST.minLean);
}

/** Attente (s) avant la prochaine rafale automatique, entre 8 et 15 s. */
export function nextGustInterval(random: () => number = Math.random): number {
  return (
    GUST.minInterval + clamp01(random()) * (GUST.maxInterval - GUST.minInterval)
  );
}

function clamp01(value: number): number {
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}
