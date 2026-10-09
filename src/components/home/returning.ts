// Accueil : quelqu'un qui revient a déjà un carnet sur l'appareil (au moins une entrée).
// Script en ligne, lancé avant le premier affichage des boutons : il pose `data-garden` sur
// <html>, et le CSS choisit l'action principale (« Retrouver mon jardin »). Même clé que le
// carnet (src/lib/journal/store.ts) ; stockage indisponible ou illisible : rien ne change.
import { STORAGE_KEY } from "@/lib/journal/schema";

/** Vrai si le carnet stocké a au moins une entrée (même lecture que le script). */
export function hasGarden(raw: string | null): boolean {
  try {
    const journal = JSON.parse(raw ?? "null") as { entries?: unknown } | null;
    return Array.isArray(journal?.entries) && journal.entries.length > 0;
  } catch {
    return false;
  }
}

export const RETURNING_SCRIPT = `try{var j=JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})||"null");if(j&&Array.isArray(j.entries)&&j.entries.length>0)document.documentElement.setAttribute("data-garden","")}catch(e){}`;
