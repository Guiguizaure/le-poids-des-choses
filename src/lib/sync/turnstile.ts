// Cloudflare Turnstile (anti-robot du formulaire de connexion), chargé seulement quand le
// formulaire sert, jamais au chargement de /jardin.

type TurnstileOptions = {
  sitekey: string;
  language?: string;
  appearance?: "always" | "execute" | "interaction-only";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

type TurnstileApi = {
  render(container: HTMLElement, options: TurnstileOptions): string;
  reset(widgetId?: string): void;
  remove(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export const TURNSTILE_SCRIPT =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/**
 * Clé publique du widget (variable de build NEXT_PUBLIC_TURNSTILE_SITE_KEY, à définir dans
 * Cloudflare Pages). Sans elle : clé de test de Cloudflare, refusée par la vraie clé secrète.
 */
export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

let loading: Promise<TurnstileApi> | null = null;

export function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!loading) {
    loading = new Promise<TurnstileApi>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = TURNSTILE_SCRIPT;
      script.async = true;
      script.onload = () =>
        window.turnstile
          ? resolve(window.turnstile)
          : reject(new Error("Turnstile absent"));
      script.onerror = () => reject(new Error("Turnstile non chargé"));
      document.head.append(script);
    }).catch((error) => {
      loading = null;
      throw error;
    });
  }
  return loading;
}
