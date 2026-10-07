"use client";

import { useEffect, useRef } from "react";
import { gestureLabel } from "@/lib/data";
import { format } from "@/lib/i18n";
import { COMPARE } from "@/lib/i18n/messages/compare";
import { useLocale } from "@/lib/i18n/LocaleProvider";

/**
 * Barre fixe en bas de l'écran du choix des gestes (02), dès que les deux gestes sont choisis :
 * « Voiture vs Vélo » et « Comparer ». Elle double le bouton de la page, qui reste à sa place
 * (ordre du clavier inchangé : la barre vient après la page). Région `polite` toujours
 * présente : son contenu s'annonce sans prendre le focus. Tant qu'elle est là, le bas de la
 * page (pied de page compris) et le défilement au focus gardent sa hauteur de marge, zone
 * sûre d'iOS comprise. Avec le bandeau de langue (pages françaises, navigateur en anglais),
 * la barre se pose juste au-dessus de lui (`--language-banner-space`) : le bandeau, déjà là,
 * ne bouge pas, et la barre reprend le bas de l'écran quand il est fermé.
 */
export function CompareBar({
  pair,
  onCompare,
}: {
  /** Les deux gestes choisis, ou null : pas de barre. */
  pair: { first: string; second: string } | null;
  onCompare: (a: string, b: string) => void;
}) {
  const locale = useLocale();
  const t = COMPARE[locale].chooser;
  const barRef = useRef<HTMLElement>(null);
  const open = pair !== null;

  // Hauteur de la barre (`--compare-bar-space`) : la marge du bas de page (globals.css)
  // l'additionne à celle du bandeau de langue, posé dessous.
  useEffect(() => {
    const bar = barRef.current;
    if (!open || !bar) return;
    const root = document.documentElement;
    const reserve = () =>
      root.style.setProperty(
        "--compare-bar-space",
        `${Math.ceil(bar.getBoundingClientRect().height)}px`,
      );
    reserve();
    const observer = new ResizeObserver(reserve);
    observer.observe(bar);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--compare-bar-space");
    };
  }, [open]);

  return (
    <div aria-live="polite">
      {pair ? (
        <section
          ref={barRef}
          aria-label={t.barLabel}
          data-compare-bar
          className="bg-creme border-encre animate-bar-in fixed inset-x-0 bottom-[var(--language-banner-space,0px)] z-40 mx-auto flex w-full max-w-[430px] items-center gap-3 rounded-t-[24px] border-x-2 border-t-2 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(31,26,23,0.12)] transition-[bottom] duration-200 motion-reduce:animate-none motion-reduce:transition-none"
        >
          <p className="text-corps-m text-encre min-w-0 flex-1 leading-[1.25] font-semibold">
            {/* Lu : « TGV et Avion choisis : tu peux comparer. » ; vu : « TGV vs Avion ». */}
            <span className="sr-only">
              {format(t.bothChosen, {
                a: gestureLabel(pair.first, locale),
                b: gestureLabel(pair.second, locale),
              })}
            </span>
            <span aria-hidden>
              {format(t.versus, {
                a: gestureLabel(pair.first, locale),
                b: gestureLabel(pair.second, locale),
              })}
            </span>
          </p>
          <button
            type="button"
            onClick={() => onCompare(pair.first, pair.second)}
            className="press bg-encre text-creme text-corps-m focus-visible:outline-outremer shrink-0 rounded-full px-6 py-3 leading-[1.3] font-semibold transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {t.compare}
          </button>
        </section>
      ) : null}
    </div>
  );
}
