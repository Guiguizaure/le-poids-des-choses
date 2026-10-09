// « Tenir une habitude » et jardin des saisons : une habitude se note sans comparaison, ne
// compte aucun kg et arrose le jardin ; la saison suit la date (heure de Paris).
import type { Page } from "@playwright/test";
import {
  expect,
  expectNoAxeViolations,
  seedJournal,
  tabTo,
  test,
  waitForHydration,
} from "./fixtures";

const DAY = 24 * 60 * 60 * 1000;

type Stored = {
  kind?: string;
  gesture?: string;
  avoidedKg?: number;
  plant?: string | null;
}[];

async function journal(page: Page): Promise<Stored> {
  return page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("lpdc:journal:v1") ?? '{"entries":[]}')
        .entries,
  );
}

/** Un choix léger (5 kg : jeune arbre ou fleur fleurie), il y a `daysAgo` jours. */
const choice = (id: string, now: number, daysAgo: number) => ({
  id,
  date: new Date(now - daysAgo * DAY).toISOString(),
  gestureA: "voiture",
  gestureB: "velo",
  quantity: 25,
  chosen: "b",
  avoidedKg: 5,
});
const habit = (id: string, now: number, daysAgo: number) => ({
  kind: "habit",
  id,
  date: new Date(now - daysAgo * DAY).toISOString(),
  gesture: "repas-vegetarien",
});

/** Stade + épanouissement de chaque plante, lus sur la scène. */
async function progress(page: Page): Promise<number[]> {
  return page
    .locator("[data-plant]")
    .evaluateAll((plants) =>
      plants.map(
        (plant) =>
          Number((plant as HTMLElement).dataset.stageLevel) +
          Number((plant as HTMLElement).dataset.bloomLevel),
      ),
    );
}

test("noter une habitude depuis /comparer : aucun kg, le jardin est arrosé", async ({
  page,
}) => {
  await page.goto("/comparer");
  await page.getByRole("button", { name: /^Noter une habitude/ }).click();
  await expect(page).toHaveURL(/\/comparer\?habitude=$/);
  const title = page.getByRole("heading", {
    level: 1,
    name: "Noter une habitude",
  });
  await expect(title).toBeFocused();
  await expect(
    page.getByText(/ne compte aucun kg : elle arrose/),
  ).toBeVisible();

  const confirm = page.getByRole("button", {
    name: "Je l’ai fait aujourd’hui",
  });
  await expect(confirm).toBeDisabled();
  await page.getByRole("button", { name: /Repas végétarien/ }).click();
  await expect(page).toHaveURL(/habitude=repas-vegetarien/);
  await expect(
    page.getByRole("button", { name: /Repas végétarien/ }),
  ).toHaveAttribute("aria-pressed", "true");
  await expectNoAxeViolations(page);
  await confirm.click();

  await expect(page.getByText("Habitude tenue", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "Repas végétarien : c’est noté dans ton carnet, sans aucun kg.",
    ),
  ).toBeVisible();
  // Jardin vide : rien ne pousse, invitation à comparer.
  await expect(
    page.getByRole("status").filter({ hasText: "première pousse" }),
  ).toBeVisible();
  await expect(page.getByText(/kg d’écart/)).toHaveCount(0);
  // La carte s'est posée (fondu terminé) avant de mesurer les contrastes.
  await expect(
    page.locator('section[aria-labelledby="resultat-titre"]'),
  ).toHaveCSS("opacity", "1");
  await expectNoAxeViolations(page);

  const entries = await journal(page);
  expect(entries).toHaveLength(1);
  expect(entries[0]).toMatchObject({
    kind: "habit",
    gesture: "repas-vegetarien",
  });
  expect(entries[0]).not.toHaveProperty("avoidedKg");

  await page.getByRole("link", { name: "Voir mon jardin" }).click();
  await expect(page).toHaveURL(/\/jardin\?arrose=/);
  const row = page.locator("#carnet-entrees li").first();
  await expect(row).toContainText("Repas végétarien");
  await expect(row).toContainText("habitude");
  await expect(row).toContainText("arrosé");
  // Aucun kg : le bilan reste à zéro, aucun choix compté.
  await expect(page.getByLabel("Bilan")).toContainText("0 choix noté");
  await expect(page.getByLabel("Bilan")).toContainText("1 jour arrosé");
});

test("/jardin : choisir mes habitudes, arroser d'un toucher, une plante avance", async ({
  page,
}) => {
  const now = Date.now();
  // Plantée il y a 4 jours, arrosée il y a 2 et 1 jours (anciennes habitudes, règle de base).
  await seedJournal(page, [
    choice("plante", now, 4),
    habit("arrose-1", now, 2),
    habit("arrose-2", now, 1),
  ]);
  await page.goto("/jardin");
  const section = page.getByRole("region", { name: "Mes habitudes" });
  await expect(section).toBeVisible();
  expect(await progress(page)).toEqual([1]);

  // Premier passage : la liste à cases, confirmée par la barre fixe.
  await section.getByLabel("Je me déplace à vélo").check();
  const bar = page.getByRole("region", { name: "Tes habitudes" });
  await expect(bar).toContainText("1 habitude choisie");
  await expectNoAxeViolations(page);
  await bar.getByRole("button", { name: "Valider" }).click();
  expect(
    await page.evaluate(() => localStorage.getItem("lpdc:habitudes:v1")),
  ).toBe('{"version":1,"gestures":["velo"]}');
  await expect(bar).toHaveCount(0);

  // Toucher l'icône : jour arrosé (toutes les plantes) + arrosage bonus (cette plante).
  const velo = section.getByRole("button", {
    name: "À vélo : arroser une plante",
  });
  await velo.click();
  await expect(
    page.locator("p[role=status]").filter({ hasText: /^Tu as arrosé / }),
  ).toBeAttached();
  await expect.poll(() => progress(page)).toEqual([2]);
  // Une habitude ne se compte pas comme un choix « retrouvé ».
  await expect(page.getByText(/Ton jardin est de retour/)).toHaveCount(0);

  // Arrosée aujourd'hui : grisée, désactivée jusqu'à minuit.
  const done = section.getByRole("button", {
    name: "À vélo : arrosée aujourd’hui",
  });
  await expect(done).toHaveAttribute("aria-disabled", "true");
  // Toucher quand même : rien de plus n'est noté.
  await done.click({ force: true });
  const habits = (await journal(page)).filter((e) => e.kind === "habit");
  expect(habits).toHaveLength(3);
  expect(habits.at(-1)).toMatchObject({ gesture: "velo", plant: "plante" });
  expect(await progress(page)).toEqual([2]);

  // Carnet : filtre « Habitudes tenues ».
  await page.goto("/jardin/carnet?choix=habitudes");
  await expect(page.getByText("3 choix affichés")).toBeVisible();
});

test("/comparer : une habitude déclarée se propose sans comparaison", async ({
  page,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "lpdc:habitudes:v1",
      '{"version":1,"gestures":["velo"]}',
    ),
  );
  await page.goto("/comparer");
  await page.getByRole("button", { name: /^Vélo/ }).click();
  await page
    .getByRole("button", {
      name: "C’est une de tes habitudes : la noter sans comparer",
    })
    .click();
  await expect(page).toHaveURL(/habitude=velo/);
  const velo = page.getByRole("button", { name: /À vélo/ });
  await expect(velo).toHaveAttribute("aria-pressed", "true");
  await expect(velo).toContainText("Mon habitude");
  await expect(
    page.getByRole("button", { name: "Je l’ai fait aujourd’hui" }),
  ).toBeEnabled();
});

test("lien d'habitude invalide : retour au choix des gestes", async ({
  page,
}) => {
  await page.goto("/comparer?habitude=avion");
  await expect(page).toHaveURL(/lien=invalide/);
});

test("au clavier : choisir une habitude et la noter", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName === "webkit",
    "WebKit ne parcourt pas les liens avec Tab",
  );
  await page.goto("/comparer?habitude=");
  await waitForHydration(page.getByRole("button", { name: "Eau du robinet" }));
  await tabTo(page, "Eau du robinet");
  await page.keyboard.press("Enter");
  await tabTo(page, "Je l’ai fait aujourd’hui");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { level: 1, name: "Ton jardin est arrosé" }),
  ).toBeFocused();
});

test.describe("saisons", () => {
  // Heures fixées à midi, à Paris : le jour (la nuit commence à 21 h).
  test.use({ timezoneId: "Europe/Paris" });
  const WINTER = Date.UTC(2027, 0, 15, 11);
  const SPRING = Date.UTC(2027, 3, 15, 10);

  test("hiver : neige, flocons, caducs endormis, épanouissement des caducs endormi", async ({
    page,
  }) => {
    await page.clock.setFixedTime(new Date(WINTER));
    // Plusieurs plantes arrosées au-delà de l'âge adulte.
    const entries = [
      ...Array.from({ length: 6 }, (_, i) => choice(`p${i}`, WINTER, 30 + i)),
      ...Array.from({ length: 15 }, (_, i) => habit(`h${i}`, WINTER, i + 1)),
    ];
    await seedJournal(page, entries);
    await page.goto("/jardin");
    const scene = page.getByRole("img", { name: /^Jardin :.*en hiver/ });
    await expect(scene).toHaveAttribute("data-season", "hiver");
    await expect(scene.locator('[data-season-layer="neige"]')).toBeAttached();
    await expect(scene.locator('[data-season-layer="hiver"]')).toBeAttached();
    // Chaque plante épanouie garde son niveau ; aucun groupe affiché pour un caduc l'hiver.
    const blooms = await scene
      .locator("[data-bloom]")
      .evaluateAll((layers) =>
        layers.map((layer) => (layer as HTMLElement).dataset.bloom),
      );
    expect(blooms.length).toBe(6);
    const levels = await page
      .locator("[data-plant]")
      .evaluateAll((plants) =>
        plants.map((p) => Number((p as HTMLElement).dataset.bloomLevel)),
      );
    expect(levels.every((level) => level > 0)).toBe(true);
    await expectNoAxeViolations(page);
  });

  test("printemps : des pétales tombent ; rien ne bouge en mouvement réduit", async ({
    page,
  }) => {
    await page.clock.setFixedTime(new Date(SPRING));
    await seedJournal(page, [choice("p", SPRING, 1)]);
    await page.goto("/jardin");
    const scene = page.getByRole("img", { name: /au printemps/ });
    await expect(scene).toHaveAttribute("data-season", "printemps");
    const petal = scene.locator("[data-particle]").first();
    await expect(petal).toBeVisible();

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(scene.locator("[data-particle]").first()).toBeHidden();
  });
});
