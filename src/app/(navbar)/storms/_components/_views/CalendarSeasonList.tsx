import { INTENSITY_LABEL } from "@/lib/constants";
import type { Storm } from "@/lib/types";
import { TEXT_COLOR_WHITE_BACKGROUND } from "@/lib/utils/colors";
import { daysBetween, formatLongDate } from "@/lib/utils/date";
import { isExternalPosition } from "@/lib/utils/position";
import { Popover } from "antd";
import { LogIn, LogOut, Pause, Play, Waves, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  getDayOfStorm,
  getStormEvent,
  type CalendarSeasonKind,
  type SeasonGroup,
  type StormEvent,
} from "../../_utils/calendar";

// Positions 141-143 hold storms that wandered in from another basin: they were not born in
// the West Pacific and did not necessarily die there, so they enter and leave it instead.
const DATE_LABELS = {
  own: { start: "Formed", end: "Dissipated" },
  external: { start: "Entered basin", end: "Dissipated or left" },
};

// Own storms play and pause like the tabs; basin visitors walk in and out a door instead.
const EVENT_ICONS: Record<"own" | "external", Record<StormEvent, LucideIcon>> = {
  own: { started: Play, ended: Pause, ongoing: Waves },
  external: { started: LogIn, ended: LogOut, ongoing: Waves },
};

const FactRow = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex justify-between gap-4 text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="text-right font-semibold text-foreground">{children}</span>
  </div>
);

// Everything the old per-season modal said that isn't already on the pill.
const StormFacts = ({ storm }: { storm: Storm }) => {
  const labels = isExternalPosition(storm.position) ? DATE_LABELS.external : DATE_LABELS.own;

  return (
    <div className="flex min-w-56 flex-col gap-1.5">
      <span className="font-bold" style={{ color: TEXT_COLOR_WHITE_BACKGROUND[storm.intensity] }}>
        {storm.name}
        {storm.jtwcDesignation && ` (${storm.jtwcDesignation})`}
      </span>
      <FactRow label="Peak">
        <span style={{ color: TEXT_COLOR_WHITE_BACKGROUND[storm.intensity] }}>
          {INTENSITY_LABEL[storm.intensity]}
        </span>
      </FactRow>
      <FactRow label={labels.start}>{formatLongDate(storm.dateStart)}</FactRow>
      <FactRow label={labels.end}>
        {storm.dateEnd ? formatLongDate(storm.dateEnd) : "Still active"}
      </FactRow>
    </div>
  );
};

// Active: which day of the storm the date was ("6/10"). Started/ended: how long it lasted ("10d").
const getPillCounter = (
  storm: Storm,
  kind: CalendarSeasonKind,
  monthDay: string,
): { text: string; title: string } | null => {
  if (kind === "active") {
    const { day, total } = getDayOfStorm(storm, monthDay);
    return total === null
      ? { text: `${day}`, title: `Day ${day}, still active` }
      : { text: `${day}/${total}`, title: `Day ${day} of ${total}` };
  }

  const days = daysBetween(storm.dateStart, storm.dateEnd);
  if (days === null) return null;
  const total = days + 1;
  return { text: `${total}d`, title: `Lasted ${total === 1 ? "1 day" : `${total} days`}` };
};

const StormPill = ({
  storm,
  kind,
  monthDay,
}: {
  storm: Storm;
  kind: CalendarSeasonKind;
  monthDay: string;
}) => {
  const counter = getPillCounter(storm, kind, monthDay);
  const Icon =
    EVENT_ICONS[isExternalPosition(storm.position) ? "external" : "own"][
      getStormEvent(storm, kind, monthDay)
    ];

  return (
    <Popover
      styles={{ container: { backgroundColor: "#f3f4f6" } }}
      content={<StormFacts storm={storm} />}
      trigger={["hover", "click"]}
      placement="bottom"
    >
      <button
        type="button"
        aria-label={`${storm.name}: peak, formed and dissipated dates`}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-sm transition-colors hover:bg-slate-200"
      >
        <Icon size={14} className="shrink-0 text-sky-500" aria-hidden />
        <span className="font-bold" style={{ color: TEXT_COLOR_WHITE_BACKGROUND[storm.intensity] }}>
          {storm.name}
        </span>
        {counter && (
          <span className="text-xs text-slate-500 tabular-nums" title={counter.title}>
            {counter.text}
          </span>
        )}
      </button>
    </Popover>
  );
};

interface CalendarSeasonListProps {
  seasons: SeasonGroup[];
  kind: CalendarSeasonKind;
  monthDay: string;
}

const CalendarSeasonList = ({ seasons, kind, monthDay }: CalendarSeasonListProps) => (
  // Newest season first: recent years are what a reader checks a date against.
  <ul className="mx-auto flex w-full max-w-3xl flex-col gap-3">
    {[...seasons].reverse().map((season) => (
      <li
        key={season.year}
        className="flex items-center gap-4 rounded-xl bg-white px-4 py-3 shadow-sm"
      >
        <span className="w-12 shrink-0 font-bold text-slate-600 tabular-nums">{season.year}</span>
        <div className="flex min-w-0 flex-wrap gap-2">
          {season.storms.map((storm, index) => (
            <StormPill
              key={`${storm.name}-${index}`}
              storm={storm}
              kind={kind}
              monthDay={monthDay}
            />
          ))}
        </div>
      </li>
    ))}
  </ul>
);

export default CalendarSeasonList;
