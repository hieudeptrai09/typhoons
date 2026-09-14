import CountryFlag, { COUNTRY_NAMES } from "@/lib/components/CountryFlag";
import FrownError from "@/lib/components/FrownError";
import NameGroupHeader from "@/lib/components/NameGroupHeader";
import PagePagination from "@/lib/components/PagePagination";
import StatisticsSection from "@/lib/components/StatisticsSection";
import StormCard from "@/lib/components/StormCard";
import type { Storm } from "@/lib/types";
import { TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { getCountryPositionGroups, getCountrySlug } from "@/lib/utils/country";
import { getPositionSlug, getPositionTitle } from "@/lib/utils/position";
import { calculateAverage, getIntensityFromNumber } from "@/lib/utils/storms";

interface CountryPageContentProps {
  country: string;
  storms: Storm[] | null;
}

function CountryPagination({ country }: { country: string }) {
  const index = COUNTRY_NAMES.indexOf(country);
  const isFirst = index === 0;
  const isLast = index === COUNTRY_NAMES.length - 1;
  const prevCountry = COUNTRY_NAMES[isFirst ? COUNTRY_NAMES.length - 1 : index - 1];
  const nextCountry = COUNTRY_NAMES[isLast ? 0 : index + 1];

  return (
    <PagePagination
      ariaLabel="Country pagination"
      prev={{
        href: `/countries/${getCountrySlug(prevCountry)}`,
        label: prevCountry,
        isWrap: isFirst,
      }}
      next={{
        href: `/countries/${getCountrySlug(nextCountry)}`,
        label: nextCountry,
        isWrap: isLast,
      }}
      current={`${index + 1} / ${COUNTRY_NAMES.length}`}
    />
  );
}

function StormsSection({ positionGroups }: { positionGroups: [number, Storm[]][] }) {
  const total = positionGroups.reduce((sum, [, storms]) => sum + storms.length, 0);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-foreground">All Storms ({total})</h2>
      {total === 0 ? (
        <p className="py-4 text-center text-foreground">
          No storms recorded for this country&apos;s names.
        </p>
      ) : (
        <div className="space-y-6">
          {positionGroups
            .filter(([, storms]) => storms.length > 0)
            .map(([position, storms]) => (
              <div key={position}>
                <div className="mb-3">
                  <NameGroupHeader
                    label={
                      <a
                        href={`/positions/${getPositionSlug(position)}`}
                        className="hover:underline"
                      >
                        {getPositionTitle(position)}
                      </a>
                    }
                    storms={storms}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {storms.map((storm, idx) => (
                    <StormCard key={idx} storm={storm} />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}

export default function CountryPageContent({ country, storms }: CountryPageContentProps) {
  if (!storms) {
    return <FrownError />;
  }

  const positionGroups = getCountryPositionGroups(storms, country);

  const titleColor =
    storms.length > 0
      ? TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(calculateAverage(storms))]
      : "#64748b";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <div className="mb-3 flex items-center gap-3">
        <CountryFlag country={country} className="h-6 w-9" />
        <h1 className="text-3xl font-bold" style={{ color: titleColor }}>
          {country}
        </h1>
      </div>

      <nav className="mb-8 flex flex-wrap items-center gap-2" aria-label="Positions">
        {positionGroups.map(([position, positionStorms]) => (
          <a
            key={position}
            href={`/positions/${getPositionSlug(position)}`}
            className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-foreground transition-colors hover:border-sky-700 hover:text-sky-700"
          >
            {getPositionTitle(position)}
            <span className="ml-1.5 font-normal text-slate-500">{positionStorms.length}</span>
          </a>
        ))}
      </nav>

      <div className="space-y-6">
        <StatisticsSection storms={storms} showRecurrence={false} />
        <StormsSection positionGroups={positionGroups} />
      </div>

      <CountryPagination country={country} />
    </div>
  );
}
