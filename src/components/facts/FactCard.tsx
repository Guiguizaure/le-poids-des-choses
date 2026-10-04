"use client";

import Link from "next/link";
import { daySeed, pickFact } from "@/lib/facts";
import { useNow } from "@/lib/hooks/useNow";

/**
 * Carte discrète « Le savais-tu ? » : un fait calculé depuis nos données, choisi sans hasard
 * (graine : `seed`, sinon le jour), en lien avec `related` quand c'est possible. Renvoie à la
 * fiche du geste source et à la méthode.
 */
export function FactCard({
  related = [],
  seed,
  className = "",
}: {
  related?: readonly string[];
  /** Graine (id d'une entrée du carnet…) ; par défaut, le jour. */
  seed?: string;
  className?: string;
}) {
  const now = useNow();
  // Au rendu serveur, le jour n'est pas connu : la carte apparaît côté client.
  if (!seed && now === 0) return null;
  const fact = pickFact(seed ?? daySeed(now), related);
  if (!fact) return null;

  return (
    <aside
      aria-labelledby={`fait-${fact.id}`}
      className={`bg-creme border-encre/15 flex flex-col gap-1.5 rounded-[18px] border p-4 ${className}`}
    >
      <h2
        id={`fait-${fact.id}`}
        className="text-legende text-texte-attenue leading-[1.3] font-semibold"
      >
        Le savais-tu ?
      </h2>
      <p className="text-corps-s text-encre leading-[1.4]">{fact.text}</p>
      <p className="text-legende text-texte-attenue flex flex-wrap gap-x-3 leading-[1.3]">
        {fact.source.url ? (
          <a
            href={fact.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-visible:outline-outremer underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Source : {fact.source.label} sur Impact CO2
            <span className="sr-only"> (nouvel onglet)</span>
          </a>
        ) : null}
        <Link
          href={fact.methodHref}
          className="focus-visible:outline-outremer underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Méthode
        </Link>
      </p>
    </aside>
  );
}
