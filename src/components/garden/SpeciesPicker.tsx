"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { DidYouKnow } from "@/components/facts/DidYouKnow";
import { Illustration } from "@/components/illustrations/Illustration";
import { Icon } from "@/components/ui/buttons";
import { FirstHint } from "@/components/ui/FirstHint";
import { markHintSeen } from "@/lib/hints/useHint";
import { HINTS } from "@/lib/i18n/messages/garden";
import {
  adultIllustration,
  speciesCards,
  type SpeciesCard,
} from "@/lib/garden/species";
import { SEASONS_UI } from "@/lib/i18n/messages/seasons";
import { SPECIES_PICKER, SPECIES_SHEETS } from "@/lib/i18n/messages/species";
import { SeasonsStrip } from "./SeasonsStrip";
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

const PRIMARY =
  "press bg-encre text-creme text-corps-m focus-visible:outline-outremer w-full rounded-full px-6 py-3.5 leading-[1.3] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-40";
const SECONDARY =
  "press border-encre bg-blanc text-encre text-corps-m focus-visible:outline-outremer w-full rounded-full border-2 px-6 py-3 leading-[1.3] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2";

/**
 * « Que veux-tu planter ? » : feuille en bas de l'écran (fenêtre au centre sur grand écran),
 * ouverte quand une ou plusieurs plantes vont pousser. Une grille de cartes (dessin, nom, type
 * court). Le petit bouton « i » de chaque carte, à côté du bouton de la carte, ouvre sa fiche
 * dans la même feuille (grand dessin, description, « Le savais-tu ? ») ; la flèche en haut à
 * gauche et « Retour aux espèces » en bas ramènent à la grille, le focus sur la carte. Les
 * espèces à débloquer sont grisées, avec un cadenas et ce qui leur manque ; leur fiche reste
 * lisible.
 *
 * Une plante : toucher une carte la plante. Plusieurs (« Raconte ta journée ») : chaque carte
 * touchée remplit une place (« 1 / 3 plantes », annoncé), la même espèce peut revenir, chaque
 * place se retire ; « Planter » quand tout est rempli, « Le jardin choisit le reste » pour les
 * places vides. Jamais bloquante : la croix (« Fermer : le jardin choisira ») ou Échap depuis
 * la grille rendent la main au tirage habituel, pour les places encore vides.
 */
export function SpeciesPicker({
  steps,
  count = 1,
  onPick,
}: {
  /** Pas de croissance du jardin (espèces disponibles et conditions). */
  steps: number;
  /** Plantes qui vont pousser d'un coup (une place chacune). */
  count?: number;
  /** Espèce de chaque plante, dans l'ordre (null : le jardin choisit). */
  onPick: (species: (string | null)[]) => void;
}) {
  const locale = useLocale();
  const t = SPECIES_PICKER[locale];
  const sheets = SPECIES_SHEETS[locale];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const detailTitleRef = useRef<HTMLHeadingElement>(null);
  const uid = useId().replace(/[^A-Za-z0-9_-]/g, "");
  const cards = speciesCards(steps);
  const multi = count > 1;
  const [slots, setSlots] = useState<(string | null)[]>(() =>
    Array.from({ length: count }, () => null),
  );
  const [detail, setDetail] = useState<string | null>(null);
  // Carte à retrouver au retour de la fiche (null : aucune, à l'ouverture).
  const [returnTo, setReturnTo] = useState<string | null>(null);
  const filled = slots.filter((slot) => slot !== null).length;
  const full = filled === count;

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

  /** Ferme la feuille : les places vides reviennent au tirage habituel. */
  const finish = (species: (string | null)[]) => {
    // Première plante choisie (ou laissée au jardin) : les astuces ne reviendront plus.
    markHintSeen("premiere-plante");
    markHintSeen("saisons-especes");
    dialogRef.current?.close();
    onPick(species);
  };

  /** Une plante : planter tout de suite ; plusieurs : remplir la première place vide. */
  const pick = (id: string) => {
    if (!multi) {
      finish([id]);
      return;
    }
    const index = slots.indexOf(null);
    if (index === -1) return;
    setSlots(slots.map((slot, i) => (i === index ? id : slot)));
  };

  const remove = (index: number) =>
    setSlots(slots.map((slot, i) => (i === index ? null : slot)));

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
  const chosenCount = (id: string) =>
    slots.filter((slot) => slot === id).length;
  /** Ce que fait le bouton d'une carte disponible : planter, ou remplir une place. */
  const action = (id: string) =>
    multi ? t.add(sheets[id].inSentence) : t.plant(sheets[id].inSentence);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${uid}-titre`}
      data-species-picker
      onCancel={(event) => {
        event.preventDefault();
        // Échap : depuis une fiche, retour à la grille ; depuis la grille, le jardin choisit.
        if (detail) setDetail(null);
        else finish(slots);
      }}
      onKeyDown={trapFocus}
      className="backdrop:bg-encre/50 fixed inset-x-0 top-auto bottom-0 m-0 mx-auto max-h-[92dvh] w-full max-w-[430px] overflow-hidden bg-transparent p-0 lg:top-1/2 lg:bottom-auto lg:max-w-[720px] lg:-translate-y-1/2"
    >
      <div className="bg-creme border-encre animate-enter flex max-h-[92dvh] flex-col rounded-t-[28px] border-x-2 border-t-2 motion-reduce:animate-none lg:rounded-[28px] lg:border-2">
        <div className="flex items-start gap-2 px-5 pt-4 pb-2">
          {shown ? (
            // Fiche : une flèche retour à la place de la croix (même effet que le lien du bas).
            <button
              type="button"
              data-back-arrow
              onClick={() => setDetail(null)}
              aria-label={t.back}
              title={t.back}
              className="focus-visible:outline-outremer -ml-1.5 flex size-9 shrink-0 items-center justify-center rounded-full focus-visible:outline-2"
            >
              <Icon name="retour" />
            </button>
          ) : null}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h2
              id={`${uid}-titre`}
              ref={titleRef}
              tabIndex={-1}
              className="font-titre text-encre text-[24px] leading-[1.2] outline-none"
            >
              {t.title}
            </h2>
            {multi ? (
              <>
                <p className="text-corps-s text-texte-attenue leading-[1.4]">
                  {t.several(count)}
                </p>
                <p
                  data-plant-counter
                  aria-hidden
                  className="text-corps-s text-encre leading-[1.3] font-semibold"
                >
                  {t.counter(filled, count)}
                </p>
                <p
                  aria-live="polite"
                  data-plant-counter-live
                  className="sr-only"
                >
                  {t.counterLive(filled, count)}
                </p>
              </>
            ) : null}
          </div>
          {shown ? null : (
            <button
              type="button"
              onClick={() => finish(slots)}
              aria-label={t.close}
              title={t.close}
              className="text-encre focus-visible:outline-outremer flex size-9 shrink-0 items-center justify-center rounded-full text-[22px] leading-none focus-visible:outline-2"
            >
              <span aria-hidden>×</span>
            </button>
          )}
        </div>

        <FirstHint id="premiere-plante" active={!shown} className="px-5 pb-2">
          {HINTS[locale].firstPlant}
        </FirstHint>
        <FirstHint id="saisons-especes" active={!shown} className="px-5 pb-2">
          {SEASONS_UI[locale].pickerHint}
        </FirstHint>

        {multi && !shown ? (
          <ol aria-label={t.slots} className="flex flex-wrap gap-1.5 px-5 pb-2">
            {slots.map((slot, index) => (
              <li
                key={index}
                data-slot={index + 1}
                className={`text-legende flex items-center gap-1 rounded-full py-1 leading-[1.3] ${
                  slot
                    ? "bg-blanc border-encre text-encre border pr-1 pl-3 font-semibold"
                    : "border-encre/40 text-texte-attenue border border-dashed px-3"
                }`}
              >
                {slot ? (
                  <>
                    <span>
                      {index + 1}. {sheets[slot].name}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      aria-label={t.remove(sheets[slot].inSentence, index + 1)}
                      className="focus-visible:outline-outremer flex size-6 items-center justify-center rounded-full text-[16px] leading-none focus-visible:outline-2"
                    >
                      <span aria-hidden>×</span>
                    </button>
                  </>
                ) : (
                  <span>{t.emptySlot(index + 1)}</span>
                )}
              </li>
            ))}
          </ol>
        ) : null}

        <div className="overflow-y-auto px-5 pt-1 pb-3">
          {shown ? (
            <section
              aria-labelledby={`${uid}-fiche`}
              data-species-detail={shown.id}
              className="flex flex-col gap-3"
            >
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
              <SeasonsStrip id={shown.id} />
              <DidYouKnow title={t.didYouKnow} level={4}>
                {sheets[shown.id].anecdote}
              </DidYouKnow>
              {shown.available ? (
                <button
                  type="button"
                  aria-disabled={multi && full ? true : undefined}
                  onClick={() => {
                    if (multi && full) return;
                    pick(shown.id);
                    // Plusieurs plantes : la place est remplie, retour à la grille.
                    if (multi) setDetail(null);
                  }}
                  className={PRIMARY}
                >
                  {action(shown.id)}
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
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="text-corps-s text-encre focus-visible:outline-outremer self-center rounded-full py-1 leading-[1.3] font-semibold underline underline-offset-2 focus-visible:outline-2"
              >
                {t.back}
              </button>
            </section>
          ) : (
            <ul className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {cards.map((card) => {
                const sheet = sheets[card.id];
                const typeId = `${uid}-${card.id}-type`;
                const times = chosenCount(card.id);
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
                        onClick={() => {
                          if (!(multi && full)) pick(card.id);
                        }}
                        aria-label={action(card.id)}
                        aria-describedby={typeId}
                        aria-disabled={multi && full ? true : undefined}
                        className={`press border-encre bg-blanc focus-visible:outline-outremer focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed ${look}`}
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
                    {times > 0 ? (
                      // Déjà choisie (plusieurs plantes) : la liste des places le dit aux
                      // lecteurs d'écran.
                      <span
                        aria-hidden
                        data-chosen={times}
                        className="bg-encre text-creme text-legende pointer-events-none absolute top-2 left-2 rounded-full px-2 py-0.5 font-semibold"
                      >
                        ×{times}
                      </span>
                    ) : null}
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
          {multi ? (
            <>
              <button
                type="button"
                data-plant-all
                aria-disabled={full ? undefined : true}
                onClick={() => {
                  if (full) finish(slots);
                }}
                className={PRIMARY}
              >
                {t.plantAll}
              </button>
              <button
                type="button"
                onClick={() => finish(slots)}
                className={SECONDARY}
              >
                {filled === 0 ? t.auto : t.autoRest}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => finish(slots)}
              className={PRIMARY}
            >
              {t.auto}
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
}
