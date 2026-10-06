"use client";

import { useId } from "react";
import { DataCredit } from "@/components/ui/DataCredit";
import { useNow } from "@/lib/hooks/useNow";
import { format } from "@/lib/i18n";
import { SEASON } from "@/lib/i18n/messages/common";
import { MONTHS } from "@/lib/i18n/messages/names";
import { LocalLink as Link, useLocale } from "@/lib/i18n/LocaleProvider";
import {
  formatPerKilo,
  monthOf,
  productLabel,
  SAISON_BASE,
  SAISON_DOWNLOADED_AT,
  SAISON_TOOL_URL,
  seasonRange,
} from "@/lib/saison";
import { FloatingProduce } from "./FloatingProduce";

/**
 * Encart de saison (accueil, /comparer) : « De saison en octobre, du plus léger au plus lourd
 * au kilo : … », deux repères calculés (`seasonRange`), lien vers /saison et crédit des
 * données ; fruits et légumes dessinés qui flottent à côté. Le mois n'est connu que côté
 * client : la place du texte et des dessins est réservée pour que rien ne bouge à leur arrivée.
 */
export function SeasonTeaser({
  month: forcedMonth,
  className = "",
}: {
  /** Mois imposé (banc d'essai) ; sinon le mois courant. */
  month?: number;
  className?: string;
}) {
  const now = useNow();
  const locale = useLocale();
  const t = SEASON[locale];
  const month = forcedMonth ?? (now ? monthOf(now) : null);
  const titleId = useId();
  const [lightest, heaviest] = month
    ? seasonRange(month, undefined, locale)
    : [];

  return (
    <aside
      aria-labelledby={titleId}
      className={`bg-blanc @container rounded-[18px] p-4 ${className}`}
    >
      <div className="flex flex-col gap-3 @md:flex-row @md:items-center @md:gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <h2
            id={titleId}
            className="text-corps-s text-encre leading-[1.3] font-semibold"
          >
            {month
              ? format(t.titleInMonth, { month: MONTHS[locale][month - 1] })
              : t.title}
          </h2>
          {/* Trois lignes réservées : le texte n'arrive qu'avec le mois. */}
          <p
            className="text-corps-s text-encre min-h-[4.2em] leading-[1.4]"
            data-season-range
          >
            {lightest ? (
              <>
                {heaviest ? t.lightestToHeaviest : t.perKilo}
                <br />
                <Product
                  label={productLabel(lightest, locale)}
                  kg={formatPerKilo(lightest.kgCo2ePerKg, locale)}
                />
                {heaviest ? (
                  <>
                    {" "}
                    …<br />
                    <Product
                      label={productLabel(heaviest, locale)}
                      kg={formatPerKilo(heaviest.kgCo2ePerKg, locale)}
                    />
                  </>
                ) : null}
              </>
            ) : null}
          </p>
          <Link
            href="/saison"
            className="text-corps-s text-encre focus-visible:outline-outremer self-start leading-[1.3] font-semibold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {t.seeAll}
          </Link>
          <DataCredit
            downloadedAt={SAISON_DOWNLOADED_AT}
            href={SAISON_TOOL_URL}
            base={SAISON_BASE}
          />
        </div>
        <FloatingProduce month={month} />
      </div>
    </aside>
  );
}

function Product({ label, kg }: { label: string; kg: string }) {
  return (
    <>
      <span className="font-semibold">{label}</span> ({kg})
    </>
  );
}
