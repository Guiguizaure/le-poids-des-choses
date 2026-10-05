// Vérification du jeton Turnstile (siteverify de Cloudflare).
import { TURNSTILE_VERIFY_URL } from "./config";
import type { Env } from "./env";

export async function verifyTurnstile(
  env: Env,
  token: unknown,
  ip: string,
): Promise<boolean> {
  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > 2048 ||
    !env.TURNSTILE_SECRET_KEY
  )
    return false;
  try {
    const response = await fetch(
      env.TURNSTILE_VERIFY_URL || TURNSTILE_VERIFY_URL,
      {
        method: "POST",
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET_KEY,
          response: token,
          remoteip: ip,
        }),
      },
    );
    if (!response.ok) return false;
    const result = (await response.json()) as { success?: unknown };
    return result.success === true;
  } catch {
    return false;
  }
}
