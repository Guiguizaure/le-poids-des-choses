import { describe, expect, it } from "vitest";
import { SCENE, surfaceY } from "@/lib/garden/scene";
import { FALL, fallingParticles, particleAt } from "./fall";

describe("particules de saison", () => {
  it("pétales au printemps, feuilles en automne, rien en été ni en hiver (flocons à part)", () => {
    expect(fallingParticles("printemps").map((p) => p.name)).toEqual(
      Array(FALL.count).fill("saison-printemps-petale"),
    );
    expect(new Set(fallingParticles("automne").map((p) => p.name))).toEqual(
      new Set(["saison-automne-feuille-1", "saison-automne-feuille-2"]),
    );
    expect(fallingParticles("ete")).toEqual([]);
    expect(fallingParticles("hiver")).toEqual([]);
    expect(fallingParticles(null)).toEqual([]);
  });
  it("déterministes", () => {
    expect(fallingParticles("automne")).toEqual(fallingParticles("automne"));
  });
  it.each(["printemps", "automne"] as const)(
    "%s : partent au-dessus de la scène, restent dans sa largeur, se posent au sol",
    (season) => {
      for (const particle of fallingParticles(season)) {
        const start = particleAt(particle, 0);
        expect(start.y + particle.size).toBeLessThan(0);
        for (let t = 0; t <= 1; t += 0.05) {
          const pose = particleAt(particle, t);
          expect(pose.x).toBeGreaterThanOrEqual(0);
          expect(pose.x + particle.size).toBeLessThanOrEqual(SCENE.width);
        }
        const end = particleAt(particle, 1);
        expect(end.y).toBeGreaterThanOrEqual(
          surfaceY(particle.x + particle.size / 2),
        );
        expect(end.y + particle.size).toBeLessThanOrEqual(SCENE.height);
        expect(end.opacity).toBe(0);
        expect(particleAt(particle, particle.still).opacity).toBe(1);
      }
    },
  );
  it("elles ne tombent pas toutes ensemble", () => {
    const delays = fallingParticles("printemps").map((p) => p.delay);
    expect(new Set(delays).size).toBe(FALL.count);
  });
});
