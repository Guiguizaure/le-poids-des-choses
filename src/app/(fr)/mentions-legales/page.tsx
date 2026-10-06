import type { Metadata } from "next";
import Link from "next/link";
import {
  ContentPage,
  ExternalLink,
  Section,
} from "@/components/ui/ContentPage";
import { HOST, isPlaceholder, PUBLISHER } from "@/lib/legal";
import { PAGES } from "@/lib/i18n/messages/common";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  ...PAGES.fr.mentions,
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
            Sans compte, ton carnet est stocké uniquement sur ton appareil, dans
            ton navigateur ; l’export et l’import se font avec un fichier qui
            reste chez toi.
          </li>
          <li>
            Le compte est facultatif : il sert seulement à retrouver ton jardin
            sur un autre appareil.
          </li>
          <li>
            Un seul cookie, posé seulement si tu te connectes (la session).
            Aucun traceur.
          </li>
          <li>
            La mesure d’audience utilise Cloudflare Web Analytics, sans cookie :
            des statistiques de visite globales, sans suivi individuel.
          </li>
        </ul>
        <p>
          Le détail (données, durées, export, suppression) est sur la page{" "}
          <Link
            href="/confidentialite"
            className="font-semibold underline underline-offset-2"
          >
            confidentialité
          </Link>
          .
        </p>
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
