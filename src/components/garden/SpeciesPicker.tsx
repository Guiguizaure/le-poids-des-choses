"use client";

import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { adultIllustration, speciesCards } from "@/lib/garden/species";
import { format } from "@/lib/i18n";
import { SPECIES_PICKER, SPECIES_SHEETS } from "@/lib/i18n/messages/species";
import { useLocale } from "@/lib/i18n/LocaleProvider";

/**
 * « Que veux-tu planter ? » : feuille en bas de l'écran (fenêtre au centre sur grand écran),
 * ouverte quand une nouvelle plante va pousser. Chaque carte montre le dessin, le nom, le type,
 * la description et l'anecdote ; les espèces à débloquer sont grisées avec leur condition.
 * Elle ne bloque jamais : « Laisse le jardin choisir », Échap ou la fermeture rendent la main au
 * tirage habituel. Modale : focus piégé, retour géré par la page (le résultat prend le focus).
 */
export function SpeciesPicker({
  steps,
  count = 1,
  onPick,
}: {
  /** Pas de croissance du jardin (espèces disponibles et conditions). */
  steps: number;
  /** Plantes qui vont pousser d'un coup (un seul choix pour toutes). */
  count?: number;
  /** Espèce choisie, ou null : le jardin choisit. */
  onPick: (species: string | null) => void;
}) {
  const locale = useLocale();
  const t = SPECIES_PICKER[locale];
  const sheets = SPECIES_SHEETS[locale];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const uid = useId().replace(/[^A-Za-z0-9_-]/g, "");
  const cards = speciesCards(steps);

  useEffect(() => {
    dialogRef.current?.showModal();
    titleRef.current?.focus();
  }, []);

  const choose = (species: string | null) => {
    dialogRef.current?.close();
    onPick(species);
  };

  /** Le focus tourne dans la feuille (Tab, Maj+Tab). */
  const trapFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>("button") ?? [],
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${uid}-titre`}
      data-species-picker
      onCancel={(event) => {
        event.preventDefault();
        choose(null);
      }}
      onKeyDown={trapFocus}
      className="backdrop:bg-encre/50 fixed inset-x-0 top-auto bottom-0 m-0 mx-auto max-h-[92dvh] w-full max-w-[430px] overflow-hidden bg-transparent p-0 lg:top-1/2 lg:bottom-auto lg:max-w-[560px] lg:-translate-y-1/2"
    >
      <div className="bg-creme border-encre animate-enter flex max-h-[92dvh] flex-col rounded-t-[28px] border-x-2 border-t-2 motion-reduce:animate-none lg:rounded-[28px] lg:border-2">
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-2">
          <div className="flex flex-col gap-1">
            <h2
              id={`${uid}-titre`}
              ref={titleRef}
              tabIndex={-1}
              className="font-titre text-encre text-[24px] leading-[1.2] outline-none"
            >
              {t.title}
            </h2>
            {count > 1 ? (
              <p className="text-corps-s text-texte-attenue leading-[1.4]">
                {t.several(count)}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => choose(null)}
            aria-label={t.close}
            className="text-encre focus-visible:outline-outremer flex size-9 shrink-0 items-center justify-center rounded-full text-[22px] leading-none focus-visible:outline-2"
          >
            <span aria-hidden>×</span>
          </button>
        </div>

        <ul className="flex flex-col gap-2.5 overflow-y-auto px-5 pt-1 pb-3">
          {cards.map((card) => {
            const sheet = sheets[card.id];
            const ids = {
              name: `${uid}-${card.id}-nom`,
              details: `${uid}-${card.id}-details`,
            };
            const content = (
              <>
                <span
                  className="bg-blanc flex size-16 shrink-0 items-end justify-center overflow-hidden rounded-2xl"
                  aria-hidden
                >
                  <Illustration
                    name={adultIllustration(card.id)}
                    className="h-[60px] w-auto"
                  />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span
                    id={ids.name}
                    className="text-corps-m text-encre leading-[1.2] font-semibold"
                  >
                    {sheet.name}
                  </span>
                  <span
                    id={ids.details}
                    className="flex flex-col gap-1 leading-[1.35]"
                  >
                    <span className="text-legende text-texte-attenue">
                      {card.kind.type === "tree" ? t.tree : t.flower} ·{" "}
                      {sheet.type}
                    </span>
                    {card.available ? (
                      <>
                        <span className="text-corps-s text-encre">
                          {sheet.description}
                        </span>
                        <span className="text-legende text-encre">
                          <span className="font-semibold">{t.anecdote}</span>{" "}
                          {sheet.anecdote}
                        </span>
                      </>
                    ) : (
                      <span className="text-legende text-encre font-semibold">
                        {t.locked} · {t.condition(card.remaining)}
                      </span>
                    )}
                  </span>
                </span>
              </>
            );
            return (
              <li key={card.id} data-species={card.id}>
                {card.available ? (
                  <button
                    type="button"
                    onClick={() => choose(card.id)}
                    aria-label={format(t.plant, { name: sheet.name })}
                    aria-describedby={ids.details}
                    className="press border-encre bg-blanc focus-visible:outline-outremer flex w-full items-start gap-3 rounded-[18px] border p-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {content}
                  </button>
                ) : (
                  <div
                    aria-disabled="true"
                    data-locked
                    className="border-encre/30 bg-blanc/60 flex w-full items-start gap-3 rounded-[18px] border border-dashed p-3 opacity-70 grayscale"
                  >
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <div className="border-encre/10 flex flex-col gap-2 border-t px-5 pt-3 pb-6">
          <button
            type="button"
            onClick={() => choose(null)}
            className="press bg-encre text-creme text-corps-m focus-visible:outline-outremer w-full rounded-full px-6 py-3.5 leading-[1.3] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {t.auto}
          </button>
        </div>
      </div>
    </dialog>
  );
}
