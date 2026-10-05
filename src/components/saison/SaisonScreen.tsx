"use client";

import Link from "next/link";
import { AccountLink } from "@/components/account/AccountLink";
import { Icon } from "@/components/ui/buttons";
import { DataCredit } from "@/components/ui/DataCredit";
import { formatMass } from "@/lib/calc";
import { useNow } from "@/lib/hooks/useNow";
import { useSearchParam } from "@/lib/hooks/useSearchParam";
import {
  groupByCategory,
  MONTH_NAMES,
  monthOf,
  parseMonth,
  productsForMonth,
  SAISON_BASE,
  SAISON_DOWNLOADED_AT,
  SAISON_TOOL_URL,
  saisonHref,
} from "@/lib/saison";

/** Change le mois dans l'URL (?mois=10) ; l'historique garde les mois consultés. */
function chooseMonth(month: number) {
  window.history.pushState(null, "", saisonHref(month));
  window.dispatchEvent(new PopStateEvent("popstate"));
}

/**
 * /saison : « De saison en octobre ». Tous les produits de l'outil Impact CO2 pour ce mois,
 * regroupés par catégorie de l'API et triés par impact au kg. Mois de l'URL (?mois=10), sinon
 * le mois courant. Ni illustration ni provenance : des puces, la typographie, la source.
 */
export function SaisonScreen() {
  const now = useNow();
  const fromUrl = parseMonth(useSearchParam("mois"));
  const month = fromUrl ?? (now ? monthOf(now) : null);
  const products = month ? productsForMonth(month) : [];
  const groups = groupByCategory(products);
  const heaviest = Math.max(...products.map((p) => p.kgCo2ePerKg), 0);
  const monthName = month ? MONTH_NAMES[month - 1] : null;

  return (
    <main className="animate-enter mx-auto flex min-h-screen w-full max-w-[640px] flex-col motion-reduce:animate-none">
      <div className="flex items-center justify-between gap-3 px-5 pt-[22px] pb-2">
        <Link
          href="/"
          className="text-corps-s text-encre flex items-center gap-1 leading-[1.3] font-semibold"
        >
          <Icon name="retour" />
          Retour
        </Link>
        <AccountLink />
      </div>

      <div className="flex flex-col gap-5 px-6 pt-3 pb-9">
        <h1 className="font-titre text-titre-l text-encre min-h-[1.1em] leading-[1.1]">
          {monthName ? `De saison en ${monthName}` : "De saison"}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <label
            htmlFor="mois"
            className="text-corps-s text-texte-attenue leading-[1.3]"
          >
            Mois
          </label>
          <select
            id="mois"
            value={month ?? ""}
            disabled={!month}
            onChange={(event) => chooseMonth(Number(event.target.value))}
            className="bg-blanc border-encre/20 text-corps-m text-encre focus-visible:outline-outremer rounded-full border px-4 py-2 leading-[1.3] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {!month ? <option value="">…</option> : null}
            {MONTH_NAMES.map((name, index) => (
              <option key={name} value={index + 1}>
                {name[0].toUpperCase() + name.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {month ? (
          <>
            <p className="text-corps-m text-encre leading-[1.4]">
              {products.length} produits de saison en {monthName}, du plus léger
              au plus lourd. L’impact est donné pour 1&nbsp;kg de produit, en
              CO2e.
            </p>

            {groups.map(({ category, products: list }) => (
              <section
                key={category.api}
                aria-labelledby={`categorie-${category.id}`}
                className="flex flex-col gap-2"
              >
                <h2
                  id={`categorie-${category.id}`}
                  className="font-titre text-titre-m text-encre flex items-center gap-2 leading-[1.1]"
                >
                  <span
                    aria-hidden
                    className={`size-3 shrink-0 rounded-full ${category.dot}`}
                  />
                  <span>
                    {category.label}{" "}
                    <span className="text-corps-s text-texte-attenue font-texte font-normal whitespace-nowrap">
                      ({list.length})
                    </span>
                  </span>
                </h2>
                <ul className="bg-blanc flex flex-col rounded-[18px] px-4 py-1">
                  {list.map((product) => (
                    <li
                      key={product.slug}
                      className="border-encre/10 flex flex-col gap-1.5 border-b py-2.5 last:border-b-0"
                    >
                      <span className="text-corps-s text-encre flex items-baseline justify-between gap-3 leading-[1.3]">
                        <span className="flex items-center gap-2">
                          <span
                            aria-hidden
                            className={`size-2 shrink-0 rounded-full ${category.dot}`}
                          />
                          {product.label}
                        </span>
                        <span className="shrink-0 font-semibold tabular-nums">
                          {formatMass(product.kgCo2ePerKg)}
                          <span className="sr-only"> de CO2e par kg</span>
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className="bg-encre/10 block h-1 overflow-hidden rounded-full"
                      >
                        <span
                          className={`block h-full rounded-full ${category.dot}`}
                          style={{
                            width: `${Math.max(2, (product.kgCo2ePerKg / heaviest) * 100)}%`,
                          }}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <p className="text-corps-s text-texte-attenue leading-[1.4]">
              La donnée ne précise pas d’où viennent les produits, sauf pour la
              mangue (import par avion ou par bateau).{" "}
              <Link
                href="/methode#saison"
                className="text-encre font-semibold underline underline-offset-2"
              >
                Méthode
              </Link>
            </p>
            <p className="text-corps-s text-texte-attenue leading-[1.4]">
              Source :{" "}
              <a
                href={SAISON_TOOL_URL}
                className="text-encre font-semibold underline underline-offset-2"
              >
                Fruits et légumes de saison, Impact CO2
              </a>
            </p>
            <DataCredit
              downloadedAt={SAISON_DOWNLOADED_AT}
              href={SAISON_TOOL_URL}
              base={SAISON_BASE}
              independent
            />
          </>
        ) : null}
      </div>
    </main>
  );
}
