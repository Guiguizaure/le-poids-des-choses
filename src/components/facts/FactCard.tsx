"use client";

import { getGesture } from "@/lib/data";
import { daySeed, pickFact } from "@/lib/facts";
import { format } from "@/lib/i18n";
import { FACT_CARD } from "@/lib/i18n/messages/garden";
import { LocalLink as Link, useLocale } from "@/lib/i18n/LocaleProvider";
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
  const locale = useLocale();
  const t = FACT_CARD[locale];
  // Au rendu serveur, le jour n'est pas connu : la carte apparaît côté client.
  if (!seed && now === 0) return null;
  const fact = pickFact(seed ?? daySeed(now), related, getGesture, locale);
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
        {t.didYouKnow}
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
            {format(t.source, { label: fact.source.label })}
            <span className="sr-only">{t.newTab}</span>
          </a>
        ) : null}
        <Link
          href={fact.methodHref}
          className="focus-visible:outline-outremer underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {t.method}
        </Link>
      </p>
    </aside>
  );
}
