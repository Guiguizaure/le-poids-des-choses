// Option comparée à chaque geste repéré : une table écrite à la main, jamais choisie par l'IA,
// et modifiable par la personne avant l'ajout. Toujours un geste de même unité (les objets se
// comparent à eux-mêmes, dans un autre mode d'acquisition).
import { getGesture } from "@/lib/data";

/**
 * Geste repéré → autre option la plus courante pour le même besoin. Ce n'est pas l'option la
 * plus lourde : c'est celle qu'on aurait le plus probablement prise autrement.
 */
export const ALTERNATIVES: Readonly<Record<string, string>> = {
  // Se déplacer (km)
  tgv: "voiture",
  ter: "voiture",
  bus: "voiture",
  metro: "voiture",
  velo: "voiture",
  marche: "voiture",
  voiture: "ter",
  avion: "tgv",
  // Manger (repas)
  "repas-vegetarien": "repas-poulet",
  "repas-vegetalien": "repas-poulet",
  "repas-poulet": "repas-vegetarien",
  "repas-boeuf": "repas-vegetarien",
  "repas-poisson": "repas-vegetarien",
  // Boire (litre)
  "eau-robinet": "eau-bouteille",
  "eau-bouteille": "eau-robinet",
  cafe: "the",
  the: "cafe",
  soda: "eau-robinet",
  biere: "vin",
  vin: "biere",
  "lait-vache": "boisson-soja",
  "boisson-soja": "lait-vache",
  // Se faire livrer (achat)
  "livraison-domicile": "point-relais-pied",
  "point-relais-pied": "livraison-domicile",
  "point-relais-voiture": "point-relais-pied",
  "magasin-pied": "magasin-voiture",
  "magasin-voiture": "magasin-pied",
};

/**
 * Autre option d'un geste : celle de la table, ou rien (objet, ou geste absent de la table :
 * un test vérifie qu'aucun geste du catalogue n'est oublié).
 */
export function alternativeFor(gestureId: string): string | null {
  const gesture = getGesture(gestureId);
  if (!gesture || gesture.unit === "objet") return null;
  const alternative = ALTERNATIVES[gestureId];
  const other = alternative ? getGesture(alternative) : undefined;
  return other && other.unit === gesture.unit && other.id !== gesture.id
    ? other.id
    : null;
}
