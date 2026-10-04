"use client";

import { useRef, useState } from "react";
import { Landscape } from "@/components/scene/Landscape";
import { playGust, useAutoGusts } from "@/components/motion/gust";
import { Bee } from "@/components/scene/Bee";
import { Butterfly } from "@/components/scene/Butterfly";
import { Flower, type FlowerVariant } from "@/components/scene/Flower";
import { Tree, type TreeVariant } from "@/components/scene/Tree";
import { Wind } from "@/components/scene/Wind";
import { Panel, Switch, ToggleButton } from "./ui";

// Rangée de plantes, de gauche à droite : elles plient l'une après l'autre au passage du vent.
const ROW: (
  | { kind: "tree"; variant: TreeVariant }
  | { kind: "flower"; variant: FlowerVariant }
)[] = [
  { kind: "flower", variant: 1 },
  { kind: "tree", variant: 1 },
  { kind: "flower", variant: 2 },
  { kind: "tree", variant: 2 },
  { kind: "flower", variant: 3 },
  { kind: "tree", variant: 3 },
];

export function GustLab() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [auto, setAuto] = useState(false);
  const [grown, setGrown] = useState(true);
  useAutoGusts(auto, sceneRef);

  return (
    <Panel title="Coup de vent">
      <div
        ref={sceneRef}
        className="relative aspect-[390/220] w-full overflow-hidden rounded-2xl"
      >
        <Landscape className="absolute bottom-0 left-0 w-full" />
        <Wind className="absolute inset-x-0 top-[38%]" />
        <Butterfly
          className="absolute top-[12%] left-[18%] w-[9%]"
          title="Papillon"
        />
        <Bee className="absolute top-[20%] left-[62%] w-[9%]" title="Abeille" />
        <div className="absolute inset-x-[4%] bottom-[6%] flex items-end justify-between">
          {ROW.map((plant) =>
            plant.kind === "tree" ? (
              <Tree
                key={`tree-${plant.variant}`}
                variant={plant.variant}
                stage={grown ? "grand" : "pousse"}
                className="w-[17%]"
              />
            ) : (
              <Flower
                key={`flower-${plant.variant}`}
                variant={plant.variant}
                stage={grown ? "fleurie" : "pousse"}
                className="w-[9%]"
              />
            ),
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <ToggleButton
          pressed={false}
          onClick={() => playGust(sceneRef.current)}
        >
          Coup de vent
        </ToggleButton>
        <Switch checked={auto} onChange={setAuto}>
          Rafales automatiques
        </Switch>
        <ToggleButton
          pressed={grown}
          onClick={() => setGrown((value) => !value)}
        >
          {grown ? "Revenir aux pousses" : "Faire pousser"}
        </ToggleButton>
      </div>
      <p className="text-corps-s text-texte-attenue">
        Les rafales automatiques arrivent toutes les 25 à 45 secondes, seulement
        quand l&apos;onglet est visible. En animations réduites, le vent ne fait
        rien bouger.
      </p>
    </Panel>
  );
}
