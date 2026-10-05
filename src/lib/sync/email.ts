// Adresse e-mail du compte : forme normalisée (espaces retirés, minuscules) et contrôle simple.
// Partagé par le formulaire et les fonctions Cloudflare.

const EMAIL = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

/** Adresse normalisée, ou null si elle n'a pas la forme d'une adresse e-mail. */
export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !EMAIL.test(email)) return null;
  // Aucun caractère de contrôle (en-têtes d'e-mail).
  if (
    [...email].some(
      (char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127,
    )
  )
    return null;
  return email;
}
