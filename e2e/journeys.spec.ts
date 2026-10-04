import { readFileSync } from "node:fs";
import {
  acceptDocument404,
  entry,
  expect,
  seedJournal,
  test,
} from "./fixtures";

test("comparaison complète jusqu'au jardin", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Commencer" }).first().click();
  await page.getByRole("button", { name: /^TGV/ }).click();
  await page.getByRole("button", { name: /^Avion/ }).click();
  await page.getByRole("button", { name: "Comparer" }).click();

  await expect(
    page.getByRole("heading", { name: "Lequel pèse le moins ?" }),
  ).toBeVisible();
  await expect(
    page.getByText(/le TGV est \d+ fois plus léger que l’avion/),
  ).toBeVisible();
  await page.getByRole("button", { name: "Je choisis le TGV" }).click();

  // Révélation : la plante exacte que ce choix fera pousser, et le papillon qui arrive.
  await expect(
    page.getByRole("heading", {
      name: /(Un arbre|Une fleur) va pousser dans ton jardin/,
    }),
  ).toBeFocused();
  await expect(page.getByText("Et un papillon arrive !")).toBeVisible();
  await page.getByRole("link", { name: "Aller la planter" }).click();

  // Le jardin s'ouvre sur ?nouveau=…, la plante pousse, l'animal arrive, puis l'URL se nettoie.
  await expect(page).toHaveURL(/\/jardin\?nouveau=/);
  await expect(
    page.getByRole("img", { name: "Jardin : 1 plante, 1 animal" }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "Un papillon s’est installé dans ton jardin" }),
  ).toBeAttached();
  await expect(page).toHaveURL(/\/jardin$/, { timeout: 8000 });
  await expect(page.getByText("TGV plutôt qu’avion")).toBeVisible();
  await expect(page.getByText("1 choix noté")).toBeVisible();
});

/** Épaisseur à l'écran (px) du trait de la pousse affichée, une fois sa croissance finie. */
function stemStroke(page: import("@playwright/test").Page) {
  return page
    .locator("[data-stage='pousse'] [stroke-width]")
    .first()
    .evaluate((element) => {
      const matrix = (element as SVGGraphicsElement).getScreenCTM()!;
      return (
        parseFloat(getComputedStyle(element).strokeWidth) *
        Math.hypot(matrix.a, matrix.b)
      );
    });
}

test("petit choix : une petite pousse, agrandie dans la vitrine sans éclat, au trait du jardin", async ({
  page,
}) => {
  await page.goto("/comparer?a=velo&b=voiture&q=2");
  await page.getByRole("button", { name: "Je choisis le vélo" }).click();
  await expect(
    page.getByRole("heading", { name: "Une petite pousse va sortir de terre" }),
  ).toBeFocused();
  // La pousse occupe la hauteur de la vitrine (dans le jardin, elle garde sa vraie taille).
  const plant = page.locator("[data-stage='pousse']").first();
  await expect(plant).toBeVisible();
  // Mesure après la pousse depuis le pied (animation d'échelle).
  await expect
    .poll(() =>
      plant.locator("svg > *").evaluateAll((nodes) => {
        // Hauteur de tout le dessin (union des formes).
        const rects = nodes.map((n) => n.getBoundingClientRect());
        return (
          Math.max(...rects.map((r) => r.bottom)) -
          Math.min(...rects.map((r) => r.top))
        );
      }),
    )
    .toBeGreaterThan(80);

  // Pas d'éclat dans la vitrine : il est réservé au jardin.
  await expect(page.locator("[data-sparkle]")).toHaveCount(0);

  // Le trait n'est pas agrandi : même épaisseur que dans le jardin (à l'écran, à la mise en
  // page près : la vitrine et la scène n'ont pas tout à fait la même échelle).
  await expect.poll(() => stemStroke(page)).toBeLessThan(3);
  const inVitrine = await stemStroke(page);
  await page.getByRole("link", { name: "Aller la planter" }).click();
  await expect(page).toHaveURL(/\/jardin/);
  await expect(
    page.getByRole("img", { name: /Jardin : 1 plante/ }),
  ).toBeVisible();
  // Dans le jardin, la plante pousse à sa place avec l'éclat.
  await expect(page.locator("[data-sparkle]")).toHaveCount(1);
  // L'éclat ne dure qu'un instant : on le guette à chaque image (rien ne le rate sous charge).
  await page.waitForFunction(
    () => {
      const sparkle = document.querySelector("[data-sparkle]");
      return (
        sparkle !== null &&
        getComputedStyle(sparkle).visibility === "visible" &&
        Number(getComputedStyle(sparkle).opacity) > 0
      );
    },
    undefined,
    { polling: "raf", timeout: 10_000 },
  );
  await expect
    .poll(async () => Math.abs((await stemStroke(page)) - inVitrine))
    .toBeLessThan(0.5);
});

test("choix plus lourd : la balance se pose, c'est noté, rien ne pousse", async ({
  page,
}) => {
  await page.goto("/comparer?a=avion&b=tgv&q=300");
  await page.getByRole("button", { name: "Je choisis l’avion" }).click();
  await expect(page.getByRole("heading", { name: "C’est noté" })).toBeFocused();
  await expect(page.getByText("Noté", { exact: true })).toBeVisible();
  await expect(page.getByText(/rien n’est retiré à ton jardin/)).toBeVisible();
  await page.getByRole("link", { name: "Voir mon jardin" }).click();
  await expect(page.getByRole("img", { name: "Jardin vide" })).toBeVisible();
});

test.describe("animations réduites", () => {
  test.use({ reducedMotion: "reduce" });

  test("la révélation s'affiche sans attendre et reste complète", async ({
    page,
  }) => {
    await page.goto("/comparer?a=tgv&b=avion&q=300");
    await page.getByRole("button", { name: "Je choisis le TGV" }).click();
    await expect(
      page.getByRole("heading", { name: /va pousser dans ton jardin/ }),
    ).toBeVisible();
    await expect(page.getByText("Et un papillon arrive !")).toBeVisible({
      timeout: 1500,
    });
  });
});

test("URL partagée : le duel s'ouvre directement, la quantité suit l'URL", async ({
  page,
}) => {
  await page.goto("/comparer?a=voiture&b=velo&q=120");
  await expect(
    page.getByRole("heading", { name: "Lequel pèse le moins ?" }),
  ).toBeVisible();
  await expect(page.getByRole("slider", { name: /Distance/ })).toHaveAttribute(
    "aria-valuetext",
    "120 kilomètres",
  );
  await expect(
    page.getByText(/Sur ce trajet, le vélo est plus de 100 fois plus léger/),
  ).toBeVisible();
});

test("URL invalide : retour propre au choix des gestes", async ({ page }) => {
  await page.goto("/comparer?a=tgv&b=repas-boeuf");
  await expect(
    page.getByText("Ce lien de comparaison n’est pas valable"),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Que veux-tu comparer ?" }),
  ).toBeVisible();
});

test("objet : neuf, d'occasion (livré par défaut) et je garde le mien", async ({
  page,
}) => {
  await page.goto("/comparer");
  await page.getByRole("button", { name: "S’habiller" }).click();
  await page.getByRole("button", { name: /^Jean/ }).click();

  await expect(
    page.getByRole("heading", {
      name: "Neuf, d’occasion, ou tu gardes le tien ?",
    }),
  ).toBeVisible();
  await expect(page.getByRole("radio")).toHaveCount(3);
  await expect(page.getByRole("radio", { name: /D’occasion/ })).toBeChecked();
  await expect(
    page.getByRole("switch", { name: /Livré en colis/ }),
  ).toBeChecked();

  // L'option se choisit en touchant sa carte (le bouton radio est visuellement masqué).
  await page.locator("label").filter({ hasText: "Je garde le mien" }).click();
  await expect(
    page.getByRole("radio", { name: /Je garde le mien/ }),
  ).toBeChecked();
  await expect(page.getByText(/aucune nouvelle fabrication/)).toBeVisible();
  await page.getByRole("button", { name: "Je garde le mien" }).click();
  await expect(page.getByText("+25,1 kg d’écart")).toBeVisible();
});

test("export puis import du carnet, sans doublon", async ({ page }) => {
  await seedJournal(page, [entry("export-1", 4.1)]);
  await page.goto("/jardin");
  const download = page.waitForEvent("download");
  await page
    .getByRole("region", { name: "Sauvegarde du carnet" })
    .getByRole("button", { name: "Exporter" })
    .click();
  const file = await (await download).path();
  const exported = JSON.parse(readFileSync(file, "utf8"));
  expect(exported).toMatchObject({ app: "le-poids-des-choses", version: 1 });
  expect(exported.entries).toHaveLength(1);

  // Même carnet : rien de nouveau.
  await page.locator('input[type="file"]').setInputFiles(file);
  await expect(page.getByText("Rien de nouveau dans ce fichier")).toBeVisible();

  // Carnet vide sur un autre appareil : l'import le restaure.
  await page.evaluate(() => window.localStorage.removeItem("lpdc:journal:v1"));
  await page.reload();
  await page.locator('input[type="file"]').setInputFiles(file);
  await expect(page.getByText("1 choix ajouté à ton carnet.")).toBeVisible();
  await expect(page.getByText("TGV plutôt qu’avion")).toBeVisible();
});

test("page 404 illustrée, avec un lien vers l'accueil", async ({
  page,
  consoleErrors,
}) => {
  const response = await page.goto("/cette-page-n-existe-pas");
  expect(response?.status()).toBe(404);
  acceptDocument404(consoleErrors);
  await expect(
    page.getByRole("heading", {
      name: "Cette page s’est perdue dans la brume",
    }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Revenir à l’accueil" }).click();
  await expect(page).toHaveURL(/\/$/);
});

test.describe("bandeau d'installation en mode iPhone", () => {
  test.use({
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  });

  test("explique « Partager, puis Sur l’écran d’accueil » et se ferme durablement", async ({
    page,
  }) => {
    await page.goto("/jardin");
    const banner = page.getByRole("region", { name: "Garde ton jardin" });
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(
      "touche Partager, puis « Sur l’écran d’accueil »",
    );
    await expect(banner.getByRole("button", { name: "Installer" })).toHaveCount(
      0,
    );

    await banner.getByRole("button", { name: "Fermer ce bandeau" }).click();
    await expect(banner).toHaveCount(0);
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "Mon jardin" }),
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: "Garde ton jardin" }),
    ).toHaveCount(0);
  });
});

test("en-têtes de sécurité et cache des fichiers versionnés", async ({
  page,
  request,
}) => {
  const response = await page.goto("/");
  const headers = response!.headers();
  expect(headers["content-security-policy"]).toContain("default-src 'self'");
  expect(headers["content-security-policy"]).toContain(
    "https://static.cloudflareinsights.com",
  );
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toContain("camera=()");
  const script = await page
    .locator('script[src^="/_next/static/"]')
    .first()
    .getAttribute("src");
  const asset = await request.get(script!);
  expect(asset.headers()["cache-control"]).toBe(
    "public, max-age=31536000, immutable",
  );
});
