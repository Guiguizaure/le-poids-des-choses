// Lancé à la main : `pnpm build-gestures`. Télécharge le CSV Impact CO2 (ADEME) et écrit
// src/lib/data/gestures.generated.json. Aucune clé API nécessaire.
import { writeFileSync } from "node:fs";
import type { Category, Gesture, Unit } from "../src/lib/data/types";

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
const numerique = {
  theme: "Usage numérique",
  category: "numerique",
  unit: "heure",
  defaultQuantity: 1,
} as const;

export const SELECTION: readonly Selection[] = [
  { ...transport, sourceId: "tgv", id: "tgv", label: "TGV" },
  { ...transport, sourceId: "ter", id: "ter", label: "TER" },
  {
    ...transport,
    sourceId: "avion-courtcourrier",
    id: "avion",
    label: "Avion (court courrier)",
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

  { ...habit, sourceId: "jeans", id: "jean", label: "Jean neuf" },
  {
    ...habit,
    sourceId: "tshirtencoton",
    id: "tshirt",
    label: "T-shirt en coton neuf",
  },
  {
    ...habit,
    sourceId: "pullenlaine",
    id: "pull",
    label: "Pull en laine neuf",
  },
  {
    ...habit,
    sourceId: "chaussuresdesport",
    id: "chaussures",
    label: "Chaussures de sport neuves",
  },

  {
    ...numerique,
    sourceId: "streamingvideo",
    id: "streaming",
    label: "Streaming vidéo",
  },
  {
    ...numerique,
    sourceId: "visioconference",
    id: "visio",
    label: "Visioconférence",
  },
  {
    ...equipement,
    sourceId: "smartphone",
    id: "smartphone",
    label: "Smartphone neuf",
  },
  {
    ...equipement,
    sourceId: "ordinateurportable",
    id: "ordinateur-portable",
    label: "Ordinateur portable neuf",
  },
  {
    ...equipement,
    sourceId: "television",
    id: "television",
    label: "Télévision neuve",
  },
];

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

  return selection.map((sel) => {
    const row = byId.get(sel.sourceId);
    if (!row) throw new Error(`ID « ${sel.sourceId} » absent du CSV.`);
    if (row[iTheme].trim() !== sel.theme) {
      throw new Error(
        `« ${sel.sourceId} » est dans « ${row[iTheme]} », attendu « ${sel.theme} » (${row[iLabel]}).`,
      );
    }
    const value = Number(row[iValue]);
    if (!Number.isFinite(value) || value < 0)
      throw new Error(
        `Valeur invalide pour « ${sel.sourceId} » : ${row[iValue]}`,
      );
    return {
      id: sel.id,
      label: sel.label,
      category: sel.category,
      unit: sel.unit,
      kgCo2ePerUnit: roundSignificant(value),
      defaultQuantity: sel.defaultQuantity,
      source: "impactco2",
      fictive: false,
      sourceId: sel.sourceId,
      sourceUrl: row[iUrl].trim(),
    };
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
