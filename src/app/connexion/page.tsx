import type { Metadata } from "next";
import { ConnexionScreen } from "@/components/account/ConnexionScreen";
import { pageMetadata } from "@/lib/site";

// Ouverte depuis le lien reçu par e-mail : jamais indexée, absente du sitemap.
export const metadata: Metadata = {
  ...pageMetadata({
    title: "Connexion",
    description:
      "Connexion à ton compte : retrouve ton jardin sur cet appareil.",
    path: "/connexion",
  }),
  robots: { index: false, follow: false },
};

export default function ConnexionPage() {
  return <ConnexionScreen />;
}
