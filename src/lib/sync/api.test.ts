import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { REQUEST_TIMEOUT_MS } from "@/lib/net/deadline";
import { accountApi } from "./api";

/** fetch qui ne répond jamais, sauf pour se laisser couper (comme le vrai). */
function hangingFetch() {
  return vi.fn(
    (_input: RequestInfo | URL, init?: RequestInit) =>
      new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () =>
          reject(new DOMException("Aborted", "AbortError")),
        );
      }),
  );
}

describe("client du compte : délai maximal", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("une requête qui ne répond jamais : « timeout » au bout de 15 s, pas avant", async () => {
    const fetchMock = hangingFetch();
    vi.stubGlobal("fetch", fetchMock);
    let settled: unknown = null;
    const pending = accountApi
      .requestLink("a@exemple.fr", "jeton")
      .then((result) => (settled = result));
    await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS - 1);
    expect(settled).toBeNull();
    await vi.advanceTimersByTimeAsync(1);
    await pending;
    expect(settled).toEqual({ ok: false, error: "timeout" });
    expect(fetchMock.mock.calls[0][1]?.signal?.aborted).toBe(true);
  });

  it("même délai pour la synchro et l'export", async () => {
    vi.stubGlobal("fetch", hangingFetch());
    const sync = accountApi.sync({ since: 0, entries: [] });
    const exported = accountApi.exportFile();
    await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS);
    expect(await sync).toEqual({ ok: false, error: "timeout" });
    expect(await exported).toEqual({ ok: false, error: "timeout" });
  });

  it("une réponse dont le corps n'arrive jamais : « timeout » aussi", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
        const response = new Response("{}", { status: 200 });
        response.json = () =>
          new Promise((_resolve, reject) =>
            init?.signal?.addEventListener("abort", () =>
              reject(new DOMException("Aborted", "AbortError")),
            ),
          );
        return response;
      }),
    );
    const session = accountApi.session();
    await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS);
    expect(await session).toEqual({ ok: false, error: "timeout" });
  });

  it("panne réseau : « offline » ; réponse à temps : rien n'est coupé ensuite", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Promise.reject(new TypeError("réseau"))),
    );
    expect(await accountApi.session()).toEqual({
      ok: false,
      error: "offline",
    });
    let signal: AbortSignal | undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
        signal = init?.signal ?? undefined;
        return Response.json({ signedIn: false });
      }),
    );
    expect(await accountApi.session()).toEqual({
      ok: true,
      data: { signedIn: false },
    });
    await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS * 2);
    expect(signal?.aborted).toBe(false);
  });
});
