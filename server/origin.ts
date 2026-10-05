// Origines autorisées : vérifiées sur chaque requête qui modifie des données, et seules
// origines utilisées pour construire le lien de connexion.

const HOSTS = new Set([
  "lepoidsdeschoses.com",
  "www.lepoidsdeschoses.com",
  "le-poids-des-choses.pages.dev",
]);

/** Previews Cloudflare Pages : un seul niveau (« feat-comptes », « 1a2b3c4d »). */
const PREVIEW_HOST =
  /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.le-poids-des-choses\.pages\.dev$/;

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

export function isAllowedOrigin(
  origin: string,
  allowLocalhost = false,
): boolean {
  let url: URL;
  try {
    url = new URL(origin);
  } catch {
    return false;
  }
  // Une origine, rien d'autre (ni chemin, ni identifiants).
  if (url.origin !== origin) return false;
  if (
    url.protocol === "https:" &&
    url.port === "" &&
    (HOSTS.has(url.hostname) || PREVIEW_HOST.test(url.hostname))
  )
    return true;
  return (
    allowLocalhost &&
    LOCAL_HOSTS.has(url.hostname) &&
    (url.protocol === "https:" || url.protocol === "http:")
  );
}

/**
 * Origine d'une requête qui modifie des données : l'en-tête Origin doit exister, être celle
 * de l'adresse appelée (même site) et faire partie de la liste. Sinon null.
 */
export function trustedOrigin(
  request: Request,
  allowLocalhost = false,
): string | null {
  const origin = request.headers.get("Origin");
  if (!origin) return null;
  if (origin !== new URL(request.url).origin) return null;
  return isAllowedOrigin(origin, allowLocalhost) ? origin : null;
}
