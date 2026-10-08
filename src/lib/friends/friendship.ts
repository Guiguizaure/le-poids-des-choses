// « Les animaux parlent » : l'amitié avec chaque animal, sur l'appareil seulement
// (lpdc:amis:v1, pas de synchro du compte pour l'instant). Règles pures et déterministes :
// - la première conversation du jour (minuit, heure de Paris) donne la réplique suivante non
//   vue ; la présentation d'abord, puis une réplique conditionnelle (saison, nuit, espèce
//   plantée) passe avant les autres quand sa condition est vraie ; une condition fausse la
//   garde pour plus tard ;
// - ensuite, le même jour : une réplique « déjà parlé aujourd'hui » ;
// - tout vu : une anecdote déjà vue, la même toute la journée ;
// - endormi : une réplique de sommeil, sans rien faire avancer ;
// - aucune pénalité si l'on ne revient pas : rien ne se perd jamais.
import type {
  AnimalScript,
  Line,
  LineCondition,
  Sequence,
  TalkerId,
} from "@/content/animaux/types";
import { TALKERS } from "@/content/animaux/types";
import { pickIndex } from "@/lib/garden/hash";
import type { Season } from "@/lib/garden/seasons";

export const FRIENDS_KEY = "lpdc:amis:v1";

export type FriendRecord = {
  /** Répliques vues, dans l'ordre de découverte (ids). */
  seen: string[];
  /** Jour (Paris, AAAA-MM-JJ) de la dernière conversation éveillée. */
  day: string | null;
  /** Conversations éveillées ce jour-là. */
  talks: number;
  /** Rencontré : vu dans le jardin au moins une fois. */
  met: boolean;
};

export type FriendsState = Record<TalkerId, FriendRecord>;

const EMPTY: FriendRecord = { seen: [], day: null, talks: 0, met: false };

export function emptyFriends(): FriendsState {
  const record = (): FriendRecord => ({ ...EMPTY, seen: [] });
  return {
    butterfly: record(),
    ladybug: record(),
    bird: record(),
    snail: record(),
    fox: record(),
  };
}

export function serializeFriends(state: FriendsState): string {
  return JSON.stringify({ version: 1, animals: state });
}

const isDay = (value: unknown): value is string =>
  typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);

/** Lecture tolérante : format inconnu ou illisible → aucune amitié (rien ne casse). */
export function parseFriends(text: string | null): FriendsState {
  const state = emptyFriends();
  if (!text) return state;
  try {
    const value = JSON.parse(text) as { version?: unknown; animals?: unknown };
    if (value?.version !== 1 || typeof value.animals !== "object") return state;
    const animals = value.animals as Record<string, Partial<FriendRecord>>;
    for (const talker of TALKERS) {
      const record = animals?.[talker];
      if (!record || typeof record !== "object") continue;
      state[talker] = {
        seen: Array.isArray(record.seen)
          ? [...new Set(record.seen.filter((id) => typeof id === "string"))]
          : [],
        day: isDay(record.day) ? record.day : null,
        talks:
          typeof record.talks === "number" && record.talks >= 0
            ? Math.floor(record.talks)
            : 0,
        met: record.met === true,
      };
    }
  } catch {
    // Illisible : on repart de zéro.
  }
  return state;
}

/** Le moment de la conversation. */
export type TalkContext = {
  /** Jour à Paris (AAAA-MM-JJ). */
  day: string;
  season: Season | null;
  night: boolean;
  /** Espèces plantées dans le jardin (ids de species.ts). */
  planted: ReadonlySet<string>;
  /** Dessiné endormi en ce moment. */
  asleep: boolean;
};

export type ReplyType = "new" | "again" | "memory" | "sleep";

/** Une réplique à dire : sa séquence d'étapes (l'amitié avance d'une réplique, pas d'une étape). */
export type Reply = {
  type: ReplyType;
  steps: Sequence;
  /** Réplique du contenu (nouvelle ou souvenir). */
  lineId?: string;
};

export function conditionHolds(
  condition: LineCondition | undefined,
  context: Pick<TalkContext, "season" | "night" | "planted">,
): boolean {
  if (!condition) return true;
  if (condition.season && condition.season !== context.season) return false;
  if (condition.night !== undefined && condition.night !== context.night)
    return false;
  if (condition.planted && !context.planted.has(condition.planted))
    return false;
  return true;
}

/**
 * Prochaine réplique à découvrir : la présentation (chapitre 1) d'abord ; ensuite une
 * conditionnelle vraie et pas vue passe en priorité ; sinon la suivante sans condition.
 */
export function nextLine(
  script: AnimalScript,
  seen: readonly string[],
  context: Pick<TalkContext, "season" | "night" | "planted">,
): Line | undefined {
  const unseen = script.lines.filter((line) => !seen.includes(line.id));
  const presentation = unseen.find(
    (line) => line.chapter === 1 && conditionHolds(line.condition, context),
  );
  if (presentation) return presentation;
  return (
    unseen.find(
      (line) => line.condition && conditionHolds(line.condition, context),
    ) ?? unseen.find((line) => !line.condition)
  );
}

/** Une conversation : la réplique et l'amitié qui en résulte (inchangée en dormant). */
export function converse(
  talker: TalkerId,
  script: AnimalScript,
  record: FriendRecord,
  context: TalkContext,
): { reply: Reply; record: FriendRecord } {
  const met = { ...record, met: true };
  if (context.asleep) {
    const index = pickIndex(
      `${talker}:${context.day}:sommeil`,
      script.sleep.length,
    );
    return {
      reply: { type: "sleep", steps: script.sleep[index] },
      record: met,
    };
  }
  if (record.day === context.day) {
    // Déjà parlé aujourd'hui : les répliques tournent, à partir d'un départ tiré du jour.
    const start = pickIndex(
      `${talker}:${context.day}:encore`,
      script.again.length,
    );
    const index = (start + record.talks - 1) % script.again.length;
    return {
      reply: { type: "again", steps: script.again[index] },
      record: { ...met, talks: record.talks + 1 },
    };
  }
  const today = { ...met, day: context.day, talks: 1 };
  const line = nextLine(script, record.seen, context);
  if (line)
    return {
      reply: { type: "new", steps: line.steps, lineId: line.id },
      record: { ...today, seen: [...record.seen, line.id] },
    };
  // Tout est vu (ou seulement des répliques dont la condition est fausse) : une anecdote déjà
  // vue, la même toute la journée.
  const seenLines = script.lines.filter((l) => record.seen.includes(l.id));
  const anecdotes = seenLines.filter((l) => l.chapter === 2);
  const pool = anecdotes.length > 0 ? anecdotes : seenLines;
  if (pool.length === 0)
    return {
      reply: { type: "again", steps: script.again[0] },
      record: today,
    };
  const memory =
    pool[pickIndex(`${talker}:${context.day}:souvenir`, pool.length)];
  return {
    reply: { type: "memory", steps: memory.steps, lineId: memory.id },
    record: today,
  };
}

/** Progression : répliques vues (qui existent encore) sur le total. */
export function progress(
  script: AnimalScript,
  record: FriendRecord,
): { seen: number; total: number } {
  const ids = new Set(script.lines.map((line) => line.id));
  return {
    seen: record.seen.filter((id) => ids.has(id)).length,
    total: script.lines.length,
  };
}
