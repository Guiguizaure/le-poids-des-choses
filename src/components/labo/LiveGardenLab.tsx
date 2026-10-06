"use client";

import { useId, useMemo, useState } from "react";
import { Garden } from "@/components/garden/Garden";
import type { JournalEntry } from "@/lib/data/types";
import { isNightHour, NIGHT_HOURS, STARS_ENABLED } from "@/lib/garden/daytime";
import { liveScene } from "@/lib/garden/live";
import { buildGarden } from "@/lib/garden/model";
import { SEASON_LABELS, SEASONS } from "@/lib/garden/seasons";
import { useNow } from "@/lib/hooks/useNow";
import { createEntry, type NewEntry } from "@/lib/journal";
import { Panel } from "./ui";

// Vingt choix légers (tous les animaux), dont des objets : de grands arbres pour le hibou et la
// cigale. Carnet de démonstration, en mémoire ; écarts calculés avec les vraies données.
const DEMO: NewEntry[] = Array.from({ length: 20 }, (_, i) =>
  i % 4 === 0
    ? {
        gestureA: "smartphone",
        gestureB: "smartphone",
        quantity: 1,
        chosen: "b",
        modeA: "neuf",
        modeB: "garder",
      }
    : { gestureA: "voiture", gestureB: "velo", quantity: 10 + i, chosen: "b" },
);

/**
 * Jardin vivant : curseurs de saison et d'heure. Visiteurs de saison, animaux débloqués
 * absents ou endormis selon le moment, nuit de 21 h à 6 h (Nuit encre, cratères, étoiles).
 */
export function LiveGardenLab() {
  const now = useNow();
  const seasonId = useId();
  const hourId = useId();
  const [seasonIndex, setSeasonIndex] = useState(2);
  const [hour, setHour] = useState(14);
  const season = SEASONS[seasonIndex];
  const night = isNightHour(hour);

  const entries = useMemo<JournalEntry[]>(
    () =>
      now
        ? DEMO.map((input, index) =>
            createEntry(input, {
              id: `labo-vivant-${index}`,
              now: new Date(now - (DEMO.length - index) * 60_000),
            }),
          )
        : [],
    [now],
  );
  const live = useMemo(
    () =>
      liveScene(
        buildGarden(entries, new Date(now)),
        { season, night },
        "jour",
        new Date(now),
      ),
    [entries, now, season, night],
  );

  return (
    <Panel title="Jardin vivant : saisons, jour et nuit">
      <p className="text-corps-s text-texte-attenue">
        Nuit de {NIGHT_HOURS.start} h à {NIGHT_HOURS.end} h (heure de
        l’appareil) : Nuit encre, lune à cratères
        {STARS_ENABLED ? ", étoiles" : " (étoiles coupées : STARS_ENABLED)"}.
        Les visiteurs ne se débloquent pas et ne comptent nulle part.
      </p>
      <div className="flex flex-col gap-1">
        <label htmlFor={seasonId} className="text-corps-s font-semibold">
          Saison : {SEASON_LABELS[season]}
        </label>
        <input
          id={seasonId}
          type="range"
          min={0}
          max={SEASONS.length - 1}
          value={seasonIndex}
          aria-valuetext={SEASON_LABELS[season]}
          onChange={(event) => setSeasonIndex(Number(event.target.value))}
          className="accent-encre w-full max-w-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={hourId} className="text-corps-s font-semibold">
          Heure : {hour} h {night ? "(nuit)" : "(jour)"}
        </label>
        <input
          id={hourId}
          type="range"
          min={0}
          max={23}
          value={hour}
          aria-valuetext={`${hour} heures`}
          onChange={(event) => setHour(Number(event.target.value))}
          className="accent-encre w-full max-w-sm"
        />
      </div>
      <Garden
        entries={entries}
        now={now}
        season={season}
        night={night}
        className="overflow-hidden rounded-2xl"
      />
      <p className="text-corps-s">
        Visiteurs :{" "}
        {live.visitors
          .map((v) => `${v.kind}${v.asleep ? " (endormi)" : ""}`)
          .join(", ") || "aucun"}{" "}
        · Animaux :{" "}
        {live.animals
          .map((a) => `${a.kind}${a.asleep ? " (endormi)" : ""}`)
          .join(", ")}
        {live.away.length
          ? ` · Absents : ${live.away.map((a) => `${a.kind} (${a.why})`).join(", ")}`
          : ""}
      </p>
    </Panel>
  );
}
