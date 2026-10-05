// Réponses JSON, lecture du corps, cookie de session.
import { MAX_BODY_BYTES, SESSION_COOKIE, SESSION_TTL_MS } from "./config";

/** Codes d'erreur renvoyés au navigateur (les messages sont écrits côté interface). */
export type ErrorCode =
  | "origin"
  | "bad-request"
  | "too-large"
  | "invalid-email"
  | "turnstile"
  | "rate-limited"
  | "invalid-link"
  | "unauthorized"
  | "confirm"
  | "journal-full"
  | "mail"
  | "unavailable"
  | "server";

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: ErrorCode,
  ) {
    super(code);
  }
}

export function json(
  body: unknown,
  status = 200,
  headers: Record<string, string> = {},
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...headers },
  });
}

export function errorResponse(error: HttpError): Response {
  return json({ error: error.code }, error.status);
}

/** Corps JSON d'une requête, refusé s'il n'est pas déclaré JSON ou s'il est trop gros. */
export async function readJson(request: Request): Promise<unknown> {
  const type = request.headers.get("Content-Type") ?? "";
  if (!type.toLowerCase().startsWith("application/json"))
    throw new HttpError(415, "bad-request");
  const length = Number(request.headers.get("Content-Length") ?? "0");
  if (length > MAX_BODY_BYTES) throw new HttpError(413, "too-large");
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) throw new HttpError(413, "too-large");
  try {
    return JSON.parse(text);
  } catch {
    throw new HttpError(400, "bad-request");
  }
}

export function readCookie(request: Request, name: string): string | null {
  const header = request.headers.get("Cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index < 0) continue;
    if (part.slice(0, index).trim() === name)
      return part.slice(index + 1).trim() || null;
  }
  return null;
}

export function sessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_TTL_MS / 1000}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

/** IP du visiteur (Cloudflare la donne dans CF-Connecting-IP). */
export function clientIp(request: Request): string {
  return request.headers.get("CF-Connecting-IP") ?? "inconnue";
}

/** En-têtes ajoutés à toutes les réponses de l'API. */
export const API_HEADERS: Record<string, string> = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
};
