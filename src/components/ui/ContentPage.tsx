import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./buttons";

/** Page de texte (Méthode, Mentions légales) : barre « Retour », titre, sections. */
export function ContentPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-col">
      <div className="flex items-center px-5 pt-[22px] pb-2">
        <Link
          href="/"
          className="text-corps-s text-encre flex items-center gap-1 leading-[1.3] font-semibold"
        >
          <Icon name="retour" />
          Retour
        </Link>
      </div>
      <div className="flex flex-col gap-5 px-6 pt-3 pb-9">
        <h1 className="font-titre text-titre-l text-encre leading-[1.1]">
          {title}
        </h1>
        {children}
      </div>
    </main>
  );
}

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titre`}
      className="text-corps-m text-encre flex scroll-mt-6 flex-col gap-1.5 leading-[1.4]"
    >
      <h2 id={`${id}-titre`} className="font-titre text-titre-m leading-[1.1]">
        {title}
      </h2>
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
