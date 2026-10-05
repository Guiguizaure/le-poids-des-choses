import Link from "next/link";
import { InstallFooterItem } from "@/components/install/InstallButton";

/**
 * Pied de page commun : Méthode, Mentions légales, Confidentialité, auteur, et « Installer
 * l’appli » quand le navigateur le permet.
 */
export function SiteFooter() {
  return (
    <footer className="border-encre/10 mx-auto mt-auto w-full max-w-[1280px] border-t px-5 py-6 lg:px-20">
      <nav aria-label="Pied de page">
        <ul className="text-legende text-texte-attenue flex flex-wrap items-center gap-x-5 gap-y-2">
          <li>
            <Link
              href="/methode"
              className="text-encre font-semibold underline-offset-2 hover:underline"
            >
              Méthode
            </Link>
          </li>
          <li>
            <Link
              href="/mentions-legales"
              className="text-encre font-semibold underline-offset-2 hover:underline"
            >
              Mentions légales
            </Link>
          </li>
          <li>
            <Link
              href="/confidentialite"
              className="text-encre font-semibold underline-offset-2 hover:underline"
            >
              Confidentialité
            </Link>
          </li>
          <li>
            Un projet de Guillaume ·{" "}
            <a
              href="https://webjuno.com"
              className="text-encre font-semibold underline-offset-2 hover:underline"
            >
              webjuno.com
            </a>
          </li>
          <InstallFooterItem />
        </ul>
      </nav>
    </footer>
  );
}
