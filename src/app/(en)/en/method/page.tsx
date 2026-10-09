import type { Metadata } from "next";
import Link from "next/link";
import {
  ContentPage,
  ExternalLink,
  Section,
} from "@/components/ui/ContentPage";
import { DataCredit } from "@/components/ui/DataCredit";
import { PaperCutout } from "@/components/ui/PaperCutout";
import { WATER_DAYS_PER_STEP } from "@/lib/garden/watering";
import { NIGHT_HOURS } from "@/lib/garden/daytime";
import generated from "@/lib/data/gestures.generated.json";
import { localizedPath } from "@/lib/i18n";
import { PAGES } from "@/lib/i18n/messages/common";
import {
  SAISON_BASE,
  SAISON_DOWNLOADED_AT,
  SAISON_TOOL_URL,
} from "@/lib/saison";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  ...PAGES.en.methode,
  path: "/methode",
  locale: "en",
});

/**
 * Conditions for reusing the Impact CO2 data (permission from the ADEME Impact CO2 team by
 * email on 5 October 2026), as on the French page. The credit itself stays as required:
 * « Données : Impact CO2 – ADEME », shown in English as “Data: Impact CO2 – ADEME”.
 */
const DATA_LICENSE: { text: string; url?: string } | null = {
  text: "Data reused with permission from ADEME’s Impact CO2 team (email of 5 October 2026), free of charge, with the credit “Données : Impact CO2 – ADEME” (in English: “Data: Impact CO2 – ADEME”).",
};

const REPOSITORY = "https://github.com/Guiguizaure/le-poids-des-choses";
const IMPACT_CO2 = "https://impactco2.fr";

// Paper cut-outs: small next to the headings on mobile (hidden under 360 px), in the margins
// on large screens. Same as the French page.
const INLINE =
  "-my-2 size-11 max-[359px]:hidden lg:absolute lg:my-0 lg:size-24";
const RIGHT = `${INLINE} lg:-top-3 lg:-right-36`;
const LEFT = `${INLINE} lg:-top-3 lg:-left-36`;

const updatedOn = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Paris",
}).format(new Date(generated.downloadedAt));

const hour = (h: number) => `${h % 12 || 12} ${h < 12 ? "am" : "pm"}`;

/** Page 06 · Method and sources, English version of /methode (same section anchors). */
export default function MethodPage() {
  return (
    <ContentPage
      title={PAGES.en.methode.title}
      decoration={<PaperCutout name="oiseau" tilt={-7} className={RIGHT} />}
    >
      <p className="text-legende text-texte-attenue leading-[1.3] font-semibold">
        Data updated on {updatedOn}
      </p>

      <Section id="sources" title="Where do the figures come from?">
        <p>
          From public data by ADEME, the French Agency for Ecological
          Transition, published by{" "}
          <ExternalLink href={IMPACT_CO2}>Impact CO2</ExternalLink>, which draws
          on the Base Carbone and Agribalyse databases. The site reads Impact
          CO2’s{" "}
          <ExternalLink href={generated.source}>
            public file of equivalents
          </ExternalLink>
          ; each action links to its page on impactco2.fr (in French), where its
          value is explained in detail.
        </p>
        <DataCredit />
        {DATA_LICENSE ? (
          <p className="text-corps-s text-texte-attenue">
            {DATA_LICENSE.url ? (
              <ExternalLink href={DATA_LICENSE.url}>
                {DATA_LICENSE.text}
              </ExternalLink>
            ) : (
              DATA_LICENSE.text
            )}
          </p>
        ) : null}
      </Section>

      <Section id="unites" title="What they count">
        <p>
          Each value is an average in kilograms of CO2 equivalent (kg CO2e),
          which adds up greenhouse gases according to their effect on the
          climate. We always compare two actions with the same unit:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            Getting around: per kilometre and per person, over the distance you
            choose;
          </li>
          <li>Eating: per meal;</li>
          <li>Drinking: per litre;</li>
          <li>Clothes and Digital: per item, for making a new item;</li>
          <li>Deliveries: per purchase, for a 1 kg parcel.</li>
        </ul>
      </Section>

      <Section
        id="hypotheses"
        title="Our assumptions"
        decoration={<PaperCutout name="coccinelle" tilt={9} className={LEFT} />}
      >
        <p id="occasion" className="scroll-mt-6">
          <strong>Second-hand.</strong> Buying an item that has already been
          made doesn’t lead to anything new being made: we count 0 kg for
          manufacturing. This is an assumption, not a measurement. Keeping yours
          also counts 0 kg.
        </p>
        <p>
          <strong>The parcel.</strong> If the second-hand item is delivered, we
          add sending a parcel to your home, according to Impact CO2: 1 kg for
          clothing or a smartphone, 2 kg for trainers or a laptop, 15 kg for a
          television.
        </p>
        <p>
          <strong>Shopping trips.</strong> For “Deliveries”, Impact CO2’s values
          include the trip to collect the parcel: 3.5 km by car for the pickup
          point, 15 km by car for the shop, and no motorised trip on foot.
        </p>
      </Section>

      <Section id="non-compte" title="What isn’t counted">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            the trip to buy second-hand (charity shop, car boot sale, handover
            in person);
          </li>
          <li>looking after, washing, repairing or refurbishing an item;</li>
          <li>end of life (resale, donation, waste);</li>
          <li>using appliances (a television’s electricity, for example).</li>
        </ul>
      </Section>

      <Section id="limites" title="Their limits">
        <p>
          These are averages. Your journey, your meal or your clothes may weigh
          more or less depending on the details.
        </p>
        <p>
          Counting zero manufacturing for second-hand items favours them: other
          methods share the manufacturing footprint between an item’s successive
          lives.
        </p>
      </Section>

      <Section
        id="jardin"
        title="And your garden?"
        decoration={
          <PaperCutout
            name="balance"
            tilt={-4}
            className="h-9 w-14 max-[359px]:hidden lg:absolute lg:-top-1 lg:-right-44 lg:h-20 lg:w-32"
          />
        }
      >
        <p>
          It only shows the choices you note here. It isn’t your carbon
          footprint, just a record of the differences between the options you
          compared.
        </p>
        <p id="ecart" className="scroll-mt-6">
          The site doesn’t measure kilos saved or avoided: it counts the gap
          between the option you choose and the other option you compared,
          without knowing what you would have done otherwise. That’s why it
          always says “difference”. A habit noted without a comparison counts no
          kg (see{" "}
          <Link href="#habitudes" className="font-semibold underline">
            comparing or keeping up a habit
          </Link>
          ).
        </p>
      </Section>

      <Section id="habitudes" title="Comparing or keeping up a habit">
        <p>
          Comparing two actions gives a difference: the gap between the two
          options, calculated with Impact CO2 data. That difference, and only
          that, is what your garden adds up.
        </p>
        <p>
          A habit isn’t compared with anything: if you never eat meat, comparing
          your meal with a meat dish would give a difference that matches
          nothing real. So a habit you keep counts no kg and goes into neither
          the total nor the milestones. It waters your garden: each day you note
          at least one counts for all the plants already there. On top of that,
          each habit you tap in “My habits” waters one more plant (the least
          grown one, at most once a day). A plant moves up a step every{" "}
          {WATER_DAYS_PER_STEP} waterings: it grows, then blooms. The same habit
          only waters once a day (until midnight, Paris time). It’s a rule of
          the game, not a measurement.
        </p>
        <p>
          In winter, the bloom of deciduous trees sleeps: the level reached is
          kept, but their flowers and fruit only come back in spring.
        </p>
        <p>
          The garden also follows the seasons of the northern hemisphere
          (leaves, sky, snow): simple scenery, which doesn’t change any figure.
          Like real ones, the apple, cherry and fig trees turn colour in autumn
          and sleep through winter, leafless, until spring; the lemon, olive and
          fir trees keep their foliage. The garden never dies: it falls asleep.
        </p>
        <p id="visiteurs" className="scroll-mt-6">
          Seasonal visitors (robin, swallow, cicada, squirrel, wild flowers) and
          night visitors (owl, fox) drop by on their own: they aren’t unlocked
          and don’t count anywhere. The sky follows your device’s clock: from{" "}
          {hour(NIGHT_HOURS.start)} to {hour(NIGHT_HOURS.end)}, your garden
          switches to Ink night. Your plants never die, and an animal that has
          moved in is never lost: it sleeps, or comes back in its season.
        </p>
      </Section>

      <Section
        id="saison"
        title="Seasonal fruit and vegetables"
        decoration={
          <PaperCutout
            name="picto-repas-vegetalien"
            tilt={8}
            className={LEFT}
          />
        }
      >
        <p>
          The{" "}
          <Link
            href={localizedPath("/saison", "en")}
            className="font-semibold underline underline-offset-2"
          >
            In season
          </Link>{" "}
          page draws on Impact CO2’s{" "}
          <ExternalLink href={SAISON_TOOL_URL}>
            seasonal fruit and vegetables
          </ExternalLink>{" "}
          tool: for each product, its months in season and its impact in kg of
          CO2e per kilo, from lightest to heaviest, with the tool’s categories.
          Product names are translated; the values are the same.
        </p>
        <p>
          The data doesn’t say where the produce comes from, except for mangoes,
          where it separates imports by air from imports by sea. So the site
          doesn’t compare different origins of the same product.
        </p>
        <DataCredit
          downloadedAt={SAISON_DOWNLOADED_AT}
          href={SAISON_TOOL_URL}
          base={SAISON_BASE}
        />
      </Section>

      <Section id="savais-tu" title="“Did you know?”">
        <p>
          These little facts are calculated from the same Impact CO2 data as the
          comparisons, never written by hand: if a value changes, the sentence
          follows. They are rounded to stay readable and link to the original
          action’s page.
        </p>
      </Section>

      <Section id="raconte" title="“Tell us about your day”">
        <p>
          You write about your day; Claude Haiku 4.5, a model by Anthropic,
          spots the actions that are in the site’s catalogue, and nothing else.
          It doesn’t calculate anything and gives no figures: it only returns
          the names of the actions, the words that justify them and, for a
          journey, the distance if you wrote it. An inferred action (“a burger”
          for a beef meal) is marked “Check this” and isn’t ticked.
        </p>
        <p>
          The option it’s compared with comes from a table written by hand (the
          TER regional train is compared with a petrol or diesel car, a
          vegetarian meal with a chicken meal…), which you can change before
          adding. The differences are then calculated as everywhere else, from
          Impact CO2 data. Nothing goes into your journal unless you’ve ticked
          it.
        </p>
        <p>
          Each analysis runs an AI model in a data centre: it uses energy and so
          has a footprint. We don’t show it in grams, because there’s no public
          source that puts a figure on a single request. That’s why the analysis
          only runs when you ask, on a short text, with a brief reply.
        </p>
      </Section>

      <Section id="fabrication" title="How this site is made">
        <p>
          Designed, illustrated and built by Guillaume (
          <ExternalLink href="https://webjuno.com">webjuno.com</ExternalLink>).
          The code was written with the help of Claude Code, Anthropic’s coding
          assistant. It’s open: the{" "}
          <ExternalLink href={REPOSITORY}>GitHub repository</ExternalLink> is
          public.
        </p>
      </Section>

      <aside className="bg-blanc text-corps-s flex flex-col gap-1.5 rounded-[20px] p-[18px]">
        <p className="text-encre leading-[1.3] font-semibold">
          Independent project
        </p>
        <p className="text-texte-attenue leading-[1.4]">
          Not affiliated with ADEME. Designed, drawn and built by Guillaume,
          webjuno.com.
        </p>
      </aside>
      <div className="flex justify-end pr-2">
        <PaperCutout
          name="escargot"
          tilt={-4}
          className="h-12 w-16 lg:h-16 lg:w-20"
        />
      </div>
    </ContentPage>
  );
}
