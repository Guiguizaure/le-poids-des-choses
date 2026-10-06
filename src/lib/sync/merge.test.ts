import { describe, expect, it } from "vitest";
import type { ComparisonEntry } from "@/lib/data/types";
import { canonicalJson, sameEntry } from "./canonical";
import { normalizeEmail } from "./email";
import { addConflicts, mergeRemote } from "./merge";

function entry(
  id: string,
  day: number,
  over: Partial<ComparisonEntry> = {},
): ComparisonEntry {
  return {
    id,
    date: `2026-10-${String(day).padStart(2, "0")}T10:00:00.000Z`,
    gestureA: "tgv",
    gestureB: "avion",
    quantity: 50,
    chosen: "a",
    avoidedKg: 12.5,
    ...over,
  };
}

describe("canonicalJson / sameEntry", () => {
  it("ignore l'ordre des clés et les valeurs undefined", () => {
    const a = entry("x", 1);
    const b = Object.fromEntries(Object.entries(a).reverse());
    expect(canonicalJson(a)).toBe(canonicalJson(b));
    expect(sameEntry(a, { ...a, modeA: undefined })).toBe(true);
  });

  it("distingue une valeur différente", () => {
    expect(sameEntry(entry("x", 1), entry("x", 1, { avoidedKg: 12.6 }))).toBe(
      false,
    );
  });
});

describe("mergeRemote", () => {
  it("deux carnets vides donnent un carnet vide", () => {
    expect(mergeRemote([], [])).toEqual({
      entries: [],
      added: [],
      conflicts: [],
    });
  });

  it("carnet local vide : tout le compte est ajouté, trié", () => {
    const remote = [entry("b", 3), entry("a", 1)];
    const result = mergeRemote([], remote);
    expect(result.entries.map((e) => e.id)).toEqual(["a", "b"]);
    expect(result.added).toHaveLength(2);
    expect(result.conflicts).toEqual([]);
  });

  it("compte vide : le carnet local reste tel quel", () => {
    const local = [entry("a", 1), entry("b", 2)];
    const result = mergeRemote(local, []);
    expect(result.entries).toEqual(local);
    expect(result.added).toEqual([]);
  });

  it("doublons identiques (même id, même contenu) : ignorés", () => {
    const local = [entry("a", 1)];
    const remote = [entry("a", 1), { ...entry("a", 1) }];
    const result = mergeRemote(local, remote);
    expect(result.entries).toEqual(local);
    expect(result.added).toEqual([]);
    expect(result.conflicts).toEqual([]);
  });

  it("doublon dans les entrées reçues seulement : ajouté une fois", () => {
    const result = mergeRemote([], [entry("a", 1), entry("a", 1)]);
    expect(result.entries).toHaveLength(1);
    expect(result.added).toHaveLength(1);
  });

  it("conflit : la version locale reste, l'autre est gardée à part et signalée", () => {
    const mine = entry("a", 1);
    const theirs = entry("a", 1, { avoidedKg: 99 });
    const result = mergeRemote([mine], [theirs]);
    expect(result.entries).toEqual([mine]);
    expect(result.added).toEqual([]);
    expect(result.conflicts).toEqual([{ id: "a", kept: mine, other: theirs }]);
  });

  it("conflit entre deux versions inconnues : la première reçue est gardée", () => {
    const first = entry("a", 1);
    const second = entry("a", 1, { chosen: "b", avoidedKg: 0 });
    const result = mergeRemote([], [first, second]);
    expect(result.entries).toEqual([first]);
    expect(result.conflicts).toEqual([{ id: "a", kept: first, other: second }]);
  });

  it("un même conflit reçu deux fois n'est signalé qu'une fois", () => {
    const theirs = entry("a", 1, { avoidedKg: 99 });
    const result = mergeRemote([entry("a", 1)], [theirs, { ...theirs }]);
    expect(result.conflicts).toHaveLength(1);
  });

  it("n'écrase ni ne retire jamais une entrée locale", () => {
    const local = [entry("a", 1), entry("b", 2), entry("c", 3)];
    const remote = [entry("b", 2, { quantity: 1 }), entry("d", 4)];
    const result = mergeRemote(local, remote);
    for (const mine of local) expect(result.entries).toContainEqual(mine);
    expect(result.entries).toHaveLength(4);
  });

  it("l'ordre d'arrivée ne change pas le carnet obtenu (sans conflit)", () => {
    const remote = [entry("c", 3), entry("a", 1), entry("b", 2)];
    const forward = mergeRemote([entry("z", 9)], remote).entries;
    const backward = mergeRemote(
      [entry("z", 9)],
      [...remote].reverse(),
    ).entries;
    expect(forward).toEqual(backward);
    expect(forward.map((e) => e.id)).toEqual(["a", "b", "c", "z"]);
  });

  it("deux appareils qui se synchronisent finissent avec le même carnet", () => {
    const deviceA = [entry("a", 1), entry("c", 3)];
    const deviceB = [entry("b", 2)];
    const server = [...deviceA, ...deviceB];
    expect(mergeRemote(deviceA, server).entries).toEqual(
      mergeRemote(deviceB, server).entries,
    );
  });
});

describe("addConflicts", () => {
  it("ajoute sans doublon", () => {
    const conflict = {
      id: "a",
      kept: entry("a", 1),
      other: entry("a", 1, { avoidedKg: 2 }),
    };
    const other = { ...conflict, other: entry("a", 1, { avoidedKg: 3 }) };
    expect(addConflicts([conflict], [conflict, other])).toEqual([
      conflict,
      other,
    ]);
  });
});

describe("normalizeEmail", () => {
  it("normalise et valide", () => {
    expect(normalizeEmail("  Camille@Exemple.FR ")).toBe("camille@exemple.fr");
    expect(normalizeEmail("a.b+c@sous.domaine.fr")).toBe(
      "a.b+c@sous.domaine.fr",
    );
  });

  it("refuse ce qui n'est pas une adresse", () => {
    for (const value of [
      "",
      "camille",
      "camille@",
      "camille@exemple",
      "@exemple.fr",
      "ca mille@exemple.fr",
      "camille@exemple.fr\nBcc: x@y.fr",
      `${"a".repeat(250)}@exemple.fr`,
      42,
      null,
    ])
      expect(normalizeEmail(value)).toBeNull();
  });
});
