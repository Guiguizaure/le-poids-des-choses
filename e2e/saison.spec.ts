import type { Locator, Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const MONTHS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

/** « 387 g », « 1,4 kg » → grammes. */
function grams(text: string): number {
  const [, value, unit] = text.match(/([\d\s,]+)\s*(g|kg|t)/)!;
  const number = Number(value.replace(/\s/g, "").replace(",", "."));
  return number * (unit === "g" ? 1 : unit === "kg" ? 1000 : 1_000_000);
}

/** Saison : la base d'origine et sa mise à jour, puis la date de récupération. */
const SEASON_DATES =
  /Données Agribalyse 3\.2 \(mise à jour du 15\/01\/2025\), récupérées le \d{1,2} [a-zéû]+ \d{4}/;

async function expectCredit(scope: Page | Locator) {
  const credit = scope.locator("[data-credit]").first();
  await expect(credit).toContainText("Données : Impact CO2 – ADEME");
  await expect(credit).toContainText(
    /(téléchargées|récupérées) le \d{1,2} [a-zéû]+ \d{4}/,
  );
  await expect(
    credit.getByRole("link", { name: "Impact CO2 – ADEME" }),
  ).toHaveAttribute("href", /^https:\/\/impactco2\.fr/);
}

test("/saison : le mois courant par défaut, triés par impact, regroupés par catégorie", async ({
  page,
}) => {
  await page.goto("/saison");
  const current = MONTHS[new Date().getMonth()];
  await expect(
    page.getByRole("heading", { level: 1, name: `De saison en ${current}` }),
  ).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Mois" })).toHaveValue(
    String(new Date().getMonth() + 1),
  );

  // Catégories de l'API, avec leur intitulé français.
  const fruits = page.getByRole("region", { name: /^Fruits \(\d+\)$/ });
  await expect(fruits).toBeVisible();
  // Chaque liste va du plus léger au plus lourd au kg.
  for (const list of await page.locator("main ul").all()) {
    const values = await list.locator("li span.tabular-nums").allTextContents();
    const sorted = [...values].sort((a, b) => grams(a) - grams(b));
    expect(values).toEqual(sorted);
  }

  await expect(
    page.getByRole("link", { name: "Fruits et légumes de saison, Impact CO2" }),
  ).toHaveAttribute("href", "https://impactco2.fr/outils/fruitsetlegumes");
  await expectCredit(page);
  await expect(page.locator("[data-credit]")).toContainText(SEASON_DATES);
});

test("/saison : le mois suit l'URL et le sélecteur, le retour arrière aussi", async ({
  page,
}) => {
  await page.goto("/saison?mois=5");
  await expect(
    page.getByRole("heading", { level: 1, name: "De saison en mai" }),
  ).toBeVisible();
  // En mai, pas de châtaigne (octobre, novembre) ; en octobre, si.
  await expect(page.getByText("Châtaigne", { exact: true })).toHaveCount(0);

  await page.getByRole("combobox", { name: "Mois" }).selectOption("10");
  await expect(page).toHaveURL(/\/saison\?mois=10$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "De saison en octobre" }),
  ).toBeVisible();
  await expect(page.getByText("Châtaigne", { exact: true })).toBeVisible();

  await page.goBack();
  await expect(
    page.getByRole("heading", { level: 1, name: "De saison en mai" }),
  ).toBeVisible();
});

test("/saison : les deux mangues gardées telles quelles, l'origine expliquée", async ({
  page,
}) => {
  await page.goto("/saison?mois=1");
  await expect(page.getByText("Mangue (importée par avion)")).toBeVisible();
  await expect(page.getByText("Mangue (importée par bateau)")).toBeVisible();
  await page
    .getByRole("link", { name: "Méthode", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/\/methode#saison$/);
  const section = page.getByRole("region", {
    name: "Fruits et légumes de saison",
  });
  await expect(section).toContainText(
    "La donnée ne précise pas l’origine des produits, sauf pour la mangue, où elle distingue l’import par avion et l’import par bateau.",
  );
  await expectCredit(section);
  await expect(section.locator("[data-credit]")).toContainText(SEASON_DATES);
});

for (const path of ["/", "/comparer"]) {
  test(`encart de saison sur ${path} : du plus léger au plus lourd au kilo`, async ({
    page,
  }) => {
    await page.goto(path);
    const current = MONTHS[new Date().getMonth()];
    const teaser = page.getByRole("complementary", {
      name: `De saison en ${current}`,
    });
    const range = teaser.locator("[data-season-range]");
    await expect(range).toContainText("Du plus léger au plus lourd au kilo :");
    // Deux repères, arrondis comme sur /saison, espace insécable avant les unités.
    const values = (await range.innerText()).match(
      /[\d,]+ (?:g|kg|t) CO2e\/kg/g,
    );
    expect(values).toHaveLength(2);
    expect(grams(values![0])).toBeLessThan(grams(values![1]));
    await expectCredit(teaser);
    await expect(teaser.locator("[data-credit]")).toContainText(SEASON_DATES);

    // Fruits et légumes dessinés : décoratifs, jamais focalisables, apparus en fondu.
    const produce = teaser.locator("[data-floating-produce]");
    await expect(produce).toHaveAttribute("aria-hidden", "true");
    await produce.scrollIntoViewIfNeeded();
    const items = produce.locator("[data-produce]");
    expect(await items.count()).toBeGreaterThan(0);
    await expect(items.first().locator('[data-layer="bounce"]')).toHaveCSS(
      "opacity",
      "1",
    );
    await expect(produce.locator("a, button, [tabindex]")).toHaveCount(0);

    await teaser
      .getByRole("link", { name: "Tous les fruits et légumes de saison" })
      .click();
    await expect(page).toHaveURL(/\/saison$/);
    await expect(
      page.getByRole("heading", { level: 1, name: /^De saison en / }),
    ).toBeVisible();
  });
}

test.describe("encart de saison en mouvement réduit", () => {
  test.use({ reducedMotion: "reduce" });

  test("les fruits et légumes sont visibles et immobiles", async ({ page }) => {
    await page.goto("/");
    const items = page.locator("[data-floating-produce] [data-produce]");
    await items.first().scrollIntoViewIfNeeded();
    await expect(items.first().locator('[data-layer="bounce"]')).toHaveCSS(
      "opacity",
      "1",
    );
    await page.waitForTimeout(400);
    const transforms = await items.evaluateAll((elements) =>
      elements.flatMap((element) =>
        ["parallax", "float", "bounce"].map(
          (name) =>
            (element.querySelector(`[data-layer="${name}"]`) as HTMLElement)
              .style.transform,
        ),
      ),
    );
    expect(transforms.every((value) => value === "")).toBe(true);
    // Toucher un produit ne le fait pas rebondir.
    await items.first().click({ force: true });
    await page.waitForTimeout(200);
    await expect(
      items.first().locator('[data-layer="bounce"]'),
    ).not.toHaveAttribute("style", /translate/);
  });
});

test("crédit des données, avec lien et date, sur chaque résultat et sur /methode", async ({
  page,
}) => {
  await page.goto("/comparer?a=tgv&b=avion&q=300");
  await expectCredit(page);
  await page.getByRole("button", { name: "Je choisis le TGV" }).click();
  await expect(
    page.getByRole("heading", { name: /va pousser dans ton jardin/ }),
  ).toBeVisible();
  await expectCredit(page);

  await page.goto("/comparer?a=avion&b=tgv&q=300");
  await page.getByRole("button", { name: "Je choisis l’avion" }).click();
  await expect(page.getByRole("heading", { name: "C’est noté" })).toBeVisible();
  await expectCredit(page);

  await page.goto("/comparer?objet=jean");
  await expectCredit(page);

  await page.goto("/methode");
  const sources = page.getByRole("region", {
    name: "D’où viennent les chiffres ?",
  });
  await expectCredit(sources);
  await expect(sources).toContainText(
    "Réutilisation des données autorisée par l’équipe Impact CO2 de l’ADEME (e-mail du 5 octobre 2026)",
  );
});
