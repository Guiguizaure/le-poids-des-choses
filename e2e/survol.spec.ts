// Curseur et survol : la preflight de Tailwind 4 ne met plus la main sur les boutons ; tout
// ce qui se sélectionne la retrouve (curseur système), un élément désactivé jamais. Survol à
// la souris seulement (`hover: hover`), sans décalage de mise en page ; en mouvement réduit,
// rien ne bouge (l'ombre seule).
import type { Locator, Page } from "@playwright/test";
import { entry, expect, seedJournal, test } from "./fixtures";

const cursorOf = (locator: Locator) =>
  locator.evaluate((el) => getComputedStyle(el).cursor);

async function expectPointer(page: Page, locators: Locator[]) {
  for (const locator of locators) {
    await expect(locator).toBeVisible();
    expect(
      await cursorOf(locator),
      await locator.evaluate((el) => el.outerHTML.slice(0, 120)),
    ).toBe("pointer");
  }
}

test.describe("curseur : la main sur tout ce qui se sélectionne", () => {
  test("accueil", async ({ page }) => {
    await page.goto("/");
    const actions = page.locator('[data-home-actions="new"]');
    await expectPointer(page, [
      actions.getByRole("link", { name: "Commencer" }),
      actions.getByRole("link", { name: "Comment ça marche ?" }),
      page.getByRole("button", { name: "À vélo" }),
      page.getByRole("button", { name: "En voiture" }),
      page.locator("[data-ready-duel]").first(),
      page.getByRole("link", { name: /Voir tous les duels/ }),
      page.getByRole("link", { name: "Tout sur la méthode" }),
      page.getByRole("contentinfo").getByRole("link", { name: "Méthode" }),
    ]);
  });

  test("Comparer : catégories, gestes, recherche, duels ; un geste grisé n'a pas la main", async ({
    page,
  }) => {
    await page.goto("/comparer");
    const field = page.getByLabel("Chercher un geste");
    await field.fill("velo");
    await expectPointer(page, [
      page.locator("[data-search-result]").first(),
      page.getByRole("button", { name: "Effacer la recherche" }),
    ]);
    await page.getByRole("button", { name: "Effacer la recherche" }).click();
    await expectPointer(page, [
      page.locator("[data-ready-duel]").first(),
      page.getByRole("button", { name: /^Équiper la maison/ }),
      page.getByRole("button", { name: "Vélo", exact: true }),
      page.getByRole("button", { name: /^Noter une habitude/ }),
      page.getByRole("link", { name: "Fermer et revenir à l’accueil" }),
    ]);

    // Premier geste choisi : un repas (autre unité) est grisé, sans la main.
    await page.getByRole("button", { name: "Vélo", exact: true }).click();
    await page.getByRole("button", { name: /^Manger/ }).click();
    const meal = page.getByRole("button", { name: /^Repas végétarien/ });
    await expect(meal).toBeDisabled();
    expect(await cursorOf(meal)).toBe("not-allowed");
  });

  test("duel et duel objet : curseur, bouton de choix, options, interrupteur", async ({
    page,
  }) => {
    await page.goto("/comparer?a=velo&b=voiture&q=5");
    await expectPointer(page, [
      page.getByRole("slider"),
      page.getByRole("button", { name: "Je choisis le vélo" }),
      page.getByRole("button", { name: "Je choisis la voiture" }),
      page.getByRole("link", { name: "Le poids des choses – Accueil" }),
    ]);
    await page.goto("/comparer?objet=jean&option=occasion&colis=1");
    await expectPointer(page, [
      page.locator("label").filter({ hasText: "Je garde le mien" }),
      page.locator("label").filter({ hasText: "Livré en colis" }),
      page.getByRole("button", { name: /^Je choisis/ }),
    ]);
  });

  test("jardin : action principale, animal qui parle, liens", async ({
    page,
  }) => {
    await seedJournal(page, [entry("survol-1", 3, 60)]);
    await page.goto("/jardin");
    const talker = page.locator("[data-talk]").first();
    await expect(talker).toHaveAttribute("style", /translate\((?!-200vw)/);
    await expectPointer(page, [
      page.locator("[data-grow-plant]"),
      talker,
      page.getByRole("link", { name: "Le poids des choses – Accueil" }),
      page.getByRole("link", { name: "Tout voir" }),
    ]);
  });
});

test.describe("survol à la souris", () => {
  // Ordinateur : pointeur fin, survol possible (les projets e2e simulent des téléphones).
  test.use({
    viewport: { width: 1280, height: 800 },
    hasTouch: false,
    isMobile: false,
  });

  test("cartes soulevées, liens soulignés, sans décalage ; en mouvement réduit, rien ne bouge", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const card = page.locator("[data-ready-duel]").first();
    const link = page.getByRole("link", { name: "Tout sur la méthode" });
    const style = (locator: Locator) =>
      locator.evaluate((el) => {
        const s = getComputedStyle(el);
        return {
          transform: s.transform,
          shadow: s.boxShadow,
          thickness: s.textDecorationThickness,
        };
      });
    // Place dans la mise en page (sans les transformations) de la carte et de la suivante.
    const layout = () =>
      page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>("[data-ready-duel]")]
          .slice(0, 2)
          .map((el) => [
            el.offsetLeft,
            el.offsetTop,
            el.offsetWidth,
            el.offsetHeight,
          ]),
      );
    await card.scrollIntoViewIfNeeded();
    const before = await layout();
    const rest = await style(card);
    await card.hover();
    await expect
      .poll(async () => (await style(card)).transform)
      .toBe("matrix(1, 0, 0, 1, 0, -2)");
    expect((await style(card)).shadow).not.toBe(rest.shadow);
    // Transformation et ombre : rien ne bouge dans la mise en page.
    expect(await layout()).toEqual(before);

    await link.hover();
    expect((await style(link)).thickness).toBe("2px");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await card.hover();
    await expect
      .poll(async () => (await style(card)).shadow)
      .not.toBe(rest.shadow);
    expect((await style(card)).transform).toBe("none");
  });
});
