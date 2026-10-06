"use client";

import { useMemo } from "react";
import type { JournalEntry } from "@/lib/data/types";
import { speciesUnlockedBy } from "@/lib/garden/model";
import { SPECIES_PICKER, SPECIES_SHEETS } from "@/lib/i18n/messages/species";
import { useLocale } from "@/lib/i18n/LocaleProvider";

/**
 * Petite annonce « Nouvelle espèce : la marguerite » quand les entrées qu'on vient d'ajouter
 * débloquent une espèce (rien sinon). Elle se plantera au prochain choix léger.
 */
export function SpeciesUnlocked({
  entries,
  entryIds,
  className = "",
}: {
  entries: readonly JournalEntry[];
  entryIds: readonly string[];
  className?: string;
}) {
  const locale = useLocale();
  const t = SPECIES_PICKER[locale];
  const unlocked = useMemo(
    () => speciesUnlockedBy(entries, entryIds),
    [entries, entryIds],
  );
  if (unlocked.length === 0) return null;
  return (
    <div
      data-species-unlocked
      className={`bg-soleil text-encre flex flex-col gap-0.5 rounded-2xl px-4 py-2.5 text-center ${className}`}
    >
      {unlocked.map((id) => (
        <p key={id} className="text-corps-s leading-[1.3] font-semibold">
          {t.unlocked(SPECIES_SHEETS[locale][id].inSentence)}
        </p>
      ))}
      <p className="text-legende leading-[1.35]">{t.unlockedHint}</p>
    </div>
  );
}
