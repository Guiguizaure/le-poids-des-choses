// Lot « Comparer plus » : mini-duel de l'accueil (une devinette, rien n'est noté), duels prêts à
// jouer (Duel du jour), recherche dans Comparer, catégorie « Équiper la maison ».
import type { Page } from "@playwright/test";
import {
  entry,
  expect,
  expectNoAxeViolations,
  seedJournal,
  test,
} from "./fixtures";

/** Paramètres attendus de chaque duel prêt à jouer (src/lib/duels/ready.ts). */
const DUEL_QUERIES: Record<string, string> = {
  "paris-marseille": "a=tgv&b=avion&q=752",
  jean: "objet=jean&option=occasion&colis=1",
  steak: "a=repas-boeuf&b=repas-vegetarien&q=1",
  "cafe-the": "a=cafe&b=the&q=1",
  "velo-voiture": "a=velo&b=voiture&q=5",
  eau: "a=eau-robinet&b=eau-bouteille&q=1",
  livraison: "a=livraison-domicile&b=point-relais-pied&q=1",
  "lave-linge": "objet=lave-linge&option=garder&colis=0",
};

const journalOf = (page: Page) =>
  page.evaluate(() => localStorage.getItem("lpdc:journal:v1"));

const card = (page: Page) => page.locator("[data-mini-duel]");

test.describe("mini-duel de l'accueil", () => {
  for (const [answer, label, heading] of [
    ["velo", "À vélo", "Le vélo est le plus léger."],
    ["voiture", "En voiture", "Pas tout à fait : c’est le vélo le plus léger."],
  ] as const) {
    test(`au clavier, « ${label} » : ${heading}`, async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await expect(
        card(page).getByText(
          "Touche ta réponse\u202f: l’écart s’affiche, calculé avec les données de l’ADEME.",
        ),
      ).toBeVisible();
      const before = (await card(page).boundingBox())!;
      const button = page.getByRole("button", { name: label });
      await button.focus();
      await page.keyboard.press("Enter");

      const result = page.getByRole("heading", { name: heading });
      await expect(result).toBeVisible();
      await expect(result).toBeFocused();
      await expect(card(page)).toHaveAttribute("data-mini-duel", "answered");
      if (answer === "velo")
        await expect(card(page).getByText("Bien vu !")).toBeVisible();
      else await expect(card(page).getByText("Bien vu !")).toBeHidden();
      // L'écart vient des données (format habituel du site) ; aucun reproche.
      await expect(page.locator("[data-mini-gap]")).toHaveText(
        /^\d+ g CO2e d’écart sur 5 km$/,
      );
      await expect(
        page.getByText(
          "Tu passes au duel complet, déjà rempli : c’est là que ton choix est noté.",
        ),
      ).toBeVisible();
      // Même hauteur avant et après (aucun décalage), questions retirées du clavier.
      const after = (await card(page).boundingBox())!;
      expect(after.height).toBe(before.height);
      await expect(button).toBeHidden();
      await expectNoAxeViolations(page);

      // Une devinette : rien n'entre dans le carnet depuis l'accueil.
      expect(await journalOf(page)).toBeNull();
    });
  }

  test("sans jardin : « Faire pousser ma première plante » ouvre le duel déjà rempli", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "À vélo" }).click();
    await page
      .getByRole("link", { name: "Faire pousser ma première plante" })
      .click();
    await expect(page).toHaveURL(/\/comparer\?a=velo&b=voiture&q=5$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Lequel pèse le moins ?" }),
    ).toBeVisible();
    expect(await journalOf(page)).toBeNull();
  });

  test("avec un jardin : « Noter ce choix » ; « Un autre duel » mène à Comparer", async ({
    page,
  }) => {
    await seedJournal(page, [entry("accueil-mini", 4.1, 60)]);
    await page.goto("/");
    const stored = await journalOf(page);
    await page.getByRole("button", { name: "En voiture" }).click();
    await expect(
      page.getByRole("link", { name: "Noter ce choix" }),
    ).toHaveAttribute("href", "/comparer?a=velo&b=voiture&q=5");
    // Rien de plus dans le carnet après la réponse.
    expect(await journalOf(page)).toBe(stored);
    await page.getByRole("link", { name: "Un autre duel" }).click();
    await expect(page).toHaveURL(/\/comparer$/);
    await expect(
      page.getByRole("heading", { name: "Duels prêts à jouer" }),
    ).toBeVisible();
  });

  test("en anglais", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: "By bike" }).click();
    await expect(
      page.getByRole("heading", { name: "The bike is the lighter one." }),
    ).toBeVisible();
    await expect(page.locator("[data-mini-gap]")).toHaveText(
      /^\d+ g CO2e difference over 5 km$/,
    );
    await expect(
      page.getByRole("link", { name: "Grow my first plant" }),
    ).toHaveAttribute("href", "/en/compare?a=velo&b=voiture&q=5");
  });

  test("« Comment ça marche ? » mène à la section de l'accueil", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page
      .locator('[data-home-actions="new"]')
      .getByRole("link", { name: "Comment ça marche ?" })
      .click();
    await expect(page).toHaveURL(/\/#comment-ca-marche$/);
    await expect(
      page.getByRole("heading", { level: 2, name: "Comment ça marche" }),
    ).toBeInViewport();
    await expect(page.getByRole("listitem")).toContainText([
      "Compare deux gestes",
    ]);
    await expect(
      page.getByRole("link", { name: "Tout sur la méthode" }),
    ).toHaveAttribute("href", "/methode");
  });
});

test.describe("duels prêts à jouer", () => {
  test("accueil : 4 cartes, le Duel du jour d'abord, chacune ouvre son duel", async ({
    page,
  }) => {
    await page.goto("/");
    const cards = page.locator("[data-ready-duel]");
    await expect(cards).toHaveCount(4);
    await expect(cards.first()).toHaveAttribute("data-daily", "");
    await expect(cards.first()).toContainText("Duel du jour");
    for (const link of await cards.all()) {
      const id = (await link.getAttribute("data-ready-duel"))!;
      await expect(link).toHaveAttribute(
        "href",
        `/comparer?${DUEL_QUERIES[id]}`,
      );
    }
    const first = (await cards.first().getAttribute("data-ready-duel"))!;
    await cards.first().click();
    await expect(page).toHaveURL(
      new RegExp(`/comparer\\?${DUEL_QUERIES[first].replace(/\?/g, "\\?")}$`),
    );
    await page.getByRole("link", { name: /Voir tous les duels/ }).isVisible();
  });

  test("Comparer : la recherche en haut, puis les 8 duels, puis les catégories (maquette 105:2)", async ({
    page,
  }) => {
    await page.goto("/comparer");
    const cards = page.locator("[data-ready-duel]");
    await expect(cards).toHaveCount(Object.keys(DUEL_QUERIES).length);
    const order = await page.evaluate(() => {
      const top = (selector: string) =>
        document.querySelector(selector)!.getBoundingClientRect().top;
      return [
        top("[data-gesture-search]"),
        top("[data-ready-duels-section]"),
        top('[aria-label="Catégories"]'),
      ];
    });
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    for (const link of await cards.all()) {
      const id = (await link.getAttribute("data-ready-duel"))!;
      await expect(link).toHaveAttribute(
        "href",
        `/comparer?${DUEL_QUERIES[id]}`,
      );
    }
    // Paris–Marseille sur 752 km : le duel s'ouvre rempli.
    await page.locator('[data-ready-duel="paris-marseille"]').click();
    await expect(page).toHaveURL(/a=tgv&b=avion&q=752$/);
    await expect(page.getByText("752 km")).toBeVisible();
  });

  test("le Duel du jour change à minuit, heure de Paris, le même pour tous", async ({
    page,
  }) => {
    await page.clock.setFixedTime(new Date("2026-10-10T21:59:00Z"));
    await page.goto("/comparer");
    const daily = page.locator("[data-ready-duel][data-daily]");
    const before = await daily.getAttribute("data-ready-duel");
    await page.clock.setFixedTime(new Date("2026-10-10T22:01:00Z"));
    // Recharger une fois les préchargements de Next finis (WebKit signale ceux qu'il coupe).
    await page.waitForLoadState("networkidle");
    await page.reload();
    const after = await daily.getAttribute("data-ready-duel");
    expect(after).not.toBe(before);
  });
});

test.describe("recherche dans Comparer", () => {
  test("« velo » trouve les vélos, annonce le nombre, choisit comme la grille", async ({
    page,
  }) => {
    await page.goto("/comparer");
    const field = page.getByLabel("Chercher un geste");
    await expect(field).toHaveAttribute(
      "placeholder",
      "Cherche : covoiturage, lave-linge…",
    );
    await field.fill("velo");
    const results = page.locator("[data-search-result]");
    await expect(results).toHaveCount(3);
    await expect(
      page.getByRole("status").filter({ hasText: "3 gestes trouvés" }),
    ).toHaveCount(1);
    await expect(results.nth(1)).toContainText("Vélo électrique");
    await expect(results.nth(1)).toContainText("Se déplacer · au km");
    await expect(
      page.getByText("Jamais un vélo contre un steak."),
    ).toBeVisible();
    await expectNoAxeViolations(page);

    await results.nth(1).click();
    await expect(field).toHaveValue("");
    await expect(
      page.getByRole("button", { name: /^Vélo électrique/ }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  test("en anglais et sans accent ; rien trouvé : le catalogue suit l'ADEME", async ({
    page,
  }) => {
    await page.goto("/comparer");
    const field = page.getByLabel("Chercher un geste");
    await field.fill("washing machine");
    await expect(page.locator("[data-search-result]")).toHaveCount(1);
    await expect(page.locator("[data-search-result]")).toContainText(
      "Lave-linge",
    );
    await expect(page.locator("[data-search-result]")).toContainText(
      "Équiper la maison · par objet",
    );
    await field.fill("console de jeux");
    await expect(page.locator("[data-search-result]")).toHaveCount(0);
    await expect(
      page.getByRole("status").filter({ hasText: "Aucun geste trouvé" }),
    ).toHaveCount(1);
    await expect(page.locator("[data-search-empty]")).toHaveText(
      "Rien trouvé ? Le catalogue suit les données de l’ADEME : si un geste n’y est pas, on ne l’invente pas.",
    );
    await page.getByRole("button", { name: "Effacer la recherche" }).click();
    await expect(field).toHaveValue("");
  });
});

test.describe("« Équiper la maison »", () => {
  test("lave-linge : neuf (fabrication seule), gardé ; écart de fabrication précisé", async ({
    page,
  }) => {
    await page.goto("/comparer?objet=lave-linge&option=garder&colis=0");
    await expect(
      page.getByText("Fabrication d’un lave-linge neuf"),
    ).toBeVisible();
    await expect(page.locator("[data-manufacturing-note]")).toHaveText(
      "Écart de fabrication\u202f: l’usage (lavage, électricité) existe que l’objet soit neuf ou gardé.",
    );
    // Trop gros pour un colis du CSV : pas d'interrupteur « Livré en colis ».
    await expect(page.getByRole("switch")).toHaveCount(0);
    await expectNoAxeViolations(page);
  });

  test("la catégorie est marquée « Nouveau » (texte encre sur lavande)", async ({
    page,
  }) => {
    await page.goto("/comparer");
    const maison = page.getByRole("button", { name: /^Équiper la maison/ });
    await expect(maison).toContainText("Nouveau");
    await maison.click();
    await expect(page.getByRole("button", { name: "Armoire" })).toBeVisible();
    await expectNoAxeViolations(page);
  });
});
