"use client";

import { useRef, type CSSProperties } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { gsap } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";
import type { IllustrationName } from "@/lib/illustrations/specs";

/** Pose à l'entrée dans l'écran : le papier tombe d'un rien plus haut, penché, puis se pose. */
export const CUTOUT_ENTRY = {
  y: -14,
  rotation: -9,
  duration: 0.7,
  ease: "back.out(1.7)",
} as const;

/**
 * Illustration décorative posée sur la page comme un papier découpé : légère rotation, ombre
 * portée encre. Cadre de taille fixe (aucun décalage de mise en page), aria-hidden, aucune
 * information. Elle se pose en entrant dans l'écran (GSAP) ; rien en mouvement réduit. Celles
 * déjà visibles au chargement restent affichées et ne font que se reposer (pas de clignotement).
 */
export function PaperCutout({
  name,
  tilt,
  className = "",
}: {
  name: IllustrationName;
  /** Rotation au repos, en degrés. */
  tilt: number;
  /** Taille et placement du cadre (dimensions fixes). */
  className?: string;
}) {
  const frame = useRef<HTMLSpanElement>(null);
  const paper = useRef<HTMLSpanElement>(null);

  useMotion(frame, (reduce) => {
    const element = paper.current;
    if (reduce || !element || typeof IntersectionObserver === "undefined")
      return;
    const rect = element.getBoundingClientRect();
    // Masquée (petit écran) : rien à animer.
    if (rect.width === 0) return;
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      gsap.fromTo(
        element,
        { rotation: CUTOUT_ENTRY.rotation / 2 },
        { rotation: 0, duration: 0.9, ease: "elastic.out(1, 0.5)" },
      );
      return;
    }
    gsap.set(element, {
      autoAlpha: 0,
      y: CUTOUT_ENTRY.y,
      rotation: CUTOUT_ENTRY.rotation,
    });
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        gsap.to(element, {
          autoAlpha: 1,
          y: 0,
          rotation: 0,
          duration: CUTOUT_ENTRY.duration,
          ease: CUTOUT_ENTRY.ease,
        });
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      gsap.set(element, { clearProps: "all" });
    };
  });

  return (
    <span
      ref={frame}
      aria-hidden
      className={`pointer-events-none block shrink-0 select-none ${className}`}
      style={
        {
          transform: `rotate(${tilt}deg)`,
          filter: "drop-shadow(3px 3px 0 var(--color-encre))",
        } as CSSProperties
      }
    >
      <span ref={paper} className="block size-full">
        <Illustration name={name} className="block size-full" />
      </span>
    </span>
  );
}
