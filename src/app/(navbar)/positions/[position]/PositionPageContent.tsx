import {
  calculateAverage,
  getGroupedStorms,
  getIntensityFromNumber,
  sortNamesByFirstYear,
} from "@/app/(navbar)/storms/_utils/fns";
import CountryFlag from "@/lib/components/CountryFlag";
import EmptyResults from "@/lib/components/EmptyResults";
import FrownError from "@/lib/components/FrownError";
import ImageWithLoader from "@/lib/components/ImageWithLoader";
import StormCard from "@/lib/components/StormCard";
import type { PositionDetail, Storm, TyphoonName } from "@/lib/types";
import {
  BACKGROUND_BADGE,
  getNameStatusColorClass,
  TEXT_COLOR_WHITE_BACKGROUND,
} from "@/lib/utils/colors";
import { getPositionSlug, getPositionTitle } from "@/lib/utils/fns";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";

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

  const linkClass = (isWrap: boolean) =>
    `flex items-center gap-1 rounded-lg border px-4 py-2 text-sm font-semibold text-white transition-colors ${
      isWrap
        ? "border-gray-500 bg-gray-500 hover:border-slate-600 hover:bg-slate-600"
        : "border-sky-600 bg-sky-600 hover:border-sky-700 hover:bg-sky-700"
    }`;

  return (
    <nav
      className="mt-6 flex items-center justify-between border-t border-slate-200 pt-6"
      aria-label="Position pagination"
    >
      <a href={`/positions/${getPositionSlug(prevPosition)}`} className={linkClass(isFirst)}>
        <ChevronLeft className="h-4 w-4" />
        {getPositionTitle(prevPosition)}
      </a>
      <span className="text-sm text-foreground">
        {position} / {TOTAL_POSITIONS}
      </span>
      <a href={`/positions/${getPositionSlug(nextPosition)}`} className={linkClass(isLast)}>
        {getPositionTitle(nextPosition)}
        <ChevronRight className="h-4 w-4" />
      </a>
    </nav>
  );
}

function NameRosterCard({ name }: { name: TyphoonName }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`flex gap-4 ${name.image ? "flex-col sm:flex-row" : "flex-col"}`}>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className={`font-bold ${getNameStatusColorClass(name)}`}>{name.name}</span>
            {name.language && <span className="text-xs text-foreground">· {name.language}</span>}
          </div>
          {name.meaning && (
            <p className="mt-1 text-sm leading-relaxed text-teal-600 italic">{name.meaning}</p>
          )}
          {name.description && (
            <p className="mt-1 text-xs leading-relaxed text-foreground">{name.description}</p>
          )}
        </div>
        {name.image && (
          <div
            className="relative shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 sm:w-32"
            style={{ aspectRatio: "4/3" }}
          >
            <ImageWithLoader
              src={name.image}
              alt={name.name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        )}
      </div>
    </div>
  );
}

function NamesSection({ names, storms }: { names: TyphoonName[]; storms: Storm[] }) {
  const stormsByName: Record<string, Storm[]> = {};
  storms.forEach((storm) => {
    if (!stormsByName[storm.name]) stormsByName[storm.name] = [];
    stormsByName[storm.name].push(storm);
  });

  const sortedNames = [...names].sort((a, b) => {
    const aFirst = (stormsByName[a.name] || []).reduce((min, s) => Math.min(min, s.year), Infinity);
    const bFirst = (stormsByName[b.name] || []).reduce((min, s) => Math.min(min, s.year), Infinity);
    return aFirst - bFirst;
  });

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-foreground">Names Used ({names.length})</h2>
      {names.length === 0 ? (
        <p className="py-4 text-center text-foreground">
          No names have been assigned to this slot.
        </p>
      ) : (
        <div className="space-y-3">
          {sortedNames.map((name) => (
            <NameRosterCard key={name.id} name={name} />
          ))}
        </div>
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

  const overallAverage = calculateAverage(storms);
  const nameGroups = sortNamesByFirstYear(Object.entries(getGroupedStorms(storms, "name"))).map(
    ([name, group]) => {
      const sorted = [...group].sort((a, b) => a.year - b.year);
      return { name, storms: sorted, average: calculateAverage(sorted), count: sorted.length };
    },
  );

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">All Storms ({storms.length})</h2>
        <div>
          <span className="text-sm font-semibold text-foreground">Overall Avg: </span>
          <span
            className="text-lg font-bold"
            style={{ color: TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(overallAverage)] }}
          >
            {overallAverage.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="space-y-6">
        {nameGroups.map((group) => {
          const intensityLabel = getIntensityFromNumber(group.average);
          return (
            <div key={group.name}>
              <div
                className="mb-3 flex items-center justify-between rounded-md bg-slate-50 px-3 py-2"
                style={{ borderLeft: `4px solid ${BACKGROUND_BADGE[intensityLabel]}` }}
              >
                <span className="font-semibold text-foreground">{group.name}</span>
                <div className="flex gap-3 text-sm text-foreground">
                  <span>
                    Count: <span className="font-semibold text-foreground">{group.count}</span>
                  </span>
                  <span>
                    Avg:{" "}
                    <span
                      className="font-semibold"
                      style={{ color: TEXT_COLOR_WHITE_BACKGROUND[intensityLabel] }}
                    >
                      {group.average.toFixed(2)}
                    </span>
                  </span>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.storms.map((storm, idx) => (
                  <StormCard key={idx} storm={storm} />
                ))}
              </div>
            </div>
          );
        })}
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
        {position <= 140 && <span className="text-base text-foreground">{country}</span>}
      </div>

      <div className="space-y-6">
        {position <= 140 && <NamesSection names={names} storms={storms} />}
        <StormsSection storms={storms} />
      </div>

      <PositionPagination position={position} />
    </div>
  );
}
