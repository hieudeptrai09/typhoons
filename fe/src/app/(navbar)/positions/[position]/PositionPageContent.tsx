import {
  calculateAverage,
  getGroupedStorms,
  getIntensityFromNumber,
  sortNamesByFirstYear,
} from "@/app/(navbar)/storms/_utils/fns";
import CountryFlag from "@/lib/components/CountryFlag";
import FrownNotFound from "@/lib/components/FrownNotFound";
import ImageWithLoader from "@/lib/components/ImageWithLoader";
import StormCard from "@/lib/components/StormCard";
import type { PositionDetail, Storm, TyphoonName } from "@/lib/types";
import {
  BACKGROUND_BADGE,
  getNameStatusColorClass,
  TEXT_COLOR_WHITE_BACKGROUND,
} from "@/lib/utils/colors";
import { getPositionTitle } from "@/lib/utils/fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PositionPageContentProps {
  detail: PositionDetail | null;
  position: number;
}

const TOTAL_POSITIONS = 140;

function PositionPagination({ position }: { position: number }) {
  const isFirst = position === 1;
  const isLast = position === TOTAL_POSITIONS;
  const prevPosition = isFirst ? TOTAL_POSITIONS : position - 1;
  const nextPosition = isLast ? 1 : position + 1;

  const linkClass = (isWrap: boolean) =>
    `flex items-center gap-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
      isWrap
        ? "border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-500"
        : "border-sky-600 bg-sky-600 text-white hover:border-sky-700 hover:bg-sky-700"
    }`;

  // Plain <a> tags (not next/link) force a hard navigation, which is the only way to
  // bypass the @modal/(.)positions interception so prev/next lands on the full page.
  return (
    <nav
      className="mt-6 flex items-center justify-between border-t border-slate-200 pt-6"
      aria-label="Position pagination"
    >
      <a href={`/positions/${prevPosition}`} className={linkClass(isFirst)}>
        <ChevronLeft className="h-4 w-4" />
        {getPositionTitle(prevPosition)}
      </a>
      <span className="text-sm text-slate-400">
        {position} / {TOTAL_POSITIONS}
      </span>
      <a href={`/positions/${nextPosition}`} className={linkClass(isLast)}>
        {getPositionTitle(nextPosition)}
        <ChevronRight className="h-4 w-4" />
      </a>
    </nav>
  );
}

function NameRosterCard({ name, storms }: { name: TyphoonName; storms: Storm[] }) {
  const years = storms.map((s) => s.year).join(", ");

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`flex gap-4 ${name.image ? "flex-col sm:flex-row" : "flex-col"}`}>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className={`font-bold ${getNameStatusColorClass(name)}`}>{name.name}</span>
            {storms.length > 0 && (
              <span className="text-xs text-slate-500">
                {storms.length} storm{storms.length > 1 ? "s" : ""} · {years}
              </span>
            )}
          </div>
          {name.meaning && (
            <p className="mt-1 text-sm leading-relaxed text-teal-600 italic">{name.meaning}</p>
          )}
          {name.description && (
            <p className="mt-1 text-xs leading-relaxed text-slate-600">{name.description}</p>
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
      <h2 className="mb-4 text-lg font-bold text-slate-800">Names Used ({names.length})</h2>
      {names.length === 0 ? (
        <p className="py-4 text-center text-gray-500">No names have been assigned this slot.</p>
      ) : (
        <div className="space-y-3">
          {sortedNames.map((name) => (
            <NameRosterCard
              key={name.id}
              name={name}
              storms={[...(stormsByName[name.name] || [])].sort((a, b) => a.year - b.year)}
            />
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
        <h2 className="mb-4 text-lg font-bold text-slate-800">All Storms (0)</h2>
        <p className="py-4 text-center text-gray-500">No storms recorded at this position.</p>
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
        <h2 className="text-lg font-bold text-slate-800">All Storms ({storms.length})</h2>
        <div>
          <span className="text-sm font-medium text-slate-500">Overall Avg: </span>
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
                <span className="font-semibold text-slate-700">{group.name}</span>
                <div className="flex gap-3 text-sm text-slate-500">
                  <span>
                    Count: <span className="font-semibold text-slate-700">{group.count}</span>
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

export default function PositionPageContent({ detail, position }: PositionPageContentProps) {
  if (!detail || (detail.names.length === 0 && detail.storms.length === 0)) {
    return <FrownNotFound />;
  }

  const { country, names, storms } = detail;
  const positionTitle = getPositionTitle(position);
  // "#64748b" (slate-500) fallback duplicated across 3 files — see
  // PositionModal.tsx note.
  const titleColor =
    storms.length > 0
      ? TEXT_COLOR_WHITE_BACKGROUND[getIntensityFromNumber(calculateAverage(storms))]
      : "#64748b";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
      <div className="mb-8 flex items-baseline gap-3">
        {country && <CountryFlag country={country} className="h-6 w-9" />}
        <h1 className="text-3xl font-bold" style={{ color: titleColor }}>
          {positionTitle}
        </h1>
        {country && <span className="text-base text-slate-500">{country}</span>}
      </div>

      <div className="space-y-6">
        <NamesSection names={names} storms={storms} />
        <StormsSection storms={storms} />
      </div>

      <PositionPagination position={position} />
    </div>
  );
}
