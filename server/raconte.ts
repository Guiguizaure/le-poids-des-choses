// « Raconte ta journée » : appel à Claude (Haiku 4.5) avec une sortie structurée, puis
// validation stricte. Le texte n'est ni stocké ni journalisé : seuls des compteurs le sont.
import Anthropic from "@anthropic-ai/sdk";
import { parseDetections, type Detection } from "../src/lib/raconte/detections";
import {
  RACONTE_MAX_TOKENS,
  RACONTE_MODEL,
  RACONTE_TEMPERATURE,
  RACONTE_TIMEOUT_MS,
} from "./config";
import type { Env } from "./env";
import { HttpError } from "./http";
import { outputSchema, systemPrompt, userMessage } from "./raconte-prompt";

export type RaconteOutcome = {
  detections: Detection[];
  /** Compteurs journalisés (jamais le texte). */
  stats: {
    stopReason: string | null;
    inputTokens: number;
    outputTokens: number;
    returned: number;
    kept: number;
  };
};

function client(env: Env): Anthropic {
  return new Anthropic({
    apiKey: env.ANTHROPIC_API_KEY,
    baseURL: env.ANTHROPIC_BASE_URL || undefined,
    timeout: RACONTE_TIMEOUT_MS,
    maxRetries: 0,
    // Lu à chaque appel : les tests remplacent fetch.
    fetch: (input, init) => fetch(input, init),
  });
}

/**
 * Analyse un texte déjà nettoyé (sanitizeText). Lève HttpError(502, "ai-failed") si l'API
 * échoue ou si la réponse est illisible ; un refus du modèle donne une liste vide.
 */
export async function detectGestures(
  env: Env,
  sanitizedText: string,
): Promise<RaconteOutcome> {
  let message: Anthropic.Message;
  try {
    message = await client(env).messages.create({
      model: RACONTE_MODEL,
      max_tokens: RACONTE_MAX_TOKENS,
      temperature: RACONTE_TEMPERATURE,
      system: systemPrompt(),
      messages: [{ role: "user", content: userMessage(sanitizedText) }],
      output_config: {
        format: { type: "json_schema", schema: outputSchema() },
      },
    });
  } catch (error) {
    console.error(
      "raconte : appel refusé",
      error instanceof Anthropic.APIError ? error.status : "réseau",
    );
    throw new HttpError(502, "ai-failed");
  }
  const stats = {
    stopReason: message.stop_reason,
    inputTokens: message.usage.input_tokens,
    outputTokens: message.usage.output_tokens,
    returned: 0,
    kept: 0,
  };
  if (message.stop_reason === "refusal") return { detections: [], stats };
  const text = message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    // Sortie coupée (max_tokens) ou illisible.
    console.error("raconte : sortie illisible", message.stop_reason);
    throw new HttpError(502, "ai-failed");
  }
  const detections = parseDetections(raw, sanitizedText);
  stats.returned = Array.isArray((raw as { gestures?: unknown }).gestures)
    ? (raw as { gestures: unknown[] }).gestures.length
    : 0;
  stats.kept = detections.length;
  return { detections, stats };
}
