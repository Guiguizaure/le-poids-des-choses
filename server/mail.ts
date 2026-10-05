// E-mail de connexion (français, tutoiement), envoyé par l'API Resend.
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

/** Même message que le compte existe ou non : rien ne révèle qui a un compte. */
export function magicLinkMessage(link: string): MailMessage {
  const subject = "Ton lien pour retrouver ton jardin";
  const text = [
    "Bonjour,",
    "",
    "Voici ton lien pour te connecter au Poids des choses et retrouver ton jardin :",
    link,
    "",
    "Il est valable 15 minutes et ne sert qu’une fois.",
    "Si tu n’as rien demandé, ignore ce message : sans clic, rien ne se passe.",
    "",
    "Le poids des choses",
  ].join("\n");
  const href = escapeHtml(link);
  const html = `<!doctype html>
<html lang="fr">
<body style="margin:0;padding:24px;background:#FFF3DC;font-family:Arial,Helvetica,sans-serif;color:#1F1A17">
<p style="font-size:16px;line-height:1.5;margin:0 0 16px">Bonjour,</p>
<p style="font-size:16px;line-height:1.5;margin:0 0 24px">Voici ton lien pour te connecter au Poids des choses et retrouver ton jardin.</p>
<p style="margin:0 0 24px"><a href="${href}" style="display:inline-block;background:#1F1A17;color:#FFF3DC;text-decoration:none;font-weight:bold;font-size:16px;padding:14px 24px;border-radius:999px">Retrouver mon jardin</a></p>
<p style="font-size:14px;line-height:1.5;margin:0 0 8px">Il est valable 15 minutes et ne sert qu’une fois.</p>
<p style="font-size:14px;line-height:1.5;margin:0 0 24px">Si tu n’as rien demandé, ignore ce message : sans clic, rien ne se passe.</p>
<p style="font-size:13px;line-height:1.5;margin:0;color:#6B625A">Le bouton ne marche pas ? Copie cette adresse dans ton navigateur :<br>${href}</p>
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
