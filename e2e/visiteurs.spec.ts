// Visiteurs du jardin vivant pendant la pousse d'une nouvelle plante : aucun ne saute. Ceux que
// la plante ne gêne pas gardent exactement leur place ; celui qu'elle gêne rejoint la nouvelle
// avec sa démarche (l'écureuil bondit) ; en mouvement réduit, un fondu court à la nouvelle place.
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

// Automne, 13 h à Paris : l'écureuil est éveillé, le renard dort, les champignons poussent.
test.use({ timezoneId: "Europe/Paris" });
const AT = Date.parse("2026-10-11T11:00:00Z");

/** Carnet trouvé avec le modèle (src/lib/garden/visitors.ts) : la nouvelle plante prend la
 *  place de l'écureuil, pas celle des champignons ni du renard. */
const choice = (id: string, avoidedKg: number, minutesAgo: number) => ({
  id,
  date: new Date(AT - minutesAgo * 60_000).toISOString(),
  gestureA: "avion",
  gestureB: "tgv",
  quantity: 300,
  chosen: "b",
  avoidedKg,
});
const JOURNAL = [
  choice("v3-a", 3, 300),
  choice("v3-b", 0.6, 240),
  choice("v3-c", 8, 180),
  choice("v3-new", 2, 1),
];

type Frame = {
  t: number;
  // Coin haut gauche (px, dans la scène), opacité (0 si caché).
  row: Record<string, [number, number, number]>;
  plants: number;
};

/**
 * Relève, à chaque image et dès le chargement, la place de chaque animal et visiteur dans la
 * scène : l'arrivée de la page (`animate-enter`) déplace toute la scène de quelques pixels sur
 * les premières images, ce n'est pas un animal qui bouge.
 */
async function trackScene(page: Page) {
  await page.addInitScript({
    content: `
      window.localStorage.setItem("lpdc:journal:v1", JSON.stringify({ version: 1, entries: ${JSON.stringify(JOURNAL)} }));
      window.__frames = [];
      function frame() {
        var row = {};
        document.querySelectorAll("[data-animal],[data-visitor]").forEach(function (el) {
          var r = el.getBoundingClientRect();
          var scene = el.offsetParent ? el.offsetParent.getBoundingClientRect() : r;
          var style = getComputedStyle(el);
          row[el.dataset.animal || el.dataset.visitor] = [
            r.x - scene.x, r.y - scene.y,
            style.visibility === "hidden" ? 0 : Number(style.opacity),
          ];
        });
        window.__frames.push({
          t: performance.now(), row: row,
          plants: document.querySelectorAll("[data-plant]").length,
        });
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);`,
  });
}

async function revealAndRecord(page: Page): Promise<Frame[]> {
  await page.clock.install({ time: new Date(AT) });
  await trackScene(page);
  await page.goto("/jardin?nouveau=v3-new");
  await expect(page.locator('[data-plant="v3-new"]')).toBeAttached();
  // Pousse (0,7 s après l'affichage), puis le plus long trajet possible (4 s).
  await page.waitForTimeout(5_000);
  return page.evaluate(
    () => (window as unknown as { __frames: Frame[] }).__frames,
  );
}

const visible = (cell?: [number, number, number]) => !!cell && cell[2] > 0.05;

/**
 * Plus grand déplacement visible d'une image à l'autre, ramené à une image de 1/60 s. Le relevé
 * passe avant GSAP à chaque image (premier rappel inscrit) : la place lue à l'image i est celle
 * que GSAP a posée à l'image i − 1. Le pas entre deux relevés s'est donc fait pendant
 * l'intervalle précédent ; sans ce décalage, un trajet qui démarre juste après une image longue
 * (la plante qui apparaît) semblait faire en 16 ms le chemin de 70.
 */
function largestStep(frames: Frame[], who: string) {
  let largest = 0;
  for (let i = 1; i < frames.length; i++) {
    const [a, b] = [frames[i - 1].row[who], frames[i].row[who]];
    if (!visible(a) || !visible(b)) continue;
    const step = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const before = frames[Math.max(0, i - 2)];
    const frames60 = Math.max(1, (frames[i - 1].t - before.t) / (1000 / 60));
    largest = Math.max(largest, step / frames60);
  }
  return largest;
}

const placeOf = (frames: Frame[], who: string, at: "first" | "last") => {
  const list = frames.filter((frame) => frame.row[who]);
  const cell = (at === "first" ? list[0] : list.at(-1))!.row[who];
  return { x: cell[0], y: cell[1] };
};

test("pendant la pousse, aucun animal ne saute ; l'écureuil gêné rejoint sa place en bondissant", async ({
  page,
}) => {
  const frames = await revealAndRecord(page);
  // La scène a bien été relevée avant la pousse (3 plantes), puis pendant (4).
  expect(frames.some((frame) => frame.plants === 3)).toBe(true);
  expect(frames.at(-1)!.plants).toBe(4);
  const who = Object.keys(frames.at(-1)!.row);
  expect(who).toEqual(
    expect.arrayContaining(["ecureuil", "champignons", "renard", "butterfly"]),
  );

  for (const name of who)
    expect(largestStep(frames, name), name).toBeLessThan(6);

  // L'écureuil a changé de place, en bondissant (il est passé au-dessus de la ligne droite).
  const [start, end] = [
    placeOf(frames, "ecureuil", "first"),
    placeOf(frames, "ecureuil", "last"),
  ];
  expect(Math.hypot(end.x - start.x, end.y - start.y)).toBeGreaterThan(20);
  const lowest = Math.max(start.y, end.y);
  expect(
    frames.some(
      (frame) => frame.row.ecureuil && frame.row.ecureuil[1] < lowest - 3,
    ),
  ).toBe(true);
  // Les autres gardent exactement leur place.
  for (const name of who.filter((name) => name !== "ecureuil")) {
    const [a, b] = [
      placeOf(frames, name, "first"),
      placeOf(frames, name, "last"),
    ];
    if (name === "butterfly") continue; // il volette (et la rafale le déporte)
    expect(Math.abs(b.x - a.x) + Math.abs(b.y - a.y), name).toBeLessThan(1);
  }
});

test("mouvement réduit : l'écureuil ne se déplace qu'effacé, puis revient à sa nouvelle place", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const frames = await revealAndRecord(page);
  for (const name of Object.keys(frames.at(-1)!.row))
    expect(largestStep(frames, name), name).toBeLessThan(1);
  const [start, end] = [
    placeOf(frames, "ecureuil", "first"),
    placeOf(frames, "ecureuil", "last"),
  ];
  expect(Math.hypot(end.x - start.x, end.y - start.y)).toBeGreaterThan(20);
  // Un fondu : il a été effacé un instant, puis il est revenu.
  expect(frames.some((frame) => frame.row.ecureuil?.[2] === 0)).toBe(true);
  expect(frames.at(-1)!.row.ecureuil[2]).toBe(1);
});
