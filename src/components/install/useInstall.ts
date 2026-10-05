"use client";

import { useSyncExternalStore } from "react";
import {
  INSTALL_DISMISSED_KEY,
  installAccess,
  installMode,
  isIos,
  type InstallMode,
} from "@/lib/install";

type PromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: string }>;
};

export type InstallState = {
  /** Bandeau « Garde ton jardin » (masqué une fois fermé). */
  banner: InstallMode;
  /** Accès permanent « Installer l'appli » (même bandeau fermé). */
  access: InstallMode;
};

const HIDDEN: InstallState = { banner: "hidden", access: "hidden" };

// État partagé de la page : l'invite d'installation peut arriver avant l'affichage des boutons.
// Le module est chargé par le pied de page commun : l'invite est gardée sur toutes les pages.
let promptEvent: PromptEvent | null = null;
let installed = false;
let dismissed = false;
let snapshot: InstallState = HIDDEN;
const listeners = new Set<() => void>();

function readDismissed(): boolean {
  try {
    return window.localStorage.getItem(INSTALL_DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

function compute(): InstallState {
  const context = {
    standalone:
      installed ||
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true,
    dismissed,
    canPrompt: promptEvent !== null,
    ios: isIos(navigator.userAgent, navigator.maxTouchPoints),
  };
  return { banner: installMode(context), access: installAccess(context) };
}

function update() {
  const next = compute();
  if (next.banner !== snapshot.banner || next.access !== snapshot.access)
    snapshot = next;
  listeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  dismissed = readDismissed();
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault(); // on garde l'invite pour les boutons « Installer »
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

/** Ferme le bandeau sur cet appareil ; l'accès permanent reste. */
export function dismissInstallBanner() {
  dismissed = true;
  try {
    window.localStorage.setItem(INSTALL_DISMISSED_KEY, "1");
  } catch {
    // Stockage indisponible : le bandeau reste fermé pour cette visite.
  }
  update();
}

/** Ouvre l'invite d'installation mémorisée (Android, Chrome). */
export async function promptInstall() {
  const event = promptEvent;
  if (!event) return;
  await event.prompt();
  const { outcome } = await event.userChoice;
  promptEvent = null;
  if (outcome === "accepted") installed = true;
  update();
}

/** Ce que le navigateur permet (rien au rendu serveur et à l'hydratation). */
export function useInstall(): InstallState {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => HIDDEN,
  );
}
