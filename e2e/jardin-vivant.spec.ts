// Jardin vivant : visiteurs de saison et de la nuit, animaux débloqués selon la saison et
// l'heure (jamais perdus), ciel qui suit l'heure (Nuit encre de 21 h à 6 h).
import type { Page } from "@playwright/test";
import { expect, expectNoAxeViolations, seedJournal, test } from "./fixtures";

test.use({ timezoneId: "Europe/Paris" });

const MINUTE = 60_000;

/** Vingt choix légers (tous les animaux), dont des grands arbres (écart > 20 kg). */
function journal(now: number) {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `vivant-${i}`,
    date: new Date(now - (20 - i) * MINUTE).toISOString(),
    gestureA: "avion",
    gestureB: "tgv",
    quantity: 300,
    chosen: "b",
    avoidedKg: i % 3 === 0 ? 40 : 4,
  }));
}

const scene = (page: Page) => page.getByRole("img", { name: /^Jardin :/ });
const shown = (page: Page, attr: "animal" | "visitor") =>
  scene(page)
    .locator(`[data-${attr}]`)
    .evaluateAll(
      (nodes, name) =>
        nodes.map(
          (node) =>
            (node as HTMLElement).dataset[name as "animal"] +
            ((node as HTMLElement).dataset.asleep !== undefined
              ? " (endormi)"
              : ""),
        ),
      attr,
    );

test("la nuit : Nuit encre, lune à cratères, étoiles ; papillon et abeille partis, hérisson éveillé", async ({
  page,
}) => {
  // 22 h 30 à Paris, en automne.
  const now = Date.UTC(2026, 9, 15, 20, 30);
  await page.clock.setFixedTime(new Date(now));
  await seedJournal(page, journal(now));
  await page.addInitScript(() =>
    localStorage.setItem("lpdc:ciel:v1", '{"version":1,"sky":"aube"}'),
  );
  await page.goto("/jardin");
  await expect(scene(page)).toHaveAttribute("data-sky", "nuit");
  await expect(scene(page)).toHaveAccessibleName(/en automne, la nuit$/);
  await expect(scene(page)).toHaveAttribute("data-night", "");
  await expect(scene(page).locator('[data-part="crateres"]')).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(scene(page).locator("[data-stars]")).toHaveCSS("opacity", "0.6");

  const animals = await shown(page, "animal");
  expect(animals).not.toContain("butterfly");
  expect(animals).not.toContain("bee");
  expect(animals).toContain("bird (endormi)");
  expect(animals).toContain("hedgehog");
  const visitors = await shown(page, "visitor");
  expect(visitors).toContain("renard");
  expect(visitors).toContain("hibou");
  expect(visitors).toContain("ecureuil");
  // Pas d'envol la nuit : l'oiseau dort.
  await expect(
    page.getByRole("button", { name: "Faire s’envoler l’oiseau" }),
  ).toHaveCount(0);

  // Le compteur ne change pas : aucun animal perdu. Le ciel choisi reste choisi.
  await expect(page.getByLabel("Bilan")).toContainText("6 animaux");
  await expect(page.getByRole("radio", { name: /Aube rose/ })).toBeChecked();
  await expect(
    page.getByText(/De 21 h à 6 h, ton jardin passe en Nuit encre/),
  ).toBeVisible();
  await expectNoAxeViolations(page);
});

test("le jour en hiver : rouge-gorge, perce-neige et houx ; papillon, abeille, coccinelle absents", async ({
  page,
}) => {
  // Midi à Paris, en janvier.
  const now = Date.UTC(2027, 0, 15, 11);
  await page.clock.setFixedTime(new Date(now));
  await seedJournal(page, journal(now));
  await page.goto("/jardin");
  await expect(scene(page)).toHaveAttribute("data-sky", "jour");
  await expect(scene(page)).not.toHaveAttribute("data-night", "");
  await expect(scene(page).locator('[data-part="crateres"]')).toHaveCSS(
    "opacity",
    "0",
  );
  const animals = await shown(page, "animal");
  for (const kind of ["butterfly", "bee", "ladybug"])
    expect(animals).not.toContain(kind);
  expect(animals).toEqual(
    expect.arrayContaining(["bird", "snail (endormi)", "hedgehog (endormi)"]),
  );
  const visitors = await shown(page, "visitor");
  expect(visitors).toEqual(
    expect.arrayContaining([
      "rouge-gorge",
      "perce-neige",
      "houx",
      "renard (endormi)",
    ]),
  );
  await expect(page.getByLabel("Bilan")).toContainText("6 animaux");
  await expectNoAxeViolations(page);
});

test("un papillon débloqué en hiver : il est là, on le verra au printemps", async ({
  page,
}) => {
  const now = Date.UTC(2027, 0, 15, 11);
  await page.clock.setFixedTime(new Date(now));
  await seedJournal(page, journal(now).slice(0, 1));
  await page.goto("/jardin?nouveau=vivant-0");
  await expect(
    page.getByRole("status").filter({
      hasText:
        "Un papillon s’est installé dans ton jardin : tu le verras au printemps",
    }),
  ).toBeAttached();
  expect(await shown(page, "animal")).not.toContain("butterfly");
});

test("mouvement réduit : aucune transition du ciel, rien ne tombe", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const now = Date.UTC(2026, 9, 15, 20, 30);
  await page.clock.setFixedTime(new Date(now));
  await seedJournal(page, journal(now));
  await page.goto("/jardin");
  await expect(scene(page)).toHaveAttribute("data-sky", "nuit");
  // Aucune transition : pas de propriété animée, ou une durée nulle.
  const transitions = await scene(page)
    .locator('[data-part="ciel"] > *, [data-part="crateres"], [data-stars]')
    .evaluateAll((nodes) =>
      nodes.map((node) => {
        const style = getComputedStyle(node);
        return {
          property: style.transitionProperty,
          duration: style.transitionDuration,
        };
      }),
    );
  expect(transitions.length).toBeGreaterThan(0);
  for (const { property, duration } of transitions)
    expect(
      property === "none" ||
        duration.split(",").every((d) => d.trim() === "0s"),
    ).toBe(true);
  await expect(scene(page).locator("[data-particle]").first()).toBeHidden();
});
