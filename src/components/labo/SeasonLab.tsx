"use client";

import { useState } from "react";
import { SeasonTeaser } from "@/components/saison/SeasonTeaser";
import { MONTHS } from "@/lib/i18n/messages/names";
import { drawnForMonth } from "@/lib/saison/drawn";
import { Panel, ToggleButton } from "./ui";

const MONTH_NAMES = MONTHS.fr;

/** Encart de saison de l'accueil, mois au choix, en large (5 produits) et en étroit (3). */
export function SeasonLab() {
  const [month, setMonth] = useState(10);

  return (
    <Panel title="Encart de saison">
      <p className="text-corps-s text-texte-attenue">
        Repères calculés sur les produits de saison du mois (hors toute l’année)
        ; dessins flottants de saison (
        {drawnForMonth(month).join(", ").replaceAll("saison-", "")}). Touche un
        produit : il rebondit.
      </p>
      <div className="flex flex-wrap gap-2">
        {MONTH_NAMES.map((name, index) => (
          <ToggleButton
            key={name}
            pressed={month === index + 1}
            onClick={() => setMonth(index + 1)}
          >
            {name}
          </ToggleButton>
        ))}
      </div>
      <div className="bg-creme flex flex-wrap items-start gap-6 rounded-2xl p-4">
        <SeasonTeaser month={month} className="w-full max-w-[560px]" />
        <SeasonTeaser month={month} className="w-full max-w-[382px]" />
      </div>
    </Panel>
  );
}
