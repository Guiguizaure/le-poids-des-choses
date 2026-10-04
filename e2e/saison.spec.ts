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
  test(`encart « Ce mois-ci, c'est la saison de… » sur ${path}`, async ({
    page,
  }) => {
    await page.goto(path);
    const teaser = page.getByRole("complementary", {
      name: "Ce mois-ci, c’est la saison de…",
    });
    await expect(teaser.getByRole("listitem")).toHaveCount(3);
    await teaser
      .getByRole("link", { name: "Tous les fruits et légumes de saison" })
      .click();
    await expect(page).toHaveURL(/\/saison$/);
    await expect(
      page.getByRole("heading", { level: 1, name: /^De saison en / }),
    ).toBeVisible();
  });
}

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
  await expectCredit(
    page.getByRole("region", { name: "D’où viennent les chiffres ?" }),
  );
});
