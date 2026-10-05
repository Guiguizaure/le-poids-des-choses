// Export statique + Pages Functions pour les tests de bout en bout du compte : base D1 locale
// neuve (migrations du dépôt), `wrangler pages dev` en HTTPS (cookie __Host-, Secure) et
// valeurs de test passées en options : elles l'emportent sur un éventuel .dev.vars, donc
// jamais de vraie clé Resend ni de vrai envoi. Aucune connexion au compte Cloudflare.
import { spawn, spawnSync } from "node:child_process";
import { rmSync } from "node:fs";

const PORT = Number(process.env.PORT ?? 4331);
const FAKE = process.env.FAKE_SERVICES_URL ?? "http://127.0.0.1:4330";
const STATE = ".tmp/e2e-d1";
const WRANGLER = "node_modules/.bin/wrangler";
const env = { ...process.env, CI: "1", WRANGLER_SEND_METRICS: "false" };

rmSync(STATE, { recursive: true, force: true });
const migrate = spawnSync(
  WRANGLER,
  [
    "d1",
    "migrations",
    "apply",
    "lpdc-local",
    "--local",
    "-c",
    "wrangler.local.toml",
    "--persist-to",
    STATE,
  ],
  { stdio: "inherit", env },
);
if (migrate.status !== 0) process.exit(migrate.status ?? 1);

const bindings = {
  RESEND_API_KEY: "re_faux_e2e",
  RESEND_API_URL: FAKE,
  TURNSTILE_SECRET_KEY: "secret-faux-e2e",
  TURNSTILE_VERIFY_URL: `${FAKE}/siteverify`,
  HASH_SECRET: "hash-e2e",
  ALLOW_LOCALHOST: "1",
};

const server = spawn(
  WRANGLER,
  [
    "pages",
    "dev",
    "out",
    "--port",
    String(PORT),
    "--local-protocol",
    "https",
    "--d1",
    "DB=lpdc-local",
    "--persist-to",
    STATE,
    "--compatibility-date",
    "2026-10-01",
    "--show-interactive-dev-session",
    "false",
    ...Object.entries(bindings).flatMap(([name, value]) => [
      "-b",
      `${name}=${value}`,
    ]),
  ],
  { stdio: "inherit", env },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => server.kill(signal));
server.on("exit", (code) => process.exit(code ?? 0));
