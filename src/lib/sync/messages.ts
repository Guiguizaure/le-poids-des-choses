// Textes du compte (tutoiement, ton doux, sans culpabilisation).
import type { ApiError } from "./api";
import type { SyncSnapshot } from "./engine";

export function errorMessage(error: ApiError): string {
  switch (error) {
    case "offline":
      return "Pas de connexion pour l’instant. Réessaie dans un moment.";
    case "unavailable":
      return "La connexion n’est pas disponible pour le moment. Ton jardin reste sur cet appareil.";
    case "rate-limited":
      return "Beaucoup de demandes d’un coup : réessaie dans quelques minutes.";
    case "invalid-email":
      return "Cette adresse ne semble pas complète. Tu peux la vérifier ?";
    case "turnstile":
      return "La vérification anti-robot n’a pas abouti. Réessaie.";
    case "mail":
      return "Le lien n’a pas pu partir. Réessaie dans un moment.";
    case "invalid-link":
      return "Ce lien ne marche plus : il est valable 15 minutes et ne sert qu’une fois.";
    case "unauthorized":
      return "Ta session a pris fin : demande un nouveau lien pour reprendre la synchro.";
    default:
      return "Quelque chose n’a pas marché. Réessaie dans un moment.";
  }
}

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** « aujourd’hui à 14:32 », « hier à 9:05 » ou « 3 octobre 2026 à 18:00 » (heure locale). */
export function syncDateLabel(iso: string, now: Date): string {
  const date = new Date(iso);
  const time = new Intl.DateTimeFormat("fr-FR", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
  if (sameDay(date, now)) return `aujourd’hui à ${time}`;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (sameDay(date, yesterday)) return `hier à ${time}`;
  const day = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return `${day} à ${time}`;
}

/** Ligne d'état de la synchro, sous l'adresse du compte. */
export function syncStatus(account: SyncSnapshot, now: Date): string {
  if (account.syncing) return "Synchronisation en cours…";
  const waiting = account.pending.length > 0 || account.sendAll;
  if (waiting && account.lastOutcome !== null && account.lastOutcome !== "ok")
    return "Pas de connexion au compte pour l’instant : tes derniers choix partiront dès que possible.";
  if (account.lastSyncAt)
    return `Dernière synchro : ${syncDateLabel(account.lastSyncAt, now)}.`;
  return "Pas encore synchronisé.";
}

export function conflictsMessage(count: number): string {
  return count === 1
    ? "Une autre version d’un même choix a été gardée à part : elle figure dans l’export de tes données."
    : `${count} autres versions de mêmes choix ont été gardées à part : elles figurent dans l’export de tes données.`;
}
