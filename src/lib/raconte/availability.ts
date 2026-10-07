"use client";

import { useEffect, useState } from "react";

export type RaconteAvailability = "checking" | "enabled" | "disabled";

// Une seule question par chargement de page (GET /api/raconte), partagée par l'écran et les
// points d'entrée : sans fonctions, ou fonction coupée (AI_ENABLED), la réponse est « disabled ».
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
  const [state, setState] = useState<RaconteAvailability>("checking");
  useEffect(() => {
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
