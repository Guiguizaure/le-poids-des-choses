// Ciels du jardin : le ciel de scene-paysage et trois ciels à débloquer, uniquement avec les
// couleurs de la palette (src/app/globals.css). Le choix est gardé sur l'appareil (clé dédiée,
// versionnée) ; un ciel pas encore débloqué n'est jamais appliqué.

export type SkyId = "jour" | "aube" | "midi" | "nuit";

export type SkyColors = {
  /** Fond du ciel (calque « ciel »). */
  ciel: string;
  soleil: string;
  /** Anneau qui respire derrière le soleil (calque « halo-soleil »). */
  halo: string;
  /** Nuages (calques « nuage-* »). */
  nuage: string;
  /** Traits du vent, qui passent sur le ciel. */
  vent: string;
};

export type Sky = {
  id: SkyId;
  label: string;
  /** Nombre de choix légers pour le débloquer (0 : toujours là). */
  unlockAt: number;
  colors: SkyColors;
};

/** Couleurs de la palette (src/app/globals.css). */
export const PALETTE = {
  creme: "#FFF3DC",
  encre: "#1F1A17",
  texteAttenue: "#6B625A",
  blanc: "#FFFFFF",
  tomate: "#FF4F2E",
  tomateDouce: "#FFE0D6",
  pomme: "#2FBF71",
  pommeDouce: "#D9F4E4",
  outremer: "#2D4BFF",
  soleil: "#FFC93C",
  rose: "#FF8FB1",
  sapin: "#1B6B45",
} as const;

/** Collines et sol de scene-paysage : le ciel doit s'en distinguer. */
export const LANDSCAPE = {
  collineArriere: PALETTE.outremer,
  collineAvant: PALETTE.pomme,
  sol: PALETTE.pomme,
} as const;

/**
 * Le ciel « Jour » reprend exactement scene-paysage. Pas de ciel outremer : la colline du fond
 * est outremer, elle y disparaîtrait ; le soir devient une nuit encre.
 */
export const SKIES: readonly Sky[] = [
  {
    id: "jour",
    label: "Jour",
    unlockAt: 0,
    colors: {
      ciel: PALETTE.creme,
      soleil: PALETTE.tomate,
      halo: PALETTE.soleil,
      nuage: PALETTE.rose,
      vent: PALETTE.encre,
    },
  },
  {
    id: "aube",
    label: "Aube rose",
    unlockAt: 15,
    colors: {
      ciel: PALETTE.rose,
      soleil: PALETTE.soleil,
      halo: PALETTE.creme,
      nuage: PALETTE.creme,
      vent: PALETTE.encre,
    },
  },
  {
    id: "midi",
    label: "Midi soleil",
    unlockAt: 30,
    colors: {
      ciel: PALETTE.soleil,
      soleil: PALETTE.tomate,
      halo: PALETTE.creme,
      nuage: PALETTE.blanc,
      vent: PALETTE.encre,
    },
  },
  {
    id: "nuit",
    label: "Nuit encre",
    unlockAt: 50,
    colors: {
      ciel: PALETTE.encre,
      soleil: PALETTE.creme,
      halo: PALETTE.texteAttenue,
      nuage: PALETTE.texteAttenue,
      vent: PALETTE.creme,
    },
  },
];

export const DEFAULT_SKY: SkyId = "jour";

export function getSky(id: SkyId): Sky {
  return SKIES.find((sky) => sky.id === id) ?? SKIES[0];
}

export function isSkyUnlocked(id: SkyId, lightChoiceCount: number): boolean {
  return lightChoiceCount >= getSky(id).unlockAt;
}

export function unlockedSkies(lightChoiceCount: number): Sky[] {
  return SKIES.filter((sky) => lightChoiceCount >= sky.unlockAt);
}

/** Ciel appliqué : le ciel choisi s'il est débloqué, sinon le ciel du jour. */
export function effectiveSky(
  chosen: SkyId | null,
  lightChoiceCount: number,
): SkyId {
  return chosen && isSkyUnlocked(chosen, lightChoiceCount)
    ? chosen
    : DEFAULT_SKY;
}

/** Clé du choix de ciel sur l'appareil (format versionné). */
export const SKY_STORAGE_KEY = "lpdc:ciel:v1";

export function serializeSky(id: SkyId): string {
  return JSON.stringify({ version: 1, sky: id });
}

/** Lecture tolérante : format inconnu, JSON illisible ou ciel inconnu → null. */
export function parseStoredSky(text: string | null): SkyId | null {
  if (!text) return null;
  try {
    const value = JSON.parse(text) as { version?: unknown; sky?: unknown };
    if (value?.version !== 1 || typeof value.sky !== "string") return null;
    return SKIES.some((sky) => sky.id === value.sky)
      ? (value.sky as SkyId)
      : null;
  } catch {
    return null;
  }
}

/** Variables CSS posées sur la scène (lues par globals.css sur les calques du paysage). */
export function skyStyle(id: SkyId): Record<string, string> {
  const { colors } = getSky(id);
  return {
    "--sky-ciel": colors.ciel,
    "--sky-soleil": colors.soleil,
    "--sky-halo": colors.halo,
    "--sky-nuage": colors.nuage,
    "--sky-vent": colors.vent,
  };
}
