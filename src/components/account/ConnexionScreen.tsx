"use client";

import { useEffect, useState } from "react";
import { SignInForm } from "@/components/account/AccountSection";
import { PrimaryLink } from "@/components/ui/buttons";
import { plural } from "@/lib/garden/text";
import { accountApi, type ApiError } from "@/lib/sync/api";
import { getBrowserStore } from "@/lib/journal/browser";
import { getSyncEngine } from "@/lib/sync/browser";
import { errorMessage } from "@/lib/sync/messages";
import { useAccount } from "@/lib/sync/useAccount";

type State =
  | { step: "starting" }
  | { step: "form" }
  | { step: "verifying" }
  | { step: "syncing"; email: string }
  | { step: "done"; email: string; received: number; synced: boolean }
  | { step: "error"; error: ApiError };

/**
 * Jeton lu dans le fragment (#jeton=…) : jamais envoyé au serveur par le navigateur, ni écrit
 * dans les journaux ; les antivirus de messagerie qui ouvrent les liens ne l'utilisent pas.
 */
function readToken(): string | null {
  const match = window.location.hash.match(/[#&]jeton=([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}

type Verification = ReturnType<typeof accountApi.verify>;

// Un jeton ne sert qu'une fois : une seule vérification par jeton, même si l'effet est
// rejoué (mode strict de React en développement, où le fragment a déjà été retiré).
const verifications = new Map<string, Verification>();
let lastToken: string | null = null;

/** Lit le jeton puis le retire de la barre d'adresse et de l'historique. */
function takeToken(): string | null {
  const fresh = readToken();
  if (fresh) lastToken = fresh;
  if (window.location.hash)
    window.history.replaceState(null, "", window.location.pathname);
  return fresh ?? lastToken;
}

function verify(token: string): Verification {
  if (!verifications.has(token))
    verifications.set(token, accountApi.verify(token));
  return verifications.get(token)!;
}

const TITLE_CLASS = "font-titre text-titre-l text-encre leading-[1.1]";

/**
 * Page /connexion : ouverte depuis le lien reçu par e-mail (#jeton=…), ou sans jeton pour
 * demander un lien et retrouver son jardin sur cet appareil.
 */
export function ConnexionScreen() {
  const [state, setState] = useState<State>({ step: "starting" });

  useEffect(() => {
    let cancelled = false;
    const open = (token: string) => {
      setState({ step: "verifying" });
      void verify(token).then(async (result) => {
        if (cancelled) return;
        if (!result.ok) {
          setState({ step: "error", error: result.error });
          return;
        }
        const { email } = result.data;
        // Choix retrouvés : comptés sur le carnet de l'appareil, qu'ils arrivent par cette
        // synchro ou par celle d'un autre onglet ouvert sur le jardin.
        const store = getBrowserStore();
        const before = new Set(store.getEntries().map((entry) => entry.id));
        const engine = getSyncEngine();
        if (engine.getSnapshot().email !== email) engine.signedIn(email);
        setState({ step: "syncing", email });
        const outcome = await engine.sync();
        if (cancelled) return;
        setState({
          step: "done",
          email,
          received: store.getEntries().filter((entry) => !before.has(entry.id))
            .length,
          synced: outcome === "ok",
        });
      });
    };

    const token = takeToken();
    if (token) open(token);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- le fragment n'est lisible qu'ici, après l'hydratation
    else setState({ step: "form" });

    // Lien ouvert dans un onglet déjà sur /connexion : seul le fragment change, la page ne se
    // recharge pas.
    const onHashChange = () => {
      if (readToken()) open(takeToken()!);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => {
      cancelled = true;
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return (
    <main className="animate-enter mx-auto flex w-full max-w-[430px] flex-col gap-4 px-6 pt-10 pb-10 motion-reduce:animate-none">
      {state.step === "starting" ? (
        <h1 className={TITLE_CLASS}>Connexion</h1>
      ) : null}

      {state.step === "form" ? <RequestLink /> : null}

      {state.step === "verifying" ? (
        <>
          <h1 className={TITLE_CLASS}>Connexion</h1>
          <p role="status" className="text-corps-m text-encre">
            On ouvre ton jardin…
          </p>
        </>
      ) : null}

      {state.step === "syncing" || state.step === "done" ? (
        <>
          <h1 className="font-titre text-titre-l text-encre leading-[1.1]">
            Ton jardin est relié
          </h1>
          <p className="text-corps-m text-encre leading-[1.4]">
            Connecté avec <strong className="break-all">{state.email}</strong>.
          </p>
          <p
            role="status"
            className="text-corps-s text-texte-attenue leading-[1.4]"
          >
            {state.step === "syncing"
              ? "Synchronisation en cours…"
              : !state.synced
                ? "La synchronisation reprendra à ta prochaine visite du jardin."
                : state.received > 0
                  ? `Synchronisation terminée : ${plural(state.received, "choix retrouvé", "choix retrouvés")}.`
                  : "Synchronisation terminée : ton carnet est à jour."}
          </p>
          {state.step === "done" ? (
            <PrimaryLink href="/jardin">Voir mon jardin</PrimaryLink>
          ) : null}
        </>
      ) : null}

      {state.step === "error" ? (
        <>
          <h1 className="font-titre text-titre-l text-encre leading-[1.1]">
            Ce lien ne marche plus
          </h1>
          <p role="status" className="text-corps-m text-encre leading-[1.4]">
            {state.error === "invalid-link"
              ? "Un lien de connexion est valable 15 minutes et ne sert qu’une fois. Demande un nouveau lien ci-dessous : ça ne prend qu’un instant."
              : errorMessage(state.error)}
          </p>
          <FormCard />
        </>
      ) : null}
    </main>
  );
}

/** Sans jeton : demander un lien (déjà connecté sur cet appareil : aller au jardin). */
function RequestLink() {
  const account = useAccount();
  return (
    <>
      <h1 className={TITLE_CLASS}>Retrouve ton jardin</h1>
      {account.ready && account.email ? (
        <>
          <p className="text-corps-m text-encre leading-[1.4]">
            Tu es déjà connecté avec{" "}
            <strong className="break-all">{account.email}</strong> sur cet
            appareil : ton jardin s’y synchronise.
          </p>
          <PrimaryLink href="/jardin">Voir mon jardin</PrimaryLink>
        </>
      ) : (
        <FormCard />
      )}
    </>
  );
}

function FormCard() {
  const [message, setMessage] = useState("");
  return (
    <section
      aria-label="Recevoir un lien de connexion"
      className="bg-blanc flex flex-col items-start gap-3 rounded-[20px] p-5"
    >
      <SignInForm
        intro="Ton jardin pousse déjà sur un autre appareil ? Reçois un lien par e-mail, sans mot de passe : ouvre-le ici et tes choix reviendront."
        onMessage={setMessage}
      />
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
