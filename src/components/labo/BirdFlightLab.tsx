"use client";

import { useMemo } from "react";
import { Garden } from "@/components/garden/Garden";
import { Bird } from "@/components/scene/Bird";
import { FLIGHT } from "@/lib/geometry/flight";
import { useNow } from "@/lib/hooks/useNow";
import { createEntry, type NewEntry } from "@/lib/journal";
import { Panel } from "./ui";

// Cinq choix légers : l'oiseau est installé. Carnet de démonstration, en mémoire (jamais
// enregistré) ; les écarts sont calculés avec les vraies données.
const DEMO: NewEntry[] = [
  { gestureA: "voiture", gestureB: "velo", quantity: 3, chosen: "b" },
  {
    gestureA: "repas-boeuf",
    gestureB: "repas-vegetarien",
    quantity: 1,
    chosen: "b",
  },
  { gestureA: "avion", gestureB: "tgv", quantity: 300, chosen: "b" },
  { gestureA: "voiture", gestureB: "velo", quantity: 8, chosen: "b" },
  {
    gestureA: "repas-boeuf",
    gestureB: "repas-poulet",
    quantity: 1,
    chosen: "b",
  },
];

export function BirdFlightLab() {
  const now = useNow();
  const entries = useMemo(
    () =>
      DEMO.map((input, index) =>
        createEntry(input, {
          id: `labo-oiseau-${index}`,
          now: new Date(now - (DEMO.length - index) * 60_000),
        }),
      ),
    [now],
  );

  return (
    <Panel title="Envol de l’oiseau">
      <p className="text-corps-s text-texte-attenue">
        Touche l’oiseau (ou Tab jusqu’à « Faire s’envoler l’oiseau », puis
        Entrée) : il décolle sous le soleil, fait une boucle dans la bande de
        ciel et revient se poser ({FLIGHT.duration} s). Il s’envole aussi seul,
        toutes les {FLIGHT.interval[0]} à {FLIGHT.interval[1]} s. Jamais quand
        le jardin dort ni en animations réduites.
      </p>
      <Garden
        entries={entries}
        now={now}
        className="overflow-hidden rounded-2xl"
      />
      <figure className="flex flex-col items-center gap-3">
        <Bird flying className="w-28" title="Oiseau en vol" />
        <figcaption className="text-corps-s font-semibold">
          oiseau-vol : battement des deux ailes, en décalé
        </figcaption>
      </figure>
    </Panel>
  );
}
