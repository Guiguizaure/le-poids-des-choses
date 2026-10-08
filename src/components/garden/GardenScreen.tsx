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
      {/* Les boutons de partage (30 px) arrivent après l'hydratation : ils débordent dans la
          marge intérieure pour ne pas agrandir la barre, donc ne rien décaler. */}
      <div className="flex items-center justify-between gap-2 px-5 pt-[22px] pb-2 [&>button]:-my-1.5">
        <Logo />
        {canShare ? (
          // Maquette 09a (mobile, appli installée) : « Exporter » puis « Partager ».
          <>
            <PillButton onClick={journal.exportFile}>{t.export}</PillButton>
            <button
              ref={shareButton}
              type="button"
              onClick={() => setShareOpen((count) => count + 1)}
              className="press bg-encre text-creme focus-visible:outline-outremer flex h-[30px] shrink-0 items-center gap-1.5 rounded-full py-1.5 pr-3.5 pl-3 text-[14px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Image
                src="/icons/partager.svg"
                alt=""
                width={15}
                height={15}
                className="block"
                unoptimized
              />
              {t.share}
            </button>
          </>
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
    </main>
  );
}
