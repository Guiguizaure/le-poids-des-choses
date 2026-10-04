"use client";

import { useRef } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";
import {
  anchorAsCssOrigin,
  getSpec,
  type IllustrationName,
} from "@/lib/illustrations/specs";
import { sparkleHiddenStyle, playSparkle } from "./Sparkle";

export const TREE_STAGES = ["pousse", "jeune", "grand"] as const;
export type TreeStage = (typeof TREE_STAGES)[number];
export type TreeVariant = 1 | 2 | 3;

const FOLIAGE = '[data-part="feuillage"], [data-part="feuilles"]';

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

/**
 * Arbre à trois stades (un SVG par stade, même cadre). Les trois stades sont superposés ; au
 * changement, le nouveau monte depuis le pied en fondu. Le feuillage se balance au repos.
 */
export function Tree({
  variant,
  stage,
  title,
  className = "w-[120px]",
  sparkle = true,
}: TreeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<HTMLDivElement>(null);
  const previousStage = useRef(stage);
  const names = TREE_STAGES.map(
    (s) => `arbre-${variant}-${s}` as IllustrationName,
  );
  const spec = getSpec(names[0]);
  const origin = anchorAsCssOrigin(names[0]);

  const reduceRef = useMotion(ref, (reduce) => {
    if (reduce || !ref.current) return;
    for (const part of gsap.utils.toArray<SVGGElement>(FOLIAGE, ref.current)) {
      gsap.fromTo(
        part,
        { rotation: -1.5, transformOrigin: "50% 100%" },
        {
          rotation: 1.5,
          duration: gsap.utils.random(2.2, 3.2),
          delay: gsap.utils.random(0, 1),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        },
      );
    }
  });

  useGSAP(
    () => {
      const from = previousStage.current;
      previousStage.current = stage;
      const root = ref.current;
      if (from === stage || !root) return;

      const layers = gsap.utils.toArray<HTMLElement>("[data-stage]", root);
      const current = root.querySelector<HTMLElement>(
        `[data-stage="${stage}"]`,
      );
      const previous = root.querySelector<HTMLElement>(
        `[data-stage="${from}"]`,
      );
      if (!current || !previous) return;
      gsap.killTweensOf(layers);
      for (const layer of layers)
        if (layer !== current && layer !== previous)
          gsap.set(layer, { autoAlpha: 0 });

      const reduce = reduceRef.current;
      if (reduce) {
        gsap.fromTo(
          previous,
          { autoAlpha: 1, scale: 1 },
          { autoAlpha: 0, duration: 0.2 },
        );
        gsap.fromTo(
          current,
          { autoAlpha: 0, scale: 1 },
          { autoAlpha: 1, duration: 0.2 },
        );
      } else {
        gsap.fromTo(
          previous,
          { autoAlpha: 1, scale: 1 },
          { autoAlpha: 0, scale: 0.92, duration: 0.3 },
        );
        gsap.fromTo(
          current,
          { autoAlpha: 0, scale: 0.5 },
          { autoAlpha: 1, scale: 1, duration: 0.7, ease: "back.out(1.6)" },
        );
      }

      const grew = TREE_STAGES.indexOf(stage) > TREE_STAGES.indexOf(from);
      if (sparkle && grew && sparkleRef.current) {
        placeSparkle(sparkleRef.current, current, spec.width, spec.height);
        playSparkle(sparkleRef.current, reduce).delay(reduce ? 0 : 0.25);
      }
    },
    { scope: ref, dependencies: [stage] },
  );

  return (
    <div
      ref={ref}
      className={`relative ${className}`}
      style={{ aspectRatio: `${spec.width} / ${spec.height}` }}
      {...(title
        ? { role: "img", "aria-label": title }
        : { "aria-hidden": true })}
    >
      {TREE_STAGES.map((s, i) => (
        <div
          key={s}
          data-stage={s}
          className="absolute inset-0"
          style={{
            transformOrigin: origin,
            opacity: s === stage ? 1 : 0,
            visibility: s === stage ? "visible" : "hidden",
          }}
        >
          <Illustration name={names[i]} className="block h-full w-full" />
        </div>
      ))}
      {sparkle ? (
        <div
          ref={sparkleRef}
          className="pointer-events-none absolute"
          style={{
            ...sparkleHiddenStyle,
            width: `${(getSpec("eclat").width / spec.width) * 100}%`,
            aspectRatio: "1",
          }}
        >
          <Illustration name="eclat" className="block h-full w-full" />
        </div>
      ) : null}
    </div>
  );
}

/** Centre l'éclat (point de rayonnement) au sommet du feuillage du stade affiché. */
function placeSparkle(
  sparkleElement: HTMLElement,
  stageLayer: HTMLElement,
  frameWidth: number,
  frameHeight: number,
) {
  const sparkleSpec = getSpec("eclat");
  const anchor = sparkleSpec.anchor ?? {
    x: sparkleSpec.width / 2,
    y: sparkleSpec.height / 2,
  };
  const foliage = stageLayer.querySelector<SVGGraphicsElement>(FOLIAGE);
  let top = frameHeight / 2;
  try {
    if (foliage) top = foliage.getBBox().y;
  } catch {
    // getBBox indisponible (élément non rendu) : on garde le milieu du cadre.
  }
  gsap.set(sparkleElement, {
    left: `${((frameWidth / 2 - anchor.x) / frameWidth) * 100}%`,
    top: `${((top - anchor.y) / frameHeight) * 100}%`,
  });
}
