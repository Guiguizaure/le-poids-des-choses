// Bandeau « This site is also available in English » : règles pures et mémoire du choix.
// Jamais de redirection automatique : on propose, une fois, et on se souvient du refus.

export const LANGUAGE_BANNER_KEY = "lpdc:langue:v1";

/** Vrai si la première langue préférée du navigateur est l'anglais. */
export function prefersEnglish(languages: readonly string[]): boolean {
  const first = languages[0];
  return typeof first === "string" && /^en\b/i.test(first);
}

/** Le bandeau s'affiche-t-il ? Page française, navigateur en anglais, jamais fermé. */
export function shouldOfferEnglish(
  languages: readonly string[],
  dismissed: boolean,
): boolean {
  return !dismissed && prefersEnglish(languages);
}

/** Lu dans le stockage : vrai si le bandeau a déjà été fermé (ou la langue choisie). */
export function readDismissed(raw: string | null): boolean {
  if (!raw) return false;
  try {
    const value = JSON.parse(raw) as { version?: number; dismissed?: boolean };
    return value.version === 1 && value.dismissed === true;
  } catch {
    return false;
  }
}

export function isLanguageBannerDismissed(): boolean {
  try {
    return readDismissed(window.localStorage.getItem(LANGUAGE_BANNER_KEY));
  } catch {
    return false;
  }
}

/** Le bandeau ne revient plus (fermé, ou une langue choisie avec le sélecteur). */
export function dismissLanguageBanner(): void {
  try {
    window.localStorage.setItem(
      LANGUAGE_BANNER_KEY,
      JSON.stringify({ version: 1, dismissed: true }),
    );
  } catch {
    // Stockage indisponible : le bandeau reviendra, sans gêner.
  }
}
