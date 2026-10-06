// Textes du compte (tutoiement, ton doux, sans culpabilisation). Phrases dans
// src/lib/i18n/messages/account.ts.
import { intlLocale, type Locale } from "@/lib/i18n";
import { ACCOUNT } from "@/lib/i18n/messages/account";
import type { ApiError } from "./api";
import type { SyncSnapshot } from "./engine";

export function errorMessage(error: ApiError, locale: Locale = "fr"): string {
  const errors = ACCOUNT[locale].errors;
  return error in errors ? errors[error as keyof typeof errors] : errors.other;
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** « aujourd’hui à 14:32 », « hier à 9:05 » ou « 3 octobre 2026 à 18:00 » (heure locale). */
export function syncDateLabel(
  iso: string,
  now: Date,
  locale: Locale = "fr",
): string {
  const t = ACCOUNT[locale];
  const date = new Date(iso);
  const time = new Intl.DateTimeFormat(intlLocale(locale), {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
  if (sameDay(date, now)) return t.today(time);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (sameDay(date, yesterday)) return t.yesterday(time);
  const day = new Intl.DateTimeFormat(intlLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return t.dayAt(day, time);
}

/** Ligne d'état de la synchro, sous l'adresse du compte. */
export function syncStatus(
  account: SyncSnapshot,
  now: Date,
  locale: Locale = "fr",
): string {
  const t = ACCOUNT[locale];
  if (account.syncing) return t.statusSyncing;
  const waiting = account.pending.length > 0 || account.sendAll;
  if (waiting && account.lastOutcome !== null && account.lastOutcome !== "ok")
    return t.statusWaiting;
  if (account.lastSyncAt)
    return t.statusLast(syncDateLabel(account.lastSyncAt, now, locale));
  return t.statusNever;
}

export function conflictsMessage(count: number, locale: Locale = "fr"): string {
  return ACCOUNT[locale].conflicts(count);
}
