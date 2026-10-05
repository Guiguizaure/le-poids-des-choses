import { defineConfig, devices } from "@playwright/test";

// Tests de bout en bout sur l'export statique (pnpm build d'abord), servi avec les en-têtes
// de Cloudflare Pages (public/_headers). Chromium (Android) et WebKit (proche de Safari iPhone).
// Le compte (e2e/compte.spec.ts) passe par `wrangler pages dev` (Pages Functions, D1 locale,
// HTTPS) et de faux Resend et Turnstile : aucun vrai e-mail, aucune connexion à Cloudflare.
const PORT = 4323;
const FAKE_PORT = 4330;
const PAGES_PORT = 4331;

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
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Pixel 7"] },
      testIgnore: /compte\.spec\.ts/,
    },
    {
      name: "webkit",
      use: { ...devices["iPhone 14"] },
      testIgnore: /compte\.spec\.ts/,
    },
    // Compte : un seul serveur workerd local pour tous ces tests, donc peu à la fois, et après
    // les autres (moins de charge simultanée). Seuls : `--project=compte-chromium --no-deps`.
    {
      name: "compte-chromium",
      use: { ...devices["Pixel 7"] },
      testMatch: /compte\.spec\.ts/,
      dependencies: ["chromium", "webkit"],
      workers: 2,
      timeout: 60_000,
    },
    {
      name: "compte-webkit",
      use: { ...devices["iPhone 14"] },
      testMatch: /compte\.spec\.ts/,
      dependencies: ["chromium", "webkit"],
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
