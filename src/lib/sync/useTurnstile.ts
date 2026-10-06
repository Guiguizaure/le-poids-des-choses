"use client";

// Widget Turnstile partagé (formulaire de connexion, « Raconte ta journée ») : chargé au
// premier usage seulement, un jeton par envoi (un jeton ne sert qu'une fois).
import { useCallback, useEffect, useRef } from "react";
import { loadTurnstile, TURNSTILE_SITE_KEY } from "./turnstile";

export type TurnstileToken =
  { ok: true; token: string } | { ok: false; reason: "load" | "challenge" };

export function useTurnstile() {
  const widget = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const token = useRef<string | null>(null);
  const waiters = useRef<((value: string | null) => void)[]>([]);

  const settle = (value: string | null) => {
    token.current = value;
    waiters.current.splice(0).forEach((resolve) => resolve(value));
  };

  /** Charge Turnstile et affiche le widget (une seule fois). Faux si le script manque. */
  const prepare = useCallback(async (): Promise<boolean> => {
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
  }, []);

  /** Jeton pour un envoi : attend la vérification si elle n'est pas finie. */
  const getToken = useCallback(async (): Promise<TurnstileToken> => {
    if (!(await prepare())) return { ok: false, reason: "load" };
    const value = token.current
      ? token.current
      : await new Promise<string | null>((resolve) =>
          waiters.current.push(resolve),
        );
    return value
      ? { ok: true, token: value }
      : { ok: false, reason: "challenge" };
  }, [prepare]);

  /** Après un envoi : le jeton est usé, le widget en prépare un autre. */
  const consume = useCallback(() => {
    token.current = null;
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  }, []);

  useEffect(
    () => () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
    },
    [],
  );

  return { widget, prepare, getToken, consume };
}
