// Tests uniquement : base D1 locale en mémoire (getPlatformProxy de wrangler, sans compte
// Cloudflare) avec les migrations du dépôt appliquées.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { getPlatformProxy } from "wrangler";
import type { D1Database } from "../env";

const ROOT = path.resolve(import.meta.dirname, "../..");
const MIGRATIONS = path.join(ROOT, "migrations");
const TABLES = [
  "journal_entries",
  "sessions",
  "login_tokens",
  "users",
  "rate_limits",
  "maintenance",
];

/** Instructions d'un fichier de migration (commentaires retirés). */
export function splitSql(sql: string): string[] {
  return sql
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n")
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);
}

export async function createTestDb(): Promise<{
  db: D1Database;
  reset: () => Promise<void>;
  dispose: () => Promise<void>;
}> {
  const proxy = await getPlatformProxy<{ DB: D1Database }>({
    configPath: path.join(ROOT, "wrangler.local.toml"),
    persist: false,
    envFiles: [],
    remoteBindings: false,
  });
  const db = proxy.env.DB;
  for (const file of readdirSync(MIGRATIONS).sort()) {
    if (!file.endsWith(".sql")) continue;
    for (const statement of splitSql(
      readFileSync(path.join(MIGRATIONS, file), "utf8"),
    ))
      await db.prepare(statement).run();
  }
  return {
    db,
    reset: async () => {
      await db.batch(TABLES.map((table) => db.prepare(`DELETE FROM ${table}`)));
    },
    dispose: () => proxy.dispose(),
  };
}
