import type { Page } from "@playwright/test";
import { expect, expectNoAxeViolations, test } from "./fixtures";

// Délai maximal des appels au serveur (src/lib/net/deadline.ts) : une requête qui ne répond
// jamais, l'horloge de Playwright avancée jusqu'au délai, puis le bouton revenu et le message
// annoncé (région d'état toujours présente). Serveur statique : les routes de l'API sont simulées.

/** Faux Turnstile : un jeton tout de suite, à chaque rendu ou reset. */
const FAKE_TURNSTILE = `
  (() => {
    const widgets = {};
    let next = 0;
    const issue = (id) => setTimeout(() => widgets[id] && widgets[id].callback("jeton-e2e"), 30);
    window.turnstile = {
      render(element, options) { const id = "w" + ++next; widgets[id] = options; issue(id); return id; },
      reset(id) { issue(id); },
      remove(id) { delete widgets[id]; },
    };
  })();
`;

/** Horloge pilotable, faux Turnstile, et `path` qui ne répond jamais (POST). */
async function prepare(page: Page, path: string) {
  await page.clock.install();
  await page.route(
    "https://challenges.cloudflare.com/turnstile/v0/api.js*",
    (route) =>
      route.fulfill({ contentType: "text/javascript", body: FAKE_TURNSTILE }),
  );
  let hanging = 0;
  await page.route(`**${path}`, (route) => {
    if (route.request().method() !== "POST") return route.fallback();
    // Jamais de réponse : seul le délai du navigateur peut y mettre fin.
    hanging += 1;
  });
  return () => hanging;
}

for (const { path, region, label, send, sending, message } of [
  {
    path: "/jardin",
    region: /^Retrouve ton jardin/,
    label: "Ton adresse e-mail",
    send: "Recevoir un lien",
    sending: "Envoi…",
    message:
      "Le serveur met trop de temps à répondre, réessaie dans un instant.",
  },
  {
    path: "/en/garden",
    region: /^Find your garden/,
    label: "Your email address",
    send: "Send me a link",
    sending: "Sending…",
    message:
      "The server is taking too long to respond, please try again in a moment.",
  },
]) {
  test(`${path} : lien de connexion sans réponse, bouton rendu et message annoncé au bout de 15 s`, async ({
    page,
  }) => {
    const requests = await prepare(page, "/api/auth/link");
    await page.goto(path);
    const section = page.getByRole("region", { name: region });
    await section.getByLabel(label).fill("delai@exemple.test");
    await section.getByRole("button", { name: send }).click();
    const busy = section.getByRole("button", { name: sending });
    await expect(busy).toBeDisabled();
    expect(requests()).toBe(1);

    // Juste avant le délai : toujours en attente.
    await page.clock.fastForward(14_000);
    await expect(busy).toBeDisabled();
    await page.clock.fastForward(1_000);

    await expect(section.getByRole("button", { name: send })).toBeEnabled();
    // Région d'état présente avant l'erreur : le message est annoncé, le focus ne bouge pas.
    await expect(
      section.getByRole("status").filter({ hasText: message }),
    ).toHaveAttribute("aria-live", "polite");
    await expect(section.getByLabel(label)).toHaveValue("delai@exemple.test");
    await expectNoAxeViolations(page);
  });
}

/** « Raconte ta journée » actif : le serveur statique répond sinon « coupé ». */
const aiEnabled = (page: Page) =>
  page.route("**/api/raconte", (route) =>
    route.request().method() === "GET"
      ? route.fulfill({ json: { enabled: true } })
      : route.fallback(),
  );

for (const { path, label, analyse, reading, message } of [
  {
    path: "/raconte",
    label: "Ta journée, en quelques phrases",
    analyse: "Analyser mon texte",
    reading: "Claude lit ta journée…",
    message:
      "Le serveur met trop de temps à répondre, réessaie dans un instant, ou choisis tes gestes toi-même.",
  },
  {
    path: "/en/your-day",
    label: "Your day, in a few sentences",
    analyse: "Read my day",
    reading: "Claude is reading your day…",
    message:
      "The server is taking too long to respond, please try again in a moment, or choose your actions yourself.",
  },
]) {
  test(`${path} : analyse sans réponse, bouton rendu et message annoncé au bout de 20 s`, async ({
    page,
  }) => {
    const requests = await prepare(page, "/api/raconte");
    await aiEnabled(page);
    await page.goto(path);
    const text = "J’ai pris le vélo pour aller au travail.";
    const field = page.getByLabel(label);
    await expect(async () => {
      await field.fill(text);
      await expect(page.getByText(`${text.length} / 280`)).toBeVisible({
        timeout: 1000,
      });
    }).toPass();
    await page.getByRole("button", { name: analyse }).click();
    const busy = page.getByRole("button", { name: reading });
    await expect(busy).toBeDisabled();
    await expect.poll(requests).toBe(1);

    // Le serveur attend Claude jusqu'à 15 s : toujours en attente à 15 s.
    await page.clock.fastForward(15_000);
    await expect(busy).toBeDisabled();
    await page.clock.fastForward(5_000);

    await expect(page.getByRole("button", { name: analyse })).toBeEnabled();
    await expect(
      page.getByRole("paragraph").filter({ hasText: message }),
    ).toBeVisible();
    // Annoncé par la région d'état du formulaire, toujours présente.
    await expect(
      page.getByRole("status").filter({ hasText: message }),
    ).toHaveAttribute("aria-live", "polite");
    await expect(field).toHaveValue(text);
    await expectNoAxeViolations(page);
  });
}
