import Link from "next/link";
import { PrimaryLink, TextLink } from "@/components/ui/buttons";
import { COMPARE_PATH } from "@/lib/compare/url";
import { HomeScene } from "./HomeScene";
import { SeasonTeaser } from "@/components/saison/SeasonTeaser";

const INTRO =
  "Avant un trajet, un repas ou un achat, pose deux options sur la balance. Ton jardin grandit chaque fois que tu choisis la plus légère.";

/** Accueil : écran 01 sur mobile, 07 sur ordinateur (navigation + héros sur deux colonnes). */
export function HomeScreen() {
  return (
    <div className="bg-creme flex min-h-screen flex-col">
      <header className="hidden items-center justify-between px-20 py-7 lg:flex">
        <Link
          href="/"
          className="font-titre text-titre-m text-encre leading-[1.1]"
        >
          Le poids des choses
        </Link>
        <nav aria-label="Navigation principale">
          <ul className="text-corps-m text-encre flex gap-8 leading-[1.3] font-semibold">
            <li>
              <Link href={COMPARE_PATH}>Comparer</Link>
            </li>
            <li>
              <Link href="/jardin">Mon jardin</Link>
            </li>
            <li>
              <Link href="/methode">Méthode</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-[430px] flex-1 flex-col lg:max-w-none lg:flex-row lg:items-center lg:gap-16 lg:px-20">
        <div className="lg:order-2 lg:w-[44%] lg:max-w-[560px] lg:shrink-0">
          <HomeScene />
        </div>

        <div className="flex flex-col gap-3.5 px-6 pt-5 pb-8 lg:order-1 lg:max-w-[560px] lg:min-w-0 lg:flex-1 lg:gap-6 lg:px-0">
          <p className="text-legende text-texte-attenue leading-[1.3] font-semibold">
            COMPARATEUR CARBONE ILLUSTRÉ
          </p>
          <h1 className="font-titre text-titre-xl text-encre lg:text-display leading-none lg:leading-[0.95] lg:tracking-[-0.88px]">
            Le poids des choses
          </h1>
          <p className="text-corps-l text-encre max-w-[480px] leading-[1.45]">
            {INTRO}
          </p>
          <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:gap-6">
            <PrimaryLink href={COMPARE_PATH} className="lg:w-auto">
              Commencer
            </PrimaryLink>
            <TextLink href="/methode" className="lg:text-corps-m">
              Comment ça marche ?
            </TextLink>
          </div>
          <SeasonTeaser className="mt-2" />
          <p className="text-legende text-texte-attenue text-center lg:text-left">
            Données publiques de l’ADEME · Projet indépendant
          </p>
        </div>
      </main>
    </div>
  );
}
