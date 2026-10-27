import type { RetiredName, Storm } from "@/lib/types";
import { getNameStatusColorClass } from "@/lib/utils/colors";
import { getPositionSlug, getPositionTitle } from "@/lib/utils/position";

interface SeasonNameChangesProps {
  // Names whose last season this was.
  retiredNames: RetiredName[];
  // The storms that first carried their name, in start-date order.
  debuts: Storm[];
}

export const hasNameChanges = ({ retiredNames, debuts }: SeasonNameChangesProps): boolean =>
  retiredNames.length > 0 || debuts.length > 0;

const PositionLink = ({ position }: { position: number }) => (
  <a
    href={`/positions/${getPositionSlug(position)}`}
    className="text-xs text-slate-500 hover:text-sky-700 hover:underline"
  >
    {getPositionTitle(position)}
  </a>
);

function RetiredNameItem({ name }: { name: RetiredName }) {
  return (
    <li>
      <div className="flex flex-wrap items-baseline gap-x-2">
        <a
          href={`/info/${name.name.toLowerCase()}`}
          className={`font-bold hover:underline ${getNameStatusColorClass(name)}`}
        >
          {name.name}
        </a>
        <PositionLink position={name.position} />
      </div>
      <p className={`text-xs ${getNameStatusColorClass(name)}`}>
        {name.isRetired ? "Retired" : "Replaced"}
        {name.replacementName && (
          <>
            {" by "}
            <a
              href={`/info/${name.replacementName.toLowerCase()}`}
              className="font-semibold hover:underline"
            >
              {name.replacementName}
            </a>
          </>
        )}
      </p>
      {name.note && <p className="text-xs text-slate-500 italic">{name.note}</p>}
    </li>
  );
}

function DebutItem({ storm }: { storm: Storm }) {
  return (
    <li className="flex flex-wrap items-baseline gap-x-2">
      <a
        href={`/info/${storm.name.toLowerCase()}`}
        className="font-bold text-foreground hover:underline"
      >
        {storm.name}
      </a>
      <PositionLink position={storm.position} />
    </li>
  );
}

/** The names a season retired and the names it used for the first time, side by side. */
const SeasonNameChanges = ({ retiredNames, debuts }: SeasonNameChangesProps) => (
  <div className="grid gap-6 sm:grid-cols-2">
    <div>
      <h3 className="mb-2 text-sm font-semibold text-foreground">
        Retired / Replaced ({retiredNames.length})
      </h3>
      {retiredNames.length === 0 ? (
        <p className="text-sm text-slate-500">None this season.</p>
      ) : (
        <ul className="space-y-2">
          {retiredNames.map((name) => (
            <RetiredNameItem key={name.id} name={name} />
          ))}
        </ul>
      )}
    </div>
    <div>
      <h3 className="mb-2 text-sm font-semibold text-foreground">Debuted ({debuts.length})</h3>
      {debuts.length === 0 ? (
        <p className="text-sm text-slate-500">None this season.</p>
      ) : (
        <ul className="space-y-1">
          {debuts.map((storm) => (
            <DebutItem key={storm.name} storm={storm} />
          ))}
        </ul>
      )}
    </div>
  </div>
);

export default SeasonNameChanges;
