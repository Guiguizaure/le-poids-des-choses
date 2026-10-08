"use client";

import Image from "next/image";
import { NAV } from "@/lib/i18n/messages/common";
import { LocalLink as Link, useMessages } from "@/lib/i18n/LocaleProvider";

/** Emblème affiché par l'en-tête (px) : sous 48 px, la version simplifiée aux traits épais. */
const EMBLEM_SIZE = 28;

export function emblemSrc(size: number): string {
  return size < 48 ? "/icons/embleme-petit.svg" : "/icons/embleme.svg";
}

/**
 * Nom du site, lien vers l'accueil de la langue (/ ou /en) : « Le poids des choses – Accueil »
 * pour les lecteurs d'écran (le texte visible d'abord, WCAG 2.5.3). En haut à gauche du duel,
 * des résultats, de Mon jardin, des pages de texte et de /saison. Composant client (textes de
 * la langue), utilisable depuis une page serveur. L'emblème « Horizon-balance », à gauche du
 * nom, est décoratif. Cible tactile de 28 px de haut (au moins 24 px, WCAG 2.5.8) ; l'emblème
 * déborde dans la marge intérieure du lien, il n'agrandit pas un en-tête d'une ligne.
 */
export function Logo({
  children = "Le poids des choses",
}: {
  children?: string;
}) {
  const nav = useMessages(NAV);
  // Sur un écran étroit, le nom passe sur deux lignes, coupé au milieu comme le logo empilé
  // (« Le poids / des choses »), jamais « Le poids des / choses ».
  const words = children.split(" ");
  const half = Math.ceil(words.length / 2);
  return (
    <Link
      href="/"
      aria-label={`${children} – ${nav.home}`}
      className="font-titre text-encre focus-visible:outline-outremer -my-1 inline-flex min-h-7 items-center gap-2 rounded-sm py-1 text-[17px] leading-[1.2] focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <Image
        src={emblemSrc(EMBLEM_SIZE)}
        alt=""
        aria-hidden
        width={EMBLEM_SIZE}
        height={EMBLEM_SIZE}
        className="-my-1 block shrink-0"
        unoptimized
      />
      <span>
        <span className="whitespace-nowrap">
          {words.slice(0, half).join(" ")}
        </span>{" "}
        <span className="whitespace-nowrap">{words.slice(half).join(" ")}</span>
      </span>
    </Link>
  );
}
