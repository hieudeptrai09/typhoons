import NameTimeline from "@/lib/components/NameTimeline";
import type { RetiredName, Storm } from "@/lib/types";
import { getPositionSlug, getPositionTitle } from "@/lib/utils/position";

interface CountryNamesProps {
  names: RetiredName[];
  // Every one of the member's positions in grid order, with its storms.
  positionGroups: [number, Storm[]][];
}

/** A member's names, one timeline per position it fills. */
const CountryNames = ({ names, positionGroups }: CountryNamesProps) => {
  if (names.length === 0) {
    return <p className="py-4 text-center text-foreground">No names recorded for this country.</p>;
  }

  return (
    <div className="space-y-6">
      {positionGroups.map(([position, storms]) => {
        const positionNames = names.filter((name) => name.position === position);
        if (positionNames.length === 0) return null;

        return (
          <div key={position}>
            <h3 className="mb-3 rounded-md bg-slate-50 px-3 py-2 font-semibold text-foreground">
              <a href={`/positions/${getPositionSlug(position)}`} className="hover:underline">
                {getPositionTitle(position)}
              </a>
            </h3>
            {/* Ten slots of pictures would bury the list; each name's page has its own. */}
            <NameTimeline names={positionNames} storms={storms} showImages={false} />
          </div>
        );
      })}
    </div>
  );
};

export default CountryNames;
