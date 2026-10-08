// Appel à POST /api/raconte depuis le navigateur. Ne lève jamais d'erreur : la réponse est
// revalidée (même schéma que le serveur) et toute panne devient un code que l'écran formule
// avec douceur, avec un lien vers /comparer. Le reste du site n'en dépend jamais.
import { deadline } from "@/lib/net/deadline";
import { parseDetections, sanitizeText, type Detection } from "./detections";

/**
 * Délai maximal de l'analyse (ms) : plus large que celui des autres appels, le serveur attend
 * déjà Claude jusqu'à 15 s (après Turnstile et les compteurs) ; couper à 15 s ici perdrait des
 * réponses arrivées à temps côté serveur.
 */
export const RACONTE_TIMEOUT_MS = 20_000;

export type RaconteError =
  | "offline"
  | "timeout"
  | "turnstile"
  | "text-length"
  | "rate-limited"
  | "quota"
  | "disabled"
  | "error";

export type RaconteResult =
  { ok: true; detections: Detection[] } | { ok: false; error: RaconteError };

const CODES: Record<string, RaconteError> = {
  turnstile: "turnstile",
  "text-length": "text-length",
  "rate-limited": "rate-limited",
  "ai-quota": "quota",
  "ai-disabled": "disabled",
};

export async function raconte(
  text: string,
  turnstileToken: string,
  { fetcher = fetch }: { fetcher?: typeof fetch } = {},
): Promise<RaconteResult> {
  const timer = deadline(RACONTE_TIMEOUT_MS);
  let response: Response;
  let body: unknown = null;
  try {
    response = await fetcher("/api/raconte", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, turnstileToken }),
      signal: timer.signal,
    });
    try {
      body = await response.json();
    } catch (error) {
      if ((error as Error)?.name === "AbortError") throw error;
      // Corps illisible (site statique sans fonctions, par exemple).
    }
  } catch {
    return { ok: false, error: timer.expired() ? "timeout" : "offline" };
  } finally {
    timer.clear();
  }
  if (response.ok)
    return { ok: true, detections: parseDetections(body, sanitizeText(text)) };
  if (response.status === 429) return { ok: false, error: "rate-limited" };
  const code = (body as { error?: unknown } | null)?.error;
  return {
    ok: false,
    error:
      typeof code === "string" && Object.hasOwn(CODES, code)
        ? CODES[code]
        : "error",
  };
}
