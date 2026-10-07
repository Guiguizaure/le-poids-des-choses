"use client";

import { StickyBar } from "@/components/ui/StickyBar";
import { gestureLabel } from "@/lib/data";
import { format } from "@/lib/i18n";
import { COMPARE } from "@/lib/i18n/messages/compare";
import { useLocale } from "@/lib/i18n/LocaleProvider";

/**
 * Barre fixe du choix des gestes (02), dès que les deux gestes sont choisis : « Voiture vs
 * Vélo » et « Comparer » (`StickyBar`), en plus du bouton de la page.
 */
export function CompareBar({
  pair,
  onCompare,
}: {
  /** Les deux gestes choisis, ou null : pas de barre. */
  pair: { first: string; second: string } | null;
  onCompare: (a: string, b: string) => void;
}) {
  const locale = useLocale();
  const t = COMPARE[locale].chooser;
  const names = pair
    ? {
        a: gestureLabel(pair.first, locale),
        b: gestureLabel(pair.second, locale),
      }
    : { a: "", b: "" };
  return (
    <StickyBar
      open={pair !== null}
      name="compare"
      label={t.barLabel}
      // Lu : « TGV et Avion choisis : tu peux comparer. » ; vu : « TGV vs Avion ».
      announcement={format(t.bothChosen, names)}
      action={t.compare}
      onAction={() => pair && onCompare(pair.first, pair.second)}
    >
      {format(t.versus, names)}
    </StickyBar>
  );
}
