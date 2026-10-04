// Géométrie de la balance (balance.svg, 280×170) : le fléau tourne autour du pivot, les
// plateaux restent verticaux et suivent les extrémités du fléau.
import type { Point } from "@/lib/illustrations/specs";

export const BALANCE = {
  pivot: { x: 140, y: 40 },
  /** Distance pivot → point d'accroche d'un plateau (extrémités en 40,40 et 240,40). */
  armLength: 100,
  /** Inclinaison maximale, en degrés. */
  maxAngle: 12,
} as const;

/**
 * Inclinaison (-1 à 1) → angle en degrés, sens horaire à l'écran.
 * 1 : le plateau droit descend (côté droit plus lourd) ; -1 : le gauche descend.
 */
export function tiltToAngle(
  tilt: number,
  maxAngle: number = BALANCE.maxAngle,
): number {
  if (!Number.isFinite(tilt)) return 0;
  return Math.max(-1, Math.min(1, tilt)) * maxAngle;
}

export type BeamPosition = {
  angle: number;
  /** Points d'accroche des plateaux. */
  left: Point;
  right: Point;
  /** Déplacement des plateaux depuis leur position au repos (fléau horizontal). */
  leftOffset: Point;
  rightOffset: Point;
};

/** Position des extrémités du fléau pour un angle donné (degrés, sens horaire, y vers le bas). */
export function beamPosition(
  angle: number,
  pivot: Point = BALANCE.pivot,
  armLength: number = BALANCE.armLength,
): BeamPosition {
  const radians = (angle * Math.PI) / 180;
  const dx = armLength * Math.cos(radians);
  const dy = armLength * Math.sin(radians);
  const left = { x: pivot.x - dx, y: pivot.y - dy };
  const right = { x: pivot.x + dx, y: pivot.y + dy };
  return {
    angle,
    left,
    right,
    leftOffset: { x: left.x - (pivot.x - armLength), y: left.y - pivot.y },
    rightOffset: { x: right.x - (pivot.x + armLength), y: right.y - pivot.y },
  };
}
