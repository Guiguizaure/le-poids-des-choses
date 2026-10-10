"use client";

import { portraitSrc } from "@/components/garden/talk/portrait";
import { Flower } from "@/components/scene/Flower";
import { Landscape } from "@/components/scene/Landscape";
import { Scale } from "@/components/scene/Scale";
import { Snail } from "@/components/scene/Snail";
import { Tree } from "@/components/scene/Tree";
import { ESCARGOT } from "@/content/animaux/escargot";
import { useLocale } from "@/lib/i18n/LocaleProvider";

// Illustrations de « Comment ça marche » (ordinateur seulement, maquette 102:3), chargées à la
// demande par HowItWorks : ni leur code ni leurs dessins ne pèsent sur l'accueil mobile.
/**
 * Réplique réelle de l'escargot (esc-2, deuxième étape), jusqu'à son premier « ! » : celle de
 * la maquette (« Mes yeux sont tout au bout ! »), lue dans le contenu, jamais réécrite.
 */
function snailLine(locale: "fr" | "en"): string {
  const step = ESCARGOT.lines.find((line) => line.id === "esc-2")!.steps[1];
  const text = step[locale];
  const end = text.indexOf("!");
  return end === -1 ? text : text.slice(0, end + 1);
}

/** Illustrations des étapes (ordinateur seulement, comme la maquette 102:3), décoratives. */
export default function StepArt({ step }: { step: number }) {
  const locale = useLocale();
  if (step === 0)
    return (
      <div className="w-[280px] max-w-full">
        <Scale
          tilt={0.45}
          leftItem="picto-velo"
          rightItem="picto-voiture"
          className="w-full"
        />
      </div>
    );
  if (step === 1)
    return (
      <div className="flex items-end gap-1">
        {(["pousse", "jeune", "grand"] as const).map((stage, i) => (
          <div key={stage} className="flex items-end gap-1">
            {i > 0 ? (
              <span className="font-titre text-encre mb-4 text-[26px]">→</span>
            ) : null}
            <Tree
              variant={3}
              stage={stage}
              sparkle={false}
              className="w-[84px]"
            />
          </div>
        ))}
      </div>
    );
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[18px]">
      <Landscape className="absolute bottom-0 left-0 w-full" still />
      <div className="absolute bottom-[8%] left-[12%] w-[18%]">
        <Tree variant={1} stage="grand" sparkle={false} className="w-full" />
      </div>
      <div className="absolute right-[18%] bottom-[8%] w-[10%]">
        <Flower
          variant={4}
          stage="fleurie"
          sparkle={false}
          className="w-full"
        />
      </div>
      <div className="absolute bottom-[3%] left-[40%] w-[16%]">
        <Snail className="w-full" />
      </div>
      <div className="border-encre bg-blanc absolute top-3 right-3 left-3 flex items-center gap-2.5 rounded-2xl border-[1.5px] p-2">
        {/* eslint-disable-next-line @next/next/no-img-element -- portrait décoratif (SVG statique) */}
        <img
          src={portraitSrc("snail", "content")}
          alt=""
          className="size-11 shrink-0 rounded-[9px]"
        />
        <span className="flex min-w-0 flex-col text-left">
          <span className="text-texte-attenue text-[12px] leading-[1.3] font-semibold">
            {ESCARGOT.name[locale]}
          </span>
          <span className="text-encre text-[14px] leading-[1.3] font-semibold">
            {snailLine(locale)}
          </span>
        </span>
      </div>
    </div>
  );
}
