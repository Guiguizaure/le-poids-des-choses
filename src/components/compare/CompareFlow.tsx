"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  COMPARE_PATH,
  comparisonHref,
  comparisonQuery,
  duelEntry,
  objectEntry,
  parseComparison,
  type ComparisonState,
} from "@/lib/compare";
import { getGesture } from "@/lib/data";
import type { Choice, JournalEntry } from "@/lib/data/types";
import { useJournal } from "@/lib/journal/useJournal";
import { ChoiceResult } from "./ChoiceResult";
import { Duel } from "./Duel";
import { GestureChooser } from "./GestureChooser";
import { ObjectDuel } from "./ObjectDuel";

/**
 * Parcours de comparaison, piloté par l'URL (/comparer?…) : choix du premier geste, du second
 * (même unité), duel ou duel objet, puis résultat. Une URL invalide ramène au premier choix.
 */
export function CompareFlow() {
  const params = useSearchParams();
  const journal = useJournal();
  const { state, invalid } = useMemo(() => parseComparison(params), [params]);
  const query = comparisonQuery(state);
  const [result, setResult] = useState<{
    entry: JournalEntry;
    query: string;
  } | null>(null);
  const [navigated, setNavigated] = useState(false);
  const notice = params.get("lien") === "invalide";

  // History API native : Next.js la synchronise avec useSearchParams, sans recharger la page.
  useEffect(() => {
    if (invalid)
      window.history.replaceState(null, "", `${COMPARE_PATH}?lien=invalide`);
  }, [invalid]);

  const go = useCallback((next: ComparisonState) => {
    setNavigated(true);
    setResult(null);
    window.history.pushState(null, "", comparisonHref(next));
    window.scrollTo({ top: 0 });
  }, []);
  const replace = useCallback((next: ComparisonState) => {
    window.history.replaceState(null, "", comparisonHref(next));
  }, []);

  // Le résultat n'appartient qu'à la comparaison qui l'a produit (retour arrière = duel).
  if (result && result.query === query) {
    return (
      <ChoiceResult
        entry={result.entry}
        onCompareAgain={() => go({ step: "first" })}
      />
    );
  }

  switch (state.step) {
    case "first":
      return (
        <>
          {notice ? (
            <p
              role="status"
              className="bg-tomate-douce text-corps-s text-encre mx-auto mt-4 w-[calc(100%-40px)] max-w-[390px] rounded-2xl p-3"
            >
              Ce lien de comparaison n’est pas valable : choisis tes deux
              gestes.
            </p>
          ) : null}
          <GestureChooser
            key="first"
            backHref="/"
            focusTitle={navigated}
            onContinue={(id) =>
              getGesture(id)?.unit === "objet"
                ? go({
                    step: "object",
                    object: id,
                    option: "occasion",
                    delivered: true,
                  })
                : go({ step: "second", first: id })
            }
          />
        </>
      );
    case "second":
      return (
        <GestureChooser
          key={`second-${state.first}`}
          firstId={state.first}
          backHref={COMPARE_PATH}
          focusTitle={navigated}
          onContinue={(id) => {
            const unit = getGesture(state.first)!.unit;
            go({
              step: "duel",
              a: state.first,
              b: id,
              quantity: unit === "km" ? 50 : 1,
            });
          }}
        />
      );
    case "duel":
      return (
        <Duel
          key={`${state.a}-${state.b}`}
          a={state.a}
          b={state.b}
          quantity={state.quantity}
          focusTitle={navigated}
          onQuantity={(quantity) => replace({ ...state, quantity })}
          onChoose={(choice: Choice, quantity: number) => {
            const entry = journal.add(
              duelEntry(state.a, state.b, quantity, choice),
            );
            const chosen = { ...state, quantity };
            replace(chosen); // l'URL partageable garde la quantité choisie
            setNavigated(true);
            setResult({ entry, query: comparisonQuery(chosen) });
            window.scrollTo({ top: 0 });
          }}
        />
      );
    case "object":
      return (
        <ObjectDuel
          key={state.object}
          object={state.object}
          option={state.option}
          delivered={state.delivered}
          backHref={COMPARE_PATH}
          focusTitle={navigated}
          onChange={(option, delivered) =>
            replace({ ...state, option, delivered })
          }
          onChoose={() => {
            const entry = journal.add(
              objectEntry(state.object, state.option, state.delivered),
            );
            setNavigated(true);
            setResult({ entry, query });
            window.scrollTo({ top: 0 });
          }}
        />
      );
  }
}
