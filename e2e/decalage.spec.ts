import type { Page } from "@playwright/test";
import { entry, expect, seedJournal, test } from "./fixtures";

// Décalage de mise en page au chargement de Mon jardin (CLS) : le carnet n'est lu qu'après
// l'hydratation, rien de ce qui est déjà affiché ne doit bouger quand il arrive. API
// « layout-shift » : Chromium seulement.
test.skip(
  ({ browserName }) => browserName !== "chromium",
  "PerformanceObserver layout-shift : Chromium seulement",
);

const MAX_CLS = 0.1;

/** Somme des décalages sans geste de la personne (borne haute du CLS), et leurs sources. */
async function measureShifts(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __shifts: object[] };
    w.__shifts = [];
    new PerformanceObserver((list) => {
      for (const shift of list.getEntries() as unknown as {
        value: number;
        hadRecentInput: boolean;
        sources: { node: Node | null }[];
      }[]) {
        if (shift.hadRecentInput) continue;
        w.__shifts.push({
          value: shift.value,
          sources: shift.sources.map((source) =>
            (source.node?.textContent ?? "").slice(0, 40),
          ),
        });
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  return async () => {
    // Bloc dépendant du carnet monté, puis le temps que tout se pose.
    await expect(page.locator("[data-garden-season]")).toBeVisible();
    await page.waitForTimeout(1000);
    const shifts = await page.evaluate(
      () =>
        (
          window as unknown as {
            __shifts: { value: number; sources: string[] }[];
          }
        ).__shifts,
    );
    return {
      cls: shifts.reduce((sum, shift) => sum + shift.value, 0),
      shifts,
    };
  };
}

for (const path of ["/jardin", "/en/garden"]) {
  test(`${path} vide (première visite) : CLS ≤ ${MAX_CLS}`, async ({
    page,
  }) => {
    const done = await measureShifts(page);
    await page.goto(path);
    const { cls, shifts } = await done();
    expect(cls, JSON.stringify(shifts)).toBeLessThanOrEqual(MAX_CLS);
  });
}

test(`/jardin avec un carnet : CLS ≤ ${MAX_CLS}`, async ({ page }) => {
  await seedJournal(page, [
    entry("cls-1", 4.1, 3000),
    entry("cls-2", 0, 2000),
    entry("cls-3", 12, 60),
  ]);
  const done = await measureShifts(page);
  await page.goto("/jardin");
  await expect(page.getByText("3 choix notés")).toBeVisible();
  const { cls, shifts } = await done();
  expect(cls, JSON.stringify(shifts)).toBeLessThanOrEqual(MAX_CLS);
});

test(`/jardin sur mobile qui partage : « Exporter » et « Partager » n'agrandissent pas la barre`, async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      value: (data?: ShareData) => Boolean(data?.files?.length),
    });
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async () => {},
    });
  });
  await seedJournal(page, [entry("cls-1", 4.1)]);
  const done = await measureShifts(page);
  await page.goto("/jardin");
  await expect(
    page.getByRole("button", { name: "Partager", exact: true }),
  ).toBeVisible();
  const { cls, shifts } = await done();
  // Sans la marge négative des boutons, la barre grandit d'une dizaine de pixels : 0,007.
  expect(cls, JSON.stringify(shifts)).toBeLessThan(0.001);
});
