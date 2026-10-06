"use client";

import { DID_YOU_KNOW_LINK, DidYouKnow } from "@/components/facts/DidYouKnow";
import { getGesture } from "@/lib/data";
import { daySeed, pickFact } from "@/lib/facts";
import { format } from "@/lib/i18n";
import { FACT_CARD } from "@/lib/i18n/messages/garden";
import { LocalLink as Link, useLocale } from "@/lib/i18n/LocaleProvider";
import { useNow } from "@/lib/hooks/useNow";

/**
 * Encadré « Le savais-tu ? » (`DidYouKnow`) : un fait calculé depuis nos données, choisi sans hasard
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
    <DidYouKnow
      title={t.didYouKnow}
      className={className}
      footer={
        <>
          {fact.source.url ? (
            <a
              href={fact.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className={DID_YOU_KNOW_LINK}
            >
              {format(t.source, { label: fact.source.label })}
              <span className="sr-only">{t.newTab}</span>
            </a>
          ) : null}
          <Link href={fact.methodHref} className={DID_YOU_KNOW_LINK}>
            {t.method}
          </Link>
        </>
      }
    >
      {fact.text}
    </DidYouKnow>
  );
}
