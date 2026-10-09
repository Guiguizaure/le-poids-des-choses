import { describe, expect, it } from "vitest";
import { normalizeSeen, parseSeen, seasonHintId, serializeSeen } from "./hints";

describe("indices de première utilisation", () => {
  it("garde les indices connus, dans l'ordre, puis les saisons vues", () => {
    expect(
      normalizeSeen([
        "saison-hiver-2027",
        "premier-arrosage",
        "inconnu",
        "saisons-especes",
        "saison-automne-2026",
        "saison-automne-2026",
        "saison-ete",
        42,
      ]),
    ).toEqual([
      "saisons-especes",
      "premier-arrosage",
      "saison-automne-2026",
      "saison-hiver-2027",
    ]);
  });
  it("une astuce par saison : l'automne 2026 n'empêche pas l'automne 2027", () => {
    const seen = parseSeen(serializeSeen([seasonHintId("automne", 2026)]));
    expect(seen).toContain("saison-automne-2026");
    expect(seen).not.toContain(seasonHintId("automne", 2027));
  });
  it("format inconnu : rien de vu", () => {
    expect(parseSeen("{")).toEqual([]);
    expect(parseSeen(JSON.stringify({ version: 2, seen: [] }))).toEqual([]);
  });
});
