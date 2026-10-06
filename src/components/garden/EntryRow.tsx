import { Illustration } from "@/components/illustrations/Illustration";
import { formatMass } from "@/lib/calc";
import type { JournalEntry } from "@/lib/data/types";
import {
  entryCategory,
  entryPicto,
  entryTitle,
  relativeDay,
} from "@/lib/journal/display";
import { isHabit, isLightChoice } from "@/lib/journal/kind";
import { JOURNAL } from "@/lib/i18n/messages/garden";
import { useLocale } from "@/lib/i18n/LocaleProvider";

/**
 * Une ligne du carnet : choix léger → pastille pomme « +X kg » ; plus lourd → « noté » ;
 * habitude → « arrosé » (jamais de kg).
 */
export function EntryRow({ entry, now }: { entry: JournalEntry; now: Date }) {
  const locale = useLocale();
  const t = JOURNAL[locale];
  const habit = isHabit(entry);
  const light = isLightChoice(entry);
  return (
    <li className="bg-blanc flex items-center gap-3 rounded-2xl p-3.5">
      <Illustration name={entryPicto(entry)} className="size-8 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-corps-s text-encre leading-[1.3] font-semibold">
          {entryTitle(entry, locale)}
        </p>
        <p className="text-legende text-texte-attenue">
          {[
            relativeDay(entry.date, now, locale),
            entryCategory(entry, locale),
            habit ? t.habit : "",
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
      <span
        className={`text-legende text-encre shrink-0 rounded-full px-2.5 py-1 leading-[1.3] font-semibold ${
          light || habit ? "bg-pomme-douce" : "bg-creme"
        }`}
      >
        {light
          ? `+${formatMass(entry.avoidedKg, locale)}`
          : habit
            ? t.watered
            : t.noted}
      </span>
    </li>
  );
}
