// E-mail de connexion (français ou anglais, selon la page), envoyé par l'API Resend.
import type { Locale } from "../src/lib/i18n/routes";
import { MAGIC_LINK_MAIL } from "../src/lib/i18n/messages/mail";
import { MAIL_FROM, RESEND_API_URL } from "./config";
import type { Env } from "./env";
import { HttpError } from "./http";

export type MailMessage = { subject: string; text: string; html: string };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Langue de l'e-mail : celle de la page où le lien a été demandé (français par défaut). */
export type MailLocale = Locale;

/** Même message que le compte existe ou non : rien ne révèle qui a un compte. */
export function magicLinkMessage(
  link: string,
  locale: MailLocale = "fr",
): MailMessage {
  const t = MAGIC_LINK_MAIL[locale];
  const subject = t.subject;
  const text = [
    t.hello,
    "",
    `${t.intro}${t.colon}`,
    link,
    "",
    t.validity,
    t.ignore,
    "",
    t.signature,
  ].join("\n");
  const href = escapeHtml(link);
  const html = `<!doctype html>
<html lang="${locale}">
<body style="margin:0;padding:24px;background:#FFF3DC;font-family:Arial,Helvetica,sans-serif;color:#1F1A17">
<p style="font-size:16px;line-height:1.5;margin:0 0 16px">${t.hello}</p>
<p style="font-size:16px;line-height:1.5;margin:0 0 24px">${t.intro}.</p>
<p style="margin:0 0 24px"><a href="${href}" style="display:inline-block;background:#1F1A17;color:#FFF3DC;text-decoration:none;font-weight:bold;font-size:16px;padding:14px 24px;border-radius:999px">${t.button}</a></p>
<p style="font-size:14px;line-height:1.5;margin:0 0 8px">${t.validity}</p>
<p style="font-size:14px;line-height:1.5;margin:0 0 24px">${t.ignore}</p>
<p style="font-size:13px;line-height:1.5;margin:0;color:#6B625A">${t.fallback}<br>${href}</p>
</body>
</html>`;
  return { subject, text, html };
}

export async function sendMail(
  env: Env,
  to: string,
  message: MailMessage,
): Promise<void> {
  if (!env.RESEND_API_KEY) throw new HttpError(503, "unavailable");
  let response: Response;
  try {
    response = await fetch(`${env.RESEND_API_URL || RESEND_API_URL}/emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: MAIL_FROM, to: [to], ...message }),
    });
  } catch {
    throw new HttpError(502, "mail");
  }
  if (!response.ok) {
    // Le détail reste dans les journaux de la fonction (sans l'adresse).
    console.error(`Resend : HTTP ${response.status}`);
    throw new HttpError(502, "mail");
  }
}
