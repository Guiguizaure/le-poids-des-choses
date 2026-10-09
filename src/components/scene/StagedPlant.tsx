"use client";

import { useId, useLayoutEffect, useRef } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { useGust } from "@/components/motion/gust";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";
import { gustLean } from "@/lib/geometry/gust";
import {
  BRANCH_COLOR,
  BUD_COLOR,
  gradientTransformFor,
  type BareBranches,
  type SeasonalFoliage,
} from "@/lib/garden/foliage";
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

const FOLIAGE =
  '[data-part="feuillage"], [data-part="feuilles"], [data-part="ramure"]';

/**
 * Feuillage de saison (table des espèces, src/lib/garden/species.ts) : dégradé d'automne, ou
 * arbre endormi l'hiver (feuillage caché, branches nues et bourgeons).
 */
export type PlantPaint = SeasonalFoliage & { layers: readonly string[] };

const SVG_NS = "http://www.w3.org/2000/svg";

/** Branches nues d'un arbre endormi, posées sur le dessin du stade (décoratif). */
function Bare({
  bare,
  frame,
  strokeScale,
}: {
  bare: BareBranches;
  frame: { width: number; height: number };
  strokeScale: number;
}) {
  return (
    <svg
      viewBox={`0 0 ${frame.width} ${frame.height}`}
      className="absolute inset-0 block h-full w-full"
      aria-hidden
      data-bare
    >
      {/* La ramure se balance comme le feuillage ; des bourgeons seuls (figuier, dont les
          branches sont dans le tronc) restent au bout des branches. */}
      <g
        data-part={bare.branches.length > 0 ? "ramure" : "bourgeons"}
        transform={bare.transform}
      >
        {bare.branches.map((branch) => (
          <path
            key={branch.d}
            d={branch.d}
            fill="none"
            stroke={BRANCH_COLOR}
            strokeLinecap="round"
            // En style (et non en attribut) : l'épaisseur du jardin est déjà appliquée.
            style={{ strokeWidth: branch.width * strokeScale }}
          />
        ))}
        {bare.buds.map((bud) => (
          <circle
            key={`${bud.x} ${bud.y}`}
            cx={bud.x}
            cy={bud.y}
            r={bare.budRadius}
            fill={BUD_COLOR}
          />
        ))}
      </g>
    </svg>
  );
}

/**
 * Épanouissement posé sur la plante adulte : un seul groupe affiché (celui du niveau), jamais
 * plusieurs ; aucun au niveau 0.
 */
export type PlantBloom<S extends string> = {
  illustration: IllustrationName;
  groups: readonly string[];
  /** Stade adulte, sur lequel il se pose. */
  stage: S;
  level: 0 | 1 | 2 | 3;
};

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
  /** Facteur appliqué aux épaisseurs de trait (vitrine : celles du jardin). */
  strokeScale?: number;
  /** Couleur de saison du feuillage (null : celle du dessin). */
  paint?: PlantPaint | null;
  /** Épanouissement (absent : la plante n'en a pas). */
  bloom?: PlantBloom<S> | null;
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
  strokeScale = 1,
  paint = null,
  bloom = null,
}: StagedPlantProps<S>) {
  const ref = useRef<HTMLDivElement>(null);
  const sparkleRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const previousStage = useRef(stage);
  const bloomShown = bloom && bloom.stage === stage ? bloom.level : 0;
  const previousBloom = useRef(bloomShown);
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

  // Feuillage de saison, posé sur les formes des calques de la table des espèces : dégradé
  // d'automne (un dégradé par forme, créé ici : les dessins publiés n'ont aucun id), ou
  // feuillage caché l'hiver (les branches nues sont dessinées par <Bare>).
  const gradientsRef = useRef<SVGDefsElement>(null);
  const uid = useId().replace(/[^A-Za-z0-9_-]/g, "");
  const paintKey = paint ? JSON.stringify(paint) : "";
  useLayoutEffect(() => {
    const root = ref.current;
    const defs = gradientsRef.current;
    if (!root || !paint) return;
    const touched: SVGElement[] = [];
    const created: Element[] = [];
    for (const s of stages) {
      const selector = paint.layers
        .map((layer) => `[data-stage="${s}"] [data-part="${layer}"]`)
        .join(", ");
      const groups = Array.from(root.querySelectorAll<SVGElement>(selector));
      if (paint.mode === "asleep") {
        for (const group of groups) {
          group.style.visibility = "hidden";
          touched.push(group);
        }
        continue;
      }
      const range = paint.y[s as keyof typeof paint.y];
      if (!range || !defs) continue;
      const shapes = groups.flatMap((group) =>
        Array.from(group.children as HTMLCollectionOf<SVGElement>),
      );
      shapes.forEach((shape, index) => {
        const id = `${uid}-automne-${s}-${index}`;
        const gradient = document.createElementNS(SVG_NS, "linearGradient");
        gradient.setAttribute("id", id);
        gradient.setAttribute("gradientUnits", "userSpaceOnUse");
        gradient.setAttribute("x1", "60");
        gradient.setAttribute("x2", "60");
        gradient.setAttribute("y1", String(range[0]));
        gradient.setAttribute("y2", String(range[1]));
        const inverse = gradientTransformFor(shape.getAttribute("transform"));
        if (inverse) gradient.setAttribute("gradientTransform", inverse);
        for (const [offset, color] of [
          ["0", paint.top],
          ["1", paint.bottom],
        ]) {
          const stop = document.createElementNS(SVG_NS, "stop");
          stop.setAttribute("offset", offset);
          stop.setAttribute("stop-color", color);
          gradient.appendChild(stop);
        }
        defs.appendChild(gradient);
        created.push(gradient);
        shape.style.fill = `url(#${id})`;
        touched.push(shape);
      });
    }
    return () => {
      for (const element of touched) {
        element.style.fill = "";
        element.style.visibility = "";
      }
      for (const element of created) element.remove();
    };
    // paintKey résume `paint` (un nouvel objet à chaque rendu).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paintKey, uid]);

  // Épanouissement : seul le groupe du niveau affiché est visible.
  const bloomGroups = bloom?.groups.join(",") ?? "";
  useLayoutEffect(() => {
    const layer = bloomRef.current;
    if (!layer || !bloom) return;
    bloom.groups.forEach((group, index) => {
      const element = layer.querySelector<SVGElement>(`[data-part="${group}"]`);
      if (element)
        element.style.display = index + 1 === bloomShown ? "" : "none";
    });
    // bloomGroups résume `bloom.groups`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bloomGroups, bloomShown]);

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
      // L'épanouissement suit le feuillage (arbres) ou la plante entière (fleurs).
      const bloomLayer = bloomRef.current;
      if (bloomLayer) targets.push(bloomLayer);
      const items = targets.map((target) => {
        gsap.set(target, {
          transformOrigin:
            target === bloomLayer
              ? swing === "foliage"
                ? foliageBase(
                    root,
                    bloom?.stage,
                    spec.width,
                    spec.height,
                    origin,
                  )
                : origin
              : swing === "foliage"
                ? "50% 100%"
                : origin,
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
    [still, bloom?.stage],
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
    placeSparkle(sparkleRef.current, layer, spec.width, spec.height);
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

  // Épanouissement qui gagne un niveau : le nouveau groupe s'ouvre, avec l'éclat.
  useGSAP(
    () => {
      const from = previousBloom.current;
      previousBloom.current = bloomShown;
      const inner = bloomRef.current?.firstElementChild;
      if (!inner || bloomShown <= from) return;
      const reduce = reduceRef.current;
      gsap.fromTo(
        inner,
        reduce ? { autoAlpha: 0 } : { autoAlpha: 0.3, scale: 0.85 },
        reduce
          ? { autoAlpha: 1, duration: 0.2 }
          : {
              autoAlpha: 1,
              scale: 1,
              duration: GROWTH.duration,
              ease: GROWTH.ease,
            },
      );
      const current = ref.current?.querySelector<HTMLElement>(
        `[data-stage="${stage}"]`,
      );
      if (current) sparkleOver(current, reduce);
    },
    { scope: ref, dependencies: [bloomShown] },
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
          {paint?.mode === "asleep" && s in paint.bare ? (
            <Bare
              bare={paint.bare[s as keyof typeof paint.bare]}
              frame={spec}
              strokeScale={strokeScale}
            />
          ) : null}
        </div>
      ))}
      {/* Dégradés d'automne, créés à la demande (voir plus haut). */}
      <svg aria-hidden width="0" height="0" className="absolute">
        <defs ref={gradientsRef} />
      </svg>
      {bloom ? (
        <div
          ref={bloomRef}
          data-bloom={bloomShown}
          className="pointer-events-none absolute inset-0"
          style={{ visibility: bloomShown > 0 ? "visible" : "hidden" }}
        >
          <div className="absolute inset-0" style={{ transformOrigin: origin }}>
            <Illustration
              name={bloom.illustration}
              className="block h-full w-full"
            />
          </div>
        </div>
      ) : null}
      {sparkle ? (
        <div
          ref={sparkleRef}
          data-sparkle
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

/** Centre l'éclat (point de rayonnement) au sommet de la plante affichée. */
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
  const svg = stageLayer.querySelector<SVGSVGElement>("svg");
  const top = topOfDrawing(
    stageLayer.querySelector<SVGGraphicsElement>(FOLIAGE) ?? svg,
    frameHeight,
  );
  gsap.set(sparkleElement, {
    left: `${((frameWidth / 2 - anchor.x) / frameWidth) * 100}%`,
    top: `${((top - anchor.y) / frameHeight) * 100}%`,
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

/**
 * Pivot du balancement de l'épanouissement d'un arbre : la base du feuillage adulte (là où
 * pivote le feuillage, `50% 100%` de son emprise), exprimée dans le cadre de la plante.
 */
function foliageBase(
  root: HTMLElement,
  stage: string | undefined,
  frameWidth: number,
  frameHeight: number,
  fallback: string,
): string {
  const foliage = root.querySelector<SVGGraphicsElement>(
    `[data-stage="${stage}"] [data-part="feuillage"]`,
  );
  try {
    if (foliage) {
      const box = foliage.getBBox();
      const pct = (value: number) => `${Math.round(value * 1000) / 10}%`;
      return `${pct((box.x + box.width / 2) / frameWidth)} ${pct((box.y + box.height) / frameHeight)}`;
    }
  } catch {
    // getBBox indisponible : on garde le pied de la plante.
  }
  return fallback;
}
