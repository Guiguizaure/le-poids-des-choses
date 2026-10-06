import type { Metadata, Viewport } from "next";
import {
  RootDocument,
  rootMetadata,
  ROOT_VIEWPORT,
} from "@/components/layout/RootDocument";
import "../../globals.css";

export const metadata: Metadata = rootMetadata("en");
export const viewport: Viewport = ROOT_VIEWPORT;

/** Pages anglaises, sous /en (table des adresses : src/lib/i18n/routes.ts). */
export default function RootLayout({ children }: LayoutProps<"/en">) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
