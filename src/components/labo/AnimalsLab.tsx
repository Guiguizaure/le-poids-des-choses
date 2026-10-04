"use client";

import { useState } from "react";
import { Bee } from "@/components/scene/Bee";
import { Hedgehog } from "@/components/scene/Hedgehog";
import { Ladybug } from "@/components/scene/Ladybug";
import { Snail } from "@/components/scene/Snail";
import { Panel, Switch } from "./ui";

export function AnimalsLab() {
  const [snailAsleep, setSnailAsleep] = useState(false);
  const [hedgehogAsleep, setHedgehogAsleep] = useState(false);

  return (
    <Panel title="Petites bêtes">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        <figure className="flex flex-col items-center gap-3">
          <div className="flex h-28 items-center">
            <Bee className="w-24" title="Abeille" />
          </div>
          <figcaption className="text-corps-s font-semibold">
            Abeille
          </figcaption>
        </figure>
        <figure className="flex flex-col items-center gap-3">
          <div className="flex h-28 items-end">
            <Ladybug className="w-16" title="Coccinelle" />
          </div>
          <figcaption className="text-corps-s font-semibold">
            Coccinelle
          </figcaption>
        </figure>
        <figure className="flex flex-col items-center gap-3">
          <div className="flex h-28 items-end">
            <Snail
              asleep={snailAsleep}
              className="w-24"
              title={snailAsleep ? "Escargot endormi" : "Escargot"}
            />
          </div>
          <figcaption className="text-corps-s font-semibold">
            Escargot
          </figcaption>
          <Switch checked={snailAsleep} onChange={setSnailAsleep}>
            Endormi
          </Switch>
        </figure>
        <figure className="flex flex-col items-center gap-3">
          <div className="flex h-28 items-end">
            <Hedgehog
              asleep={hedgehogAsleep}
              className="w-24"
              title={hedgehogAsleep ? "Hérisson endormi" : "Hérisson"}
            />
          </div>
          <figcaption className="text-corps-s font-semibold">
            Hérisson
          </figcaption>
          <Switch checked={hedgehogAsleep} onChange={setHedgehogAsleep}>
            Endormi
          </Switch>
        </figure>
      </div>
    </Panel>
  );
}
