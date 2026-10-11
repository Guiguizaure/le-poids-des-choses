"use client";

import { useId } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { searchGestures } from "@/lib/compare";
import { gestureDetail, gestureLabel } from "@/lib/data";
import { pictoFor } from "@/lib/journal/display";
import { COMPARE } from "@/lib/i18n/messages/compare";
import { CATEGORY_NAMES } from "@/lib/i18n/messages/names";
import { useLocale } from "@/lib/i18n/LocaleProvider";

/**
 * Recherche dans le catalogue (maquettes 105:2 et 105:121) : noms en français et en anglais,
 * sans accents ni majuscules. Chaque résultat montre le picto, le nom, la catégorie et l'unité ;
 * le toucher fait comme le toucher dans la grille (premier geste, second geste ou objet). Le
 * nombre de résultats est annoncé par une région polie, toujours présente.
 */
export function GestureSearch({
  query,
  onQueryChange,
  isSelectable,
  onPick,
}: {
  query: string;
  onQueryChange: (query: string) => void;
  /** Faux : geste d'une autre unité que le premier choisi (grisé, comme dans la grille). */
  isSelectable: (id: string) => boolean;
  onPick: (id: string) => void;
}) {
  const locale = useLocale();
  const t = COMPARE[locale].chooser;
  const categories = CATEGORY_NAMES[locale];
  const inputId = useId();
  const results = searchGestures(query);
  const searching = query.trim() !== "";

  return (
    <div className="flex flex-col gap-3" data-gesture-search>
      <div className="relative">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="text-encre pointer-events-none absolute top-1/2 left-4 size-[22px] -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5L21 21" />
        </svg>
        <label htmlFor={inputId} className="sr-only">
          {t.searchLabel}
        </label>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={t.searchPlaceholder}
          autoComplete="off"
          spellCheck={false}
          className="border-encre bg-blanc text-corps-m text-encre placeholder:text-texte-attenue focus-visible:outline-outremer w-full rounded-full border-[2.5px] py-3 pr-14 pl-12 leading-[1.3] font-semibold placeholder:font-normal focus-visible:outline-2 focus-visible:outline-offset-2 [&::-webkit-search-cancel-button]:hidden"
        />
        {searching ? (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label={t.searchClear}
            title={t.searchClear}
            className="bg-creme text-encre focus-visible:outline-outremer absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-[18px] leading-none font-semibold focus-visible:outline-2"
          >
            <span aria-hidden>×</span>
          </button>
        ) : null}
      </div>

      {/* Région toujours présente : le nombre de résultats s'annonce sans prendre le focus. */}
      <p
        role="status"
        aria-live="polite"
        className={
          searching
            ? "text-corps-s text-texte-attenue leading-[1.3] font-semibold"
            : "sr-only"
        }
      >
        {searching ? t.found(results.length) : ""}
      </p>

      {searching ? (
        <>
          {results.length > 0 ? (
            <ul
              className="flex flex-col gap-3"
              aria-label={t.found(results.length)}
            >
              {results.map((gesture) => {
                const detail = gestureDetail(gesture.id, locale);
                return (
                  <li key={gesture.id}>
                    <button
                      type="button"
                      data-search-result={gesture.id}
                      disabled={!isSelectable(gesture.id)}
                      onClick={() => onPick(gesture.id)}
                      className="press border-encre bg-blanc focus-visible:outline-outremer flex w-full items-center gap-3.5 rounded-[18px] border-2 px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <Illustration
                        name={pictoFor(gesture.id)}
                        className="size-12 shrink-0"
                      />
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="text-corps-m text-encre leading-[1.3] font-semibold">
                          {gestureLabel(gesture.id, locale)}
                          {detail ? (
                            <span className="text-texte-attenue font-normal">
                              {" "}
                              · {detail}
                            </span>
                          ) : null}
                        </span>
                        <span className="text-corps-s text-texte-attenue leading-[1.3]">
                          {categories[gesture.category]} ·{" "}
                          {t.units[gesture.unit]}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className="text-encre text-[22px] leading-none font-semibold"
                      >
                        →
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}
          <p className="bg-encre/6 text-corps-s text-encre rounded-[18px] px-[18px] py-4 leading-[1.5]">
            {t.searchRule}
          </p>
          <p
            data-search-empty
            className="text-corps-s text-texte-attenue leading-[1.5]"
          >
            {t.searchEmpty}
          </p>
        </>
      ) : null}
    </div>
  );
}
