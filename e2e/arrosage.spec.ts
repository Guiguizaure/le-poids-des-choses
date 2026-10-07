// Refonte des habitudes : choix des habitudes avec la barre de confirmation, une icône par
// habitude, arrosage ciblé (l'arrosoir au-dessus d'une plante), « Arrosée aujourd'hui »
// jusqu'à minuit (heure de Paris), « Modifier mes habitudes », astuces de première utilisation.
import type { Page } from "@playwright/test";
import {
  entry,
  expect,
  expectNoAxeViolations,
  letGardenChoose,
  seedJournal,
  test,
} from "./fixtures";

test.use({ timezoneId: "Europe/Paris" });

type Stored = {
  id: string;
  kind?: string;
  gesture?: string;
  plant?: string | null;
};

const journal = (page: Page): Promise<Stored[]> =>
  page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("lpdc:journal:v1") ?? '{"entries":[]}')
        .entries,
  );

/** Habitudes déjà choisies sur l'appareil. */
const declare = (page: Page, gestures: string[]) =>
  page.addInitScript(
    (list) =>
      localStorage.setItem(
        "lpdc:habitudes:v1",
        JSON.stringify({ version: 1, gestures: list }),
      ),
    gestures,
  );

/** Astuces déjà vues (pour les tests qui ne les regardent pas). */
const hintsSeen = (page: Page) =>
  page.addInitScript(() =>
    localStorage.setItem(
      "lpdc:indices:v1",
      JSON.stringify({
        version: 1,
        seen: ["jardin-vide", "premiere-plante", "premier-arrosage"],
      }),
    ),
  );

const section = (page: Page, name = "Mes habitudes") =>
  page.getByRole("region", { name });

test("premier passage : liste à cases, barre « Valider » fixe, bouton de la page en place, puis les icônes", async ({
  page,
}) => {
  await hintsSeen(page);
  await seedJournal(page, [entry("p1", 4.1, 60 * 24 * 2)]);
  await page.goto("/jardin");
  const habits = section(page);
  await expect(
    habits.getByRole("group", { name: "Quelles habitudes tiens-tu déjà ?" }),
  ).toBeVisible();
  // Pastille arrosoir à côté du titre.
  await expect(habits.locator('[data-badge="arrosage"]')).toBeVisible();
  // Le bouton de la page (la barre fixe, quand elle est là, en porte un second).
  const confirm = habits.getByRole("button", { name: "Valider" }).first();
  await expect(confirm).toHaveAttribute("aria-disabled", "true");
  const bar = page.getByRole("region", { name: "Tes habitudes" });
  await expect(bar).toHaveCount(0);

  await habits.getByLabel("Je me déplace à vélo").check();
  await habits.getByLabel("Je mange végétarien").check();
  await expect(bar).toContainText("2 habitudes choisies");
  await expect(bar).toContainText("2 habitudes choisies : tu peux valider.");
  await expect(
    page.locator('[aria-live="polite"]').filter({ has: bar }),
  ).toHaveCount(1);
  await expect(confirm).not.toHaveAttribute("aria-disabled", "true");
  await expectNoAxeViolations(page);

  // Le bouton de la barre, comme celui de la page, valide.
  await bar.getByRole("button", { name: "Valider" }).click();
  await expect(bar).toHaveCount(0);
  await expect(
    habits.getByRole("heading", { name: "Mes habitudes" }),
  ).toBeFocused();
  await expect(
    habits.getByText(
      "Touche une habitude tenue aujourd’hui pour arroser une plante.",
    ),
  ).toBeVisible();
  const icons = habits.getByRole("list", { name: "Mes habitudes, à arroser" });
  await expect(icons.getByRole("button")).toHaveCount(2);
  await expect(
    icons.getByRole("button", { name: "À vélo : arroser une plante" }),
  ).toBeVisible();
  await expectNoAxeViolations(page);
});

test("arroser : l'arrosoir passe au-dessus de la plante visée, puis « Arrosée aujourd'hui »", async ({
  page,
}) => {
  await hintsSeen(page);
  await declare(page, ["velo", "marche"]);
  await seedJournal(page, [
    entry("p1", 4.1, 60 * 24 * 3),
    entry("p2", 4.1, 60 * 24 * 2),
  ]);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/jardin");
  const habits = section(page);
  await habits
    .getByRole("button", { name: "À vélo : arroser une plante" })
    .click();

  // La plante visée est enregistrée dans l'habitude ; l'arrosoir passe au-dessus d'elle.
  await expect.poll(async () => (await journal(page)).at(-1)?.plant).toBe("p1");
  const can = page.locator('[data-watering="p1"]');
  await expect(can).toBeAttached();
  const canBox = (await can.boundingBox())!;
  const plantBox = (await page.locator('[data-plant="p1"]').boundingBox())!;
  expect(canBox.y).toBeLessThan(plantBox.y + plantBox.height / 2);
  await expect(
    page.locator("p[role=status]").filter({ hasText: /^Tu as arrosé / }),
  ).toBeAttached();
  const done = habits.getByRole("button", {
    name: "À vélo : arrosée aujourd’hui",
  });
  await expect(done).toHaveAttribute("aria-disabled", "true");
  await expect(done).toContainText("Arrosée aujourd’hui");
  await expectNoAxeViolations(page);

  // Deuxième habitude le même jour : une autre plante.
  await habits
    .getByRole("button", { name: "À pied : arroser une plante" })
    .click();
  await expect.poll(async () => (await journal(page)).at(-1)?.plant).toBe("p2");
  // Plus aucune plante sans bonus aujourd'hui : rien de plus à viser.
  expect((await journal(page)).filter((e) => e.kind === "habit")).toHaveLength(
    2,
  );
});

test("mouvement réduit : pas d'arrosoir animé, le message et l'état restent", async ({
  page,
}) => {
  await hintsSeen(page);
  await declare(page, ["velo"]);
  await seedJournal(page, [entry("p1", 4.1, 60 * 24 * 3)]);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/jardin");
  await section(page)
    .getByRole("button", { name: "À vélo : arroser une plante" })
    .click();
  await expect(
    page.locator("p[role=status]").filter({ hasText: /^Tu as arrosé / }),
  ).toBeAttached();
  await expect(page.locator("[data-watering]")).toHaveCount(0);
  await expect(
    section(page).getByRole("button", { name: "À vélo : arrosée aujourd’hui" }),
  ).toBeVisible();
});

test("remise à zéro à minuit, heure de Paris", async ({ page }) => {
  await hintsSeen(page);
  await declare(page, ["velo"]);
  // 23 h 57 à Paris (heure d'été : UTC+2).
  const lateEvening = new Date("2026-07-10T21:57:00Z");
  await page.clock.install({ time: lateEvening });
  await seedJournal(page, [
    {
      id: "p1",
      date: "2026-07-08T10:00:00.000Z",
      gestureA: "voiture",
      gestureB: "velo",
      quantity: 10,
      chosen: "b",
      avoidedKg: 4.1,
    },
  ]);
  await page.goto("/jardin");
  const habits = section(page);
  await habits
    .getByRole("button", { name: "À vélo : arroser une plante" })
    .click();
  await expect(
    habits.getByRole("button", { name: "À vélo : arrosée aujourd’hui" }),
  ).toBeVisible();
  // Minuit passe : l'habitude se touche de nouveau.
  await page.clock.fastForward("05:00");
  await expect(
    habits.getByRole("button", { name: "À vélo : arroser une plante" }),
  ).toBeVisible();
});

test("« Modifier mes habitudes » : ajouter, retirer, la même barre ; « Annuler » ne change rien", async ({
  page,
}) => {
  await hintsSeen(page);
  await declare(page, ["velo"]);
  await page.goto("/jardin");
  const habits = section(page);
  await habits.getByRole("button", { name: "Modifier mes habitudes" }).click();
  await expect(habits.getByLabel("Je me déplace à vélo")).toBeChecked();
  const bar = page.getByRole("region", { name: "Tes habitudes" });
  await expect(bar).toContainText("1 habitude choisie");

  // Annuler : rien ne change.
  await habits.getByLabel("Je prends le bus").check();
  await habits.getByRole("button", { name: "Annuler" }).click();
  await expect(bar).toHaveCount(0);
  await expect(
    habits.getByRole("button", { name: "En bus : arroser une plante" }),
  ).toHaveCount(0);

  await habits.getByRole("button", { name: "Modifier mes habitudes" }).click();
  await habits.getByLabel("Je me déplace à vélo").uncheck();
  await habits.getByLabel("Je prends le bus").check();
  await bar.getByRole("button", { name: "Valider" }).click();
  const icons = habits.getByRole("list", { name: "Mes habitudes, à arroser" });
  await expect(icons.getByRole("button")).toHaveCount(1);
  await expect(
    icons.getByRole("button", { name: "En bus : arroser une plante" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("lpdc:habitudes:v1")),
  ).toBe('{"version":1,"gestures":["bus"]}');
});

test.describe("astuces de première utilisation", () => {
  test("jardin vide : une astuce annoncée, sans prendre le focus ; fermée, elle ne revient plus", async ({
    page,
  }) => {
    await page.goto("/jardin");
    const hint = page.locator('[data-hint="jardin-vide"]');
    await expect(hint).toContainText("Ton jardin est vide pour l’instant");
    await expect(
      page.locator('[role="status"]').filter({ has: hint }),
    ).toHaveCount(1);
    expect(
      await page.evaluate(() => document.activeElement === document.body),
    ).toBe(true);
    await expectNoAxeViolations(page);
    await hint.getByRole("button", { name: "Fermer l’astuce" }).click();
    await expect(hint).toHaveCount(0);
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Ton jardin t’attend" }),
    ).toBeVisible();
    await expect(page.locator('[data-hint="jardin-vide"]')).toHaveCount(0);
  });

  test("première plante : l'astuce dans la feuille des espèces, une seule fois", async ({
    page,
  }) => {
    await page.goto("/comparer?a=tgv&b=avion&q=300");
    await page.getByRole("button", { name: "Je choisis le TGV" }).click();
    const picker = page.locator("[data-species-picker]");
    await expect(picker.locator('[data-hint="premiere-plante"]')).toContainText(
      "Touche une espèce pour la planter.",
    );
    await letGardenChoose(page);
    // Même sans la fermer : la première plante est là, l'astuce ne revient plus.
    await page.goto("/comparer?a=velo&b=voiture&q=20");
    await page.getByRole("button", { name: "Je choisis le vélo" }).click();
    await expect(picker).toBeVisible();
    await expect(picker.locator('[data-hint="premiere-plante"]')).toHaveCount(
      0,
    );
  });

  test("premier arrosage : l'astuce sous les icônes, partie après le premier toucher", async ({
    page,
  }) => {
    await declare(page, ["velo"]);
    await seedJournal(page, [entry("p1", 4.1, 60 * 24 * 3)]);
    await page.goto("/jardin");
    const hint = page.locator('[data-hint="premier-arrosage"]');
    await expect(hint).toContainText(
      "Chaque habitude tenue arrose tout le jardin",
    );
    await section(page)
      .getByRole("button", { name: "À vélo : arroser une plante" })
      .click();
    await expect(hint).toHaveCount(0);
    await page.reload();
    await expect(
      section(page).getByRole("button", {
        name: "À vélo : arrosée aujourd’hui",
      }),
    ).toBeVisible();
    await expect(page.locator('[data-hint="premier-arrosage"]')).toHaveCount(0);
  });
});

test.describe("en anglais", () => {
  test("“My habits”: choose, confirm, water, “watered today”", async ({
    page,
  }) => {
    await hintsSeen(page);
    await seedJournal(page, [entry("p1", 4.1, 60 * 24 * 3)]);
    await page.goto("/en/garden");
    const habits = section(page, "My habits");
    await expect(
      habits.getByRole("group", { name: "Which habits do you already keep?" }),
    ).toBeVisible();
    await habits.getByLabel("I get around by bike").check();
    const bar = page.getByRole("region", { name: "Your habits" });
    await expect(bar).toContainText("1 habit selected");
    await expectNoAxeViolations(page);
    await bar.getByRole("button", { name: "Confirm" }).click();
    await expect(
      habits.getByText("Tap a habit you kept today to water a plant."),
    ).toBeVisible();
    await habits
      .getByRole("button", { name: "By bike: water a plant" })
      .click();
    await expect(
      page.locator("p[role=status]").filter({ hasText: /^You watered the / }),
    ).toBeAttached();
    await expect(
      habits.getByRole("button", { name: "By bike: watered today" }),
    ).toHaveAttribute("aria-disabled", "true");
    await expectNoAxeViolations(page);
  });

  test("tips are in English too", async ({ page }) => {
    await page.goto("/en/garden");
    await expect(page.locator('[data-hint="jardin-vide"]')).toContainText(
      "Your garden is empty for now",
    );
    await expect(
      page.getByRole("button", { name: "Close the tip" }),
    ).toBeVisible();
  });
});
