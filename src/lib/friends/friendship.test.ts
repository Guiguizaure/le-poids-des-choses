import { describe, expect, it } from "vitest";
import type { AnimalScript } from "@/content/animaux/types";
import {
  converse,
  emptyFriends,
  nextLine,
  parseFriends,
  progress,
  serializeFriends,
  type FriendRecord,
  type TalkContext,
} from "./friendship";

const say = (fr: string) => ({ fr, en: fr });
/** Séquence d'une étape. */
const seq = (fr: string, expr: "content" | "surpris" | "dort" = "content") => [
  { expr, fr, en: fr },
];
const SCRIPT: AnimalScript = {
  name: say("Renard"),
  talk: say("Parler au renard"),
  lines: [
    { id: "r-1", chapter: 1, kind: "recit", steps: seq("présentation") },
    { id: "r-2", chapter: 2, kind: "recit", steps: seq("anecdote") },
    {
      id: "r-3",
      chapter: 2,
      kind: "recit",
      steps: seq("la nuit"),
      condition: { night: true },
    },
    {
      id: "r-4",
      chapter: 3,
      kind: "recit",
      steps: seq("pommier"),
      condition: { planted: "arbre-1", season: "automne" },
    },
    { id: "r-5", chapter: 3, kind: "recit", steps: seq("histoire") },
  ],
  sleep: [seq("zzz 1", "dort"), seq("zzz 2", "dort")],
  again: [seq("encore 1"), seq("encore 2"), seq("encore 3")],
};

const DAY: TalkContext = {
  day: "2026-10-08",
  season: "automne",
  night: false,
  planted: new Set(),
  asleep: false,
};
const fresh = (): FriendRecord => emptyFriends().fox;

/** Une conversation par jour pendant `days` jours, à partir du 8 octobre. */
function talkDaily(days: number, context: Partial<TalkContext> = {}) {
  let record = fresh();
  const replies = [];
  for (let i = 0; i < days; i++) {
    const day = `2026-10-${String(8 + i).padStart(2, "0")}`;
    const result = converse("fox", SCRIPT, record, { ...DAY, ...context, day });
    record = result.record;
    replies.push(result.reply);
  }
  return { record, replies };
}

describe("amitié : une nouvelle réplique par jour", () => {
  it("la première conversation du jour donne la réplique suivante non vue", () => {
    const { reply, record } = converse("fox", SCRIPT, fresh(), DAY);
    expect(reply).toMatchObject({ type: "new", lineId: "r-1" });
    expect(record).toMatchObject({
      seen: ["r-1"],
      day: "2026-10-08",
      talks: 1,
      met: true,
    });
  });

  it("le même jour : « déjà parlé aujourd'hui », les 2-3 répliques tournent, rien n'avance", () => {
    let { record } = converse("fox", SCRIPT, fresh(), DAY);
    const texts = [];
    for (let i = 0; i < 3; i++) {
      const result = converse("fox", SCRIPT, record, DAY);
      expect(result.reply.type).toBe("again");
      expect(result.record.seen).toEqual(["r-1"]);
      texts.push(result.reply.steps[0].fr);
      record = result.record;
    }
    expect(new Set(texts).size).toBe(3);
  });

  it("le lendemain (minuit à Paris) : la suivante ; sans condition vraie, les conditionnelles attendent", () => {
    const { replies, record } = talkDaily(3);
    expect(replies.map((reply) => reply.lineId)).toEqual(["r-1", "r-2", "r-5"]);
    expect(record.seen).toEqual(["r-1", "r-2", "r-5"]);
  });

  it("la présentation d'abord, puis une conditionnelle vraie et pas vue passe en priorité", () => {
    const first = converse("fox", SCRIPT, fresh(), { ...DAY, night: true });
    expect(first.reply.lineId).toBe("r-1");
    const night = converse("fox", SCRIPT, first.record, {
      ...DAY,
      day: "2026-10-09",
      night: true,
    });
    expect(night.reply.lineId).toBe("r-3");
    const planted = nextLine(SCRIPT, ["r-1"], {
      season: "automne",
      night: false,
      planted: new Set(["arbre-1"]),
    });
    expect(planted?.id).toBe("r-4");
    // Une seule condition fausse (pas l'automne) : elle attend.
    expect(
      nextLine(SCRIPT, ["r-1"], {
        season: "hiver",
        night: false,
        planted: new Set(["arbre-1"]),
      })?.id,
    ).toBe("r-2");
  });

  it("tout vu : une anecdote déjà vue (chapitre 2), la même toute la journée", () => {
    let { record } = talkDaily(5, {
      night: true,
      planted: new Set(["arbre-1"]),
    });
    expect(progress(SCRIPT, record)).toEqual({ seen: 5, total: 5 });
    const first = converse("fox", SCRIPT, record, {
      ...DAY,
      day: "2026-10-20",
    });
    expect(first.reply.type).toBe("memory");
    expect(["r-2", "r-3"]).toContain(first.reply.lineId);
    record = first.record;
    expect(
      converse("fox", SCRIPT, record, { ...DAY, day: "2026-10-20" }).reply.type,
    ).toBe("again");
    expect(
      converse(
        "fox",
        SCRIPT,
        { ...first.record, day: null },
        {
          ...DAY,
          day: "2026-10-20",
        },
      ).reply.lineId,
    ).toBe(first.reply.lineId);
  });

  it("endormi : une réplique de sommeil, l'amitié n'avance pas", () => {
    const { record } = converse("fox", SCRIPT, fresh(), DAY);
    const asleep = converse("fox", SCRIPT, record, {
      ...DAY,
      day: "2026-10-09",
      asleep: true,
    });
    expect(asleep.reply.type).toBe("sleep");
    expect(["zzz 1", "zzz 2"]).toContain(asleep.reply.steps[0].fr);
    expect(asleep.record).toEqual(record);
    // Réveillé plus tard le même jour : c'est bien sa première conversation du jour.
    expect(
      converse("fox", SCRIPT, asleep.record, { ...DAY, day: "2026-10-09" })
        .reply.lineId,
    ).toBe("r-2");
  });

  it("aucune pénalité : revenir après un mois reprend où l'on en était", () => {
    const { record } = talkDaily(2);
    const later = converse("fox", SCRIPT, record, {
      ...DAY,
      day: "2026-11-30",
    });
    expect(later.reply.lineId).toBe("r-5");
    expect(later.record.seen).toEqual(["r-1", "r-2", "r-5"]);
  });
});

describe("lpdc:amis:v1", () => {
  it("aller-retour", () => {
    const state = emptyFriends();
    state.bird = { seen: ["oiseau-1"], day: "2026-10-08", talks: 2, met: true };
    expect(parseFriends(serializeFriends(state))).toEqual(state);
  });
  it("lecture tolérante : illisible ou inconnu → aucune amitié, sans erreur", () => {
    expect(parseFriends("{")).toEqual(emptyFriends());
    expect(parseFriends(JSON.stringify({ version: 2 }))).toEqual(
      emptyFriends(),
    );
    expect(
      parseFriends(
        JSON.stringify({
          version: 1,
          animals: {
            fox: { seen: ["a", 3, "a"], day: "hier", talks: -1, met: 1 },
          },
        }),
      ).fox,
    ).toEqual({ seen: ["a"], day: null, talks: 0, met: false });
  });
});
