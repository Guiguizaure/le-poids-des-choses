// Lancé à la main : `pnpm build-gestures`. Télécharge le CSV Impact CO2 (ADEME) et écrit
// src/lib/data/gestures.generated.json. Aucune clé API nécessaire.
import { writeFileSync } from "node:fs";
import type {
  AcquisitionMode,
  Category,
  Gesture,
  ModeValue,
  Unit,
} from "../src/lib/data/types";

const CSV_URL = "https://impactco2.fr/equivalents.csv";
const OUTPUT = new URL(
  "../src/lib/data/gestures.generated.json",
  import.meta.url,
);

type Selection = {
  sourceId: string;
  /** Thématique attendue dans le CSV : garde-fou contre un ID qui changerait de sens. */
  theme: string;
  id: string;
  label: string;
  /** Précision affichée sous le libellé (cartes du parcours). */
  detail?: string;
  category: Category;
  unit: Unit;
  defaultQuantity: number;
};

const transport = {
  theme: "Transport",
  category: "transport",
  unit: "km",
  defaultQuantity: 10,
} as const;
const repas = {
  theme: "Alimentation",
  category: "alimentation",
  unit: "repas",
  defaultQuantity: 1,
} as const;
const habit = {
  theme: "Habillement",
  category: "habillement",
  unit: "objet",
  defaultQuantity: 1,
} as const;
const equipement = {
  theme: "Numérique",
  category: "numerique",
  unit: "objet",
  defaultQuantity: 1,
} as const;
const boisson = {
  theme: "Boisson",
  category: "boisson",
  unit: "litre",
  defaultQuantity: 1,
} as const;
// Livraison d'un même achat (colis d'1 kg) : le CSV donne un total par livraison ou achat.
const livraison = {
  theme: "Livraison",
  category: "livraison",
  unit: "achat",
  defaultQuantity: 1,
} as const;

export const SELECTION: readonly Selection[] = [
  { ...transport, sourceId: "tgv", id: "tgv", label: "TGV" },
  { ...transport, sourceId: "ter", id: "ter", label: "TER" },
  {
    ...transport,
    sourceId: "avion-courtcourrier",
    id: "avion",
    label: "Avion",
    detail: "trajet court",
  },
  {
    ...transport,
    sourceId: "voiturethermique",
    id: "voiture",
    label: "Voiture thermique",
  },
  { ...transport, sourceId: "busthermique", id: "bus", label: "Bus" },
  { ...transport, sourceId: "metro", id: "metro", label: "Métro" },
  { ...transport, sourceId: "velo", id: "velo", label: "Vélo" },
  { ...transport, sourceId: "marche", id: "marche", label: "Marche" },

  {
    ...repas,
    sourceId: "repasvegetarien",
    id: "repas-vegetarien",
    label: "Repas végétarien",
  },
  {
    ...repas,
    sourceId: "repasvegetalien",
    id: "repas-vegetalien",
    label: "Repas végétal",
  },
  {
    ...repas,
    sourceId: "repasavecdupoulet",
    id: "repas-poulet",
    label: "Repas au poulet",
  },
  {
    ...repas,
    sourceId: "repasavecduboeuf",
    id: "repas-boeuf",
    label: "Repas au bœuf",
  },
  {
    ...repas,
    sourceId: "repasavecdupoissonblanc",
    id: "repas-poisson",
    label: "Repas au poisson blanc (cabillaud)",
  },

  { ...habit, sourceId: "jeans", id: "jean", label: "Jean" },
  {
    ...habit,
    sourceId: "tshirtencoton",
    id: "tshirt",
    label: "T-shirt en coton",
  },
  {
    ...habit,
    sourceId: "pullenlaine",
    id: "pull",
    label: "Pull en laine",
  },
  {
    ...habit,
    sourceId: "chaussuresdesport",
    id: "chaussures",
    label: "Chaussures de sport",
  },

  {
    ...equipement,
    sourceId: "smartphone",
    id: "smartphone",
    label: "Smartphone",
  },
  {
    ...equipement,
    sourceId: "ordinateurportable",
    id: "ordinateur-portable",
    label: "Ordinateur portable",
  },
  {
    ...equipement,
    sourceId: "television",
    id: "television",
    label: "Télévision",
  },

  {
    ...boisson,
    sourceId: "eaudurobinet",
    id: "eau-robinet",
    label: "Eau du robinet",
  },
  {
    ...boisson,
    sourceId: "eauenbouteille",
    id: "eau-bouteille",
    label: "Eau en bouteille",
  },
  { ...boisson, sourceId: "cafe", id: "cafe", label: "Café" },
  { ...boisson, sourceId: "the", id: "the", label: "Thé" },
  { ...boisson, sourceId: "soda", id: "soda", label: "Soda" },
  { ...boisson, sourceId: "biere", id: "biere", label: "Bière" },
  { ...boisson, sourceId: "vin", id: "vin", label: "Vin" },
  {
    ...boisson,
    sourceId: "laitdevache",
    id: "lait-vache",
    label: "Lait de vache",
  },
  {
    ...boisson,
    sourceId: "soja",
    id: "boisson-soja",
    label: "Boisson au soja",
  },

  {
    ...livraison,
    sourceId: "livraisondomicile",
    id: "livraison-domicile",
    label: "Livraison à domicile",
    detail: "colis d’1 kg",
  },
  {
    ...livraison,
    sourceId: "pointrelaisdouce",
    id: "point-relais-pied",
    label: "Point relais à pied",
    detail: "colis d’1 kg",
  },
  {
    ...livraison,
    sourceId: "pointrelais",
    id: "point-relais-voiture",
    label: "Point relais en voiture",
    detail: "3,5 km en voiture, colis d’1 kg",
  },
  {
    ...livraison,
    sourceId: "magasindouce",
    id: "magasin-pied",
    label: "En magasin à pied",
    detail: "colis d’1 kg",
  },
  {
    ...livraison,
    sourceId: "magasin",
    id: "magasin-voiture",
    label: "En magasin en voiture",
    detail: "15 km en voiture, colis d’1 kg",
  },
];

/**
 * Colis (ligne « Livraison à domicile » du CSV) retenu pour chaque objet, selon son poids
 * approximatif emballé. Hypothèse de taille à relire : sans entrée ici, pas d'option
 * « occasion livrée » pour l'objet (aucun transport n'est inventé).
 */
export const PARCEL_BY_GESTURE_ID: Readonly<Record<string, string>> = {
  jean: "livraisondomicile",
  tshirt: "livraisondomicile",
  pull: "livraisondomicile",
  chaussures: "livraisondomicile2kg",
  smartphone: "livraisondomicile",
  "ordinateur-portable": "livraisondomicile2kg",
  television: "livraisondomicile15kg",
};
const PARCEL_THEME = "Livraison";

/** Analyse CSV minimale (RFC 4180 : guillemets, virgules et retours à la ligne dans les champs). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const src = text.replace(/^﻿/, "");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

export function roundSignificant(value: number, digits = 4): number {
  return Number(value.toPrecision(digits));
}

export function buildGestures(
  csv: string,
  selection: readonly Selection[] = SELECTION,
  parcels: Readonly<Record<string, string>> = PARCEL_BY_GESTURE_ID,
): Gesture[] {
  const [header, ...rows] = parseCsv(csv);
  const col = (name: string) => {
    const index = header.findIndex((h) =>
      h.trim().toLowerCase().startsWith(name),
    );
    if (index === -1)
      throw new Error(`Colonne « ${name} » introuvable dans le CSV.`);
    return index;
  };
  const [iLabel, iValue, iTheme, iId, iUrl] = [
    col("nom"),
    col("kg co2e"),
    col("thématique"),
    col("id"),
    col("url"),
  ];
  const byId = new Map(rows.map((r) => [r[iId]?.trim(), r]));

  const lookup = (sourceId: string, theme: string) => {
    const row = byId.get(sourceId);
    if (!row) throw new Error(`ID « ${sourceId} » absent du CSV.`);
    if (row[iTheme].trim() !== theme) {
      throw new Error(
        `« ${sourceId} » est dans « ${row[iTheme]} », attendu « ${theme} » (${row[iLabel]}).`,
      );
    }
    const value = Number(row[iValue]);
    if (!Number.isFinite(value) || value < 0)
      throw new Error(`Valeur invalide pour « ${sourceId} » : ${row[iValue]}`);
    return { value, label: row[iLabel].trim(), url: row[iUrl].trim() };
  };

  return selection.map((sel) => {
    const { value, url } = lookup(sel.sourceId, sel.theme);
    const gesture: Gesture = {
      id: sel.id,
      label: sel.label,
      ...(sel.detail ? { detail: sel.detail } : {}),
      category: sel.category,
      unit: sel.unit,
      kgCo2ePerUnit: roundSignificant(value),
      defaultQuantity: sel.defaultQuantity,
      source: "impactco2",
      fictive: false,
      sourceId: sel.sourceId,
      sourceUrl: url,
    };

    if (sel.unit === "objet") {
      const modes: Partial<Record<AcquisitionMode, ModeValue>> = {
        neuf: {
          kgCo2e: gesture.kgCo2ePerUnit,
          method: "impactco2",
          sourceId: sel.sourceId,
          sourceUrl: url,
        },
        occasion: { kgCo2e: 0, method: "hypothese-occasion" },
      };
      const parcelId = parcels[sel.id];
      if (parcelId) {
        const parcel = lookup(parcelId, PARCEL_THEME);
        modes["occasion-livree"] = {
          kgCo2e: roundSignificant(parcel.value),
          method: "hypothese-occasion",
          parts: [
            {
              label: "Fabrication évitée (hypothèse)",
              kgCo2e: 0,
              method: "hypothese-occasion",
            },
            {
              label: parcel.label,
              kgCo2e: roundSignificant(parcel.value),
              method: "impactco2",
              sourceId: parcelId,
              sourceUrl: parcel.url,
            },
          ],
        };
      }
      modes.garder = { kgCo2e: 0, method: "hypothese-garder" };
      gesture.modes = modes;
    }
    return gesture;
  });
}

async function main() {
  const response = await fetch(CSV_URL);
  if (!response.ok)
    throw new Error(`Téléchargement impossible : HTTP ${response.status}`);
  const gestures = buildGestures(await response.text());
  const file = {
    downloadedAt: new Date().toISOString(),
    source: CSV_URL,
    gestures,
  };
  writeFileSync(OUTPUT, JSON.stringify(file, null, 2) + "\n");
  console.log(
    `${gestures.length} gestes écrits dans src/lib/data/gestures.generated.json`,
  );
}

if (
  process.argv[1] &&
  import.meta.url === new URL(`file://${process.argv[1]}`).href
) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
