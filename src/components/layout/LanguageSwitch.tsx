"use client";

import { usePathname } from "next/navigation";
import { switchLocaleHref } from "@/lib/i18n";
import { dismissLanguageBanner } from "@/lib/i18n/language-banner";
import { useLocale, useMessages } from "@/lib/i18n/LocaleProvider";
import { LANGUAGE } from "@/lib/i18n/messages/common";

/**
 * Sélecteur de langue discret (en-têtes, pied de page) : la même page dans l'autre langue,
 * avec ses paramètres et son ancre (un duel en cours reste le même duel). Les deux langues ont
 * chacune leur document : le changement recharge la page.
 */
export function LanguageSwitch({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useMessages(LANGUAGE);
  const pathname = usePathname() ?? "/";
  const to = locale === "fr" ? "en" : "fr";

  return (
    <a
      href={switchLocaleHref(pathname, "", "", to)}
      hrefLang={to}
      lang={t.otherLang}
      data-language-switch
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;
        event.preventDefault();
        dismissLanguageBanner();
        window.location.assign(
          switchLocaleHref(
            pathname,
            window.location.search,
            window.location.hash,
            to,
          ),
        );
      }}
      className={`text-encre focus-visible:outline-outremer rounded-sm font-semibold underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 ${className}`}
    >
      {t.other}
    </a>
  );
}
