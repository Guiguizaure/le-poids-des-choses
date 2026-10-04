// `pnpm lighthouse` (JavaScript pur : tsx injecte des aides que Lighthouse ne sait pas
// exécuter dans la page) : scores Lighthouse (profil mobile) des pages principales, sur l'export
// statique servi en local (`pnpm build` puis `pnpm serve:out`, ou BASE_URL=…).
// Construire avec SITE_LAUNCHED=1 pour mesurer le SEO tel qu'il sera au lancement.
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

const BASE = (process.env.BASE_URL ?? "http://localhost:4322").replace(
  /\/$/,
  "",
);
const PAGES = [
  ["Accueil", "/"],
  ["Comparer (choix des gestes)", "/comparer"],
  ["Duel (TGV, avion)", "/comparer?a=tgv&b=avion&q=300"],
  ["Mon jardin", "/jardin"],
  ["Méthode", "/methode"],
];
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
