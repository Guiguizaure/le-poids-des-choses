"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { switchLocaleHref } from "@/lib/i18n";
import {
  dismissLanguageBanner,
  isLanguageBannerDismissed,
  shouldOfferEnglish,
} from "@/lib/i18n/language-banner";
import { LANGUAGE_BANNER } from "@/lib/i18n/messages/common";

/**
 * Pages françaises : si le navigateur est en anglais, un petit bandeau propose la version
 * anglaise de la même page, une fois (fermable, mémorisé). Posé en bas de l'écran, au-dessus
 * du contenu : il ne décale rien en arrivant. La barre « Comparer » s'empile au-dessus. Écrit en anglais, pour qui lit l'anglais.
 */
export function LanguageBanner() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const bannerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const languages = navigator.languages?.length
      ? navigator.languages
      : [navigator.language];
    if (shouldOfferEnglish(languages, isLanguageBannerDismissed()))
      // eslint-disable-next-line react-hooks/set-state-in-effect -- langue du navigateur et stockage lisibles seulement après l'hydratation
      setOpen(true);
  }, []);

  // Place occupée en bas de l'écran (hauteur + décalage du bas), pour la barre « Comparer »
  // qui s'empile au-dessus (`--language-banner-space`).
  useEffect(() => {
    const banner = bannerRef.current;
    if (!open || !banner) return;
    const root = document.documentElement;
    const publish = () => {
      const offset = parseFloat(getComputedStyle(banner).bottom) || 0;
      root.style.setProperty(
        "--language-banner-space",
        `${Math.ceil(banner.getBoundingClientRect().height + offset)}px`,
      );
    };
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(banner);
    window.addEventListener("resize", publish);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", publish);
      root.style.removeProperty("--language-banner-space");
    };
  }, [open]);

  if (!open) return null;

  const close = () => {
    dismissLanguageBanner();
    setOpen(false);
  };

  return (
    <aside
      ref={bannerRef}
      lang="en"
      aria-label="Language"
      data-language-banner
      className="bg-encre text-creme text-corps-s fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-[430px] items-center gap-3 rounded-t-2xl px-4 py-3 leading-[1.35] shadow-[0_-6px_20px_rgba(31,26,23,0.18)] lg:bottom-4 lg:max-w-[520px] lg:rounded-2xl"
    >
      <p className="min-w-0 flex-1">
        {LANGUAGE_BANNER.text}{" "}
        <a
          href={switchLocaleHref(pathname, "", "", "en")}
          hrefLang="en"
          onClick={(event) => {
            event.preventDefault();
            dismissLanguageBanner();
            window.location.assign(
              switchLocaleHref(
                pathname,
                window.location.search,
                window.location.hash,
                "en",
              ),
            );
          }}
          className="focus-visible:outline-soleil font-semibold whitespace-nowrap underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          {LANGUAGE_BANNER.action}
        </a>
      </p>
      <button
        type="button"
        onClick={close}
        aria-label={LANGUAGE_BANNER.close}
        className="focus-visible:outline-soleil flex size-8 shrink-0 items-center justify-center rounded-full text-[20px] leading-none focus-visible:outline-2"
      >
        <span aria-hidden>×</span>
      </button>
    </aside>
  );
}
