import { describe, expect, it } from "vitest";
import { hasGarden, RETURNING_SCRIPT } from "./returning";

/** Lance le script en ligne sur un faux document, avec ce carnet stocké. */
function run(raw: string | null, throws = false) {
  const attributes = new Map<string, string>();
  const localStorage = {
    getItem: (key: string) => {
      if (throws) throw new Error("stockage indisponible");
      return key === "lpdc:journal:v1" ? raw : null;
    },
  };
  const document = {
    documentElement: {
      setAttribute: (name: string, value: string) =>
        attributes.set(name, value),
    },
  };
  new Function("localStorage", "document", RETURNING_SCRIPT)(
    localStorage,
    document,
  );
  return attributes.has("data-garden");
}

const journal = (entries: unknown[]) => JSON.stringify({ version: 1, entries });

describe("accueil : quelqu'un qui revient", () => {
  it("un carnet avec au moins une entrée : data-garden", () => {
    expect(run(journal([{ id: "a" }]))).toBe(true);
    expect(hasGarden(journal([{ id: "a" }]))).toBe(true);
  });
  it("rien, carnet vide, illisible ou stockage indisponible : la version de départ", () => {
    for (const raw of [null, journal([]), "{", '{"entries":3}']) {
      expect(run(raw)).toBe(false);
      expect(hasGarden(raw)).toBe(false);
    }
    expect(run(journal([{ id: "a" }]), true)).toBe(false);
  });
});
