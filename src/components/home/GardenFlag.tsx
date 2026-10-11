"use client";

import { useLayoutEffect } from "react";
import { getBrowserStore } from "@/lib/journal/browser";
import { setGardenFlag } from "@/lib/journal/garden-flag";

/**
 * Accueil atteint sans rechargement (logo, retour) : le script en ligne ne s'exécute pas, on
 * relit donc le carnet ici, avant l'affichage (useLayoutEffect : aucune bascule visible), puis
 * on suit ses changements tant que l'accueil est ouvert. Ne rend rien.
 */
export function GardenFlag() {
  useLayoutEffect(() => {
    const store = getBrowserStore();
    const sync = () => setGardenFlag(store.getEntries().length > 0);
    sync();
    return store.subscribe(sync);
  }, []);
  return null;
}
