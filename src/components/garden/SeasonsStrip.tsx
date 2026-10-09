"use client";

import { Tree } from "@/components/scene/Tree";
import { SEASONS } from "@/lib/garden/seasons";
import { plantLook, speciesById } from "@/lib/garden/species";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { SEASONS_UI } from "@/lib/i18n/messages/seasons";
import { SPECIES_SHEETS } from "@/lib/i18n/messages/species";

/** Le sapin a des aiguilles, pas des feuilles. */
const NEEDLES = new Set(["arbre-5"]);

/**
 * « Au fil des saisons » (fiche d'un arbre, maquette « Saisons · feuillage ») : l'arbre adulte
 * aux quatre saisons, légendé, puis une phrase. Les mini-arbres et leurs légendes sont
 * décoratifs : l'information passe par la phrase.
 */
export function SeasonsStrip({ id }: { id: string }) {
  const locale = useLocale();
  const t = SEASONS_UI[locale];
  const sheet = SPECIES_SHEETS[locale][id];
  const species = speciesById(id);
  if (!species || species.kind.type !== "tree") return null;
  const sentence =
    species.leaves === "caduc"
      ? t.deciduous(sheet.inSentence, sheet.pronoun)
      : t.evergreen(sheet.inSentence, NEEDLES.has(id));
  return (
    <section
      data-seasons-strip={id}
      className="bg-creme border-encre flex flex-col gap-3.5 rounded-[20px] border-2 p-5"
    >
      <h4 className="text-corps-m text-encre leading-[1.3] font-semibold">
        {t.throughSeasons}
      </h4>
      <ul aria-hidden className="grid grid-cols-4 gap-2">
        {SEASONS.map((season) => (
          <li
            key={season}
            data-season={season}
            className="flex flex-col items-center gap-1"
          >
            <Tree
              variant={species.kind.variant}
              stage="grand"
              sparkle={false}
              still
              className="w-full max-w-[60px]"
              paint={plantLook({ kind: species.kind, bloom: 0 }, season).paint}
            />
            <span className="text-legende text-texte-attenue leading-[1.3]">
              {t.names[season]}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-corps-s text-encre leading-[1.4]">{sentence}</p>
    </section>
  );
}
