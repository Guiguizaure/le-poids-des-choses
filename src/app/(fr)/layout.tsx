import type { Metadata, Viewport } from "next";
import {
  RootDocument,
  rootMetadata,
  ROOT_VIEWPORT,
} from "@/components/layout/RootDocument";
import "../globals.css";

export const metadata: Metadata = rootMetadata("fr");
export const viewport: Viewport = ROOT_VIEWPORT;

/** Pages françaises, à la racine du site. */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return <RootDocument locale="fr">{children}</RootDocument>;
}
