// Forme canonique d'une entrée de carnet (clés triées, valeurs undefined retirées) : deux
// versions d'une entrée sont identiques si et seulement si leurs formes canoniques le sont.
// Partagée par le navigateur et les fonctions Cloudflare (functions/, server/).

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(record)
        .sort()
        .map((key) => [key, sortKeys(record[key])]),
    );
  }
  return value;
}

export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortKeys(value));
}

export function sameEntry(a: unknown, b: unknown): boolean {
  return canonicalJson(a) === canonicalJson(b);
}
