import CountryFlag, { COUNTRY_NAMES } from "@/lib/components/CountryFlag";
import CountryNames from "@/lib/components/CountryNames";
import FrownError from "@/lib/components/FrownError";
import GroupedStormCards from "@/lib/components/GroupedStormCards";
import PagePagination from "@/lib/components/PagePagination";
import StatisticsSection from "@/lib/components/StatisticsSection";
import type { RetiredName, Storm } from "@/lib/types";
import { TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { getCountryPositionGroups, getCountrySlug } from "@/lib/utils/country";
import { getPositionSlug, getPositionTitle } from "@/lib/utils/position";
import { calculateAverage, getIntensityFromNumber } from "@/lib/utils/storms";

interface CountryPageContentProps {
  country: string;
  storms: Storm[] | null;
  names: RetiredName[] | null;
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

const PositionLink = ({ position }: { position: number }) => (
  <a href={`/positions/${getPositionSlug(position)}`} className="hover:underline">
    {getPositionTitle(position)}
  </a>
);

function NamesSection({
  names,
  positionGroups,
}: {
  names: RetiredName[];
  positionGroups: [number, Storm[]][];
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-foreground">Names ({names.length})</h2>
      <CountryNames names={names} positionGroups={positionGroups} />
    </section>
  );
}

function StormsSection({ positionGroups }: { positionGroups: [number, Storm[]][] }) {
  const groups = positionGroups
    .filter(([, storms]) => storms.length > 0)
    .map(([position, storms]) => ({
      key: String(position),
      label: <PositionLink position={position} />,
      storms,
    }));
  const total = groups.reduce((sum, group) => sum + group.storms.length, 0);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-foreground">All Storms ({total})</h2>
      {total === 0 ? (
        <p className="py-4 text-center text-foreground">
          No storms recorded for this country&apos;s names.
        </p>
      ) : (
        <GroupedStormCards groups={groups} />
      )}
    </section>
  );
}

export default function CountryPageContent({ country, storms, names }: CountryPageContentProps) {
  if (!storms || !names) {
    return <FrownError />;
  }

  const positionGroups = getCountryPositionGroups(storms, country);

  const titleColor =
    storms.length > 0
      ? TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(calculateAverage(storms))]
      : "#64748b";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <div className="mb-8 flex items-center gap-3">
        <CountryFlag country={country} className="h-6 w-9" />
        <h1 className="text-3xl font-bold" style={{ color: titleColor }}>
          {country}
        </h1>
      </div>

      <div className="space-y-6">
        <NamesSection names={names} positionGroups={positionGroups} />
        <StatisticsSection storms={storms} showRecurrence={false} />
        <StormsSection positionGroups={positionGroups} />
      </div>

      <CountryPagination country={country} />
    </div>
  );
}
