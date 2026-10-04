import { Illustration } from "@/components/illustrations/Illustration";
import { Scale } from "@/components/scene/Scale";
import type { IllustrationName } from "@/lib/illustrations/specs";

/** Scène du duel : le paysage et la balance, un picto sur chaque plateau. */
export function DuelScene({
  tilt,
  left,
  right,
  title,
}: {
  tilt: number;
  left: IllustrationName;
  right: IllustrationName;
  title: string;
}) {
  return (
    <div className="bg-creme relative aspect-[390/280] w-full overflow-hidden">
      <Illustration
        name="scene-paysage"
        className="absolute bottom-0 left-0 block h-auto w-full"
      />
      <div className="absolute bottom-[7%] left-1/2 w-[72%] -translate-x-1/2">
        <Scale
          tilt={tilt}
          leftItem={left}
          rightItem={right}
          title={title}
          className="w-full"
        />
      </div>
    </div>
  );
}
