// Bandeau d'installation (PWA) : quand et comment le montrer (fonctions pures).

export type InstallMode = "prompt" | "ios" | "hidden";

export type InstallContext = {
  /** L'app tourne déjà installée (display-mode standalone, ou navigator.standalone sur iOS). */
  standalone: boolean;
  /** Le bandeau a déjà été fermé sur cet appareil. */
  dismissed: boolean;
  /** Chrome / Android a proposé l'installation (événement beforeinstallprompt reçu). */
  canPrompt: boolean;
  /** iPhone / iPad (pas d'invite automatique : on explique le geste). */
  ios: boolean;
};

export function installMode({
  standalone,
  dismissed,
  canPrompt,
  ios,
}: InstallContext): InstallMode {
  if (standalone || dismissed) return "hidden";
  if (canPrompt) return "prompt";
  if (ios) return "ios";
  return "hidden";
}

/** iPhone, iPad, iPod (iPadOS se présente comme un Mac tactile). */
export function isIos(userAgent: string, maxTouchPoints = 0): boolean {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return true;
  return /Macintosh/i.test(userAgent) && maxTouchPoints > 1;
}

export const INSTALL_DISMISSED_KEY = "lpdc:install-banner:dismissed";
