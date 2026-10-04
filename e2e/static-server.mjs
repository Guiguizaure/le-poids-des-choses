// Serveur de test de l'export statique (out/), au plus près de Cloudflare Pages :
// URL sans extension (/methode → methode.html), 404.html pour les pages inconnues, et
// en-têtes de public/_headers (CSP comprise). Utilisé par Playwright.
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const ROOT = new URL("../out/", import.meta.url).pathname;
const PORT = Number(process.env.PORT ?? 4323);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

/** Lit le format _headers de Cloudflare Pages : motif, puis lignes « Nom: valeur » indentées. */
export function parseHeaders(text) {
  const rules = [];
  for (const line of text.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (!/^\s/.test(line)) rules.push({ pattern: line.trim(), headers: {} });
    else if (rules.length) {
      const index = line.indexOf(":");
      rules.at(-1).headers[line.slice(0, index).trim()] = line
        .slice(index + 1)
        .trim();
    }
  }
  return rules;
}

const rules = parseHeaders(readFileSync(join(ROOT, "_headers"), "utf8"));
const matches = (pattern, path) =>
  new RegExp(
    `^${pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`,
  ).test(path);

function resolve(path) {
  const clean = normalize(decodeURIComponent(path)).replace(
    /^(\.\.[/\\])+/,
    "",
  );
  const candidates = clean.endsWith("/")
    ? [
        join(ROOT, clean, "index.html"),
        join(ROOT, clean.replace(/\/$/, "") + ".html"),
      ]
    : [
        join(ROOT, clean),
        join(ROOT, clean + ".html"),
        join(ROOT, clean, "index.html"),
      ];
  return candidates.find((file) => existsSync(file) && statSync(file).isFile());
}

createServer((request, response) => {
  const path = new URL(request.url, "http://localhost").pathname;
  const file = resolve(path === "/" ? "/index.html" : path);
  const status = file ? 200 : 404;
  const served = file ?? join(ROOT, "404.html");
  const headers = {
    "Content-Type": TYPES[extname(served)] ?? "application/octet-stream",
  };
  for (const rule of rules)
    if (matches(rule.pattern, path)) Object.assign(headers, rule.headers);
  response.writeHead(status, headers);
  createReadStream(served).pipe(response);
}).listen(PORT, () => console.log(`Export servi sur http://localhost:${PORT}`));
