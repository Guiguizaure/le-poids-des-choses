import type { Page } from "@playwright/test";
import { expect, expectNoAxeViolations, seedJournal, test } from "./fixtures";

/** Zone de toucher d'un animal dans la scène (la liste a un bouton du même nom). */
function zone(page: Page, talker: string, name: string) {
  return page.locator(`[data-talk="${talker}"][aria-label="${name}"]`);
}

// « Les animaux parlent » : toucher un animal ouvre sa conversation ; une nouvelle réplique par
// jour (minuit à Paris), « déjà parlé » ensuite ; endormi, « Zzz » et une réplique de sommeil ;
// « Les habitants du jardin » en alternative accessible. Textes : src/content/animaux.
test.use({ timezoneId: "Europe/Paris" });

/** Midi passé, le 8 octobre 2026 (automne) : papillon, coccinelle, oiseau éveillés ; renard endormi. */
const DAY = "2026-10-08T13:00:00+02:00";

/** `count` choix légers, notés le matin même. */
function lightChoices(count: number, at = "2026-10-08T09:00:00+02:00") {
  const start = new Date(at).getTime();
  return Array.from({ length: count }, (_, i) => ({
    id: `animaux-${i}`,
    date: new Date(start - (count - i) * 60_000).toISOString(),
    gestureA: "avion",
    gestureB: "tgv",
    quantity: 300,
    chosen: "b",
    avoidedKg: 4 + i,
  }));
}

async function openGarden(
  page: Page,
  count: number,
  at: string,
  path = "/jardin",
) {
  await page.clock.install({ time: new Date(at) });
  await seedJournal(page, lightChoices(count));
  await page.goto(path);
  await expect(page.locator("[data-talk]").first()).toBeAttached();
}

const dialogOf = (page: Page) => page.locator("dialog[data-animal-talk]");

test("toucher l'oiseau : la conversation s'ouvre, s'écrit lettre à lettre, se ferme et rend le focus", async ({
  page,
}) => {
  await openGarden(page, 5, DAY);
  // Zones d'au moins 44 px sur chaque animal qui parle.
  for (const zone of await page.locator("[data-talk]").all()) {
    const box = (await zone.boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
  const bird = zone(page, "bird", "Parler à l’oiseau");
  await bird.click();

  const dialog = page.getByRole("dialog", { name: "Oiseau" });
  await expect(dialog).toBeVisible();
  // Texte complet tout de suite pour les lecteurs d'écran ; la version animée est cachée.
  await expect(dialog).toHaveAccessibleDescription(
    "Oh, quelqu'un ! Tu viens d'où ? Tu restes longtemps ? Tu aimes les graines ?",
  );
  await expect(dialog.locator("[data-typed]")).toHaveAttribute(
    "aria-hidden",
    "true",
  );
  // Sa présentation a deux étapes : « Suite ▶ » a le focus.
  const next = dialog.locator("[data-next]");
  await expect(next).toHaveAccessibleName("Suite");
  await expect(next).toBeFocused();
  // Portrait décoratif à gauche, environ 96 px sur mobile ; nom en étiquette.
  const portrait = dialog.locator("[data-portrait]");
  await expect(portrait).toHaveAttribute("aria-hidden", "true");
  await expect(portrait).toHaveAttribute("data-expr", "surpris");
  expect(Math.round((await portrait.boundingBox())!.width)).toBe(96);
  // Toucher la boîte affiche le texte en entier (sans fermer).
  await dialog.locator("[data-typed]").click();
  await expect(dialog.locator("[data-typed]")).toHaveAttribute(
    "data-typewriter",
    "done",
  );
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("[data-typed]")).toHaveText(
    "Oh, quelqu'un ! Tu viens d'où ? Tu restes longtemps ? Tu aimes les graines ?",
  );
  await expectNoAxeViolations(page);

  // Échap : fermée, le focus revient sur l'oiseau.
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(bird).toBeFocused();
});

test("la croix et un toucher en dehors ferment aussi", async ({ page }) => {
  await openGarden(page, 5, DAY);
  const bird = zone(page, "bird", "Parler à l’oiseau");
  await bird.click();
  await dialogOf(page)
    .getByRole("button", { name: "Fermer la conversation" })
    .click();
  await expect(dialogOf(page)).toHaveCount(0);
  await zone(page, "ladybug", "Parler à la coccinelle").click();
  await expect(dialogOf(page)).toBeVisible();
  await page.mouse.click(20, 20);
  await expect(dialogOf(page)).toHaveCount(0);
});

/**
 * L'oiseau a déjà dit sa présentation hier : aujourd'hui, sa réplique 2 (deux étapes), ou
 * celle du pommier si le jardin du test en a un (conditionnelle, prioritaire).
 */
async function knowsBird(page: Page) {
  await page.addInitScript(() =>
    localStorage.setItem(
      "lpdc:amis:v1",
      JSON.stringify({
        version: 1,
        animals: {
          bird: { seen: ["ois-1"], day: "2026-10-07", talks: 1, met: true },
        },
      }),
    ),
  );
}

/** Réplique attendue aujourd'hui : celle du pommier s'il est planté, sinon la n° 2. */
const BIRD_TODAY = {
  fr: {
    "ois-2": [
      ["content", "Devine combien je pèse."],
      ["surpris", "Entre 9 et 12 grammes ! Un vrai poids plume."],
    ],
    "ois-c2": [
      ["surpris", "Un pommier !"],
      [
        "content",
        "Des feuilles pour me cacher, des fruits plus tard. Très bonne idée.",
      ],
    ],
  },
  en: {
    "ois-2": [
      ["content", "Guess how much I weigh."],
      ["surpris", "Between 9 and 12 grams! A real featherweight."],
    ],
    "ois-c2": [
      ["surpris", "An apple tree!"],
      ["content", "Leaves to hide in, fruit later on. Very good idea."],
    ],
  },
} as const;

for (const { path, locale, name, label, next, finish } of [
  {
    path: "/jardin",
    locale: "fr",
    name: "Oiseau",
    label: "Parler à l’oiseau",
    next: "Suite",
    finish: "Fermer",
  },
  {
    path: "/en/garden",
    locale: "en",
    name: "Bird",
    label: "Talk to the bird",
    next: "Next",
    finish: "Close",
  },
] as const) {
  test(`${path} : une réplique en deux étapes, « ${next} ▶ » puis « ${finish} », chaque étape annoncée`, async ({
    page,
  }) => {
    await knowsBird(page);
    await openGarden(page, 5, DAY, path);
    const apple = (await page.locator('[data-species="arbre-1"]').count()) > 0;
    const lineId = apple ? "ois-c2" : "ois-2";
    const [[expr1, step1], [expr2, step2]] = BIRD_TODAY[locale][lineId];
    const bird = zone(page, "bird", label);
    await bird.click();
    const dialog = page.getByRole("dialog", { name });
    const button = dialog.locator("[data-next]");
    const status = dialog.getByRole("status");
    await expect(dialog).toHaveAttribute("data-step", "1/2");
    await expect(status).toHaveText(step1);
    await expect(status).toHaveAttribute("aria-live", "polite");
    await expect(dialog.locator("[data-portrait]")).toHaveAttribute(
      "data-expr",
      expr1,
    );
    await expect(button).toHaveAccessibleName(next);
    await expect(button).toBeFocused();

    await button.click();
    await expect(dialog).toHaveAttribute("data-step", "2/2");
    await expect(status).toHaveText(step2);
    await expect(dialog.locator("[data-portrait]")).toHaveAttribute(
      "data-expr",
      expr2,
    );
    // Même bouton, le focus y reste ; à la dernière étape, il ferme.
    await expect(button).toBeFocused();
    await expect(button).toHaveAccessibleName(finish);
    await expectNoAxeViolations(page);
    await button.click();
    await expect(dialogOf(page)).toHaveCount(0);
    await expect(bird).toBeFocused();
    // Une réplique entière = un pas d'amitié (pas une étape).
    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("lpdc:amis:v1") ?? "null"),
    );
    expect(stored.animals.bird.seen).toEqual(["ois-1", lineId]);
  });
}

test("toucher la boîte : finit d'écrire, puis passe à l'étape suivante, sans jamais fermer", async ({
  page,
}) => {
  await knowsBird(page);
  await openGarden(page, 5, DAY);
  // Horloge de la page figée (dix minutes plus tard, même jour) avant d'ouvrir : le texte
  // ne peut pas avancer, il est encore en train de s'écrire au premier toucher.
  await page.clock.pauseAt(new Date(Date.parse(DAY) + 10 * 60_000));
  await zone(page, "bird", "Parler à l’oiseau").click();
  const dialog = dialogOf(page);
  const typed = dialog.locator("[data-typed]");
  await expect(typed).toHaveAttribute("data-typewriter", "typing");
  await typed.click();
  await expect(typed).toHaveAttribute("data-typewriter", "done");
  await expect(dialog).toHaveAttribute("data-step", "1/2");
  await typed.click();
  await expect(dialog).toHaveAttribute("data-step", "2/2");
  await typed.click();
  await typed.click();
  await expect(dialog).toHaveAttribute("data-step", "2/2");
  await expect(dialog).toBeVisible();
});

test("les zones suivent les animaux qui bougent (coccinelle qui marche)", async ({
  page,
}) => {
  await openGarden(page, 3, DAY);
  // Centres de la zone et du dessin, lus dans la même image.
  const centers = () =>
    page.evaluate(() => {
      const center = (selector: string) => {
        const rect = document.querySelector(selector)!.getBoundingClientRect();
        return rect.x + rect.width / 2;
      };
      return {
        zone: center('[data-talk="ladybug"]'),
        drawn: center('[data-animal="ladybug"] svg'),
      };
    });
  const first = await centers();
  // Elle finit par marcher (pauses comprises)…
  await expect
    .poll(async () => Math.abs((await centers()).drawn - first.drawn), {
      timeout: 10_000,
    })
    .toBeGreaterThan(4);
  // … et la zone la suit (recalculée une image sur trois).
  const later = await centers();
  expect(Math.abs(later.zone - later.drawn)).toBeLessThan(6);
});

/** Une conversation avec la coccinelle (là jour et nuit en automne) : sorte et texte. */
async function talkToLadybird(page: Page) {
  await zone(page, "ladybug", "Parler à la coccinelle").click();
  const dialog = dialogOf(page);
  await expect(dialog).toBeVisible();
  const reply = await dialog.getAttribute("data-reply");
  const text = await dialog.locator("p[role=status]").textContent();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  return { reply, text };
}

test("une nouvelle réplique par jour, puis « déjà parlé » le même jour", async ({
  page,
}) => {
  await openGarden(page, 3, "2026-10-08T20:00:00+02:00");
  expect(await talkToLadybird(page)).toEqual({
    reply: "new",
    text: "Halte-là ! Qui va là ?",
  });
  const again = await talkToLadybird(page);
  expect(again.reply).toBe("again");
  expect([
    "Je suis en ronde ! Reviens demain pour le rapport.",
    "Une seule audience par jour. C'est le règlement.",
  ]).toContain(again.text);
  // Sur l'appareil seulement, clé versionnée.
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("lpdc:amis:v1") ?? "null"),
  );
  expect(stored).toMatchObject({
    version: 1,
    animals: { ladybug: { seen: ["coc-1"], day: "2026-10-08", talks: 2 } },
  });
});

test("minuit à Paris : 23 h 59, encore « déjà parlé » ; 0 h 01, la réplique suivante", async ({
  page,
}) => {
  // La coccinelle s'est présentée ce soir (le 8 octobre).
  await page.addInitScript(() =>
    localStorage.setItem(
      "lpdc:amis:v1",
      JSON.stringify({
        version: 1,
        animals: {
          ladybug: { seen: ["coc-1"], day: "2026-10-08", talks: 1, met: true },
        },
      }),
    ),
  );
  await openGarden(page, 3, "2026-10-08T23:59:00+02:00");
  expect((await talkToLadybird(page)).reply).toBe("again");
  await page.clock.setSystemTime(new Date("2026-10-09T00:01:00+02:00"));
  // Sa seule conditionnelle est de printemps : la n° 2.
  expect(await talkToLadybird(page)).toEqual({
    reply: "new",
    text: "Les pucerons ? Mes pires ennemis. Enfin… mon goûter.",
  });
  // Le compteur ne compte que les répliques sans condition : 6 pour la coccinelle.
  await expect(
    page.locator('[data-talk-row="ladybug"] [data-progress]'),
  ).toHaveText("2 répliques sur 6");
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("lpdc:amis:v1") ?? "null"),
  );
  expect(stored.animals.ladybug).toMatchObject({
    seen: ["coc-1", "coc-2"],
    day: "2026-10-09",
  });
});

test("endormi : « Zzz », réplique de sommeil, l'amitié n'avance pas", async ({
  page,
}) => {
  // 23 h : l'oiseau dort ; le renard, lui, est réveillé.
  await openGarden(page, 5, "2026-10-08T23:00:00+02:00");
  const bird = zone(page, "bird", "Parler à l’oiseau, qui dort");
  await expect(bird.locator("[data-zzz]")).toBeVisible();
  await expect(zone(page, "fox", "Parler au renard")).toBeVisible();
  await bird.click();
  const dialog = dialogOf(page);
  await expect(dialog).toHaveAttribute("data-reply", "sleep");
  expect([
    "Zzz… (L'oiseau dort, la tête enfouie dans ses plumes. Reviens demain matin.)",
    "Zzz… pio… zzz…",
  ]).toContain(await dialog.getByRole("status").textContent());
  await expect(dialog.locator("[data-portrait]")).toHaveAttribute(
    "data-expr",
    "dort",
  );
  await expect(dialog.getByRole("heading", { name: /Oiseau/ })).toContainText(
    "En plein sommeil.",
  );
  await expectNoAxeViolations(page);
  await page.keyboard.press("Escape");
  await expect(
    page.locator('[data-talk-row="bird"] [data-progress]'),
  ).toHaveText("0 réplique sur 6 · En plein sommeil.");
});

test("« Les habitants du jardin » : liste accessible, « ? » pour les inconnus, aucun kg", async ({
  page,
}) => {
  await openGarden(page, 3, DAY);
  const list = page.getByRole("region", { name: "Les habitants du jardin" });
  await expect(list.getByRole("listitem")).toHaveCount(5);
  // Oiseau et escargot pas encore rencontrés (5 et 8 choix légers).
  await expect(list.locator("[data-unmet]")).toHaveCount(2);
  await expect(list.getByText("Habitant pas encore rencontré")).toHaveCount(2);
  // Le renard est passé (il dort le jour) : rencontré.
  await expect(list.locator('[data-talk-row="fox"]')).toContainText("Renard");
  await expect(list).not.toContainText("kg");

  const talk = list.getByRole("button", { name: "Parler au papillon" });
  await talk.click();
  const dialog = page.getByRole("dialog", { name: "Papillon" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(talk).toBeFocused();
  await expect(
    list.locator('[data-talk-row="butterfly"] [data-progress]'),
  ).toHaveText("1 réplique sur 6");
  await expectNoAxeViolations(page);
});

test("en anglais : “Talk to the bird”, étiquette, réplique et liste", async ({
  page,
}) => {
  await openGarden(page, 5, DAY, "/en/garden");
  await zone(page, "bird", "Talk to the bird").click();
  const dialog = page.getByRole("dialog", { name: "Bird" });
  await expect(dialog).toHaveAccessibleDescription(
    "Oh, someone! Where are you from? Are you staying long? Do you like seeds?",
  );
  await expectNoAxeViolations(page);
  await dialog.getByRole("button", { name: "Close the conversation" }).click();
  const list = page.getByRole("region", { name: "Who lives in the garden" });
  await expect(
    list.locator('[data-talk-row="bird"] [data-progress]'),
  ).toHaveText("1 of 6 lines");
  await expect(list.getByText("Resident not met yet")).toHaveCount(1);
  await expectNoAxeViolations(page);
});

test.describe("mouvement réduit", () => {
  test.use({ reducedMotion: "reduce" });

  test("le texte est entier tout de suite, « Zzz » immobile", async ({
    page,
  }) => {
    await openGarden(page, 5, "2026-10-08T23:00:00+02:00");
    const zzz = page.locator('[data-talk="bird"] [data-zzz]');
    await expect(zzz).toHaveCSS("animation-name", "none");
    await zone(page, "fox", "Parler au renard").click();
    const dialog = dialogOf(page);
    await expect(dialog.locator("[data-typed]")).toHaveAttribute(
      "data-typewriter",
      "done",
    );
    await expect(dialog.locator("[data-typed]")).toHaveText(
      "Bonsoir. Tu as bien fait de venir à cette heure-ci : la nuit, je suis à mon meilleur.",
    );
    // Pas de fondu entre deux expressions.
    await expect(dialog.locator("[data-portrait] img").first()).toHaveCSS(
      "transition-property",
      "none",
    );
  });
});
