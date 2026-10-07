import { AccountLink } from "@/components/account/AccountLink";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import type { ReactNode } from "react";
import { Logo } from "./Logo";

/**
 * Page de texte (Méthode, Mentions légales) : nom du site vers l'accueil, titre, sections.
 * `decoration` : papier découpé posé à côté du titre (voir PaperCutout).
 */
export function ContentPage({
  title,
  decoration,
  children,
}: {
  title: string;
  decoration?: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="animate-enter mx-auto flex w-full max-w-[640px] flex-col motion-reduce:animate-none">
      <div className="flex items-center justify-between gap-3 px-5 pt-[22px] pb-2">
        <Logo />
        <div className="text-corps-s flex items-center gap-4">
          <LanguageSwitch className="font-normal" />
          <AccountLink />
        </div>
      </div>
      <div className="flex flex-col gap-5 px-6 pt-3 pb-9">
        <div className="relative flex items-start justify-between gap-3">
          <h1 className="font-titre text-titre-l text-encre leading-[1.1]">
            {title}
          </h1>
          {decoration}
        </div>
        {children}
      </div>
    </main>
  );
}

export function Section({
  id,
  title,
  decoration,
  children,
}: {
  id: string;
  title: string;
  /** Papier découpé à côté du titre ; dans la marge sur grand écran. */
  decoration?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titre`}
      className="text-corps-m text-encre relative flex scroll-mt-6 flex-col gap-1.5 leading-[1.4]"
    >
      {decoration ? (
        <div className="flex items-start justify-between gap-3">
          <h2
            id={`${id}-titre`}
            className="font-titre text-titre-m leading-[1.1]"
          >
            {title}
          </h2>
          {decoration}
        </div>
      ) : (
        <h2
          id={`${id}-titre`}
          className="font-titre text-titre-m leading-[1.1]"
        >
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

export function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a href={href} className="font-semibold underline underline-offset-2">
      {children}
    </a>
  );
}
