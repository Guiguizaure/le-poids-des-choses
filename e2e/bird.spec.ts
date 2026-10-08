import type { Page } from "@playwright/test";
import { entry, expect, seedJournal, test } from "./fixtures";

/** Zone de toucher d'un animal dans la scène (la liste a un bouton du même nom). */
function zone(page: Page, talker: string, name: string) {
  return page.locator(`[data-talk="${talker}"][aria-label="${name}"]`);
}

// Cinq choix légers : l'oiseau est installé dans le jardin. Le toucher ouvre sa conversation
// (« Les animaux parlent ») ; il ne s'envole plus au toucher, mais quand la conversation se
// ferme (et de temps en temps, tout seul).
const FIVE = Array.from({ length: 5 }, (_, i) =>
  entry(`oiseau-${i}`, 4.1, 10 + i),
);
const TALK = { name: "Parler à l’oiseau" };

test("toucher l'oiseau ouvre la conversation sans envol ; fermée, il s'envole et revient se poser", async ({
  page,
}) => {
  await seedJournal(page, FIVE);
  await page.goto("/jardin");
  const button = zone(page, "bird", TALK.name);
  await button.click();
  const dialog = page.getByRole("dialog", { name: "Oiseau" });
  await expect(dialog).toBeVisible();
  // Pendant la conversation : il reste posé.
  await page.waitForTimeout(1200);
  await expect(page.locator("[data-flight]")).toHaveCount(0);

  await dialog.getByRole("button", { name: "Fermer la conversation" }).click();
  await expect(dialog).toBeHidden();
  const bird = page.locator("[data-flight]");
  await expect(bird).toHaveAttribute("data-flight", "boucle", {
    timeout: 6000,
  });
  // En vol : le dessin passe à oiseau-vol (ailes avant et arrière).
  await expect(bird.locator('[data-part="aile-avant"]')).toHaveCount(1);
  // La zone de toucher suit l'oiseau en vol : centrée sur son dessin (mesures dans la même
  // image ; la zone est recalculée une image sur trois : quelques pixels de retard au plus).
  const gap = await page.evaluate(() => {
    const zone = document.querySelector('[data-talk="bird"]')!;
    const drawn = document.querySelector("[data-flight] svg")!;
    const a = zone.getBoundingClientRect();
    const b = drawn.getBoundingClientRect();
    return Math.abs(a.x + a.width / 2 - (b.x + b.width / 2));
  });
  expect(gap).toBeLessThan(20);

  // Retour à sa place, sur oiseau.svg.
  await expect(bird).toHaveCount(0, { timeout: 10_000 });
  await expect(page.locator('[data-part="aile-avant"]')).toHaveCount(0);
});

test("au clavier : zone accessible avec un focus visible, Entrée ouvre la conversation", async ({
  page,
  browserName,
}) => {
  test.skip(
    browserName === "webkit",
    "WebKit ne parcourt pas les boutons avec Tab par défaut",
  );
  await seedJournal(page, FIVE);
  await page.goto("/jardin");
  const button = zone(page, "bird", TALK.name);
  await button.focus();
  await expect(button).toBeFocused();
  const outline = await button.evaluate(
    (element) => getComputedStyle(element).outlineStyle,
  );
  expect(outline).not.toBe("none");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "Oiseau" })).toBeVisible();
});

test("jardin endormi : l'oiseau dort, et ne s'envole pas après la conversation", async ({
  page,
}) => {
  // Dernier choix il y a plus de 21 jours.
  const old = FIVE.map((e, i) => entry(e.id, 4.1, 22 * 24 * 60 + i));
  await seedJournal(page, old);
  await page.goto("/jardin");
  await expect(
    page.getByRole("img", { name: /assoupi sous la brume/ }),
  ).toBeVisible();
  const button = zone(page, "bird", "Parler à l’oiseau, qui dort");
  await expect(button.locator("[data-zzz]")).toBeVisible();
  await button.click();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1500);
  await expect(page.locator("[data-flight]")).toHaveCount(0);
});

test.describe("animations réduites", () => {
  test.use({ reducedMotion: "reduce" });

  test("l'oiseau reste posé, même après une conversation", async ({ page }) => {
    await seedJournal(page, FIVE);
    await page.goto("/jardin");
    await expect(
      page.getByRole("img", { name: "Jardin : 5 plantes, 3 animaux" }),
    ).toBeVisible();
    await zone(page, "bird", TALK.name).click();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(1500);
    await expect(page.locator("[data-flight]")).toHaveCount(0);
  });
});
