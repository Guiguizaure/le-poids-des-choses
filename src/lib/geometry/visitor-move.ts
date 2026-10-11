// Déplacement d'un visiteur du jardin vivant quand sa place change (une nouvelle plante la
// prend) : jamais de saut. Il rejoint la nouvelle place avec sa démarche (le renard marche,
// l'écureuil et le rouge-gorge bondissent, ceux qui volent font un arc) ; une plante s'efface
// puis repousse ; un visiteur endormi, ou le mouvement réduit : un fondu court. Fonctions
// pures, en unités de scène (390×300), testées.
import type { VisitorKind, VisitorPlace } from "@/lib/garden/visitors";

export type Point = { x: number; y: number };

/** Démarche : trajet animé (marche, bonds, vol) ou changement sur place (repousse, fondu). */
export type Gait = "walk" | "hop" | "fly" | "regrow" | "fade";

export const VISITOR_MOVE = {
  /** Vitesse de chaque démarche, en unités de scène par seconde. */
  speed: { walk: 50, hop: 70, fly: 110 },
  /** Durée d'un trajet (secondes), quelle que soit la distance. */
  duration: [0.9, 4] as const,
  /** Durée d'un pas ou d'un bond (secondes). */
  step: { walk: 0.3, hop: 0.34 },
  /** Hauteur d'un bond, du balancement de la marche, de l'arc du vol (unités de scène). */
  lift: { walk: 1.2, hop: 6, fly: [10, 40] as const },
  /** Repousse : la plante s'efface puis ressort de terre (secondes, chaque moitié). */
  regrow: [0.35, 0.55] as const,
  /** Fondu (endormi : lent ; mouvement réduit : court), chaque moitié, en secondes. */
  fade: { asleep: 0.45, reduced: 0.15 },
} as const;

const HOPPERS: readonly VisitorKind[] = ["ecureuil", "rouge-gorge"];

/** Démarche d'un visiteur qui change de place. */
export function gaitFor(
  visitor: { kind: VisitorKind; place: VisitorPlace },
  { asleep, reduced }: { asleep: boolean; reduced: boolean },
): Gait {
  if (reduced) return "fade";
  if (visitor.place === "plant") return "regrow";
  if (asleep) return "fade";
  if (visitor.place === "ground")
    return HOPPERS.includes(visitor.kind) ? "hop" : "walk";
  return "fly";
}

export type VisitorMovePlan = {
  gait: Gait;
  /** Durée totale (secondes). */
  duration: number;
  /** Nombre de pas ou de bonds (marche, bonds). */
  steps: number;
  /** Hauteur des bonds, du balancement ou de l'arc (unités de scène). */
  lift: number;
  /** Repousse et fondu : part de la durée où le visiteur, invisible, change de place. */
  switchAt: number;
};

const clamp = (value: number, [min, max]: readonly [number, number]) =>
  Math.min(max, Math.max(min, value));

/** Trajet de `from` à `to` (coin haut gauche du cadre) selon la démarche. */
export function planMove(
  from: Point,
  to: Point,
  gait: Gait,
  reduced = false,
): VisitorMovePlan {
  const distance = Math.hypot(to.x - from.x, to.y - from.y);
  switch (gait) {
    case "regrow":
      return {
        gait,
        duration: VISITOR_MOVE.regrow[0] + VISITOR_MOVE.regrow[1],
        steps: 0,
        lift: 0,
        switchAt:
          VISITOR_MOVE.regrow[0] /
          (VISITOR_MOVE.regrow[0] + VISITOR_MOVE.regrow[1]),
      };
    case "fade":
      return {
        gait,
        duration:
          2 * (reduced ? VISITOR_MOVE.fade.reduced : VISITOR_MOVE.fade.asleep),
        steps: 0,
        lift: 0,
        switchAt: 0.5,
      };
    case "fly": {
      const duration = clamp(
        distance / VISITOR_MOVE.speed.fly,
        VISITOR_MOVE.duration,
      );
      // L'arc ne sort jamais par le haut de la scène.
      const lift = Math.max(
        0,
        Math.min(
          clamp(distance * 0.35, VISITOR_MOVE.lift.fly),
          Math.min(from.y, to.y),
        ),
      );
      return { gait, duration, steps: 1, lift, switchAt: 0 };
    }
    case "walk":
    case "hop": {
      const duration = clamp(
        distance / VISITOR_MOVE.speed[gait],
        VISITOR_MOVE.duration,
      );
      const steps = Math.max(1, Math.round(duration / VISITOR_MOVE.step[gait]));
      return {
        gait,
        duration,
        steps,
        lift: VISITOR_MOVE.lift[gait],
        switchAt: 0,
      };
    }
  }
}

/** Ralenti au départ et à l'arrivée (vol). */
const sineInOut = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;

/**
 * Position (coin haut gauche du cadre) à l'instant `t` (0 à 1) d'un trajet : de `from` à `to`,
 * plus les bonds, le balancement ou l'arc (vers le haut). Repousse et fondu ne se déplacent
 * pas : la position reste `from` puis passe à `to` quand le visiteur est invisible
 * (`switchAt`).
 */
export function movePoint(
  plan: VisitorMovePlan,
  from: Point,
  to: Point,
  t: number,
): Point {
  const u = Math.min(1, Math.max(0, t));
  if (plan.gait === "regrow" || plan.gait === "fade")
    return u < plan.switchAt ? from : to;
  const along = plan.gait === "fly" ? sineInOut(u) : u;
  const rise =
    plan.gait === "fly"
      ? plan.lift * Math.sin(Math.PI * u)
      : plan.lift * Math.abs(Math.sin(Math.PI * plan.steps * u));
  return {
    x: from.x + (to.x - from.x) * along,
    y: from.y + (to.y - from.y) * along - rise,
  };
}
