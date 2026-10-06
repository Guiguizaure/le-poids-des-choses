// Espèces : « Que veux-tu planter ? » à chaque nouvelle plante (choix léger), déblocage au fil
// des pas de croissance, choix gardé avec la plante, anglais, accessibilité.
import {
  entry,
  expect,
  expectNoAxeViolations,
  letGardenChoose,
  seedJournal,
  test,
} from "./fixtures";

/** Sept choix légers anciens : 7 pas de croissance, marguerite et olivier débloqués. */
const SEVEN = Array.from({ length: 7 }, (_, i) =>
  entry(`especes-${i}`, 30, 60 * 24 * (10 - i)),
);

const journal = (page: import("@playwright/test").Page) =>
  page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("lpdc:journal:v1") ?? '{"entries":[]}')
        .entries as { id: string; species?: string }[],
  );

test("choisir l'olivier : il est gardé avec la plante et pousse dans le jardin", async ({
  page,
}) => {
  await seedJournal(page, SEVEN);
  await page.goto("/comparer?a=tgv&b=avion&q=300");
  await page.getByRole("button", { name: "Je choisis le TGV" }).click();

  const picker = page.getByRole("dialog", { name: "Que veux-tu planter ?" });
  await expect(picker).toBeVisible();
  await expect(
    picker.getByRole("heading", { name: "Que veux-tu planter ?" }),
  ).toBeFocused();
  // Les six espèces de départ, la marguerite et l'olivier ; les autres grisées.
  await expect(picker.getByRole("button", { name: /^Planter : / })).toHaveCount(
    8,
  );
  const lavande = picker.locator('[data-species="fleur-5"] [data-locked]');
  await expect(lavande).toContainText("Se débloque bientôt");
  await expect(lavande).toContainText("Encore 2 choix légers ou jours arrosés");
  await expect(picker.locator("[data-locked]")).toHaveCount(4);
  const olive = picker.getByRole("button", { name: "Planter : Olivier" });
  await expect(olive).toHaveAccessibleDescription(
    /Persistant[\s\S]*olives noires/,
  );
  await expectNoAxeViolations(page);

  await olive.click();
  await expect(picker).toBeHidden();
  await expect(
    page.getByRole("heading", { name: /Un arbre va pousser dans ton jardin/ }),
  ).toBeFocused();
  const entries = await journal(page);
  const chosen = entries.at(-1)!;
  expect(chosen.species).toBe("arbre-4");

  await page.getByRole("link", { name: "Aller la planter" }).click();
  await expect(page.locator(`[data-plant="${chosen.id}"]`)).toHaveAttribute(
    "data-species",
    "arbre-4",
  );
});

test("« Laisse le jardin choisir », Échap ou la croix : rien n'est bloqué, aucune espèce gardée", async ({
  page,
}) => {
  await page.goto("/comparer?a=tgv&b=avion&q=300");
  await page.getByRole("button", { name: "Je choisis le TGV" }).click();
  await letGardenChoose(page);
  await expect(
    page.getByRole("heading", { name: /va (pousser|sortir)/ }),
  ).toBeVisible();
  expect((await journal(page)).at(-1)!.species).toBeUndefined();

  // Échap : même chose.
  await page.goto("/comparer?a=velo&b=voiture&q=20");
  await page.getByRole("button", { name: "Je choisis le vélo" }).click();
  await expect(page.locator("[data-species-picker]")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("[data-species-picker]")).toBeHidden();
  await expect(
    page.getByRole("heading", { name: /va (pousser|sortir)/ }),
  ).toBeVisible();
  const entries = await journal(page);
  expect(entries).toHaveLength(2);
  expect(entries.every((e) => e.species === undefined)).toBe(true);
});

test("un choix plus lourd ne propose rien : rien ne pousse", async ({
  page,
}) => {
  await page.goto("/comparer?a=tgv&b=avion&q=300");
  await page.getByRole("button", { name: "Je choisis l’avion" }).click();
  await expect(page.getByRole("heading", { name: "C’est noté" })).toBeVisible();
  await expect(page.locator("[data-species-picker]")).toHaveCount(0);
});

test("déblocage : le troisième pas annonce « Nouvelle espèce : la marguerite »", async ({
  page,
}) => {
  await seedJournal(page, SEVEN.slice(0, 2));
  await page.goto("/comparer?a=tgv&b=avion&q=300");
  await page.getByRole("button", { name: "Je choisis le TGV" }).click();
  // Avant ce choix : 2 pas, la marguerite est encore grisée.
  await expect(
    page.locator(
      '[data-species-picker] [data-species="fleur-4"] [data-locked]',
    ),
  ).toContainText("Encore 1 choix léger ou jour arrosé");
  await letGardenChoose(page);
  await expect(page.locator("[data-species-unlocked]")).toContainText(
    "Nouvelle espèce : la marguerite",
  );
  // La carte se pose comme un papier : on mesure une fois posée.
  await expect(
    page.locator('section[aria-labelledby="resultat-titre"]'),
  ).toHaveCSS("opacity", "1");
  await expectNoAxeViolations(page);
});

test.describe("en anglais", () => {
  test.use({ locale: "en-GB" });
  test("« What would you like to plant? », fiches en anglais", async ({
    page,
  }) => {
    await seedJournal(page, SEVEN);
    await page.goto("/en/compare?a=tgv&b=avion&q=300");
    await page.getByRole("button", { name: "I’ll go for the TGV" }).click();
    const picker = page.getByRole("dialog", {
      name: "What would you like to plant?",
    });
    await expect(picker).toBeVisible();
    await expect(
      picker.getByRole("button", { name: "Plant: Oxeye daisy" }),
    ).toHaveAccessibleDescription(
      /Perennial[\s\S]*Fun fact:[\s\S]*tiny flowers/,
    );
    await expect(picker.locator('[data-species="arbre-5"]')).toContainText(
      "Coming soon",
    );
    await expectNoAxeViolations(page);
    await picker.getByRole("button", { name: "Plant: Oxeye daisy" }).click();
    await expect(picker).toBeHidden();
    expect((await journal(page)).at(-1)!.species).toBe("fleur-4");
  });
});
