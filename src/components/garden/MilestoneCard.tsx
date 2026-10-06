import type { JournalEntry } from "@/lib/data/types";
import { format } from "@/lib/i18n";
import { FACT_CARD } from "@/lib/i18n/messages/garden";
import { LocalLink as Link, useLocale } from "@/lib/i18n/LocaleProvider";
import { getGesture } from "@/lib/data";
import { milestoneCard, milestoneCrossed } from "@/lib/milestones";

/**
 * Carte discrète quand le dernier choix léger franchit un palier de l'écart cumulé (10, 50,
 * 100, 250, 500, 1000 kg CO2e) : l'écart du palier et une équivalence calculée avec nos
 * données, avec la source et la méthode.
 */
export function MilestoneCard({
  entries,
}: {
  entries: readonly JournalEntry[];
}) {
  const locale = useLocale();
  const t = FACT_CARD[locale];
  const milestone = milestoneCrossed(entries);
  const card = milestone ? milestoneCard(milestone, getGesture, locale) : null;
  if (!card) return null;

  return (
    <aside
      aria-labelledby="palier-titre"
      className="border-encre/15 bg-pomme-douce flex flex-col gap-1.5 rounded-[18px] border p-4"
      data-milestone={card.milestone}
    >
      <p className="text-legende text-encre leading-[1.3] font-semibold">
        {t.milestone}
      </p>
      <h2
        id="palier-titre"
        className="text-corps-m text-encre leading-[1.3] font-semibold"
      >
        {card.title}
      </h2>
      <p className="text-corps-s text-encre leading-[1.4]">{card.text}</p>
      <p className="text-legende text-encre flex flex-wrap gap-x-3 leading-[1.3]">
        {card.source.url ? (
          <a
            href={card.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-visible:outline-outremer underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {format(t.source, { label: card.source.label })}
            <span className="sr-only">{t.newTab}</span>
          </a>
        ) : null}
        <Link
          href={card.methodHref}
          className="focus-visible:outline-outremer underline focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {t.method}
        </Link>
      </p>
    </aside>
  );
}
