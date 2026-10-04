"use client";

import { useLayoutEffect, useRef } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { useGust } from "@/components/motion/gust";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";
import { gustLean } from "@/lib/geometry/gust";
import {
  anchorAsCssOrigin,
  getSpec,
  type IllustrationName,
} from "@/lib/illustrations/specs";
import { playSparkle, sparkleHiddenStyle } from "./Sparkle";

/** Pousse : montée depuis le pied avec un léger dépassement d'échelle avant de se poser. */
export const GROWTH = {
  duration: 0.7,
  ease: "back.out(2)",
  fromScale: 0.4,
} as const;
/** Balancement au repos (degrés) : calme. */
const SWAY_ANGLE = 1.5;

const FOLIAGE = '[data-part="feuillage"], [data-part="feuilles"]';

type SwayItem = { sway: number; lean: number; apply: () => void };

type StagedPlantProps<S extends string> = {
  stages: readonly S[];
  stage: S;
  /** Illustration de chaque stade (même cadre pour tous). */
  illustrationFor: (stage: S) => IllustrationName;
  /**
   * Ce qui se balance et se couche au vent : le feuillage (arbres) ou la plante entière
   * depuis son pied (fleurs).
   */
  swing: "foliage" | "whole";
  title?: string;
  className: string;
  sparkle: boolean;
  /** Immobile : ni balancement ni vent (jardin assoupi). */
  still?: boolean;
  /** À l'apparition, la plante pousse depuis son pied (avec l'éclat). */
  popIn?: boolean;
  /**
   * Agrandissement du dessin (vitrine de révélation) : l'éclat garde sa taille habituelle
   * au lieu de grossir avec la plante.
   */
  zoom?: number;
  /** Facteur appliqué aux épaisseurs de trait (vitrine : celles du jardin). */
  strokeScale?: number;
};

/**
 * Plante à plusieurs stades (un SVG par stade). Les stades sont superposés ; au changement, le
 * nouveau monte depuis le pied en fondu, avec un éclat s'il grandit. Au repos, la plante se
 * balance doucement ; un coup de vent la couche de 6 à 10° quand le front l'atteint.
 */
export function StagedPlant<S extends string>({
  stages,
  stage,
  illustrationFor,
  swing,
  title,
  className,
  sparkle,
  still = false,
  popIn = false,
  zoom = 1,
  strokeScale = 1,
}: StagedPlantProps<S>) {
  const ref = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<HTMLDivElement>(null);
  const previousStage = useRef(stage);
  const swayItems = useRef<SwayItem[]>([]);
  const firstName = illustrationFor(stages[0]);
  const spec = getSpec(firstName);
  const origin = anchorAsCssOrigin(firstName);

  // Agrandie, la plante garde l'épaisseur de trait du jardin : seule la forme grossit.
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || strokeScale === 1) return;
    const stroked = root.querySelectorAll<SVGElement>(
      "[data-stage] [stroke-width]",
    );
    for (const element of stroked) {
      element.style.strokeWidth = String(
        Number(element.getAttribute("stroke-width")) * strokeScale,
      );
    }
    return () => {
      for (const element of stroked) element.style.strokeWidth = "";
    };
  }, [strokeScale]);

  const reduceRef = useMotion(
    ref,
    (reduce) => {
      swayItems.current = [];
      const root = ref.current;
      if (reduce || still || !root) return;
      const targets =
        swing === "foliage"
          ? gsap.utils.toArray<Element>(FOLIAGE, root)
          : gsap.utils.toArray<Element>("[data-stage]", root);
      const items = targets.map((target) => {
        gsap.set(target, {
          transformOrigin: swing === "foliage" ? "50% 100%" : origin,
        });
        const setRotation = gsap.quickSetter(target, "rotation", "deg");
        // Le balancement et l'inclinaison au vent s'additionnent sur la même rotation.
        const item: SwayItem = {
          sway: 0,
          lean: 0,
          apply: () => setRotation(item.sway + item.lean),
        };
        gsap.fromTo(
          item,
          { sway: -SWAY_ANGLE },
          {
            sway: SWAY_ANGLE,
            duration: gsap.utils.random(2.2, 3.2),
            delay: gsap.utils.random(0, 1),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            onUpdate: item.apply,
          },
        );
        return item;
      });
      swayItems.current = items;
      return () => {
        gsap.killTweensOf(items);
        gsap.set(targets, { rotation: 0 });
        swayItems.current = [];
      };
    },
    [still],
  );

  useGust(ref, reduceRef, (delay) => {
    if (still) return;
    const lean = gustLean();
    for (const item of swayItems.current) {
      gsap.killTweensOf(item, "lean");
      gsap
        .timeline({ delay })
        .to(item, {
          lean,
          duration: 0.35,
          ease: "power2.out",
          onUpdate: item.apply,
        })
        .to(item, {
          lean: 0,
          duration: 1.2,
          ease: "elastic.out(1, 0.5)",
          onUpdate: item.apply,
        });
    }
  });

  const sparkleOver = (layer: HTMLElement, reduce: boolean) => {
    if (!sparkle || !sparkleRef.current) return;
    placeSparkle(sparkleRef.current, layer, spec.width, spec.height, zoom);
    playSparkle(sparkleRef.current, reduce).delay(reduce ? 0 : 0.25);
  };

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
      // Le balancement anime des objets intermédiaires, pas les calques : rien à préserver ici.
      gsap.killTweensOf(layers);
      for (const layer of layers) {
        if (layer !== current && layer !== previous)
          gsap.set(layer, { autoAlpha: 0 });
      }

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
          { autoAlpha: 0, scale: 0.9, duration: 0.3 },
        );
        gsap.fromTo(
          current,
          { autoAlpha: 0, scale: GROWTH.fromScale },
          {
            autoAlpha: 1,
            scale: 1,
            duration: GROWTH.duration,
            ease: GROWTH.ease,
          },
        );
      }

      const grew = stages.indexOf(stage) > stages.indexOf(from);
      if (grew) sparkleOver(current, reduce);
    },
    { scope: ref, dependencies: [stage] },
  );

  // Apparition (nouvelle plante dans le jardin) : elle pousse depuis son pied, puis l'éclat.
  useGSAP(
    () => {
      const current = ref.current?.querySelector<HTMLElement>(
        `[data-stage="${stage}"]`,
      );
      if (!popIn || !current) return;
      const reduce = reduceRef.current;
      if (reduce) {
        gsap.fromTo(current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 });
      } else {
        gsap.fromTo(
          current,
          { autoAlpha: 0, scale: GROWTH.fromScale },
          {
            autoAlpha: 1,
            scale: 1,
            duration: GROWTH.duration,
            ease: GROWTH.ease,
          },
        );
      }
      sparkleOver(current, reduce);
    },
    { scope: ref },
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
      {stages.map((s) => (
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
          <Illustration
            name={illustrationFor(s)}
            className="block h-full w-full"
          />
        </div>
      ))}
      {sparkle ? (
        <div
          ref={sparkleRef}
          className="pointer-events-none absolute"
          style={{
            ...sparkleHiddenStyle,
            width: `${(getSpec("eclat").width / zoom / spec.width) * 100}%`,
            aspectRatio: "1",
          }}
        >
          <Illustration name="eclat" className="block h-full w-full" />
        </div>
      ) : null}
    </div>
  );
}

/** Centre l'éclat (point de rayonnement) au sommet de la plante affichée. */
function placeSparkle(
  sparkleElement: HTMLElement,
  stageLayer: HTMLElement,
  frameWidth: number,
  frameHeight: number,
  zoom: number,
) {
  const sparkleSpec = getSpec("eclat");
  const anchor = sparkleSpec.anchor ?? {
    x: sparkleSpec.width / 2,
    y: sparkleSpec.height / 2,
  };
  const svg = stageLayer.querySelector<SVGSVGElement>("svg");
  const top = topOfDrawing(
    stageLayer.querySelector<SVGGraphicsElement>(FOLIAGE) ?? svg,
    frameHeight,
  );
  gsap.set(sparkleElement, {
    left: `${((frameWidth / 2 - anchor.x / zoom) / frameWidth) * 100}%`,
    top: `${((top - anchor.y / zoom) / frameHeight) * 100}%`,
  });
}

function topOfDrawing(
  element: SVGGraphicsElement | null,
  frameHeight: number,
): number {
  try {
    if (element) return element.getBBox().y;
  } catch {
    // getBBox indisponible (élément non rendu) : on garde le milieu du cadre.
  }
  return frameHeight / 2;
}
