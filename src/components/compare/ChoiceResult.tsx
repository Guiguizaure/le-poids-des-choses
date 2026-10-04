"use client";

import { Garden } from "@/components/garden/Garden";
import {
  IconLink,
  Logo,
  PrimaryLink,
  TextButton,
} from "@/components/ui/buttons";
import { formatMass } from "@/lib/calc";
import type { JournalEntry } from "@/lib/data/types";
import { useNow } from "@/lib/hooks/useNow";
import { entryTitle } from "@/lib/journal/display";
import { useJournal } from "@/lib/journal/useJournal";
import { useFocusTitle } from "./useFocusTitle";

/** Écrans 05a (choix léger : une plante pousse) et 05b (choix plus lourd : c'est noté). */
export function ChoiceResult({
  entry,
  onCompareAgain,
}: {
  entry: JournalEntry;
  onCompareAgain: () => void;
}) {
  const journal = useJournal();
  const now = useNow();
  const titleRef = useFocusTitle<HTMLHeadingElement>(true);
  const light = entry.avoidedKg > 0;
  const title = entryTitle(entry);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col">
      <div className="flex items-center justify-between px-5 pt-[22px] pb-2">
        <Logo />
        <IconLink
          href="/"
          label="Fermer et revenir à l’accueil"
          icon="fermer"
        />
      </div>

      <Garden entries={journal.entries} now={now} highlightId={entry.id} />

      <section className="bg-blanc relative -mt-1 flex flex-1 flex-col gap-3.5 rounded-t-[28px] px-6 pt-7 pb-9">
        <p
          className={`text-corps-s text-encre self-start rounded-full px-3 py-1.5 leading-[1.3] font-semibold ${
            light ? "bg-pomme-douce" : "bg-creme"
          }`}
        >
          {light ? `+${formatMass(entry.avoidedKg)} évités` : "Noté"}
        </p>
        <h1
          ref={titleRef}
          tabIndex={-1}
          className="font-titre text-titre-l text-encre leading-[1.1] outline-none"
        >
          {light ? "Une plante pousse dans ton jardin" : "C’est noté"}
        </h1>
        <p className="text-corps-m text-encre leading-[1.4]">
          {light
            ? `${title} : c’est noté dans ton carnet.`
            : `${title} : ton jardin ne bouge pas cette fois, et rien ne lui est retiré. On n’a pas toujours le choix.`}
        </p>
        <PrimaryLink href="/jardin">Voir mon jardin</PrimaryLink>
        <TextButton onClick={onCompareAgain}>Comparer autre chose</TextButton>
      </section>
    </main>
  );
}
