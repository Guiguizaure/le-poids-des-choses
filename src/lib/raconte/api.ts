// Appel à POST /api/raconte depuis le navigateur. Ne lève jamais d'erreur : la réponse est
// revalidée (même schéma que le serveur) et toute panne devient un code que l'écran formule
// avec douceur, avec un lien vers /comparer. Le reste du site n'en dépend jamais.
import { parseDetections, sanitizeText, type Detection } from "./detections";

export type RaconteError =
  | "offline"
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
  let response: Response;
  try {
    response = await fetcher("/api/raconte", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, turnstileToken }),
    });
  } catch {
    return { ok: false, error: "offline" };
  }
  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    // Corps illisible (site statique sans fonctions, par exemple).
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
