"use client";

import type { CSSProperties } from "react";
import { Landscape } from "@/components/scene/Landscape";
import { SKIES, skyStyle } from "@/lib/garden/skies";
import { Panel } from "./ui";

/** Les quatre ciels du jardin, côte à côte (débloqués à 0, 15, 30 et 50 choix légers). */
export function SkyLab() {
  return (
    <Panel title="Ciels du jardin">
      <p className="text-corps-s text-texte-attenue">
        Couleurs de la palette seulement ; collines et sol ne changent pas. Le
        ciel choisi sur /jardin s’applique aussi à l’image de partage.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SKIES.map((sky) => (
          <figure key={sky.id} className="flex flex-col gap-2">
            <div
              data-sky={sky.id}
              style={skyStyle(sky.id) as CSSProperties}
              className="overflow-hidden rounded-2xl"
            >
              <Landscape />
            </div>
            <figcaption className="text-corps-s font-semibold">
              {sky.label}
              {sky.unlockAt > 0
                ? ` · ${sky.unlockAt} choix légers`
                : " · dès le départ"}
            </figcaption>
          </figure>
        ))}
      </div>
    </Panel>
  );
}
