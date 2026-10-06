import { InstallFooterItem } from "@/components/install/InstallButton";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { localizeHref, pick, type Locale } from "@/lib/i18n";
import { FOOTER } from "@/lib/i18n/messages/common";
import Link from "next/link";

const LINK = "text-encre font-semibold underline-offset-2 hover:underline";

/**
 * Pied de page commun : Méthode, Mentions légales, Confidentialité, auteur, « Installer
 * l’appli » quand le navigateur le permet, et l'autre langue.
 */
export function SiteFooter({ locale }: { locale: Locale }) {
  const t = pick(FOOTER, locale);
  const href = (path: string) => localizeHref(path, locale);
  return (
    <footer className="border-encre/10 mx-auto mt-auto w-full max-w-[1280px] border-t px-5 py-6 lg:px-20">
      <nav aria-label={t.label}>
        <ul className="text-legende text-texte-attenue flex flex-wrap items-center gap-x-5 gap-y-2">
          <li>
            <Link href={href("/methode")} className={LINK}>
              {t.method}
            </Link>
          </li>
          <li>
            <Link href={href("/mentions-legales")} className={LINK}>
              {t.legal}
            </Link>
          </li>
          <li>
            <Link href={href("/confidentialite")} className={LINK}>
              {t.privacy}
            </Link>
          </li>
          <li>
            {t.byline}{" "}
            <a href="https://webjuno.com" className={LINK}>
              webjuno.com
            </a>
          </li>
          <InstallFooterItem />
          <li>
            <LanguageSwitch />
          </li>
        </ul>
      </nav>
    </footer>
  );
}
