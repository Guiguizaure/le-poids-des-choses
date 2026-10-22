"use client";

import { useEffect, useState } from "react";
import { RACONTE_ENABLED } from "./enabled";

export type RaconteAvailability = "checking" | "enabled" | "disabled";

// Une seule question par chargement de page (GET /api/raconte), partagée par l'écran et les
// points d'entrée : sans fonctions, ou fonction coupée (AI_ENABLED), la réponse est « disabled ».
// En veille (drapeau de build éteint), rien n'est demandé : « disabled » d'emblée.
let pending: Promise<boolean> | null = null;

function askOnce(): Promise<boolean> {
  pending ??= fetch("/api/raconte", { credentials: "same-origin" })
    .then((response) => (response.ok ? response.json() : null))
    .then((body: { enabled?: unknown } | null) => body?.enabled === true)
    .catch(() => false);
  return pending;
}

/** « Raconte ta journée » est-il disponible (AI_ENABLED actif côté Cloudflare) ? */
export function useRaconteAvailability(): RaconteAvailability {
  const [state, setState] = useState<RaconteAvailability>(
    RACONTE_ENABLED ? "checking" : "disabled",
  );
  useEffect(() => {
    if (!RACONTE_ENABLED) return;
    let cancelled = false;
    void askOnce().then((enabled) => {
      if (!cancelled) setState(enabled ? "enabled" : "disabled");
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return state;
}
