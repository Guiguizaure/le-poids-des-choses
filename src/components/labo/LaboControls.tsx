"use client";

import { useState, useSyncExternalStore } from "react";
import { REDUCED_MOTION_QUERY } from "@/components/motion/gsap";
import { MotionProvider } from "@/components/motion/MotionProvider";
import {
  Tree,
  TREE_STAGES,
  type TreeStage,
  type TreeVariant,
} from "@/components/scene/Tree";
import { Scale } from "@/components/scene/Scale";
import { Sparkle } from "@/components/scene/Sparkle";
import { Bird } from "@/components/scene/Bird";
import { Butterfly } from "@/components/scene/Butterfly";
import { AnimalsLab } from "./AnimalsLab";
import { GustLab } from "./GustLab";
import { Panel, Switch, ToggleButton } from "./ui";

const VARIANTS: TreeVariant[] = [1, 2, 3];

function subscribeToReducedMotion(callback: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function useSystemReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

export function LaboControls() {
  const systemReduced = useSystemReducedMotion();
  const [forceReduced, setForceReduced] = useState(false);
  const [stages, setStages] = useState<Record<TreeVariant, TreeStage>>({
    1: "pousse",
    2: "jeune",
    3: "grand",
  });
  const [tilt, setTilt] = useState(0);
  const [asleep, setAsleep] = useState(false);
  const [sparkleCount, setSparkleCount] = useState(0);

  const setAllStages = (stage: TreeStage) =>
    setStages({ 1: stage, 2: stage, 3: stage });

  return (
    <MotionProvider forceReduced={forceReduced}>
      <div className="flex flex-col gap-6">
        <div className="bg-tomate-douce flex flex-col gap-2 rounded-3xl p-5">
          <Switch checked={forceReduced} onChange={setForceReduced}>
            Simuler les animations réduites
          </Switch>
          <p className="text-corps-s text-texte-attenue">
            Ton système demande des animations{" "}
            {systemReduced ? "réduites" : "normales"}.
            {forceReduced || systemReduced
              ? " Les animations sont réduites : pas de balancement ni de rebond, des fondus courts."
              : ""}
          </p>
        </div>

        <Panel title="Arbres">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-corps-s text-texte-attenue">Tous :</span>
            {TREE_STAGES.map((stage) => (
              <ToggleButton
                key={stage}
                pressed={VARIANTS.every((variant) => stages[variant] === stage)}
                onClick={() => setAllStages(stage)}
              >
                {stage}
              </ToggleButton>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {VARIANTS.map((variant) => (
              <div key={variant} className="flex flex-col items-center gap-3">
                <Tree
                  variant={variant}
                  stage={stages[variant]}
                  title={`Arbre ${variant}, stade ${stages[variant]}`}
                  className="w-[150px]"
                />
                <div
                  className="flex flex-wrap justify-center gap-2"
                  aria-label={`Stade de l'arbre ${variant}`}
                  role="group"
                >
                  {TREE_STAGES.map((stage) => (
                    <ToggleButton
                      key={stage}
                      pressed={stages[variant] === stage}
                      onClick={() =>
                        setStages((current) => ({
                          ...current,
                          [variant]: stage,
                        }))
                      }
                    >
                      {stage}
                    </ToggleButton>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Balance">
          <div className="flex justify-center">
            <Scale
              tilt={tilt}
              className="w-full max-w-[420px]"
              title={
                tilt === 0
                  ? "Balance en équilibre"
                  : `Balance penchée à ${tilt > 0 ? "droite" : "gauche"}`
              }
            />
          </div>
          <label className="text-corps-m flex flex-col gap-2">
            <span>
              Inclinaison : <strong>{tilt.toFixed(2)}</strong>
            </span>
            <input
              type="range"
              min={-1}
              max={1}
              step={0.05}
              value={tilt}
              onChange={(event) => setTilt(Number(event.target.value))}
              className="accent-tomate w-full"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {[-1, 0, 1].map((value) => (
              <ToggleButton
                key={value}
                pressed={tilt === value}
                onClick={() => setTilt(value)}
              >
                {value === 0
                  ? "Équilibre"
                  : value < 0
                    ? "Gauche (-1)"
                    : "Droite (1)"}
              </ToggleButton>
            ))}
          </div>
        </Panel>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Panel title="Papillon">
            <div className="flex justify-center py-4">
              <Butterfly className="w-24" title="Papillon" />
            </div>
          </Panel>

          <Panel title="Oiseau">
            <div className="flex justify-center py-4">
              <Bird
                asleep={asleep}
                className="w-24"
                title={asleep ? "Oiseau endormi" : "Oiseau"}
              />
            </div>
            <Switch checked={asleep} onChange={setAsleep}>
              Endormi
            </Switch>
          </Panel>

          <Panel title="Éclat">
            <div className="flex justify-center py-4">
              <Sparkle trigger={sparkleCount} className="w-24" />
            </div>
            <ToggleButton
              pressed={false}
              onClick={() => setSparkleCount((count) => count + 1)}
            >
              Faire éclater
            </ToggleButton>
          </Panel>
        </div>

        <AnimalsLab />
        <GustLab />
      </div>
    </MotionProvider>
  );
}
