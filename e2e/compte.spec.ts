// Compte facultatif et synchronisation, sur `wrangler pages dev` (export statique + Pages
// Functions, base D1 locale neuve, HTTPS) avec un faux Resend et un faux Turnstile
// (e2e/fake-services.mjs) : aucun vrai e-mail, aucun service extérieur.
import {
  devices,
  type Browser,
  type BrowserContext,
  type Page,
  type TestInfo,
} from "@playwright/test";
import { readFileSync } from "node:fs";
import {
  acceptCancelledPrefetch,
  acceptStatus,
  entry,
  expect,
  expectNoAxeViolations,
  seedJournal,
  test,
} from "./fixtures";

// Ports de playwright.config.ts.
const PAGES_PORT = 4331;
const FAKE_PORT = 4330;
const BASE = `https://localhost:${PAGES_PORT}`;
const FAKE = `http://127.0.0.1:${FAKE_PORT}`;
// Base locale gardée entre deux lancements (serveur réutilisé) : adresses uniques par lancement.
const RUN = Date.now().toString(36);

test.use({ baseURL: BASE, ignoreHTTPSErrors: true });

// Le serveur local répond plus lentement que l'export statique : des préchargements de Next
// sont encore en cours quand le test change de page.
test.afterEach(({ consoleErrors }) => acceptCancelledPrefetch(consoleErrors));

/** Faux Turnstile : rend un jeton accepté par le faux siteverify, à chaque rendu ou reset. */
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

// IP de test : tirée au hasard par processus, puis une par appareil (le serveur local, réutilisé
// d'un lancement à l'autre, garde ses compteurs par IP).
const IP_BASE = Math.floor(Math.random() * 250);
let ipCounter = 0;

const isWebkit = (testInfo: TestInfo) =>
  testInfo.project.name.includes("webkit");

/** Prépare un appareil : faux Turnstile et IP propre (les limites par IP restent intactes). */
async function prepare(context: BrowserContext, testInfo: TestInfo) {
  await context.route(
    "https://challenges.cloudflare.com/turnstile/v0/api.js*",
    (route) =>
      route.fulfill({
        contentType: "text/javascript",
        body: FAKE_TURNSTILE,
      }),
  );
  ipCounter += 1;
  const project = isWebkit(testInfo) ? 2 : 1;
  await context.setExtraHTTPHeaders({
    "CF-Connecting-IP": `10.${project}.${(IP_BASE + testInfo.workerIndex) % 250}.${ipCounter % 250}`,
  });
}

function emailFor(testInfo: TestInfo, label: string) {
  return `${label}-${testInfo.project.name}-${RUN}-${testInfo.repeatEachIndex}-${testInfo.retry}@exemple.test`;
}

/** Second appareil (même navigateur émulé), avec ses erreurs de console relevées. */
async function secondDevice(browser: Browser, testInfo: TestInfo) {
  const device = isWebkit(testInfo) ? devices["iPhone 14"] : devices["Pixel 7"];
  const context = await browser.newContext({
    ...device,
    baseURL: BASE,
    ignoreHTTPSErrors: true,
    locale: "fr-FR",
  });
  await prepare(context, testInfo);
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return { context, page, errors };
}

/** Demande un lien depuis /jardin et renvoie le lien reçu par le faux Resend. */
async function requestLink(page: Page, email: string): Promise<string> {
  const before = await mailsTo(page, email);
  await page.goto("/jardin");
  // « Retrouve ton jardin » en haut d'un jardin vide, « … sur un autre appareil » sinon.
  const section = page.getByRole("region", { name: /^Retrouve ton jardin/ });
  await section.getByLabel("Ton adresse e-mail").fill(email);
  await section.getByRole("button", { name: "Recevoir un lien" }).click();
  await expect(section.getByText("C’est envoyé !")).toBeVisible();
  await expect(section.getByText(email)).toBeVisible();
  let mails: Mail[] = [];
  await expect
    .poll(async () => (mails = await mailsTo(page, email)).length)
    .toBe(before.length + 1);
  const mail = mails.at(-1)!;
  expect(mail.subject).toBe("Ton lien pour retrouver ton jardin");
  expect(mail.from).toBe(
    "Le poids des choses <connexion@lepoidsdeschoses.com>",
  );
  const link = mail.text.match(
    new RegExp(`${BASE}/connexion#jeton=[A-Za-z0-9_-]{43}`),
  )?.[0];
  expect(link, "lien dans le mail").toBeTruthy();
  return link!;
}

type Mail = { from: string; to: string[]; subject: string; text: string };

async function mailsTo(page: Page, email: string): Promise<Mail[]> {
  const response = await page.request.get(
    `${FAKE}/emails?to=${encodeURIComponent(email)}`,
  );
  return response.json();
}

async function signIn(page: Page, email: string) {
  const link = await requestLink(page, email);
  await page.goto(link);
  await expect(
    page.getByRole("heading", { level: 1, name: "Ton jardin est relié" }),
  ).toBeVisible();
  await expect(page.getByText(/^Synchronisation terminée/)).toBeVisible();
  // Le jeton a quitté la barre d'adresse.
  expect(page.url()).toBe(`${BASE}/connexion`);
  return link;
}

const accountSection = (page: Page) =>
  page.getByRole("region", { name: /^Retrouve ton jardin/ });

async function apiSession(page: Page) {
  return page.evaluate(async () => (await fetch("/api/auth/session")).json());
}

test("parcours complet : lien, connexion, synchro entre deux appareils, export, suppression", async ({
  page,
  browser,
  consoleErrors,
}, testInfo) => {
  test.setTimeout(120_000);
  const email = emailFor(testInfo, "parcours");
  await prepare(page.context(), testInfo);
  await seedJournal(page, [entry("tel-1", 12, 60), entry("tel-2", 0, 50)]);

  // Appareil 1 : connexion, son carnet part vers le compte.
  await signIn(page, email);
  await expect(
    page.getByText("Synchronisation terminée : ton carnet est à jour."),
  ).toBeVisible();
  await page.getByRole("link", { name: "Voir mon jardin" }).click();
  const section = accountSection(page);
  await expect(section.getByText(`Connecté avec ${email}`)).toBeVisible();
  await expect(
    section.getByText(/^Dernière synchro : aujourd’hui à/),
  ).toBeVisible();

  // Appareil 2 : son propre carnet, même adresse : les deux carnets se rejoignent.
  const other = await secondDevice(browser, testInfo);
  await seedJournal(other.page, [entry("ordi-1", 30, 40)]);
  await signIn(other.page, email);
  await expect(
    other.page.getByText("Synchronisation terminée : 2 choix retrouvés."),
  ).toBeVisible();
  await other.page.getByRole("link", { name: "Voir mon jardin" }).click();
  await expect(other.page.getByText("3 choix notés")).toBeVisible();

  // Appareil 1 : nouveau choix, envoyé tout de suite ; l'appareil 2 le retrouve.
  await page.goto("/comparer?a=tgv&b=avion&q=300");
  await page.getByRole("button", { name: "Je choisis le TGV" }).click();
  await expect(
    page.getByRole("heading", { name: /va pousser dans ton jardin/ }),
  ).toBeVisible();
  await page.goto("/jardin");
  await expect(page.getByText("4 choix notés")).toBeVisible();
  await expect(async () => {
    await other.page.reload();
    await expect(other.page.getByText("4 choix notés")).toBeVisible({
      timeout: 2_000,
    });
  }).toPass({ timeout: 20_000 });

  // Export des données du compte : même format que l'export local.
  const otherSection = accountSection(other.page);
  const [download] = await Promise.all([
    other.page.waitForEvent("download"),
    otherSection.getByRole("button", { name: "Exporter mes données" }).click(),
  ]);
  expect(download.suggestedFilename()).toMatch(
    /^le-poids-des-choses-compte-\d{4}-\d{2}-\d{2}\.json$/,
  );
  const exported = JSON.parse(readFileSync((await download.path())!, "utf8"));
  expect(exported).toMatchObject({
    app: "le-poids-des-choses",
    version: 1,
    account: { email },
  });
  expect(exported.entries.map((e: { id: string }) => e.id)).toEqual(
    expect.arrayContaining(["tel-1", "tel-2", "ordi-1"]),
  );
  expect(exported.entries).toHaveLength(4);

  // Suppression : confirmation explicite, effet immédiat, le carnet local reste.
  await otherSection
    .getByRole("button", { name: "Supprimer mon compte" })
    .click();
  const confirm = otherSection.getByRole("group", {
    name: "Supprimer ton compte ?",
  });
  await expect(confirm).toBeVisible();
  await confirm
    .getByRole("button", { name: "Oui, supprimer mon compte" })
    .click();
  await expect(
    otherSection.getByText(/^Ton compte est supprimé/),
  ).toBeVisible();
  await expect(
    otherSection.getByRole("button", { name: "Recevoir un lien" }),
  ).toBeVisible();
  await expect(other.page.getByText("4 choix notés")).toBeVisible();
  expect(await apiSession(other.page)).toEqual({ signedIn: false });

  // Appareil 1 : sa session a disparu avec le compte ; son carnet reste.
  await page.reload();
  await expect(section.getByText(/^Ta session a pris fin/)).toBeVisible();
  await expect(
    section.getByRole("button", { name: "Recevoir un lien" }),
  ).toBeVisible();
  await expect(page.getByText("4 choix notés")).toBeVisible();
  acceptStatus(consoleErrors, 401);

  acceptCancelledPrefetch(other.errors);
  expect(other.errors).toEqual([]);
  await other.context.close();
});

test("lien à usage unique ; /connexion sans jeton", async ({
  page,
  consoleErrors,
}, testInfo) => {
  await prepare(page.context(), testInfo);
  const link = await signIn(page, emailFor(testInfo, "unique"));
  // Rouvert plus tard depuis le mail (nouveau chargement de page).
  await page.goto("/");
  await page.goto(link);
  await expect(
    page.getByRole("heading", { level: 1, name: "Ce lien ne marche plus" }),
  ).toBeVisible();
  await expect(
    page.getByText(/valable 15 minutes et ne sert qu’une fois/),
  ).toBeVisible();
  acceptStatus(consoleErrors, 400);

  // Lien usé : on peut en demander un autre sur place.
  await expect(
    page
      .getByRole("region", { name: "Recevoir un lien de connexion" })
      .getByLabel("Ton adresse e-mail"),
  ).toBeVisible();

  // Sans jeton, déjà connecté sur cet appareil : on le dit, et on mène au jardin.
  await page.goto("/connexion");
  await expect(
    page.getByRole("heading", { level: 1, name: "Retrouve ton jardin" }),
  ).toBeVisible();
  await expect(page.getByText(/^Tu es déjà connecté avec/)).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Voir mon jardin" }),
  ).toBeVisible();
});

test("retrouver son jardin depuis l'accueil, sur un appareil vide", async ({
  page,
  browser,
}, testInfo) => {
  test.setTimeout(120_000);
  const email = emailFor(testInfo, "retrouver");
  // Téléphone : un jardin déjà commencé, relié au compte.
  await prepare(page.context(), testInfo);
  await seedJournal(page, [entry("tel-a", 12, 60), entry("tel-b", 3, 50)]);
  await signIn(page, email);

  // Ordinateur, carnet vide : jardin ouvert dans un premier onglet.
  const other = await secondDevice(browser, testInfo);
  const turnstileCalls: string[] = [];
  other.context.on("request", (request) => {
    if (request.url().startsWith("https://challenges.cloudflare.com/"))
      turnstileCalls.push(request.url());
  });
  const garden = other.page;
  await garden.goto("/jardin");
  const form = accountSection(garden);
  await expect(
    garden.getByRole("region", { name: "Retrouve ton jardin" }),
  ).toBeVisible();
  // Le formulaire passe avant l'invitation à comparer.
  const formTop = (await form.boundingBox())!.y;
  const inviteTop = (await garden
    .getByRole("heading", { name: "Ton jardin t’attend" })
    .boundingBox())!.y;
  expect(formTop).toBeLessThan(inviteTop);

  // Second onglet : depuis l'accueil, sans faire de choix.
  const tab = await other.context.newPage();
  tab.on("console", (message) => {
    if (message.type() === "error") other.errors.push(message.text());
  });
  await tab.goto("/");
  await tab
    .getByRole("link", { name: "J’ai déjà un jardin ? Le retrouver" })
    .click();
  // Serveur local lent sous charge : la page peut mettre plus de 5 s à s'ouvrir.
  await expect(tab).toHaveURL(/\/connexion$/, { timeout: 15_000 });
  await expect(
    tab.getByRole("heading", { level: 1, name: "Retrouve ton jardin" }),
  ).toBeVisible({ timeout: 15_000 });
  // Turnstile n'est chargé qu'à l'ouverture du formulaire.
  expect(turnstileCalls).toEqual([]);
  const box = tab.getByRole("region", {
    name: "Recevoir un lien de connexion",
  });
  await box.getByLabel("Ton adresse e-mail").fill(email);
  await expect.poll(() => turnstileCalls.length).toBeGreaterThan(0);
  const before = (await mailsTo(tab, email)).length;
  await box.getByRole("button", { name: "Recevoir un lien" }).click();
  await expect(box.getByText("C’est envoyé !")).toBeVisible();
  let mails: Mail[] = [];
  await expect
    .poll(async () => (mails = await mailsTo(tab, email)).length)
    .toBe(before + 1);
  const link = mails
    .at(-1)!
    .text.match(new RegExp(`${BASE}/connexion#jeton=[A-Za-z0-9_-]{43}`))![0];
  await tab.goto(link);
  await expect(
    tab.getByText("Synchronisation terminée : 2 choix retrouvés."),
  ).toBeVisible();

  // Premier onglet : le jardin se remplit, sobrement (un seul message, aucune fenêtre).
  await expect(
    garden.getByText("Ton jardin est de retour : 2 choix retrouvés."),
  ).toBeVisible();
  await expect(garden.getByText("2 choix notés")).toBeVisible();
  await expect(garden.locator("[data-plant]")).toHaveCount(2);
  await expect(garden.getByRole("dialog")).toHaveCount(0);

  // En-tête : l'adresse remplace « Se connecter » et mène à la section compte.
  await tab.goto("/");
  const header = tab.getByRole("link", { name: email });
  await expect(header).toBeVisible();
  await header.click();
  await expect(tab).toHaveURL(/\/jardin#compte$/);
  await expect(
    accountSection(tab).getByText(`Connecté avec ${email}`),
  ).toBeVisible();
  await expect(accountSection(tab)).toBeInViewport();

  acceptCancelledPrefetch(other.errors);
  expect(other.errors).toEqual([]);
  await other.context.close();
});

test("déconnexion : la session prend fin, le jardin reste", async ({
  page,
}, testInfo) => {
  await prepare(page.context(), testInfo);
  await seedJournal(page, [entry("deco-1", 3)]);
  await signIn(page, emailFor(testInfo, "deco"));
  await page.goto("/jardin");
  const section = accountSection(page);
  await section.getByRole("button", { name: "Me déconnecter" }).click();
  await expect(section.getByText(/^Déconnexion faite/)).toBeVisible();
  await expect(
    section.getByRole("button", { name: "Recevoir un lien" }),
  ).toBeVisible();
  expect(await apiSession(page)).toEqual({ signedIn: false });
  await expect(page.getByText("1 choix noté")).toBeVisible();
});

test("hors ligne : le choix attend, puis part au retour du réseau", async ({
  page,
  consoleErrors,
}, testInfo) => {
  await prepare(page.context(), testInfo);
  await signIn(page, emailFor(testInfo, "horsligne"));
  await page.goto("/comparer?a=tgv&b=avion&q=300");
  // Panne réseau vers le compte (le reste du site, déjà chargé, reste disponible).
  await page.route("**/api/journal/sync", (route) =>
    route.abort("internetdisconnected"),
  );
  await page.getByRole("button", { name: "Je choisis le TGV" }).click();
  await expect(
    page.getByRole("heading", { name: /va pousser dans ton jardin/ }),
  ).toBeVisible();
  const pending = () =>
    page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("lpdc:compte:v1") ?? "{}").pending
          ?.length ?? -1,
    );
  await expect.poll(pending).toBe(1);

  // Retour du réseau : la file repart d'elle-même.
  await page.unroute("**/api/journal/sync");
  await page.evaluate(() => window.dispatchEvent(new Event("online")));
  await expect.poll(pending, { timeout: 15_000 }).toBe(0);
  const exported = await page.evaluate(async () =>
    (await fetch("/api/account/export")).json(),
  );
  expect(exported.entries).toHaveLength(1);
  // Requête coupée pendant la panne : le navigateur l'écrit en console (sans statut HTTP).
  const others = consoleErrors.filter(
    (message) =>
      !(
        message.startsWith("Failed to load resource") &&
        !/status of/.test(message)
      ),
  );
  consoleErrors.splice(0, consoleErrors.length, ...others);
});

test("limite de demandes : message doux après 3 liens en 15 minutes", async ({
  page,
  consoleErrors,
}, testInfo) => {
  // Fenêtres fixes de 15 minutes : les 4 demandes doivent tomber dans la même.
  test.setTimeout(150_000);
  const window15 = 15 * 60 * 1000;
  const untilNext = window15 - (Date.now() % window15);
  if (untilNext < 60_000) await page.waitForTimeout(untilNext + 1_000);
  await prepare(page.context(), testInfo);
  const email = emailFor(testInfo, "limite");
  for (let i = 0; i < 3; i += 1) await requestLink(page, email);
  await page.goto("/jardin");
  const section = accountSection(page);
  await section.getByLabel("Ton adresse e-mail").fill(email);
  await section.getByRole("button", { name: "Recevoir un lien" }).click();
  await expect(
    section.getByText(
      "Beaucoup de demandes d’un coup : réessaie dans quelques minutes.",
    ),
  ).toBeVisible();
  expect(await mailsTo(page, email)).toHaveLength(3);
  acceptStatus(consoleErrors, 429);
});

test("axe : formulaire, lien envoyé, connecté, confirmation de suppression, connexion", async ({
  page,
}, testInfo) => {
  await prepare(page.context(), testInfo);
  await seedJournal(page, [entry("axe-1", 4)]);
  await page.goto("/jardin");
  const section = accountSection(page);
  await expect(section.getByLabel("Ton adresse e-mail")).toBeVisible();
  await expectNoAxeViolations(page);

  const email = emailFor(testInfo, "axe");
  await section.getByLabel("Ton adresse e-mail").fill(email);
  await section.getByRole("button", { name: "Recevoir un lien" }).click();
  await expect(section.getByText("C’est envoyé !")).toBeVisible();
  // Le focus suit le message (le formulaire a disparu).
  await expect(section.getByText("C’est envoyé !")).toBeFocused();
  await expectNoAxeViolations(page);

  let mails: Mail[] = [];
  await expect
    .poll(async () => (mails = await mailsTo(page, email)).length)
    .toBe(1);
  const link = mails[0].text.match(/https:\/\/\S+\/connexion#jeton=\S+/)![0];
  await page.goto(link);
  await expect(
    page.getByRole("link", { name: "Voir mon jardin" }),
  ).toBeVisible();
  await expectNoAxeViolations(page);

  await page.goto("/jardin");
  await expect(section.getByText(`Connecté avec ${email}`)).toBeVisible();
  await section.getByRole("button", { name: "Supprimer mon compte" }).click();
  await expect(section.getByText("Supprimer ton compte ?")).toBeFocused();
  await expectNoAxeViolations(page);
  await section.getByRole("button", { name: "Annuler" }).click();
  await expect(
    section.getByRole("button", { name: "Supprimer mon compte" }),
  ).toBeFocused();
});

test("l'API refuse une origine étrangère et pose ses en-têtes", async ({
  page,
}) => {
  const response = await page.request.post("/api/auth/link", {
    headers: { Origin: "https://evil.com", "Content-Type": "application/json" },
    data: { email: "a@exemple.test", turnstileToken: "jeton-e2e" },
  });
  expect(response.status()).toBe(403);
  expect(response.headers()["cache-control"]).toBe("no-store");
  const page404 = await page.request.get("/confidentialite");
  expect(page404.headers()["content-security-policy"]).toContain(
    "frame-src https://challenges.cloudflare.com",
  );
});
