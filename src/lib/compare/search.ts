// Recherche dans le catalogue (Comparer) : noms des gestes en français et en anglais, sans tenir
// compte des accents, des majuscules ni de la ponctuation (« velo » trouve « Vélo »).
import { gestureDetail, gestureLabel, getGestures } from "@/lib/data";
import type { Gesture } from "@/lib/data/types";

/** Texte comparable : sans accents, en minuscules, ponctuation et espaces réduits à une espace. */
export function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/œ/gi, "oe")
    .replace(/æ/gi, "ae")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** Noms d'un geste, dans les deux langues (nom et précision), mis à plat pour la recherche. */
function haystack(gesture: Gesture): string {
  return normalizeSearch(
    [
      gestureLabel(gesture.id, "fr"),
      gestureDetail(gesture.id, "fr") ?? "",
      gestureLabel(gesture.id, "en"),
      gestureDetail(gesture.id, "en") ?? "",
    ].join(" "),
  );
}

/**
 * Gestes dont les noms contiennent chaque mot de la requête (dans n'importe quel ordre) ; ceux
 * dont un nom commence par la requête d'abord, puis l'ordre du catalogue. Requête vide : rien.
 */
export function searchGestures(
  query: string,
  gestures: readonly Gesture[] = getGestures(),
): Gesture[] {
  const words = normalizeSearch(query).split(" ").filter(Boolean);
  if (words.length === 0) return [];
  const whole = words.join(" ");
  const found = gestures.filter((gesture) => {
    const text = haystack(gesture);
    return words.every((word) => text.includes(word));
  });
  const startsWithQuery = (gesture: Gesture) =>
    [gestureLabel(gesture.id, "fr"), gestureLabel(gesture.id, "en")].some(
      (name) => normalizeSearch(name).startsWith(whole),
    );
  return [
    ...found.filter(startsWithQuery),
    ...found.filter((gesture) => !startsWithQuery(gesture)),
  ];
}
