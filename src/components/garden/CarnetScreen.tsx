"use client";

import Link from "next/link";
import { AccountLink } from "@/components/account/AccountLink";
import { useMemo, type ReactNode } from "react";
import { EntryRow } from "@/components/garden/EntryRow";
import { WeekChart } from "@/components/garden/WeekChart";
import { Icon } from "@/components/ui/buttons";
import type { Category } from "@/lib/data/types";
import { plural } from "@/lib/garden/text";
import { useNow } from "@/lib/hooks/useNow";
import { useSearchParam } from "@/lib/hooks/useSearchParam";
import {
  analyzeJournal,
  categoriesIn,
  CHOICE_LABELS,
  parseView,
  SORT_LABELS,
  viewQuery,
  type ChoiceFilter,
  type JournalSort,
  type JournalView,
} from "@/lib/journal/analysis";
import { CATEGORY_LABELS } from "@/lib/journal/display";
import { useJournal } from "@/lib/journal/useJournal";

export const CARNET_PATH = "/jardin/carnet";

/** Change la vue dans l'URL ; l'historique garde les vues consultées. */
function chooseView(view: JournalView) {
  window.history.pushState(null, "", `${CARNET_PATH}${viewQuery(view)}`);
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
          Mon jardin
        </Link>
        <AccountLink />
      </div>
      <div className="flex flex-col gap-4 px-5 pt-2 pb-8">
        <h1 className="font-titre text-titre-l text-encre leading-[1.1]">
          Carnet
        </h1>

        {journal.ready && now ? (
          <WeekChart entries={journal.entries} now={today} headingLevel={2} />
        ) : null}

        {journal.ready && !hasEntries ? (
          <p className="text-corps-s text-texte-attenue">
            Ton carnet est vide.{" "}
            <Link
              href="/comparer"
              className="text-encre font-semibold underline"
            >
              Compare deux gestes
            </Link>{" "}
            pour noter ton premier choix.
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
              Tous les choix
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              <Select
                id="tri"
                label="Trier par"
                value={view.tri}
                onChange={(tri) =>
                  chooseView({ ...view, tri: tri as JournalSort })
                }
              >
                {(Object.keys(SORT_LABELS) as JournalSort[]).map((sort) => (
                  <option key={sort} value={sort}>
                    {SORT_LABELS[sort]}
                  </option>
                ))}
              </Select>
              <Select
                id="categorie"
                label="Catégorie"
                value={view.categorie ?? ""}
                onChange={(value) =>
                  chooseView({
                    ...view,
                    categorie: (value || null) as Category | null,
                  })
                }
              >
                <option value="">Toutes</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {CATEGORY_LABELS[category]}
                  </option>
                ))}
              </Select>
              <div className="col-span-2">
                <Select
                  id="choix"
                  label="Choix"
                  value={view.choix}
                  onChange={(value) =>
                    chooseView({ ...view, choix: value as ChoiceFilter })
                  }
                >
                  {(Object.keys(CHOICE_LABELS) as ChoiceFilter[]).map(
                    (choice) => (
                      <option key={choice} value={choice}>
                        {CHOICE_LABELS[choice]}
                      </option>
                    ),
                  )}
                </Select>
              </div>
            </div>
            <p
              role="status"
              aria-live="polite"
              className="text-legende text-texte-attenue"
            >
              {shown.length === 0
                ? "Aucun choix ne correspond à ces filtres."
                : plural(shown.length, "choix affiché", "choix affichés")}
            </p>
            <ul className="flex flex-col gap-2">
              {shown.map((entry) => (
                <EntryRow key={entry.id} entry={entry} now={today} />
              ))}
            </ul>
            <p className="text-legende text-texte-attenue">
              Un choix plus lourd est simplement noté : rien n’est retiré au
              jardin.
            </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
