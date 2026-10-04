import { missingMilestoneGestures } from "./index";

/** Garde-fou du build (toujours bloquant) : chaque équivalence de palier trouve son geste. */
export function checkMilestones(
  missing: readonly string[] = missingMilestoneGestures(),
): { ok: boolean; message: string } {
  if (missing.length === 0)
    return { ok: true, message: "Paliers : toutes les équivalences existent." };
  return {
    ok: false,
    message: `Paliers : équivalence(s) sur un geste disparu, à corriger dans src/lib/milestones/index.ts (${missing.join(", ")}).`,
  };
}
