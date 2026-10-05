// Liens magiques, comptes et sessions. En base, seules les empreintes des jetons existent.
import { LAST_SEEN_RESOLUTION_MS, LINK_TTL_MS, SESSION_TTL_MS } from "./config";
import { randomToken, sha256Hex } from "./crypto";
import type { D1Database } from "./env";

/** Forme d'un jeton émis par randomToken() (32 octets en base64url). */
const TOKEN = /^[A-Za-z0-9_-]{43}$/;

export function isTokenShaped(value: unknown): value is string {
  return typeof value === "string" && TOKEN.test(value);
}

/** Crée un lien de connexion pour `email` ; renvoie le jeton (jamais stocké en clair). */
export async function createLoginToken(
  db: D1Database,
  email: string,
  now: number,
): Promise<string> {
  const token = randomToken();
  await db
    .prepare(
      "INSERT INTO login_tokens (token_hash, email, created_at, expires_at) VALUES (?, ?, ?, ?)",
    )
    .bind(await sha256Hex(token), email, now, now + LINK_TTL_MS)
    .run();
  return token;
}

/**
 * Utilise un lien : renvoie l'adresse s'il est connu, pas encore utilisé et pas expiré, et le
 * marque utilisé dans la même requête (deux clics simultanés : un seul gagne). Les autres
 * liens en attente pour cette adresse deviennent inutilisables.
 */
export async function consumeLoginToken(
  db: D1Database,
  token: unknown,
  now: number,
): Promise<string | null> {
  if (!isTokenShaped(token)) return null;
  const row = await db
    .prepare(
      `UPDATE login_tokens SET used_at = ?
       WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?
       RETURNING email`,
    )
    .bind(now, await sha256Hex(token), now)
    .first<{ email: string }>();
  if (!row) return null;
  await db
    .prepare(
      "UPDATE login_tokens SET used_at = ? WHERE email = ? AND used_at IS NULL",
    )
    .bind(now, row.email)
    .run();
  return row.email;
}

export type User = { id: string; email: string };

/** Compte de cette adresse, créé au premier lien utilisé ; marque l'utilisateur actif. */
export async function upsertUser(
  db: D1Database,
  email: string,
  now: number,
): Promise<User> {
  const row = await db
    .prepare(
      `INSERT INTO users (id, email, created_at, last_seen_at) VALUES (?, ?, ?, ?)
       ON CONFLICT (email) DO UPDATE SET last_seen_at = excluded.last_seen_at
       RETURNING id, email`,
    )
    .bind(crypto.randomUUID(), email, now, now)
    .first<User>();
  if (!row) throw new Error("Compte introuvable après création.");
  return row;
}

export async function createSession(
  db: D1Database,
  userId: string,
  now: number,
): Promise<string> {
  const token = randomToken();
  await db
    .prepare(
      "INSERT INTO sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
    )
    .bind(await sha256Hex(token), userId, now, now + SESSION_TTL_MS)
    .run();
  return token;
}

export type Session = { tokenHash: string; userId: string; email: string };

/** Session valide du cookie (et activité notée une fois par jour au plus), sinon null. */
export async function findSession(
  db: D1Database,
  token: string | null,
  now: number,
): Promise<Session | null> {
  if (!isTokenShaped(token)) return null;
  const tokenHash = await sha256Hex(token);
  const row = await db
    .prepare(
      `SELECT s.user_id AS userId, u.email AS email, u.last_seen_at AS lastSeen
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
    )
    .bind(tokenHash, now)
    .first<{ userId: string; email: string; lastSeen: number }>();
  if (!row) return null;
  if (now - row.lastSeen >= LAST_SEEN_RESOLUTION_MS) {
    await db
      .prepare("UPDATE users SET last_seen_at = ? WHERE id = ?")
      .bind(now, row.userId)
      .run();
  }
  return { tokenHash, userId: row.userId, email: row.email };
}

export async function deleteSession(
  db: D1Database,
  tokenHash: string,
): Promise<void> {
  await db
    .prepare("DELETE FROM sessions WHERE token_hash = ?")
    .bind(tokenHash)
    .run();
}

/** Suppression réelle et immédiate : entrées, sessions, liens en attente, compte. */
export async function deleteAccount(
  db: D1Database,
  user: { userId: string; email: string },
): Promise<void> {
  await db.batch([
    db
      .prepare("DELETE FROM journal_entries WHERE user_id = ?")
      .bind(user.userId),
    db.prepare("DELETE FROM sessions WHERE user_id = ?").bind(user.userId),
    db.prepare("DELETE FROM login_tokens WHERE email = ?").bind(user.email),
    db.prepare("DELETE FROM users WHERE id = ?").bind(user.userId),
  ]);
}
