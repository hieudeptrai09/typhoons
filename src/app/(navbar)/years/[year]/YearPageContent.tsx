import FrownError from "@/lib/components/FrownError";
import NameGroupHeader from "@/lib/components/NameGroupHeader";
import PagePagination from "@/lib/components/PagePagination";
import StatisticsSection from "@/lib/components/StatisticsSection";
import StormCard from "@/lib/components/StormCard";
import { MONTH_NAMES } from "@/lib/constants";
import type { Storm } from "@/lib/types";
import { TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { getSeasonMonthGroups } from "@/lib/utils/stormDates";
import { calculateAverage, getIntensityFromNumber } from "@/lib/utils/storms";

interface YearPageContentProps {
  year: number;
  // Already in start-date order.
  storms: Storm[] | null;
  years: number[];
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

function StormsSection({ storms }: { storms: Storm[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-foreground">All Storms ({storms.length})</h2>
      <div className="space-y-6">
        {getSeasonMonthGroups(storms).map(([month, monthStorms], idx) => (
          // A carried-over December and the season's own December are separate runs.
          <div key={`${month}-${idx}`}>
            <div className="mb-3">
              <NameGroupHeader
                label={MONTH_NAMES[month]}
                storms={monthStorms}
                showRecurrence={false}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {monthStorms.map((storm, idx) => (
                <StormCard key={idx} storm={storm} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function YearPageContent({ year, storms, years }: YearPageContentProps) {
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
        <StatisticsSection storms={storms} showRecurrence={false} />
        <StormsSection storms={storms} />
      </div>

      <YearPagination year={year} years={years} />
    </div>
  );
}
