"use client";

import Link from "next/link";
import { useNow } from "@/lib/hooks/useNow";
import { monthOf, seasonCategory, seasonHighlights } from "@/lib/saison";

/**
 * Encart « Ce mois-ci, c'est la saison de… » (accueil, /comparer) : trois produits de saison
 * du mois courant, lien vers /saison. Le mois n'est connu que côté client : la place des
 * produits est réservée pour que rien ne bouge à leur arrivée.
 */
export function SeasonTeaser({ className = "" }: { className?: string }) {
  const now = useNow();
  const products = now ? seasonHighlights(monthOf(now)) : [];

  return (
    <aside
      aria-labelledby="encart-saison"
      className={`bg-blanc flex flex-col gap-2.5 rounded-[18px] p-4 ${className}`}
    >
      <h2
        id="encart-saison"
        className="text-corps-s text-encre leading-[1.3] font-semibold"
      >
        Ce mois-ci, c’est la saison de…
      </h2>
      <ul className="flex min-h-[30px] flex-wrap gap-2">
        {products.map((product) => (
          <li
            key={product.slug}
            className="border-encre/15 text-corps-s text-encre flex items-center gap-1.5 rounded-full border px-3 py-1 leading-[1.3]"
          >
            <span
              aria-hidden
              className={`size-2 shrink-0 rounded-full ${seasonCategory(product.category)?.dot ?? "bg-encre"}`}
            />
            {product.label}
          </li>
        ))}
      </ul>
      <Link
        href="/saison"
        className="text-corps-s text-encre focus-visible:outline-outremer self-start leading-[1.3] font-semibold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Tous les fruits et légumes de saison
      </Link>
    </aside>
  );
}
