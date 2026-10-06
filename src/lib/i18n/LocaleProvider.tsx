"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  type ComponentProps,
  type ReactNode,
} from "react";
import {
  localizeHref,
  pick,
  type Dictionary,
  type Locale,
  type Shape,
} from "./index";

const LocaleContext = createContext<Locale>("fr");

/** Langue de la page, posée par la mise en page racine de chaque langue. */
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** Textes d'un dictionnaire dans la langue de la page. */
export function useMessages<T>(dictionary: Dictionary<T>): Shape<T> {
  return pick(dictionary, useLocale());
}

/** Traduit un lien interne vers la langue de la page (« /jardin » → « /en/garden »). */
export function useLocalizeHref(): (href: string) => string {
  const locale = useLocale();
  return useCallback((href: string) => localizeHref(href, locale), [locale]);
}

/** next/link dont l'adresse interne suit la langue de la page. */
export function LocalLink({ href, ...props }: ComponentProps<typeof Link>) {
  const locale = useLocale();
  return (
    <Link
      href={typeof href === "string" ? localizeHref(href, locale) : href}
      {...props}
    />
  );
}
