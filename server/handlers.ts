// Routes de l'API (functions/api/** les branche). Chaque route reçoit la requête et
// l'environnement ; `now` est injectable pour les tests.
import { normalizeEmail } from "../src/lib/sync/email";
import {
  consumeLoginToken,
  createLoginToken,
  createSession,
  deleteAccount,
  deleteSession,
  findSession,
  upsertUser,
  type Session,
} from "./auth";
import {
  LINK_EMAIL_LIMITS,
  LINK_IP_LIMITS,
  RACONTE_ACCOUNT_LIMITS,
  RACONTE_DAILY_CAP,
  RACONTE_IP_LIMITS,
  SESSION_COOKIE,
  VERIFY_IP_LIMITS,
  DAY,
} from "./config";
import { hmacHex } from "./crypto";
import type { D1Database, Env, PagesContext } from "./env";
import {
  API_HEADERS,
  clearSessionCookie,
  clientIp,
  errorResponse,
  HttpError,
  json,
  readCookie,
  readJson,
  sessionCookie,
} from "./http";
import { RACONTE_MAX_CHARS, sanitizeText } from "../src/lib/raconte/detections";
import { exportAccount, parseSyncRequest, syncJournal } from "./journal";
import { magicLinkMessage, sendMail } from "./mail";
import { runMaintenance } from "./maintenance";
import { trustedOrigin } from "./origin";
import { detectGestures } from "./raconte";
import { hitLimits } from "./rate-limit";
import { verifyTurnstile } from "./turnstile";

export type RouteContext = { request: Request; env: Env };
type Route = (context: RouteContext, now?: number) => Promise<Response>;

/** Erreurs prévues → réponse JSON avec leur code ; les autres remontent (500). */
function route(
  handler: (context: RouteContext, now: number) => Promise<Response>,
): Route {
  return async (context, now = Date.now()) => {
    try {
      return await handler(context, now);
    } catch (error) {
      if (error instanceof HttpError) return errorResponse(error);
      throw error;
    }
  };
}

function database(env: Env): D1Database {
  if (!env.DB) throw new HttpError(503, "unavailable");
  return env.DB;
}

function secret(value: string | undefined): string {
  if (!value) throw new HttpError(503, "unavailable");
  return value;
}

function requireOrigin({ request, env }: RouteContext): string {
  const origin = trustedOrigin(request, env.ALLOW_LOCALHOST === "1");
  if (!origin) throw new HttpError(403, "origin");
  return origin;
}

function requestBody(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new HttpError(400, "bad-request");
  return value as Record<string, unknown>;
}

async function currentSession(
  { request, env }: RouteContext,
  now: number,
): Promise<Session | null> {
  return findSession(database(env), readCookie(request, SESSION_COOKIE), now);
}

async function requireSession(
  context: RouteContext,
  now: number,
): Promise<Session> {
  const session = await currentSession(context, now);
  if (!session) throw new HttpError(401, "unauthorized");
  return session;
}

/** POST /api/auth/link : { email, turnstileToken } → 202, même réponse pour toute adresse. */
export const handleLink = route(async (context, now) => {
  const origin = requireOrigin(context);
  const body = requestBody(await readJson(context.request));
  const { env } = context;
  const db = database(env);
  const hashKey = secret(env.HASH_SECRET);
  secret(env.RESEND_API_KEY);
  secret(env.TURNSTILE_SECRET_KEY);

  const ip = clientIp(context.request);
  const ipKey = `link:ip:${await hmacHex(hashKey, ip)}`;
  if (!(await hitLimits(db, ipKey, LINK_IP_LIMITS, now)))
    throw new HttpError(429, "rate-limited");
  const email = normalizeEmail(body.email);
  if (!email) throw new HttpError(400, "invalid-email");
  if (!(await verifyTurnstile(env, body.turnstileToken, ip)))
    throw new HttpError(400, "turnstile");
  // Compté après Turnstile : personne ne peut épuiser la limite d'une adresse sans passer
  // la vérification.
  const emailKey = `link:email:${await hmacHex(hashKey, email)}`;
  if (!(await hitLimits(db, emailKey, LINK_EMAIL_LIMITS, now)))
    throw new HttpError(429, "rate-limited");

  const token = await createLoginToken(db, email, now);
  await sendMail(
    env,
    email,
    magicLinkMessage(`${origin}/connexion#jeton=${token}`),
  );
  return json({ ok: true }, 202);
});

/** POST /api/auth/verify : { token } → cookie de session, { email }. */
export const handleVerify = route(async (context, now) => {
  requireOrigin(context);
  const body = requestBody(await readJson(context.request));
  const { env } = context;
  const db = database(env);
  const ipKey = `verify:ip:${await hmacHex(secret(env.HASH_SECRET), clientIp(context.request))}`;
  if (!(await hitLimits(db, ipKey, VERIFY_IP_LIMITS, now)))
    throw new HttpError(429, "rate-limited");
  const email = await consumeLoginToken(db, body.token, now);
  if (!email) throw new HttpError(400, "invalid-link");
  const user = await upsertUser(db, email, now);
  const token = await createSession(db, user.id, now);
  return json({ email: user.email }, 200, {
    "Set-Cookie": sessionCookie(token),
  });
});

/** GET /api/auth/session → { signedIn, email? }. */
export const handleSession = route(async (context, now) => {
  const session = await currentSession(context, now);
  return json(
    session ? { signedIn: true, email: session.email } : { signedIn: false },
  );
});

/** POST /api/auth/logout : supprime la session et efface le cookie. */
export const handleLogout = route(async (context, now) => {
  requireOrigin(context);
  const session = await currentSession(context, now);
  if (session) await deleteSession(database(context.env), session.tokenHash);
  return json({ ok: true }, 200, { "Set-Cookie": clearSessionCookie() });
});

/** POST /api/journal/sync : { since, entries } → entrées du compte après `since`. */
export const handleSync = route(async (context, now) => {
  requireOrigin(context);
  const session = await requireSession(context, now);
  const request = parseSyncRequest(await readJson(context.request));
  return json(
    await syncJournal(database(context.env), session.userId, request, now),
  );
});

/** GET /api/account/export → fichier JSON (format de l'export local). */
export const handleExport = route(async (context, now) => {
  const session = await requireSession(context, now);
  const day = new Date(now).toISOString().slice(0, 10);
  return new Response(
    await exportAccount(database(context.env), session, now),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="le-poids-des-choses-compte-${day}.json"`,
      },
    },
  );
});

/** DELETE /api/account : { confirm: "supprimer" } → suppression immédiate. */
export const handleDeleteAccount = route(async (context, now) => {
  requireOrigin(context);
  const session = await requireSession(context, now);
  const body = requestBody(await readJson(context.request));
  if (body.confirm !== "supprimer") throw new HttpError(400, "confirm");
  await deleteAccount(database(context.env), session);
  return json({ ok: true }, 200, { "Set-Cookie": clearSessionCookie() });
});

/** Plafond global du jour : AI_DAILY_CAP (entier positif) ou la valeur par défaut. */
export function dailyCap(env: Env): number {
  const value = Number(env.AI_DAILY_CAP);
  return Number.isInteger(value) && value > 0 ? value : RACONTE_DAILY_CAP;
}

/** Journal de « Raconte ta journée » : des compteurs, jamais le texte. */
function logRaconte(outcome: string, counters: Record<string, unknown> = {}) {
  console.log(JSON.stringify({ raconte: outcome, ...counters }));
}

/** GET /api/raconte → { enabled } : l'écran prévient tout de suite si la fonction est coupée. */
export const handleRaconteStatus = route(async ({ env }) =>
  json({
    enabled:
      env.AI_ENABLED === "1" &&
      Boolean(env.DB && env.ANTHROPIC_API_KEY && env.TURNSTILE_SECRET_KEY),
  }),
);

/**
 * POST /api/raconte : { text, turnstileToken } → { gestures }. Ordre : coupe-circuit
 * AI_ENABLED, texte, limite par IP, Turnstile, limite par compte, plafond global, Claude.
 */
export const handleRaconte = route(async (context, now) => {
  requireOrigin(context);
  const { env } = context;
  if (env.AI_ENABLED !== "1") {
    logRaconte("disabled");
    throw new HttpError(503, "ai-disabled");
  }
  const body = requestBody(await readJson(context.request));
  const db = database(env);
  const hashKey = secret(env.HASH_SECRET);
  secret(env.TURNSTILE_SECRET_KEY);
  secret(env.ANTHROPIC_API_KEY);
  if (typeof body.text !== "string") throw new HttpError(400, "bad-request");
  const text = sanitizeText(body.text);
  if (text.length === 0 || text.length > RACONTE_MAX_CHARS)
    throw new HttpError(400, "text-length");

  const ip = clientIp(context.request);
  const ipKey = `raconte:ip:${await hmacHex(hashKey, ip)}`;
  if (!(await hitLimits(db, ipKey, RACONTE_IP_LIMITS, now))) {
    logRaconte("rate-limited", { by: "ip" });
    throw new HttpError(429, "rate-limited");
  }
  if (!(await verifyTurnstile(env, body.turnstileToken, ip)))
    throw new HttpError(400, "turnstile");
  const session = await currentSession(context, now);
  if (
    session &&
    !(await hitLimits(
      db,
      `raconte:user:${session.userId}`,
      RACONTE_ACCOUNT_LIMITS,
      now,
    ))
  ) {
    logRaconte("rate-limited", { by: "account" });
    throw new HttpError(429, "rate-limited");
  }
  // Coupe-circuit : compté juste avant l'appel, par jour UTC.
  if (
    !(await hitLimits(
      db,
      "raconte:global",
      [{ name: "24h", windowMs: DAY, max: dailyCap(env) }],
      now,
    ))
  ) {
    logRaconte("quota");
    throw new HttpError(503, "ai-quota");
  }

  try {
    const { detections, stats } = await detectGestures(env, text);
    logRaconte(detections.length ? "ok" : "empty", stats);
    return json({ gestures: detections });
  } catch (error) {
    if (error instanceof HttpError) logRaconte("failed");
    throw error;
  }
});

/** Middleware de /api : en-têtes communs, erreurs inattendues, entretien quotidien. */
export async function apiMiddleware(context: PagesContext): Promise<Response> {
  let response: Response;
  try {
    response = await context.next();
  } catch (error) {
    console.error(
      "Erreur de l'API :",
      error instanceof Error ? error.message : error,
    );
    response = json({ error: "server" }, 500);
  }
  if (context.env.DB) {
    const db = context.env.DB;
    context.waitUntil(
      runMaintenance(db, Date.now()).catch((error) =>
        console.error(
          "Entretien :",
          error instanceof Error ? error.message : error,
        ),
      ),
    );
  }
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(API_HEADERS))
    headers.set(name, value);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
