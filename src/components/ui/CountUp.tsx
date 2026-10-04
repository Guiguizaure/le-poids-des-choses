"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";

/**
 * Nombre qui compte jusqu'à sa valeur à l'ouverture (une seule fois). Le lecteur d'écran lit
 * directement la valeur finale. Immobile en mouvement réduit.
 */
export function CountUp({
  value,
  format,
  className = "",
}: {
  value: number;
  format: (value: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const counted = useRef(false);
  const reduceRef = useMotion(ref, () => {});

  useGSAP(
    () => {
      const element = ref.current;
      if (!element || counted.current || !(value > 0)) return;
      counted.current = true;
      if (reduceRef.current) return;
      const state = { value: 0 };
      gsap.to(state, {
        value,
        duration: 1.1,
        ease: "power2.out",
        onUpdate: () => {
          element.textContent = format(state.value);
        },
        onComplete: () => {
          element.textContent = format(value);
        },
      });
    },
    { dependencies: [value] },
  );

  return (
    <>
      <span ref={ref} aria-hidden className={className}>
        {format(value)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </>
  );
}
