"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { TalkerId } from "@/content/animaux";
import { Zzz } from "./portrait";

/** Côté minimal d'une zone de toucher (px), quelle que soit la taille de l'écran. */
export const MIN_TOUCH = 44;
/** Une mesure toutes les… images (environ 20 par seconde). */
const FOLLOW_EVERY = 3;

export type TalkTarget = {
  talker: TalkerId;
  /** Élément de la scène qui porte le dessin (ses transformations comprises). */
  selector: string;
  label: string;
  asleep: boolean;
};

/** Cadre visible du dessin d'un animal (tous ses svg, transformations comprises). */
function drawnRect(scene: HTMLElement, selector: string): DOMRect | null {
  const rects = Array.from(
    scene.querySelectorAll<SVGElement>(`${selector} svg`),
  )
    .map((svg) => svg.getBoundingClientRect())
    .filter((rect) => rect.width > 0 && rect.height > 0);
  if (rects.length === 0) return null;
  const left = Math.min(...rects.map((r) => r.left));
  const top = Math.min(...rects.map((r) => r.top));
  const right = Math.max(...rects.map((r) => r.right));
  const bottom = Math.max(...rects.map((r) => r.bottom));
  return new DOMRect(left, top, right - left, bottom - top);
}

/**
 * Zones de toucher invisibles des animaux qui parlent, posées sur la scène (hors de l'image
 * pour les lecteurs d'écran : de vrais boutons). Au moins 44 px de côté, centrées sur le dessin
 * et recalculées une image sur trois, seulement quand le jardin est à l'écran : elles suivent
 * le papillon, la coccinelle qui marche, l'oiseau en vol, le renard. Un animal endormi porte un petit « Zzz ».
 */
export function TalkTargets({
  sceneRef,
  targets,
  onTalk,
}: {
  sceneRef: RefObject<HTMLDivElement | null>;
  targets: readonly TalkTarget[];
  onTalk: (talker: TalkerId, opener: HTMLElement) => void;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const key = targets.map((target) => target.selector).join("|");

  useEffect(() => {
    const layer = layerRef.current;
    const scene = sceneRef.current;
    if (!layer || !scene) return;
    let frame = 0;
    let count = 0;
    let onScreen = true;
    const place = () => {
      const buttons = Array.from(
        layer.querySelectorAll<HTMLElement>("[data-talk]"),
      );
      // Toutes les lectures d'abord, puis toutes les écritures : une seule mise en page.
      const origin = layer.getBoundingClientRect();
      const rects = buttons.map((button) =>
        drawnRect(scene, button.dataset.selector ?? ""),
      );
      buttons.forEach((button, index) => {
        const rect = rects[index];
        if (!rect) {
          button.style.visibility = "hidden";
          return;
        }
        const width = Math.max(MIN_TOUCH, rect.width);
        const height = Math.max(MIN_TOUCH, rect.height);
        const x = rect.left - origin.left + rect.width / 2 - width / 2;
        const y = rect.top - origin.top + rect.height / 2 - height / 2;
        button.style.visibility = "";
        button.style.width = `${width}px`;
        button.style.height = `${height}px`;
        button.style.transform = `translate(${x}px, ${y}px)`;
      });
    };
    // Une mesure toutes les FOLLOW_EVERY images (assez pour suivre l'oiseau en vol), et
    // seulement quand le jardin est à l'écran (l'onglet caché suspend déjà les images).
    const follow = () => {
      if (onScreen && count++ % FOLLOW_EVERY === 0) place();
      frame = requestAnimationFrame(follow);
    };
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) place();
    });
    observer.observe(layer);
    place();
    frame = requestAnimationFrame(follow);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [sceneRef, key]);

  return (
    <div
      ref={layerRef}
      className="pointer-events-none absolute inset-x-0 top-0 aspect-[390/300]"
    >
      {targets.map((target) => (
        <button
          key={target.talker}
          type="button"
          data-talk={target.talker}
          data-selector={target.selector}
          data-asleep={target.asleep ? "" : undefined}
          aria-label={target.label}
          onClick={(event) => onTalk(target.talker, event.currentTarget)}
          // Hors de l'écran tant que la position n'est pas mesurée.
          style={{ transform: "translate(-200vw, 0)" }}
          className="focus-visible:outline-outremer pointer-events-auto absolute top-0 left-0 cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {target.asleep ? (
            <Zzz className="absolute -top-2 right-0 text-[13px]" />
          ) : null}
        </button>
      ))}
    </div>
  );
}
