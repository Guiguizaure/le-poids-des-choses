"use client";

import { useRef } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { gsap } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";

type HedgehogProps = {
  /** Version endormie (jardin assoupi) : roulé en boule, respiration lente. */
  asleep?: boolean;
  title?: string;
  className?: string;
};

/**
 * Hérisson : quelques pas, renifle, fait demi-tour ; endormi, c'est une boule qui respire
 * doucement. Immobile en mouvement réduit.
 */
export function Hedgehog({
  asleep = false,
  title,
  className = "w-16",
}: HedgehogProps) {
  const ref = useRef<HTMLDivElement>(null);

  useMotion(
    ref,
    (reduce) => {
      if (reduce) return;
      if (asleep) {
        gsap.to('[data-part="piquants"]', {
          scale: 1.04,
          transformOrigin: "50% 50%",
          duration: 2.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
        return;
      }
      const body = "[data-walk]";
      const snout = '[data-part="museau"]';
      const steps = (timeline: gsap.core.Timeline, direction: 1 | -1) => {
        for (let i = 1; i <= 3; i++) {
          timeline
            .to(body, {
              xPercent: direction > 0 ? i * 5 : 15 - i * 5,
              yPercent: -4,
              duration: 0.16,
              ease: "power1.out",
            })
            .to(body, { yPercent: 0, duration: 0.12, ease: "power1.in" });
        }
      };
      const sniff = (timeline: gsap.core.Timeline) =>
        timeline
          .to(
            snout,
            {
              rotation: -7,
              transformOrigin: "0% 50%",
              duration: 0.09,
              repeat: 5,
              yoyo: true,
            },
            "+=0.2",
          )
          .set(snout, { rotation: 0 });

      const timeline = gsap.timeline({
        repeat: -1,
        repeatDelay: 1.5,
        delay: 0.6,
      });
      timeline.set(body, { scaleX: 1, transformOrigin: "50% 100%" });
      steps(timeline, 1);
      sniff(timeline);
      timeline.set(body, { scaleX: -1 }, "+=0.8");
      steps(timeline, -1);
      sniff(timeline);
      timeline.set(body, { scaleX: 1 }, "+=0.8");
    },
    [asleep],
  );

  return (
    <div ref={ref} className={className}>
      <div data-walk>
        <Illustration
          name={asleep ? "herisson-endormi" : "herisson"}
          title={title}
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}
