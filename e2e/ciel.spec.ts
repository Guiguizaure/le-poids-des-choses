import { expect, seedJournal, test } from "./fixtures";

const light = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: `ciel-${i}`,
    date: new Date(Date.now() - (count - i) * 60_000).toISOString(),
    gestureA: "voiture",
    gestureB: "velo",
    quantity: 3,
    chosen: "b",
    avoidedKg: 0.43,
  }));

test("ciel : débloqué à 15 choix légers, choisi et gardé sur l'appareil", async ({
  page,
}) => {
  await seedJournal(page, light(15));
  await page.goto("/jardin");
  const scene = page.getByRole("img", { name: /^Jardin :/ });
  await expect(scene).toHaveAttribute("data-sky", "jour");

  const group = page.getByRole("group", { name: "Ciel du jardin" });
  await expect(group.getByRole("radio", { name: /Aube rose/ })).toBeEnabled();
  await expect(
    group.getByRole("radio", { name: /Midi soleil/ }),
  ).toBeDisabled();
  await expect(group).toContainText("Encore 15 choix légers");
  await expect(group).toContainText("Encore 35 choix légers");

  await page.locator("label").filter({ hasText: "Aube rose" }).click();
  await expect(scene).toHaveAttribute("data-sky", "aube");
  expect(await page.evaluate(() => localStorage.getItem("lpdc:ciel:v1"))).toBe(
    '{"version":1,"sky":"aube"}',
  );

  await page.reload();
  await expect(scene).toHaveAttribute("data-sky", "aube");
  await expect(group.getByRole("radio", { name: /Aube rose/ })).toBeChecked();
});

test("ciel : un ciel encore verrouillé n'est jamais appliqué", async ({
  page,
}) => {
  await seedJournal(page, light(14));
  await page.addInitScript(() =>
    localStorage.setItem("lpdc:ciel:v1", '{"version":1,"sky":"nuit"}'),
  );
  await page.goto("/jardin");
  await expect(page.getByRole("img", { name: /^Jardin :/ })).toHaveAttribute(
    "data-sky",
    "jour",
  );
  await expect(page.getByRole("radio", { name: /Aube rose/ })).toBeDisabled();
});
