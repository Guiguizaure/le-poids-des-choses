// Garde-fou du build (jamais bloquant) : sans clé publique Turnstile, le formulaire de
// connexion utilise la clé de test de Cloudflare, que la vraie clé secrète refuse.

export function checkTurnstileKey(
  env: Record<string, string | undefined> = process.env,
): { ok: true; message: string } {
  return env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    ? { ok: true, message: "Turnstile : clé publique définie." }
    : {
        ok: true,
        message:
          "Attention : NEXT_PUBLIC_TURNSTILE_SITE_KEY absente, le formulaire de connexion utilise la clé de test de Turnstile (à définir dans Cloudflare Pages, Production et Preview).",
      };
}
