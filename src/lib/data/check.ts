/** Gestes et produits de saison : tout ce qui vient d'une source de données. */
type Checked = {
  id?: string;
  slug?: string;
  fictive?: boolean;
  source?: string;
};

export type CheckResult = { ok: boolean; message: string };

/** Garde-fou de production : en mode strict, toute donnée fictive est une erreur. */
export function checkData(
  items: readonly Checked[],
  strict: boolean,
): CheckResult {
  const fictive = items.filter((g) => g.fictive || g.source === "fictive");
  if (fictive.length === 0) {
    return { ok: true, message: "Données : aucune valeur fictive." };
  }
  const ids = fictive.map((g) => g.id ?? g.slug).join(", ");
  if (strict) {
    return {
      ok: false,
      message: `STRICT_DATA=1 : ${fictive.length} donnée(s) fictive(s) restante(s) : ${ids}`,
    };
  }
  return {
    ok: true,
    message: `Attention : ${fictive.length} donnée(s) fictive(s) (STRICT_DATA non défini, build autorisé).`,
  };
}
