import type { Metadata } from "next";
import { NotFoundScreen } from "@/components/layout/NotFoundScreen";
import { NOT_FOUND } from "@/lib/i18n/messages/common";
import { SITE_NAME } from "@/lib/site";

// Exportée en out/en/404.html : Cloudflare Pages la sert pour toute adresse inconnue sous /en.
export const metadata: Metadata = {
  title: `${NOT_FOUND.en.title} · ${SITE_NAME}`,
  robots: { index: false, follow: false },
};

export default function NotFoundEn() {
  return <NotFoundScreen locale="en" />;
}
