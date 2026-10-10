import FrownError from "@/lib/components/FrownError";
import PagePagination from "@/lib/components/PagePagination";
import SeasonNameChanges, { hasNameChanges } from "@/lib/components/SeasonNameChanges";
import StatisticsSection from "@/lib/components/StatisticsSection";
import StormNameTable from "@/lib/components/StormNameTable";
import type { RetiredName, Storm } from "@/lib/types";
import { TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { calculateAverage, getIntensityFromNumber } from "@/lib/utils/storms";

interface YearPageContentProps {
  year: number;
  // Already in start-date order.
  storms: Storm[] | null;
  years: number[];
  // The naming-list entries of this season's storms, for the meaning each name carries.
  names: RetiredName[];
  // Names whose last season this was.
  retiredNames: RetiredName[];
  // The storms that first carried their name, in start-date order.
  debuts: Storm[];
}

function YearPagination({ year, years }: { year: number; years: number[] }) {
  const index = years.indexOf(year);
  if (index === -1) return null;

  const isFirst = index === 0;
  const isLast = index === years.length - 1;
  const prevYear = years[isFirst ? years.length - 1 : index - 1];
  const nextYear = years[isLast ? 0 : index + 1];

  return (
    <PagePagination
      ariaLabel="Year pagination"
      prev={{ href: `/years/${prevYear}`, label: prevYear, isWrap: isFirst }}
      next={{ href: `/years/${nextYear}`, label: nextYear, isWrap: isLast }}
      current={`${index + 1} / ${years.length}`}
    />
  );
}

function NameChangesSection({
  retiredNames,
  debuts,
}: {
  retiredNames: RetiredName[];
  debuts: Storm[];
}) {
  if (!hasNameChanges({ retiredNames, debuts })) return null;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-foreground">Name Changes</h2>
      <SeasonNameChanges retiredNames={retiredNames} debuts={debuts} />
    </section>
  );
}

function StormsSection({ storms, names }: { storms: Storm[]; names: RetiredName[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-foreground">All Storms ({storms.length})</h2>
      {/* A season is one year, so the year column would repeat the page title; the country varies. */}
      <StormNameTable storms={storms} names={names} tableKey="season-storms" showYear={false} />
    </section>
  );
}

export default function YearPageContent({
  year,
  storms,
  years,
  names,
  retiredNames,
  debuts,
}: YearPageContentProps) {
  if (!storms) {
    return <FrownError />;
  }

  const titleColor = TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(calculateAverage(storms))];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <div className="mb-8 flex items-baseline gap-3">
        <h1 className="text-3xl font-bold tabular-nums" style={{ color: titleColor }}>
          {year}
        </h1>
        <span className="text-base text-foreground">Typhoon Season</span>
      </div>

      <div className="space-y-6">
        <NameChangesSection retiredNames={retiredNames} debuts={debuts} />
        <StatisticsSection storms={storms} showRecurrence={false} />
        <StormsSection storms={storms} names={names} />
      </div>

      <YearPagination year={year} years={years} />
    </div>
  );
}
