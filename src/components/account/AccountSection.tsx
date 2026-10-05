"use client";

import Link from "next/link";
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
import { loadTurnstile, TURNSTILE_SITE_KEY } from "@/lib/sync/turnstile";
import { useAccount } from "@/lib/sync/useAccount";

const TITLE = "Retrouve ton jardin sur un autre appareil";

const PILL =
  "press border-encre text-legende text-encre hover:bg-creme rounded-full border px-3 py-1.5 leading-[1.3] font-semibold transition-colors disabled:opacity-40 focus-visible:outline-outremer focus-visible:outline-2 focus-visible:outline-offset-2";
const DARK =
  "press bg-encre text-creme text-corps-s rounded-full px-5 py-3 leading-[1.3] font-semibold transition-opacity hover:opacity-90 disabled:opacity-40 focus-visible:outline-outremer focus-visible:outline-2 focus-visible:outline-offset-2";

function PrivacyLink() {
  return (
    // Pas de préchargement : lien secondaire, inutile de charger la page à l'avance.
    <Link
      href="/confidentialite"
      prefetch={false}
      className="text-encre font-semibold underline underline-offset-2"
    >
      Confidentialité
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

/** Section du bas de /jardin : compte facultatif (lien magique) et synchro du carnet. */
export function AccountSection() {
  const account = useAccount();
  const [message, setMessage] = useState("");

  // Compte connecté sur cet appareil : synchro à l'ouverture du jardin.
  useEffect(() => {
    if (!account.ready || !account.email) return;
    void getSyncEngine()
      .sync()
      .then((outcome) => {
        if (outcome === "unauthorized") setMessage(errorMessage(outcome));
      });
  }, [account.ready, account.email]);

  if (!account.ready) return null;

  return (
    <section
      className="bg-blanc flex flex-col items-start gap-3 rounded-[20px] p-5"
      aria-labelledby="compte-titre"
    >
      <h2
        id="compte-titre"
        className="font-titre text-titre-m text-encre leading-[1.1]"
      >
        {TITLE}
      </h2>
      {account.email ? (
        <SignedIn email={account.email} onMessage={setMessage} />
      ) : (
        <SignedOut onMessage={setMessage} />
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

function SignedOut({ onMessage }: { onMessage: (text: string) => void }) {
  const [email, setEmail] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [busy, setBusy] = useState<"" | "verification" | "envoi">("");
  const widget = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const token = useRef<string | null>(null);
  const waiters = useRef<((value: string | null) => void)[]>([]);
  const sentNotice = useRef<HTMLParagraphElement>(null);

  const settle = (value: string | null) => {
    token.current = value;
    waiters.current.splice(0).forEach((resolve) => resolve(value));
  };

  /** Charge Turnstile et affiche le widget (une seule fois), au premier usage du formulaire. */
  const prepare = async (): Promise<boolean> => {
    if (widgetId.current) return true;
    try {
      const turnstile = await loadTurnstile();
      if (!widget.current || widgetId.current) return Boolean(widgetId.current);
      widgetId.current = turnstile.render(widget.current, {
        sitekey: TURNSTILE_SITE_KEY,
        language: "fr",
        appearance: "interaction-only",
        callback: (value) => settle(value),
        "expired-callback": () => (token.current = null),
        "error-callback": () => settle(null),
      });
      return true;
    } catch {
      return false;
    }
  };

  const waitForToken = () =>
    token.current
      ? Promise.resolve(token.current)
      : new Promise<string | null>((resolve) => waiters.current.push(resolve));

  useEffect(
    () => () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
    },
    [],
  );

  useEffect(() => {
    if (sentTo) sentNotice.current?.focus();
  }, [sentTo]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    onMessage("");
    const normalized = normalizeEmail(email);
    if (!normalized) {
      onMessage(errorMessage("invalid-email"));
      return;
    }
    setBusy("verification");
    if (!(await prepare())) {
      setBusy("");
      onMessage(
        "La vérification anti-robot n’a pas pu se charger. Vérifie ta connexion et réessaie.",
      );
      return;
    }
    const value = await waitForToken();
    if (!value) {
      setBusy("");
      onMessage(errorMessage("turnstile"));
      return;
    }
    setBusy("envoi");
    const result = await accountApi.requestLink(normalized, value);
    // Un jeton Turnstile ne sert qu'une fois.
    token.current = null;
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
    setBusy("");
    if (result.ok) setSentTo(normalized);
    else onMessage(errorMessage(result.error));
  };

  if (sentTo)
    return (
      <>
        <p
          ref={sentNotice}
          tabIndex={-1}
          className="text-corps-s text-encre leading-[1.4] outline-none"
        >
          C’est envoyé ! Ouvre le lien reçu à <strong>{sentTo}</strong>, sur cet
          appareil ou sur un autre. Il est valable 15 minutes et ne sert qu’une
          fois. Rien reçu ? Jette un œil aux indésirables.
        </p>
        <TextButton onClick={() => setSentTo(null)}>
          Changer d’adresse ou renvoyer un lien
        </TextButton>
      </>
    );

  return (
    <>
      <p className="text-corps-s text-texte-attenue leading-[1.4]">
        Reçois un lien par e-mail, sans mot de passe : ton carnet sera gardé
        avec ton adresse, et tu le retrouveras partout où tu te connectes. C’est
        facultatif : ton jardin reste aussi sur cet appareil.
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
          Ton adresse e-mail
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
            ? "Vérification…"
            : busy === "envoi"
              ? "Envoi…"
              : "Recevoir un lien"}
        </button>
      </form>
      <p className="text-legende text-texte-attenue">
        Ton adresse ne sert qu’à t’envoyer ce lien et à retrouver ton carnet.{" "}
        <PrivacyLink />
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
        onMessage(errorMessage(outcome));
    });

  const exportData = () =>
    act(async () => {
      const result = await accountApi.exportFile();
      if (result.ok) download(result.data.blob, result.data.fileName);
      else onMessage(errorMessage(result.error));
    });

  const signOut = () =>
    act(async () => {
      const result = await accountApi.logout();
      if (!result.ok && result.error !== "unauthorized") {
        onMessage(errorMessage(result.error));
        return;
      }
      getSyncEngine().signedOut();
      onMessage("Déconnexion faite. Ton jardin reste sur cet appareil.");
    });

  const deleteAccount = () =>
    act(async () => {
      const result = await accountApi.deleteAccount();
      if (!result.ok) {
        if (result.error === "unauthorized") getSyncEngine().signedOut();
        onMessage(
          result.error === "unauthorized"
            ? "Ta session a pris fin : reconnecte-toi pour supprimer ton compte."
            : errorMessage(result.error),
        );
        return;
      }
      getSyncEngine().signedOut();
      onMessage(
        "Ton compte est supprimé, avec tout ce qu’il gardait sur nos serveurs. Ton jardin reste sur cet appareil.",
      );
    });

  const conflicts = account.conflicts.length;

  return (
    <>
      <p className="text-corps-s text-encre leading-[1.4]">
        Connecté avec <strong className="break-all">{email}</strong>
      </p>
      <p className="text-legende text-texte-attenue">
        {syncStatus(account, new Date(now))}
      </p>
      {conflicts > 0 ? (
        <p className="text-legende text-texte-attenue">
          {conflictsMessage(conflicts)}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={PILL}
          onClick={syncNow}
          disabled={busy || account.syncing}
        >
          Synchroniser
        </button>
        <button
          type="button"
          className={PILL}
          onClick={exportData}
          disabled={busy}
        >
          Exporter mes données
        </button>
        <button
          type="button"
          className={PILL}
          onClick={signOut}
          disabled={busy}
        >
          Me déconnecter
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
            Supprimer ton compte ?
          </p>
          <p className="text-corps-s text-encre leading-[1.4]">
            Ton adresse et ton carnet seront effacés tout de suite de nos
            serveurs. Ton jardin reste sur cet appareil.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={DARK}
              onClick={deleteAccount}
              disabled={busy}
            >
              Oui, supprimer mon compte
            </button>
            <button
              type="button"
              className={PILL}
              onClick={() => {
                setConfirming(false);
                requestAnimationFrame(() => deleteButton.current?.focus());
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <TextButton ref={deleteButton} onClick={() => setConfirming(true)}>
          Supprimer mon compte
        </TextButton>
      )}
      <p className="text-legende text-texte-attenue">
        <PrivacyLink />
      </p>
    </>
  );
}
