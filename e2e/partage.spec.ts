import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { entry, expect, seedJournal, test } from "./fixtures";

const TWELVE = Array.from({ length: 12 }, (_, i) =>
  entry(`partage-${i}`, i % 2 ? 66.5 : 0.4, 30 + i),
);

type Shared = {
  type: string;
  name: string;
  width: number;
  height: number;
  text: string;
  url: string;
};

/**
 * navigator.canShare et navigator.share simulés : le partage enregistre ce qu'il reçoit (le
 * PNG est décodé pour en lire la taille), ou échoue comme demandé.
 */
async function fakeShare(page: Page, outcome: "ok" | "abort" | "error" = "ok") {
  await page.addInitScript((mode) => {
    const w = window as unknown as { __shared: unknown };
    w.__shared = null;
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      value: (data?: ShareData) => Boolean(data?.files?.length),
    });
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async (data: ShareData) => {
        if (mode === "abort")
          throw new DOMException("Partage annulé", "AbortError");
        if (mode === "error") throw new Error("Échec du partage");
        const file = data.files![0];
        const bitmap = await createImageBitmap(file);
        w.__shared = {
          type: file.type,
          name: file.name,
          width: bitmap.width,
          height: bitmap.height,
          text: data.text,
          url: data.url,
        };
      },
    });
  }, outcome);
}

test.describe("partage du jardin (mobile)", () => {
  test("bouton dans la barre du haut, feuille accessible, PNG 1080×1350", async ({
    page,
    browserName,
  }) => {
    await fakeShare(page);
    await seedJournal(page, TWELVE);
    await page.goto("/jardin");

    const share = page.getByRole("button", { name: "Partager", exact: true });
    await expect(share).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Exporter" }).first(),
    ).toBeVisible();

    await share.click();
    const sheet = page.getByRole("dialog", { name: "Partager mon jardin" });
    await expect(sheet).toBeVisible();
    await expect(sheet).toContainText(
      "L’image montre ton jardin et le nombre de tes choix légers. Ni ton carnet, ni de kilos de CO2e.",
    );
    await expect(sheet.locator("[data-share-preview]")).toBeVisible({
      timeout: 10_000,
    });
    await expect(sheet.getByRole("img")).toHaveAttribute(
      "alt",
      /12 choix légers, \d+ animaux/,
    );

    // Le focus reste dans la feuille (Tab : Chromium seulement, WebKit ne parcourt pas les
    // boutons avec Tab par défaut).
    for (let i = 0; i < (browserName === "webkit" ? 0 : 5); i++) {
      await page.keyboard.press("Tab");
      expect(
        await sheet.evaluate((dialog) =>
          dialog.contains(document.activeElement),
        ),
      ).toBe(true);
    }
    // Échap ferme, le focus revient sur « Partager ».
    await page.keyboard.press("Escape");
    await expect(sheet).toHaveCount(0);
    await expect(share).toBeFocused();

    await share.click();
    await expect(sheet.locator("[data-share-preview]")).toBeVisible({
      timeout: 10_000,
    });
    await sheet.getByRole("button", { name: "Partager l’image" }).click();
    await expect(sheet).toHaveCount(0);
    const shared = (await page.evaluate(
      () => (window as unknown as { __shared: unknown }).__shared,
    )) as Shared;
    expect(shared).toMatchObject({
      type: "image/png",
      name: "mon-jardin.png",
      width: 1080,
      height: 1350,
    });
    expect(shared.url).toMatch(/^https:\/\//);
    expect(shared.text).toBeTruthy();
  });

  test("depuis /en : feuille et image en anglais, sans kg", async ({
    page,
  }) => {
    await fakeShare(page);
    // Textes dessinés sur le canvas de l'image.
    await page.addInitScript(() => {
      const w = window as unknown as { __drawn: string[] };
      w.__drawn = [];
      const fill = CanvasRenderingContext2D.prototype.fillText;
      CanvasRenderingContext2D.prototype.fillText = function (text, ...rest) {
        w.__drawn.push(String(text));
        return fill.call(this, text, ...rest);
      };
    });
    await seedJournal(page, TWELVE);
    await page.goto("/en/garden");
    await page.getByRole("button", { name: "Share", exact: true }).click();
    const sheet = page.getByRole("dialog", { name: "Share my garden" });
    await expect(sheet).toContainText(
      "The image shows your garden and the number of your lighter choices. Not your journal, and no kilos of CO2e.",
    );
    await expect(sheet.locator("[data-share-preview]")).toBeVisible({
      timeout: 10_000,
    });
    await expect(sheet.getByRole("img")).toHaveAttribute(
      "alt",
      /^Preview of the image to share: your garden, 12 lighter choices, \d+ animals?\.$/,
    );
    const drawn = await page.evaluate(
      () => (window as unknown as { __drawn: string[] }).__drawn,
    );
    expect(drawn).toEqual(
      expect.arrayContaining([
        "My garden",
        "12 lighter choices",
        "Every lighter choice makes something grow.",
      ]),
    );
    expect(drawn.join(" ")).not.toMatch(/kg|CO2|jardin|choix/);
    await sheet.getByRole("button", { name: "Share the image" }).click();
    // Le partage est asynchrone : la feuille se ferme une fois le fichier reçu.
    await expect(sheet).toHaveCount(0);
    const shared = (await page.evaluate(
      () => (window as unknown as { __shared: unknown }).__shared,
    )) as Shared;
    expect(shared).toMatchObject({
      name: "my-garden.png",
      text: "My garden, in Le poids des choses.",
      width: 1080,
      height: 1350,
    });
  });

  test("partage annulé : rien ne se passe ; autre erreur : message discret", async ({
    page,
  }) => {
    await fakeShare(page, "abort");
    await seedJournal(page, TWELVE);
    await page.goto("/jardin");
    await page.getByRole("button", { name: "Partager", exact: true }).click();
    const sheet = page.getByRole("dialog", { name: "Partager mon jardin" });
    await expect(sheet.locator("[data-share-preview]")).toBeVisible({
      timeout: 10_000,
    });
    await sheet.getByRole("button", { name: "Partager l’image" }).click();
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole("status")).toHaveText("");
    await sheet.getByRole("button", { name: "Annuler" }).click();
    await expect(sheet).toHaveCount(0);
  });

  test("autre erreur de partage : message discret", async ({
    page,
    consoleErrors,
  }) => {
    await fakeShare(page, "error");
    await seedJournal(page, TWELVE);
    await page.goto("/jardin");
    await page.getByRole("button", { name: "Partager", exact: true }).click();
    const sheet = page.getByRole("dialog", { name: "Partager mon jardin" });
    await expect(sheet.locator("[data-share-preview]")).toBeVisible({
      timeout: 10_000,
    });
    await sheet.getByRole("button", { name: "Partager l’image" }).click();
    await expect(sheet.getByRole("status")).toHaveText(
      "Le partage n’a pas abouti. Tu peux réessayer.",
    );
    // L'erreur détaillée reste dans la console (attendue ici, donc tolérée).
    expect(consoleErrors).toEqual([
      expect.stringContaining("Partage du jardin en échec."),
    ]);
    consoleErrors.length = 0;
  });

  test("image impossible à préparer : message discret, cause dans la console", async ({
    page,
    consoleErrors,
  }) => {
    await page.route("**/illustrations/scene-paysage.svg", (route) =>
      route.fulfill({ status: 500 }),
    );
    await fakeShare(page);
    await seedJournal(page, TWELVE);
    await page.goto("/jardin");
    await page.getByRole("button", { name: "Partager", exact: true }).click();
    const sheet = page.getByRole("dialog", { name: "Partager mon jardin" });
    await expect(sheet.getByRole("status")).toHaveText(
      "L’image n’a pas pu être préparée. Réessaie dans un instant.",
    );
    const logged = consoleErrors.join("\n");
    expect(logged).toContain("étape « illustrations » en échec");
    // Seules erreurs tolérées : la ressource refusée (500) et le détail du rendu.
    consoleErrors.length = 0;
  });

  test("axe : barre du haut et feuille de partage ouverte", async ({
    page,
  }) => {
    await fakeShare(page);
    await seedJournal(page, TWELVE);
    await page.goto("/jardin");
    await page.getByRole("button", { name: "Partager", exact: true }).click();
    const sheet = page.getByRole("dialog", { name: "Partager mon jardin" });
    await expect(sheet.locator("[data-share-preview]")).toBeVisible({
      timeout: 10_000,
    });
    await page.evaluate(() =>
      Promise.all(
        document
          .getAnimations()
          .filter(
            (animation) =>
              animation.effect?.getComputedTiming().iterations !== Infinity,
          )
          .map((animation) => animation.finished),
      ),
    );
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map(
        (v) =>
          `${v.id} : ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
      ),
    ).toEqual([]);
  });

  test("police de repli absente (Android, sans Arial) : le PNG est quand même produit", async ({
    page,
  }) => {
    // Les polices de repli de next/font pointent vers local(Arial), absente d'Android : son
    // chargement échoue, et Chromium refusait alors tout document.fonts.load (feuille bloquée
    // sur « L’image n’a pas pu être préparée »). On retire Arial comme sur un téléphone Android.
    await page.route("**/_next/static/**/*.css", async (route) => {
      const response = await route.fetch();
      await route.fulfill({
        response,
        body: (await response.text()).replaceAll(
          "local(Arial)",
          "local(Police-Absente-Du-Telephone)",
        ),
      });
    });
    await fakeShare(page);
    await seedJournal(page, TWELVE);
    const response = await page.goto("/jardin");
    // Mêmes en-têtes qu'en production (public/_headers) : le rendu se fait sous la vraie CSP.
    expect(response?.headers()["content-security-policy"]).toContain(
      "img-src 'self' data: blob:",
    );
    await page.getByRole("button", { name: "Partager", exact: true }).click();
    const sheet = page.getByRole("dialog", { name: "Partager mon jardin" });
    await expect(sheet.locator("[data-share-preview]")).toBeVisible({
      timeout: 10_000,
    });
    await sheet.getByRole("button", { name: "Partager l’image" }).click();
    // Le partage est asynchrone : on attend qu'il ait eu lieu (machine chargée).
    await expect
      .poll(() =>
        page.evaluate(
          () => (window as unknown as { __shared: unknown }).__shared,
        ),
      )
      .toMatchObject({ width: 1080, height: 1350 });
  });

  // Une lavande épanouie (groupes imbriqués dans son dessin) cassait l'image : le SVG du jardin
  // devenait invalide et la carte ne se préparait jamais (corrigé le 9 octobre 2026).
  for (const [season, at] of [
    ["printemps", Date.UTC(2027, 3, 20, 10)],
    ["automne", Date.UTC(2026, 9, 20, 10)],
  ] as const)
    test(`lavande épanouie, ${season} : le PNG est produit`, async ({
      page,
    }) => {
      const DAY = 24 * 60 * 60 * 1000;
      await page.clock.setFixedTime(new Date(at));
      await fakeShare(page);
      await seedJournal(page, [
        ...[0, 1, 2].map((i) => ({
          ...entry(`lavande-${i}`, 4.3, 0),
          date: new Date(at - 14 * DAY + i * 60_000).toISOString(),
          species: "fleur-5",
        })),
        ...Array.from({ length: 12 }, (_, day) => ({
          kind: "habit",
          id: `arrose-${day}`,
          date: new Date(at - (13 - day) * DAY).toISOString(),
          gesture: "velo",
        })),
      ]);
      await page.goto("/jardin");
      await expect(
        page.locator('[data-species="fleur-5"][data-bloom-level="3"]'),
      ).toHaveCount(3);
      await page.getByRole("button", { name: "Partager", exact: true }).click();
      const sheet = page.getByRole("dialog", { name: "Partager mon jardin" });
      await expect(sheet.locator("[data-share-preview]")).toBeVisible({
        timeout: 10_000,
      });
      await sheet.getByRole("button", { name: "Partager l’image" }).click();
      await expect
        .poll(() =>
          page.evaluate(
            () => (window as unknown as { __shared: unknown }).__shared,
          ),
        )
        .toMatchObject({ type: "image/png", width: 1080, height: 1350 });
    });

  test("jardin endormi : l'image se prépare aussi", async ({ page }) => {
    await fakeShare(page);
    const old = TWELVE.map((e, i) =>
      entry(e.id, e.avoidedKg, 30 * 24 * 60 + i),
    );
    await seedJournal(page, old);
    await page.goto("/jardin");
    await page.getByRole("button", { name: "Partager", exact: true }).click();
    const sheet = page.getByRole("dialog", { name: "Partager mon jardin" });
    await expect(sheet.locator("[data-share-preview]")).toBeVisible({
      timeout: 10_000,
    });
  });
});

test.describe("partage du jardin (ordinateur)", () => {
  test.use({
    viewport: { width: 1280, height: 800 },
    isMobile: false,
    hasTouch: false,
  });

  test("pas de bouton « Partager », même si le navigateur sait partager", async ({
    page,
  }) => {
    await fakeShare(page);
    await seedJournal(page, TWELVE);
    await page.goto("/jardin");
    await expect(
      page.getByRole("heading", { level: 1, name: "Mon jardin" }),
    ).toBeVisible();
    await expect(page.getByRole("img", { name: /^Jardin :/ })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Partager", exact: true }),
    ).toHaveCount(0);
    // L'export reste en bas de page, comme avant.
    await expect(page.getByRole("button", { name: "Exporter" })).toHaveCount(1);
  });
});
