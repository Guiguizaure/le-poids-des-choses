"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Barre de confirmation fixe en bas de l'écran (« Voiture vs Vélo · Comparer », « 3 habitudes
 * choisies · Valider »). Elle double un bouton de la page, qui reste à sa place (ordre du
 * clavier inchangé : la barre vient après). Région `polite` toujours présente : son contenu
 * s'annonce sans prendre le focus. Tant qu'elle est là, le bas de la page (pied de page
 * compris) et le défilement au focus gardent sa hauteur de marge (`--sticky-bar-space`,
 * globals.css), zone sûre d'iOS comprise. Avec le bandeau de langue (pages françaises,
 * navigateur en anglais), elle se pose juste au-dessus de lui (`--language-banner-space`) :
 * le bandeau, déjà là, ne bouge pas, et la barre reprend le bas de l'écran quand il est fermé.
 * Une seule barre par page.
 */
export function StickyBar({
  open,
  name,
  label,
  announcement,
  children,
  action,
  onAction,
}: {
  open: boolean;
  /** Repère pour les tests (`data-sticky-bar`). */
  name: string;
  /** Nom de la région (« Ta comparaison », « Tes habitudes »). */
  label: string;
  /** Phrase lue par les lecteurs d'écran à l'ouverture (le texte visible est alors masqué). */
  announcement: string;
  /** Texte visible (« TGV vs Avion »). */
  children: ReactNode;
  /** Bouton de la barre (« Comparer », « Valider »). */
  action: string;
  onAction: () => void;
}) {
  const barRef = useRef<HTMLElement>(null);

  // Hauteur de la barre : la marge du bas de page (globals.css) l'additionne à celle du
  // bandeau de langue, posé dessous.
  useEffect(() => {
    const bar = barRef.current;
    if (!open || !bar) return;
    const root = document.documentElement;
    const reserve = () =>
      root.style.setProperty(
        "--sticky-bar-space",
        `${Math.ceil(bar.getBoundingClientRect().height)}px`,
      );
    reserve();
    const observer = new ResizeObserver(reserve);
    observer.observe(bar);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--sticky-bar-space");
    };
  }, [open]);

  return (
    <div aria-live="polite">
      {open ? (
        <section
          ref={barRef}
          aria-label={label}
          data-sticky-bar={name}
          className="bg-creme border-encre animate-bar-in fixed inset-x-0 bottom-[var(--language-banner-space,0px)] z-40 mx-auto flex w-full max-w-[430px] items-center gap-3 rounded-t-[24px] border-x-2 border-t-2 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-6px_20px_rgba(31,26,23,0.12)] transition-[bottom] duration-200 motion-reduce:animate-none motion-reduce:transition-none"
        >
          <p className="text-corps-m text-encre min-w-0 flex-1 leading-[1.25] font-semibold">
            <span className="sr-only">{announcement}</span>
            <span aria-hidden>{children}</span>
          </p>
          <button
            type="button"
            onClick={onAction}
            className="press bg-encre text-creme text-corps-m focus-visible:outline-outremer shrink-0 rounded-full px-6 py-3 leading-[1.3] font-semibold transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {action}
          </button>
        </section>
      ) : null}
    </div>
  );
}
