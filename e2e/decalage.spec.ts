import type { Page } from "@playwright/test";
import {
  entry,
  expect,
  expectNoAxeViolations,
  seedJournal,
  test,
} from "./fixtures";

// Décalage de mise en page au chargement de Mon jardin (CLS) : le carnet n'est lu qu'après
// l'hydratation, rien de ce qui est déjà affiché ne doit bouger quand il arrive. API
// « layout-shift » : Chromium seulement.
/** L'API « layout-shift » n'existe que dans Chromium. */
const chromiumOnly = () =>
  test.skip(
    ({ browserName }) => browserName !== "chromium",
    "PerformanceObserver layout-shift : Chromium seulement",
  );

const MAX_CLS = 0.1;

/** Somme des décalages sans geste de la personne (borne haute du CLS), et leurs sources. */
async function measureShifts(page: Page, ready = "[data-garden-season]") {
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
    await expect(page.locator(ready).first()).toBeVisible();
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

test.describe("CLS au chargement (Chromium)", () => {
  chromiumOnly();

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
});

/** Téléphone qui peut partager : partage de fichiers et pointeur tactile simulés. */
async function canShareFiles(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      value: (data?: ShareData) => Boolean(data?.files?.length),
    });
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async () => {},
    });
    const matchMedia = window.matchMedia.bind(window);
    window.matchMedia = (query: string) =>
      query === "(pointer: coarse)"
        ? ({
            matches: true,
            media: query,
            onchange: null,
            addEventListener() {},
            removeEventListener() {},
            addListener() {},
            removeListener() {},
            dispatchEvent: () => false,
          } as MediaQueryList)
        : matchMedia(query);
  });
}

/** Géométrie de l'en-tête de /jardin une fois tout chargé (polices comprises). */
async function headerGeometry(page: Page) {
  await expect(page.locator("[data-garden-season]")).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  return page.evaluate(() => {
    const layoutTop = (element: Element) => {
      let top = 0;
      for (
        let node = element as HTMLElement | null;
        node;
        node = node.offsetParent as HTMLElement | null
      )
        top += node.offsetTop;
      return top;
    };
    const logo = document.querySelector<HTMLElement>(
      'a[aria-label^="Le poids des choses"]',
    )!;
    const parts = [...logo.querySelectorAll("span > span")];
    return {
      // Position de mise en page (offsetTop), sans les transformations : l'animation
      // d'arrivée de la page (animate-enter) ne compte pas, comme pour le CLS.
      title: layoutTop(document.querySelector("h1")!),
      lines: new Set(
        parts.map((part) => Math.round(part.getBoundingClientRect().top)),
      ).size,
    };
  });
}

// L'en-tête de /jardin ne change jamais de hauteur : sous `lg`, le nom est toujours sur deux
// lignes ; Exporter et Partager (téléphone qui partage, avec un carnet) arrivent après
// l'hydratation dans la place libre, en icônes s'il en manque. Comparaison géométrique
// « sans carnet » / « avec carnet et partage » : déterministe, quel que soit le moment où
// les polices se chargent (le défaut d'origine ne se voyait qu'une fois sur huit au CLS).
for (const { width, icons } of [
  { width: 320, icons: true },
  { width: 412, icons: false },
]) {
  test(`en-tête de /jardin à ${width} px : même hauteur sans carnet et avec Exporter et Partager${icons ? " (en icônes)" : ""}`, async ({
    page,
    browserName,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    // Même onglet, même appareil : d'abord sans carnet (pas de bouton)…
    await page.goto("/jardin");
    await expect(page.locator("[data-header-action]")).toHaveCount(0);
    const withoutShare = await headerGeometry(page);

    // … puis téléphone qui partage, avec un carnet : Exporter et Partager arrivent.
    const done = browserName === "chromium" ? await measureShifts(page) : null;
    await canShareFiles(page);
    await seedJournal(page, [entry("entete-1", 4.1)]);
    await page.reload();
    const share = page.getByRole("button", { name: "Partager", exact: true });
    const exportButton = page.locator('[data-header-action="export"]');
    await expect(share).toBeVisible();
    await expect(exportButton).toHaveAccessibleName("Exporter");
    const withShare = await headerGeometry(page);

    expect(withShare).toEqual(withoutShare);
    expect(withShare.lines).toBe(2);

    // Libellés visibles s'il y a la place, sinon des icônes (nom accessible gardé).
    if (icons)
      await expect(share.locator("span")).toHaveCSS("position", "absolute");
    else await expect(share).toContainText("Partager");
    // Zone de toucher d'au moins 44 px : toucher juste à côté du rond ouvre quand même.
    const box = (await share.boundingBox())!;
    const target = await share.evaluate((button) => {
      const area = getComputedStyle(button, "::before");
      return area.position === "absolute"
        ? Number.parseFloat(area.width)
        : button.getBoundingClientRect().height;
    });
    if (icons) expect(target).toBeGreaterThanOrEqual(44);
    if (icons) {
      await page.mouse.click(box.x + box.width + 5, box.y + box.height / 2);
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.keyboard.press("Escape");
    }

    if (done) {
      const { cls, shifts } = await done();
      expect(cls, JSON.stringify(shifts)).toBe(0);
    }
  });
}

// Accueil : quelqu'un qui revient (un carnet sur l'appareil) voit « Retrouver mon jardin » en
// action principale dès le premier affichage. Un script en ligne pose `data-garden` sur <html>
// avant les boutons : aucune bascule, aucun décalage, même hauteur dans les deux cas.
test.describe("accueil, avec et sans jardin", () => {
  const actions = (page: Page) =>
    page.locator("[data-home-actions]").locator("..");

  for (const withGarden of [false, true])
    test(`CLS = 0 ${withGarden ? "avec" : "sans"} jardin (Chromium)`, async ({
      page,
      browserName,
    }) => {
      test.skip(
        browserName !== "chromium",
        "layout-shift : Chromium seulement",
      );
      if (withGarden) await seedJournal(page, [entry("accueil-1", 4.1, 60)]);
      const done = await measureShifts(page, "main h1");
      await page.goto("/");
      const { cls, shifts } = await done();
      expect(cls, JSON.stringify(shifts)).toBe(0);
    });

  test("sans jardin : « Commencer », « Comment ça marche ? » et « Le retrouver »", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveAttribute("data-garden");
    await expect(page.getByRole("link", { name: "Commencer" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "J’ai déjà un jardin ? Le retrouver" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Retrouver mon jardin" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Faire pousser une plante" }),
    ).toHaveCount(0);
  });

  test("avec un jardin : « Retrouver mon jardin » d'abord, dès le premier affichage, même hauteur", async ({
    page,
  }) => {
    await page.goto("/");
    const before = await actions(page).boundingBox();
    // WebKit : laisser finir les préchargements de Next avant de naviguer de nouveau.
    await page.waitForLoadState("networkidle");
    // Attribut posé avant même la fin de l'analyse de la page (aucune bascule).
    await page.addInitScript(() =>
      document.addEventListener("DOMContentLoaded", () => {
        (window as unknown as { __early: boolean }).__early =
          document.documentElement.hasAttribute("data-garden");
      }),
    );
    await seedJournal(page, [entry("accueil-1", 4.1, 60)]);
    await page.goto("/");
    expect(
      await page.evaluate(
        () => (window as unknown as { __early: boolean }).__early,
      ),
    ).toBe(true);
    await expect(page.locator("html")).toHaveAttribute("data-garden", "");

    const back = page.getByRole("link", { name: "Retrouver mon jardin" });
    await expect(back).toBeVisible();
    await expect(back).toHaveAttribute("href", "/jardin");
    const grow = page.getByRole("link", { name: "Faire pousser une plante" });
    await expect(grow).toHaveAttribute("href", "/comparer");
    await expect(page.getByRole("link", { name: "Commencer" })).toHaveCount(0);
    // Le petit lien « Le retrouver » ferait doublon : parti.
    await expect(
      page.getByRole("link", { name: /J’ai déjà un jardin/ }),
    ).toHaveCount(0);
    // L'action principale vient en premier, au clavier aussi.
    const order = await page
      .locator("main a:visible")
      .evaluateAll((links) => links.map((link) => link.textContent));
    expect(order.indexOf("Retrouver mon jardin")).toBeLessThan(
      order.indexOf("Faire pousser une plante"),
    );
    expect(await actions(page).boundingBox()).toEqual(before);
    await expectNoAxeViolations(page);

    // « Faire pousser une plante » mène au même endroit que le bouton jaune de /jardin.
    await page.waitForLoadState("networkidle");
    await page.goto("/jardin");
    await expect(page.locator("[data-grow-plant]")).toHaveAttribute(
      "href",
      "/comparer",
    );
  });

  test("en anglais, avec un jardin", async ({ page }) => {
    await seedJournal(page, [entry("accueil-1", 4.1, 60)]);
    await page.goto("/en");
    await expect(
      page.getByRole("link", { name: "Back to my garden" }),
    ).toHaveAttribute("href", "/en/garden");
    await expect(
      page.getByRole("link", { name: "Grow a plant" }),
    ).toHaveAttribute("href", "/en/compare");
    await expect(
      page.getByRole("link", { name: "Start comparing" }),
    ).toHaveCount(0);
  });
});
