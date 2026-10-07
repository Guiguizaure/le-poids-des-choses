import { useId, type ReactNode } from "react";

/**
 * Liens du pied d'un encadré : blancs, soulignés, contour de focus blanc (visible sur sapin) ;
 * 24 px de haut au moins (cible tactile, WCAG 2.5.8), même quand ils passent à la ligne.
 */
export const DID_YOU_KNOW_LINK =
  "focus-visible:outline-blanc inline-flex min-h-6 items-center underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2";

/**
 * Encadré « Le savais-tu ? » / “Did you know?”, le seul du site : fond vert sapin, texte et
 * liens blancs (paire blanc / sapin vérifiée par `src/lib/a11y/contrast.test.ts`). Sert aux
 * faits calculés (`FactCard` : duels, jardin) et aux anecdotes des fiches d'espèce.
 */
export function DidYouKnow({
  title,
  level = 2,
  children,
  footer,
  className = "",
}: {
  /** « Le savais-tu ? » ou “Did you know?”, selon la langue. */
  title: string;
  /** Niveau du titre dans la page (h2 sous une page, h4 dans la fiche d'une espèce). */
  level?: 2 | 3 | 4;
  children: ReactNode;
  /** Liens (source, méthode), stylés avec `DID_YOU_KNOW_LINK`. */
  footer?: ReactNode;
  className?: string;
}) {
  const id = `savais-${useId().replace(/[^A-Za-z0-9_-]/g, "")}`;
  const Heading = `h${level}` as const;
  return (
    <aside
      aria-labelledby={id}
      data-did-you-know
      className={`bg-sapin text-blanc flex flex-col gap-1.5 rounded-[18px] p-4 ${className}`}
    >
      <Heading id={id} className="text-corps-s leading-[1.3] font-semibold">
        {title}
      </Heading>
      <p className="text-corps-s leading-[1.4]">{children}</p>
      {footer ? (
        <p className="text-legende flex flex-wrap gap-x-3 gap-y-1 leading-[1.3]">
          {footer}
        </p>
      ) : null}
    </aside>
  );
}
