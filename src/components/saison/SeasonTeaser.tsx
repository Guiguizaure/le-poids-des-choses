"use client";

import Link from "next/link";
import { useId } from "react";
import { DataCredit } from "@/components/ui/DataCredit";
import { useNow } from "@/lib/hooks/useNow";
import {
  formatPerKilo,
  MONTH_NAMES,
  monthOf,
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
  const month = forcedMonth ?? (now ? monthOf(now) : null);
  const titleId = useId();
  const [lightest, heaviest] = month ? seasonRange(month) : [];

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
            {month ? `De saison en ${MONTH_NAMES[month - 1]}` : "De saison"}
          </h2>
          {/* Trois lignes réservées : le texte n'arrive qu'avec le mois. */}
          <p
            className="text-corps-s text-encre min-h-[4.2em] leading-[1.4]"
            data-season-range
          >
            {lightest ? (
              <>
                {heaviest
                  ? "Du plus léger au plus lourd au kilo :"
                  : "Au kilo :"}
                <br />
                <Product label={lightest.label} kg={lightest.kgCo2ePerKg} />
                {heaviest ? (
                  <>
                    {" "}
                    …<br />
                    <Product label={heaviest.label} kg={heaviest.kgCo2ePerKg} />
                  </>
                ) : null}
              </>
            ) : null}
          </p>
          <Link
            href="/saison"
            className="text-corps-s text-encre focus-visible:outline-outremer self-start leading-[1.3] font-semibold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Tous les fruits et légumes de saison
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

function Product({ label, kg }: { label: string; kg: number }) {
  return (
    <>
      <span className="font-semibold">{label}</span> ({formatPerKilo(kg)})
    </>
  );
}
