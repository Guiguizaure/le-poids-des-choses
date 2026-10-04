/** Empreinte 32 bits (FNV-1a) d'une chaîne : même id = même valeur, sur tous les appareils. */
export function hashString(value: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Choix déterministe d'un index dans [0, count[ à partir d'une clé. */
export function pickIndex(key: string, count: number): number {
  if (count <= 0) return 0;
  return hashString(key) % count;
}
