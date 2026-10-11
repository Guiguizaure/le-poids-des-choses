import { describe, expect, it } from "vitest";
import { SCENE } from "@/lib/garden/scene";
import { VISITORS } from "@/lib/garden/visitors";
import {
  gaitFor,
  movePoint,
  planMove,
  VISITOR_MOVE,
  type Gait,
  type Point,
} from "./visitor-move";

const rule = (kind: string) => VISITORS.find((v) => v.kind === kind)!;
const awake = { asleep: false, reduced: false };

describe("déplacement d'un visiteur : jamais de saut", () => {
  it("chacun sa démarche : le renard marche, l'écureuil et le rouge-gorge bondissent, ceux qui volent font un arc, une plante repousse", () => {
    const gait = (kind: string) =>
      gaitFor({ kind: rule(kind).kind, place: rule(kind).place }, awake);
    expect(gait("renard")).toBe("walk");
    expect(gait("ecureuil")).toBe("hop");
    expect(gait("rouge-gorge")).toBe("hop");
    expect(gait("hirondelle")).toBe("fly");
    expect(gait("libellule")).toBe("fly");
    expect(gait("hibou")).toBe("fly");
    expect(gait("cigale")).toBe("fly");
    expect(gait("champignons")).toBe("regrow");
    expect(gait("tournesol")).toBe("regrow");
  });

  it("endormi : un fondu lent ; mouvement réduit : un fondu court, pour tous", () => {
    const fox = { kind: rule("renard").kind, place: rule("renard").place };
    expect(gaitFor(fox, { asleep: true, reduced: false })).toBe("fade");
    for (const visitor of VISITORS)
      expect(
        gaitFor(visitor, { asleep: false, reduced: true }),
        visitor.kind,
      ).toBe("fade");
    const from = { x: 10, y: 200 };
    const to = { x: 300, y: 240 };
    expect(planMove(from, to, "fade", true).duration).toBeCloseTo(
      2 * VISITOR_MOVE.fade.reduced,
    );
    expect(planMove(from, to, "fade").duration).toBeCloseTo(
      2 * VISITOR_MOVE.fade.asleep,
    );
  });

  const TRIPS: [Point, Point][] = [
    [
      { x: 20, y: 250 },
      { x: 340, y: 210 },
    ],
    [
      { x: 300, y: 200 },
      { x: 290, y: 204 },
    ],
    [
      { x: 40, y: 50 },
      { x: 230, y: 110 },
    ],
    [
      { x: 200, y: 6 },
      { x: 60, y: 20 },
    ],
  ];

  it.each(["walk", "hop", "fly"] as Gait[])(
    "%s : part de l'ancienne place, arrive à la nouvelle, sans sortir par le haut",
    (gait) => {
      for (const [from, to] of TRIPS) {
        const plan = planMove(from, to, gait);
        expect(movePoint(plan, from, to, 0)).toEqual(from);
        const end = movePoint(plan, from, to, 1);
        expect(end.x).toBeCloseTo(to.x, 6);
        expect(end.y).toBeCloseTo(to.y, 6);
        expect(plan.duration).toBeGreaterThanOrEqual(VISITOR_MOVE.duration[0]);
        expect(plan.duration).toBeLessThanOrEqual(VISITOR_MOVE.duration[1]);
        for (let t = 0; t <= 1; t += 0.01)
          expect(movePoint(plan, from, to, t).y).toBeGreaterThanOrEqual(0);
      }
    },
  );

  it.each(["walk", "hop", "fly"] as Gait[])(
    "%s : d'une image à l'autre (60 par seconde), moins de 4 unités de scène",
    (gait) => {
      // 4 unités ≈ 4 px sur un téléphone (scène de 390 unités sur ~400 px).
      for (const [from, to] of [
        ...TRIPS,
        [
          { x: 0, y: 290 },
          { x: SCENE.width - 30, y: 180 },
        ] as [Point, Point],
      ]) {
        const plan = planMove(from, to, gait);
        const frames = Math.ceil(plan.duration * 60);
        let previous = movePoint(plan, from, to, 0);
        for (let i = 1; i <= frames; i++) {
          const point = movePoint(plan, from, to, i / frames);
          expect(
            Math.hypot(point.x - previous.x, point.y - previous.y),
          ).toBeLessThan(4);
          previous = point;
        }
      }
    },
  );

  it("repousse et fondu : la place ne change qu'au moment où le visiteur est invisible", () => {
    const from = { x: 20, y: 250 };
    const to = { x: 340, y: 210 };
    for (const gait of ["regrow", "fade"] as Gait[]) {
      const plan = planMove(from, to, gait);
      expect(plan.switchAt).toBeGreaterThan(0);
      expect(plan.switchAt).toBeLessThan(1);
      expect(movePoint(plan, from, to, plan.switchAt - 0.01)).toEqual(from);
      expect(movePoint(plan, from, to, plan.switchAt)).toEqual(to);
    }
  });
});
