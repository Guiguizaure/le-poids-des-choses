// `pnpm captures` : captures du README (docs/captures/) depuis l'export statique servi par
// e2e/static-server.mjs (`pnpm build`, puis `PORT=4323 node e2e/static-server.mjs`).
import { chromium, devices } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:4323";
const OUT = new URL("../docs/captures/", import.meta.url).pathname;

const now = Date.now();
const entry = (
  id,
  gestureA,
  gestureB,
  quantity,
  chosen,
  avoidedKg,
  minutes,
) => ({
  id,
  date: new Date(now - minutes * 60_000).toISOString(),
  gestureA,
  gestureB,
  quantity,
  chosen,
  avoidedKg,
});
// Carnet de démonstration (identifiants choisis pour varier arbres et fleurs).
const JOURNAL = [
  entry("capture-0", "avion", "tgv", 300, "b", 66.5, 60),
  entry("capture-a", "voiture", "velo", 3, "b", 0.43, 50),
  entry("capture-b", "repas-boeuf", "repas-vegetarien", 1, "b", 4.12, 40),
  entry("capture-c", "voiture", "velo", 8, "b", 1.14, 30),
  entry("capture-d", "repas-boeuf", "repas-poulet", 1, "b", 3.51, 20),
  entry("capture-e", "jean", "jean", 1, "b", 25.09, 10),
  entry("capture-f", "avion", "tgv", 100, "a", 0, 5),
];

const browser = await chromium.launch();
try {
  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  await desktop.goto(`${BASE}/`);
  await desktop.waitForTimeout(800);
  await desktop.screenshot({ path: `${OUT}accueil.png` });

  const mobile = await browser.newContext({
    ...devices["iPhone 14"],
    reducedMotion: "reduce",
  });
  await mobile.addInitScript((entries) => {
    localStorage.setItem(
      "lpdc:journal:v1",
      JSON.stringify({ version: 1, entries }),
    );
    localStorage.setItem("lpdc:install-banner:dismissed", "1");
  }, JOURNAL);
  const page = await mobile.newPage();
  await page.goto(`${BASE}/comparer?a=tgv&b=avion&q=300`);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}duel.png` });
  await page.goto(`${BASE}/jardin`);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}jardin.png` });

  // Duel avec la carte « Le savais-tu ? » (sous les boutons de choix).
  await page.goto(`${BASE}/comparer?a=tgv&b=avion&q=300`);
  const fact = page.getByRole("complementary", { name: "Le savais-tu ?" });
  await fact.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}comparer-savais-tu.png` });

  // Jardin, oiseau en vol au milieu de sa boucle (animations normales).
  const moving = await browser.newContext({ ...devices["iPhone 14"] });
  await moving.addInitScript((entries) => {
    localStorage.setItem(
      "lpdc:journal:v1",
      JSON.stringify({ version: 1, entries }),
    );
    localStorage.setItem("lpdc:install-banner:dismissed", "1");
  }, JOURNAL);
  const garden = await moving.newPage();
  await garden.goto(`${BASE}/jardin`);
  await garden.waitForTimeout(1500);
  await garden
    .getByRole("button", { name: "Faire s’envoler l’oiseau" })
    .click();
  // Milieu de la boucle : en haut, quand il repart vers la droite.
  await garden.waitForFunction(() => {
    const bird = document.querySelector('[data-flight="boucle"]');
    const body = bird?.firstElementChild;
    if (!body) return false;
    const transform = getComputedStyle(body).transform;
    return transform === "none" || new DOMMatrix(transform).a > 0;
  });
  await garden.screenshot({ path: `${OUT}jardin-oiseau-en-vol.png` });
} finally {
  await browser.close();
}
console.log("Captures écrites dans docs/captures/");
