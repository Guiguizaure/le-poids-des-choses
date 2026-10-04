import type { Metadata } from "next";
import Link from "next/link";
import {
  ContentPage,
  ExternalLink,
  Section,
} from "@/components/ui/ContentPage";
import { HOST, isPlaceholder, PUBLISHER } from "@/lib/legal";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Mentions légales",
  description:
    "Éditeur, hébergeur et confidentialité : ton carnet reste sur ton appareil.",
  path: "/mentions-legales",
});

/** Valeur de l'éditeur ; un emplacement à remplir ressort nettement. */
function Field({ value }: { value: string }) {
  return isPlaceholder(value) ? (
    <mark className="bg-tomate-douce text-encre rounded px-1 font-semibold">
      {value}
    </mark>
  ) : (
    <>{value}</>
  );
}

export default function MentionsLegalesPage() {
  return (
    <ContentPage title="Mentions légales">
      <Section id="editeur" title="Éditeur">
        <p>
          <Field value={PUBLISHER.name} />, entrepreneur individuel
          <br />
          SIRET : <Field value={PUBLISHER.siret} />
          <br />
          Adresse : <Field value={PUBLISHER.address} />
          <br />
          Contact : <Field value={PUBLISHER.email} />
        </p>
        <p>
          Directeur de la publication : <Field value={PUBLISHER.name} />.
        </p>
      </Section>

      <Section id="hebergeur" title="Hébergeur">
        <p>
          {HOST.name}, {HOST.address} (
          <ExternalLink href={HOST.website}>cloudflare.com</ExternalLink>
          ), via Cloudflare Pages.
        </p>
      </Section>

      <Section id="confidentialite" title="Confidentialité">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Ton carnet est stocké uniquement sur ton appareil, dans ton
            navigateur. Il n’est envoyé nulle part ; l’export et l’import se
            font avec un fichier qui reste chez toi.
          </li>
          <li>Aucun compte, aucune inscription.</li>
          <li>Aucun cookie.</li>
          <li>
            La mesure d’audience utilise Cloudflare Web Analytics, sans cookie :
            des statistiques de visite globales, sans suivi individuel.
          </li>
        </ul>
      </Section>

      <Section id="donnees" title="Données et illustrations">
        <p>
          Les chiffres viennent des données publiques de l’ADEME (Impact CO2) :
          voir la{" "}
          <Link
            href="/methode"
            className="font-semibold underline underline-offset-2"
          >
            méthode
          </Link>
          . Projet indépendant, non affilié à l’ADEME. Illustrations et code :
          Guillaume,{" "}
          <ExternalLink href="https://webjuno.com">webjuno.com</ExternalLink>.
        </p>
      </Section>
    </ContentPage>
  );
}
