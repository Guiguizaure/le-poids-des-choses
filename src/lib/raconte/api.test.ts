import { describe, expect, it, vi } from "vitest";
import { raconte, RACONTE_TIMEOUT_MS } from "./api";

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

  it("délai maximal : une analyse qui ne répond jamais donne « timeout » au bout de 20 s", async () => {
    vi.useFakeTimers();
    try {
      let settled: unknown = null;
      const pending = raconte("texte", "ok", {
        fetcher: ((_input: RequestInfo | URL, init?: RequestInit) =>
          new Promise<Response>((_resolve, reject) =>
            init?.signal?.addEventListener("abort", () =>
              reject(new DOMException("Aborted", "AbortError")),
            ),
          )) as typeof fetch,
      }).then((result) => (settled = result));
      // Le serveur attend Claude jusqu'à 15 s : pas coupé à 15 s ici.
      await vi.advanceTimersByTimeAsync(15_000);
      expect(settled).toBeNull();
      await vi.advanceTimersByTimeAsync(RACONTE_TIMEOUT_MS - 15_000);
      await pending;
      expect(settled).toEqual({ ok: false, error: "timeout" });
    } finally {
      vi.useRealTimers();
    }
  });
});
