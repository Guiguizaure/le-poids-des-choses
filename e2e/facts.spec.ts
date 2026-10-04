import { entry, expect, seedJournal, test } from "./fixtures";

test("duel : carte « Le savais-tu ? » sur les gestes comparés, avec source et méthode", async ({
  page,
}) => {
  await page.goto("/comparer?a=tgv&b=avion&q=300");
  const card = page.getByRole("complementary", { name: "Le savais-tu ?" });
  await expect(card).toBeVisible();
  // En lien avec le duel : il parle de l'avion ou du TGV, avec une valeur calculée.
  await expect(card).toContainText(/avion|TGV/);
  await expect(card).toContainText(/\d/);
  await expect(
    card.getByRole("link", { name: /Source : .* sur Impact CO2/ }),
  ).toHaveAttribute("href", /^https:\/\/impactco2\.fr\//);
  await card.getByRole("link", { name: "Méthode" }).click();
  await expect(page).toHaveURL(/\/methode#savais-tu$/);
  await expect(
    page.getByRole("heading", { name: "« Le savais-tu ? »" }),
  ).toBeVisible();
});

test("duel objet : la carte parle de l'objet quand c'est possible", async ({
  page,
}) => {
  await page.goto("/comparer?objet=jean");
  const card = page.getByRole("complementary", { name: "Le savais-tu ?" });
  await expect(card).toContainText(/jean/);
});

test("jardin : une carte « Le savais-tu ? », la même à chaque visite", async ({
  page,
}) => {
  await seedJournal(page, [entry("fait-1", 66.5)]);
  await page.goto("/jardin");
  const card = page.getByRole("complementary", { name: "Le savais-tu ?" });
  await expect(card).toBeVisible();
  const text = await card.textContent();
  await page.reload();
  await expect(card).toHaveText(text!);
});
