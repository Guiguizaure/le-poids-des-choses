// Valeurs fictives, à ne jamais citer.
// Ordres de grandeur plausibles uniquement, pour développer sans l'API. Chaque geste doit
// porter `fictive: true` et `source: "fictive"` (STRICT_DATA=1 fait échouer le build sinon).
import type { Gesture } from "./types";

const km = { unit: "km", defaultQuantity: 10 } as const;
const repas = { unit: "repas", defaultQuantity: 1 } as const;
const objet = { unit: "objet", defaultQuantity: 1 } as const;
const heure = { unit: "heure", defaultQuantity: 1 } as const;
const fictif = { source: "fictive", fictive: true } as const;

export const testGestures: readonly Gesture[] = [
  // Transport (kg CO2e par km)
  {
    id: "train",
    label: "Train",
    category: "transport",
    ...km,
    kgCo2ePerUnit: 0.03,
    ...fictif,
  },
  {
    id: "avion",
    label: "Avion",
    category: "transport",
    ...km,
    kgCo2ePerUnit: 0.2,
    ...fictif,
  },
  {
    id: "voiture",
    label: "Voiture seul·e",
    category: "transport",
    ...km,
    kgCo2ePerUnit: 0.22,
    ...fictif,
  },
  {
    id: "covoiturage",
    label: "Voiture à quatre",
    category: "transport",
    ...km,
    kgCo2ePerUnit: 0.055,
    ...fictif,
  },
  {
    id: "bus",
    label: "Bus",
    category: "transport",
    ...km,
    kgCo2ePerUnit: 0.1,
    ...fictif,
  },
  {
    id: "velo",
    label: "Vélo",
    category: "transport",
    ...km,
    kgCo2ePerUnit: 0,
    ...fictif,
  },
  {
    id: "metro",
    label: "Métro",
    category: "transport",
    ...km,
    kgCo2ePerUnit: 0.005,
    ...fictif,
  },

  // Alimentation (kg CO2e par repas)
  {
    id: "repas-vegetarien",
    label: "Repas végétarien",
    category: "alimentation",
    ...repas,
    kgCo2ePerUnit: 0.9,
    ...fictif,
  },
  {
    id: "repas-vegetalien",
    label: "Repas végétal",
    category: "alimentation",
    ...repas,
    kgCo2ePerUnit: 0.5,
    ...fictif,
  },
  {
    id: "repas-boeuf",
    label: "Repas au bœuf",
    category: "alimentation",
    ...repas,
    kgCo2ePerUnit: 5,
    ...fictif,
  },
  {
    id: "repas-poulet",
    label: "Repas au poulet",
    category: "alimentation",
    ...repas,
    kgCo2ePerUnit: 1.5,
    ...fictif,
  },
  {
    id: "repas-poisson",
    label: "Repas au poisson",
    category: "alimentation",
    ...repas,
    kgCo2ePerUnit: 1.9,
    ...fictif,
  },
  {
    id: "repas-porc",
    label: "Repas au porc",
    category: "alimentation",
    ...repas,
    kgCo2ePerUnit: 1.7,
    ...fictif,
  },

  // Habillement (kg CO2e par objet)
  {
    id: "jean-neuf",
    label: "Jean neuf",
    category: "habillement",
    ...objet,
    kgCo2ePerUnit: 25,
    ...fictif,
  },
  {
    id: "tshirt-neuf",
    label: "T-shirt neuf",
    category: "habillement",
    ...objet,
    kgCo2ePerUnit: 7,
    ...fictif,
  },
  {
    id: "pull-laine-neuf",
    label: "Pull en laine neuf",
    category: "habillement",
    ...objet,
    kgCo2ePerUnit: 55,
    ...fictif,
  },
  {
    id: "vetement-occasion",
    label: "Vêtement d'occasion",
    category: "habillement",
    ...objet,
    kgCo2ePerUnit: 1.5,
    ...fictif,
  },

  // Numérique (kg CO2e par heure)
  {
    id: "visio",
    label: "Visioconférence",
    category: "numerique",
    ...heure,
    kgCo2ePerUnit: 0.06,
    ...fictif,
  },
  {
    id: "streaming",
    label: "Streaming vidéo",
    category: "numerique",
    ...heure,
    kgCo2ePerUnit: 0.07,
    ...fictif,
  },
  {
    id: "appel",
    label: "Appel audio",
    category: "numerique",
    ...heure,
    kgCo2ePerUnit: 0.01,
    ...fictif,
  },
  {
    id: "musique",
    label: "Musique en ligne",
    category: "numerique",
    ...heure,
    kgCo2ePerUnit: 0.02,
    ...fictif,
  },
];
