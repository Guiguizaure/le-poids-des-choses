"use client";

import Link from "next/link";
import { formatMass } from "@/lib/calc";
import { useJournal } from "@/lib/journal/useJournal";

/** Pastille « Mon jardin · X kg évités » de la barre du haut (maquette 03). */
export function GardenPill() {
  const { totals, ready } = useJournal();
  // Rien d'évité pour l'instant : pas de « 0 g évités ».
  const label =
    ready && totals.totalAvoidedKg > 0
      ? `Mon jardin · ${formatMass(totals.totalAvoidedKg)} évités`
      : "Mon jardin";
  return (
    <Link
      href="/jardin"
      className="bg-tomate-douce text-legende text-encre focus-visible:outline-outremer shrink-0 rounded-full px-3 py-1.5 font-semibold whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {label}
    </Link>
  );
}
