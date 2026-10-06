// Routes de l'API sur une D1 locale, avec un faux Resend et un faux Turnstile : `fetch` est
// remplacé, aucun vrai e-mail n'est envoyé et aucun service extérieur n'est appelé.
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import type { ComparisonEntry, JournalEntry } from "../src/lib/data/types";
import { LINK_TTL_MS, SESSION_COOKIE } from "./config";
import type { D1Database, Env } from "./env";
import {
  handleDeleteAccount,
  handleExport,
  handleLink,
  handleLogout,
  handleSession,
  handleSync,
  handleVerify,
  type RouteContext,
} from "./handlers";
import { createTestDb } from "./testing/d1";

const ORIGIN = "https://lepoidsdeschoses.com";
const FAKE_RESEND = "https://faux-resend.test";
const FAKE_VERIFY = "https://faux-turnstile.test/siteverify";
const NOW = Date.UTC(2026, 9, 5, 12);

let db: D1Database;
let reset: () => Promise<void>;
let dispose: () => Promise<void>;
let env: Env;
let mails: { to: string[]; subject: string; text: string; html: string }[];
let fetchCalls: string[];

beforeAll(async () => {
  ({ db, reset, dispose } = await createTestDb());
});
afterAll(() => dispose());

beforeEach(async () => {
  await reset();
  env = {
    DB: db,
    RESEND_API_KEY: "re_test",
    RESEND_API_URL: FAKE_RESEND,
    TURNSTILE_SECRET_KEY: "secret-test",
    TURNSTILE_VERIFY_URL: FAKE_VERIFY,
    HASH_SECRET: "hash-test",
  };
  mails = [];
  fetchCalls = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL, init?: RequestInit) => {
      const url = String(input);
      fetchCalls.push(url);
      if (url === `${FAKE_RESEND}/emails`) {
        mails.push(JSON.parse(String(init?.body)));
        return Response.json({ id: "faux" });
      }
      if (url === FAKE_VERIFY) {
        const token = new URLSearchParams(String(init?.body)).get("response");
        return Response.json({ success: token === "ok" });
      }
      throw new Error(`Appel extérieur inattendu : ${url}`);
    }),
  );
});
afterEach(() => vi.unstubAllGlobals());

function context(
  path: string,
  {
    method = "POST",
    body,
    cookie,
    origin = ORIGIN,
    ip = "203.0.113.7",
    base = ORIGIN,
  }: {
    method?: string;
    body?: unknown;
    cookie?: string | null;
    origin?: string | null;
    ip?: string;
    base?: string;
  } = {},
): RouteContext {
  const headers: Record<string, string> = { "CF-Connecting-IP": ip };
  if (origin) headers.Origin = origin;
  if (cookie) headers.Cookie = `${SESSION_COOKIE}=${cookie}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  return {
    request: new Request(`${base}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    }),
    env,
  };
}

const requestLink = (
  email: string,
  options: Parameters<typeof context>[1] = {},
) =>
  handleLink(
    context("/api/auth/link", {
      body: { email, turnstileToken: "ok" },
      ...options,
    }),
    NOW,
  );

function tokenFromMail(index = mails.length - 1): string {
  const match = mails[index].text.match(
    /\/connexion#jeton=([A-Za-z0-9_-]{43})/,
  );
  if (!match) throw new Error("Lien absent du mail");
  return match[1];
}

function sessionFrom(response: Response): string {
  const cookie = response.headers.get("Set-Cookie") ?? "";
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  if (!match) throw new Error("Cookie absent");
  return match[1];
}

async function signIn(email = "camille@exemple.fr", at = NOW) {
  await requestLink(email);
  const response = await handleVerify(
    context("/api/auth/verify", { body: { token: tokenFromMail() } }),
    at,
  );
  return sessionFrom(response);
}

function entry(
  id: string,
  over: Partial<ComparisonEntry> = {},
): ComparisonEntry {
  return {
    id,
    date: "2026-10-01T10:00:00.000Z",
    gestureA: "tgv",
    gestureB: "avion",
    quantity: 50,
    chosen: "a",
    avoidedKg: 12.5,
    ...over,
  };
}

describe("POST /api/auth/link", () => {
  it("envoie un lien vers l'origine de la requête, valable 15 min, en français", async () => {
    const response = await requestLink("  Camille@Exemple.fr ");
    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ ok: true });
    expect(mails).toHaveLength(1);
    expect(mails[0]).toMatchObject({
      to: ["camille@exemple.fr"],
      subject: "Ton lien pour retrouver ton jardin",
    });
    expect(mails[0].text).toContain(`${ORIGIN}/connexion#jeton=`);
    expect(mails[0].text).toContain("valable 15 minutes");
    expect(mails[0].html).toContain(`href="${ORIGIN}/connexion#jeton=`);
  });

  it("demandé depuis une page anglaise : e-mail en anglais, lien vers /en/sign-in", async () => {
    const response = await requestLink("sam@example.com", {
      body: { email: "sam@example.com", turnstileToken: "ok", locale: "en" },
    });
    expect(response.status).toBe(202);
    expect(mails[0].subject).toBe("Your link to find your garden");
    expect(mails[0].text).toContain(`${ORIGIN}/en/sign-in#jeton=`);
    expect(mails[0].text).toContain("valid for 15 minutes");
    expect(mails[0].html).toContain('<html lang="en">');
    expect(mails[0].html).toContain(`href="${ORIGIN}/en/sign-in#jeton=`);
    // Le jeton se vérifie comme un autre.
    const token = mails[0].text.match(/#jeton=([A-Za-z0-9_-]{43})/)![1];
    const verified = await handleVerify(
      context("/api/auth/verify", { body: { token } }),
      NOW,
    );
    expect(verified.status).toBe(200);
  });

  it("langue inconnue : e-mail en français", async () => {
    await requestLink("a@exemple.fr", {
      body: { email: "a@exemple.fr", turnstileToken: "ok", locale: "de" },
    });
    expect(mails[0].subject).toBe("Ton lien pour retrouver ton jardin");
    expect(mails[0].text).toContain(`${ORIGIN}/connexion#jeton=`);
  });

  it("preview : le lien garde l'adresse de la preview", async () => {
    const preview = "https://feat-comptes.le-poids-des-choses.pages.dev";
    await requestLink("a@exemple.fr", { origin: preview, base: preview });
    expect(mails[0].text).toContain(`${preview}/connexion#jeton=`);
  });

  it("même réponse que l'adresse ait un compte ou non", async () => {
    await signIn("camille@exemple.fr");
    const known = await requestLink("camille@exemple.fr");
    const unknown = await requestLink("personne@exemple.fr");
    expect(known.status).toBe(unknown.status);
    expect(await known.text()).toBe(await unknown.text());
    expect(mails.at(-1)?.subject).toBe(mails.at(-2)?.subject);
  });

  it("refuse une origine absente, étrangère ou hors liste", async () => {
    for (const options of [
      { origin: null },
      { origin: "https://evil.com" },
      { origin: "https://evil.com", base: "https://evil.com" },
      { origin: "http://localhost:8790", base: "http://localhost:8790" },
    ]) {
      const response = await requestLink("a@exemple.fr", options);
      expect(response.status).toBe(403);
      expect(await response.json()).toEqual({ error: "origin" });
    }
    expect(mails).toEqual([]);
  });

  it("localhost accepté seulement avec ALLOW_LOCALHOST=1", async () => {
    env.ALLOW_LOCALHOST = "1";
    const local = "https://localhost:8790";
    expect(
      (await requestLink("a@exemple.fr", { origin: local, base: local }))
        .status,
    ).toBe(202);
  });

  it("adresse invalide, Turnstile refusé", async () => {
    expect((await requestLink("pas-une-adresse")).status).toBe(400);
    const refused = await handleLink(
      context("/api/auth/link", {
        body: { email: "a@exemple.fr", turnstileToken: "non" },
      }),
      NOW,
    );
    expect(refused.status).toBe(400);
    expect(await refused.json()).toEqual({ error: "turnstile" });
    expect(mails).toEqual([]);
  });

  it("limites : 3 liens par adresse en 15 min, 10 par IP", async () => {
    const statuses = [];
    for (let i = 0; i < 4; i += 1)
      statuses.push(
        (await requestLink("a@exemple.fr", { ip: `198.51.100.${i}` })).status,
      );
    expect(statuses).toEqual([202, 202, 202, 429]);

    const byIp = [];
    for (let i = 0; i < 11; i += 1)
      byIp.push(
        (await requestLink(`p${i}@exemple.fr`, { ip: "192.0.2.1" })).status,
      );
    expect(byIp.slice(0, 10).every((status) => status === 202)).toBe(true);
    expect(byIp[10]).toBe(429);
  });

  it("ni l'e-mail ni l'IP ne sont stockés en clair dans les compteurs", async () => {
    await requestLink("camille@exemple.fr");
    const rows = await db.prepare("SELECT bucket FROM rate_limits").all();
    const text = JSON.stringify(rows.results);
    expect(text).not.toContain("camille");
    expect(text).not.toContain("203.0.113.7");
  });

  it("service non configuré : 503 sans rien envoyer", async () => {
    delete env.RESEND_API_KEY;
    expect((await requestLink("a@exemple.fr")).status).toBe(503);
    expect(fetchCalls).toEqual([]);
  });

  it("Resend en erreur : 502", async () => {
    vi.stubGlobal("fetch", async (input: string) =>
      String(input) === FAKE_VERIFY
        ? Response.json({ success: true })
        : new Response("non", { status: 500 }),
    );
    const response = await requestLink("a@exemple.fr");
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "mail" });
  });
});

describe("POST /api/auth/verify", () => {
  it("connecte : cookie HttpOnly, Secure, SameSite=Lax, 90 jours", async () => {
    await requestLink("camille@exemple.fr");
    const response = await handleVerify(
      context("/api/auth/verify", { body: { token: tokenFromMail() } }),
      NOW,
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ email: "camille@exemple.fr" });
    const cookie = response.headers.get("Set-Cookie") ?? "";
    expect(cookie).toMatch(/^__Host-lpdc_session=[A-Za-z0-9_-]{43}; /);
    for (const part of [
      "Path=/",
      "HttpOnly",
      "Secure",
      "SameSite=Lax",
      `Max-Age=${90 * 24 * 3600}`,
    ])
      expect(cookie).toContain(part);
  });

  it("lien réutilisé ou expiré : refusé", async () => {
    await requestLink("camille@exemple.fr");
    const token = tokenFromMail();
    const verify = (at: number) =>
      handleVerify(context("/api/auth/verify", { body: { token } }), at);
    expect((await verify(NOW + 1000)).status).toBe(200);
    const again = await verify(NOW + 2000);
    expect(again.status).toBe(400);
    expect(await again.json()).toEqual({ error: "invalid-link" });

    await requestLink("dominique@exemple.fr");
    const late = await handleVerify(
      context("/api/auth/verify", { body: { token: tokenFromMail() } }),
      NOW + LINK_TTL_MS,
    );
    expect(late.status).toBe(400);
  });

  it("vérifie l'origine", async () => {
    await requestLink("camille@exemple.fr");
    const response = await handleVerify(
      context("/api/auth/verify", {
        body: { token: tokenFromMail() },
        origin: "https://evil.com",
      }),
      NOW,
    );
    expect(response.status).toBe(403);
  });
});

describe("session, synchro, export, déconnexion, suppression", () => {
  it("parcours complet entre deux appareils", async () => {
    const phone = await signIn("camille@exemple.fr");
    const session = await handleSession(
      context("/api/auth/session", {
        method: "GET",
        cookie: phone,
        origin: null,
      }),
      NOW,
    );
    expect(await session.json()).toEqual({
      signedIn: true,
      email: "camille@exemple.fr",
    });

    const first = await handleSync(
      context("/api/journal/sync", {
        cookie: phone,
        body: { since: 0, entries: [entry("a"), entry("b")] },
      }),
      NOW,
    );
    expect(first.status).toBe(200);

    const laptop = await signIn("camille@exemple.fr");
    const second = await handleSync(
      context("/api/journal/sync", {
        cookie: laptop,
        body: { since: 0, entries: [entry("c")] },
      }),
      NOW,
    );
    const data = await second.json();
    expect(data.entries.map((e: JournalEntry) => e.id)).toEqual([
      "a",
      "b",
      "c",
    ]);

    const exported = await handleExport(
      context("/api/account/export", {
        method: "GET",
        cookie: laptop,
        origin: null,
      }),
      NOW,
    );
    expect(exported.headers.get("Content-Disposition")).toBe(
      'attachment; filename="le-poids-des-choses-compte-2026-10-05.json"',
    );
    expect((await exported.json()).entries).toHaveLength(3);

    const logout = await handleLogout(
      context("/api/auth/logout", { cookie: laptop, body: {} }),
      NOW,
    );
    expect(logout.headers.get("Set-Cookie")).toContain("Max-Age=0");
    const after = await handleSession(
      context("/api/auth/session", {
        method: "GET",
        cookie: laptop,
        origin: null,
      }),
      NOW,
    );
    expect(await after.json()).toEqual({ signedIn: false });
  });

  it("synchro et export exigent une session ; synchro exige l'origine", async () => {
    expect(
      (
        await handleSync(
          context("/api/journal/sync", { body: { since: 0 } }),
          NOW,
        )
      ).status,
    ).toBe(401);
    expect(
      (
        await handleExport(
          context("/api/account/export", { method: "GET" }),
          NOW,
        )
      ).status,
    ).toBe(401);
    const cookie = await signIn();
    const foreign = await handleSync(
      context("/api/journal/sync", {
        cookie,
        body: { since: 0 },
        origin: "https://evil.com",
      }),
      NOW,
    );
    expect(foreign.status).toBe(403);
  });

  it("corps non JSON refusé", async () => {
    const cookie = await signIn();
    const response = await handleSync(
      {
        request: new Request(`${ORIGIN}/api/journal/sync`, {
          method: "POST",
          headers: {
            Origin: ORIGIN,
            Cookie: `${SESSION_COOKIE}=${cookie}`,
            "Content-Type": "text/plain",
          },
          body: "{}",
        }),
        env,
      },
      NOW,
    );
    expect(response.status).toBe(415);
  });

  it("suppression : confirmation explicite, puis tout est effacé tout de suite", async () => {
    const cookie = await signIn();
    await handleSync(
      context("/api/journal/sync", { cookie, body: { entries: [entry("a")] } }),
      NOW,
    );
    const unconfirmed = await handleDeleteAccount(
      context("/api/account", { method: "DELETE", cookie, body: {} }),
      NOW,
    );
    expect(unconfirmed.status).toBe(400);

    const deleted = await handleDeleteAccount(
      context("/api/account", {
        method: "DELETE",
        cookie,
        body: { confirm: "supprimer" },
      }),
      NOW,
    );
    expect(deleted.status).toBe(200);
    expect(deleted.headers.get("Set-Cookie")).toContain("Max-Age=0");
    for (const table of [
      "users",
      "sessions",
      "journal_entries",
      "login_tokens",
    ]) {
      const row = await db
        .prepare(`SELECT COUNT(*) AS n FROM ${table}`)
        .first<{ n: number }>();
      expect(row?.n).toBe(0);
    }
  });

  it("base absente (liaison oubliée) : 503", async () => {
    delete env.DB;
    const response = await handleSession(
      context("/api/auth/session", { method: "GET", origin: null }),
      NOW,
    );
    expect(response.status).toBe(503);
  });
});

it("aucun appel ne sort vers un vrai service", () => {
  for (const url of fetchCalls)
    expect(url.startsWith(FAKE_RESEND) || url === FAKE_VERIFY).toBe(true);
});
