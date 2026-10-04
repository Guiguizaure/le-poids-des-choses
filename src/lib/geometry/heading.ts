// Orientation d'une bête dessinée vue de dessus, tête vers le haut (coccinelle).

/**
 * Angle (degrés, sens horaire à l'écran, y vers le bas) qui pointe la tête dans la direction
 * du déplacement (dx, dy) : 0 vers le haut, 90 vers la droite, -90 vers la gauche, 180 vers
 * le bas. Sans déplacement : 0.
 */
export function headingAngle(dx: number, dy: number = 0): number {
  if (!Number.isFinite(dx) || !Number.isFinite(dy) || (dx === 0 && dy === 0))
    return 0;
  const angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
  return Object.is(angle, -0) ? 0 : angle;
}
