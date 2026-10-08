"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";
import {
  BIRD_HOME,
  BIRD_SIZE,
  FLIGHT,
  flightDelay,
  flightPose,
} from "@/lib/geometry/flight";

/**
 * Trajet de l'oiseau en vol : son cadre suit le trajet (décollage sous le soleil, boucle dans
 * la bande de ciel, retour), se retourne dans le sens du vol et s'incline selon la pente, puis
 * revient exactement à sa place. `data-flight` donne la phase (depart, boucle, retour).
 */
export function FlightPath({
  flying,
  onLanded,
  children,
}: {
  flying: boolean;
  onLanded: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const onLandedRef = useRef(onLanded);
  useEffect(() => {
    onLandedRef.current = onLanded;
  });

  useGSAP(
    () => {
      const element = ref.current;
      const body = bodyRef.current;
      if (!flying || !element || !body) return;
      const state = { progress: 0 };
      const apply = () => {
        const pose = flightPose(state.progress);
        // Décalage depuis la place au sol, en pourcentage du cadre de l'oiseau.
        gsap.set(element, {
          xPercent: ((pose.x - BIRD_HOME[0]) / BIRD_SIZE.width) * 100,
          yPercent: ((pose.y - BIRD_HOME[1]) / BIRD_SIZE.height) * 100,
          rotation: pose.tilt,
        });
        gsap.set(body, { scaleX: pose.facing });
        element.dataset.flight = pose.phase;
      };
      gsap.to(state, {
        progress: 1,
        duration: FLIGHT.duration,
        ease: "sine.inOut",
        onUpdate: apply,
        onComplete: () => onLandedRef.current(),
      });
      return () => {
        delete element.dataset.flight;
      };
    },
    { scope: ref, dependencies: [flying], revertOnUpdate: true },
  );

  return (
    <div ref={ref}>
      <div ref={bodyRef}>{children}</div>
    </div>
  );
}

const SEED_KEY = "lpdc:flight-seed";
let memorySeed: number | null = null;
/** Rang du prochain envol spontané dans la session (la suite des délais en dépend). */
let flightIndex = 0;

/** Graine des envols : tirée une fois par session de navigation, puis réutilisée. */
function sessionSeed(): number {
  try {
    const stored = window.sessionStorage.getItem(SEED_KEY);
    if (stored !== null && Number.isFinite(Number(stored)))
      return Number(stored);
    const seed = Math.floor(Math.random() * 2 ** 31);
    window.sessionStorage.setItem(SEED_KEY, String(seed));
    return seed;
  } catch {
    // Stockage indisponible : une graine par chargement de page.
    memorySeed ??= Math.floor(Math.random() * 2 ** 31);
    return memorySeed;
  }
}

/** Envols spontanés, toutes les 40 à 90 s (onglet visible seulement). */
export function useAutoFlights(enabled: boolean, start: () => void): void {
  const startRef = useRef(start);
  useEffect(() => {
    startRef.current = start;
  });
  useEffect(() => {
    if (!enabled) return;
    const seed = sessionSeed();
    let timer: number | undefined;
    const schedule = () => {
      timer = window.setTimeout(
        () => {
          if (document.visibilityState === "visible") startRef.current();
          else schedule();
        },
        flightDelay(seed, flightIndex++) * 1000,
      );
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, [enabled]);
}
