// « Raconte ta journée » (/raconte) sur `wrangler pages dev` (export statique + Pages
// Functions, D1 locale) avec de faux Turnstile et Anthropic (e2e/fake-services.mjs) : aucun
// appel à Claude. Le faux modèle repère quelques mots-clés (« pris le TER », « un burger »…).
import type { BrowserContext, Page, TestInfo } from "@playwright/test";
import generated from "../src/lib/data/gestures.generated.json";
import {
  acceptCancelledPrefetch,
  acceptStatus,
  expect,
  expectNoAxeViolations,
  test,
} from "./fixtures";

const PAGES_PORT = 4331;
const BASE = `https://localhost:${PAGES_PORT}`;

test.use({ baseURL: BASE, ignoreHTTPSErrors: true });
test.afterEach(({ consoleErrors }) => acceptCancelledPrefetch(consoleErrors));

const FAKE_TURNSTILE = `
  (() => {
    const widgets = {};
    let next = 0;
    const issue = (id) => setTimeout(() => widgets[id] && widgets[id].callback("jeton-e2e"), 30);
    window.turnstile = {
      render(element, options) {
        const id = "w" + ++next;
        widgets[id] = options;
        issue(id);
        return id;
      },
      reset(id) { issue(id); },
      remove(id) { delete widgets[id]; },
    };
  })();
`;

// IP propre par test : le serveur local, réutilisé d'un lancement à l'autre, garde ses
// compteurs (3 analyses par 15 minutes et par IP).
const IP_BASE = Math.floor(Math.random() * 250);
let ipCounter = 0;

async function prepare(context: BrowserContext, testInfo: TestInfo) {
  await context.route(
    "https://challenges.cloudflare.com/turnstile/v0/api.js*",
    (route) =>
      route.fulfill({ contentType: "text/javascript", body: FAKE_TURNSTILE }),
  );
  ipCounter += 1;
  const project = testInfo.project.name.includes("webkit") ? 4 : 3;
  await context.setExtraHTTPHeaders({
    "CF-Connecting-IP": `10.${project}.${(IP_BASE + testInfo.workerIndex) % 250}.${ipCounter % 250}`,
  });
}

const kgPer = (id: string) =>
  generated.gestures.find((gesture) => gesture.id === id)!.kgCo2ePerUnit;

async function journal(page: Page) {
  return page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("lpdc:journal:v1") ?? '{"entries":[]}')
        .entries as {
        gestureA: string;
        gestureB: string;
        quantity: number;
        chosen: string;
        avoidedKg: number;
        modeA?: string;
        modeB?: string;
      }[],
  );
}

async function analyse(page: Page, text: string) {
  await page.getByLabel("Ta journée, en quelques phrases").fill(text);
  await page.getByRole("button", { name: "Analyser mon texte" }).click();
}

const row = (page: Page, name: string) =>
  page
    .getByRole("list", { name: "Voici ce que j’ai compris" })
    .getByRole("listitem")
    .filter({ has: page.getByText(name, { exact: true }) });

test("parcours complet : analyse, vérification, distance, ajout au carnet", async ({
  page,
}, testInfo) => {
  await prepare(page.context(), testInfo);
  await page.goto("/raconte");
  await expect(
    page.getByRole("heading", { level: 1, name: "Raconte ta journée" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Ton texte est envoyé à Claude (Anthropic) pour repérer les gestes, puis oublié. N’écris pas d’informations personnelles.",
    ),
  ).toBeVisible();
  await expect(page.getByText("0 / 280")).toBeVisible();
  await expectNoAxeViolations(page);

  await analyse(
    page,
    "Ce matin j'ai pris le TER pour Toulon, un burger à midi et un café en terrasse.",
  );
  const title = page.getByRole("heading", {
    name: "Voici ce que j’ai compris",
  });
  await expect(title).toBeFocused();

  // Nommé : coché ; déduit : « À vérifier », décoché.
  const ter = row(page, "TER");
  await expect(ter.getByRole("checkbox")).toBeChecked();
  await expect(ter).toContainText("Se déplacer · distance à préciser");
  await expect(ter).toContainText("Comparé à : Voiture thermique");
  const burger = row(page, "Repas au bœuf");
  await expect(burger.getByRole("checkbox")).not.toBeChecked();
  await expect(burger).toContainText("À vérifier");
  await expect(burger).toContainText("d’après « un burger »");
  const cafe = row(page, "Café");
  await expect(cafe.getByRole("checkbox")).toBeChecked();
  await expect(cafe).toContainText("Boire · 1 litre");

  // La distance manque : la carte est bordée d'accent, le champ est dedans ; rien ne peut
  // être ajouté.
  const add = page.getByRole("button", { name: "Ajouter au carnet" });
  await expect(add).toHaveAttribute("aria-disabled", "true");
  await expect(
    page.getByRole("button", { name: "1 geste à compléter" }),
  ).toBeVisible();
  await expect(ter).toHaveClass(/border-tomate/);
  await expect(cafe).not.toHaveClass(/border-tomate/);
  expect(await journal(page)).toEqual([]);
  await expectNoAxeViolations(page);

  // « Modifier » ne garde que l'option comparée (la distance est déjà dans la carte).
  await ter.getByRole("button", { name: "Modifier TER" }).click();
  await expect(
    ter.getByRole("button", { name: "Modifier TER" }),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(ter.getByLabel("Distance du trajet (km)")).toHaveCount(1);
  await expect(ter.getByLabel("Comparé à", { exact: true })).toBeVisible();
  await ter.getByLabel("Distance du trajet (km)").fill("65");
  await expect(ter).toContainText("Se déplacer · 65 km");
  await expect(ter).not.toHaveClass(/border-tomate/);
  await expect(add).not.toHaveAttribute("aria-disabled", "true");
  await expect(page.getByRole("button", { name: /à compléter$/ })).toHaveCount(
    0,
  );
  await expectNoAxeViolations(page);
  await add.click();

  await expect(
    page.getByRole("heading", { name: "C’est noté dans ton carnet" }),
  ).toBeFocused();
  await expect(page.getByText("2 gestes ajoutés à ton carnet.")).toBeVisible();
  // Plus lourd que son alternative : simplement noté, sans jugement.
  await expect(
    page.getByText(
      "Un choix plus lourd est simplement noté : rien n’est retiré au jardin.",
    ),
  ).toBeVisible();
  await expectNoAxeViolations(page);

  // Écarts calculés par src/lib/calc à partir des données, jamais par l'IA.
  const entries = await journal(page);
  expect(entries).toHaveLength(2);
  expect(entries).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        gestureA: "ter",
        gestureB: "voiture",
        quantity: 65,
        chosen: "a",
        avoidedKg:
          Math.round((kgPer("voiture") - kgPer("ter")) * 65 * 1000) / 1000,
      }),
      expect.objectContaining({
        gestureA: "cafe",
        gestureB: "the",
        quantity: 1,
        chosen: "a",
        avoidedKg: 0,
      }),
    ]),
  );

  await page.getByRole("link", { name: "Voir mon jardin" }).click();
  await expect(page).toHaveURL(/\/jardin\?nouveau=/);
  await expect(page.getByText("2 choix notés")).toBeVisible();
});

test("trajet sans distance : message visible, le bouton mène au champ, puis ajout", async ({
  page,
}, testInfo) => {
  await prepare(page.context(), testInfo);
  await page.goto("/raconte");
  await analyse(
    page,
    "Un café au réveil, puis à pied jusqu'au marché, et un burger à midi.",
  );
  const marche = row(page, "Marche");
  await expect(marche.getByRole("checkbox")).toBeChecked();
  await expect(marche).toHaveClass(/border-tomate/);
  const field = marche.getByLabel("Distance du trajet (km)");
  await expect(field).toBeVisible();

  // Message bien visible sous le bouton, qui reste un vrai bouton (aria-disabled).
  const add = page.getByRole("button", { name: "Ajouter au carnet" });
  await expect(add).toHaveAttribute("aria-disabled", "true");
  // Pas d'attribut disabled : il reste touchable (Playwright tient aria-disabled pour « désactivé »).
  await expect(add).not.toHaveAttribute("disabled");
  const message = page.getByRole("button", { name: "1 geste à compléter" });
  await expect(message).toBeVisible();
  await expect(add).toHaveAccessibleDescription("1 geste à compléter");

  // Toucher le bouton désactivé : défilement et focus sur le champ ; rien n'est ajouté.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  // force : Playwright refuse d'agir sur un élément aria-disabled ; un doigt, lui, le peut.
  await add.tap({ force: true });
  await expect(field).toBeFocused();
  await expect(field).toBeInViewport();
  expect(await journal(page)).toEqual([]);

  // Le message mène au même endroit.
  await add.focus();
  await message.tap();
  await expect(field).toBeFocused();

  await page.keyboard.type("2");
  await expect(marche).not.toHaveClass(/border-tomate/);
  await expect(message).toHaveCount(0);
  await add.tap();
  await expect(page.getByText("2 gestes ajoutés à ton carnet.")).toBeVisible();
  const entries = await journal(page);
  expect(entries).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        gestureA: "marche",
        gestureB: "voiture",
        quantity: 2,
      }),
      expect.objectContaining({ gestureA: "cafe" }),
    ]),
  );
});

test("objet : l'option écrite est reprise, l'écart suit les règles du duel objet", async ({
  page,
}, testInfo) => {
  await prepare(page.context(), testInfo);
  await page.goto("/raconte");
  await analyse(page, "J'ai acheté un jean d'occasion sur une appli.");
  const jean = row(page, "Jean");
  await expect(jean).toContainText("S’habiller · d’occasion, livré en colis");
  await page.getByRole("button", { name: "Ajouter au carnet" }).click();
  await expect(page.getByText("1 geste ajouté à ton carnet.")).toBeVisible();
  const [entry] = await journal(page);
  expect(entry).toMatchObject({
    gestureA: "jean",
    gestureB: "jean",
    chosen: "b",
    modeA: "neuf",
    modeB: "occasion-livree",
  });
  expect(entry.avoidedKg).toBeGreaterThan(0);
});

test("au clavier : cocher, modifier, ajouter", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name.includes("webkit"),
    "WebKit ne parcourt pas les contrôles avec Tab",
  );
  await prepare(page.context(), testInfo);
  await page.goto("/raconte");
  await analyse(page, "Un burger à midi, une voiture de 12 km le soir.");
  await expect(
    page.getByRole("heading", { name: "Voici ce que j’ai compris" }),
  ).toBeFocused();
  // Premier geste : le burger, déduit, décoché ; on le coche au clavier.
  await page.keyboard.press("Tab");
  await expect(row(page, "Repas au bœuf").getByRole("checkbox")).toBeFocused();
  await page.keyboard.press("Space");
  await expect(row(page, "Repas au bœuf").getByRole("checkbox")).toBeChecked();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Modifier Repas au bœuf" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  const compared = page.getByLabel("Comparé à", { exact: true });
  await expect(compared).toBeFocused();
  await compared.selectOption("repas-poulet");
  await expect(row(page, "Repas au bœuf")).toContainText(
    "Comparé à : Repas au poulet",
  );
  // La voiture : distance écrite (12 km), prête.
  await expect(row(page, "Voiture thermique")).toContainText("12 km");
  await page.getByRole("button", { name: "Ajouter au carnet" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("2 gestes ajoutés à ton carnet.")).toBeVisible();
  const entries = await journal(page);
  expect(
    entries.map((entry) => `${entry.gestureA}>${entry.gestureB}`).sort(),
  ).toEqual(["repas-boeuf>repas-poulet", "voiture>ter"]);
});

test("rien de reconnu ou panne : message doux et lien vers /comparer", async ({
  page,
  consoleErrors,
}, testInfo) => {
  await prepare(page.context(), testInfo);
  await page.goto("/raconte");
  await analyse(page, "Une journée tranquille à lire au soleil.");
  await expect(
    page.getByRole("heading", { name: "Rien de reconnu" }),
  ).toBeFocused();
  await expect(
    page.getByText(/^Je n’ai reconnu aucun geste du catalogue/),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Choisir mes gestes" }),
  ).toHaveAttribute("href", "/comparer");

  await analyse(page, "panne-e2e : j'ai pris le TER");
  await expect(
    page.getByText(/^Claude n’a pas pu lire ta journée cette fois/),
  ).toBeVisible();
  acceptStatus(consoleErrors, 502);
  expect(await journal(page)).toEqual([]);
  await expectNoAxeViolations(page);
});

test("fonction coupée : l'écran le dit tout de suite, le reste du site marche", async ({
  page,
  consoleErrors,
}, testInfo) => {
  await prepare(page.context(), testInfo);
  await page.route("**/api/raconte", (route) =>
    route.request().method() === "GET"
      ? route.fulfill({ json: { enabled: false } })
      : route.fallback(),
  );
  await page.goto("/raconte");
  await expect(
    page.getByText(/^« Raconte ta journée » fait une pause/),
  ).toBeVisible();
  await expect(
    page.getByLabel("Ta journée, en quelques phrases"),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Analyser mon texte" }),
  ).toBeDisabled();
  await page.getByRole("link", { name: "Choisir mes gestes" }).click();
  await expect(
    page.getByRole("heading", { name: "Que veux-tu comparer ?" }),
  ).toBeVisible();
  acceptStatus(consoleErrors);
});

test("points d'entrée depuis /comparer et /jardin", async ({
  page,
}, testInfo) => {
  await prepare(page.context(), testInfo);
  await page.goto("/comparer");
  await page.getByRole("link", { name: /^Raconte ta journée/ }).click();
  await expect(page).toHaveURL(`${BASE}/raconte`);
  // Préchargements terminés (WebKit signale ceux qu'une navigation interrompt).
  await page.waitForLoadState("networkidle");
  await page.goto("/jardin");
  await expect(
    page.getByRole("link", { name: /^Raconte ta journée/ }),
  ).toHaveAttribute("href", "/raconte");
});
