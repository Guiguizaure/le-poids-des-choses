"use client";

import { ANIMAL_SCRIPTS, TALKERS, type TalkerId } from "@/content/animaux";
import { progress, type FriendsState } from "@/lib/friends/friendship";
import { ANIMAL_TALK } from "@/lib/i18n/messages/animals";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { Portrait } from "./portrait";

/** Où en est un animal en ce moment : là (éveillé ou endormi), ou parti, et pourquoi. */
export type TalkerPresence =
  | { here: true; asleep: boolean }
  | { here: false; why: "saison" | "nuit" | "ailleurs" };

/**
 * « Les habitants du jardin » : l'alternative accessible au toucher dans la scène. Une ligne
 * par animal qui parle : rencontré, son portrait, son nom, la progression (« 3 répliques sur
 * 8 ») et « Parler » s'il est là ; pas encore rencontré, une silhouette « ? ». Aucun kg.
 */
export function GardenFriends({
  friends,
  met,
  presence,
  onTalk,
}: {
  friends: FriendsState;
  met: (talker: TalkerId) => boolean;
  presence: (talker: TalkerId) => TalkerPresence;
  onTalk: (talker: TalkerId, opener: HTMLElement) => void;
}) {
  const locale = useLocale();
  const t = ANIMAL_TALK[locale];
  return (
    <section
      aria-labelledby="habitants-titre"
      data-garden-friends
      className="flex flex-col gap-3"
    >
      <h2
        id="habitants-titre"
        className="font-titre text-titre-m text-encre leading-[1.1]"
      >
        {t.listTitle}
      </h2>
      <p className="text-corps-s text-texte-attenue leading-[1.4]">
        {t.listIntro}
      </p>
      <ul className="flex flex-col gap-2">
        {TALKERS.map((talker) => {
          const script = ANIMAL_SCRIPTS[talker];
          if (!met(talker))
            return (
              <li
                key={talker}
                data-talk-row={talker}
                data-unmet
                className="bg-blanc flex items-center gap-3 rounded-2xl p-3"
              >
                <span
                  aria-hidden
                  className="border-encre/40 text-encre/60 font-titre flex size-12 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed text-[22px]"
                >
                  ?
                </span>
                <span className="sr-only">{t.unmetLabel}</span>
                <span
                  aria-hidden
                  className="text-corps-s text-texte-attenue leading-[1.3]"
                >
                  {t.unmet}
                </span>
              </li>
            );
          const now = presence(talker);
          const { seen, total } = progress(script, friends[talker]);
          const status = now.here
            ? now.asleep
              ? t.asleepNote
              : null
            : now.why === "saison"
              ? t.awaySeason
              : now.why === "nuit"
                ? t.awayNight
                : t.awayNow;
          const talk = script.talk[locale];
          return (
            <li
              key={talker}
              data-talk-row={talker}
              className="bg-blanc flex items-center gap-3 rounded-2xl p-3"
            >
              <Portrait
                talker={talker}
                expr={now.here && now.asleep ? "dort" : "content"}
                className="size-12"
              />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="text-corps-m text-encre leading-[1.3] font-semibold">
                  {script.name[locale]}
                </span>
                <span
                  data-progress
                  className="text-legende text-texte-attenue leading-[1.4]"
                >
                  {t.progress(seen, total)}
                  {status ? ` · ${status}` : ""}
                </span>
              </div>
              {now.here ? (
                <button
                  type="button"
                  aria-label={now.asleep ? t.asleep(talk) : talk}
                  onClick={(event) => onTalk(talker, event.currentTarget)}
                  className="press border-encre text-corps-s text-encre hover:bg-creme focus-visible:outline-outremer min-h-11 shrink-0 rounded-full border-2 px-4 leading-[1.3] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {t.talkButton}
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
