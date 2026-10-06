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

/**
 * Une ligne du carnet : choix léger → pastille pomme « +X kg » ; plus lourd → « noté » ;
 * habitude → « arrosé » (jamais de kg).
 */
export function EntryRow({ entry, now }: { entry: JournalEntry; now: Date }) {
  const habit = isHabit(entry);
  const light = isLightChoice(entry);
  return (
    <li className="bg-blanc flex items-center gap-3 rounded-2xl p-3.5">
      <Illustration name={entryPicto(entry)} className="size-8 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-corps-s text-encre leading-[1.3] font-semibold">
          {entryTitle(entry)}
        </p>
        <p className="text-legende text-texte-attenue">
          {[
            relativeDay(entry.date, now),
            entryCategory(entry),
            habit ? "habitude" : "",
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
        {light ? `+${formatMass(entry.avoidedKg)}` : habit ? "arrosé" : "noté"}
      </span>
    </li>
  );
}
