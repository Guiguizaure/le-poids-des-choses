import { defineConfig, devices } from "@playwright/test";

// Tests de bout en bout sur l'export statique (pnpm build d'abord), servi avec les en-têtes
// de Cloudflare Pages (public/_headers). Chromium (Android) et WebKit (proche de Safari iPhone).
const PORT = 4323;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    locale: "fr-FR",
  },
  projects: [
    { name: "chromium", use: { ...devices["Pixel 7"] } },
    { name: "webkit", use: { ...devices["iPhone 14"] } },
  ],
  webServer: {
    command: `PORT=${PORT} node e2e/static-server.mjs`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
  },
});
