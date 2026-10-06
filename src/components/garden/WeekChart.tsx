import type { JournalEntry } from "@/lib/data/types";
import { lightChoicesByDay, wateredDaysInLast } from "@/lib/journal/analysis";
import { intlLocale } from "@/lib/i18n";
import { JOURNAL } from "@/lib/i18n/messages/garden";
import { useLocale } from "@/lib/i18n/LocaleProvider";

/** Géométrie du graphique (unités du viewBox). */
const CHART = { width: 350, height: 132, top: 22, base: 104, bar: 30 } as const;

/**
 * Choix légers par jour, sur les 7 derniers jours : barres SVG faites main (couleurs de la
 * palette), et le même contenu en tableau pour les lecteurs d'écran.
 */
export function WeekChart({
  entries,
  now,
  headingLevel = 3,
}: {
  entries: readonly JournalEntry[];
  now: Date;
  headingLevel?: 2 | 3;
}) {
  const locale = useLocale();
  const t = JOURNAL[locale].week;
  const WEEKDAY = new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: "short",
  });
  const FULL_DAY = new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const days = lightChoicesByDay(entries, now);
  const watered = wateredDaysInLast(entries, now);
  const total = days.reduce((sum, day) => sum + day.count, 0);
  const max = Math.max(1, ...days.map((day) => day.count));
  const step = CHART.width / days.length;
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <section
      aria-labelledby="semaine-titre"
      className="bg-blanc flex flex-col gap-2 rounded-[20px] p-4"
      data-week-chart
    >
      <Heading
        id="semaine-titre"
        className="text-corps-s text-encre leading-[1.3] font-semibold"
      >
        {t.title}
      </Heading>
      {total === 0 ? (
        <p className="text-corps-s text-texte-attenue leading-[1.4]">
          {t.none}
        </p>
      ) : (
        <>
          <svg
            viewBox={`0 0 ${CHART.width} ${CHART.height}`}
            className="block h-auto w-full"
            aria-hidden
          >
            <line
              x1={0}
              x2={CHART.width}
              y1={CHART.base}
              y2={CHART.base}
              stroke="var(--color-encre)"
              strokeOpacity={0.15}
            />
            {days.map((day, index) => {
              const x = index * step + (step - CHART.bar) / 2;
              const height = (day.count / max) * (CHART.base - CHART.top) || 0;
              const today = index === days.length - 1;
              return (
                <g key={day.key}>
                  {day.count > 0 ? (
                    <rect
                      x={x}
                      y={CHART.base - height}
                      width={CHART.bar}
                      height={height}
                      rx={6}
                      fill={
                        today ? "var(--color-tomate)" : "var(--color-outremer)"
                      }
                      data-count={day.count}
                    />
                  ) : null}
                  <text
                    x={x + CHART.bar / 2}
                    y={CHART.base - height - 6}
                    textAnchor="middle"
                    fontSize={13}
                    fontWeight={600}
                    fill="var(--color-encre)"
                  >
                    {day.count}
                  </text>
                  <text
                    x={x + CHART.bar / 2}
                    y={CHART.height - 8}
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight={today ? 600 : 400}
                    fill={
                      today
                        ? "var(--color-encre)"
                        : "var(--color-texte-attenue)"
                    }
                  >
                    {today ? t.todayShort : WEEKDAY.format(day.date)}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="text-legende text-texte-attenue">{t.total(total)}</p>
        </>
      )}
      {watered > 0 ? (
        // Les habitudes n'ont pas de barre (aucun kg) : seulement les jours arrosés.
        <p
          className="text-legende text-texte-attenue"
          data-watered-days={watered}
        >
          {t.watered(watered)}
        </p>
      ) : null}
      <table className="sr-only">
        <caption>{t.caption}</caption>
        <thead>
          <tr>
            <th scope="col">{t.day}</th>
            <th scope="col">{t.lightChoices}</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day, index) => (
            <tr key={day.key}>
              <th scope="row">
                {index === days.length - 1
                  ? t.todayFull(FULL_DAY.format(day.date))
                  : FULL_DAY.format(day.date)}
              </th>
              <td>{day.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
