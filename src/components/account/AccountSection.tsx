"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { TextButton } from "@/components/ui/buttons";
import { useNow } from "@/lib/hooks/useNow";
import { accountApi } from "@/lib/sync/api";
import { getSyncEngine } from "@/lib/sync/browser";
import { normalizeEmail } from "@/lib/sync/email";
import {
  conflictsMessage,
  errorMessage,
  syncStatus,
} from "@/lib/sync/messages";
import { useAccount } from "@/lib/sync/useAccount";
import { useTurnstile } from "@/lib/sync/useTurnstile";
import { ACCOUNT } from "@/lib/i18n/messages/account";
import { LocalLink as Link, useLocale } from "@/lib/i18n/LocaleProvider";

/** Ancre de la section (lien « Se connecter » / adresse de l'en-tête). */
export const ACCOUNT_ANCHOR = "compte";

/**
 * `default` : en bas d'un jardin qui pousse (le garder ailleurs aussi) ; `retrouver` : en haut
 * d'un jardin vide, et sur /connexion (retrouver un jardin commencé ailleurs). Titres et
 * textes : ACCOUNT (src/lib/i18n/messages/account.ts).
 */
export type AccountVariant = "default" | "retrouver";

const PILL =
  "press border-encre text-legende text-encre hover:bg-creme rounded-full border px-3 py-1.5 leading-[1.3] font-semibold transition-colors disabled:opacity-40 focus-visible:outline-outremer focus-visible:outline-2 focus-visible:outline-offset-2";
const DARK =
  "press bg-encre text-creme text-corps-s rounded-full px-5 py-3 leading-[1.3] font-semibold transition-opacity hover:opacity-90 disabled:opacity-40 focus-visible:outline-outremer focus-visible:outline-2 focus-visible:outline-offset-2";

function PrivacyLink() {
  const t = ACCOUNT[useLocale()];
  return (
    // Pas de préchargement : lien secondaire, inutile de charger la page à l'avance.
    <Link
      href="/confidentialite"
      prefetch={false}
      className="text-encre font-semibold underline underline-offset-2"
    >
      {t.privacy}
    </Link>
  );
}

function download(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Section de /jardin : compte facultatif (lien magique) et synchro du carnet. En bas d'un
 * jardin qui pousse ; en haut d'un jardin vide (`retrouver`), pour retrouver celui d'un autre
 * appareil.
 */
export function AccountSection({
  variant = "default",
}: {
  variant?: AccountVariant;
}) {
  const account = useAccount();
  const locale = useLocale();
  const t = ACCOUNT[locale];
  const [message, setMessage] = useState("");
  const section = useRef<HTMLElement>(null);

  // Arrivée par /jardin#compte (lien de l'en-tête) : la section n'existe qu'après la lecture
  // du compte, le navigateur n'a donc pas pu la trouver lui-même.
  useEffect(() => {
    if (account.ready && window.location.hash === `#${ACCOUNT_ANCHOR}`)
      section.current?.scrollIntoView({ block: "start" });
  }, [account.ready]);

  // Compte connecté sur cet appareil : synchro à l'ouverture du jardin.
  useEffect(() => {
    if (!account.ready || !account.email) return;
    void getSyncEngine()
      .sync()
      .then((outcome) => {
        if (outcome === "unauthorized")
          setMessage(errorMessage(outcome, locale));
      });
  }, [account.ready, account.email, locale]);

  if (!account.ready) return null;

  return (
    <section
      ref={section}
      id={ACCOUNT_ANCHOR}
      className="bg-blanc flex scroll-mt-6 flex-col items-start gap-3 rounded-[20px] p-5"
      aria-labelledby="compte-titre"
    >
      <h2
        id="compte-titre"
        className="font-titre text-titre-m text-encre leading-[1.1]"
      >
        {t.titles[variant]}
      </h2>
      {account.email ? (
        <SignedIn email={account.email} onMessage={setMessage} />
      ) : (
        <SignInForm intro={t.intros[variant]} onMessage={setMessage} />
      )}
      <p
        role="status"
        aria-live="polite"
        className="text-corps-s text-encre empty:hidden"
      >
        {message}
      </p>
    </section>
  );
}

/**
 * Formulaire « Recevoir un lien » (section de /jardin, /connexion sans jeton). Turnstile n'est
 * chargé qu'au premier usage : quand on entre dans le champ ou qu'on envoie.
 */
export function SignInForm({
  intro,
  onMessage,
}: {
  intro?: string;
  onMessage: (text: string) => void;
}) {
  const locale = useLocale();
  const t = ACCOUNT[locale];
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [busy, setBusy] = useState<"" | "verification" | "envoi">("");
  const { widget, prepare, getToken, consume } = useTurnstile();
  const sentNotice = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (sentTo) sentNotice.current?.focus();
  }, [sentTo]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    onMessage("");
    const normalized = normalizeEmail(email);
    if (!normalized) {
      onMessage(errorMessage("invalid-email", locale));
      return;
    }
    setBusy("verification");
    const verification = await getToken();
    if (!verification.ok) {
      setBusy("");
      onMessage(
        verification.reason === "load"
          ? t.turnstileLoad
          : errorMessage("turnstile", locale),
      );
      return;
    }
    setBusy("envoi");
    const result = await accountApi.requestLink(
      normalized,
      verification.token,
      locale,
    );
    // Un jeton Turnstile ne sert qu'une fois.
    consume();
    setBusy("");
    if (result.ok) setSentTo(normalized);
    else onMessage(errorMessage(result.error, locale));
  };

  if (sentTo)
    return (
      <>
        <p
          ref={sentNotice}
          tabIndex={-1}
          className="text-corps-s text-encre leading-[1.4] outline-none"
        >
          {t.sentBefore} <strong>{sentTo}</strong>
          {t.sentAfter}
        </p>
        <TextButton onClick={() => setSentTo(null)}>
          {t.changeAddress}
        </TextButton>
      </>
    );

  return (
    <>
      <p className="text-corps-s text-texte-attenue leading-[1.4]">
        {intro ?? t.intros.default}
      </p>
      <form
        onSubmit={submit}
        noValidate
        className="flex w-full flex-col items-start gap-2"
      >
        <label
          htmlFor="compte-email"
          className="text-corps-s text-encre leading-[1.3] font-semibold"
        >
          {t.emailLabel}
        </label>
        <input
          id="compte-email"
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onFocus={() => void prepare()}
          className="border-encre/30 bg-creme text-corps-m text-encre focus-visible:outline-outremer w-full rounded-2xl border px-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-1"
        />
        <div ref={widget} className="empty:hidden" />
        <button type="submit" className={DARK} disabled={busy !== ""}>
          {busy === "verification"
            ? t.verifying
            : busy === "envoi"
              ? t.sending
              : t.send}
        </button>
      </form>
      <p className="text-legende text-texte-attenue">
        {t.emailUse} <PrivacyLink />
      </p>
    </>
  );
}

function SignedIn({
  email,
  onMessage,
}: {
  email: string;
  onMessage: (text: string) => void;
}) {
  const account = useAccount();
  const locale = useLocale();
  const t = ACCOUNT[locale];
  const now = useNow();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const confirmTitle = useRef<HTMLParagraphElement>(null);
  const deleteButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (confirming) confirmTitle.current?.focus();
  }, [confirming]);

  const act = async (action: () => Promise<void>) => {
    onMessage("");
    setBusy(true);
    await action();
    setBusy(false);
  };

  const syncNow = () =>
    act(async () => {
      const outcome = await getSyncEngine().sync();
      if (outcome !== "ok" && outcome !== "signed-out")
        onMessage(errorMessage(outcome, locale));
    });

  const exportData = () =>
    act(async () => {
      const result = await accountApi.exportFile();
      if (result.ok) download(result.data.blob, result.data.fileName);
      else onMessage(errorMessage(result.error, locale));
    });

  const signOut = () =>
    act(async () => {
      const result = await accountApi.logout();
      if (!result.ok && result.error !== "unauthorized") {
        onMessage(errorMessage(result.error, locale));
        return;
      }
      getSyncEngine().signedOut();
      onMessage(t.signedOut);
    });

  const deleteAccount = () =>
    act(async () => {
      const result = await accountApi.deleteAccount();
      if (!result.ok) {
        if (result.error === "unauthorized") getSyncEngine().signedOut();
        onMessage(
          result.error === "unauthorized"
            ? t.sessionEndedDelete
            : errorMessage(result.error, locale),
        );
        return;
      }
      getSyncEngine().signedOut();
      onMessage(t.deleted);
    });

  const conflicts = account.conflicts.length;

  return (
    <>
      <p className="text-corps-s text-encre leading-[1.4]">
        {t.signedInAs} <strong className="break-all">{email}</strong>
      </p>
      <p className="text-legende text-texte-attenue">
        {syncStatus(account, new Date(now), locale)}
      </p>
      {conflicts > 0 ? (
        <p className="text-legende text-texte-attenue">
          {conflictsMessage(conflicts, locale)}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={PILL}
          onClick={syncNow}
          disabled={busy || account.syncing}
        >
          {t.sync}
        </button>
        <button
          type="button"
          className={PILL}
          onClick={exportData}
          disabled={busy}
        >
          {t.exportData}
        </button>
        <button
          type="button"
          className={PILL}
          onClick={signOut}
          disabled={busy}
        >
          {t.signOut}
        </button>
      </div>
      {confirming ? (
        <div
          role="group"
          aria-labelledby="suppression-titre"
          className="bg-tomate-douce flex w-full flex-col items-start gap-2 rounded-2xl p-4"
        >
          <p
            id="suppression-titre"
            ref={confirmTitle}
            tabIndex={-1}
            className="text-corps-s text-encre leading-[1.3] font-semibold outline-none"
          >
            {t.deleteQuestion}
          </p>
          <p className="text-corps-s text-encre leading-[1.4]">
            {t.deleteText}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={DARK}
              onClick={deleteAccount}
              disabled={busy}
            >
              {t.deleteConfirm}
            </button>
            <button
              type="button"
              className={PILL}
              onClick={() => {
                setConfirming(false);
                requestAnimationFrame(() => deleteButton.current?.focus());
              }}
            >
              {t.cancel}
            </button>
          </div>
        </div>
      ) : (
        <TextButton ref={deleteButton} onClick={() => setConfirming(true)}>
          {t.deleteAccount}
        </TextButton>
      )}
      <p className="text-legende text-texte-attenue">
        <PrivacyLink />
      </p>
    </>
  );
}
