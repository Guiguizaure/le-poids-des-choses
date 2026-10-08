import { defineConfig, devices } from "@playwright/test";

// Tests de bout en bout sur l'export statique (pnpm build d'abord), servi avec les en-têtes
// de Cloudflare Pages (public/_headers). Chromium (Android) et WebKit (proche de Safari iPhone).
// Le compte et « Raconte ta journée » (e2e/compte.spec.ts, e2e/raconte.spec.ts) passent par `wrangler pages dev` (Pages Functions, D1 locale,
// HTTPS) et de faux Resend, Turnstile et Anthropic : aucun vrai e-mail, aucun appel à Claude,
// aucune connexion à Cloudflare.
const PORT = 4323;
const FAKE_PORT = 4330;
const PAGES_PORT = 4331;

/**
 * Le jardin passe en nuit de 21 h à 6 h (heure de l'appareil) : pour que les tests ne
 * dépendent pas de l'heure du lancement, le navigateur vit dans un fuseau où il est vers 13 h.
 * Les tests de la nuit fixent eux-mêmes leur heure et leur fuseau (e2e/jardin-vivant.spec.ts).
 */
function middayTimeZone(now = new Date()): string {
  const offset = 13 - now.getUTCHours();
  if (offset === 0) return "Etc/GMT";
  // Les fuseaux Etc/GMT ont le signe inversé : Etc/GMT-3 vaut UTC+3.
  return offset > 0 ? `Etc/GMT-${offset}` : `Etc/GMT+${-offset}`;
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Rapport HTML (playwright-report/) : traces et pièces jointes, dont erreurs-console.txt.
  reporter: process.env.CI
    ? [["github"], ["list"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    locale: "fr-FR",
    timezoneId: middayTimeZone(),
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Pixel 7"] },
      testIgnore: /(compte|raconte)\.spec\.ts/,
    },
    {
      name: "webkit",
      use: { ...devices["iPhone 14"] },
      testIgnore: /(compte|raconte)\.spec\.ts/,
    },
    // Compte : un seul serveur workerd local pour tous ces tests, donc peu à la fois, et après
    // les autres (moins de charge simultanée). Seuls : `--project=compte-chromium --no-deps`.
    // Un worker par navigateur, deux tests à la fois : à quatre, le serveur local répondait
    // en plus de 5 s (lien, pages) et miniflare perdait des connexions (500), et le « parcours
    // complet » échouait une fois sur deux (3 réussites sur 8, contre 16 sur 16 à deux).
    {
      name: "compte-chromium",
      use: { ...devices["Pixel 7"] },
      testMatch: /compte\.spec\.ts/,
      dependencies: ["chromium", "webkit"],
      workers: 1,
      timeout: 60_000,
    },
    {
      name: "compte-webkit",
      use: { ...devices["iPhone 14"] },
      testMatch: /compte\.spec\.ts/,
      dependencies: ["chromium", "webkit"],
      workers: 1,
      timeout: 60_000,
    },
    // « Raconte ta journée » : même serveur local, après le compte (sa charge reste la même).
    {
      name: "raconte-chromium",
      use: { ...devices["Pixel 7"] },
      testMatch: /raconte\.spec\.ts/,
      dependencies: ["compte-chromium", "compte-webkit"],
      workers: 2,
      timeout: 60_000,
    },
    {
      name: "raconte-webkit",
      use: { ...devices["iPhone 14"] },
      testMatch: /raconte\.spec\.ts/,
      dependencies: ["compte-chromium", "compte-webkit"],
      workers: 2,
      timeout: 60_000,
    },
  ],
  webServer: [
    {
      command: `PORT=${PORT} node e2e/static-server.mjs`,
      url: `http://localhost:${PORT}`,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `PORT=${FAKE_PORT} node e2e/fake-services.mjs`,
      url: `http://127.0.0.1:${FAKE_PORT}`,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `PORT=${PAGES_PORT} FAKE_SERVICES_URL=http://127.0.0.1:${FAKE_PORT} node e2e/pages-server.mjs`,
      url: `https://localhost:${PAGES_PORT}/api/auth/session`,
      ignoreHTTPSErrors: true,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
