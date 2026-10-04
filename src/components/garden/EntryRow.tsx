import { Illustration } from "@/components/illustrations/Illustration";
import { formatMass } from "@/lib/calc";
import type { JournalEntry } from "@/lib/data/types";
import {
  entryCategory,
  entryPicto,
  entryTitle,
  relativeDay,
} from "@/lib/journal/display";

/** Une ligne du carnet : choix léger → pastille pomme « +X kg » ; plus lourd → « noté ». */
export function EntryRow({ entry, now }: { entry: JournalEntry; now: Date }) {
  const light = entry.avoidedKg > 0;
  return (
    <li className="bg-blanc flex items-center gap-3 rounded-2xl p-3.5">
      <Illustration name={entryPicto(entry)} className="size-8 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-corps-s text-encre leading-[1.3] font-semibold">
          {entryTitle(entry)}
        </p>
        <p className="text-legende text-texte-attenue">
          {[relativeDay(entry.date, now), entryCategory(entry)]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
      <span
        className={`text-legende text-encre shrink-0 rounded-full px-2.5 py-1 leading-[1.3] font-semibold ${
          light ? "bg-pomme-douce" : "bg-creme"
        }`}
      >
        {light ? `+${formatMass(entry.avoidedKg)}` : "noté"}
      </span>
    </li>
  );
}
