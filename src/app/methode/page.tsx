import type { Metadata } from "next";
import Link from "next/link";
import {
  ContentPage,
  ExternalLink,
  Section,
} from "@/components/ui/ContentPage";
import { DataCredit } from "@/components/ui/DataCredit";
import generated from "@/lib/data/gestures.generated.json";
import {
  SAISON_BASE,
  SAISON_DOWNLOADED_AT,
  SAISON_TOOL_URL,
} from "@/lib/saison";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Méthode et sources",
  description:
    "D’où viennent les chiffres (Impact CO2, ADEME), nos hypothèses, ce qui n’est pas compté et les limites.",
  path: "/methode",
});

/**
 * Conditions de réutilisation des données Impact CO2 : autorisation donnée par l'équipe
 * Impact CO2 de l'ADEME par e-mail le 5 octobre 2026. Affichée dans la section « D'où
 * viennent les chiffres ? » (null : rien n'est affiché).
 */
const DATA_LICENSE: { text: string; url?: string } | null = {
  text: "Réutilisation des données autorisée par l’équipe Impact CO2 de l’ADEME (e-mail du 5 octobre 2026), gratuitement, avec la mention « Données : Impact CO2 – ADEME ».",
};

const REPOSITORY = "https://github.com/Guiguizaure/le-poids-des-choses";
const IMPACT_CO2 = "https://impactco2.fr";

const updatedOn = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "Europe/Paris",
}).format(new Date(generated.downloadedAt));

/** Page 06 · Méthode et sources (maquette), complétée d'après docs/methode.md. */
export default function MethodePage() {
  return (
    <ContentPage title="Méthode et sources">
      <p className="text-legende text-texte-attenue leading-[1.3] font-semibold">
        Données mises à jour le {updatedOn}
      </p>

      <Section id="sources" title="D’où viennent les chiffres ?">
        <p>
          Des données publiques de l’ADEME, publiées par{" "}
          <ExternalLink href={IMPACT_CO2}>Impact CO2</ExternalLink>, qui
          s’appuie sur la Base Carbone et la base Agribalyse. Le site lit le{" "}
          <ExternalLink href={generated.source}>
            fichier public des équivalents
          </ExternalLink>{" "}
          d’Impact CO2 ; chaque geste y renvoie à sa page sur impactco2.fr, où
          sa valeur est détaillée.
        </p>
        <DataCredit />
        {DATA_LICENSE ? (
          <p className="text-corps-s text-texte-attenue">
            {DATA_LICENSE.url ? (
              <ExternalLink href={DATA_LICENSE.url}>
                {DATA_LICENSE.text}
              </ExternalLink>
            ) : (
              DATA_LICENSE.text
            )}
          </p>
        ) : null}
      </Section>

      <Section id="unites" title="Ce qu’ils comptent">
        <p>
          Chaque valeur est une moyenne en kilos d’équivalent CO2 (kg CO2e), qui
          additionne les gaz à effet de serre selon leur effet sur le climat. On
          compare toujours deux gestes de même unité :
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Se déplacer : par kilomètre et par personne, sur la distance que tu
            choisis ;
          </li>
          <li>Manger : par repas ;</li>
          <li>Boire : par litre ;</li>
          <li>
            S’habiller et Numérique : par objet, pour la fabrication d’un objet
            neuf ;
          </li>
          <li>Se faire livrer : par achat, pour un colis d’1 kg.</li>
        </ul>
      </Section>

      <Section id="hypotheses" title="Nos hypothèses">
        <p id="occasion" className="scroll-mt-6">
          <strong>L’occasion.</strong> Acheter un objet déjà fabriqué ne
          provoque pas de nouvelle fabrication : on compte 0 kg pour la
          fabrication. C’est une hypothèse, pas une mesure. Garder le tien
          compte aussi 0 kg.
        </p>
        <p>
          <strong>Le colis.</strong> Si l’objet d’occasion est livré, on ajoute
          l’envoi d’un colis à domicile, selon Impact CO2 : 1 kg pour un
          vêtement ou un smartphone, 2 kg pour des chaussures ou un ordinateur
          portable, 15 kg pour une télévision.
        </p>
        <p>
          <strong>Les trajets des achats.</strong> Pour « Se faire livrer », les
          valeurs d’Impact CO2 comprennent le trajet jusqu’au colis : 3,5 km en
          voiture pour le point relais, 15 km en voiture pour le magasin, aucun
          trajet motorisé à pied.
        </p>
      </Section>

      <Section id="non-compte" title="Ce qui n’est pas compté">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            le trajet pour aller acheter d’occasion (friperie, brocante, remise
            en main propre) ;
          </li>
          <li>
            l’entretien, le lavage, la réparation ou la remise en état d’un
            objet ;
          </li>
          <li>la fin de vie (revente, don, déchet) ;</li>
          <li>
            l’usage des appareils (l’électricité d’une télévision, par exemple).
          </li>
        </ul>
      </Section>

      <Section id="limites" title="Leurs limites">
        <p>
          Ce sont des moyennes. Ton trajet, ton repas ou ton vêtement peuvent
          peser plus ou moins selon les détails.
        </p>
        <p>
          Compter zéro fabrication pour l’occasion lui est favorable : d’autres
          méthodes répartissent l’empreinte de fabrication entre les vies
          successives d’un objet.
        </p>
      </Section>

      <Section id="jardin" title="Et ton jardin ?">
        <p>
          Il ne montre que les choix que tu notes ici. Ce n’est pas ton
          empreinte carbone, juste la trace des écarts entre les options que tu
          as comparées.
        </p>
        <p id="ecart" className="scroll-mt-6">
          Le site ne mesure pas des kilos évités ou économisés : il compte
          l’écart entre l’option que tu choisis et l’autre option comparée, sans
          savoir ce que tu aurais fait sans lui.
        </p>
      </Section>

      <Section id="saison" title="Fruits et légumes de saison">
        <p>
          La page{" "}
          <Link
            href="/saison"
            className="font-semibold underline underline-offset-2"
          >
            De saison
          </Link>{" "}
          reprend l’outil{" "}
          <ExternalLink href={SAISON_TOOL_URL}>
            Fruits et légumes de saison
          </ExternalLink>{" "}
          d’Impact CO2 : pour chaque produit, ses mois de saison et son impact
          en kg de CO2e par kilo, classés du plus léger au plus lourd, avec les
          catégories de l’outil.
        </p>
        <p>
          La donnée ne précise pas l’origine des produits, sauf pour la mangue,
          où elle distingue l’import par avion et l’import par bateau. Le site
          ne compare donc pas les provenances d’un même produit.
        </p>
        <DataCredit
          downloadedAt={SAISON_DOWNLOADED_AT}
          href={SAISON_TOOL_URL}
          base={SAISON_BASE}
        />
      </Section>

      <Section id="savais-tu" title="« Le savais-tu ? »">
        <p>
          Ces petits faits sont calculés à partir des mêmes données Impact CO2
          que les comparaisons, jamais écrits à la main : si une valeur change,
          la phrase suit. Ils sont arrondis pour rester lisibles et renvoient à
          la fiche du geste d’origine.
        </p>
      </Section>

      <Section id="fabrication" title="Comment ce site est fait">
        <p>
          Conçu, illustré et développé par Guillaume (
          <ExternalLink href="https://webjuno.com">webjuno.com</ExternalLink>).
          Le code a été écrit avec l’aide de Claude Code, l’assistant de
          programmation d’Anthropic. Il est ouvert : le{" "}
          <ExternalLink href={REPOSITORY}>dépôt GitHub</ExternalLink> est
          public.
        </p>
      </Section>

      <aside className="bg-blanc text-corps-s flex flex-col gap-1.5 rounded-[20px] p-[18px]">
        <p className="text-encre leading-[1.3] font-semibold">
          Projet indépendant
        </p>
        <p className="text-texte-attenue leading-[1.4]">
          Non affilié à l’ADEME. Conçu, dessiné et développé par Guillaume,
          webjuno.com.
        </p>
      </aside>
    </ContentPage>
  );
}
