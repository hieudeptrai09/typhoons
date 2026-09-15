import CountryFlag from "@/lib/components/CountryFlag";
import EmptyResults from "@/lib/components/EmptyResults";
import FrownError from "@/lib/components/FrownError";
import NameGroupHeader from "@/lib/components/NameGroupHeader";
import NameTimeline from "@/lib/components/NameTimeline";
import PagePagination from "@/lib/components/PagePagination";
import StatisticsSection from "@/lib/components/StatisticsSection";
import StormCard from "@/lib/components/StormCard";
import type { PositionDetail, Storm, TyphoonName } from "@/lib/types";
import { TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { getCountrySlug } from "@/lib/utils/country";
import { getPositionSlug, getPositionTitle } from "@/lib/utils/position";
import {
  calculateAverage,
  getGroupedStorms,
  getIntensityFromNumber,
  sortNamesByFirstYear,
} from "@/lib/utils/storms";
import { SearchX } from "lucide-react";

interface PositionPageContentProps {
  detail: PositionDetail | null;
  position: number;
  isError?: boolean;
}

const TOTAL_POSITIONS = 143;

function PositionPagination({ position }: { position: number }) {
  const isFirst = position === 1;
  const isLast = position === TOTAL_POSITIONS;
  const prevPosition = isFirst ? TOTAL_POSITIONS : position - 1;
  const nextPosition = isLast ? 1 : position + 1;

  return (
    <PagePagination
      ariaLabel="Position pagination"
      prev={{
        href: `/positions/${getPositionSlug(prevPosition)}`,
        label: getPositionTitle(prevPosition),
        isWrap: isFirst,
      }}
      next={{
        href: `/positions/${getPositionSlug(nextPosition)}`,
        label: getPositionTitle(nextPosition),
        isWrap: isLast,
      }}
      current={`${position} / ${TOTAL_POSITIONS}`}
    />
  );
}

function NamesSection({ names, storms }: { names: TyphoonName[]; storms: Storm[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-foreground">Name Timeline ({names.length})</h2>
      {names.length === 0 ? (
        <p className="py-4 text-center text-foreground">
          No names have been assigned to this slot.
        </p>
      ) : (
        <NameTimeline names={names} storms={storms} />
      )}
    </section>
  );
}

function StormsSection({ storms }: { storms: Storm[] }) {
  if (storms.length === 0) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-foreground">All Storms (0)</h2>
        <p className="py-4 text-center text-foreground">No storms recorded at this position.</p>
      </section>
    );
  }

  const nameGroups = sortNamesByFirstYear(Object.entries(getGroupedStorms(storms, "name"))).map(
    ([name, group]) => ({ name, storms: [...group].sort((a, b) => a.year - b.year) }),
  );

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-foreground">All Storms ({storms.length})</h2>
      <div className="space-y-6">
        {nameGroups.map((group) => (
          <div key={group.name}>
            <div className="mb-3">
              <NameGroupHeader label={group.name} storms={group.storms} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.storms.map((storm, idx) => (
                <StormCard key={idx} storm={storm} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function PositionPageContent({
  detail,
  position,
  isError = false,
}: PositionPageContentProps) {
  if (isError) {
    return <FrownError />;
  }
  if (!detail || (detail.names.length === 0 && detail.storms.length === 0)) {
    return <EmptyResults icon={SearchX} description="No data recorded for this position yet." />;
  }

  const { country, names, storms } = detail;
  const positionTitle = getPositionTitle(position);
  const titleColor =
    storms.length > 0
      ? TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(calculateAverage(storms))]
      : "#64748b";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <div className="mb-8 flex items-baseline gap-3">
        {position <= 140 && <CountryFlag country={country} className="h-6 w-9" />}
        <h1 className="text-3xl font-bold" style={{ color: titleColor }}>
          {positionTitle}
        </h1>
        {position <= 140 && (
          <a
            href={`/countries/${getCountrySlug(country)}`}
            className="text-base text-foreground hover:text-sky-700 hover:underline"
          >
            {country}
          </a>
        )}
      </div>

      <div className="space-y-6">
        {position <= 140 && <NamesSection names={names} storms={storms} />}
        <StatisticsSection storms={storms} />
        <StormsSection storms={storms} />
      </div>

      <PositionPagination position={position} />
    </div>
  );
}
