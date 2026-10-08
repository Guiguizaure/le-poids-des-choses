// « Les animaux parlent » : le contenu de chaque animal (répliques FR/EN, sommeil, « déjà
// parlé aujourd'hui »). Format : ./types.ts ; vérifications : ./check.ts (build et tests).
import { COCCINELLE } from "./coccinelle";
import { ESCARGOT } from "./escargot";
import { OISEAU } from "./oiseau";
import { PAPILLON } from "./papillon";
import { RENARD } from "./renard";
import type { AnimalScript, TalkerId } from "./types";

export * from "./types";

export const ANIMAL_SCRIPTS: Record<TalkerId, AnimalScript> = {
  butterfly: PAPILLON,
  ladybug: COCCINELLE,
  bird: OISEAU,
  snail: ESCARGOT,
  fox: RENARD,
};
