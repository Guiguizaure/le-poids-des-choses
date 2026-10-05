"use client";

import { useEffect, useState } from "react";
import { PrimaryLink } from "@/components/ui/buttons";
import { plural } from "@/lib/garden/text";
import { accountApi, type ApiError } from "@/lib/sync/api";
import { getSyncEngine } from "@/lib/sync/browser";
import { errorMessage } from "@/lib/sync/messages";

type State =
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

function verify(token: string | null): Verification {
  if (!token) return Promise.resolve({ ok: false, error: "invalid-link" });
  if (!verifications.has(token))
    verifications.set(token, accountApi.verify(token));
  return verifications.get(token)!;
}

/** Page /connexion : ouverte depuis le lien reçu par e-mail. */
export function ConnexionScreen() {
  const [state, setState] = useState<State>({ step: "verifying" });

  useEffect(() => {
    let cancelled = false;
    void verify(takeToken()).then(async (result) => {
      if (cancelled) return;
      if (!result.ok) {
        setState({ step: "error", error: result.error });
        return;
      }
      const { email } = result.data;
      const engine = getSyncEngine();
      if (engine.getSnapshot().email !== email) engine.signedIn(email);
      setState({ step: "syncing", email });
      const outcome = await engine.sync();
      if (cancelled) return;
      setState({
        step: "done",
        email,
        received: engine.getSnapshot().received,
        synced: outcome === "ok",
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="animate-enter mx-auto flex w-full max-w-[430px] flex-col gap-4 px-6 pt-10 pb-10 motion-reduce:animate-none">
      {state.step === "verifying" ? (
        <>
          <h1 className="font-titre text-titre-l text-encre leading-[1.1]">
            Connexion
          </h1>
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
              ? "Un lien de connexion est valable 15 minutes et ne sert qu’une fois. Demande un nouveau lien depuis ton jardin : ça ne prend qu’un instant."
              : errorMessage(state.error)}
          </p>
          <PrimaryLink href="/jardin">Aller à mon jardin</PrimaryLink>
        </>
      ) : null}
    </main>
  );
}
