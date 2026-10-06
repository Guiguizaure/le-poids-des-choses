import type { Metadata } from "next";
import Link from "next/link";
import {
  ContentPage,
  ExternalLink,
  Section,
} from "@/components/ui/ContentPage";
import { DataCredit } from "@/components/ui/DataCredit";
import { PaperCutout } from "@/components/ui/PaperCutout";
import { WATER_DAYS_PER_STEP } from "@/lib/garden/watering";
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

// Papiers découpés : petits à côté des titres sur mobile (masqués sous 360 px de large), dans
// les marges sur grand écran.
const INLINE =
  "-my-2 size-11 max-[359px]:hidden lg:absolute lg:my-0 lg:size-24";
const RIGHT = `${INLINE} lg:-top-3 lg:-right-36`;
const LEFT = `${INLINE} lg:-top-3 lg:-left-36`;

const updatedOn = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "Europe/Paris",
}).format(new Date(generated.downloadedAt));

/** Page 06 · Méthode et sources (maquette), complétée d'après docs/methode.md. */
export default function MethodePage() {
  return (
    <ContentPage
      title="Méthode et sources"
      decoration={<PaperCutout name="oiseau" tilt={-7} className={RIGHT} />}
    >
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

      <Section
        id="hypotheses"
        title="Nos hypothèses"
        decoration={<PaperCutout name="coccinelle" tilt={9} className={LEFT} />}
      >
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

      <Section
        id="jardin"
        title="Et ton jardin ?"
        decoration={
          <PaperCutout
            name="balance"
            tilt={-4}
            className="h-9 w-14 max-[359px]:hidden lg:absolute lg:-top-1 lg:-right-44 lg:h-20 lg:w-32"
          />
        }
      >
        <p>
          Il ne montre que les choix que tu notes ici. Ce n’est pas ton
          empreinte carbone, juste la trace des écarts entre les options que tu
          as comparées.
        </p>
        <p id="ecart" className="scroll-mt-6">
          Le site ne mesure pas des kilos évités ou économisés : il compte
          l’écart entre l’option que tu choisis et l’autre option comparée, sans
          savoir ce que tu aurais fait sans lui. Une habitude notée sans
          comparaison ne compte aucun kg (voir{" "}
          <Link href="#habitudes" className="font-semibold underline">
            comparer ou tenir une habitude
          </Link>
          ).
        </p>
      </Section>

      <Section id="habitudes" title="Comparer ou tenir une habitude">
        <p>
          Comparer deux gestes donne un écart : la différence entre les deux
          options, calculée avec les données Impact CO2. C’est cet écart, et lui
          seul, que ton jardin additionne.
        </p>
        <p>
          Une habitude ne se compare à rien : si tu ne manges jamais de viande,
          comparer ton repas à un plat de viande donnerait un écart qui ne
          correspond à rien de réel. Une habitude tenue ne compte donc aucun kg,
          n’entre ni dans le total ni dans les paliers. Elle arrose ton jardin :
          chaque jour où tu en notes au moins une, les plantes déjà là avancent
          d’un cran tous les {WATER_DAYS_PER_STEP} jours arrosés. C’est une
          règle de jeu, pas une mesure.
        </p>
        <p>
          L’hiver, l’épanouissement des arbres caducs dort : le niveau atteint
          est gardé, mais leurs fleurs et leurs fruits ne réapparaissent qu’au
          printemps.
        </p>
        <p>
          Le jardin suit aussi les saisons de l’hémisphère nord (feuillage,
          ciel, neige) : un simple décor, qui ne change aucun chiffre.
        </p>
      </Section>

      <Section
        id="saison"
        title="Fruits et légumes de saison"
        decoration={
          <PaperCutout
            name="picto-repas-vegetalien"
            tilt={8}
            className={LEFT}
          />
        }
      >
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

      <Section id="raconte" title="« Raconte ta journée »">
        <p>
          Tu écris ta journée ; Claude Haiku 4.5, un modèle d’Anthropic, y
          repère les gestes qui figurent dans le catalogue du site, et rien
          d’autre. Il ne calcule rien et ne donne aucun chiffre : il renvoie
          seulement le nom des gestes, l’extrait qui les justifie et, pour un
          trajet, la distance si tu l’as écrite. Un geste déduit (« un burger »
          pour un repas au bœuf) est marqué « À vérifier » et n’est pas coché.
        </p>
        <p>
          L’option comparée vient d’une table écrite à la main (le TER est
          comparé à la voiture thermique, un repas végétarien à un repas au
          poulet…), que tu peux changer avant l’ajout. Les écarts sont ensuite
          calculés comme partout ailleurs, à partir des données Impact CO2. Rien
          n’entre dans le carnet sans que tu l’aies coché.
        </p>
        <p>
          Chaque analyse fait tourner un modèle d’IA dans un centre de données :
          elle consomme de l’énergie et a donc une empreinte. Nous ne
          l’affichons pas en grammes, faute de source publique qui permette de
          la chiffrer pour une requête. C’est pourquoi l’analyse ne se lance
          qu’à ta demande, sur un texte court, avec une réponse brève.
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
      <div className="flex justify-end pr-2">
        <PaperCutout
          name="escargot"
          tilt={-4}
          className="h-12 w-16 lg:h-16 lg:w-20"
        />
      </div>
    </ContentPage>
  );
}
