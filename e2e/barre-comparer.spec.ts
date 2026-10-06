import { expect, expectNoAxeViolations, tabTo, test } from "./fixtures";
import type { Page } from "@playwright/test";

/** Le focus n'est jamais pris par la barre. */
const focusInBar = (page: Page) =>
  page.evaluate(
    () => document.activeElement?.closest("[data-compare-bar]") !== null,
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
  expect(await page.evaluate(() => document.body.style.paddingBottom)).toBe("");
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
  expect(await page.evaluate(() => document.body.style.paddingBottom)).toBe("");

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
  await bar.evaluate((el) =>
    Promise.all(el.getAnimations().map((animation) => animation.finished)),
  );
  const barHeight = (await bar.boundingBox())!.height;
  const padding = await page.evaluate(() =>
    parseFloat(getComputedStyle(document.body).paddingBottom),
  );
  expect(padding).toBeGreaterThanOrEqual(Math.floor(barHeight));

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
  await expect(page.locator("[data-compare-bar]")).toHaveCount(0);
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
