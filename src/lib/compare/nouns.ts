// Noms des gestes dans les phrases (article, genre), pour accorder « plus léger / plus légère ».
// Les tables sont dans src/lib/i18n/messages/nouns.ts (français et anglais).
import { gestureLabel } from "@/lib/data";
import type { Locale } from "@/lib/i18n/routes";
import {
  GESTURE_NOUNS,
  OBJECT_NOUNS,
  type Noun,
  type ObjectNoun,
} from "@/lib/i18n/messages/nouns";

export type { Noun, ObjectNoun };

export function gestureNoun(id: string, locale: Locale = "fr"): Noun {
  const known = GESTURE_NOUNS[locale][id];
  if (known) return known;
  const label = gestureLabel(id, locale);
  const lower = `${label.charAt(0).toLowerCase()}${label.slice(1)}`;
  return {
    text: locale === "en" ? `the ${lower}` : `le ${lower}`,
    feminine: false,
  };
}

/** « le train » → « Le train » */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** « que » + nom ; les noms portent leur article (« que l’avion »), pas d'élision. */
export function thanNoun(noun: Noun, locale: Locale = "fr"): string {
  return locale === "en" ? `than ${noun.text}` : `que ${noun.text}`;
}

// ---- Objets ---------------------------------------------------------------------------------

export function objectNoun(id: string, locale: Locale = "fr"): ObjectNoun {
  const known = OBJECT_NOUNS[locale][id];
  if (known) return known;
  const label = gestureLabel(id, locale);
  return locale === "en"
    ? {
        indefinite: label,
        newOne: `a new ${label.toLowerCase()}`,
        bare: label.toLowerCase(),
        feminine: false,
        plural: false,
      }
    : {
        indefinite: label,
        newOne: `de ${label.toLowerCase()}`,
        bare: label.toLowerCase(),
        feminine: false,
        plural: false,
      };
}

/**
 * « le tien », « la tienne », « les tiennes » (toi) ; « le mien »… (moi). En anglais :
 * « yours », « mine ».
 */
export function possessive(
  noun: ObjectNoun,
  person: "toi" | "moi",
  locale: Locale = "fr",
): string {
  if (locale === "en") return person === "toi" ? "yours" : "mine";
  const stem = person === "toi" ? "tien" : "mien";
  if (noun.plural) return `les ${stem}${noun.feminine ? "nes" : "s"}`;
  return noun.feminine ? `la ${stem}ne` : `le ${stem}`;
}
