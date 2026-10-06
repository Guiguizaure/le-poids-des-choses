"use client";

import { useRef } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { gsap } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";
import {
  fallingParticles,
  particleAt,
  SNOW_DRIFT_SECONDS,
} from "@/lib/geometry/fall";
import { SCENE } from "@/lib/garden/scene";
import type { Season } from "@/lib/garden/seasons";

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

/** Neige sur les collines et le haut du sol (hiver), posée entre le paysage et les plantes. */
export function SeasonGround({ season }: { season: Season | null }) {
  if (season !== "hiver") return null;
  return (
    <div
      className="pointer-events-none absolute inset-0"
      data-season-layer="neige"
      aria-hidden
    >
      <Illustration name="saison-hiver-neige" className="block h-auto w-full" />
    </div>
  );
}

/**
 * Ce qui tombe sur le jardin, par-dessus les plantes : flocons l'hiver (la couche glisse
 * lentement), pétales au printemps, feuilles en automne. En pause quand l'onglet est caché ou
 * la scène hors de l'écran. En mouvement réduit, ou quand le jardin dort : les flocons restent
 * immobiles et rien ne tombe.
 */
export function SeasonFall({
  season,
  still = false,
}: {
  season: Season | null;
  still?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const particles = fallingParticles(season);

  useMotion(
    ref,
    (reduce) => {
      const root = ref.current;
      if (reduce || still || !root) return;
      const tweens: gsap.core.Tween[] = [];

      const snow = root.querySelector<HTMLElement>("[data-snow]");
      if (snow)
        tweens.push(
          gsap.fromTo(
            snow,
            { yPercent: -50 },
            {
              yPercent: 0,
              duration: SNOW_DRIFT_SECONDS,
              ease: "none",
              repeat: -1,
            },
          ),
        );

      const falling = Array.from(
        root.querySelectorAll<HTMLElement>("[data-particle]"),
      );
      falling.forEach((element, index) => {
        const particle = particles[index];
        if (!particle) return;
        const toX = (x: number) => (x / particle.size) * 100;
        const toY = (y: number) => (y / particle.size) * 100;
        const state = { t: 0 };
        const apply = () => {
          const pose = particleAt(particle, state.t);
          gsap.set(element, {
            xPercent: toX(pose.x - particle.x),
            yPercent: toY(pose.y - particle.startY),
            rotation: pose.rotation,
            opacity: pose.opacity,
          });
        };
        apply();
        gsap.set(element, { visibility: "visible" });
        tweens.push(
          gsap.to(state, {
            t: 1,
            duration: particle.duration,
            delay: particle.delay,
            ease: "none",
            repeat: -1,
            onUpdate: apply,
          }),
        );
      });

      // Pause quand l'onglet est caché ou la scène hors de l'écran.
      let inView = typeof IntersectionObserver === "undefined";
      const sync = () => {
        const run = inView && document.visibilityState === "visible";
        tweens.forEach((tween) => (run ? tween.resume() : tween.pause()));
      };
      const observer =
        typeof IntersectionObserver === "undefined"
          ? null
          : new IntersectionObserver((records) => {
              inView = records.some((record) => record.isIntersecting);
              sync();
            });
      observer?.observe(root);
      document.addEventListener("visibilitychange", sync);
      sync();
      return () => {
        observer?.disconnect();
        document.removeEventListener("visibilitychange", sync);
        tweens.forEach((tween) => tween.kill());
        gsap.set(falling, { visibility: "hidden" });
      };
    },
    [season, still],
  );

  if (!season || (season !== "hiver" && particles.length === 0)) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      data-season-layer={season}
      aria-hidden
    >
      {season === "hiver" ? (
        // Deux couches de flocons l'une au-dessus de l'autre : la boucle ne se voit pas.
        <div data-snow className="absolute inset-x-0 top-0 h-[200%]">
          <Illustration
            name="saison-hiver-flocons"
            className="block h-1/2 w-full"
          />
          <Illustration
            name="saison-hiver-flocons"
            className="block h-1/2 w-full"
          />
        </div>
      ) : null}
      {particles.map((particle, index) => (
        <div
          key={index}
          data-particle
          className="absolute"
          style={{
            left: pct(particle.x, SCENE.width),
            top: pct(particle.startY, SCENE.height),
            width: pct(particle.size, SCENE.width),
            // Cachées tant qu'elles ne tombent pas (mouvement réduit : jamais affichées).
            visibility: "hidden",
          }}
        >
          <Illustration name={particle.name} className="block h-auto w-full" />
        </div>
      ))}
    </div>
  );
}
