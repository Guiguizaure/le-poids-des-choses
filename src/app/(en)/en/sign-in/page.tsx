import type { Metadata } from "next";
import { ConnexionScreen } from "@/components/account/ConnexionScreen";
import { PAGES } from "@/lib/i18n/messages/common";
import { pageMetadata } from "@/lib/site";

// Opened from the link received by email: never indexed, not in the sitemap.
export const metadata: Metadata = {
  ...pageMetadata({ ...PAGES.en.connexion, path: "/connexion", locale: "en" }),
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return <ConnexionScreen />;
}
