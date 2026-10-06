"use client";

import type { IllustrationName } from "@/lib/illustrations/specs";
import { StagedPlant, type PlantBloom, type PlantPaint } from "./StagedPlant";

export const TREE_STAGES = ["pousse", "jeune", "grand"] as const;
export type TreeStage = (typeof TREE_STAGES)[number];
export type TreeVariant = 1 | 2 | 3;

type TreeProps = {
  variant: TreeVariant;
  stage: TreeStage;
  /** Titre accessible ; sans titre, l'arbre est décoratif. */
  title?: string;
  /** Taille : une largeur suffit, la hauteur suit le cadre 120×160. */
  className?: string;
  /** Éclat quand l'arbre grandit (par défaut oui). */
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

/** Arbre à trois stades ; le feuillage se balance et se couche au vent. */
export function Tree({
  variant,
  stage,
  title,
  className = "w-[120px]",
  sparkle = true,
  still,
  popIn,
  strokeScale,
  paint,
  bloom,
}: TreeProps) {
  return (
    <StagedPlant
      stages={TREE_STAGES}
      stage={stage}
      illustrationFor={(s) => `arbre-${variant}-${s}` as IllustrationName}
      swing="foliage"
      title={title}
      className={className}
      sparkle={sparkle}
      still={still}
      popIn={popIn}
      strokeScale={strokeScale}
      paint={paint}
      bloom={bloom ? { ...bloom, stage: "grand" } : null}
    />
  );
}
