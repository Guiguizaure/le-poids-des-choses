"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { DidYouKnow } from "@/components/facts/DidYouKnow";
import { Illustration } from "@/components/illustrations/Illustration";
import {
  adultIllustration,
  speciesCards,
  type SpeciesCard,
} from "@/lib/garden/species";
import { SPECIES_PICKER, SPECIES_SHEETS } from "@/lib/i18n/messages/species";
import { useLocale } from "@/lib/i18n/LocaleProvider";

/** Cadenas des espèces à débloquer (décoratif : la carte dit « Dans N pas »). */
function Lock() {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
      <rect x="3" y="7" width="10" height="8" rx="1.5" fill="currentColor" />
      <path
        d="M5 7V5a3 3 0 0 1 6 0v2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/**
 * « Que veux-tu planter ? » : feuille en bas de l'écran (fenêtre au centre sur grand écran),
 * ouverte quand une nouvelle plante va pousser. Une grille de cartes (dessin, nom, type
 * court) : toucher une carte plante l'espèce. Le petit bouton « i » de chaque carte, à côté du
 * bouton de la carte, ouvre sa fiche dans la même feuille (grand dessin, description, « Le
 * savais-tu ? », « Planter … », retour) ; au retour, le focus revient sur la carte. Les
 * espèces à débloquer sont grisées, avec un cadenas et ce qui leur manque ; leur fiche reste
 * lisible. Jamais bloquante : « Laisse le jardin choisir », la croix ou Échap (depuis la grille)
 * rendent la main au tirage habituel.
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
  const detailTitleRef = useRef<HTMLHeadingElement>(null);
  const uid = useId().replace(/[^A-Za-z0-9_-]/g, "");
  const cards = speciesCards(steps);
  const [detail, setDetail] = useState<string | null>(null);
  // Carte à retrouver au retour de la fiche (null : aucune, à l'ouverture).
  const [returnTo, setReturnTo] = useState<string | null>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (detail) {
      detailTitleRef.current?.focus();
      return;
    }
    if (!returnTo) return;
    // La carte elle-même si elle se plante, sinon son bouton « En savoir plus ».
    const item = dialogRef.current?.querySelector(
      `[data-species="${returnTo}"]`,
    );
    item?.querySelector<HTMLElement>("[data-plant-card], [data-more]")?.focus();
  }, [detail, returnTo]);

  const choose = (species: string | null) => {
    dialogRef.current?.close();
    onPick(species);
  };

  const openDetail = (id: string) => {
    setReturnTo(id);
    setDetail(id);
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

  /** « Arbre · Persistant · Fleurit à la fin du printemps » : une majuscule par segment. */
  const typeLine = (card: SpeciesCard, text: string) =>
    [card.kind.type === "tree" ? t.tree : t.flower, ...text.split(" · ")]
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" · ");
  const shown = detail ? cards.find((card) => card.id === detail) : undefined;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${uid}-titre`}
      data-species-picker
      onCancel={(event) => {
        event.preventDefault();
        // Échap : depuis une fiche, retour à la grille ; depuis la grille, le jardin choisit.
        if (detail) setDetail(null);
        else choose(null);
      }}
      onKeyDown={trapFocus}
      className="backdrop:bg-encre/50 fixed inset-x-0 top-auto bottom-0 m-0 mx-auto max-h-[92dvh] w-full max-w-[430px] overflow-hidden bg-transparent p-0 lg:top-1/2 lg:bottom-auto lg:max-w-[720px] lg:-translate-y-1/2"
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

        <div className="overflow-y-auto px-5 pt-1 pb-3">
          {shown ? (
            <section
              aria-labelledby={`${uid}-fiche`}
              data-species-detail={shown.id}
              className="flex flex-col gap-3"
            >
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="text-corps-s text-encre focus-visible:outline-outremer self-start rounded-full py-1 leading-[1.3] font-semibold underline underline-offset-2 focus-visible:outline-2"
              >
                <span aria-hidden>← </span>
                {t.back}
              </button>
              <div
                className={`bg-blanc flex h-44 items-end justify-center rounded-[20px] pt-3 ${shown.available ? "" : "grayscale"}`}
                aria-hidden
              >
                <Illustration
                  name={adultIllustration(shown.id)}
                  className="h-40 w-auto"
                />
              </div>
              <h3
                id={`${uid}-fiche`}
                ref={detailTitleRef}
                tabIndex={-1}
                className="font-titre text-titre-m text-encre leading-[1.1] outline-none"
              >
                {sheets[shown.id].name}
              </h3>
              <p className="text-corps-s text-texte-attenue leading-[1.35]">
                {typeLine(shown, sheets[shown.id].type)}
              </p>
              <p className="text-corps-m text-encre leading-[1.4]">
                {sheets[shown.id].description}
              </p>
              <DidYouKnow title={t.didYouKnow} level={4}>
                {sheets[shown.id].anecdote}
              </DidYouKnow>
              {shown.available ? (
                <button
                  type="button"
                  onClick={() => choose(shown.id)}
                  className="press bg-encre text-creme text-corps-m focus-visible:outline-outremer w-full rounded-full px-6 py-3.5 leading-[1.3] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {t.plant(sheets[shown.id].inSentence)}
                </button>
              ) : (
                <p className="bg-blanc text-corps-s text-encre flex items-start gap-2 rounded-2xl p-3 leading-[1.4]">
                  <span className="mt-0.5">
                    <Lock />
                  </span>
                  <span>
                    <span className="font-semibold">{t.locked}.</span>{" "}
                    {t.condition(shown.remaining)}
                  </span>
                </p>
              )}
            </section>
          ) : (
            <ul className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {cards.map((card) => {
                const sheet = sheets[card.id];
                const typeId = `${uid}-${card.id}-type`;
                const content = (
                  <>
                    <span
                      className={`flex h-20 w-full items-end justify-center ${card.available ? "" : "grayscale"}`}
                      aria-hidden
                    >
                      <Illustration
                        name={adultIllustration(card.id)}
                        className="h-[76px] w-auto"
                      />
                    </span>
                    <span className="text-corps-s text-encre leading-[1.2] font-semibold">
                      {sheet.name}
                    </span>
                    <span
                      id={typeId}
                      className="text-legende text-texte-attenue leading-[1.3]"
                    >
                      {typeLine(card, sheet.short)}
                    </span>
                    {card.available ? null : (
                      <span className="text-legende text-encre bg-creme mt-auto flex items-center gap-1 self-start rounded-full px-2 py-0.5 font-semibold">
                        <Lock />
                        {t.inSteps(card.remaining)}
                      </span>
                    )}
                  </>
                );
                const look =
                  "flex h-full w-full flex-col items-start gap-1 rounded-[18px] border p-3 pr-9 text-left";
                return (
                  <li key={card.id} data-species={card.id} className="relative">
                    {card.available ? (
                      <button
                        type="button"
                        data-plant-card
                        onClick={() => choose(card.id)}
                        aria-label={t.plant(sheet.inSentence)}
                        aria-describedby={typeId}
                        className={`press border-encre bg-blanc focus-visible:outline-outremer focus-visible:outline-2 focus-visible:outline-offset-2 ${look}`}
                      >
                        {content}
                      </button>
                    ) : (
                      <div
                        data-locked
                        className={`border-encre/40 bg-blanc/70 border-dashed ${look}`}
                      >
                        {content}
                      </div>
                    )}
                    {/* À côté du bouton de la carte, jamais dedans. */}
                    <button
                      type="button"
                      data-more
                      onClick={() => openDetail(card.id)}
                      aria-label={t.more(sheet.inSentence)}
                      className="border-encre bg-creme text-encre focus-visible:outline-outremer font-titre absolute top-2 right-2 flex size-7 items-center justify-center rounded-full border text-[14px] leading-none focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      <span aria-hidden>i</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

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
