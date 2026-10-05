import { describe, expect, it } from "vitest";
import { raconte } from "./api";

const reply = (status: number, body: unknown) => async () =>
  new Response(JSON.stringify(body), { status });

describe("client de /api/raconte", () => {
  it("revalide la réponse : seuls les gestes valides passent", async () => {
    const result = await raconte("J'ai pris le <TER>", "ok", {
      fetcher: reply(200, {
        gestures: [
          {
            excerpt: "pris le ‹TER›",
            gestureId: "ter",
            certainty: "explicit",
            quantity: null,
            mode: null,
          },
          {
            excerpt: "pris le",
            gestureId: "inconnu",
            certainty: "explicit",
            quantity: null,
            mode: null,
          },
        ],
      }),
    });
    expect(result).toEqual({
      ok: true,
      detections: [expect.objectContaining({ gestureId: "ter" })],
    });
  });

  it("pannes : un code doux, jamais d'exception", async () => {
    const cases: [() => Promise<Response>, string][] = [
      [async () => Promise.reject(new TypeError("réseau")), "offline"],
      [reply(429, { error: "rate-limited" }), "rate-limited"],
      [reply(503, { error: "ai-quota" }), "quota"],
      [reply(503, { error: "ai-disabled" }), "disabled"],
      [reply(400, { error: "turnstile" }), "turnstile"],
      [reply(502, { error: "ai-failed" }), "error"],
      [async () => new Response("<html>", { status: 404 }), "error"],
    ];
    for (const [fetcher, error] of cases)
      expect(
        await raconte("texte", "ok", { fetcher: fetcher as typeof fetch }),
      ).toEqual({ ok: false, error });
  });
});
