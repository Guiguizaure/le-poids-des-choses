// Entretien de la base, déclenché par les appels à l'API (au plus une fois par jour) : il n'y a
// pas de tâche planifiée dans Pages. Sans visite, la purge attend la visite suivante.
import { DAY, INACTIVE_MONTHS, RATE_LIMIT_RETENTION_MS } from "./config";
import type { D1Database } from "./env";

/** Date limite d'activité : un compte vu avant elle (24 mois) est supprimé. */
export function inactiveCutoff(now: number): number {
  const date = new Date(now);
  date.setUTCMonth(date.getUTCMonth() - INACTIVE_MONTHS);
  return date.getTime();
}

/**
 * Lance la purge si la dernière date de plus d'un jour (la réservation est atomique : deux
 * requêtes simultanées ne purgent qu'une fois). Renvoie vrai si la purge a eu lieu.
 */
export async function runMaintenance(
  db: D1Database,
  now: number,
): Promise<boolean> {
  const claimed = await db
    .prepare(
      `INSERT INTO maintenance (name, ran_at) VALUES ('purge', ?)
       ON CONFLICT (name) DO UPDATE SET ran_at = excluded.ran_at
       WHERE maintenance.ran_at <= ?
       RETURNING ran_at`,
    )
    .bind(now, now - DAY)
    .first();
  if (!claimed) return false;
  const cutoff = inactiveCutoff(now);
  const inactive = "SELECT id FROM users WHERE last_seen_at < ?";
  await db.batch([
    db
      .prepare(`DELETE FROM journal_entries WHERE user_id IN (${inactive})`)
      .bind(cutoff),
    db
      .prepare(
        `DELETE FROM sessions WHERE user_id IN (${inactive}) OR expires_at <= ?`,
      )
      .bind(cutoff, now),
    db.prepare("DELETE FROM users WHERE last_seen_at < ?").bind(cutoff),
    db.prepare("DELETE FROM login_tokens WHERE expires_at <= ?").bind(now),
    db
      .prepare("DELETE FROM rate_limits WHERE window_start < ?")
      .bind(now - RATE_LIMIT_RETENTION_MS),
  ]);
  return true;
}
