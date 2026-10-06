"use client";

import { plural } from "@/lib/garden/text";
import { NIGHT_HOURS } from "@/lib/garden/daytime";
import { SKIES, type SkyId } from "@/lib/garden/skies";

/**
 * Choix du ciel du jardin : le ciel du jour, puis trois ciels débloqués à 15, 30 et 50 choix
 * légers. Un ciel encore verrouillé dit combien de choix légers il manque. La nuit, le jardin
 * passe de lui-même en Nuit encre : le choix reste, il revient au matin.
 */
export function SkyPicker({
  value,
  lightChoiceCount,
  onChange,
}: {
  value: SkyId;
  lightChoiceCount: number;
  onChange: (id: SkyId) => void;
}) {
  return (
    <fieldset className="bg-blanc flex flex-col gap-3 rounded-[20px] p-4">
      <legend className="sr-only">Ciel du jardin</legend>
      <p
        aria-hidden
        className="text-corps-s text-encre leading-[1.3] font-semibold"
      >
        Ciel du jardin
      </p>
      <div className="grid grid-cols-2 gap-2">
        {SKIES.map((sky) => {
          const locked = lightChoiceCount < sky.unlockAt;
          const missing = sky.unlockAt - lightChoiceCount;
          return (
            <label
              key={sky.id}
              className={`border-encre/15 has-[:checked]:border-encre has-[:focus-visible]:outline-outremer flex items-center gap-2.5 rounded-2xl border p-2.5 has-[:checked]:border-2 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 ${
                locked ? "opacity-60" : "cursor-pointer"
              }`}
            >
              <input
                type="radio"
                name="ciel"
                value={sky.id}
                checked={value === sky.id}
                disabled={locked}
                onChange={() => onChange(sky.id)}
                className="sr-only"
              />
              <span
                aria-hidden
                className="border-encre/20 relative size-9 shrink-0 overflow-hidden rounded-full border"
                style={{ background: sky.colors.ciel }}
              >
                <span
                  className="absolute top-1.5 right-1.5 size-3.5 rounded-full"
                  style={{ background: sky.colors.soleil }}
                />
                <span
                  className="absolute bottom-2 left-1 h-2 w-4 rounded-full"
                  style={{ background: sky.colors.nuage }}
                />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-corps-s text-encre leading-[1.3] font-semibold">
                  {sky.label}
                </span>
                {locked ? (
                  <span className="text-legende text-texte-attenue leading-[1.3]">
                    Encore {plural(missing, "choix léger", "choix légers")}
                  </span>
                ) : null}
              </span>
            </label>
          );
        })}
      </div>
      <p className="text-legende text-texte-attenue leading-[1.4]">
        De {NIGHT_HOURS.start} h à {NIGHT_HOURS.end} h, ton jardin passe en Nuit
        encre ; ton ciel revient au matin.
      </p>
    </fieldset>
  );
}
