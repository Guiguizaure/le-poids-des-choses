import type { Metadata } from "next";
import Link from "next/link";
import {
  ContentPage,
  ExternalLink,
  Section,
} from "@/components/ui/ContentPage";
import { HOST, PUBLISHER } from "@/lib/legal";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Confidentialité",
  description:
    "Sans compte, ton carnet reste sur ton appareil. Avec un compte facultatif : quelles données, pourquoi, où, combien de temps, et comment les exporter ou les supprimer.",
  path: "/confidentialite",
});

const LINK = "font-semibold underline underline-offset-2";

export default function ConfidentialitePage() {
  return (
    <ContentPage title="Confidentialité">
      <Section id="en-bref" title="En bref">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Sans compte, ton carnet reste uniquement sur ton appareil, dans ton
            navigateur : rien n’est envoyé.
          </li>
          <li>
            Le compte est facultatif. Il sert seulement à retrouver ton jardin
            sur un autre appareil.
          </li>
          <li>
            Pas de publicité, pas de revente, pas de profilage, pas de traceur.
          </li>
        </ul>
      </Section>

      <Section id="donnees" title="Ce qui est enregistré avec un compte">
        <ul className="list-disc space-y-1 pl-5">
          <li>Ton adresse e-mail.</li>
          <li>
            Les entrées de ton carnet : les deux gestes comparés, la quantité,
            ton choix, l’écart en kg CO2e et la date du choix.
          </li>
          <li>
            Des dates techniques : création du compte, dernière utilisation,
            réception de chaque entrée.
          </li>
          <li>
            Pendant la connexion : une empreinte du lien envoyé (pas le lien
            lui-même) et une empreinte de ta session.
          </li>
          <li>
            Pour limiter les abus : des compteurs de demandes par adresse et par
            adresse IP, enregistrés sous forme d’empreinte chiffrée (ni
            l’adresse ni l’IP en clair).
          </li>
        </ul>
      </Section>

      <Section id="pourquoi" title="Pourquoi">
        <p>
          Pour te connecter sans mot de passe, synchroniser ton carnet entre tes
          appareils et protéger le service contre les abus. Ton adresse ne sert
          qu’à t’envoyer les liens de connexion : aucune lettre d’information,
          aucun autre message. Ces traitements reposent sur le service que tu
          demandes en créant un compte et, pour la protection contre les abus,
          sur l’intérêt légitime à garder le service sûr.
        </p>
      </Section>

      <Section id="ou" title="Où">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Cloudflare</strong> ({HOST.name}, {HOST.address}) héberge le
            site, le compte et le carnet. La base de données (Cloudflare D1) est
            limitée à l’Union européenne.
          </li>
          <li>
            <strong>Cloudflare Turnstile</strong> vérifie, sur le formulaire de
            connexion seulement, que la demande ne vient pas d’un robot. Selon
            Cloudflare, il utilise notamment l’adresse IP et des
            caractéristiques du navigateur, uniquement pour détecter les robots
            (
            <ExternalLink href="https://www.cloudflare.com/turnstile-privacy-policy/">
              politique de Turnstile
            </ExternalLink>
            ). Il n’est chargé que lorsque tu utilises ce formulaire.
          </li>
          <li>
            <strong>Resend</strong> (Plus Five Five, Inc., États-Unis) envoie
            l’e-mail de connexion : il reçoit ton adresse et le message, qui
            contient le lien (inutilisable après 15 minutes). Resend conserve
            ces données aux États-Unis (
            <ExternalLink href="https://resend.com/legal/privacy-policy">
              politique de Resend
            </ExternalLink>
            ).
          </li>
        </ul>
      </Section>

      <Section id="duree" title="Combien de temps">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Le compte et le carnet : tant que tu t’en sers. Un compte sans
            connexion ni synchronisation depuis 24 mois est supprimé, avec tout
            ce qu’il contient. Cette suppression est faite au moment où le
            service est utilisé (une vérification par jour au plus) : si
            personne n’utilise le site pendant un temps, elle peut arriver un
            peu après les 24 mois.
          </li>
          <li>Le lien de connexion : 15 minutes, et il ne sert qu’une fois.</li>
          <li>La session : 90 jours, ou jusqu’à ta déconnexion.</li>
          <li>Les compteurs anti-abus : 2 jours au plus.</li>
        </ul>
      </Section>

      <Section id="droits" title="Exporter, supprimer, tes droits">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Exporter</strong> : « Exporter mes données » dans{" "}
            <Link href="/jardin" className={LINK}>
              Mon jardin
            </Link>{" "}
            donne un fichier JSON (même format que l’export du carnet, avec ton
            adresse et la date de création du compte).
          </li>
          <li>
            <strong>Supprimer</strong> : « Supprimer mon compte », au même
            endroit, efface tout de suite et pour de bon ton adresse et ton
            carnet de nos serveurs. Le carnet reste sur ton appareil.
          </li>
          <li>
            <strong>Te déconnecter</strong> : « Me déconnecter » met fin à la
            session sur cet appareil.
          </li>
          <li>
            Pour toute question ou pour exercer tes droits (accès,
            rectification, effacement, portabilité, opposition) :{" "}
            {PUBLISHER.email}. Tu peux aussi adresser une réclamation à la{" "}
            <ExternalLink href="https://www.cnil.fr">CNIL</ExternalLink>.
          </li>
        </ul>
      </Section>

      <Section id="cookies" title="Cookies et stockage sur ton appareil">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Un seul cookie, posé seulement si tu te connectes : la session (
            <code>__Host-lpdc_session</code>, 90 jours), indispensable au
            compte. Aucun autre cookie, aucun traceur.
          </li>
          <li>
            Ton navigateur garde aussi, sur ton appareil : le carnet, le ciel
            choisi et, si tu es connecté, l’état de la synchronisation.
          </li>
          <li>
            La mesure d’audience utilise Cloudflare Web Analytics, sans cookie :
            des statistiques de visite globales, sans suivi individuel.
          </li>
        </ul>
      </Section>

      <Section id="responsable" title="Responsable">
        <p>
          {PUBLISHER.name}, {PUBLISHER.address} — {PUBLISHER.email}. Voir aussi
          les{" "}
          <Link href="/mentions-legales" className={LINK}>
            mentions légales
          </Link>
          .
        </p>
      </Section>
    </ContentPage>
  );
}
