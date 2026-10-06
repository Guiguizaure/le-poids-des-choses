"use client";

import { formatMass } from "@/lib/calc";
import { format } from "@/lib/i18n";
import { GARDEN_PILL } from "@/lib/i18n/messages/garden";
import { LocalLink as Link, useLocale } from "@/lib/i18n/LocaleProvider";
import { useJournal } from "@/lib/journal/useJournal";

/** Pastille « Mon jardin · X kg d’écart » de la barre du haut (maquette 03, formulation honnête). */
export function GardenPill() {
  const { totals, ready } = useJournal();
  const locale = useLocale();
  const t = GARDEN_PILL[locale];
  // Aucun écart pour l'instant : pas de « 0 g d’écart ».
  const label =
    ready && totals.totalAvoidedKg > 0
      ? format(t.withDifference, {
          mass: formatMass(totals.totalAvoidedKg, locale),
        })
      : t.garden;
  return (
    <Link
      href="/jardin"
      className="bg-tomate-douce text-legende text-encre focus-visible:outline-outremer shrink-0 rounded-full px-3 py-1.5 font-semibold whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {label}
    </Link>
  );
}
