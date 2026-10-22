import type { NextConfig } from "next";
import { pageExtensions, RACONTE_ENABLED } from "./src/lib/raconte/enabled";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  experimental: { globalNotFound: true },
  // « Raconte ta journée » en veille : ses pages (page.raconte.tsx) ne sont pas générées.
  pageExtensions: pageExtensions(RACONTE_ENABLED),
};

export default nextConfig;
