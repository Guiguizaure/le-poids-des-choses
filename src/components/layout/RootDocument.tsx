import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { FONT_CLASSES } from "@/app/fonts";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { LanguageBanner } from "@/components/layout/LanguageBanner";
import type { Locale } from "@/lib/i18n";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { SITE } from "@/lib/i18n/messages/common";
import {
  isLaunched,
  pageMetadata,
  robotsMeta,
  SITE_NAME,
  siteUrl,
} from "@/lib/site";

/** Métadonnées communes d'une langue (mise en page racine). */
export function rootMetadata(locale: Locale): Metadata {
  return {
    ...pageMetadata({ path: "/", locale }),
    metadataBase: new URL(siteUrl()),
    applicationName: SITE_NAME,
    // noindex tant que SITE_LAUNCHED=1 n'est pas défini au build.
    robots: robotsMeta(isLaunched()),
    manifest:
      locale === "en" ? "/en/manifest.webmanifest" : "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icons/icon.svg", type: "image/svg+xml" },
      ],
      apple: "/icons/apple-touch-icon.png",
    },
    appleWebApp: {
      capable: true,
      title: SITE[locale].shortName,
      statusBarStyle: "default",
    },
  };
}

export const ROOT_VIEWPORT: Viewport = { themeColor: "#FFF3DC" };

/**
 * Document d'une langue : <html lang>, polices, langue des composants clients, pied de page.
 * Sur les pages françaises, le bandeau qui propose la version anglaise aux navigateurs en
 * anglais (jamais de redirection).
 */
export function RootDocument({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <html lang={locale} className={FONT_CLASSES}>
      <body className="bg-creme text-encre font-texte flex min-h-screen flex-col antialiased">
        <LocaleProvider locale={locale}>
          {children}
          <SiteFooter locale={locale} />
          {locale === "fr" ? <LanguageBanner /> : null}
        </LocaleProvider>
      </body>
    </html>
  );
}
