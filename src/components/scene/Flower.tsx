"use client";

import type { IllustrationName } from "@/lib/illustrations/specs";
import { StagedPlant, type PlantBloom, type PlantPaint } from "./StagedPlant";

export const FLOWER_STAGES = ["pousse", "fleurie"] as const;
export type FlowerStage = (typeof FLOWER_STAGES)[number];
export type FlowerVariant = 1 | 2 | 3;

type FlowerProps = {
  variant: FlowerVariant;
  stage: FlowerStage;
  title?: string;
  /** Taille : une largeur suffit, la hauteur suit le cadre 60×80. */
  className?: string;
  sparkle?: boolean;
  /** Immobile : ni balancement ni vent (jardin assoupi). */
  still?: boolean;
  /** Pousse depuis le pied à l'apparition (nouvelle plante). */
  popIn?: boolean;
  /** Facteur appliqué aux épaisseurs de trait (vitrine : celles du jardin). */
  strokeScale?: number;
  /** Couleur de saison du feuillage (null : celle du dessin). */
  paint?: PlantPaint | null;
  /** Épanouissement, posé sur la plante adulte. */
  bloom?: Omit<PlantBloom<string>, "stage"> | null;
};

/** Fleur à deux stades ; elle se balance et se couche au vent depuis son pied. */
export function Flower({
  variant,
  stage,
  title,
  className = "w-[60px]",
  sparkle = true,
  still,
  popIn,
  strokeScale,
  paint,
  bloom,
}: FlowerProps) {
  return (
    <StagedPlant
      stages={FLOWER_STAGES}
      stage={stage}
      illustrationFor={(s) => `fleur-${variant}-${s}` as IllustrationName}
      swing="whole"
      title={title}
      className={className}
      sparkle={sparkle}
      still={still}
      popIn={popIn}
      strokeScale={strokeScale}
      paint={paint}
      bloom={bloom ? { ...bloom, stage: "fleurie" } : null}
    />
  );
}
