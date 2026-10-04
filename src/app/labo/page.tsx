import type { Metadata } from "next";
import { Illustration } from "@/components/illustrations/Illustration";
import { LaboControls } from "@/components/labo/LaboControls";
import { ILLUSTRATION_NAMES } from "@/lib/illustrations/specs";

// Page de démonstration des illustrations et animations : non liée, jamais indexée.
export const metadata: Metadata = {
  title: "Labo — Le poids des choses",
  description: "Banc d'essai des illustrations et des animations.",
  robots: { index: false, follow: false },
};

export default function LaboPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="font-titre text-titre-xl">Labo</h1>
        <p className="text-corps-l text-texte-attenue">
          Banc d&apos;essai des illustrations et des animations. Cette page
          n&apos;est pas liée dans le site.
        </p>
      </header>

      <LaboControls />

      <section className="flex flex-col gap-4">
        <h2 className="font-titre text-titre-l">
          Toutes les illustrations ({ILLUSTRATION_NAMES.length})
        </h2>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4">
          {ILLUSTRATION_NAMES.map((name) => (
            <li
              key={name}
              className="bg-blanc flex flex-col items-center justify-between gap-2 rounded-2xl p-3"
            >
              <Illustration name={name} className="h-auto max-h-28 w-full" />
              <code className="text-legende text-texte-attenue">{name}</code>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
