import { AccountLink } from "@/components/account/AccountLink";
import { LanguageSwitch } from "@/components/layout/LanguageSwitch";
import { PrimaryLink, TextLink } from "@/components/ui/buttons";
import { COMPARE_PATH } from "@/lib/compare/url";
import { pick, type Locale } from "@/lib/i18n";
import { HOME, NAV } from "@/lib/i18n/messages/common";
import { LocalLink as Link } from "@/lib/i18n/LocaleProvider";
import { HomeScene } from "./HomeScene";
import { SeasonTeaser } from "@/components/saison/SeasonTeaser";

/** Accueil : écran 01 sur mobile, 07 sur ordinateur (navigation + héros sur deux colonnes). */
export function HomeScreen({ locale }: { locale: Locale }) {
  const t = pick(HOME, locale);
  const nav = pick(NAV, locale);
  return (
    <div className="bg-creme flex min-h-screen flex-col">
      <header className="hidden items-center justify-between px-20 py-7 lg:flex">
        <Link
          href="/"
          className="font-titre text-titre-m text-encre leading-[1.1]"
        >
          Le poids des choses
        </Link>
        <nav aria-label={nav.label}>
          <ul className="text-corps-m text-encre flex gap-8 leading-[1.3] font-semibold">
            <li>
              <Link href={COMPARE_PATH}>{nav.compare}</Link>
            </li>
            <li>
              <Link href="/jardin">{nav.garden}</Link>
            </li>
            <li>
              <Link href="/methode">{nav.method}</Link>
            </li>
            <li>
              <AccountLink large />
            </li>
            <li>
              <LanguageSwitch className="font-normal" />
            </li>
          </ul>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-[430px] flex-1 flex-col lg:max-w-none lg:flex-row lg:items-center lg:gap-16 lg:px-20">
        <div className="relative lg:order-2 lg:w-[44%] lg:max-w-[560px] lg:shrink-0">
          {/* En-tête mobile : liens discrets posés sur le ciel de la scène. */}
          <div className="text-corps-s absolute top-4 right-6 z-10 flex items-center gap-4 lg:hidden">
            <LanguageSwitch className="font-normal" />
            <AccountLink />
          </div>
          <HomeScene />
        </div>

        <div className="flex flex-col gap-3.5 px-6 pt-5 pb-8 lg:order-1 lg:max-w-[560px] lg:min-w-0 lg:flex-1 lg:gap-6 lg:px-0">
          <p className="text-legende text-texte-attenue leading-[1.3] font-semibold">
            {t.eyebrow}
          </p>
          <div className="flex flex-col gap-1.5">
            <h1 className="font-titre text-titre-xl text-encre lg:text-display leading-none lg:leading-[0.95] lg:tracking-[-0.88px]">
              Le poids des choses
            </h1>
            {t.subtitle ? (
              <p className="text-corps-m text-texte-attenue leading-[1.3]">
                {t.subtitle}
              </p>
            ) : null}
          </div>
          <p className="text-corps-l text-encre max-w-[480px] leading-[1.45]">
            {t.intro}
          </p>
          <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:gap-6">
            <PrimaryLink href={COMPARE_PATH} className="lg:w-auto">
              {t.start}
            </PrimaryLink>
            <TextLink href="/methode" className="lg:text-corps-m">
              {t.howItWorks}
            </TextLink>
          </div>
          <Link
            href="/connexion"
            className="text-corps-s text-encre focus-visible:outline-outremer self-center rounded-sm leading-[1.3] focus-visible:outline-2 focus-visible:outline-offset-2 lg:self-start"
          >
            {t.findGardenQuestion}{" "}
            <span className="font-semibold underline underline-offset-2">
              {t.findGardenAction}
            </span>
          </Link>
          <SeasonTeaser className="mt-2" />
          <p className="text-legende text-texte-attenue text-center lg:text-left">
            {t.sources}
          </p>
        </div>
      </main>
    </div>
  );
}
