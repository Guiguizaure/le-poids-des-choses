"use client";

import { Illustration } from "@/components/illustrations/Illustration";
import type { DuelCard } from "@/lib/duels/cards";
import { fromToday } from "@/lib/duels/daily";
import { useNow } from "@/lib/hooks/useNow";
import { DUELS_UI } from "@/lib/i18n/messages/compare";
import { LocalLink as Link, useLocale } from "@/lib/i18n/LocaleProvider";

type Size = "compact" | "large";

const SIZES: Record<Size, { card: string; picto: string; title: string }> = {
  // Comparer (maquette 105:2) : 236 × 178.
  compact: {
    card: "w-[236px] h-[178px] rounded-[22px] p-[18px]",
    picto: "size-11",
    title: "text-corps-m",
  },
  // Accueil (maquettes 102:3 et 103:2) : 250 × 204 sur mobile, en grille sur ordinateur.
  large: {
    card: "w-[250px] h-[204px] rounded-[24px] p-5 lg:w-auto lg:h-[236px] lg:rounded-[28px] lg:p-6",
    picto: "size-12 lg:size-14",
    title: "text-corps-l lg:text-[22px]",
  },
};

function Card({
  card,
  daily,
  size,
  arrow,
}: {
  card: DuelCard;
  daily: boolean;
  size: Size;
  arrow: boolean;
}) {
  const t = DUELS_UI[useLocale()];
  const s = SIZES[size];
  const [left, right] = card.pictos;
  return (
    <Link
      href={card.href}
      data-ready-duel={card.id}
      data-daily={daily ? "" : undefined}
      className={`press focus-visible:outline-outremer relative flex shrink-0 flex-col justify-between focus-visible:outline-2 focus-visible:outline-offset-2 ${s.card} ${
        daily ? "bg-soleil border-encre border-[2.5px]" : "bg-blanc"
      }`}
    >
      <span className="flex items-start justify-between gap-2">
        <span className="flex" aria-hidden>
          <Illustration name={left} className={s.picto} />
          <Illustration name={right} className={`${s.picto} -ml-3`} />
        </span>
        {daily ? (
          <span className="border-encre bg-blanc text-legende text-encre rounded-full border-2 px-2.5 py-1 leading-[1.2] font-semibold whitespace-nowrap">
            {t.daily}
          </span>
        ) : null}
      </span>
      <span
        className={`${s.title} text-encre line-clamp-3 leading-[1.25] font-semibold`}
      >
        {card.title}
      </span>
      <span className="flex items-center justify-between gap-2">
        <span
          className={`border-encre text-legende text-encre rounded-full border-[1.5px] px-2.5 py-0.5 leading-[1.3] font-semibold ${
            daily ? "bg-blanc" : "bg-creme"
          }`}
        >
          {card.category}
        </span>
        {arrow ? (
          <span aria-hidden className="text-encre text-[22px] leading-none">
            →
          </span>
        ) : null}
      </span>
    </Link>
  );
}

/**
 * Cartes de duels prêts à jouer (contenu préparé avec les données : `duelCards`), le Duel du
 * jour d'abord. Le jour (heure de Paris) n'est connu qu'après l'hydratation (export
 * statique) : avant, des emplacements vides de la même taille gardent la place (aucun
 * décalage).
 */
export function ReadyDuelCards({
  cards,
  count,
  size,
  arrow = false,
  className = "",
}: {
  cards: readonly DuelCard[];
  /** Nombre de cartes (toutes par défaut). */
  count?: number;
  size: Size;
  arrow?: boolean;
  className?: string;
}) {
  const now = useNow();
  const ordered = now ? fromToday(new Date(now), cards) : null;
  const shown = Math.min(count ?? cards.length, cards.length);
  const s = SIZES[size];
  return (
    <ul className={className} data-ready-duels>
      {Array.from({ length: shown }, (_, i) => {
        const card = ordered?.[i];
        return (
          <li key={card?.id ?? `place-${i}`} className="flex">
            {card ? (
              <Card card={card} daily={i === 0} size={size} arrow={arrow} />
            ) : (
              <span aria-hidden className={`${s.card} block shrink-0`} />
            )}
          </li>
        );
      })}
    </ul>
  );
}
