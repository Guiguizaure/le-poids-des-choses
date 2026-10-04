"use client";

import type { IllustrationName } from "@/lib/illustrations/specs";
import { StagedPlant } from "./StagedPlant";

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
};

/** Arbre à trois stades ; le feuillage se balance et se couche au vent. */
export function Tree({
  variant,
  stage,
  title,
  className = "w-[120px]",
  sparkle = true,
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
    />
  );
}
