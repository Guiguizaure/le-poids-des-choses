import Link from "next/link";
import { Illustration } from "@/components/illustrations/Illustration";
import { localizedPath, pick, type Locale } from "@/lib/i18n";
import { NOT_FOUND } from "@/lib/i18n/messages/common";

const PRIMARY =
  "press bg-encre text-creme text-corps-m flex w-full items-center justify-center rounded-full px-6 py-4 text-center leading-[1.3] font-semibold transition-opacity hover:opacity-90 focus-visible:outline-outremer focus-visible:outline-2 focus-visible:outline-offset-2";

/**
 * 404 : le jardin dans la brume, l'oiseau endormi au sol. Scène immobile, rendue côté serveur
 * sans composant client à elle : elle ne doit rien ajouter aux pages (ni GSAP, ni animations).
 */
export function NotFoundScreen({ locale }: { locale: Locale }) {
  const t = pick(NOT_FOUND, locale);
  return (
    <main className="mx-auto flex w-full max-w-[430px] flex-col">
      <div
        className="relative aspect-[390/300] w-full overflow-hidden"
        aria-hidden
      >
        <Illustration
          name="scene-paysage"
          className="absolute inset-0 block h-auto w-full"
        />
        <div className="pointer-events-none absolute inset-x-0 top-[42%]">
          <Illustration name="brume" className="block h-auto w-full" />
        </div>
        {/* L'oiseau devant la brume, pour qu'on le voie dormir. */}
        <div className="absolute bottom-[23%] left-[78%] w-[9%]">
          <Illustration name="oiseau-endormi" className="block h-auto w-full" />
        </div>
      </div>
      <div className="flex flex-col gap-3.5 px-6 pt-6 pb-9">
        <p className="text-legende text-texte-attenue leading-[1.3] font-semibold">
          {t.eyebrow}
        </p>
        <h1 className="font-titre text-titre-l text-encre leading-[1.1]">
          {t.heading}
        </h1>
        <p className="text-corps-m text-encre leading-[1.4]">{t.text}</p>
        <Link href={localizedPath("/", locale)} className={PRIMARY}>
          {t.home}
        </Link>
      </div>
    </main>
  );
}
