"use client";

import { useRef, type CSSProperties } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { gsap } from "@/components/motion/gsap";
import { useMotion } from "@/components/motion/useMotion";
import { CUTOUT_ENTRY } from "@/components/ui/PaperCutout";
import {
  FLOAT,
  FLOAT_ROW_HEIGHT,
  floatLayout,
  floatMotion,
  floatRow,
  parallaxOffset,
} from "@/lib/geometry/float";
import { MONTH_NAMES } from "@/lib/saison";
import { drawnForMonth } from "@/lib/saison/drawn";

const layer = (root: Element, name: string) =>
  root.querySelector<HTMLElement>(`[data-layer="${name}"]`)!;

/**
 * Fruits et légumes dessinés qui flottent à côté de l'encart de saison : ceux de saison ce
 * mois-là (`drawnForMonth`). Zone de taille fixe (rien ne bouge à leur arrivée), aria-hidden,
 * jamais focalisable. Large : 4 ou 5 produits à droite du texte ; étroit : une rangée de 3
 * sous le texte ; trop étroit : masquée. Ils apparaissent en fondu décalé à l'entrée dans
 * l'écran, flottent (dérive et petite rotation, jamais synchrones), suivent un peu le
 * défilement et rebondissent une fois au toucher. Flottement en pause quand l'onglet est caché
 * ou la zone hors de l'écran ; tout immobile en mouvement réduit. Au-dessus, le mois en
 * étiquette de papier découpé (« octobre »), qui se pose avant les produits.
 */
export function FloatingProduce({ month }: { month: number | null }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const zone = useRef<HTMLDivElement>(null);
  const names = month ? drawnForMonth(month) : [];
  const slots = floatLayout(names.length);
  const row = floatRow(names.length);

  const reduceRef = useMotion(
    wrapper,
    (reduce) => {
      const root = zone.current;
      const tag =
        wrapper.current?.querySelector<HTMLElement>("[data-month-tag]");
      if (!root || !tag || names.length === 0) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-produce]", root);
      const bouncers = items.map((item) => layer(item, "bounce"));
      if (reduce) {
        gsap.set([tag, ...bouncers], { autoAlpha: 1 });
        return;
      }

      // Flottement : aller-retour sans fin, chacun à sa durée et à sa phase.
      const floats = items.map((item, index) => {
        const motion = floatMotion(index);
        const tween = gsap.fromTo(
          layer(item, "float"),
          { y: -motion.drift, rotation: -motion.swing },
          {
            y: motion.drift,
            rotation: motion.swing,
            duration: motion.duration,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            paused: true,
          },
        );
        tween.totalTime(motion.delay);
        return tween;
      });

      // Parallaxe discrète au défilement.
      const parallax = items.map((item) =>
        gsap.quickTo(layer(item, "parallax"), "y", {
          duration: 0.6,
          ease: "power3",
        }),
      );
      let frame = 0;
      const follow = () => {
        frame = 0;
        const rect = root.getBoundingClientRect();
        if (rect.height === 0) return;
        const center = rect.top + rect.height / 2;
        parallax.forEach((to, index) =>
          to(
            parallaxOffset(
              center,
              window.innerHeight,
              floatMotion(index).parallax,
            ),
          ),
        );
      };
      const onScroll = () => {
        if (!frame) frame = requestAnimationFrame(follow);
      };
      follow();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);

      // Pause quand l'onglet est caché ou la zone hors de l'écran.
      let inView = typeof IntersectionObserver === "undefined";
      let entered = false;
      const enter = () => {
        if (entered) return;
        entered = true;
        gsap
          .timeline()
          .fromTo(
            tag,
            {
              autoAlpha: 0,
              y: CUTOUT_ENTRY.y,
              rotation: CUTOUT_ENTRY.rotation,
            },
            {
              autoAlpha: 1,
              y: 0,
              rotation: 0,
              duration: CUTOUT_ENTRY.duration,
              ease: CUTOUT_ENTRY.ease,
            },
          )
          .fromTo(
            bouncers,
            { autoAlpha: 0, scale: 0.85 },
            {
              autoAlpha: 1,
              scale: 1,
              duration: FLOAT.enter.duration,
              stagger: FLOAT.enter.stagger,
              ease: "back.out(1.6)",
            },
            "-=0.45",
          );
      };
      const sync = () => {
        const run = inView && document.visibilityState === "visible";
        floats.forEach((tween) => (run ? tween.resume() : tween.pause()));
      };
      const observer =
        typeof IntersectionObserver === "undefined"
          ? null
          : new IntersectionObserver(
              (entries) => {
                inView = entries.some((entry) => entry.isIntersecting);
                if (inView) enter();
                sync();
              },
              { rootMargin: "0px 0px -5% 0px" },
            );
      if (observer) observer.observe(root);
      else enter();
      sync();
      document.addEventListener("visibilitychange", sync);

      return () => {
        observer?.disconnect();
        cancelAnimationFrame(frame);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        document.removeEventListener("visibilitychange", sync);
      };
    },
    [month, names.join()],
  );

  /** Un rebond, au toucher ou au clic ; rien en mouvement réduit ni pendant un autre. */
  const bounce = (element: HTMLElement) => {
    if (reduceRef.current || gsap.isTweening(element)) return;
    gsap
      .timeline()
      .to(element, {
        y: -FLOAT.bounce.height,
        scaleX: 0.94,
        scaleY: 1.06,
        duration: FLOAT.bounce.up,
        ease: "power2.out",
      })
      .to(element, {
        y: 0,
        scaleX: 1,
        scaleY: 1,
        duration: FLOAT.bounce.down,
        ease: "bounce.out",
      });
  };

  const rowCount = row.length;

  return (
    <div
      ref={wrapper}
      aria-hidden
      data-floating-produce
      className="mx-auto hidden w-full max-w-[240px] shrink-0 flex-col items-center gap-1 select-none @[15rem]:flex @md:mx-0 @md:w-auto @md:max-w-none @md:items-start"
    >
      {/* Étiquette du mois : hauteur réservée, le mois n'est connu que côté client. */}
      <div className="flex h-7 items-center @md:pl-3">
        {month ? (
          <span
            data-month-tag
            className="bg-soleil font-titre text-corps-s text-encre block px-2.5 py-0.5 leading-[1.2] opacity-0"
            style={{
              rotate: "-4deg",
              filter: "drop-shadow(2px 2px 0 var(--color-encre))",
            }}
          >
            {MONTH_NAMES[month - 1]}
          </span>
        ) : null}
      </div>
      <div
        ref={zone}
        className="relative h-(--row-h) w-full @md:h-(--zone-h) @md:w-(--zone-w)"
        style={
          {
            "--row-h": `${FLOAT_ROW_HEIGHT}px`,
            "--zone-w": `${FLOAT.zone.width}px`,
            "--zone-h": `${FLOAT.zone.height}px`,
          } as CSSProperties
        }
      >
        {names.map((name, index) => {
          const slot = slots[index];
          const inRow = row[index];
          const rowStyle: Record<string, string> = inRow
            ? {
                "--row-x": `calc(${((index + 0.5) / rowCount) * 100}% - ${inRow.size / 2}px)`,
                "--row-y": `${(FLOAT_ROW_HEIGHT - inRow.size) / 2 + (index % 2 ? 3 : -3)}px`,
                "--row-size": `${inRow.size}px`,
                "--row-tilt": `${inRow.tilt}deg`,
              }
            : {};
          return (
            <span
              key={name}
              data-produce={name}
              className={`absolute top-(--row-y) left-(--row-x) size-(--row-size) rotate-(--row-tilt) @md:top-(--y) @md:left-(--x) @md:size-(--size) @md:rotate-(--tilt) ${inRow ? "block" : "hidden @md:block"}`}
              style={
                {
                  ...rowStyle,
                  "--x": `${slot.x}px`,
                  "--y": `${slot.y}px`,
                  "--size": `${slot.size}px`,
                  "--tilt": `${slot.tilt}deg`,
                } as CSSProperties
              }
            >
              <span data-layer="parallax" className="block size-full">
                <span data-layer="float" className="block size-full">
                  <span
                    data-layer="bounce"
                    className="block size-full origin-bottom opacity-0"
                    onPointerDown={(event) => bounce(event.currentTarget)}
                  >
                    <Illustration name={name} className="block size-full" />
                  </span>
                </span>
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
