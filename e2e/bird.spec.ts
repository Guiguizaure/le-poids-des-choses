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

/** Attend `count` images de la page : sous charge, une image dure bien plus que 1/60 s. */
const frames = (page: Page, count: number) =>
  page.evaluate(
    (count) =>
      new Promise<void>((resolve) => {
        const step = () =>
          --count <= 0 ? resolve() : requestAnimationFrame(step);
        requestAnimationFrame(step);
      }),
    count,
  );

type FlightLog = {
  /** Phases successives (`data-flight`), « posé » quand il revient à sa place. */
  phases: string[];
  /** Phases où le dessin en vol (oiseau-vol, ailes avant et arrière) était affiché. */
  winged: string[];
  /** Chaque fois que la zone de toucher est replacée pendant la boucle : son centre et son
   *  écart avec le centre du dessin, lus dans l'état exact où elle vient d'être posée. */
  placed: { center: number; gap: number }[];
};

/**
 * Relève l'envol dans la page même. Interroger depuis le test ne suffit pas : sous charge, la
 * boucle peut passer entière entre deux interrogations, et la zone de toucher, replacée une
 * image sur trois (images longues), a alors des dizaines de pixels de retard à un instant
 * quelconque. Ici, chaque phase est notée quand elle change, et la zone est mesurée au moment
 * où elle est replacée (l'observateur passe juste après, avant tout autre rappel d'image).
 */
const recordFlight = (page: Page) =>
  page.evaluate(() => {
    const log: FlightLog = { phases: [], winged: [], placed: [] };
    (window as unknown as { __flight: FlightLog }).__flight = log;
    const centerX = (rects: DOMRect[]) =>
      (Math.min(...rects.map((r) => r.left)) +
        Math.max(...rects.map((r) => r.right))) /
      2;
    new MutationObserver(() => {
      const flying = document.querySelector<HTMLElement>(
        '[data-animal="bird"] [data-flight]',
      );
      const phase = flying?.dataset.flight ?? "posé";
      if (log.phases.at(-1) === phase) return;
      log.phases.push(phase);
      if (flying?.querySelector('[data-part="aile-avant"]'))
        log.winged.push(phase);
    }).observe(document.body, {
      subtree: true,
      attributeFilter: ["data-flight"],
    });
    const zone = document.querySelector<HTMLElement>('[data-talk="bird"]')!;
    new MutationObserver(() => {
      if (log.phases.at(-1) !== "boucle") return;
      const drawn = Array.from(
        document.querySelectorAll('[data-animal="bird"] svg'),
        (svg) => svg.getBoundingClientRect(),
      ).filter((rect) => rect.width > 0);
      const center = centerX([zone.getBoundingClientRect()]);
      log.placed.push({ center, gap: Math.abs(center - centerX(drawn)) });
    }).observe(zone, { attributeFilter: ["style"] });
  });

const flightLog = (page: Page) =>
  page.evaluate(() => (window as unknown as { __flight: FlightLog }).__flight);

test("toucher l'oiseau ouvre la conversation sans envol ; fermée, il s'envole et revient se poser", async ({
  page,
}) => {
  await seedJournal(page, FIVE);
  await page.goto("/jardin");
  const button = zone(page, "bird", TALK.name);
  await button.click();
  const dialog = page.getByRole("dialog", { name: "Oiseau" });
  await expect(dialog).toBeVisible();
  // Pendant la conversation (une seconde d'images, même lentes) : il reste posé.
  await recordFlight(page);
  await frames(page, 60);
  expect((await flightLog(page)).phases).toEqual([]);

  await dialog.getByRole("button", { name: "Fermer la conversation" }).click();
  await expect(dialog).toBeHidden();
  // Il s'envole, boucle, revient se poser ; en vol, le dessin passe à oiseau-vol.
  await expect
    .poll(async () => (await flightLog(page)).phases, { timeout: 10_000 })
    .toEqual(["depart", "boucle", "retour", "posé"]);
  const log = await flightLog(page);
  expect(log.winged).toEqual(["depart", "boucle", "retour"]);
  // La zone de toucher le suit pendant la boucle : replacée plusieurs fois, à chaque fois
  // centrée sur son dessin.
  expect(log.placed.length).toBeGreaterThanOrEqual(3);
  for (const { gap } of log.placed) expect(gap).toBeLessThan(1);
  const centers = log.placed.map((placed) => placed.center);
  expect(Math.max(...centers) - Math.min(...centers)).toBeGreaterThan(20);

  // Revenu à sa place, sur oiseau.svg.
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
