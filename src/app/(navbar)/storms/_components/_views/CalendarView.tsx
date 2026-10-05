import EmptyResults from "@/lib/components/EmptyResults";
import TyphoonSpinner from "@/lib/components/TyphoonSpinner";
import { NAMING_LIST_FIRST_YEAR } from "@/lib/constants";
import { useToday } from "@/lib/hooks/useToday";
import type { DashboardParams, Storm } from "@/lib/types";
import { formatMonthDay, monthDayOf, parseMonthDay } from "@/lib/utils/date";
import { CalendarSearch } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import SeasonMonthsModal from "../_modals/SeasonMonthsModal";
import CalendarDateBar from "../_widgets/CalendarDateBar";
import {
  getActiveStorms,
  getSeasonToDate,
  getStormEnds,
  getStormStarts,
  groupBySeason,
  type CalendarSeasonKind,
  type SeasonToDateRow,
} from "../../_utils/calendar";
import CalendarSeasonList from "./CalendarSeasonList";
import SeasonToDateTable from "./SeasonToDateTable";

interface CalendarViewProps {
  params: DashboardParams;
  stormsData: Storm[];
}

const plural = (count: number, noun: string) => `${count} ${noun}${count === 1 ? "" : "s"}`;

const isSeasonKind = (filter: string): filter is CalendarSeasonKind =>
  filter === "started" || filter === "ended" || filter === "active";

const CalendarView = ({ params, stormsData }: CalendarViewProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 366 dates x 4 filters is not a page each, and the whole dashboard already reads its state off the URL.
  const dateParam = searchParams.get("date");
  const urlMonthDay = parseMonthDay(dateParam) ? dateParam : null;

  const todayDate = useToday();
  const today = todayDate && monthDayOf(todayDate);
  const monthDay = urlMonthDay ?? today;

  const [openPace, setOpenPace] = useState<SeasonToDateRow | null>(null);

  const seasons = useMemo(() => {
    if (!monthDay || !isSeasonKind(params.filter)) return [];
    const pick = { started: getStormStarts, ended: getStormEnds, active: getActiveStorms }[
      params.filter
    ];
    return groupBySeason(pick(stormsData, monthDay));
  }, [stormsData, monthDay, params.filter]);

  const paceRows = useMemo(
    () => (monthDay && params.filter === "todate" ? getSeasonToDate(stormsData, monthDay) : []),
    [stormsData, monthDay, params.filter],
  );

  // Only reached before the date lands, which is one paint on a page with no date in its URL.
  if (!monthDay || !today) {
    return (
      <div className="flex justify-center py-16">
        <TyphoonSpinner size="large" />
      </div>
    );
  }

  const dateLabel = formatMonthDay(monthDay);
  const stormCount = seasons.reduce((sum, season) => sum + season.storms.length, 0);

  const summaries: Record<string, string> = {
    started: `${plural(stormCount, "storm")} formed on ${dateLabel}, across ${plural(seasons.length, "season")}.`,
    ended: `${plural(stormCount, "storm")} dissipated on ${dateLabel}, across ${plural(seasons.length, "season")}.`,
    active: `${plural(stormCount, "storm")} were out over the basin on ${dateLabel}, across ${plural(seasons.length, "season")}.`,
    todate: `Storms JMA numbered, by season since ${NAMING_LIST_FIRST_YEAR}, counted up to ${dateLabel}. Open a season for its months.`,
  };

  const emptyDescriptions: Record<string, string> = {
    started: `No storm has ever formed on ${dateLabel}.`,
    ended: `No storm has ever dissipated on ${dateLabel}.`,
    active: `No storm has ever been out over the basin on ${dateLabel}.`,
  };

  const renderResults = () => {
    if (params.filter === "todate") {
      return <SeasonToDateTable rows={paceRows} onSeasonClick={setOpenPace} />;
    }
    if (seasons.length === 0 || !isSeasonKind(params.filter)) {
      return <EmptyResults description={emptyDescriptions[params.filter]} icon={CalendarSearch} />;
    }
    return <CalendarSeasonList seasons={seasons} kind={params.filter} monthDay={monthDay} />;
  };

  return (
    <div className="flex flex-col">
      <CalendarDateBar
        monthDay={monthDay}
        today={today}
        onChange={(next) => router.replace(`${pathname}?date=${next}`, { scroll: false })}
        summary={summaries[params.filter]}
      />

      {renderResults()}

      <SeasonMonthsModal
        isOpen={openPace !== null}
        onClose={() => setOpenPace(null)}
        row={openPace}
        monthDay={monthDay}
      />
    </div>
  );
};

export default CalendarView;
