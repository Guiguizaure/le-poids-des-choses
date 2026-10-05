import {
  acceptDocument404,
  entry,
  expect,
  expectNoAxeViolations,
  seedJournal,
  tabTo,
  test,
} from "./fixtures";

const PAGES = [
  { name: "accueil", path: "/", heading: "Le poids des choses" },
  {
    name: "choix des gestes",
    path: "/comparer",
    heading: "Que veux-tu comparer ?",
  },
  {
    name: "duel",
    path: "/comparer?a=tgv&b=avion&q=300",
    heading: "Lequel pèse le moins ?",
  },
  {
    name: "duel objet",
    path: "/comparer?objet=jean",
    heading: "Neuf, d’occasion, ou tu gardes le tien ?",
  },
  { name: "jardin vide", path: "/jardin", heading: "Mon jardin" },
  { name: "de saison", path: "/saison", heading: /^De saison en / },
  {
    name: "de saison (mai)",
    path: "/saison?mois=5",
    heading: "De saison en mai",
  },
  { name: "méthode", path: "/methode", heading: "Méthode et sources" },
  {
    name: "mentions légales",
    path: "/mentions-legales",
    heading: "Mentions légales",
  },
  {
    name: "confidentialité",
    path: "/confidentialite",
    heading: "Confidentialité",
  },
  {
    name: "connexion (lien absent)",
    path: "/connexion",
    heading: "Ce lien ne marche plus",
  },
  {
    name: "page 404",
    path: "/page-introuvable",
    heading: "Cette page s’est perdue dans la brume",
  },
  { name: "labo", path: "/labo", heading: "Labo" },
];

test.describe("axe (WCAG 2.1 AA)", () => {
  for (const { name, path, heading } of PAGES) {
    test(name, async ({ page, consoleErrors }) => {
      await page.goto(path);
      await expect(
        page.getByRole("heading", { level: 1, name: heading }),
      ).toBeVisible();
      if (name === "page 404") acceptDocument404(consoleErrors);
      await expectNoAxeViolations(page);
    });
  }

  test("jardin avec un carnet", async ({ page }) => {
    await seedJournal(page, [
      entry("a", 66.5),
      entry("b", 4.1, 4),
      entry("c", 0, 3),
    ]);
    await page.goto("/jardin");
    await expect(page.getByRole("heading", { name: "Carnet" })).toBeVisible();
    await expectNoAxeViolations(page);
  });

  test("jardin avec l'oiseau (bouton d'envol) et « Le savais-tu ? »", async ({
    page,
  }) => {
    await seedJournal(
      page,
      Array.from({ length: 5 }, (_, i) =>
        entry(`axe-oiseau-${i}`, 4.1, 10 + i),
      ),
    );
    await page.goto("/jardin");
    await expect(
      page.getByRole("button", { name: "Faire s’envoler l’oiseau" }),
    ).toBeVisible();
    await expect(
      page.getByRole("complementary", { name: "Le savais-tu ?" }),
    ).toBeVisible();
    await expectNoAxeViolations(page);
  });

  test("écran de résultat (choix léger)", async ({ page }) => {
    await page.goto("/comparer?a=tgv&b=avion&q=300");
    await page.getByRole("button", { name: "Je choisis le TGV" }).click();
    await expect(
      page.getByRole("heading", { name: /va pousser dans ton jardin/ }),
    ).toBeVisible();
    await expect(page.getByText("Et un papillon arrive !")).toBeVisible();
    await expectNoAxeViolations(page);
  });
});

test.describe("focus visible", () => {
  test.skip(
    ({ browserName }) => browserName === "webkit",
    "WebKit ne parcourt pas les liens avec Tab par défaut",
  );

  for (const { name, path, heading } of PAGES.filter(
    (p) => p.name !== "labo",
  )) {
    test(name, async ({ page, consoleErrors }) => {
      await page.goto(path);
      await expect(
        page.getByRole("heading", { level: 1, name: heading }),
      ).toBeVisible();
      if (name === "page 404") acceptDocument404(consoleErrors);
      for (let i = 0; i < 12; i++) {
        await page.keyboard.press("Tab");
        const focus = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return null;
          const style = getComputedStyle(el);
          const outline =
            style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0;
          // Champs visuellement masqués (radio, interrupteur) : l'anneau est porté par le parent.
          const proxy = el.classList.contains("sr-only")
            ? getComputedStyle(el.parentElement!).outlineStyle !== "none" ||
              getComputedStyle(el.nextElementSibling ?? el).outlineStyle !==
                "none"
            : false;
          return {
            label:
              el.textContent?.trim().slice(0, 40) ||
              el.getAttribute("aria-label") ||
              el.tagName,
            visible: outline || proxy,
          };
        });
        if (!focus) break;
        expect(focus.visible, `focus visible sur « ${focus.label} »`).toBe(
          true,
        );
      }
    });
  }
});

test.describe("parcours complet au clavier", () => {
  test.skip(
    ({ browserName }) => browserName === "webkit",
    "WebKit ne parcourt pas les liens avec Tab par défaut",
  );

  test("de l'accueil au jardin sans souris", async ({ page }) => {
    await page.goto("/");
    await tabTo(page, "Commencer");
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("heading", { name: "Que veux-tu comparer ?" }),
    ).toBeVisible();

    await tabTo(page, "TGV");
    await page.keyboard.press("Space");
    await expect(page.getByRole("button", { name: /^TGV/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await tabTo(page, "Avion");
    await page.keyboard.press("Enter");
    await tabTo(page, "Comparer");
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("heading", { name: "Lequel pèse le moins ?" }),
    ).toBeFocused();

    // Le curseur de distance se règle aux flèches.
    await tabTo(page, "");
    await page.getByRole("slider", { name: /Distance/ }).focus();
    await page.keyboard.press("ArrowRight");
    await tabTo(page, "Je choisis le TGV");
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("heading", { name: /va pousser dans ton jardin/ }),
    ).toBeFocused();

    await tabTo(page, "Aller la planter");
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("heading", { name: "Mon jardin" }),
    ).toBeVisible();
    await expect(page.getByText("TGV plutôt qu’avion")).toBeVisible();
  });
});
