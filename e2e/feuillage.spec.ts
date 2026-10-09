// Le jardin au fil des saisons : les caducs (pommier, cerisier, figuier) prennent leur dégradé
// d'automne et dorment l'hiver (branches nues, bourgeons) ; les persistants ne changent pas.
// Toucher un arbre endormi dit qu'il dort jusqu'au printemps ; une astuce par saison ; bloc
// « Au fil des saisons » dans la fiche d'espèce ; astuce du premier choix d'espèce.
import type { Page } from "@playwright/test";
import {
  entry,
  expect,
  expectNoAxeViolations,
  seedJournal,
  test,
} from "./fixtures";

test.use({ timezoneId: "Europe/Paris" });

// Midi à Paris : le jour.
const AUTUMN = Date.UTC(2026, 9, 15, 10);
const WINTER = Date.UTC(2027, 0, 15, 11);
const SUMMER = Date.UTC(2027, 6, 15, 10);
const DAY = 24 * 60 * 60_000;

/** Grands arbres choisis : deux pommiers, un cerisier, un olivier. */
function trees(now: number) {
  return [
    ["pommier-1", "arbre-1"],
    ["cerisier", "arbre-3"],
    ["olivier", "arbre-4"],
    ["pommier-2", "arbre-1"],
  ].map(([id, species], i) => ({
    id,
    date: new Date(now - (4 - i) * DAY).toISOString(),
    gestureA: "avion",
    gestureB: "tgv",
    quantity: 300,
    chosen: "b",
    avoidedKg: 40,
    species,
  }));
}

const plant = (page: Page, id: string) => page.locator(`[data-plant="${id}"]`);
/** Remplissage calculé de la première forme du feuillage affiché. */
const foliageFill = (page: Page, id: string) =>
  plant(page, id)
    .locator('[data-stage="grand"] [data-part="feuillage"] > *')
    .first()
    .evaluate((shape) => getComputedStyle(shape).fill);

test("automne : un dégradé par caduc, les persistants inchangés ; astuce de saison une seule fois", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date(AUTUMN));
  await seedJournal(page, trees(AUTUMN));
  await page.goto("/jardin");
  await expect(page.getByRole("img", { name: /en automne/ })).toBeVisible();

  // Pommier : dégradé jaune → brun, créé par le code (aucun id dans les dessins).
  await expect.poll(() => foliageFill(page, "pommier-1")).toMatch(/^url\(/);
  const stops = await plant(page, "pommier-1")
    .locator("linearGradient")
    .first()
    .locator("stop")
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("stop-color")));
  expect(stops).toEqual(["#F2B73A", "#9A5B2B"]);
  // Olivier : le dessin tel quel ; aucune branche nue nulle part.
  expect(await foliageFill(page, "olivier")).not.toMatch(/^url\(/);
  await expect(page.locator("[data-bare]")).toHaveCount(0);
  // Aucun arbre à toucher : ils sont réveillés.
  await expect(page.locator("[data-sleeping-tree]")).toHaveCount(0);

  const hint = page.locator('[data-hint="saison-automne-2026"]');
  await expect(hint).toHaveText(
    /L’automne est là : tes pommiers et ton cerisier se colorent\. L’olivier, lui, ne change pas\./,
  );
  await expectNoAxeViolations(page);
  await hint.getByRole("button", { name: "Fermer l’astuce" }).click();
  await expect(hint).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("img", { name: /en automne/ })).toBeVisible();
  await expect(page.locator("[data-hint^='saison-']")).toHaveCount(0);
});

test("hiver : les caducs dorment (branches nues, bourgeons) ; les toucher dit qu'ils dorment jusqu'au printemps", async ({
  page,
}) => {
  await page.clock.setFixedTime(new Date(WINTER));
  await seedJournal(page, trees(WINTER));
  await page.goto("/jardin");
  await expect(page.getByRole("img", { name: /en hiver/ })).toBeVisible();

  const apple = plant(page, "pommier-1");
  await expect(apple.locator('[data-stage="grand"] [data-bare]')).toBeVisible();
  await expect(
    apple.locator('[data-stage="grand"] [data-part="feuillage"]'),
  ).toHaveCSS("visibility", "hidden");
  await expect(
    apple.locator('[data-stage="grand"] [data-bare] circle'),
  ).toHaveCount(9);
  await expect(plant(page, "olivier").locator("[data-bare]")).toHaveCount(0);

  await expect(page.locator('[data-hint="saison-hiver-2027"]')).toHaveText(
    /C’est l’hiver : tes pommiers et ton cerisier se sont endormis\. Ils se réveilleront au printemps\./,
  );

  // Un arrêt du clavier par espèce (le second pommier reste touchable, sans doublon).
  const sleeping = page.getByRole("button", { name: "Pommier endormi" });
  await expect(sleeping).toHaveCount(1);
  await expect(page.locator("[data-sleeping-tree]")).toHaveCount(3);
  await expect(
    page.getByRole("button", { name: "Cerisier endormi" }),
  ).toBeVisible();
  const box = await sleeping.boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
  await sleeping.click();
  await expect(page.locator("[data-tree-note]")).toHaveText(
    "Le pommier dort jusqu’au printemps.",
  );
  await expect(
    page.getByRole("status").filter({ hasText: "Le pommier dort" }),
  ).toHaveText("Le pommier dort jusqu’au printemps.");
  await expectNoAxeViolations(page);
});

test("hiver, en anglais : astuce et arbre endormi", async ({ page }) => {
  await page.clock.setFixedTime(new Date(WINTER));
  await seedJournal(page, trees(WINTER).slice(0, 1));
  await page.goto("/en/garden");
  await expect(page.locator('[data-hint="saison-hiver-2027"]')).toHaveText(
    /It’s winter: your apple tree has fallen asleep\. It will wake up in spring\./,
  );
  await page.getByRole("button", { name: "Apple tree, asleep" }).click();
  await expect(page.locator("[data-tree-note]")).toHaveText(
    "The apple tree is asleep until spring.",
  );
  await expectNoAxeViolations(page);
});

test("été : rien ne change, aucune astuce de saison", async ({ page }) => {
  await page.clock.setFixedTime(new Date(SUMMER));
  await seedJournal(page, trees(SUMMER));
  await page.goto("/jardin");
  await expect(page.getByRole("img", { name: /en été/ })).toBeVisible();
  expect(await foliageFill(page, "pommier-1")).not.toMatch(/^url\(/);
  await expect(page.locator("[data-bare]")).toHaveCount(0);
  await expect(page.locator("[data-hint^='saison-']")).toHaveCount(0);
});

test("sans arbre caduc : pas d'astuce de saison", async ({ page }) => {
  await page.clock.setFixedTime(new Date(AUTUMN));
  await seedJournal(page, trees(AUTUMN).slice(2, 3));
  await page.goto("/jardin");
  await expect(page.getByRole("img", { name: /en automne/ })).toBeVisible();
  await expect(plant(page, "olivier")).toBeVisible();
  await expect(page.locator("[data-hint^='saison-']")).toHaveCount(0);
});

test("premier choix d'espèce : astuce des saisons, une seule fois ; fiche « Au fil des saisons »", async ({
  page,
}) => {
  await page.goto("/comparer?a=tgv&b=avion&q=300");
  await page.getByRole("button", { name: "Je choisis le TGV" }).click();
  const picker = page.locator("[data-species-picker]");
  const hint = picker.locator('[data-hint="saisons-especes"]');
  await expect(hint).toContainText(
    "Chaque espèce vit au rythme des vraies saisons : certaines se colorent en automne et dorment l’hiver, d’autres gardent leur feuillage toute l’année. Tu retrouves tout ça dans la fiche de chaque espèce.",
  );
  // Annoncée sans prendre le focus ; fermable au clavier.
  await expect(
    picker.getByRole("heading", { name: "Que veux-tu planter ?" }),
  ).toBeFocused();
  await expect(hint.locator("..")).toHaveAttribute("aria-live", "polite");

  // Fiche d'un caduc : quatre mini-arbres décoratifs, la phrase porte l'information.
  await picker
    .getByRole("button", { name: "En savoir plus sur le pommier" })
    .click();
  const strip = picker.locator('[data-seasons-strip="arbre-1"]');
  await expect(
    strip.getByRole("heading", { name: "Au fil des saisons" }),
  ).toBeVisible();
  await expect(strip.locator("li")).toHaveCount(4);
  await expect(strip.locator("ul")).toHaveAttribute("aria-hidden", "true");
  await expect(
    strip.locator('[data-season="hiver"] [data-stage="grand"] [data-bare]'),
  ).toBeVisible();
  await expect(strip).toContainText(
    "Le pommier perd ses feuilles et dort en hiver. Il se réveillera au printemps.",
  );
  await expectNoAxeViolations(page);
  // Fiche d'un persistant.
  await picker.locator("[data-back-arrow]").click();
  await picker
    .getByRole("button", { name: "En savoir plus sur le citronnier" })
    .click();
  await expect(picker.locator('[data-seasons-strip="arbre-2"]')).toContainText(
    "Le citronnier garde ses feuilles toute l’année, même en hiver.",
  );
  await expect(picker.locator("[data-bare]")).toHaveCount(0);
  await picker.locator("[data-back-arrow]").click();

  // Fermée d'un geste, elle ne revient plus.
  await hint.getByRole("button", { name: "Fermer l’astuce" }).focus();
  await page.keyboard.press("Enter");
  await expect(hint).toHaveCount(0);
  await picker
    .getByRole("button", { name: "Laisse le jardin choisir" })
    .click();
  await page.goto("/comparer?a=velo&b=voiture&q=20");
  await page.getByRole("button", { name: "Je choisis le vélo" }).click();
  await expect(picker).toBeVisible();
  await expect(picker.locator('[data-hint="saisons-especes"]')).toHaveCount(0);
});

test("fiche d'une fleur : pas de bloc des saisons", async ({ page }) => {
  await seedJournal(page, [entry("ancien", 30, 60 * 24)]);
  await page.goto("/comparer?a=tgv&b=avion&q=300");
  await page.getByRole("button", { name: "Je choisis le TGV" }).click();
  const picker = page.locator("[data-species-picker]");
  await picker
    .getByRole("button", { name: "En savoir plus sur la tulipe" })
    .click();
  await expect(picker.getByRole("heading", { name: "Tulipe" })).toBeFocused();
  await expect(picker.locator("[data-seasons-strip]")).toHaveCount(0);
});
