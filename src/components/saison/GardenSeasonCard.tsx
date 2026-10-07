"use client";

import { useId } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { DataCredit } from "@/components/ui/DataCredit";
import { gardenMonth } from "@/lib/garden/seasons";
import { useNow } from "@/lib/hooks/useNow";
import { format } from "@/lib/i18n";
import { SEASON } from "@/lib/i18n/messages/common";
import { MONTHS } from "@/lib/i18n/messages/names";
import { LocalLink as Link, useLocale } from "@/lib/i18n/LocaleProvider";
import {
  formatPerKilo,
  getSeasonalProduct,
  productLabel,
  SAISON_BASE,
  SAISON_DOWNLOADED_AT,
  SAISON_TOOL_URL,
  seasonRange,
} from "@/lib/saison";
import { drawnForMonth, SEASON_DRAWINGS } from "@/lib/saison/drawn";

/** Produits dessinés sur la carte (mêmes dessins que l'encart de l'accueil). */
const CARD_DRAWN = 4;

/**
 * Carte discrète « De saison en octobre » sous « Mes habitudes » (/jardin) : 3 ou 4 produits
 * du mois (mêmes données et mêmes dessins que l'encart de l'accueil, `drawnForMonth`), le plus
 * léger au kilo en une ligne (`seasonRange`), le lien vers /saison et le crédit des données.
 * Le mois est celui de Paris, connu seulement côté client. Rien ne bouge : pas d'animation.
 */
export function GardenSeasonCard({ className = "" }: { className?: string }) {
  const now = useNow();
  const locale = useLocale();
  const t = SEASON[locale];
  const titleId = useId();
  const month = now ? gardenMonth(new Date(now)) : null;
  const drawn = month
    ? drawnForMonth(month, undefined, CARD_DRAWN).flatMap((name) => {
        const product = getSeasonalProduct(SEASON_DRAWINGS[name]);
        return product ? [{ name, product }] : [];
      })
    : [];
  const [lightest] = month ? seasonRange(month, undefined, locale) : [];

  return (
    <aside
      aria-labelledby={titleId}
      data-garden-season
      className={`bg-blanc flex flex-col gap-3 rounded-[20px] p-5 ${className}`}
    >
      <h2
        id={titleId}
        className="text-corps-m text-encre leading-[1.3] font-semibold"
      >
        {month
          ? format(t.titleInMonth, { month: MONTHS[locale][month - 1] })
          : t.title}
      </h2>
      {/* Place réservée : les produits n'arrivent qu'avec le mois. */}
      <ul
        aria-label={t.produce}
        className="flex min-h-[4.5rem] flex-wrap gap-x-4 gap-y-2"
      >
        {drawn.map(({ name, product }) => (
          <li
            key={name}
            className="text-legende text-encre flex w-14 flex-col items-center gap-1 text-center leading-[1.2]"
          >
            <Illustration name={name} className="size-10" />
            {productLabel(product, locale)}
          </li>
        ))}
      </ul>
      <p
        className="text-corps-s text-encre min-h-[1.45em] leading-[1.45]"
        data-season-lightest
      >
        {lightest ? (
          <>
            {t.lightestPerKilo}{" "}
            <span className="font-semibold">
              {productLabel(lightest, locale)}
            </span>{" "}
            ({formatPerKilo(lightest.kgCo2ePerKg, locale)})
          </>
        ) : null}
      </p>
      <Link
        href="/saison"
        className="text-corps-s text-encre focus-visible:outline-outremer self-start leading-[1.3] font-semibold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {t.seeAllProduce}
      </Link>
      <DataCredit
        downloadedAt={SAISON_DOWNLOADED_AT}
        href={SAISON_TOOL_URL}
        base={SAISON_BASE}
      />
    </aside>
  );
}
