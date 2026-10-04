import type { Metadata } from "next";
import { Illustration } from "@/components/illustrations/Illustration";
import { Bird } from "@/components/scene/Bird";
import { Landscape } from "@/components/scene/Landscape";
import { PrimaryLink } from "@/components/ui/buttons";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  // Next ajoute déjà « noindex » sur la page 404.
  title: `Page introuvable · ${SITE_NAME}`,
};

/** 404 : le jardin dans la brume, l'oiseau endormi au sol. */
export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-[430px] flex-col">
      <div
        className="relative aspect-[390/300] w-full overflow-hidden"
        aria-hidden
      >
        <Landscape className="absolute inset-0" still />
        <div className="pointer-events-none absolute inset-x-0 top-[42%]">
          <Illustration name="brume" className="block h-auto w-full" />
        </div>
        {/* L'oiseau devant la brume, pour qu'on le voie dormir. */}
        <div className="absolute bottom-[23%] left-[78%] w-[9%]">
          <Bird asleep className="w-full" />
        </div>
      </div>
      <div className="flex flex-col gap-3.5 px-6 pt-6 pb-9">
        <p className="text-legende text-texte-attenue leading-[1.3] font-semibold">
          ERREUR 404
        </p>
        <h1 className="font-titre text-titre-l text-encre leading-[1.1]">
          Cette page s’est perdue dans la brume
        </h1>
        <p className="text-corps-m text-encre leading-[1.4]">
          Même l’oiseau s’est endormi en la cherchant. Ton jardin, lui, t’attend
          toujours.
        </p>
        <PrimaryLink href="/">Revenir à l’accueil</PrimaryLink>
      </div>
    </main>
  );
}
