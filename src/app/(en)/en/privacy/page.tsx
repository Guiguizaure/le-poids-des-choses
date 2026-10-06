import type { Metadata } from "next";
import Link from "next/link";
import {
  ContentPage,
  ExternalLink,
  Section,
} from "@/components/ui/ContentPage";
import { localizedPath } from "@/lib/i18n";
import { PAGES } from "@/lib/i18n/messages/common";
import { HOST, PUBLISHER } from "@/lib/legal";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  ...PAGES.en.confidentialite,
  path: "/confidentialite",
  locale: "en",
});

const LINK = "font-semibold underline underline-offset-2";

/** English version of /confidentialite (same section anchors). */
export default function PrivacyPage() {
  return (
    <ContentPage locale="en" title={PAGES.en.confidentialite.title}>
      <Section id="en-bref" title="In short">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Without an account, your journal stays only on your device, in your
            browser: nothing is sent.
          </li>
          <li>
            The account is optional. It’s only there to find your garden on
            another device.
          </li>
          <li>
            “Tell us about your day” is optional: your text is sent to Anthropic
            to spot your actions, then forgotten on our side.
          </li>
          <li>No advertising, no reselling, no profiling, no trackers.</li>
        </ul>
      </Section>

      <Section id="donnees" title="What’s stored with an account">
        <ul className="list-disc space-y-1 pl-5">
          <li>Your email address.</li>
          <li>
            The entries in your journal: the two actions compared, the quantity,
            your choice, the difference in kg CO2e and the date of the choice.
          </li>
          <li>
            Technical dates: when the account was created, when it was last
            used, when each entry was received.
          </li>
          <li>
            While signing in: a fingerprint (hash) of the link sent, not the
            link itself, and a fingerprint of your session.
          </li>
          <li>
            To limit abuse: counters of requests per address and per IP address,
            stored as an encrypted fingerprint (neither the address nor the IP
            in plain text).
          </li>
        </ul>
      </Section>

      <Section id="pourquoi" title="Why">
        <p>
          To sign you in without a password, sync your journal between your
          devices and protect the service from abuse. Your address is only used
          to send you sign-in links: no newsletter, no other messages. This
          processing is based on the service you ask for by creating an account
          and, for protection against abuse, on the legitimate interest of
          keeping the service safe.
        </p>
      </Section>

      <Section id="ou" title="Where">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Cloudflare</strong> ({HOST.name}, {HOST.addressEn}) hosts
            the site, the account and the journal. The database (Cloudflare D1)
            is restricted to the European Union.
          </li>
          <li>
            <strong>Cloudflare Turnstile</strong> checks, on the sign-in form
            and on “Tell us about your day” only, that the request doesn’t come
            from a robot. According to Cloudflare, it uses in particular the IP
            address and characteristics of the browser, only to detect robots (
            <ExternalLink href="https://www.cloudflare.com/turnstile-privacy-policy/">
              Turnstile’s policy
            </ExternalLink>
            ). It’s only loaded when you use one of these forms.
          </li>
          <li>
            <strong>Resend</strong> (Plus Five Five, Inc., United States) sends
            the sign-in email: it receives your address and the message, which
            contains the link (unusable after 15 minutes). Resend keeps this
            data in the United States (
            <ExternalLink href="https://resend.com/legal/privacy-policy">
              Resend’s policy
            </ExternalLink>
            ).
          </li>
        </ul>
      </Section>

      <Section id="raconte" title="“Tell us about your day”">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            When you start the analysis, the text you wrote (280 characters at
            most) is sent to <strong>Anthropic</strong> (Anthropic, PBC, United
            States), so that its Claude model can spot actions from the
            catalogue. Nothing is sent until you press “Read my day”.
          </li>
          <li>
            On our side, the text only passes through: it’s neither stored nor
            written in the server logs. Only counters are kept (number of
            analyses, outcome, number of actions spotted).
          </li>
          <li>
            At Anthropic, according to its official documentation (
            <ExternalLink href="https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data">
              How long do you store my organization’s data?
            </ExternalLink>
            ): “For Anthropic API users, we automatically delete inputs and
            outputs on our backend within 30 days of receipt or generation”,
            unless another agreement has been made, unless Anthropic needs to
            keep them longer to enforce its usage policy, or to comply with the
            law. According to the same page, an exchange flagged by its
            automated systems as breaching that policy is kept for up to 2 years
            (and its classification score for up to 7 years).
          </li>
          <li>
            That’s why the field reminds you: don’t write any personal
            information.
          </li>
          <li>
            To limit abuse and cost: a counter per IP address (encrypted
            fingerprint) and, if you’re signed in, per account, erased after 2
            days at most. This processing is based on the service you ask for by
            starting the analysis.
          </li>
        </ul>
      </Section>

      <Section id="duree" title="For how long">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            The account and the journal: as long as you use them. An account
            with no sign-in or sync for 24 months is deleted, along with
            everything in it. This deletion happens when the service is used
            (one check per day at most): if nobody uses the site for a while, it
            may happen a little after the 24 months.
          </li>
          <li>The sign-in link: 15 minutes, and it only works once.</li>
          <li>The session: 90 days, or until you sign out.</li>
          <li>Anti-abuse counters: 2 days at most.</li>
        </ul>
      </Section>

      <Section id="droits" title="Export, delete, your rights">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Export</strong>: “Export my data” in{" "}
            <Link href={localizedPath("/jardin", "en")} className={LINK}>
              My garden
            </Link>{" "}
            gives you a JSON file (same format as the journal export, with your
            address and the date the account was created).
          </li>
          <li>
            <strong>Delete</strong>: “Delete my account”, in the same place,
            erases your address and your journal from our servers straight away
            and for good. The journal stays on your device.
          </li>
          <li>
            <strong>Sign out</strong>: “Sign out” ends the session on this
            device.
          </li>
          <li>
            For any question or to exercise your rights (access, rectification,
            erasure, portability, objection): {PUBLISHER.email}. You can also
            lodge a complaint with the{" "}
            <ExternalLink href="https://www.cnil.fr">CNIL</ExternalLink>, the
            French data protection authority.
          </li>
        </ul>
      </Section>

      <Section id="cookies" title="Cookies and storage on your device">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Only one cookie, set only if you sign in: the session (
            <code>__Host-lpdc_session</code>, 90 days), needed for the account.
            No other cookies, no trackers.
          </li>
          <li>
            Your browser also keeps, on your device: the journal, the chosen
            sky, “My habits” (never sent to the account), whether you closed the
            language banner and, if you’re signed in, the sync status.
          </li>
          <li>
            Audience measurement uses Cloudflare Web Analytics, without cookies:
            overall visit statistics, with no individual tracking.
          </li>
        </ul>
      </Section>

      <Section id="responsable" title="Data controller">
        <p>
          {PUBLISHER.name}, {PUBLISHER.address} — {PUBLISHER.email}. See also
          the{" "}
          <Link
            href={localizedPath("/mentions-legales", "en")}
            className={LINK}
          >
            legal notice
          </Link>
          .
        </p>
      </Section>
    </ContentPage>
  );
}
