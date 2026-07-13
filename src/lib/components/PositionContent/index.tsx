import {
  calculateAverage,
  getGroupedStorms,
  getIntensityFromNumber,
  sortNamesByFirstYear,
} from "@/app/(navbar)/storms/_utils/fns";
import ImageWithLoader from "@/lib/components/ImageWithLoader";
import StormCard from "@/lib/components/StormCard";
import type { Storm, TyphoonName } from "@/lib/types";
import {
  BACKGROUND_BADGE,
  getNameStatusColorClass,
  TEXT_COLOR_WHITE_BACKGROUND,
} from "@/lib/utils/colors";

export function NameRosterCard({ name, storms }: { name: TyphoonName; storms: Storm[] }) {
  const years = storms.map((s) => s.year).join(", ");

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`flex gap-4 ${name.image ? "flex-col sm:flex-row" : "flex-col"}`}>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className={`font-bold ${getNameStatusColorClass(name)}`}>{name.name}</span>
            {storms.length > 0 && (
              <span className="text-xs text-muted">
                {storms.length} storm{storms.length > 1 ? "s" : ""} · {years}
              </span>
            )}
            {name.language && <span className="text-xs text-muted">· {name.language}</span>}
          </div>
          {name.meaning && (
            <p className="mt-1 text-sm leading-relaxed text-teal-600 italic">{name.meaning}</p>
          )}
          {name.description && (
            <p className="mt-1 text-xs leading-relaxed text-muted">{name.description}</p>
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

/** The roster of names used at a position, sorted by the year each first appeared. */
export function PositionNamesList({ names, storms }: { names: TyphoonName[]; storms: Storm[] }) {
  if (names.length === 0) {
    return <p className="py-4 text-center text-muted">No names have been assigned to this slot.</p>;
  }

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
    <div className="space-y-3">
      {sortedNames.map((name) => (
        <NameRosterCard
          key={name.id}
          name={name}
          storms={[...(stormsByName[name.name] || [])].sort((a, b) => a.year - b.year)}
        />
      ))}
    </div>
  );
}

/** All storms recorded at a position, grouped by name with a per-group average. */
export function PositionStormsList({ storms }: { storms: Storm[] }) {
  if (storms.length === 0) {
    return <p className="py-4 text-center text-muted">No storms recorded at this position.</p>;
  }

  const nameGroups = sortNamesByFirstYear(Object.entries(getGroupedStorms(storms, "name"))).map(
    ([name, group]) => {
      const sorted = [...group].sort((a, b) => a.year - b.year);
      return { name, storms: sorted, average: calculateAverage(sorted), count: sorted.length };
    },
  );

  return (
    <div className="space-y-6">
      {nameGroups.map((group) => {
        const intensityLabel = getIntensityFromNumber(group.average);
        return (
          <div key={group.name}>
            <div
              className="mb-3 flex items-center justify-between rounded-md bg-slate-50 px-3 py-2"
              style={{ borderLeft: `4px solid ${BACKGROUND_BADGE[intensityLabel]}` }}
            >
              <span className="font-semibold text-muted">{group.name}</span>
              <div className="flex gap-3 text-sm text-muted">
                <span>
                  Count: <span className="font-semibold text-muted">{group.count}</span>
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
  );
}
