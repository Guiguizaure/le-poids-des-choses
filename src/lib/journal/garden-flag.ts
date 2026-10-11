// Accueil : `data-garden` sur <html> quand le carnet a au moins une entrée (le CSS de l'accueil
// choisit alors « Retrouver mon jardin »). Posé avant le premier affichage par le script en ligne
// (src/components/home/returning.ts), puis tenu à jour côté client : à l'arrivée sur l'accueil
// par une navigation sans rechargement (GardenFlag) et dès que le carnet change (getBrowserStore).

export function setGardenFlag(hasGarden: boolean): void {
  const html = document.documentElement;
  if (hasGarden) html.setAttribute("data-garden", "");
  else html.removeAttribute("data-garden");
}
