// « Raconte ta journée » en veille (NEXT_PUBLIC_RACONTE_ENABLED absent au build, cas de la CI) :
// aucun lien ni texte sur les pages principales, /raconte et /en/your-day en 404, et la fonction
// Cloudflare (AI_ENABLED=0, e2e/pages-server.mjs) refuse sans appeler le faux Anthropic.
import { request as playwrightRequest } from "@playwright/test";
import {
  acceptDocument404,
  entry,
  expect,
  seedJournal,
  test,
  trackNetwork,
} from "./fixtures";
import { RACONTE_ENABLED } from "../src/lib/raconte/enabled";

const PAGES_URL = "https://localhost:4331";
const FAKE_URL = "http://127.0.0.1:4330";

test.skip(RACONTE_ENABLED, "« Raconte ta journée » allumée : rien à vérifier");

const TITLES = /raconte ta journée|tell us about your day/i;
const ENTRY_LINKS = 'a[href*="raconte"], a[href*="your-day"]';

// Un carnet qui contient des choix notés par « Raconte ta journée » (même forme qu'un duel :
// TER comparé à la voiture, espèce choisie) et une habitude : ils restent et s'affichent.
const JOURNAL = [
  {
    id: "raconte-ter",
    date: new Date(Date.now() - 60 * 60_000).toISOString(),
    gestureA: "voiture",
    gestureB: "ter",
    quantity: 40,
    chosen: "b",
    avoidedKg: 6.1,
    species: "arbre-1",
  },
  {
    kind: "habit",
    id: "raconte-velo",
    date: new Date().toISOString(),
    gesture: "velo",
    plant: null,
  },
  entry("duel-1", 4.1, 120),
];

for (const [lang, paths] of [
  [
    "fr",
    [
      "/",
      "/comparer",
      "/comparer?habitude=",
      "/jardin",
      "/jardin/carnet",
      "/saison",
      "/methode",
      "/confidentialite",
      "/mentions-legales",
      "/connexion",
    ],
  ],
  [
    "en",
    [
      "/en",
      "/en/compare",
      "/en/compare?habitude=",
      "/en/garden",
      "/en/garden/journal",
      "/en/in-season",
      "/en/method",
      "/en/privacy",
      "/en/legal-notice",
      "/en/sign-in",
    ],
  ],
] as const) {
  test.describe(`veille, ${lang} : aucune trace de « Raconte ta journée »`, () => {
    for (const path of paths) {
      for (const withJournal of /^\/(en)?$|jardin|garden/.test(path)
        ? [false, true]
        : [false]) {
        test(`${path}${withJournal ? " (avec un carnet)" : ""}`, async ({
          page,
        }) => {
          if (withJournal) await seedJournal(page, JOURNAL);
          const asked: string[] = [];
          page.on("request", (request) => {
            if (request.url().includes("/api/raconte"))
              asked.push(request.url());
          });
          const network = trackNetwork(page);
          await page.goto(path);
          // Le carnet n'est lu qu'après l'hydratation : on attend le réseau au repos, puis
          // l'affichage du carnet quand il y en a un.
          await network.idle();
          if (withJournal && /\/(jardin|garden)$/.test(path))
            await expect(
              page.getByRole("heading", { name: /^(Carnet|Journal)$/ }),
            ).toBeVisible();
          await expect(page.locator(ENTRY_LINKS)).toHaveCount(0);
          expect(await page.locator("body").innerText()).not.toMatch(TITLES);
          // Pas même la question « la fonction est-elle active ? ».
          expect(asked).toEqual([]);
        });
      }
    }
  });
}

test("veille : pages légales et méthode sans le passage sur l'IA", async ({
  page,
}) => {
  for (const path of [
    "/confidentialite",
    "/en/privacy",
    "/methode",
    "/en/method",
  ]) {
    await page.goto(path);
    await expect(page.locator("#raconte")).toHaveCount(0);
    if (/confidentialite|privacy/.test(path))
      expect(await page.locator("main").innerText()).not.toMatch(/Anthropic/);
  }
  // Turnstile ne sert plus qu'à la connexion.
  await page.goto("/confidentialite");
  await expect(
    page.getByText(/sur le formulaire de connexion seulement/),
  ).toBeVisible();
  await page.goto("/en/privacy");
  await expect(page.getByText(/on the sign-in form only/)).toBeVisible();
});

test("veille : les choix notés par « Raconte ta journée » restent dans le carnet", async ({
  page,
}) => {
  await seedJournal(page, JOURNAL);
  await page.goto("/jardin");
  await expect(page.getByText("2 choix notés")).toBeVisible();
  await expect(page.locator("#carnet-entrees > li")).toHaveCount(3);
  await expect(page.locator("#carnet-entrees")).toContainText("TER");
});

for (const [path, heading] of [
  ["/raconte", "Cette page s’est perdue dans la brume"],
  ["/en/your-day", "This page got lost in the mist"],
] as const) {
  test(`veille : ${path} n'est pas généré (404)`, async ({
    page,
    consoleErrors,
  }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    acceptDocument404(consoleErrors);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
  });
}

test("veille : la fonction refuse l'appel direct, sans contacter Anthropic", async () => {
  const api = await playwrightRequest.newContext({ ignoreHTTPSErrors: true });
  const calls = async () =>
    (await (await api.get(`${FAKE_URL}/v1/messages/count`)).json()).count;
  const before = await calls();

  const status = await api.get(`${PAGES_URL}/api/raconte`);
  expect(await status.json()).toEqual({ enabled: false });

  const response = await api.post(`${PAGES_URL}/api/raconte`, {
    headers: { Origin: PAGES_URL, "Content-Type": "application/json" },
    data: {
      text: "J’ai pris le TER pour aller au travail.",
      turnstileToken: "jeton-e2e",
    },
  });
  expect(response.status()).toBe(503);
  expect(await response.json()).toEqual({ error: "ai-disabled" });
  expect(await calls()).toBe(before);
  await api.dispose();
});
