"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Garden } from "@/components/garden/Garden";
import { EntryRow } from "@/components/garden/EntryRow";
import { InstallBanner } from "@/components/garden/InstallBanner";
import { CARNET_PATH } from "@/components/garden/CarnetScreen";
import { MilestoneCard } from "@/components/garden/MilestoneCard";
import { SkyPicker } from "@/components/garden/SkyPicker";
import { ShareSheet } from "@/components/garden/share/ShareSheet";
import { useShareSupport } from "@/components/garden/share/useShareSupport";
import { useSky } from "@/components/garden/useSky";
import { WeekChart } from "@/components/garden/WeekChart";
import { Icon } from "@/components/ui/buttons";
import { CountUp } from "@/components/ui/CountUp";
import { formatMass } from "@/lib/calc";
import { buildGarden, nextAnimal } from "@/lib/garden/model";
import { effectiveSky } from "@/lib/garden/skies";
import { siteHost } from "@/lib/share/card";
import { nextAnimalMessage, plural } from "@/lib/garden/text";
import { useNow } from "@/lib/hooks/useNow";
import { useSearchParam } from "@/lib/hooks/useSearchParam";
import { useJournal } from "@/lib/journal/useJournal";
import { FactCard } from "@/components/facts/FactCard";
import { AccountSection } from "@/components/account/AccountSection";
import { InstallButton } from "@/components/install/InstallButton";
import type { JournalEntry } from "@/lib/data/types";

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

/** Page « Mon jardin » (maquette 04 · Mon jardin). */
export function GardenScreen({ siteUrl }: { siteUrl: string }) {
  const journal = useJournal();
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
  const [arriving, setArriving] = useState<readonly string[]>([]);
  const [foundMessage, setFoundMessage] = useState("");
  if (journal.ready && seen !== journal.entries) {
    if (seen) {
      const known = new Set(seen.map((entry) => entry.id));
      const fresh = journal.entries
        .filter((entry) => !known.has(entry.id))
        .map((entry) => entry.id);
      if (fresh.length > 0) {
        setArriving(fresh);
        // L'import a déjà son propre message.
        if (!importing)
          setFoundMessage(
            `Ton jardin est de retour : ${plural(fresh.length, "choix retrouvé", "choix retrouvés")}.`,
          );
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
  // Arrivée depuis « Aller la planter » : /jardin?nouveau=<id de l'entrée>.
  const nouveau = useSearchParam("nouveau");
  const revealId =
    nouveau && journal.entries.some((entry) => entry.id === nouveau)
      ? nouveau
      : null;

  useEffect(() => {
    if (!nouveau || !journal.ready) return;
    // Une fois la plante plantée et l'animal arrivé, on retire le paramètre de l'URL.
    const timer = window.setTimeout(
      () => window.history.replaceState(null, "", "/jardin"),
      4000,
    );
    return () => window.clearTimeout(timer);
  }, [nouveau, journal.ready]);
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
      setImportMessage("Ce fichier n’est pas un carnet lisible.");
    } else {
      const added =
        result.added === 0
          ? "Rien de nouveau dans ce fichier : ton carnet est à jour."
          : `${plural(result.added, "choix ajouté", "choix ajoutés")} à ton carnet.`;
      const skipped =
        result.invalid > 0
          ? ` ${plural(result.invalid, "entrée illisible ignorée", "entrées illisibles ignorées")}.`
          : "";
      setImportMessage(added + skipped);
    }
    if (fileInput.current) fileInput.current.value = "";
  };

  return (
    <main className="animate-enter mx-auto flex min-h-screen w-full max-w-[430px] flex-col motion-reduce:animate-none">
      <div className="flex items-center justify-between gap-2 px-5 pt-[22px] pb-2">
        <Link
          href="/comparer"
          className="text-corps-s text-encre flex items-center gap-1 leading-[1.3] font-semibold"
        >
          <Icon name="retour" />
          Comparer
        </Link>
        {canShare ? (
          // Maquette 09a (mobile, appli installée) : « Exporter » puis « Partager ».
          <>
            <PillButton onClick={journal.exportFile}>Exporter</PillButton>
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
              Partager
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
          Mon jardin
        </h1>
      </div>

      <Garden
        entries={journal.entries}
        now={now}
        highlightId={revealId}
        arriving={arriving}
        sky={sky}
      />
      <p
        role="status"
        aria-live="polite"
        className="text-corps-s text-encre px-5 pt-2 font-semibold empty:hidden"
      >
        {foundMessage}
      </p>
      {upcoming && journal.ready ? (
        // Seul endroit où l'on annonce le prochain animal (pas sur les écrans de validation).
        <p className="text-legende text-texte-attenue px-5 pt-2">
          {nextAnimalMessage(upcoming)}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 px-5 pt-4 pb-8">
        {!journal.persistent && journal.ready ? (
          <p className="bg-tomate-douce text-corps-s text-encre rounded-2xl p-4">
            Ton navigateur n’autorise pas l’enregistrement : ton jardin vivra le
            temps de cette visite. Exporte ton carnet pour le garder.
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
              Ton jardin t’attend
            </h2>
            <p className="text-corps-s text-texte-attenue">
              Chaque fois que tu choisis le geste le plus léger, une plante
              pousse ici. Un choix plus lourd est simplement noté : rien n’est
              retiré au jardin.
            </p>
            <Link
              href="/comparer"
              className="bg-encre text-corps-m text-creme rounded-full px-6 py-4 leading-[1.3] font-semibold"
            >
              Comparer deux gestes
            </Link>
          </section>
        ) : null}

        {hasEntries ? (
          <>
            <section
              className="bg-blanc flex flex-col gap-1.5 rounded-[20px] p-5"
              aria-label="Bilan"
            >
              <p className="font-titre text-chiffre-xl text-encre">
                <CountUp value={garden.totalAvoidedKg} format={formatMass} />
              </p>
              <p className="text-corps-s text-texte-attenue leading-[1.4]">
                de CO2e d’écart avec les autres options, depuis ton premier
                choix
              </p>
              <p className="text-corps-s text-encre flex flex-wrap gap-x-4 gap-y-1 pt-2 leading-[1.3] font-semibold">
                <span>
                  {plural(garden.choiceCount, "choix noté", "choix notés")}
                </span>
                <span>{plural(garden.plants.length, "plante", "plantes")}</span>
                <span>
                  {plural(garden.unlocked.length, "animal", "animaux")}
                </span>
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
                  Carnet
                </h2>
                <Link
                  href={CARNET_PATH}
                  className="text-corps-s leading-[1.3] font-semibold underline"
                >
                  Tout voir
                </Link>
              </div>
              {now ? <WeekChart entries={journal.entries} now={today} /> : null}
              <ul id="carnet-entrees" className="flex flex-col gap-2">
                {visible.map((entry) => (
                  <EntryRow key={entry.id} entry={entry} now={today} />
                ))}
              </ul>
              <p className="text-legende text-texte-attenue">
                Un choix plus lourd est simplement noté : rien n’est retiré au
                jardin.
              </p>
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
              newestFirst[0]
                ? [newestFirst[0].gestureA, newestFirst[0].gestureB]
                : []
            }
          />
        ) : null}

        <InstallBanner />

        {journal.ready && hasEntries ? <AccountSection /> : null}

        {journal.ready ? (
          <section
            className="flex flex-col gap-2 pt-2"
            aria-label="Sauvegarde du carnet"
          >
            <p className="text-legende text-texte-attenue">
              Ton carnet reste sur cet appareil. Exporte-le pour le garder ou le
              retrouver ailleurs.
            </p>
            <div className="flex flex-wrap gap-2">
              <PillButton onClick={journal.exportFile} disabled={!hasEntries}>
                Exporter
              </PillButton>
              <PillButton onClick={() => fileInput.current?.click()}>
                Importer
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
                ? ` ${plural(journal.invalidCount, "entrée illisible a été mise", "entrées illisibles ont été mises")} de côté.`
                : ""}
            </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
