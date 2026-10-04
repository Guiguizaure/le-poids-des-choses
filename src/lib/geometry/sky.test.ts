import { describe, expect, it } from "vitest";
import { cloudDrift, cloudSeconds, SKY, wrapOffset } from "./sky";

describe("dérive des nuages", () => {
  const drift = cloudDrift(42, 88, 390); // nuage-1 : de x = 42 à 130
  it("une traversée = largeur de la scène + largeur du nuage", () => {
    expect(drift.distance).toBe(478);
    expect(drift.max - drift.min).toBe(drift.distance);
  });
  it("la boucle est continue : fin de traversée = départ", () => {
    expect(wrapOffset(0, drift)).toBe(0);
    expect(wrapOffset(drift.distance, drift)).toBeCloseTo(0);
  });
  it("sorti à droite, il réapparaît caché à gauche", () => {
    const justOut = wrapOffset(drift.max, drift); // bord gauche du nuage au bord droit de la scène
    expect(42 + justOut + 88).toBeLessThanOrEqual(0); // nuage entièrement à gauche de la scène
  });
  it("vitesses différentes, entre 60 et 90 s", () => {
    const seconds = [0, 1, 2].map(cloudSeconds);
    expect(new Set(seconds).size).toBe(3);
    for (const s of seconds) {
      expect(s).toBeGreaterThanOrEqual(SKY.minCloudSeconds);
      expect(s).toBeLessThanOrEqual(SKY.maxCloudSeconds);
    }
    expect(cloudSeconds(3)).toBe(cloudSeconds(0));
  });
  it("halo du soleil : cycle d'environ 6 s, visible mais doux", () => {
    expect(SKY.sunBreathSeconds).toBe(6);
    expect(SKY.haloOpacity).toEqual([0.35, 0.6]);
    expect(SKY.haloScale).toEqual([1, 1.12]);
  });
});
