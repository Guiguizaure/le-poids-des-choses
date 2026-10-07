"use client";

import { RACONTE } from "@/lib/i18n/messages/raconte";
import { useRaconteAvailability } from "@/lib/raconte/availability";
import { LocalLink as Link, useMessages } from "@/lib/i18n/LocaleProvider";

/** Point d'entrée de « Raconte ta journée » (/comparer, /jardin). */
export function RaconteLink({ className = "" }: { className?: string }) {
  const t = useMessages(RACONTE).link;
  return (
    <Link
      href="/raconte"
      className={`press border-encre bg-blanc focus-visible:outline-outremer flex flex-col gap-0.5 rounded-[18px] border px-4 py-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
    >
      <span className="text-corps-s text-encre leading-[1.3] font-semibold underline">
        {t.title}
      </span>
      <span className="text-legende text-texte-attenue leading-[1.35]">
        {t.text}
      </span>
    </Link>
  );
}

/**
 * Petite carte discrète de /comparer, sous la sélection : « Plus rapide : raconte ta journée ».
 * Seulement si la fonction est active (AI_ENABLED) ; sinon, rien (pas de place réservée).
 */
export function RaconteQuickLink({ className = "" }: { className?: string }) {
  const t = useMessages(RACONTE).link;
  const availability = useRaconteAvailability();
  if (availability !== "enabled") return null;
  return (
    <Link
      href="/raconte"
      data-raconte-quick
      className={`press border-encre/25 text-corps-s text-encre focus-visible:outline-outremer flex items-center justify-between gap-3 rounded-2xl border border-dashed px-4 py-3 leading-[1.3] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
    >
      <span className="underline underline-offset-2">{t.quick}</span>
      <span aria-hidden>→</span>
    </Link>
  );
}
