// Types de l'environnement des Pages Functions (liaisons, variables, secrets). Volontairement
// minimaux : ils suffisent au code et restent compatibles avec la vraie base D1 comme avec
// celle de getPlatformProxy (tests), sans types globaux de Workers dans le projet Next.

export type D1Result<T = Record<string, unknown>> = {
  results: T[];
  success: boolean;
  meta: { changes?: number; [key: string]: unknown };
};

export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = Record<string, unknown>>(
    statements: D1PreparedStatement[],
  ): Promise<D1Result<T>[]>;
}

export type Env = {
  /** Base D1 (liaison « DB » dans le tableau de bord Pages, production et preview). */
  DB?: D1Database;
  /** Secret : clé Resend limitée à l'envoi sur le domaine. */
  RESEND_API_KEY?: string;
  /** Tests uniquement : adresse d'un faux Resend (https://api.resend.com par défaut). */
  RESEND_API_URL?: string;
  /** Secret : clé secrète du widget Turnstile. */
  TURNSTILE_SECRET_KEY?: string;
  /** Tests uniquement : adresse d'un faux siteverify. */
  TURNSTILE_VERIFY_URL?: string;
  /** Secret : clé HMAC des limites de débit (e-mail et IP jamais stockés en clair). */
  HASH_SECRET?: string;
  /** Local uniquement (.dev.vars, tests) : « 1 » accepte l'origine http(s)://localhost. */
  ALLOW_LOCALHOST?: string;
  /** Variable : « 1 » ouvre « Raconte ta journée » ; toute autre valeur la coupe. */
  AI_ENABLED?: string;
  /** Variable facultative : plafond global d'analyses par jour (défaut RACONTE_DAILY_CAP). */
  AI_DAILY_CAP?: string;
  /** Secret : clé de l'API Anthropic (Claude), pour « Raconte ta journée » seulement. */
  ANTHROPIC_API_KEY?: string;
  /** Tests uniquement : adresse d'un faux Anthropic (https://api.anthropic.com par défaut). */
  ANTHROPIC_BASE_URL?: string;
};

/** Contexte d'une Pages Function (sous-ensemble utilisé). */
export type PagesContext = {
  request: Request;
  env: Env;
  waitUntil(promise: Promise<unknown>): void;
  next(): Promise<Response>;
};
