// Espèces : « Que veux-tu planter ? » à chaque nouvelle plante (choix léger), déblocage au fil
// des pas de croissance, choix gardé avec la plante, anglais, accessibilité.
import {
  entry,
  expect,
  expectDidYouKnow,
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

test("grille : toucher une carte plante l'espèce, gardée avec la plante", async ({
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
  // Six espèces de départ, la marguerite et l'olivier : une carte à toucher chacune.
  await expect(picker.locator("[data-plant-card]")).toHaveCount(8);
  // Les autres : grisées, cadenas et condition courte.
  await expect(picker.locator("[data-locked]")).toHaveCount(4);
  await expect(picker.locator('[data-species="fleur-5"]')).toContainText(
    "Dans 2 pas",
  );
  // Carte courte : nom et type, sans description ni anecdote.
  const olive = picker.getByRole("button", {
    name: "Planter l’olivier",
    exact: true,
  });
  await expect(olive).toHaveAccessibleDescription(
    "Arbre · Persistant · Fleurit au printemps",
  );
  await expect(picker).not.toContainText("olives noires");
  // « En savoir plus » est à côté du bouton de la carte, jamais dedans.
  await expect(picker.locator("[data-plant-card] [data-more]")).toHaveCount(0);
  await expect(picker.locator("[data-more]")).toHaveCount(12);
  await expectNoAxeViolations(page);

  await olive.click();
  await expect(picker).toBeHidden();
  await expect(
    page.getByRole("heading", { name: /Un arbre va pousser dans ton jardin/ }),
  ).toBeFocused();
  const chosen = (await journal(page)).at(-1)!;
  expect(chosen.species).toBe("arbre-4");

  await page.getByRole("link", { name: "Aller la planter" }).click();
  await expect(page.locator(`[data-plant="${chosen.id}"]`)).toHaveAttribute(
    "data-species",
    "arbre-4",
  );
});

test("fiche : « En savoir plus », « Le savais-tu ? », retour avec le focus sur la carte, planter depuis la fiche", async ({
  page,
}) => {
  await seedJournal(page, SEVEN);
  await page.goto("/comparer?a=tgv&b=avion&q=300");
  await page.getByRole("button", { name: "Je choisis le TGV" }).click();
  const picker = page.getByRole("dialog", { name: "Que veux-tu planter ?" });

  await picker
    .getByRole("button", { name: "En savoir plus sur l’olivier" })
    .click();
  await expect(picker.getByRole("heading", { name: "Olivier" })).toBeFocused();
  await expect(picker).toContainText(
    "Arbre · Persistant · Fleurit à la fin du printemps",
  );
  const fact = picker.getByRole("complementary", { name: "Le savais-tu ?" });
  await expect(fact).toContainText("les noires sont simplement cueillies");
  // Le même encadré que partout : vert sapin, texte blanc.
  await expectDidYouKnow(fact);
  await expect(
    picker.getByRole("button", { name: "Laisse le jardin choisir" }),
  ).toBeVisible();
  // Fiche : la flèche en haut à gauche remplace la croix.
  const arrow = picker.locator("[data-back-arrow]");
  await expect(arrow).toHaveAccessibleName("Retour aux espèces");
  await expect(arrow).toHaveAttribute("title", "Retour aux espèces");
  await expect(picker.getByRole("button", { name: /^Fermer/ })).toHaveCount(0);
  await expectNoAxeViolations(page);

  // Flèche : la grille, focus sur la carte d'origine.
  await arrow.click();
  await expect(
    picker.getByRole("button", { name: "Planter l’olivier", exact: true }),
  ).toBeFocused();
  // Le lien du bas fait la même chose.
  await picker
    .getByRole("button", { name: "En savoir plus sur l’olivier" })
    .click();
  await picker
    .getByRole("button", { name: "Retour aux espèces" })
    .last()
    .click();
  await expect(
    picker.getByRole("button", { name: "Planter l’olivier", exact: true }),
  ).toBeFocused();
  // Sur la grille, la croix dit ce qu'elle fait (nom et info-bulle).
  await expect(
    picker.getByRole("button", { name: "Fermer : le jardin choisira" }),
  ).toHaveAttribute("title", "Fermer : le jardin choisira");

  // Planter depuis la fiche.
  await picker
    .getByRole("button", { name: "En savoir plus sur le pommier" })
    .click();
  await picker.getByRole("button", { name: "Planter le pommier" }).click();
  await expect(picker).toBeHidden();
  expect((await journal(page)).at(-1)!.species).toBe("arbre-1");
});

test("espèce verrouillée : sa fiche donne envie, elle ne se plante pas ; Échap revient à la grille, puis le jardin choisit", async ({
  page,
}) => {
  await seedJournal(page, SEVEN);
  await page.goto("/comparer?a=tgv&b=avion&q=300");
  await page.getByRole("button", { name: "Je choisis le TGV" }).click();
  const picker = page.getByRole("dialog", { name: "Que veux-tu planter ?" });
  await expect(
    picker.getByRole("button", { name: "Planter la lavande" }),
  ).toHaveCount(0);

  await picker
    .getByRole("button", { name: "En savoir plus sur la lavande" })
    .click();
  await expect(picker.getByRole("heading", { name: "Lavande" })).toBeFocused();
  await expect(picker).toContainText("Se débloque bientôt.");
  await expect(picker).toContainText(
    "Encore 2 pas de croissance : choix légers ou jours arrosés.",
  );
  await expect(
    picker.getByRole("complementary", { name: "Le savais-tu ?" }),
  ).toContainText("lavandin");
  await expect(
    picker.getByRole("button", { name: "Planter la lavande" }),
  ).toHaveCount(0);
  await expectNoAxeViolations(page);

  await page.keyboard.press("Escape");
  await expect(picker).toBeVisible();
  await expect(
    picker.getByRole("button", { name: "En savoir plus sur la lavande" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(picker).toBeHidden();
  expect((await journal(page)).at(-1)!.species).toBeUndefined();
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

  // La croix : même chose.
  await page.goto("/comparer?a=velo&b=voiture&q=30");
  await page.getByRole("button", { name: "Je choisis le vélo" }).click();
  await page
    .locator("[data-species-picker]")
    .getByRole("button", { name: "Fermer : le jardin choisira" })
    .click();
  await expect(page.locator("[data-species-picker]")).toBeHidden();
  await expect(
    page.getByRole("heading", { name: /va (pousser|sortir)/ }),
  ).toBeVisible();
  const entries = await journal(page);
  expect(entries).toHaveLength(3);
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
  ).toContainText("Dans 1 pas");
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
  test("« What would you like to plant? » : grid and species sheet in English", async ({
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
      picker.getByRole("button", { name: "Plant the oxeye daisy" }),
    ).toHaveAccessibleDescription("Flower · Perennial · Blooms in summer");
    await expect(picker.locator('[data-species="arbre-5"]')).toContainText(
      "In 11 steps",
    );
    await expectNoAxeViolations(page);

    await picker
      .getByRole("button", { name: "More about the olive tree" })
      .click();
    await expect(
      picker.getByRole("heading", { name: "Olive tree" }),
    ).toBeFocused();
    const fact = picker.getByRole("complementary", { name: "Did you know?" });
    await expectDidYouKnow(fact);
    await expect(fact).toContainText("black ones are simply picked riper");
    await expect(picker.locator("[data-back-arrow]")).toHaveAccessibleName(
      "Back to all species",
    );
    await expect(picker.getByRole("button", { name: /^Close/ })).toHaveCount(0);
    await expectNoAxeViolations(page);
    await picker.locator("[data-back-arrow]").click();
    await expect(
      picker.getByRole("button", { name: "Plant the olive tree" }),
    ).toBeFocused();
    await expect(
      picker.getByRole("button", { name: "Close: the garden will choose" }),
    ).toHaveAttribute("title", "Close: the garden will choose");

    await picker.getByRole("button", { name: "Plant the oxeye daisy" }).click();
    await expect(picker).toBeHidden();
    expect((await journal(page)).at(-1)!.species).toBe("fleur-4");
  });
});
