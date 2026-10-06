"use client";

import { useId, useMemo, useState } from "react";
import { Garden } from "@/components/garden/Garden";
import { Flower } from "@/components/scene/Flower";
import { Tree } from "@/components/scene/Tree";
import type { JournalEntry } from "@/lib/data/types";
import { buildGarden } from "@/lib/garden/model";
import { SEASON_LABELS, SEASONS } from "@/lib/garden/seasons";
import { plantLook, SPECIES } from "@/lib/garden/species";
import { WATER_DAYS_PER_STEP, type BloomLevel } from "@/lib/garden/watering";
import { useNow } from "@/lib/hooks/useNow";
import { createEntry, createHabitEntry, type NewEntry } from "@/lib/journal";
import { Panel } from "./ui";

const DAY = 24 * 60 * 60 * 1000;

// Carnet de démonstration, en mémoire (jamais enregistré) : des pousses, des plantes jeunes et
// adultes, puis des habitudes sur des jours distincts. Écarts calculés avec les vraies données.
const DEMO: NewEntry[] = [
  { gestureA: "voiture", gestureB: "velo", quantity: 50, chosen: "b" },
  {
    gestureA: "repas-poulet",
    gestureB: "repas-vegetarien",
    quantity: 1,
    chosen: "b",
  },
  { gestureA: "voiture", gestureB: "tgv", quantity: 120, chosen: "b" },
  {
    gestureA: "jean",
    gestureB: "jean",
    quantity: 1,
    chosen: "b",
    modeA: "neuf",
    modeB: "occasion",
  },
  {
    gestureA: "eau-bouteille",
    gestureB: "eau-robinet",
    quantity: 1,
    chosen: "b",
  },
  { gestureA: "voiture", gestureB: "bus", quantity: 300, chosen: "b" },
  {
    gestureA: "smartphone",
    gestureB: "smartphone",
    quantity: 1,
    chosen: "b",
    modeA: "neuf",
    modeB: "garder",
  },
  { gestureA: "voiture", gestureB: "metro", quantity: 20, chosen: "b" },
];

function Slider({
  label,
  value,
  max,
  valueText,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  valueText: string;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-corps-s font-semibold">
        {label} : {valueText}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={max}
        step={1}
        value={value}
        aria-valuetext={valueText}
        onChange={(event) => onChange(Number(event.target.value))}
        className="accent-encre w-full max-w-sm"
      />
    </div>
  );
}

/**
 * Saisons et épanouissement : curseur de saison (feuillage, ciel, neige, ce qui tombe), niveau
 * d'épanouissement sur les six espèces, et jours arrosés sur un jardin de démonstration.
 */
export function GardenSeasonsLab() {
  const now = useNow();
  const [seasonIndex, setSeasonIndex] = useState(2);
  const [bloom, setBloom] = useState<BloomLevel>(1);
  const [days, setDays] = useState(6);
  const season = SEASONS[seasonIndex];

  const entries = useMemo(() => {
    if (!now) return [];
    // Plantées il y a 40 jours ; sans habitude, le jardin dort (plus de 21 jours).
    const start = now - 40 * DAY;
    const list: JournalEntry[] = DEMO.map((input, index) =>
      createEntry(input, {
        id: `labo-saison-${index}`,
        now: new Date(start + index * 60_000),
      }),
    );
    // Une habitude par jour, jusqu'à aujourd'hui : le jardin reste éveillé.
    for (let day = 0; day < days; day++)
      list.push(
        createHabitEntry(day % 2 ? "velo" : "repas-vegetarien", {
          id: `labo-habitude-${day}`,
          now: new Date(now - (days - 1 - day) * DAY - 60 * 60_000),
        }),
      );
    return list;
  }, [now, days]);
  const garden = useMemo(
    () => buildGarden(entries, new Date(now)),
    [entries, now],
  );
  const bloomed = garden.plants.filter((plant) => plant.bloom > 0).length;

  return (
    <Panel title="Saisons et épanouissement">
      <p className="text-corps-s text-texte-attenue">
        Saison réelle par défaut (mois à Paris) ; ici imposée. Une habitude
        arrose : un cran tous les {WATER_DAYS_PER_STEP} jours arrosés depuis la
        plantation (pousse → jeune → grand ou fleurie, puis épanouissement 1 à
        3). Les caducs (arbres 1 et 3) gardent leur niveau l’hiver, mais leur
        épanouissement dort jusqu’au printemps.
      </p>
      <Slider
        label="Saison"
        value={seasonIndex}
        max={SEASONS.length - 1}
        valueText={SEASON_LABELS[season]}
        onChange={setSeasonIndex}
      />
      <Slider
        label="Niveau d’épanouissement (planche)"
        value={bloom}
        max={3}
        valueText={String(bloom)}
        onChange={(value) => setBloom(value as BloomLevel)}
      />
      <ul className="bg-creme grid grid-cols-3 items-end gap-4 rounded-2xl p-4 sm:grid-cols-6">
        {SPECIES.map((species) => {
          const look = plantLook({ kind: species.kind, bloom }, season);
          return (
            <li key={species.id} className="flex flex-col items-center gap-2">
              {species.kind.type === "tree" ? (
                <Tree
                  variant={species.kind.variant}
                  stage="grand"
                  className="w-full max-w-[120px]"
                  paint={look.paint}
                  bloom={look.bloom}
                />
              ) : (
                <Flower
                  variant={species.kind.variant}
                  stage="fleurie"
                  className="w-1/2 max-w-[60px]"
                  paint={look.paint}
                  bloom={look.bloom}
                />
              )}
              <code className="text-legende text-texte-attenue text-center">
                {species.id} · {species.leaves}
                {look.bloom.level !== bloom ? " · dort" : ""}
              </code>
            </li>
          );
        })}
      </ul>
      <Slider
        label="Jours arrosés (jardin)"
        value={days}
        max={30}
        valueText={`${days} jour${days > 1 ? "s" : ""}`}
        onChange={setDays}
      />
      <Garden
        entries={entries}
        now={now}
        season={season}
        className="overflow-hidden rounded-2xl"
      />
      <p className="text-corps-s">
        {garden.plants.length} plantes, dont {bloomed} épanouies ·{" "}
        {garden.plants
          .map(
            (plant) => `${plant.stage}${plant.bloom ? ` +${plant.bloom}` : ""}`,
          )
          .join(", ")}
      </p>
    </Panel>
  );
}
