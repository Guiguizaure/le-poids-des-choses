"use client";

import { HINTS } from "@/lib/i18n/messages/garden";
import { useMessages } from "@/lib/i18n/LocaleProvider";
import type { HintId } from "@/lib/hints/hints";
import { markHintSeen, useHint } from "@/lib/hints/useHint";

/**
 * Indice de première utilisation : une phrase, la première fois seulement, qui se ferme d'un
 * geste (croix) et ne revient plus (`lpdc:indices:v1`). Annoncé par une région `polite`
 * toujours présente, remplie après l'hydratation : jamais de focus pris. Le parent appelle
 * aussi `markHintSeen` quand l'action annoncée est faite.
 */
export function FirstHint({
  id,
  active,
  children,
  className = "",
}: {
  id: HintId;
  /** La situation que l'indice décrit (jardin vide…). */
  active: boolean;
  children: string;
  className?: string;
}) {
  const t = useMessages(HINTS);
  const visible = useHint(id, active);
  return (
    <div role="status" aria-live="polite" className={visible ? className : ""}>
      {visible ? (
        <p
          data-hint={id}
          className="bg-soleil text-encre text-corps-s flex items-start gap-2 rounded-2xl py-2.5 pr-1.5 pl-4 leading-[1.4]"
        >
          <span className="min-w-0 flex-1 pt-0.5">
            <span className="font-semibold">{t.label} · </span>
            {children}
          </span>
          <button
            type="button"
            onClick={() => markHintSeen(id)}
            aria-label={t.close}
            title={t.close}
            className="focus-visible:outline-encre flex size-8 shrink-0 items-center justify-center rounded-full text-[18px] leading-none focus-visible:outline-2"
          >
            <span aria-hidden>×</span>
          </button>
        </p>
      ) : null}
    </div>
  );
}
