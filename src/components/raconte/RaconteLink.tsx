"use client";

import { RACONTE } from "@/lib/i18n/messages/raconte";
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
