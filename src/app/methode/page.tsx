import type { Metadata } from "next";
import Link from "next/link";
import { IconLink } from "@/components/ui/buttons";

export const metadata: Metadata = {
  title: "Méthode — Le poids des choses",
  description: "D’où viennent les chiffres et comment le jardin compte.",
};

// Page PROVISOIRE : la page « Méthode » complète viendra au lot pages.
export default function MethodePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col gap-4 px-5 pt-[22px] pb-10">
      <IconLink href="/" label="Retour à l’accueil" icon="retour" />
      <h1 className="font-titre text-titre-l text-encre leading-[1.1]">
        Méthode
      </h1>
      <p className="text-corps-m text-encre leading-[1.4]">
        Les chiffres viennent des données publiques Impact CO2 de l’ADEME, en
        kilos de CO2e par kilomètre, par repas, par litre, par achat ou par
        objet. Le poids des choses est un projet indépendant, non affilié à
        l’ADEME.
      </p>
      <p className="text-corps-m text-encre leading-[1.4]">
        Pour un objet d’occasion, on compte zéro nouvelle fabrication, plus
        l’envoi d’un colis s’il est livré. Le trajet jusqu’à la boutique,
        l’entretien et la réparation ne sont pas comptés.
      </p>
      <p className="text-corps-s text-texte-attenue">
        Cette page sera bientôt complétée.
      </p>
      <Link
        href="/comparer"
        className="text-corps-s text-encre font-semibold underline"
      >
        Comparer deux gestes
      </Link>
    </main>
  );
}
