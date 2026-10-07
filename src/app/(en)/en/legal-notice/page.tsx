import type { Metadata } from "next";
import Link from "next/link";
import {
  ContentPage,
  ExternalLink,
  Section,
} from "@/components/ui/ContentPage";
import { localizedPath } from "@/lib/i18n";
import { PAGES } from "@/lib/i18n/messages/common";
import { HOST, isPlaceholder, PUBLISHER } from "@/lib/legal";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  ...PAGES.en.mentions,
  path: "/mentions-legales",
  locale: "en",
});

const LINK = "font-semibold underline underline-offset-2";

/** Publisher value; a placeholder still to fill in stands out. */
function Field({ value }: { value: string }) {
  return isPlaceholder(value) ? (
    <mark className="bg-tomate-douce text-encre rounded px-1 font-semibold">
      {value}
    </mark>
  ) : (
    <>{value}</>
  );
}

/** English version of /mentions-legales (same section anchors); the French version prevails. */
export default function LegalNoticePage() {
  return (
    <ContentPage title={PAGES.en.mentions.title}>
      <p className="text-corps-s text-texte-attenue leading-[1.4]">
        This is a translation provided for convenience. The{" "}
        <Link href="/mentions-legales" className={LINK} hrefLang="fr">
          French version
        </Link>{" "}
        of the legal notice is the authoritative one.
      </p>

      <Section id="editeur" title="Publisher">
        <p>
          <Field value={PUBLISHER.name} />, sole trader (entrepreneur
          individuel)
          <br />
          SIRET: <Field value={PUBLISHER.siret} />
          <br />
          Address: <Field value={PUBLISHER.address} />
          <br />
          Contact: <Field value={PUBLISHER.email} />
        </p>
        <p>
          Publication director: <Field value={PUBLISHER.name} />.
        </p>
      </Section>

      <Section id="hebergeur" title="Host">
        <p>
          {HOST.name}, {HOST.addressEn} (
          <ExternalLink href={HOST.website}>cloudflare.com</ExternalLink>
          ), via Cloudflare Pages.
        </p>
      </Section>

      <Section id="confidentialite" title="Privacy">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Without an account, your journal is stored only on your device, in
            your browser; export and import use a file that stays with you.
          </li>
          <li>
            The account is optional: it’s only there to find your garden on
            another device.
          </li>
          <li>
            Only one cookie, set only if you sign in (the session). No trackers.
          </li>
          <li>
            Audience measurement uses Cloudflare Web Analytics, without cookies:
            overall visit statistics, with no individual tracking.
          </li>
        </ul>
        <p>
          The details (data, retention, export, deletion) are on the{" "}
          <Link href={localizedPath("/confidentialite", "en")} className={LINK}>
            privacy
          </Link>{" "}
          page.
        </p>
      </Section>

      <Section id="donnees" title="Data and illustrations">
        <p>
          The figures come from ADEME’s public data (Impact CO2): see the{" "}
          <Link href={localizedPath("/methode", "en")} className={LINK}>
            method
          </Link>
          . Independent project, not affiliated with ADEME. Illustrations and
          code: Guillaume,{" "}
          <ExternalLink href="https://webjuno.com">webjuno.com</ExternalLink>.
        </p>
      </Section>
    </ContentPage>
  );
}
