import AxeBuilder from "@axe-core/playwright";
import { test as base, expect, type Page } from "@playwright/test";

/**
 * Chaque test échoue si la console affiche une erreur : exception, ressource refusée par la
 * Content-Security-Policy (public/_headers), etc. Le texte complet de chaque erreur (avec
 * son emplacement, l'adresse de la page et, pour une exception, la pile) est joint au rapport
 * Playwright (`erreurs-console.txt`), y compris pour les erreurs tolérées ensuite.
 */
export const test = base.extend<{ consoleErrors: string[] }>({
  // Un test qui ouvre volontairement une page inexistante vide ce tableau après la navigation :
  // le statut 404 du document y est attendu.
  consoleErrors: [
    async ({ page }, use, testInfo) => {
      const errors: string[] = [];
      const details: string[] = [];
      const record = (summary: string, lines: string[]) => {
        errors.push(summary);
        details.push(
          [
            `[${new Date().toISOString()}] ${testInfo.project.name}`,
            `page : ${page.url()}`,
            ...lines,
          ].join("\n"),
        );
      };
      page.on("console", (message) => {
        if (message.type() !== "error") return;
        const { url, lineNumber, columnNumber } = message.location();
        record(message.text(), [
          `console.error : ${message.text()}`,
          `emplacement : ${url || "(inconnu)"}:${lineNumber}:${columnNumber}`,
        ]);
      });
      page.on("pageerror", (error) =>
        record(error.message, [
          `exception : ${error.name}: ${error.message}`,
          `pile :\n${error.stack ?? "(aucune)"}`,
        ]),
      );
      await use(errors);
      if (details.length > 0) {
        await testInfo.attach("erreurs-console.txt", {
          body: details.join("\n\n"),
          contentType: "text/plain",
        });
      }
      expect(errors, "erreurs dans la console").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/** Carnet de test déposé avant le chargement de la page (clé lpdc:journal:v1). */
export async function seedJournal(page: Page, entries: object[]) {
  // Une seule fois par onglet : un rechargement ne réinjecte pas le carnet.
  await page.addInitScript((value) => {
    if (window.sessionStorage.getItem("e2e:seeded")) return;
    window.sessionStorage.setItem("e2e:seeded", "1");
    window.localStorage.setItem(
      "lpdc:journal:v1",
      JSON.stringify({ version: 1, entries: value }),
    );
  }, entries);
}

export function entry(id: string, avoidedKg: number, minutesAgo = 5) {
  return {
    id,
    date: new Date(Date.now() - minutesAgo * 60_000).toISOString(),
    gestureA: "avion",
    gestureB: "tgv",
    quantity: 300,
    chosen: avoidedKg > 0 ? "b" : "a",
    avoidedKg,
  };
}

/**
 * Réponse d'erreur attendue (lien déjà utilisé, limite atteinte, session supprimée…) : le
 * navigateur l'écrit en console (« status of 400 ») ; seules ces lignes sont tolérées.
 */
export function acceptStatus(errors: string[], ...statuses: number[]) {
  const others = errors.filter(
    (message) =>
      !statuses.some((status) => message.includes(`status of ${status}`)),
  );
  errors.splice(0, errors.length, ...others);
}

/**
 * WebKit écrit en console le préchargement d'une page (fichier RSC de Next) interrompu par une
 * navigation (« … due to access control checks. ») ; seules ces lignes sont tolérées.
 */
export function acceptCancelledPrefetch(errors: string[]) {
  const others = errors.filter(
    (message) =>
      !/__next\.[^ ]*\.txt\?[^ ]*_rsc=[^ ]* due to access control checks\.$/.test(
        message,
      ),
  );
  errors.splice(0, errors.length, ...others);
}

export async function expectNoAxeViolations(page: Page) {
  // Les apparitions (fondu, pop) doivent être finies : un texte encore en fondu fausserait
  // la mesure de contraste.
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter(
          (animation) =>
            animation.effect?.getComputedTiming().iterations !== Infinity,
        )
        // Une animation annulée (élément retiré entre-temps) rejette avec AbortError.
        .map((animation) => animation.finished.catch(() => undefined)),
    ),
  );
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const summary = results.violations.map(
    (v) => `${v.id} : ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
  );
  expect(summary).toEqual([]);
}

/** Après la visite volontaire d'une page inexistante : seul le 404 du document est toléré. */
export function acceptDocument404(errors: string[]) {
  const others = errors.filter((message) => !message.includes("status of 404"));
  errors.splice(0, errors.length, ...others);
}

/** Appuie sur Tab jusqu'à atteindre l'élément dont le texte contient `text`. */
export async function tabTo(page: Page, text: string, max = 40) {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(
      () => document.activeElement?.textContent?.trim() ?? "",
    );
    if (focused.includes(text)) return;
  }
  throw new Error(`« ${text} » n'a pas été atteint au clavier`);
}
