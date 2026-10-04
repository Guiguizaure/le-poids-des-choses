import { expect, seedJournal, test } from "./fixtures";

const daysAgo = (days: number, hour = 12) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};
const entry = (
  id: string,
  days: number,
  gestureA: string,
  gestureB: string,
  avoidedKg: number,
) => ({
  id,
  date: daysAgo(days),
  gestureA,
  gestureB,
  quantity: 1,
  chosen: avoidedKg > 0 ? "b" : "a",
  avoidedKg,
});

// Titres affichés : « TGV plutôt qu’avion », « Repas végétarien plutôt que bœuf »…
const JOURNAL = [
  entry("e-tgv", 0, "avion", "tgv", 66.5),
  entry("e-vege", 1, "repas-boeuf", "repas-vegetarien", 4.12),
  entry("e-velo", 1, "voiture", "velo", 1.14),
  entry("e-avion", 2, "avion", "tgv", 0),
  {
    ...entry("e-jean", 9, "jean", "jean", 25.09),
    modeA: "neuf",
    modeB: "garder",
  },
];

test("carnet : graphique de la semaine, tri et filtres dans l'URL", async ({
  page,
}) => {
  await seedJournal(page, JOURNAL);
  await page.goto("/jardin");

  // Graphique de la semaine : 3 choix légers ces 7 derniers jours (le jean date de 9 jours).
  const chart = page.getByRole("region", {
    name: "Choix légers, 7 derniers jours",
  });
  await expect(chart).toContainText("3 choix légers cette semaine");
  await expect(chart.locator("rect[data-count]")).toHaveCount(2);
  // Alternative accessible : le tableau (masqué visuellement) donne chaque jour.
  const table = chart.getByRole("table", {
    name: "Choix légers par jour, sur les 7 derniers jours",
  });
  await expect(table.getByRole("row")).toHaveCount(8);
  await expect(table.getByRole("row", { name: /^Aujourd’hui/ })).toContainText(
    "1",
  );

  await page.getByRole("link", { name: "Tout voir" }).click();
  await expect(page).toHaveURL(/\/jardin\/carnet$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Carnet" }),
  ).toBeVisible();
  const titles = () =>
    page.locator("#choix-titre ~ ul li p:first-child").allTextContents();
  await expect(page.getByText("5 choix affichés")).toBeVisible();
  expect((await titles())[0]).toBe("TGV plutôt qu’avion");

  // Tri par écart.
  await page.getByLabel("Trier par").selectOption("ecart");
  await expect(page).toHaveURL(/\/jardin\/carnet\?tri=ecart$/);
  await expect
    .poll(titles)
    .toEqual([
      "TGV plutôt qu’avion",
      "Jean gardé plutôt que neuf",
      "Repas végétarien plutôt que bœuf",
      "Vélo plutôt que voiture thermique",
      "Avion plutôt que TGV",
    ]);

  // Filtres : transport, choix légers.
  await page.getByLabel("Catégorie").selectOption("transport");
  await page.getByLabel("Choix", { exact: true }).selectOption("legers");
  await expect(page).toHaveURL(
    /\/jardin\/carnet\?tri=ecart&categorie=transport&choix=legers$/,
  );
  await expect
    .poll(titles)
    .toEqual(["TGV plutôt qu’avion", "Vélo plutôt que voiture thermique"]);

  // Choix notés (plus lourds) seulement.
  await page.getByLabel("Choix", { exact: true }).selectOption("notes");
  await expect.poll(titles).toEqual(["Avion plutôt que TGV"]);

  // Le retour arrière restaure la vue précédente ; un lien partagé l'ouvre directement.
  await page.goBack();
  await expect(page).toHaveURL(/choix=legers$/);
  await expect.poll(titles).toHaveLength(2);
  await page.goto("/jardin/carnet?tri=categorie&choix=tous");
  await expect(page.getByLabel("Trier par")).toHaveValue("categorie");
});

test("carnet vide : état vide du graphique et du carnet", async ({ page }) => {
  await page.goto("/jardin/carnet");
  await expect(
    page.getByText("Aucun choix léger ces 7 derniers jours."),
  ).toBeVisible();
  await expect(page.getByText("Ton carnet est vide.")).toBeVisible();
});
