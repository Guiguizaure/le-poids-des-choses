// Réglages du compte : durées, limites, adresses. Valeurs validées pour le lot V2-2.

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

/** Lien magique : 15 minutes, usage unique. */
export const LINK_TTL_MS = 15 * MINUTE;
/** Session : 90 jours, durée fixe. */
export const SESSION_TTL_MS = 90 * DAY;
/** Cookie de session : préfixe __Host- (Secure, Path=/, sans Domain). */
export const SESSION_COOKIE = "__Host-lpdc_session";
/** Comptes supprimés après 24 mois sans connexion ni synchro. */
export const INACTIVE_MONTHS = 24;
/** last_seen_at n'est réécrit qu'une fois par jour au plus. */
export const LAST_SEEN_RESOLUTION_MS = DAY;

export const MAIL_FROM = "Le poids des choses <connexion@lepoidsdeschoses.com>";
export const RESEND_API_URL = "https://api.resend.com";
export const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type Limit = { name: string; windowMs: number; max: number };

/** Demandes de lien par adresse e-mail. */
export const LINK_EMAIL_LIMITS: readonly Limit[] = [
  { name: "15m", windowMs: 15 * MINUTE, max: 3 },
  { name: "24h", windowMs: DAY, max: 10 },
];
/** Demandes de lien par IP. */
export const LINK_IP_LIMITS: readonly Limit[] = [
  { name: "15m", windowMs: 15 * MINUTE, max: 10 },
  { name: "24h", windowMs: DAY, max: 50 },
];
/** Vérifications de lien par IP. */
export const VERIFY_IP_LIMITS: readonly Limit[] = [
  { name: "15m", windowMs: 15 * MINUTE, max: 30 },
];
/** Les compteurs plus vieux que ça sont effacés (la plus longue fenêtre est de 24 h). */
export const RATE_LIMIT_RETENTION_MS = 2 * DAY;

/** Synchro : entrées par requête, taille d'une entrée, entrées par compte, réponse. */
export const SYNC_MAX_ENTRIES = 200;
export const SYNC_MAX_ENTRY_BYTES = 2048;
export const SYNC_MAX_ROWS_PER_USER = 20000;
export const SYNC_PAGE_SIZE = 1000;
/** Corps de requête accepté (200 entrées de 2 Ko, avec de la marge). */
export const MAX_BODY_BYTES = 512 * 1024;
