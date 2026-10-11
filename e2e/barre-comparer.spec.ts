import { expect, expectNoAxeViolations, tabTo, test } from "./fixtures";
import type { Page } from "@playwright/test";

/** Marge réservée en bas de page (px). */
const bodyPadding = (page: Page) =>
  page.evaluate(() =>
    parseFloat(getComputedStyle(document.body).paddingBottom),
  );

/** Attend la fin des animations et transitions d'un élément (mesures stables). */
const settled = (locator: import("@playwright/test").Locator) =>
  locator.evaluate((el) =>
    Promise.all(el.getAnimations().map((animation) => animation.finished)),
  );

/** Le focus n'est jamais pris par la barre. */
const focusInBar = (page: Page) =>
  page.evaluate(
    () =>
      document.activeElement?.closest('[data-sticky-bar="compare"]') !== null,
  );

test("deux gestes choisis : barre fixe « Voiture thermique vs Vélo », annoncée sans prendre le focus", async ({
  page,
}) => {
  await page.goto("/comparer");
  const bar = page.getByRole("region", { name: "Ta comparaison" });
  await page.getByRole("button", { name: /^Voiture thermique/ }).click();
  await expect(bar).toHaveCount(0);

  await page.getByRole("button", { name: /^Vélo/ }).click();
  await expect(bar).toBeVisible();
  await expect(bar).toHaveCSS("position", "fixed");
  await expect(bar).toContainText("Voiture thermique vs Vélo");
  // Région polite, présente avant la barre : son contenu s'annonce.
  await expect(
    page.locator('[aria-live="polite"]').filter({ has: bar }),
  ).toHaveCount(1);
  await expect(bar).toContainText(
    "Voiture thermique et Vélo choisis : tu peux comparer.",
  );
  expect(await focusInBar(page)).toBe(false);
  // Collée en bas de l'écran, une fois montée.
  const viewport = page.viewportSize()!;
  await expect
    .poll(async () => {
      const box = (await bar.boundingBox())!;
      return Math.round(box.y + box.height);
    })
    .toBe(viewport.height);
  // Le bouton de la page reste en place.
  await expect(
    page.getByRole("main").getByRole("button", { name: "Comparer" }),
  ).toBeEnabled();
  await expectNoAxeViolations(page);

  await bar.getByRole("button", { name: "Comparer" }).click();
  await expect(page).toHaveURL(/\/comparer\?a=voiture&b=velo&q=/);
  await expect(
    page.getByRole("heading", { name: "Lequel pèse le moins ?" }),
  ).toBeVisible();
  await expect(bar).toHaveCount(0);
  // Plus de marge réservée une fois la barre partie.
  expect(await bodyPadding(page)).toBe(0);
});

test("désélectionner un geste retire la barre ; changer de choix la met à jour", async ({
  page,
}) => {
  await page.goto("/comparer");
  const bar = page.getByRole("region", { name: "Ta comparaison" });
  await page.getByRole("button", { name: /^TGV/ }).click();
  await page.getByRole("button", { name: /^Avion/ }).click();
  await expect(bar).toContainText("TGV vs Avion");

  await page.getByRole("button", { name: /^Avion/ }).click();
  await expect(bar).toHaveCount(0);
  expect(await bodyPadding(page)).toBe(0);

  await page.getByRole("button", { name: /^Vélo/ }).click();
  await expect(bar).toContainText("TGV vs Vélo");
  await bar.getByRole("button", { name: "Comparer" }).click();
  await expect(page).toHaveURL(/\/comparer\?a=tgv&b=velo&q=/);
});

test("la barre ne masque rien : marge en bas de la page, pied de page au-dessus d'elle", async ({
  page,
}) => {
  await page.goto("/comparer");
  await page.getByRole("button", { name: /^TGV/ }).click();
  await page.getByRole("button", { name: /^Avion/ }).click();
  const bar = page.getByRole("region", { name: "Ta comparaison" });
  await expect(bar).toBeVisible();
  // Mesures une fois la barre montée.
  await settled(bar);
  const barHeight = (await bar.boundingBox())!.height;
  expect(await bodyPadding(page)).toBeGreaterThanOrEqual(Math.floor(barHeight));

  // Tout en bas : le dernier lien du pied de page reste au-dessus de la barre.
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  const lastLink = page.getByRole("contentinfo").getByRole("link").last();
  const linkBox = (await lastLink.boundingBox())!;
  const barBox = (await bar.boundingBox())!;
  expect(linkBox.y + linkBox.height).toBeLessThanOrEqual(barBox.y);
});

test("mouvement réduit : la barre apparaît sans animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/comparer");
  await page.getByRole("button", { name: /^TGV/ }).click();
  await page.getByRole("button", { name: /^Avion/ }).click();
  await expect(page.getByRole("region", { name: "Ta comparaison" })).toHaveCSS(
    "animation-name",
    "none",
  );
});

test("avec animation : la barre monte depuis le bas", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/comparer");
  await page.getByRole("button", { name: /^TGV/ }).click();
  await page.getByRole("button", { name: /^Avion/ }).click();
  await expect(page.getByRole("region", { name: "Ta comparaison" })).toHaveCSS(
    "animation-name",
    "bar-in",
  );
});

test("un objet (parcours en étapes) n'a pas de barre", async ({ page }) => {
  await page.goto("/comparer");
  await page.getByRole("button", { name: "S’habiller" }).click();
  await page.getByRole("button", { name: /^Jean/ }).click();
  await expect(page).toHaveURL(/\/comparer\?objet=jean/);
  await expect(page.locator('[data-sticky-bar="compare"]')).toHaveCount(0);
});

test.describe("clavier", () => {
  test.skip(
    ({ browserName }) => browserName === "webkit",
    "WebKit ne parcourt pas les liens avec Tab par défaut",
  );

  test("le bouton de la page vient avant celui de la barre, le focus reste sur le geste", async ({
    page,
  }) => {
    await page.goto("/comparer");
    // Page hydratée (le mois de l'encart de saison n'est connu que côté client) : sinon
    // Espace serait perdu.
    await expect(
      page.getByRole("heading", { name: /^De saison en / }),
    ).toBeVisible();
    await tabTo(page, "TGV");
    await page.keyboard.press("Space");
    await tabTo(page, "Avion");
    await page.keyboard.press("Space");
    await expect(
      page.getByRole("region", { name: "Ta comparaison" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /^Avion/ })).toBeFocused();

    await tabTo(page, "Comparer");
    expect(await focusInBar(page)).toBe(false);
    await expect(
      page.getByRole("main").getByRole("button", { name: "Comparer" }),
    ).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("heading", { name: "Lequel pèse le moins ?" }),
    ).toBeFocused();
  });
});

test.describe("en anglais", () => {
  test("“Petrol or diesel car vs Bike”, Compare, axe", async ({ page }) => {
    await page.goto("/en/compare");
    await page.getByRole("button", { name: /^Petrol or diesel car/ }).click();
    await page.getByRole("button", { name: /^Bike/ }).click();
    const bar = page.getByRole("region", { name: "Your comparison" });
    await expect(bar).toBeVisible();
    await expect(bar).toContainText("Petrol or diesel car vs Bike");
    await expect(bar).toContainText(
      "Petrol or diesel car and Bike selected: you can compare.",
    );
    expect(await focusInBar(page)).toBe(false);
    await expectNoAxeViolations(page);

    await page.getByRole("button", { name: /^Bike/ }).click();
    await expect(bar).toHaveCount(0);
    await page.getByRole("button", { name: /^Bike/ }).click();
    await bar.getByRole("button", { name: "Compare" }).click();
    await expect(page).toHaveURL(/\/en\/compare\?a=voiture&b=velo&q=/);
    await expect(
      page.getByRole("heading", { name: "Which one weighs less?" }),
    ).toBeVisible();
  });
});

test.describe("avec le bandeau de langue (navigateur en anglais)", () => {
  test.use({ locale: "en-GB" });

  test("la barre s'empile au-dessus du bandeau, sans chevauchement ; bandeau fermé, elle reprend le bas", async ({
    page,
  }) => {
    await page.goto("/comparer");
    const banner = page.locator("[data-language-banner]");
    await expect(banner).toBeVisible();
    await page.getByRole("button", { name: /^TGV/ }).click();
    await page.getByRole("button", { name: /^Avion/ }).click();
    const bar = page.getByRole("region", { name: "Ta comparaison" });
    await expect(bar).toBeVisible();
    await settled(bar);

    const viewport = page.viewportSize()!;
    const barBox = (await bar.boundingBox())!;
    const bannerBox = (await banner.boundingBox())!;
    // Le bandeau reste au bas de l'écran ; la barre est posée juste au-dessus.
    expect(Math.round(bannerBox.y + bannerBox.height)).toBe(viewport.height);
    expect(barBox.y + barBox.height).toBeLessThanOrEqual(bannerBox.y + 0.5);
    expect(barBox.y + barBox.height).toBeGreaterThanOrEqual(bannerBox.y - 1);
    await expect(bar.getByRole("button", { name: "Comparer" })).toBeVisible();
    await expect(
      banner.getByRole("link", { name: "Read in English" }),
    ).toBeVisible();
    expect(await focusInBar(page)).toBe(false);

    // Marge du bas : la hauteur des deux ; le pied de page reste au-dessus de la barre.
    expect(await bodyPadding(page)).toBeGreaterThanOrEqual(
      Math.floor(barBox.height + bannerBox.height),
    );
    await page.evaluate(() =>
      window.scrollTo(0, document.documentElement.scrollHeight),
    );
    const lastLink = page.getByRole("contentinfo").getByRole("link").last();
    const linkBox = (await lastLink.boundingBox())!;
    expect(linkBox.y + linkBox.height).toBeLessThanOrEqual(
      (await bar.boundingBox())!.y,
    );
    // L'encart de saison vient d'entrer à l'écran : l'étiquette du mois arrive en fondu
    // (GSAP, invisible pour getAnimations) ; axe mesurerait son contraste en plein fondu.
    await expect(page.locator("[data-month-tag]")).toHaveCSS("opacity", "1");
    await expectNoAxeViolations(page);

    // Bandeau fermé : la barre redescend tout en bas, la marge ne garde que sa hauteur.
    await banner.getByRole("button", { name: "Close" }).click();
    await expect(banner).toHaveCount(0);
    await expect
      .poll(async () => {
        const box = (await bar.boundingBox())!;
        return Math.round(box.y + box.height);
      })
      .toBe(viewport.height);
    const padding = await bodyPadding(page);
    expect(padding).toBeGreaterThanOrEqual(Math.floor(barBox.height));
    expect(padding).toBeLessThan(barBox.height + bannerBox.height - 1);
  });

  test("en anglais (depuis le bandeau) : pas de bandeau, barre en bas, axe", async ({
    page,
  }) => {
    await page.goto("/comparer");
    await page.getByRole("button", { name: /^Voiture thermique/ }).click();
    await page
      .locator("[data-language-banner]")
      .getByRole("link", { name: "Read in English" })
      .click();
    await expect(page).toHaveURL(/\/en\/compare\?a=voiture/);
    await expect(page.locator("[data-language-banner]")).toHaveCount(0);
    await page.getByRole("button", { name: /^Bike/ }).click();
    const bar = page.getByRole("region", { name: "Your comparison" });
    await expect(bar).toContainText("Petrol or diesel car vs Bike");
    const viewport = page.viewportSize()!;
    await expect
      .poll(async () => {
        const box = (await bar.boundingBox())!;
        return Math.round(box.y + box.height);
      })
      .toBe(viewport.height);
    await expectNoAxeViolations(page);
  });
});
