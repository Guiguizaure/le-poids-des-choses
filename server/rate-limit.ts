// Limites de débit à fenêtres fixes, comptées dans D1. La clé contient un HMAC de l'e-mail ou
// de l'IP : ni l'un ni l'autre n'est stocké en clair.
import type { Limit } from "./config";
import type { D1Database } from "./env";

/** Début de la fenêtre qui contient `now`. */
export function windowStart(now: number, windowMs: number): number {
  return now - (now % windowMs);
}

/**
 * Compte une demande dans chaque fenêtre et renvoie vrai si toutes restent sous leur
 * maximum. Une demande refusée est comptée aussi (insister ne rouvre pas la porte).
 */
export async function hitLimits(
  db: D1Database,
  key: string,
  limits: readonly Limit[],
  now: number,
): Promise<boolean> {
  const results = await db.batch<{ count: number }>(
    limits.map((limit) =>
      db
        .prepare(
          `INSERT INTO rate_limits (bucket, window_start, count) VALUES (?, ?, 1)
           ON CONFLICT (bucket, window_start) DO UPDATE SET count = count + 1
           RETURNING count`,
        )
        .bind(`${key}:${limit.name}`, windowStart(now, limit.windowMs)),
    ),
  );
  return results.every(
    (result, index) =>
      (result.results[0]?.count ?? Number.POSITIVE_INFINITY) <=
      limits[index].max,
  );
}
