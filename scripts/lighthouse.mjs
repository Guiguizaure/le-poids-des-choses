// `pnpm lighthouse` (JavaScript pur : tsx injecte des aides que Lighthouse ne sait pas
// exécuter dans la page) : scores Lighthouse (profil mobile) des pages principales, sur l'export
// statique servi en local (`pnpm build` puis `pnpm serve:out` : le serveur des tests de bout en
// bout, en-têtes et CSP compris, qui répond `{ enabled: false }` à GET /api/raconte ; ou
// BASE_URL=…). LH_PATHS=/,/comparer,/jardin : seulement ces adresses.
// Construire avec SITE_LAUNCHED=1 pour mesurer le SEO tel qu'il sera au lancement ; sans elle,
// le SEO est mesuré avec le noindex. LH_LANG=fr ou LH_LANG=en : une seule langue.
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

const BASE = (process.env.BASE_URL ?? "http://localhost:4322").replace(
  /\/$/,
  "",
);
const ALL_PAGES = [
  ["Accueil", "/"],
  ["Comparer (choix des gestes)", "/comparer"],
  ["Duel (TGV, avion)", "/comparer?a=tgv&b=avion&q=300"],
  ["Mon jardin", "/jardin"],
  ["Carnet", "/jardin/carnet"],
  ["De saison", "/saison"],
  ["Méthode", "/methode"],
  ["Home (en)", "/en"],
  ["Compare (en)", "/en/compare"],
  ["Duel (en)", "/en/compare?a=tgv&b=avion&q=300"],
  ["My garden (en)", "/en/garden"],
  ["Journal (en)", "/en/garden/journal"],
  ["In season (en)", "/en/in-season"],
  ["Method (en)", "/en/method"],
];
const LANG = process.env.LH_LANG;
const PATHS = process.env.LH_PATHS?.split(",").map((path) => path.trim());
const PAGES = ALL_PAGES.filter(([, path]) =>
  PATHS
    ? PATHS.includes(path)
    : LANG === "en"
      ? path.startsWith("/en")
      : LANG === "fr"
        ? !path.startsWith("/en")
        : true,
);
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

async function main() {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless=new"],
  });
  const rows = [];
  try {
    for (const [label, path] of PAGES) {
      const result = await lighthouse(`${BASE}${path}`, {
        port: chrome.port,
        output: "json",
        logLevel: "error",
        onlyCategories: CATEGORIES,
      });
      const lhr = result.lhr;
      const scores = CATEGORIES.map((id) =>
        Math.round((lhr.categories[id].score ?? 0) * 100),
      );
      rows.push(`| ${label} | ${scores.join(" | ")} |`);
      if (process.env.LH_DETAILS) {
        for (const id of CATEGORIES) {
          for (const ref of lhr.categories[id].auditRefs) {
            const audit = lhr.audits[ref.id];
            if (ref.weight > 0 && audit.score !== null && audit.score < 0.9) {
              console.log(
                `  [${label}] ${id} · ${audit.id} (${audit.score}) ${audit.displayValue ?? ""}`,
              );
            }
          }
        }
      }
    }
  } finally {
    await chrome.kill();
  }
  console.log(
    "| Page | Performance | Accessibilité | Bonnes pratiques | SEO |",
  );
  console.log("| --- | --- | --- | --- | --- |");
  rows.forEach((row) => console.log(row));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
