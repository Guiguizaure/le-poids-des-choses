"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import { ANIMAL_SCRIPTS, type TalkerId } from "@/content/animaux";
import type { Reply } from "@/lib/friends/friendship";
import { ANIMAL_TALK } from "@/lib/i18n/messages/animals";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { Portrait } from "./portrait";
import { Typewriter } from "./Typewriter";

/**
 * Conversation avec un animal, façon jeu vidéo : feuille en bas de l'écran, portrait à gauche
 * (96 px sur mobile, 140 px sur grand écran, expression de l'étape en cours), à droite son nom
 * en étiquette et la réplique, une séquence de 1 à 3 étapes qui s'écrivent lettre à lettre.
 * « Suite ▶ » (ou toucher la boîte) passe à l'étape suivante ; à la dernière, le bouton devient
 * « Fermer ». Toucher la boîte pendant que le texte s'écrit l'affiche d'abord en entier.
 *
 * Accessibilité : fenêtre modale (`<dialog>`) ; le focus va sur le bouton et y reste d'étape en
 * étape (même bouton, son texte change) ; chaque étape est annoncée par une région polie, qui
 * décrit aussi la fenêtre à l'ouverture ; le focus tourne entre la croix et le bouton ; croix,
 * Échap ou toucher en dehors ferment ; le parent rend le focus dans `onClose`.
 */
export function AnimalTalk({
  talker,
  reply,
  asleep,
  onClose,
}: {
  talker: TalkerId;
  reply: Reply;
  asleep: boolean;
  onClose: () => void;
}) {
  const locale = useLocale();
  const t = ANIMAL_TALK[locale];
  const script = ANIMAL_SCRIPTS[talker];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const uid = useId().replace(/[^A-Za-z0-9_-]/g, "");
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(false);
  const steps = reply.steps;
  const step = steps[index];
  const last = index === steps.length - 1;

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    nextRef.current?.focus();
    return () => dialog?.close();
  }, []);

  const close = () => {
    dialogRef.current?.close();
    onClose();
  };
  const next = () => {
    if (last) {
      close();
      return;
    }
    setIndex(index + 1);
    setTyped(false);
    // Le focus reste sur le bouton (Safari ne le donne pas à un bouton touché).
    nextRef.current?.focus();
  };
  const onTyped = useCallback(() => setTyped(true), []);

  /** Toucher la boîte : finir d'écrire, sinon l'étape suivante (jamais fermer). */
  const onBox = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    if (!typed) setTyped(true);
    else if (!last) next();
  };

  /** Le focus tourne entre la croix et le bouton « Suite » (Tab, Maj+Tab). */
  const trapFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    event.preventDefault();
    (document.activeElement === nextRef.current
      ? closeRef
      : nextRef
    ).current?.focus();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${uid}-nom`}
      aria-describedby={`${uid}-texte`}
      data-animal-talk={talker}
      data-reply={reply.type}
      data-step={`${index + 1}/${steps.length}`}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      // Un toucher sur le fond (hors de la feuille) arrive sur le <dialog> lui-même.
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
      onKeyDown={trapFocus}
      className="backdrop:bg-encre/40 fixed inset-x-0 top-auto bottom-0 m-0 mx-auto w-full max-w-[430px] overflow-visible bg-transparent p-0 lg:bottom-8 lg:max-w-[720px]"
    >
      <div
        onClick={onBox}
        data-talk-box
        className="bg-creme border-encre animate-enter relative flex cursor-pointer items-start gap-4 rounded-t-[24px] border-x-2 border-t-2 px-4 pt-5 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-4px_0_0_var(--color-encre)] motion-reduce:animate-none lg:gap-6 lg:rounded-[24px] lg:border-2 lg:p-6 lg:shadow-[4px_4px_0_0_var(--color-encre)]"
      >
        <Portrait
          talker={talker}
          expr={step.expr}
          className="size-24 lg:size-[140px]"
        />
        <div className="flex min-w-0 flex-1 flex-col items-start gap-2 pt-1">
          <h2
            id={`${uid}-nom`}
            className="bg-soleil border-encre text-encre text-corps-s rounded-full border-2 px-3 py-0.5 leading-[1.3] font-semibold"
          >
            {script.name[locale]}
            {asleep ? <span className="sr-only"> · {t.asleepNote}</span> : null}
          </h2>
          {/* Étape en cours, en entier, pour les lecteurs d'écran (annoncée à chaque étape). */}
          <p
            id={`${uid}-texte`}
            role="status"
            aria-live="polite"
            className="sr-only"
          >
            {step[locale]}
          </p>
          <Typewriter
            key={index}
            text={step[locale]}
            complete={typed}
            onComplete={onTyped}
            className="text-corps-m text-encre lg:text-corps-l min-h-[3lh] w-full pr-8 leading-[1.45]"
          />
          <button
            ref={nextRef}
            type="button"
            onClick={next}
            data-next
            className="press bg-encre text-creme text-corps-s focus-visible:outline-outremer min-h-11 self-end rounded-full px-5 leading-[1.3] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {last ? (
              t.finish
            ) : (
              <>
                {t.next} <span aria-hidden>▶</span>
              </>
            )}
          </button>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label={t.close}
          title={t.close}
          className="text-encre focus-visible:outline-outremer absolute top-2 right-2 flex size-11 items-center justify-center rounded-full text-[24px] leading-none focus-visible:outline-2"
        >
          <span aria-hidden>×</span>
        </button>
      </div>
    </dialog>
  );
}
