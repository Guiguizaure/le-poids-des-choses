import type { Page } from "@playwright/test";
import {
  entry,
  expect,
  expectNoAxeViolations,
  seedJournal,
  test,
} from "./fixtures";

/** « Raconte ta journée » actif (AI_ENABLED) : le serveur statique répond sinon « coupé ». */
const aiEnabled = (page: Page) =>
  page.route("**/api/raconte", (route) =>
    route.request().method() === "GET"
      ? route.fulfill({ json: { enabled: true } })
      : route.fallback(),
  );

/** Page hydratée : le mois de l'encart de saison n'est connu que côté client. */
const hydrated = (page: Page, name: RegExp) =>
  expect(page.getByRole("heading", { name })).toBeVisible();

test.describe("carte « Plus rapide : raconte ta journée » sur /comparer", () => {
  test("IA active : sous la sélection, après le bouton Comparer, vers /raconte", async ({
    page,
  }) => {
    await aiEnabled(page);
    await page.goto("/comparer");
    const card = page.getByRole("link", {
      name: "Plus rapide : raconte ta journée",
    });
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute("href", "/raconte");
    // Sous la sélection et le bouton « Comparer » : elle ne les déplace pas.
    const compare = page.getByRole("button", { name: "Comparer" });
    const compareBox = (await compare.boundingBox())!;
    const cardBox = (await card.boundingBox())!;
    expect(cardBox.y).toBeGreaterThan(compareBox.y + compareBox.height);
    // Un seul point d'entrée vers « Raconte » sur cet écran.
    await expect(page.locator('a[href="/raconte"]')).toHaveCount(1);
    await expectNoAxeViolations(page);
    await card.click();
    await expect(page).toHaveURL(/\/raconte$/);
  });

  for (const [path, label, barName, first, second] of [
    [
      "/comparer",
      "Plus rapide : raconte ta journée",
      "Ta comparaison",
      /^TGV/,
      /^Avion/,
    ],
    [
      "/en/compare",
      "Quicker: tell us about your day",
      "Your comparison",
      /^TGV/,
      /^Plane/,
    ],
  ] as const) {
    test(`avec la barre « Comparer » (${path}) : la carte reste visible au-dessus de la marge réservée`, async ({
      page,
    }) => {
      await aiEnabled(page);
      await page.goto(path);
      const card = page.getByRole("link", { name: label });
      await expect(card).toBeVisible();
      await page.getByRole("button", { name: first }).click();
      await page.getByRole("button", { name: second }).click();
      const bar = page.getByRole("region", { name: barName });
      await expect(bar).toBeVisible();
      await bar.evaluate((el) =>
        Promise.all(el.getAnimations().map((animation) => animation.finished)),
      );
      // Défilée jusqu'à elle, la carte est entière au-dessus de la barre, et c'est bien elle
      // qu'on touche en son centre (rien ne la recouvre).
      await card.scrollIntoViewIfNeeded();
      const cardBox = (await card.boundingBox())!;
      const barBox = (await bar.boundingBox())!;
      expect(cardBox.y + cardBox.height).toBeLessThanOrEqual(barBox.y);
      const onTop = await card.evaluate((el) => {
        const box = el.getBoundingClientRect();
        const hit = document.elementFromPoint(
          box.left + box.width / 2,
          box.top + box.height / 2,
        );
        return hit !== null && el.contains(hit);
      });
      expect(onTop).toBe(true);
      // Tout en bas de la page aussi : la marge de la barre la laisse au-dessus.
      await page.evaluate(() =>
        window.scrollTo(0, document.documentElement.scrollHeight),
      );
      const bottomBox = (await card.boundingBox())!;
      expect(bottomBox.y + bottomBox.height).toBeLessThanOrEqual(
        (await bar.boundingBox())!.y,
      );
      await expectNoAxeViolations(page);
      await card.click();
      await expect(page).toHaveURL(/\/(raconte|en\/your-day)$/);
    });
  }

  test("IA coupée : pas de carte", async ({ page }) => {
    await page.goto("/comparer");
    await hydrated(page, /^De saison en /);
    await expect(page.locator("[data-raconte-quick]")).toHaveCount(0);
    await expect(page.locator('a[href="/raconte"]')).toHaveCount(0);
  });

  test("en anglais : “Quicker: tell us about your day”", async ({ page }) => {
    await aiEnabled(page);
    await page.goto("/en/compare");
    const card = page.getByRole("link", {
      name: "Quicker: tell us about your day",
    });
    await expect(card).toHaveAttribute("href", "/en/your-day");
    await expectNoAxeViolations(page);
  });

  test("en anglais, IA coupée : pas de carte", async ({ page }) => {
    await page.goto("/en/compare");
    await hydrated(page, /^In season in /);
    await expect(page.locator("[data-raconte-quick]")).toHaveCount(0);
  });
});

test.describe("Mon jardin : accueil en haut à gauche, « Faire pousser une plante » sous le jardin", () => {
  test("nom du site vers l'accueil ; bouton tomate pleine largeur, encre, avant « Mes habitudes »", async ({
    page,
  }) => {
    await seedJournal(page, [entry("raccourci-1", 4.1)]);
    await page.goto("/jardin");
    const home = page.getByRole("link", {
      name: "Le poids des choses – Accueil",
    });
    await expect(home).toHaveAttribute("href", "/");
    await expect(home).toHaveText("Le poids des choses");
    // Plus de lien « Comparer » ni de flèche « Retour » en haut.
    await expect(
      page.getByRole("link", { name: "Comparer", exact: true }),
    ).toHaveCount(0);

    const grow = page.getByRole("link", { name: /^Faire pousser une plante/ });
    await expect(grow).toHaveAttribute("href", "/comparer");
    await expect(grow).toContainText("Compare deux gestes du quotidien");
    await expect(grow).toHaveCSS("background-color", "rgb(255, 79, 46)");
    await expect(grow).toHaveCSS("color", "rgb(31, 26, 23)");
    // Pleine largeur (aux marges près) et juste sous le jardin, avant « Mes habitudes ».
    const viewport = page.viewportSize()!;
    const growBox = (await grow.boundingBox())!;
    expect(growBox.width).toBeGreaterThanOrEqual(viewport.width - 40 - 1);
    const sceneBox = (await page
      .getByRole("img", { name: /^Jardin :/ })
      .boundingBox())!;
    expect(growBox.y).toBeGreaterThanOrEqual(sceneBox.y + sceneBox.height);
    const habits = page.getByRole("heading", { name: "Mes habitudes" });
    const habitsBox = (await habits.boundingBox())!;
    expect(habitsBox.y).toBeGreaterThan(growBox.y + growBox.height);
    await expectNoAxeViolations(page);

    await grow.click();
    await expect(page).toHaveURL(/\/comparer$/);
    await page.goto("/jardin");
    await page
      .getByRole("link", { name: "Le poids des choses – Accueil" })
      .click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("jardin vide : le même bouton, une seule invitation à comparer", async ({
    page,
  }) => {
    await page.goto("/jardin");
    await expect(
      page.getByRole("heading", { name: "Ton jardin t’attend" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /^Faire pousser une plante/ }),
    ).toBeVisible();
    await expect(page.locator('main a[href="/comparer"]')).toHaveCount(1);
    await expectNoAxeViolations(page);
  });

  test("en anglais : “Home”, “Grow a plant”", async ({ page }) => {
    await seedJournal(page, [entry("raccourci-1", 4.1)]);
    await page.goto("/en/garden");
    await expect(
      page.getByRole("link", { name: "Le poids des choses – Home" }),
    ).toHaveAttribute("href", "/en");
    const grow = page.getByRole("link", { name: /^Grow a plant/ });
    await expect(grow).toHaveAttribute("href", "/en/compare");
    await expect(grow).toContainText("Compare two everyday choices");
    await expect(grow).toHaveCSS("color", "rgb(31, 26, 23)");
    await expectNoAxeViolations(page);
  });
});

test.describe("pages de texte et /saison : le nom du site vers l'accueil, plus de « ← Retour »", () => {
  for (const [path, name, href, back] of [
    ["/methode", "Le poids des choses – Accueil", "/", "Retour"],
    ["/mentions-legales", "Le poids des choses – Accueil", "/", "Retour"],
    ["/confidentialite", "Le poids des choses – Accueil", "/", "Retour"],
    ["/saison", "Le poids des choses – Accueil", "/", "Retour"],
    ["/en/method", "Le poids des choses – Home", "/en", "Back"],
    ["/en/legal-notice", "Le poids des choses – Home", "/en", "Back"],
    ["/en/privacy", "Le poids des choses – Home", "/en", "Back"],
    ["/en/in-season", "Le poids des choses – Home", "/en", "Back"],
  ] as const) {
    test(path, async ({ page }) => {
      await page.goto(path);
      const home = page.getByRole("link", { name });
      await expect(home).toHaveAttribute("href", href);
      await expect(home).toHaveText("Le poids des choses");
      await expect(
        page.getByRole("link", { name: back, exact: true }),
      ).toHaveCount(0);
      await expectNoAxeViolations(page);
    });
  }
});
