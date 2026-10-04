"use client";

import { useSyncExternalStore } from "react";
import { PrimaryButton } from "@/components/ui/buttons";
import {
  INSTALL_DISMISSED_KEY,
  installMode,
  isIos,
  type InstallMode,
} from "@/lib/install";

type PromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};

// État partagé du bandeau : l'invite d'installation peut arriver avant l'affichage de la page.
let promptEvent: PromptEvent | null = null;
let installed = false;
let dismissed = false;
let snapshot: InstallMode = "hidden";
const listeners = new Set<() => void>();

function readDismissed(): boolean {
  try {
    return window.localStorage.getItem(INSTALL_DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

function compute(): InstallMode {
  const standalone =
    installed ||
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return installMode({
    standalone,
    dismissed,
    canPrompt: promptEvent !== null,
    ios: isIos(navigator.userAgent, navigator.maxTouchPoints),
  });
}

function update() {
  snapshot = compute();
  listeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  dismissed = readDismissed();
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault(); // on garde l'invite pour le bouton « Installer »
    promptEvent = event as PromptEvent;
    update();
  });
  window.addEventListener("appinstalled", () => {
    installed = true;
    promptEvent = null;
    update();
  });
  snapshot = compute();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function dismiss() {
  dismissed = true;
  try {
    window.localStorage.setItem(INSTALL_DISMISSED_KEY, "1");
  } catch {
    // Stockage indisponible : le bandeau reste fermé pour cette visite.
  }
  update();
}

async function install() {
  const event = promptEvent;
  if (!event) return;
  await event.prompt();
  const { outcome } = await event.userChoice;
  promptEvent = null;
  if (outcome === "accepted") installed = true;
  update();
}

/** Bandeau « Garde ton jardin » (maquette 04) : installation sur Android, explication sur iPhone. */
export function InstallBanner() {
  const mode = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => "hidden" as InstallMode,
  );
  if (mode === "hidden") return null;

  return (
    <section
      aria-labelledby="installer-titre"
      className="bg-soleil relative flex flex-col items-start gap-2.5 rounded-[20px] p-[18px]"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Fermer ce bandeau"
        className="text-encre focus-visible:outline-outremer absolute top-3 right-3 flex size-8 items-center justify-center rounded-full text-[20px] leading-none focus-visible:outline-2"
      >
        <span aria-hidden>×</span>
      </button>
      <h2
        id="installer-titre"
        className="text-corps-m text-encre pr-8 leading-[1.3] font-semibold"
      >
        Garde ton jardin
      </h2>
      <p className="text-corps-s text-encre leading-[1.4]">
        {mode === "prompt"
          ? "Installe l’app sur ton écran d’accueil pour ne pas perdre ton carnet."
          : "Installe l’app sur ton écran d’accueil pour ne pas perdre ton carnet : touche Partager, puis « Sur l’écran d’accueil »."}
      </p>
      {mode === "prompt" ? (
        <PrimaryButton className="w-auto!" onClick={install}>
          Installer
        </PrimaryButton>
      ) : null}
    </section>
  );
}
