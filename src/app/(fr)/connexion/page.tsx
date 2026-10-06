import type { Metadata } from "next";
import { ConnexionScreen } from "@/components/account/ConnexionScreen";
import { PAGES } from "@/lib/i18n/messages/common";
import { pageMetadata } from "@/lib/site";

// Ouverte depuis le lien reçu par e-mail : jamais indexée, absente du sitemap.
export const metadata: Metadata = {
  ...pageMetadata({ ...PAGES.fr.connexion, path: "/connexion" }),
  robots: { index: false, follow: false },
};

export default function ConnexionPage() {
  return <ConnexionScreen />;
}
