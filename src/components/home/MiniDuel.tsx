"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Illustration } from "@/components/illustrations/Illustration";
import { PrimaryLink, TextLink } from "@/components/ui/buttons";
import { format } from "@/lib/i18n";
import { MINI_DUEL } from "@/lib/i18n/messages/common";
import { useLocale } from "@/lib/i18n/LocaleProvider";

type Answer = "velo" | "voiture";

/**
 * Le duel tout calculé, au rendu serveur (src/lib/duels/mini.ts) : le navigateur de l'accueil
 * ne charge pas le catalogue.
 */
export type MiniDuelData = {
  /** Duel existant déjà rempli : /comparer?a=velo&b=voiture&q=5 (traduit par le lien). */
  href: string;
  /** Adresse des duels prêts à jouer (Comparer). */
  anotherHref: string;
  /** Inclinaison du duel (même calcul que la balance du duel). */
  tilt: number;
  /** Écart, au format du site (« 711 g »). */
  gap: string;
};

const Context = createContext<{
  answer: Answer | null;
  setAnswer: (answer: Answer) => void;
  data: MiniDuelData | null;
}>({ answer: null, setAnswer: () => {}, data: null });

/** Partage la réponse entre la carte et la balance de l'illustration du héros. */
export function MiniDuelProvider({
  data,
  children,
}: {
  data: MiniDuelData;
  children: ReactNode;
}) {
  const [answer, setAnswer] = useState<Answer | null>(null);
  return (
    <Context.Provider value={{ answer, setAnswer, data }}>
      {children}
    </Context.Provider>
  );
}

/** Inclinaison de la balance du héros : à l'équilibre, puis celle du duel après la réponse. */
export function useMiniDuelTilt(): number {
  const { answer, data } = useContext(Context);
  return answer && data ? data.tilt : 0;
}

const CHIP_SHADOW = "shadow-[3px_3px_0_0_var(--color-encre)]";

/**
 * Carte du mini-duel (maquettes 102:3, 102:419, 103:2) : une devinette. Rien n'entre dans le
 * carnet ni dans le jardin depuis l'accueil ; le bouton ouvre le duel existant déjà rempli,
 * où le choix est noté comme d'habitude. Les deux états occupent la même case de grille (le
 * caché en `invisible`) : la carte garde la même hauteur (aucun décalage).
 */
export function MiniDuelCard({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = MINI_DUEL[locale];
  const { answer, setAnswer, data } = useContext(Context);
  const resultRef = useRef<HTMLHeadingElement>(null);
  const right = answer === "velo";

  const choose = (value: Answer) => {
    setAnswer(value);
    // La question disparaît (bouton caché) : le focus va au résultat, lu aussitôt.
    requestAnimationFrame(() => resultRef.current?.focus());
  };

  return (
    <section
      aria-labelledby={answer ? "mini-duel-resultat" : "mini-duel-question"}
      data-mini-duel={answer ? "answered" : "question"}
      className={`bg-blanc grid rounded-[24px] p-6 lg:rounded-[28px] lg:p-8 ${className}`}
    >
      {/* Avant la réponse. */}
      <div
        className={`col-start-1 row-start-1 flex flex-col gap-4 ${answer ? "invisible" : ""}`}
        aria-hidden={answer ? true : undefined}
      >
        <p
          className={`bg-soleil border-encre text-legende text-encre self-start border-2 px-3 py-1 leading-[1.3] font-semibold lg:text-[15px] ${CHIP_SHADOW}`}
        >
          {t.label}
        </p>
        <h2
          id="mini-duel-question"
          className="text-encre text-[22px] leading-[1.25] font-semibold lg:text-[28px]"
        >
          {t.question}
        </h2>
        <div className="relative grid grid-cols-2 gap-4 lg:gap-14">
          {(
            [
              ["velo", t.bike, "picto-velo"],
              ["voiture", t.car, "picto-voiture"],
            ] as const
          ).map(([value, label, picto]) => (
            <button
              key={value}
              type="button"
              data-mini-answer={value}
              disabled={answer !== null}
              onClick={() => choose(value)}
              className="press bg-creme border-encre focus-visible:outline-outremer flex min-h-[80px] flex-col items-center justify-center gap-2 rounded-[18px] border-[2.5px] px-3 py-3 text-center focus-visible:outline-2 focus-visible:outline-offset-2 lg:flex-row lg:justify-start lg:gap-4 lg:rounded-[20px] lg:px-[18px]"
            >
              <Illustration name={picto} className="size-[50px] shrink-0" />
              <span className="text-corps-m text-encre leading-[1.2] font-semibold lg:text-[22px]">
                {label}
              </span>
            </button>
          ))}
          <span
            aria-hidden
            className="bg-encre text-creme absolute top-1/2 left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[13px] font-semibold lg:size-10 lg:text-base"
          >
            {t.or}
          </span>
        </div>
        <p className="text-legende text-texte-attenue leading-[1.4] lg:text-[15px]">
          {t.help}
        </p>
      </div>

      {/* Après la réponse : même suite, bonne ou mauvaise réponse, sans reproche. */}
      <div
        className={`col-start-1 row-start-1 flex flex-col gap-4 ${answer ? "" : "invisible"}`}
        aria-hidden={answer ? undefined : true}
      >
        <p
          className={`bg-pomme border-encre text-legende text-encre self-start border-2 px-3 py-1 leading-[1.3] font-semibold lg:text-[15px] ${CHIP_SHADOW}`}
          hidden={!right}
        >
          {t.right}
        </p>
        <div className="flex flex-col gap-1.5">
          <h2
            id="mini-duel-resultat"
            ref={resultRef}
            tabIndex={-1}
            className="text-encre text-[22px] leading-[1.25] font-semibold outline-none lg:text-[28px]"
          >
            {right ? t.rightAnswer : t.wrongAnswer}
          </h2>
          <p
            data-mini-gap
            className="text-corps-m text-encre leading-[1.3] font-semibold"
          >
            {format(t.gap, { mass: data?.gap ?? "" })}
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-7">
          {/* Quelqu'un qui a déjà un jardin (`data-garden`, posé avant l'affichage comme pour
              le héros) : « Noter ce choix ». Les deux libellés dans la même case. */}
          <PrimaryLink
            href={data?.href ?? "/comparer"}
            tabIndex={answer ? undefined : -1}
            className="grid lg:w-auto"
          >
            <span className="col-start-1 row-start-1 [html[data-garden]_&]:invisible">
              {t.firstPlant}
            </span>
            <span className="invisible col-start-1 row-start-1 [html[data-garden]_&]:visible">
              {t.logChoice}
            </span>
          </PrimaryLink>
          <TextLink
            href={data?.anotherHref ?? "/comparer"}
            tabIndex={answer ? undefined : -1}
            className="lg:text-corps-m self-center lg:self-auto"
          >
            {t.another}
          </TextLink>
        </div>
        <p className="text-legende text-texte-attenue leading-[1.4] lg:text-[15px]">
          {t.next}
        </p>
      </div>
    </section>
  );
}
