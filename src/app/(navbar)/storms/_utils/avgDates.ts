import type { Storm } from "@/lib/types";
import { daysBetween, parseDateParts } from "@/lib/utils/date";
import { getGroupedStorms } from "@/lib/utils/storms";

// Dates are averaged as a day-of-year in a fixed non-leap reference year, so a
// 29/2 date collapses to 28/2 and the output can never land on 29/2 either.
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MONTH_OFFSET = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const DAYS_IN_YEAR = 365;

const toDayOfYear = (month?: number, date?: number): number | null => {
  if (!month || !date || month < 1 || month > 12) return null;
  const clampedDate = Math.min(date, DAYS_IN_MONTH[month - 1]); // 29/2 → 28/2
  return MONTH_OFFSET[month - 1] + clampedDate;
};

const stormStartDoy = (s: Storm): number | null => {
  const start = parseDateParts(s.dateStart);
  return start ? toDayOfYear(start.month, start.day) : null;
};

// A storm that crossed into the new year has its January end treated as "month
// 13": one full year later. This keeps a Dec→Jan storm's end after its start
// when averaging and measuring span.
const stormEndDoy = (s: Storm): number | null => {
  const end = parseDateParts(s.dateEnd);
  if (!end) return null;
  const doy = toDayOfYear(end.month, end.day);
  if (doy === null) return null;
  const start = parseDateParts(s.dateStart);
  const spansNewYear = start !== null && end.year > start.year;
  return spansNewYear ? doy + DAYS_IN_YEAR : doy;
};

// Wrap an averaged day-of-year (which may land past day 365 for new-year-spanning
// groups) back onto a real calendar date, so the output is never below 1/1.
const fromDayOfYear = (doy: number): { month: number; date: number } => {
  const wrapped = ((((Math.round(doy) - 1) % DAYS_IN_YEAR) + DAYS_IN_YEAR) % DAYS_IN_YEAR) + 1;
  for (let m = 0; m < 12; m++) {
    if (wrapped <= MONTH_OFFSET[m] + DAYS_IN_MONTH[m]) {
      return { month: m + 1, date: wrapped - MONTH_OFFSET[m] };
    }
  }
  return { month: 12, date: wrapped - MONTH_OFFSET[11] };
};

export interface AvgDates {
  startDoy: number; // -1 when no storm has a start date
  endDoy: number; // -1 when no storm has an end date
}

const average = (values: number[]): number =>
  values.length ? values.reduce((a, b) => a + b, 0) / values.length : -1;

export const calculateAvgDates = (storms: Storm[]): AvgDates => {
  const starts = storms.map(stormStartDoy).filter((v): v is number => v !== null);
  const ends = storms.map(stormEndDoy).filter((v): v is number => v !== null);

  return { startDoy: average(starts), endDoy: average(ends) };
};

export const calculateAvgDatesByGroup = (
  stormsData: Storm[],
  groupBy: "position" | "name",
): Record<string, AvgDates> => {
  const grouped = getGroupedStorms(stormsData, groupBy);
  const result: Record<string, AvgDates> = {};
  Object.entries(grouped).forEach(([key, groupStorms]) => {
    result[key] = calculateAvgDates(groupStorms);
  });
  return result;
};

export const formatDayOfYear = (doy: number): string => {
  if (doy < 0) return "N/A";
  const { month, date } = fromDayOfYear(doy);
  return `${date}/${month}`;
};

// Calendar month (1–12) an averaged day-of-year falls in; -1 when there is no date.
export const getDoyMonth = (doy: number): number => (doy < 0 ? -1 : fromDayOfYear(doy).month);

// Average storm duration in whole days.
export const calculateAvgDuration = (storms: Storm[]): number => {
  const durations = storms
    .map((s) => daysBetween(s.dateStart, s.dateEnd))
    .filter((v): v is number => v !== null);
  return average(durations);
};
