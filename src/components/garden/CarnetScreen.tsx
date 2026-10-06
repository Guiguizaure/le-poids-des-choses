"use client";

import { AccountLink } from "@/components/account/AccountLink";
import { useMemo, type ReactNode } from "react";
import { EntryRow } from "@/components/garden/EntryRow";
import { WeekChart } from "@/components/garden/WeekChart";
import { Icon } from "@/components/ui/buttons";
import type { Category } from "@/lib/data/types";
import { localizeHref, type Locale } from "@/lib/i18n";
import { JOURNAL } from "@/lib/i18n/messages/garden";
import { CATEGORY_NAMES } from "@/lib/i18n/messages/names";
import { LocalLink as Link, useLocale } from "@/lib/i18n/LocaleProvider";
import { useNow } from "@/lib/hooks/useNow";
import { useSearchParam } from "@/lib/hooks/useSearchParam";
import {
  analyzeJournal,
  categoriesIn,
  parseView,
  viewQuery,
  type ChoiceFilter,
  type JournalSort,
  type JournalView,
} from "@/lib/journal/analysis";
import { useJournal } from "@/lib/journal/useJournal";

export const CARNET_PATH = "/jardin/carnet";

/** Change la vue dans l'URL ; l'historique garde les vues consultées. */
function chooseView(view: JournalView, locale: Locale) {
  window.history.pushState(
    null,
    "",
    localizeHref(`${CARNET_PATH}${viewQuery(view)}`, locale),
  );
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function Select({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-legende text-texte-attenue leading-[1.3]"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-blanc border-encre/20 text-corps-s text-encre focus-visible:outline-outremer rounded-full border px-3 py-2 leading-[1.3] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {children}
      </select>
    </div>
  );
}

/** Page « Tout voir » du carnet : graphique de la semaine, tri et filtres (dans l'URL). */
export function CarnetScreen() {
  const journal = useJournal();
  const locale = useLocale();
  const t = JOURNAL[locale];
  const now = useNow();
  const tri = useSearchParam("tri");
  const categorie = useSearchParam("categorie");
  const choix = useSearchParam("choix");
  const view = useMemo(
    () =>
      parseView({
        get: (name) =>
          name === "tri" ? tri : name === "categorie" ? categorie : choix,
      }),
    [tri, categorie, choix],
  );
  const shown = useMemo(
    () => analyzeJournal(journal.entries, view),
    [journal.entries, view],
  );
  const categories = categoriesIn(journal.entries);
  const today = new Date(now);
  const hasEntries = journal.entries.length > 0;

  return (
    <main className="animate-enter mx-auto flex min-h-screen w-full max-w-[430px] flex-col motion-reduce:animate-none">
      <div className="flex items-center justify-between gap-3 px-5 pt-[22px] pb-2">
        <Link
          href="/jardin"
          className="text-corps-s text-encre flex items-center gap-1 leading-[1.3] font-semibold"
        >
          <Icon name="retour" />
          {t.back}
        </Link>
        <AccountLink />
      </div>
      <div className="flex flex-col gap-4 px-5 pt-2 pb-8">
        <h1 className="font-titre text-titre-l text-encre leading-[1.1]">
          {t.title}
        </h1>

        {journal.ready && now ? (
          <WeekChart entries={journal.entries} now={today} headingLevel={2} />
        ) : null}

        {journal.ready && !hasEntries ? (
          <p className="text-corps-s text-texte-attenue">
            {t.empty}{" "}
            <Link
              href="/comparer"
              className="text-encre font-semibold underline"
            >
              {t.emptyLink}
            </Link>{" "}
            {t.emptyEnd}
          </p>
        ) : null}

        {hasEntries ? (
          <section
            aria-labelledby="choix-titre"
            className="flex flex-col gap-3"
          >
            <h2
              id="choix-titre"
              className="font-titre text-titre-m text-encre leading-[1.1]"
            >
              {t.all}
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              <Select
                id="tri"
                label={t.sortBy}
                value={view.tri}
                onChange={(tri) =>
                  chooseView({ ...view, tri: tri as JournalSort }, locale)
                }
              >
                {(Object.keys(t.sorts) as JournalSort[]).map((sort) => (
                  <option key={sort} value={sort}>
                    {t.sorts[sort]}
                  </option>
                ))}
              </Select>
              <Select
                id="categorie"
                label={t.category}
                value={view.categorie ?? ""}
                onChange={(value) =>
                  chooseView(
                    {
                      ...view,
                      categorie: (value || null) as Category | null,
                    },
                    locale,
                  )
                }
              >
                <option value="">{t.allCategories}</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {CATEGORY_NAMES[locale][category]}
                  </option>
                ))}
              </Select>
              <div className="col-span-2">
                <Select
                  id="choix"
                  label={t.choices}
                  value={view.choix}
                  onChange={(value) =>
                    chooseView(
                      { ...view, choix: value as ChoiceFilter },
                      locale,
                    )
                  }
                >
                  {(Object.keys(t.filters) as ChoiceFilter[]).map((choice) => (
                    <option key={choice} value={choice}>
                      {t.filters[choice]}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <p
              role="status"
              aria-live="polite"
              className="text-legende text-texte-attenue"
            >
              {shown.length === 0 ? t.noMatch : t.shown(shown.length)}
            </p>
            <ul className="flex flex-col gap-2">
              {shown.map((entry) => (
                <EntryRow key={entry.id} entry={entry} now={today} />
              ))}
            </ul>
            <p className="text-legende text-texte-attenue">{t.heavyNote}</p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
