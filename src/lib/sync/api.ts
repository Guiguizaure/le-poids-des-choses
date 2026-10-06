// Appels à l'API du compte (Pages Functions, même origine). Ne lève jamais d'erreur : chaque
// appel renvoie un résultat ou un code d'erreur que l'interface sait formuler.
import type { JournalEntry } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/routes";

export type ApiError =
  | "offline"
  | "unauthorized"
  | "rate-limited"
  | "unavailable"
  | "invalid-email"
  | "turnstile"
  | "invalid-link"
  | "mail"
  | "error";

export type ApiResult<T> =
  { ok: true; data: T } | { ok: false; error: ApiError };

export type SyncPayload = { since: number; entries: JournalEntry[] };

export type SyncReply = {
  entries: JournalEntry[];
  cursor: number;
  hasMore: boolean;
  accepted: number;
  rejected: number;
  conflicts: string[];
};

const KNOWN: readonly ApiError[] = [
  "invalid-email",
  "turnstile",
  "invalid-link",
  "rate-limited",
  "mail",
];

async function call<T>(
  path: string,
  init: RequestInit = {},
): Promise<ApiResult<T>> {
  let response: Response;
  try {
    response = await fetch(path, { credentials: "same-origin", ...init });
  } catch {
    return { ok: false, error: "offline" };
  }
  if (response.ok) {
    try {
      return { ok: true, data: (await response.json()) as T };
    } catch {
      return { ok: false, error: "error" };
    }
  }
  if (response.status === 401) return { ok: false, error: "unauthorized" };
  if (response.status === 429) return { ok: false, error: "rate-limited" };
  // 404 / 405 : pas de fonctions (site statique seul) ; 503 : service non configuré.
  if ([404, 405, 503].includes(response.status))
    return { ok: false, error: "unavailable" };
  let code: unknown;
  try {
    code = ((await response.json()) as { error?: unknown }).error;
  } catch {
    // Corps illisible.
  }
  return {
    ok: false,
    error: KNOWN.includes(code as ApiError) ? (code as ApiError) : "error",
  };
}

function send<T>(path: string, method: string, body: unknown) {
  return call<T>(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export const accountApi = {
  /** `locale` : langue de la page (l'e-mail et la page d'arrivée la suivent). */
  requestLink: (email: string, turnstileToken: string, locale: Locale = "fr") =>
    send<{ ok: true }>("/api/auth/link", "POST", {
      email,
      turnstileToken,
      ...(locale === "en" ? { locale } : {}),
    }),
  verify: (token: string) =>
    send<{ email: string }>("/api/auth/verify", "POST", { token }),
  session: () =>
    call<{ signedIn: boolean; email?: string }>("/api/auth/session"),
  logout: () => send<{ ok: true }>("/api/auth/logout", "POST", {}),
  sync: (payload: SyncPayload) =>
    send<SyncReply>("/api/journal/sync", "POST", payload),
  deleteAccount: () =>
    send<{ ok: true }>("/api/account", "DELETE", { confirm: "supprimer" }),
  /** Export du compte : le fichier JSON, ou un code d'erreur. */
  async exportFile(): Promise<ApiResult<{ blob: Blob; fileName: string }>> {
    let response: Response;
    try {
      response = await fetch("/api/account/export", {
        credentials: "same-origin",
      });
    } catch {
      return { ok: false, error: "offline" };
    }
    if (response.status === 401) return { ok: false, error: "unauthorized" };
    if (!response.ok) return { ok: false, error: "error" };
    const disposition = response.headers.get("Content-Disposition") ?? "";
    const fileName =
      disposition.match(/filename="([^"]+)"/)?.[1] ??
      "le-poids-des-choses-compte.json";
    return { ok: true, data: { blob: await response.blob(), fileName } };
  },
};

export type AccountApi = typeof accountApi;
