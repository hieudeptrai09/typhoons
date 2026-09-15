import ImageCredit from "@/lib/components/ImageCredit";
import ImageWithLoader from "@/lib/components/ImageWithLoader";
import type { RetiredName, Storm, TyphoonName } from "@/lib/types";
import { getNameStatusColor, getNameStatusColorClass } from "@/lib/utils/colors";

interface NameTimelineProps {
  names: (TyphoonName | RetiredName)[];
  // The slot's storms; each name picks out its own to date its era.
  storms: Storm[];
  // Off where many slots stack up and the pictures would crowd the page.
  showImages?: boolean;
}

function NameTimelineItem({
  name,
  storms,
  showImages,
}: {
  name: TyphoonName | RetiredName;
  storms: Storm[];
  showImages: boolean;
}) {
  const years = storms.map((s) => s.year);
  const firstYear = years.length > 0 ? Math.min(...years) : undefined;
  const lastStormYear = years.length > 0 ? Math.max(...years) : undefined;
  const retiredYear = "lastYear" in name && name.lastYear ? name.lastYear : lastStormYear;
  const replacementName =
    "replacementName" in name && name.replacementName ? name.replacementName : undefined;
  const note = "note" in name && name.note ? name.note : undefined;
  const isSucceeded = name.isRetired || !!replacementName;
  const image = showImages ? name.image : undefined;

  let era: string;
  if (firstYear === undefined) {
    era = isSucceeded ? "Never used" : "Awaiting first storm";
  } else if (isSucceeded) {
    era = firstYear === retiredYear ? `${firstYear}` : `${firstYear} – ${retiredYear}`;
  } else {
    era = `${firstYear} – present`;
  }

  return (
    <li className="relative pb-8 pl-8 last:pb-0">
      <span
        className="absolute top-0.5 left-0 h-4 w-4 rounded-full border-2 border-white shadow"
        style={{ backgroundColor: getNameStatusColor(name) }}
        aria-hidden="true"
      />
      <div className="flex gap-4">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{era}</div>
          <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <a
              href={`/info/${name.name.toLowerCase()}`}
              className={`text-lg font-bold hover:underline ${getNameStatusColorClass(name)}`}
            >
              {name.name}
            </a>
            {name.originalText && (
              <span className="text-base text-foreground">{name.originalText}</span>
            )}
            {name.language && <span className="text-xs text-slate-500">· {name.language}</span>}
          </div>
          {name.meaning && <p className="mt-0.5 text-sm text-teal-600 italic">{name.meaning}</p>}

          {/* The era above already ends at the retirement year, so it isn't repeated here. */}
          {isSucceeded && (
            <p className={`mt-2 text-xs ${getNameStatusColorClass(name)}`}>
              {name.isRetired ? "Retired" : "Replaced"}
            </p>
          )}
          {note && <p className="mt-0.5 text-xs text-slate-500 italic">{note}</p>}
        </div>

        {image && (
          <div className="w-32 shrink-0 sm:w-40">
            <div
              className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
              style={{ aspectRatio: "4/3" }}
            >
              <ImageWithLoader
                src={image}
                alt={name.name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        )}
      </div>
      {image && <ImageCredit credit={name.imageCredit} align="end" />}
    </li>
  );
}

/** The names one slot has carried, oldest first, each dated by the storms it named. */
const NameTimeline = ({ names, storms, showImages = true }: NameTimelineProps) => {
  const stormsByName: Record<string, Storm[]> = {};
  storms.forEach((storm) => {
    if (!stormsByName[storm.name]) stormsByName[storm.name] = [];
    stormsByName[storm.name].push(storm);
  });

  const sortKey = (name: TyphoonName | RetiredName) => {
    const years = (stormsByName[name.name] || []).map((s) => s.year);
    if (years.length > 0) return Math.min(...years);
    if ("lastYear" in name && name.lastYear) return name.lastYear;
    return Infinity;
  };
  const sortedNames = [...names].sort((a, b) => sortKey(a) - sortKey(b));

  return (
    <ol className="ml-2 border-l-2 border-slate-200 [&>li]:-ml-[9px]">
      {sortedNames.map((name) => (
        <NameTimelineItem
          key={name.id}
          name={name}
          storms={stormsByName[name.name] || []}
          showImages={showImages}
        />
      ))}
    </ol>
  );
};

export default NameTimeline;
