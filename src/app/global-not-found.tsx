import type { Metadata } from "next";
import { FONT_CLASSES } from "@/app/fonts";
import { NotFoundScreen } from "@/components/layout/NotFoundScreen";
import { NOT_FOUND } from "@/lib/i18n/messages/common";
import { SITE_NAME } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  // Next ajoute déjà « noindex » sur la page 404.
  title: `${NOT_FOUND.fr.title} · ${SITE_NAME}`,
};

/**
 * 404 de tout le site (deux mises en page racines : il n'y en a pas une seule pour la porter),
 * en français. Sous /en, Cloudflare Pages sert le 404.html le plus proche : /en/404.
 */
export default function GlobalNotFound() {
  return (
    <html lang="fr" className={FONT_CLASSES}>
      <body className="bg-creme text-encre font-texte flex min-h-screen flex-col antialiased">
        <NotFoundScreen locale="fr" />
      </body>
    </html>
  );
}
