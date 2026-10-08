// Version anglaise (/en) : parcours principaux, sélecteur de langue, bandeau, données partagées,
// accessibilité (axe) et absence de texte français sur les pages anglaises.
import type { Page } from "@playwright/test";
import {
  acceptCancelledPrefetch,
  acceptDocument404,
  entry,
  expect,
  expectNoAxeViolations,
  seedJournal,
  test,
  letGardenChoose,
} from "./fixtures";

test.use({ locale: "en-GB" });

// Changer de langue recharge la page : WebKit écrit en console les préchargements de Next
// interrompus (« … due to access control checks. ») ; seules ces lignes sont tolérées.
test.afterEach(({ consoleErrors }) => acceptCancelledPrefetch(consoleErrors));

/**
 * Mots français qui trahiraient un texte oublié. Sont retirés avant la recherche : le nom du
 * site, le sélecteur « Français », le crédit imposé, l'adresse et le statut de l'éditeur, et
 * « Plus Five Five, Inc. » (la société de Resend).
 */
const ALLOWED = [
  // Le nom du site, aussi coupé sur deux lignes (en-tête de Mon jardin sur téléphone).
  "Le poids\ndes choses",
  "Le poids des choses",
  "Le poids",
  "Données : Impact CO2 – ADEME",
  "Français",
  "entrepreneur individuel",
  "impasse d’azur",
  "Six-Fours-Les-Plages",
  "Plus Five Five",
];
const FRENCH =
  /\b(le|la|les|du|des|ton|tes|ta|avec|pour|plus|que|jardin|carnet|écart|geste|gestes|choix|retour|comparer)\b/i;

async function expectNoFrench(page: Page) {
  const text = await page.locator("body").innerText();
  const cleaned = ALLOWED.reduce(
    (value, allowed) => value.split(allowed).join(" "),
    text,
  );
  const line = cleaned.split("\n").find((row) => FRENCH.test(row));
  expect(line, "texte français sur une page anglaise").toBeUndefined();
}

const PAGES = [
  { path: "/en", heading: "Le poids des choses" },
  { path: "/en/compare", heading: "What would you like to compare?" },
  {
    path: "/en/compare?a=tgv&b=avion&q=300",
    heading: "Which one weighs less?",
  },
  {
    path: "/en/compare?objet=jean",
    heading: "New, second-hand, or keep yours?",
  },
  { path: "/en/compare?habitude=", heading: "Log a habit" },
  { path: "/en/garden", heading: "My garden" },
  { path: "/en/garden/journal", heading: "Journal" },
  { path: "/en/in-season?mois=10", heading: "In season in October" },
  { path: "/en/method", heading: "Method and sources" },
  { path: "/en/legal-notice", heading: "Legal notice" },
  { path: "/en/privacy", heading: "Privacy" },
  { path: "/en/sign-in", heading: "Find your garden" },
  { path: "/en/your-day", heading: "Tell us about your day" },
];

test.describe("pages anglaises : axe et aucun texte français", () => {
  for (const { path, heading } of PAGES) {
    test(path, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await expect(
        page.getByRole("heading", { level: 1, name: heading }),
      ).toBeVisible();
      await expectNoFrench(page);
      await expectNoAxeViolations(page);
    });
  }

  test("jardin avec un carnet (partagé avec le français)", async ({ page }) => {
    await seedJournal(page, [
      entry("a", 66.5, 30),
      entry("b", 4.1, 20),
      entry("c", 0, 10),
    ]);
    await page.goto("/en/garden");
    await expect(page.getByRole("heading", { name: "Journal" })).toBeVisible();
    await expect(page.getByText("3 choices noted")).toBeVisible();
    await expect(
      page.getByText(
        "of CO2e difference from the other options, since your first choice",
      ),
    ).toBeVisible();
    await expectNoFrench(page);
    await expectNoAxeViolations(page);

    // Même carnet, même jardin, en français.
    await page.getByRole("link", { name: "Français" }).first().click();
    await expect(page).toHaveURL(/\/jardin$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.getByText("3 choix notés")).toBeVisible();
  });

  test("page inconnue sous /en : la 404 anglaise", async ({
    page,
    consoleErrors,
  }) => {
    const response = await page.goto("/en/nowhere");
    expect(response?.status()).toBe(404);
    acceptDocument404(consoleErrors);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(
      page.getByRole("heading", { name: "This page got lost in the mist" }),
    ).toBeVisible();
    await expectNoAxeViolations(page);
  });
});

test("comparaison complète en anglais, jusqu'au jardin", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByText("The weight of things")).toBeVisible();
  await page.getByRole("link", { name: "Start comparing" }).first().click();
  await expect(page).toHaveURL(/\/en\/compare$/);
  await page.getByRole("button", { name: /^TGV/ }).click();
  await page.getByRole("button", { name: /^Plane/ }).click();
  await page.getByRole("main").getByRole("button", { name: "Compare" }).click();
  await expect(page).toHaveURL(/\/en\/compare\?a=tgv&b=avion&q=/);

  await expect(
    page.getByRole("heading", { name: "Which one weighs less?" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      /On this journey, the TGV is \d+ times lighter than the plane, which is [\d.]+ kg CO2e less\./,
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Impact CO2 – ADEME" }),
  ).toBeVisible();
  await expect(page.getByText(/^Data:/)).toBeVisible();
  await page.getByRole("button", { name: "I’ll go for the TGV" }).click();
  await letGardenChoose(page);

  await expect(
    page.getByRole("heading", {
      name: /A (tree|flower) is going to grow in your garden/,
    }),
  ).toBeFocused();
  await expect(page.getByText(/^[\d.]+ kg difference$/)).toBeVisible();
  await expect(page.getByText("And here comes a butterfly!")).toBeVisible();
  await page.getByRole("link", { name: "Go and plant it" }).click();

  await expect(page).toHaveURL(/\/en\/garden\?nouveau=/);
  await expect(
    page.getByRole("img", { name: /^Garden: 1 plant, 1 animal/ }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "A butterfly has moved into your garden" }),
  ).toBeAttached();
  await expect(page).toHaveURL(/\/en\/garden$/, { timeout: 8000 });
  await expect(page.getByText("TGV rather than plane")).toBeVisible();
  await expect(page.getByText("1 choice noted")).toBeVisible();
});

test("objet d'occasion et habitude tenue, en anglais", async ({ page }) => {
  await page.goto("/en/compare?objet=jean");
  await page.getByText("Second-hand", { exact: true }).click();
  await expect(
    page.getByText(/^Second-hand(, delivered)? rather than new: /),
  ).toBeVisible();
  await page.getByRole("button", { name: "I’ll go for second-hand" }).click();
  await letGardenChoose(page);
  await expect(
    page.getByText(
      /^Second-hand jeans(, delivered,)? rather than new: noted in your journal\.$/,
    ),
  ).toBeVisible();

  await page.goto("/en/compare?habitude=");
  await page.getByRole("button", { name: /^By bike/ }).click();
  await page.getByRole("button", { name: "I did it today" }).click();
  await expect(page.getByText("Habit kept")).toBeVisible();
  await expect(
    page.getByText("By bike: noted in your journal, with no kg."),
  ).toBeVisible();
  await page.getByRole("link", { name: "See my garden" }).click();
  await expect(page).toHaveURL(/\/en\/garden\?arrose=/);
});

test("le sélecteur de langue garde la page, les paramètres et l'ancre", async ({
  page,
}) => {
  await page.goto("/en/compare?a=tgv&b=avion&q=120");
  await expect(
    page.getByRole("heading", { name: "Which one weighs less?" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Français" }).click();
  await expect(page).toHaveURL(/\/comparer\?a=tgv&b=avion&q=120$/);
  await expect(
    page.getByRole("heading", { name: "Lequel pèse le moins ?" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/compare\?a=tgv&b=avion&q=120$/);

  await page.goto("/methode#habitudes");
  await page.getByRole("link", { name: "English" }).first().click();
  await expect(page).toHaveURL(/\/en\/method#habitudes$/);
  await expect(
    page.getByRole("heading", { name: "Comparing or keeping up a habit" }),
  ).toBeVisible();
});

test("hreflang, canonical et image de partage par langue", async ({ page }) => {
  await page.goto("/en/garden");
  const head = page.locator("head");
  await expect(head.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/en\/garden$/,
  );
  await expect(head.locator('link[hreflang="fr"]')).toHaveAttribute(
    "href",
    /\/jardin$/,
  );
  await expect(head.locator('link[hreflang="en"]')).toHaveAttribute(
    "href",
    /\/en\/garden$/,
  );
  await expect(head.locator('link[hreflang="x-default"]')).toHaveAttribute(
    "href",
    /\/jardin$/,
  );
  await expect(head.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /\/partage-1200x630\.png$/,
  );
  await expect(head.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    "content",
    /^Le poids des choses: a horizon that tilts like the scales/,
  );
  await expect(head.locator('meta[name="twitter:image:alt"]')).toHaveAttribute(
    "content",
    /^Le poids des choses: a horizon/,
  );
  await expect(head.locator('meta[property="og:locale"]')).toHaveAttribute(
    "content",
    "en_GB",
  );
  await page.goto("/jardin");
  await expect(head.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /\/partage-1200x630\.png$/,
  );
  await expect(head.locator('meta[property="og:image:alt"]')).toHaveAttribute(
    "content",
    /^Le poids des choses : un horizon qui penche comme une balance/,
  );
});

test("pages de texte : mêmes ancres en français et en anglais", async ({
  page,
}) => {
  const ids = async (path: string) => {
    await page.goto(path);
    return page
      .locator("main [id]")
      .evaluateAll((nodes) => nodes.map((node) => node.id).sort());
  };
  for (const [fr, en] of [
    ["/methode", "/en/method"],
    ["/confidentialite", "/en/privacy"],
    ["/mentions-legales", "/en/legal-notice"],
  ]) {
    expect(await ids(en), en).toEqual(await ids(fr));
  }
  await page.goto("/en/legal-notice");
  await expect(
    page.getByText(
      /The French version of the legal notice is the authoritative one\./,
    ),
  ).toBeVisible();
});

test.describe("bandeau de langue sur les pages françaises", () => {
  test("navigateur en anglais : proposé une fois, mémorisé", async ({
    page,
  }) => {
    await page.goto("/saison?mois=5");
    const banner = page.locator("[data-language-banner]");
    await expect(banner).toBeVisible();
    await expect(banner).toHaveAttribute("lang", "en");
    await expectNoAxeViolations(page);
    await banner.getByRole("link", { name: "Read in English" }).click();
    await expect(page).toHaveURL(/\/en\/in-season\?mois=5$/);
    await expect(
      page.getByRole("heading", { name: "In season in May" }),
    ).toBeVisible();
    // Retour en français : le bandeau ne revient pas, et aucune redirection n'a lieu.
    await page.goto("/saison?mois=5");
    await expect(
      page.getByRole("heading", { name: "De saison en mai" }),
    ).toBeVisible();
    await expect(page.locator("[data-language-banner]")).toHaveCount(0);
  });

  test("fermé : il ne revient pas", async ({ page }) => {
    await page.goto("/");
    await page
      .locator("[data-language-banner]")
      .getByRole("button", { name: "Close" })
      .click();
    await expect(page.locator("[data-language-banner]")).toHaveCount(0);
    await page.reload();
    await expect(
      page.getByRole("heading", { level: 1, name: "Le poids des choses" }),
    ).toBeVisible();
    await expect(page.locator("[data-language-banner]")).toHaveCount(0);
  });
});

test.describe("navigateur en français", () => {
  test.use({ locale: "fr-FR" });
  test("pas de bandeau, pas de redirection", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Le poids des choses" }),
    ).toBeVisible();
    await expect(page.locator("[data-language-banner]")).toHaveCount(0);
  });
});
