import { describe, expect, it } from "vitest";
import { SCENE } from "@/lib/garden/scene";
import {
  BIRD_HOME,
  BIRD_SIZE,
  FLIGHT,
  flightDelay,
  flightPose,
  flightSamples,
  LOOP_SPAN,
  SKY_BAND,
  SUN,
} from "./flight";

/** Distance entre le centre du soleil et le cadre de l'oiseau centré en (x, y). */
function sunDistance(x: number, y: number): number {
  const left = x - BIRD_SIZE.width / 2;
  const top = y - BIRD_SIZE.height / 2;
  const nearestX = Math.max(left, Math.min(SUN.x, left + BIRD_SIZE.width));
  const nearestY = Math.max(top, Math.min(SUN.y, top + BIRD_SIZE.height));
  return Math.hypot(SUN.x - nearestX, SUN.y - nearestY);
}

const SAMPLES = flightSamples();

describe("envol de l'oiseau", () => {
  it("part de sa place et revient s'y poser", () => {
    const start = flightPose(0);
    const end = flightPose(1);
    expect(start.x).toBeCloseTo(BIRD_HOME[0], 5);
    expect(start.y).toBeCloseTo(BIRD_HOME[1], 5);
    expect(end.x).toBeCloseTo(BIRD_HOME[0], 5);
    expect(end.y).toBeCloseTo(BIRD_HOME[1], 5);
  });
  it("ne sort jamais de la scène", () => {
    for (const { x, y } of SAMPLES) {
      expect(x - BIRD_SIZE.width / 2).toBeGreaterThanOrEqual(0);
      expect(x + BIRD_SIZE.width / 2).toBeLessThanOrEqual(SCENE.width);
      expect(y - BIRD_SIZE.height / 2).toBeGreaterThanOrEqual(0);
      expect(y + BIRD_SIZE.height / 2).toBeLessThanOrEqual(SCENE.height);
    }
  });
  it("ne passe jamais devant le soleil (halo compris)", () => {
    for (const { x, y } of SAMPLES) {
      expect(sunDistance(x, y)).toBeGreaterThan(SUN.radius);
    }
  });
  it("fait sa boucle dans la bande de ciel du papillon et de l'abeille", () => {
    const loop = SAMPLES.filter((pose) => pose.phase === "boucle");
    expect(loop.length).toBeGreaterThan(50);
    for (const { y } of loop) {
      expect(y - BIRD_SIZE.height / 2).toBeGreaterThanOrEqual(SKY_BAND.top);
      expect(y + BIRD_SIZE.height / 2).toBeLessThanOrEqual(SKY_BAND.bottom);
    }
    // Une vraie boucle : l'oiseau y va vers la gauche, monte, puis repart vers la droite.
    expect(loop.some((pose) => pose.facing === -1)).toBe(true);
    expect(loop.some((pose) => pose.facing === 1)).toBe(true);
    expect(LOOP_SPAN[0]).toBeGreaterThan(0.2);
    expect(LOOP_SPAN[1]).toBeLessThan(0.8);
  });
  it("trajet continu, sans saut, et phases dans l'ordre", () => {
    for (let i = 1; i < SAMPLES.length; i++) {
      const step = Math.hypot(
        SAMPLES[i].x - SAMPLES[i - 1].x,
        SAMPLES[i].y - SAMPLES[i - 1].y,
      );
      expect(step).toBeLessThan(3);
    }
    const phases = [...new Set(SAMPLES.map((pose) => pose.phase))];
    expect(phases).toEqual(["depart", "boucle", "retour"]);
  });
  it("regarde dans le sens du vol, inclinaison bornée", () => {
    expect(flightPose(0.1).facing).toBe(-1);
    for (const { tilt } of SAMPLES) {
      expect(Math.abs(tilt)).toBeLessThanOrEqual(FLIGHT.maxTilt);
    }
  });
  it("délai entre deux envols : 40 à 90 s, reproductible avec la même graine", () => {
    const seeds = [1, 42, 123456789, -7];
    for (const seed of seeds) {
      for (let index = 0; index < 50; index++) {
        const delay = flightDelay(seed, index);
        expect(delay).toBeGreaterThanOrEqual(40);
        expect(delay).toBeLessThanOrEqual(90);
        expect(flightDelay(seed, index)).toBe(delay);
      }
    }
    // Des délais variés, et une autre graine donne une autre suite.
    const delays = Array.from({ length: 20 }, (_, i) => flightDelay(42, i));
    expect(new Set(delays.map(Math.round)).size).toBeGreaterThan(8);
    expect(flightDelay(43, 0)).not.toBe(flightDelay(42, 0));
  });
});
