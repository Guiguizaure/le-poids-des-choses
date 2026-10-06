import {
  entry,
  expect,
  expectDidYouKnow,
  expectNoAxeViolations,
  seedJournal,
  test,
} from "./fixtures";

test("duel : carte « Le savais-tu ? » sur les gestes comparés, avec source et méthode", async ({
  page,
}) => {
  await page.goto("/comparer?a=tgv&b=avion&q=300");
  const card = page.getByRole("complementary", { name: "Le savais-tu ?" });
  await expectDidYouKnow(card);
  // En lien avec le duel : il parle de l'avion ou du TGV, avec une valeur calculée.
  await expect(card).toContainText(/avion|TGV/);
  await expect(card).toContainText(/\d/);
  await expect(
    card.getByRole("link", { name: /Source : .* sur Impact CO2/ }),
  ).toHaveAttribute("href", /^https:\/\/impactco2\.fr\//);
  await expectNoAxeViolations(page);
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
  await expectDidYouKnow(card);
  await expect(card).toContainText(/jean/);
});

test("jardin : une carte « Le savais-tu ? », la même à chaque visite", async ({
  page,
}) => {
  await seedJournal(page, [entry("fait-1", 66.5)]);
  await page.goto("/jardin");
  const card = page.getByRole("complementary", { name: "Le savais-tu ?" });
  await expectDidYouKnow(card);
  const text = await card.textContent();
  await expectNoAxeViolations(page);
  await page.reload();
  await expect(card).toHaveText(text!);
});

test.describe("en anglais", () => {
  test("duel : “Did you know?”, même encadré, source et méthode", async ({
    page,
  }) => {
    await page.goto("/en/compare?a=tgv&b=avion&q=300");
    const card = page.getByRole("complementary", { name: "Did you know?" });
    await expectDidYouKnow(card);
    await expect(
      card.getByRole("link", { name: /Source: .* on Impact CO2/ }),
    ).toHaveAttribute("href", /^https:\/\/impactco2\.fr\//);
    await expectNoAxeViolations(page);
    await card.getByRole("link", { name: "Method" }).click();
    await expect(page).toHaveURL(/\/en\/method#savais-tu$/);
  });

  test("duel objet : même encadré", async ({ page }) => {
    await page.goto("/en/compare?objet=jean");
    await expectDidYouKnow(
      page.getByRole("complementary", { name: "Did you know?" }),
    );
  });

  test("jardin : même encadré", async ({ page }) => {
    await seedJournal(page, [entry("fait-1", 66.5)]);
    await page.goto("/en/garden");
    await expectDidYouKnow(
      page.getByRole("complementary", { name: "Did you know?" }),
    );
    await expectNoAxeViolations(page);
  });
});
