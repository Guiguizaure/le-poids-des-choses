"use client";

import { useRef } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { gsap } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";
import type { LiveVisitor } from "@/lib/garden/live";
import { FOX_WALK } from "@/lib/garden/visitors";
import { StagedPlant } from "./StagedPlant";

/**
 * Un visiteur du jardin vivant. Plantes : elles se balancent et se couchent au vent comme
 * les fleurs. Animaux : petit mouvement propre (ailes de l'hirondelle et de la libellule,
 * sautillement du rouge-gorge, queue de l'écureuil, ailes de la cigale, tête du hibou,
 * renard qui marche) ; endormis, une respiration lente. Immobiles en mouvement réduit et quand
 * le jardin est assoupi (`still`).
 */
export function Visitor({
  visitor,
  still = false,
}: {
  visitor: LiveVisitor;
  still?: boolean;
}) {
  if (visitor.rule.place === "plant")
    return (
      <StagedPlant
        stages={[visitor.kind]}
        stage={visitor.kind}
        illustrationFor={() => visitor.illustration}
        swing="whole"
        className="w-full"
        sparkle={false}
        still={still}
      />
    );
  return <VisitorAnimal visitor={visitor} still={still} />;
}

function VisitorAnimal({
  visitor,
  still,
}: {
  visitor: LiveVisitor;
  still: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { kind, asleep } = visitor;

  useMotion(
    ref,
    (reduce) => {
      if (reduce || still) return;
      const part = (name: string) => `[data-part="${name}"]`;
      if (asleep) {
        gsap.to("[data-body]", {
          scaleY: 1.03,
          transformOrigin: "50% 100%",
          duration: 2.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
        return;
      }
      switch (kind) {
        case "hirondelle":
        case "libellule": {
          const [front, back, origin] =
            kind === "hirondelle"
              ? [part("aile-avant"), part("aile-arriere"), "30 26"]
              : [part("ailes-avant"), part("ailes-arriere"), "34 22"];
          const speed = kind === "hirondelle" ? 0.22 : 0.08;
          gsap.to(front, {
            scaleY: -0.4,
            svgOrigin: origin,
            duration: speed,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
          gsap.to(back, {
            scaleY: -0.4,
            svgOrigin: origin,
            duration: speed,
            delay: speed / 2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
          // Vol sur place : léger flottement.
          gsap.to("[data-body]", {
            yPercent: -12,
            xPercent: 8,
            duration: 2.2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
          break;
        }
        case "rouge-gorge":
          gsap
            .timeline({ repeat: -1, repeatDelay: 3.5 })
            .to("[data-body]", {
              yPercent: -14,
              duration: 0.18,
              ease: "power2.out",
            })
            .to("[data-body]", {
              yPercent: 0,
              duration: 0.22,
              ease: "bounce.out",
            });
          break;
        case "ecureuil":
          gsap.fromTo(
            part("queue"),
            { rotation: -6 },
            {
              rotation: 6,
              svgOrigin: "20 36",
              duration: 1.2,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            },
          );
          break;
        case "cigale":
          gsap.timeline({ repeat: -1, repeatDelay: 2.5 }).to(part("ailes"), {
            scaleY: 0.85,
            svgOrigin: "22 22",
            duration: 0.05,
            repeat: 9,
            yoyo: true,
          });
          break;
        case "hibou":
          gsap
            .timeline({ repeat: -1, repeatDelay: 4 })
            .to("[data-body]", {
              rotation: 6,
              transformOrigin: "50% 100%",
              duration: 0.5,
              ease: "power1.inOut",
            })
            .to("[data-body]", { rotation: 0, duration: 0.5, delay: 1.2 });
          break;
        case "renard": {
          // Va-et-vient au sol, dans la place qui lui est réservée (FOX_WALK de chaque côté).
          const shift = (FOX_WALK / visitor.box.width) * 100;
          gsap
            .timeline({ repeat: -1 })
            .set("[data-body]", { scaleX: 1, transformOrigin: "50% 100%" })
            .to("[data-body]", { xPercent: shift, duration: 4, ease: "none" })
            .set("[data-body]", { scaleX: -1 })
            .to("[data-body]", { xPercent: -shift, duration: 8, ease: "none" })
            .set("[data-body]", { scaleX: 1 })
            .to("[data-body]", { xPercent: 0, duration: 4, ease: "none" });
          break;
        }
      }
    },
    [kind, asleep, still],
  );

  return (
    <div ref={ref} className="w-full" aria-hidden>
      <div data-body>
        <Illustration
          name={visitor.illustration}
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}
