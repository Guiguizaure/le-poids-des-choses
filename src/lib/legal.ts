// Mentions légales : éditeur du site. Les emplacements entre crochets sont À REMPLIR avant le
// lancement ; `STRICT_DATA=1 pnpm build` échoue tant qu'il en reste (scripts/check-data.ts).

export const PUBLISHER = {
  name: "[NOM]",
  siret: "[SIRET]",
  address: "[ADRESSE]",
  email: "[EMAIL]",
} as const;

/** Hébergeur (vérifié sur cloudflare.com : conditions d'utilisation, politique de confidentialité). */
export const HOST = {
  name: "Cloudflare, Inc.",
  address: "101 Townsend St, San Francisco, CA 94107, États-Unis",
  website: "https://www.cloudflare.com",
} as const;

const PLACEHOLDER = /\[[A-ZÉÈÀ_ ]+\]/;

export function isPlaceholder(value: string): boolean {
  return PLACEHOLDER.test(value);
}

/** Champs encore à remplir (ex. ["name", "email"]). */
export function missingLegalFields(
  publisher: Record<string, string> = PUBLISHER,
): string[] {
  return Object.entries(publisher)
    .filter(([, value]) => isPlaceholder(value))
    .map(([key]) => key);
}

const FIELD_LABELS: Record<string, string> = {
  name: "nom",
  siret: "SIRET",
  address: "adresse",
  email: "e-mail",
};

/** Garde-fou de lancement : en mode strict, un emplacement non rempli est une erreur. */
export function checkLegal(
  missing: readonly string[],
  strict: boolean,
): { ok: boolean; message: string } {
  if (missing.length === 0)
    return { ok: true, message: "Mentions légales : complètes." };
  const fields = missing
    .map((field) => FIELD_LABELS[field] ?? field)
    .join(", ");
  if (strict) {
    return {
      ok: false,
      message: `STRICT_DATA=1 : mentions légales à remplir dans src/lib/legal.ts (${fields}).`,
    };
  }
  return {
    ok: true,
    message: `Attention : mentions légales à remplir (${fields}) ; STRICT_DATA non défini, build autorisé.`,
  };
}
