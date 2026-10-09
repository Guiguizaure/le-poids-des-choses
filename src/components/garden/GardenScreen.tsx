"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Garden } from "@/components/garden/Garden";
import { EntryRow } from "@/components/garden/EntryRow";
import { InstallBanner } from "@/components/garden/InstallBanner";
import { CARNET_PATH } from "@/components/garden/CarnetScreen";
import { RaconteLink } from "@/components/raconte/RaconteLink";
import { MilestoneCard } from "@/components/garden/MilestoneCard";
import { SkyPicker } from "@/components/garden/SkyPicker";
import { ShareSheet } from "@/components/garden/share/ShareSheet";
import { useShareSupport } from "@/components/garden/share/useShareSupport";
import { useSky } from "@/components/garden/useSky";
import { WeekChart } from "@/components/garden/WeekChart";
import { Logo } from "@/components/ui/Logo";
import { Illustration } from "@/components/illustrations/Illustration";
import { PLANT_BOUNDS } from "@/lib/illustrations/bounds.generated";
import { CountUp } from "@/components/ui/CountUp";
import { formatMass } from "@/lib/calc";
import { buildGarden, nextAnimal } from "@/lib/garden/model";
import { effectiveSky } from "@/lib/garden/skies";
import { siteHost } from "@/lib/share/card";
import { nextAnimalMessage } from "@/lib/garden/text";
import { localizeHref } from "@/lib/i18n";
import { GARDEN_SCREEN } from "@/lib/i18n/messages/garden";
import { LocalLink as Link, useLocale } from "@/lib/i18n/LocaleProvider";
import { useNow } from "@/lib/hooks/useNow";
import { useSearchParam } from "@/lib/hooks/useSearchParam";
import { useJournal } from "@/lib/journal/useJournal";
import { FactCard } from "@/components/facts/FactCard";
import { AccountSection } from "@/components/account/AccountSection";
import { InstallButton } from "@/components/install/InstallButton";
import type { JournalEntry } from "@/lib/data/types";
import { MyHabits } from "@/components/habits/MyHabits";
import { GardenSeasonCard } from "@/components/saison/GardenSeasonCard";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { FirstHint } from "@/components/ui/FirstHint";
import { HINTS } from "@/lib/i18n/messages/garden";
import { markHintSeen } from "@/lib/hints/useHint";
import { doneGesture, isComparison } from "@/lib/journal/kind";
import {
  isTalkingVisitor,
  TALKING_VISITORS,
  type TalkerId,
  type TalkingVisitor,
} from "@/content/animaux";
import { AnimalTalk } from "@/components/garden/talk/AnimalTalk";
import {
  GardenFriends,
  type TalkerPresence,
} from "@/components/garden/talk/GardenFriends";
import type { Reply } from "@/lib/friends/friendship";
import { markMet, talkTo, useFriends } from "@/lib/friends/useFriends";
import { isNightAt } from "@/lib/garden/daytime";
import { liveScene } from "@/lib/garden/live";
import { gardenDay, seasonAt } from "@/lib/garden/seasons";
import { speciesFor, treesBySeasonHabit } from "@/lib/garden/species";
import { seasonYear, visitorRule } from "@/lib/garden/visitors";
import { seasonHintId } from "@/lib/hints/hints";
import { SEASONS_UI } from "@/lib/i18n/messages/seasons";
import { SPECIES_SHEETS } from "@/lib/i18n/messages/species";

const RECENT_COUNT = 5;

function PillButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="press border-encre text-legende text-encre hover:bg-blanc rounded-full border px-3 py-1.5 leading-[1.3] font-semibold transition-colors disabled:opacity-40"
    >
      {children}
    </button>
  );
}

/**
 * Bouton de l'en-tête (Exporter, Partager) : pastille de 30 px avec son libellé ; en icône
 * (libellé gardé pour les lecteurs d'écran), un rond de 30 px dont la zone de toucher
 * (pseudo-élément) fait 44 px sans prendre de place. Jamais plus haut que l'en-tête : son
 * conteneur déborde dans la marge intérieure.
 */
const HEADER_ACTION =
  "press relative focus-visible:outline-outremer flex h-[30px] shrink-0 items-center justify-center gap-1.5 rounded-full px-3 text-[14px] leading-none font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 @max-[340px]:w-[30px] @max-[340px]:px-0 @max-[340px]:before:absolute @max-[340px]:before:-inset-[7px] @max-[340px]:before:content-[''] lg:w-[30px] lg:px-0 lg:before:absolute lg:before:-inset-[7px] lg:before:content-['']";
const HEADER_LABEL = "@max-[340px]:sr-only lg:sr-only";

/**
 * Icône « Exporter » : flèche vers le bas dans un plateau (pendant de partager.svg), seulement
 * en mode icône (la pastille avec son libellé reste celle de la maquette).
 */
function ExportIcon() {
  return (
    <svg
      viewBox="0 0 15 15"
      width={15}
      height={15}
      fill="none"
      aria-hidden
      className="hidden shrink-0 lg:block @max-[340px]:block"
    >
      <path
        d="M7.5 1.66667V9.16667M10.4167 6.25L7.5 9.16667L4.58333 6.25M2.5 7.91667V12.5H12.5V7.91667"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Petite pousse du bouton principal, recadrée sur son dessin (lisible à 32 px). */
const SPROUT = PLANT_BOUNDS["fleur-1-pousse"];
const SPROUT_VIEWBOX = [
  SPROUT.x - 2,
  SPROUT.y - 2,
  SPROUT.width + 4,
  SPROUT.height + 4,
].join(" ");

/** Page « Mon jardin » (maquette 04 · Mon jardin). */
export function GardenScreen({ siteUrl }: { siteUrl: string }) {
  const journal = useJournal();
  const locale = useLocale();
  const t = GARDEN_SCREEN[locale];
  const now = useNow();
  // Partage : le bouton n'existe que sur mobile ou appli installée (voir useShareSupport).
  const shareSupported = useShareSupport();
  const [shareOpen, setShareOpen] = useState(0);
  const shareButton = useRef<HTMLButtonElement>(null);
  const [importMessage, setImportMessage] = useState("");
  const [importing, setImporting] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // Choix arrivés pendant la visite (synchro du compte, autre onglet, import) : leurs plantes
  // apparaissent ensemble, en fondu, avec un seul message ; rien pour le carnet déjà là.
  const [seen, setSeen] = useState<readonly JournalEntry[] | null>(null);
  // Habitudes notées ici même (« J’ai tenu … ») : pas des choix « retrouvés ».
  const [noted, setNoted] = useState<readonly string[]>([]);
  const [wateredHere, setWateredHere] = useState<string | null>(null);
  const [arriving, setArriving] = useState<readonly string[]>([]);
  const [foundMessage, setFoundMessage] = useState("");
  if (journal.ready && seen !== journal.entries) {
    if (seen) {
      const known = new Set([...seen.map((entry) => entry.id), ...noted]);
      const fresh = journal.entries
        .filter((entry) => !known.has(entry.id))
        .map((entry) => entry.id);
      if (fresh.length > 0) {
        setArriving(fresh);
        // L'import a déjà son propre message.
        if (!importing) setFoundMessage(t.found(fresh.length));
      }
    }
    setSeen(journal.entries);
  }

  const garden = useMemo(
    () => buildGarden(journal.entries, new Date(now)),
    [journal.entries, now],
  );
  const newestFirst = useMemo(
    () => [...journal.entries].reverse(),
    [journal.entries],
  );
  const visible = newestFirst.slice(0, RECENT_COUNT);
  const hasEntries = journal.entries.length > 0;
  // Arrivée depuis « Aller la planter » (/jardin?nouveau=<id de l'entrée>) ou après une
  // habitude (/jardin?arrose=<id>), ou habitude notée ici même.
  const planted = useSearchParam("nouveau");
  const wateredParam = useSearchParam("arrose");
  const nouveau = planted ?? wateredParam;
  const fromUrl =
    nouveau && journal.entries.some((entry) => entry.id === nouveau)
      ? nouveau
      : null;
  const revealId = wateredHere ?? fromUrl;
  const gardenRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // Astuce du changement de saison (une fois par saison), d'après les arbres du jardin :
  // seulement s'il y a au moins un arbre caduc (celui qui change).
  const season = seasonAt(now);
  const seasonHint = useMemo(() => {
    if (!season) return null;
    const sheets = SPECIES_SHEETS[locale];
    const trees = treesBySeasonHabit(garden.plants);
    const text = SEASONS_UI[locale].seasonHint(
      season,
      trees.deciduous.map((tree) => ({
        name: sheets[tree.id].name.toLowerCase(),
        count: tree.count,
      })),
      trees.evergreen.map((id) => sheets[id].inSentence),
    );
    return text
      ? { id: seasonHintId(season, seasonYear(new Date(now), season)), text }
      : null;
  }, [season, garden.plants, locale, now]);
  // Une plante a poussé : l'astuce du jardin vide ne reviendra plus.
  useEffect(() => {
    if (garden.plants.length > 0) markHintSeen("jardin-vide");
  }, [garden.plants.length]);
  const water = (gesture: string) => {
    const entry = journal.addHabit(gesture);
    markHintSeen("premier-arrosage");
    // L'arrosoir passe au-dessus de la plante : le jardin revient à l'écran.
    gardenRef.current?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    });
    setNoted((ids) => [...ids, entry.id]);
    setWateredHere(entry.id);
  };

  useEffect(() => {
    if (!nouveau || !journal.ready) return;
    // Une fois la plante plantée et l'animal arrivé, on retire le paramètre de l'URL.
    const timer = window.setTimeout(
      () =>
        window.history.replaceState(null, "", localizeHref("/jardin", locale)),
      4000,
    );
    return () => window.clearTimeout(timer);
  }, [nouveau, journal.ready, locale]);
  const upcoming = nextAnimal(garden.lightChoiceCount);
  const [chosenSky, setSky] = useSky();
  const sky = effectiveSky(chosenSky, garden.lightChoiceCount);
  const canShare = shareSupported && journal.ready && hasEntries;
  const today = new Date(now);

  // « Les animaux parlent » : qui est là en ce moment (même scène que le jardin), l'amitié
  // de chacun (sur l'appareil), la conversation ouverte.
  const live = useMemo(
    () =>
      liveScene(
        garden,
        { season: seasonAt(now), night: isNightAt(now) },
        sky,
        new Date(now),
      ),
    [garden, now, sky],
  );
  const friends = useFriends();
  // Visiteurs qui parlent (renard, écureuil) : « rencontrés » dès qu'ils sont dans la scène.
  const visitorsHere = Object.entries(TALKING_VISITORS)
    .filter(([, kind]) =>
      live.visitors.some((visitor) => visitor.kind === kind),
    )
    .map(([talker]) => talker as TalkingVisitor)
    .join(" ");
  useEffect(() => {
    for (const talker of visitorsHere.split(" ").filter(Boolean))
      markMet(talker as TalkingVisitor);
  }, [visitorsHere]);
  const met = (talker: TalkerId) =>
    friends[talker].met ||
    (!isTalkingVisitor(talker) && garden.unlocked.includes(talker));
  const presence = (talker: TalkerId): TalkerPresence => {
    if (isTalkingVisitor(talker)) {
      const kind = TALKING_VISITORS[talker];
      const visitor = live.visitors.find(
        (candidate) => candidate.kind === kind,
      );
      if (visitor) return { here: true, asleep: visitor.asleep };
      // Hors de sa saison (l'écureuil, en automne seulement), sinon ailleurs.
      const season = seasonAt(now);
      return {
        here: false,
        why:
          season && !visitorRule(kind).seasons.includes(season)
            ? "saison"
            : "ailleurs",
      };
    }
    const animal = live.animals.find((candidate) => candidate.kind === talker);
    if (animal) return { here: true, asleep: animal.asleep };
    const why = live.away.find((away) => away.kind === talker)?.why;
    return {
      here: false,
      why: why === "saison" || why === "nuit" ? why : "ailleurs",
    };
  };
  const [talk, setTalk] = useState<{
    talker: TalkerId;
    reply: Reply;
    asleep: boolean;
  } | null>(null);
  const talkOpener = useRef<HTMLElement | null>(null);
  const openTalk = (talker: TalkerId, opener: HTMLElement) => {
    const here = presence(talker);
    if (!here.here) return;
    const date = new Date();
    const reply = talkTo(talker, {
      day: gardenDay(date) ?? "",
      season: seasonAt(date.getTime()),
      night: isNightAt(date.getTime()),
      planted: new Set(garden.plants.map((plant) => speciesFor(plant.kind).id)),
      asleep: here.asleep,
    });
    talkOpener.current = opener;
    setTalk({ talker, reply, asleep: here.asleep });
  };
  const closeTalk = () => {
    const talker = talk?.talker;
    setTalk(null);
    // Le focus revient à ce qui a ouvert la conversation (l'animal ou sa ligne de la liste).
    requestAnimationFrame(() => {
      const opener = talkOpener.current;
      if (opener?.isConnected) opener.focus();
      else
        document
          .querySelector<HTMLElement>(`[data-talk-row="${talker}"] button`)
          ?.focus();
    });
  };

  const onImport = async (file: File | undefined) => {
    if (!file) return;
    setImporting(true);
    const result = await journal.importFile(file);
    setImporting(false);
    if (!result.ok) {
      setImportMessage(t.importInvalid);
    } else {
      const added =
        result.added === 0 ? t.importNothing : t.importAdded(result.added);
      const skipped = result.invalid > 0 ? t.importSkipped(result.invalid) : "";
      setImportMessage(added + skipped);
    }
    if (fileInput.current) fileInput.current.value = "";
  };

  return (
    <main className="animate-enter mx-auto flex min-h-screen w-full max-w-[430px] flex-col motion-reduce:animate-none">
      {/* En-tête de hauteur fixe, quel que soit son contenu : sous `lg`, le nom est toujours
          sur deux lignes ; Exporter et Partager (téléphone qui partage, avec un carnet)
          arrivent après l'hydratation dans la place libre à droite, sans rien pousser, et
          débordent dans la marge intérieure. Faute de place (moins de 340 px utiles), ou sur
          ordinateur (le nom y reste sur une ligne), ils passent en icônes : nom accessible
          gardé, zone de toucher de 44 px, espacées pour ne pas se chevaucher. */}
      <div className="@container flex min-h-[41px] items-center justify-between gap-2 px-5 pt-[22px] pb-2 lg:min-h-0">
        <Logo stacked />
        {canShare ? (
          // Maquette 09a (mobile, appli installée) : « Exporter » puis « Partager ».
          <div className="-my-2 flex shrink-0 items-center gap-2 lg:gap-[14px] @max-[340px]:gap-[14px]">
            <button
              type="button"
              onClick={journal.exportFile}
              data-header-action="export"
              className={`${HEADER_ACTION} border-encre text-encre hover:bg-blanc border transition-colors`}
            >
              <ExportIcon />
              <span className={HEADER_LABEL}>{t.export}</span>
            </button>
            <button
              ref={shareButton}
              type="button"
              onClick={() => setShareOpen((count) => count + 1)}
              data-header-action="share"
              className={`${HEADER_ACTION} bg-encre text-creme`}
            >
              <Image
                src="/icons/partager.svg"
                alt=""
                width={15}
                height={15}
                className="block shrink-0"
                unoptimized
              />
              <span className={HEADER_LABEL}>{t.share}</span>
            </button>
          </div>
        ) : null}
      </div>
      {shareOpen > 0 ? (
        <ShareSheet
          key={shareOpen}
          garden={garden}
          sky={sky}
          unlockedCount={garden.unlocked.length}
          siteHost={siteHost(siteUrl)}
          siteUrl={siteUrl}
          onClose={() => {
            setShareOpen(0);
            // Le focus revient sur le bouton qui a ouvert la feuille.
            requestAnimationFrame(() => shareButton.current?.focus());
          }}
        />
      ) : null}

      <div className="px-5 pt-2 pb-1">
        <h1 className="font-titre text-titre-l text-encre leading-[1.1]">
          {t.title}
        </h1>
      </div>

      <div ref={gardenRef}>
        <Garden
          entries={journal.entries}
          now={now}
          highlightId={revealId}
          arriving={arriving}
          sky={sky}
          onTalk={openTalk}
          talking={talk?.talker ?? null}
          touchableTrees
        />
      </div>
      <p
        role="status"
        aria-live="polite"
        className="text-corps-s text-encre px-5 pt-2 font-semibold empty:hidden"
      >
        {foundMessage}
      </p>
      {/* Seul endroit où l'on annonce le prochain animal (pas sur les écrans de validation).
          Sa ligne est réservée dès le rendu serveur (carnet pas encore lu) : le bouton
          ne descend pas quand la phrase arrive. */}
      <p className="text-legende text-texte-attenue px-5 pt-2">
        {upcoming && journal.ready
          ? nextAnimalMessage(upcoming, locale)
          : "\u00a0"}
      </p>

      {/* Action principale de la page, juste sous le jardin : papier découpé jaune soleil,
          texte encre (paire vérifiée par le test du thème), contour et ombre nette encre ;
          appuyé, l'ombre se réduit et le bouton descend de 2 px (rien en mouvement réduit). */}
      <div className="px-5 pt-4">
        <Link
          href="/comparer"
          data-grow-plant
          className="bg-soleil text-encre border-encre focus-visible:outline-outremer flex w-full items-center justify-center gap-3 rounded-[20px] border-2 px-5 py-3.5 shadow-[4px_4px_0_0_var(--color-encre)] transition-[transform,box-shadow] duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-[2px] active:shadow-[2px_2px_0_0_var(--color-encre)] motion-reduce:transition-none motion-reduce:active:translate-y-0 motion-reduce:active:shadow-[4px_4px_0_0_var(--color-encre)]"
        >
          <Illustration
            name="fleur-1-pousse"
            viewBox={SPROUT_VIEWBOX}
            className="size-8 shrink-0"
            data-grow-sprout
          />
          <span className="flex flex-col items-start text-left">
            <span className="text-corps-m leading-[1.3] font-semibold">
              {t.grow}
            </span>
            <span className="text-corps-s leading-[1.35]">{t.growSub}</span>
          </span>
        </Link>
        <FirstHint
          id="jardin-vide"
          active={journal.ready && garden.plants.length === 0}
          className="pt-3"
        >
          {HINTS[locale].emptyGarden}
        </FirstHint>
        {seasonHint ? (
          <FirstHint id={seasonHint.id} active={journal.ready} className="pt-3">
            {seasonHint.text}
          </FirstHint>
        ) : null}
      </div>

      {/* Tout ce qui suit dépend du carnet (lu sur l'appareil après l'hydratation) : monté
          d'un bloc une fois le carnet lu, sous ce qui est déjà affiché, pour que rien ne se
          décale (CLS). */}
      {journal.ready ? (
        <div className="flex flex-col gap-4 px-5 pt-4 pb-8">
          {!journal.persistent && journal.ready ? (
            <p className="bg-tomate-douce text-corps-s text-encre rounded-2xl p-4">
              {t.noStorage}
            </p>
          ) : null}

          {journal.ready && !hasEntries ? (
            // Jardin vide : peut-être commencé sur un autre appareil. Le formulaire passe avant
            // l'invitation à comparer.
            <AccountSection variant="retrouver" />
          ) : null}

          {journal.ready && !hasEntries ? (
            <section className="bg-blanc flex flex-col items-start gap-3 rounded-[20px] p-5">
              <h2 className="font-titre text-titre-m text-encre leading-[1.1]">
                {t.emptyTitle}
              </h2>
              <p className="text-corps-s text-texte-attenue">{t.emptyText}</p>
            </section>
          ) : null}

          {journal.ready && !hasEntries ? <RaconteLink /> : null}

          {journal.ready ? (
            <MyHabits entries={journal.entries} now={now} onWater={water} />
          ) : null}

          <GardenFriends
            friends={friends}
            met={met}
            presence={presence}
            onTalk={openTalk}
          />

          <GardenSeasonCard />

          {hasEntries ? (
            <>
              <section
                className="bg-blanc flex flex-col gap-1.5 rounded-[20px] p-5"
                aria-label={t.summary}
              >
                <p className="font-titre text-chiffre-xl text-encre">
                  <CountUp
                    value={garden.totalAvoidedKg}
                    format={(kg) => formatMass(kg, locale)}
                  />
                </p>
                <p className="text-corps-s text-texte-attenue leading-[1.4]">
                  {t.differenceSince}
                </p>
                <p className="text-corps-s text-encre flex flex-wrap gap-x-4 gap-y-1 pt-2 leading-[1.3] font-semibold">
                  <span>{t.choices(garden.choiceCount)}</span>
                  {garden.wateredDayCount > 0 ? (
                    <span>{t.wateredDays(garden.wateredDayCount)}</span>
                  ) : null}
                  <span>{t.plants(garden.plants.length)}</span>
                  <span>{t.animals(garden.unlocked.length)}</span>
                </p>
              </section>

              <MilestoneCard entries={journal.entries} />

              <section
                className="flex flex-col gap-4"
                aria-labelledby="carnet-titre"
              >
                <div className="text-encre flex items-center justify-between">
                  <h2
                    id="carnet-titre"
                    className="font-titre text-titre-m leading-[1.1]"
                  >
                    {t.journal}
                  </h2>
                  <Link
                    href={CARNET_PATH}
                    className="text-corps-s leading-[1.3] font-semibold underline"
                  >
                    {t.seeAll}
                  </Link>
                </div>
                {now ? (
                  <WeekChart entries={journal.entries} now={today} />
                ) : null}
                <ul id="carnet-entrees" className="flex flex-col gap-2">
                  {visible.map((entry) => (
                    <EntryRow key={entry.id} entry={entry} now={today} />
                  ))}
                </ul>
                <p className="text-legende text-texte-attenue">{t.heavyNote}</p>
                <RaconteLink />
              </section>
            </>
          ) : null}

          {hasEntries ? (
            <SkyPicker
              value={sky}
              lightChoiceCount={garden.lightChoiceCount}
              onChange={setSky}
            />
          ) : null}

          {journal.ready ? (
            // Graine : le dernier choix noté (en lien avec ses gestes), sinon le jour.
            <FactCard
              seed={newestFirst[0]?.id}
              related={
                newestFirst[0] && isComparison(newestFirst[0])
                  ? [newestFirst[0].gestureA, newestFirst[0].gestureB]
                  : newestFirst[0]
                    ? [doneGesture(newestFirst[0])]
                    : []
              }
            />
          ) : null}

          <InstallBanner />

          {journal.ready && hasEntries ? <AccountSection /> : null}

          {journal.ready ? (
            <section className="flex flex-col gap-2 pt-2" aria-label={t.backup}>
              <p className="text-legende text-texte-attenue">{t.backupText}</p>
              <div className="flex flex-wrap gap-2">
                <PillButton onClick={journal.exportFile} disabled={!hasEntries}>
                  {t.export}
                </PillButton>
                <PillButton onClick={() => fileInput.current?.click()}>
                  {t.import}
                </PillButton>
                <input
                  ref={fileInput}
                  type="file"
                  accept="application/json,.json"
                  className="sr-only"
                  tabIndex={-1}
                  aria-hidden
                  onChange={(event) => onImport(event.target.files?.[0])}
                />
                {/* Toujours là, même bandeau « Garde ton jardin » fermé. */}
                <InstallButton look="pill" />
              </div>
              <p
                role="status"
                aria-live="polite"
                className="text-legende text-encre"
              >
                {importMessage}
                {journal.invalidCount > 0
                  ? t.setAside(journal.invalidCount)
                  : ""}
              </p>
            </section>
          ) : null}
        </div>
      ) : null}
      {talk ? (
        <AnimalTalk
          talker={talk.talker}
          reply={talk.reply}
          asleep={talk.asleep}
          onClose={closeTalk}
        />
      ) : null}
    </main>
  );
}
