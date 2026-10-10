"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { HOW_IT_WORKS } from "@/lib/i18n/messages/common";
import { useLocale } from "@/lib/i18n/LocaleProvider";

/** Illustrations des étapes : chargées seulement sur grand écran (lg), après l'affichage. */
const StepArt = dynamic(() => import("./HowItWorksArt"), { ssr: false });

const WIDE = "(min-width: 1024px)";
function subscribeWide(listener: () => void) {
  const query = window.matchMedia(WIDE);
  query.addEventListener("change", listener);
  return () => query.removeEventListener("change", listener);
}
/** Vrai sur grand écran ; faux au rendu serveur et sur mobile. */
function useWide(): boolean {
  return useSyncExternalStore(
    subscribeWide,
    () => window.matchMedia(WIDE).matches,
    () => false,
  );
}

/** Pastilles des trois étapes (texte encre : contraste vérifié dans src/lib/a11y). */
const NUMBER_COLORS = ["bg-soleil", "bg-pomme", "bg-rose"] as const;

/** « Comment ça marche » : cible du lien du héros (#comment-ca-marche). */
export function HowItWorks({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = HOW_IT_WORKS[locale];
  const wide = useWide();
  return (
    <section
      id="comment-ca-marche"
      aria-labelledby="comment-ca-marche-titre"
      className={`scroll-mt-6 ${className}`}
    >
      <h2
        id="comment-ca-marche-titre"
        className="font-titre text-encre text-[32px] leading-[1.1] lg:text-[52px]"
      >
        {t.title}
      </h2>
      <ol className="mt-6 flex flex-col gap-4 lg:mt-8 lg:grid lg:grid-cols-3 lg:gap-8">
        {t.steps.map((step, i) => (
          <li
            key={step.title}
            className="bg-blanc flex flex-col gap-3 rounded-[24px] p-5 lg:gap-6 lg:rounded-[28px] lg:p-6"
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className={`${NUMBER_COLORS[i]} border-encre text-encre flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-base font-semibold lg:size-11 lg:text-xl`}
              >
                {i + 1}
              </span>
              <h3 className="text-encre pt-1 text-lg leading-[1.25] font-semibold lg:pt-2 lg:text-[22px]">
                <span className="sr-only">{i + 1}. </span>
                {step.title}
              </h3>
            </div>
            <div
              aria-hidden
              className="bg-creme hidden h-[240px] items-center justify-center rounded-[20px] lg:flex"
            >
              {wide ? <StepArt step={i} /> : null}
            </div>
            <p className="text-encre text-[15px] leading-[1.5] lg:text-[17px]">
              {step.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
