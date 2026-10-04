"use client";

import Link from "next/link";
import { useState } from "react";
import { Garden } from "@/components/garden/Garden";
import { formatMass } from "@/lib/calc";
import { buildGarden } from "@/lib/garden/model";
import { useNow } from "@/lib/hooks/useNow";
import type { NewEntry } from "@/lib/journal";
import { useJournal } from "@/lib/journal/useJournal";
import { Panel, ToggleButton } from "./ui";

// Choix types, calculés avec les vraies données (kg évités indicatifs).
const PRESETS: { label: string; entry: NewEntry }[] = [
  {
    label: "Choix léger · petit (vélo plutôt que voiture, 3 km)",
    entry: { gestureA: "voiture", gestureB: "velo", quantity: 3, chosen: "b" },
  },
  {
    label: "Choix léger · moyen (repas végétarien plutôt que bœuf)",
    entry: {
      gestureA: "repas-boeuf",
      gestureB: "repas-vegetarien",
      quantity: 1,
      chosen: "b",
    },
  },
  {
    label: "Choix léger · gros (TGV plutôt qu’avion, 300 km)",
    entry: { gestureA: "avion", gestureB: "tgv", quantity: 300, chosen: "b" },
  },
  {
    label: "Choix lourd (avion plutôt que TGV, 300 km)",
    entry: { gestureA: "avion", gestureB: "tgv", quantity: 300, chosen: "a" },
  },
];

export function JournalSimulator() {
  const journal = useJournal();
  const now = useNow();
  const [confirmReset, setConfirmReset] = useState(false);
  const garden = buildGarden(journal.entries, new Date(now));

  return (
    <Panel title="Simulateur de carnet">
      <p className="text-corps-s text-texte-attenue">
        Attention : ce simulateur écrit dans ton vrai carnet, celui de la page{" "}
        <Link href="/jardin" className="text-encre font-semibold underline">
          Mon jardin
        </Link>
        .{" "}
        {journal.persistent
          ? ""
          : "Le stockage est indisponible : le carnet vit en mémoire."}
      </p>
      <Garden
        entries={journal.entries}
        now={now}
        highlightId={journal.lastAddedId}
        className="overflow-hidden rounded-2xl"
      />
      <p className="text-corps-s text-encre font-semibold">
        {journal.entries.length} choix · {garden.plants.length} plantes ·{" "}
        {garden.unlocked.length} animaux · {formatMass(garden.totalAvoidedKg)}{" "}
        évités
        {garden.asleep ? " · assoupi" : ""}
      </p>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <ToggleButton
            key={preset.label}
            pressed={false}
            onClick={() => journal.add(preset.entry)}
          >
            {preset.label}
          </ToggleButton>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <ToggleButton pressed={false} onClick={() => journal.ageJournal(30)}>
          Vieillir la dernière entrée de 30 jours
        </ToggleButton>
        {confirmReset ? (
          <>
            <ToggleButton
              pressed
              onClick={() => {
                journal.reset();
                setConfirmReset(false);
              }}
            >
              Confirmer : vider le carnet
            </ToggleButton>
            <ToggleButton
              pressed={false}
              onClick={() => setConfirmReset(false)}
            >
              Annuler
            </ToggleButton>
          </>
        ) : (
          <ToggleButton pressed={false} onClick={() => setConfirmReset(true)}>
            Vider le carnet
          </ToggleButton>
        )}
      </div>
    </Panel>
  );
}
