import { entry, expect, seedJournal, test } from "./fixtures";

// Cinq choix légers : l'oiseau est installé dans le jardin.
const FIVE = Array.from({ length: 5 }, (_, i) =>
  entry(`oiseau-${i}`, 4.1, 10 + i),
);
const FLY = { name: "Faire s’envoler l’oiseau" };

test("l'oiseau s'envole quand on le touche, fait sa boucle et revient se poser", async ({
  page,
}) => {
  await seedJournal(page, FIVE);
  await page.goto("/jardin");
  const button = page.getByRole("button", FLY);
  await expect(button).toBeVisible();
  await button.click();

  const bird = page.locator("[data-flight]");
  await expect(bird).toHaveAttribute("data-flight", "boucle", {
    timeout: 6000,
  });
  // En vol : le dessin passe à oiseau-vol (ailes avant et arrière).
  await expect(bird.locator('[data-part="aile-avant"]')).toHaveCount(1);
  // Pendant le vol, le bouton reste en place, sans effet.
  await expect(button).toHaveAttribute("aria-disabled", "true");

  // Retour à sa place, sur oiseau.svg.
  await expect(bird).toHaveCount(0, { timeout: 10_000 });
  await expect(page.locator('[data-part="aile-avant"]')).toHaveCount(0);
  await expect(button).toHaveAttribute("aria-disabled", "false");
});

test("au clavier : bouton accessible avec un focus visible", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName === "webkit",
    "WebKit ne parcourt pas les boutons avec Tab par défaut",
  );
  await seedJournal(page, FIVE);
  await page.goto("/jardin");
  const button = page.getByRole("button", FLY);
  await button.focus();
  await expect(button).toBeFocused();
  const outline = await button.evaluate(
    (element) => getComputedStyle(element).outlineStyle,
  );
  expect(outline).not.toBe("none");
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-flight]")).toBeAttached({ timeout: 2000 });
});

test("jardin endormi : l'oiseau dort et ne s'envole pas", async ({ page }) => {
  // Dernier choix il y a plus de 21 jours.
  const old = FIVE.map((e, i) => entry(e.id, 4.1, 22 * 24 * 60 + i));
  await seedJournal(page, old);
  await page.goto("/jardin");
  await expect(
    page.getByRole("img", { name: /assoupi sous la brume/ }),
  ).toBeVisible();
  await expect(page.getByRole("button", FLY)).toHaveCount(0);
});

test.describe("animations réduites", () => {
  test.use({ reducedMotion: "reduce" });

  test("l'oiseau reste posé : pas de bouton d'envol", async ({ page }) => {
    await seedJournal(page, FIVE);
    await page.goto("/jardin");
    await expect(
      page.getByRole("img", { name: "Jardin : 5 plantes, 3 animaux" }),
    ).toBeVisible();
    await expect(page.getByRole("button", FLY)).toHaveCount(0);
    await expect(page.locator("[data-flight]")).toHaveCount(0);
  });
});
