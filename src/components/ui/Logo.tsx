"use client";

import { NAV } from "@/lib/i18n/messages/common";
import { LocalLink as Link, useMessages } from "@/lib/i18n/LocaleProvider";

/**
 * Nom du site, lien vers l'accueil de la langue (/ ou /en) : « Le poids des choses – Accueil »
 * pour les lecteurs d'écran (le texte visible d'abord, WCAG 2.5.3). En haut à gauche du duel,
 * des résultats, de Mon jardin, des pages de texte et de /saison. Composant client (textes de
 * la langue), utilisable depuis une page serveur. Cible tactile de 28 px de haut (au moins 24 px,
 * WCAG 2.5.8), sans décaler l'en-tête.
 */
export function Logo({
  children = "Le poids des choses",
}: {
  children?: string;
}) {
  const nav = useMessages(NAV);
  return (
    <Link
      href="/"
      aria-label={`${children} – ${nav.home}`}
      className="font-titre text-encre focus-visible:outline-outremer -my-1 inline-flex min-h-7 items-center rounded-sm py-1 text-[17px] leading-[1.2] focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {children}
    </Link>
  );
}
