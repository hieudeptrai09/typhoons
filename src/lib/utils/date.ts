import { MONTH_NAMES } from "@/lib/constants";

export interface DateParts {
  year: number;
  month: number;
  day: number;
}

// Storm dates travel as "YYYY-MM-DD" strings (never Date objects) so they can't shift a day when serialized or rendered in another timezone.

export const parseStormDate = (date: string): DateParts => {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
};

export const parseDateParts = (date?: string): DateParts | null => {
  if (!date) return null;
  const { year, month, day } = parseStormDate(date);
  if (!year || !month || !day) return null;
  return { year, month, day };
};

const DAYS_IN_MONTH_MAX = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// Today as a "YYYY-MM-DD" string, matching how storm dates travel.
export const todayISO = (): string => {
  const now = new Date(Date.now());
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

export const toMonthDay = (month: number, day: number): string =>
  `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export const monthDayOf = (date: string): string => date.slice(5);

export const parseMonthDay = (
  monthDay: string | null | undefined,
): { month: number; day: number } | null => {
  if (!monthDay || !/^\d{2}-\d{2}$/.test(monthDay)) return null;
  const month = Number(monthDay.slice(0, 2));
  const day = Number(monthDay.slice(3));
  if (month < 1 || month > 12 || day < 1 || day > DAYS_IN_MONTH_MAX[month - 1]) return null;
  return { month, day };
};

// "26 August" — spelled out, since a year-less "26/8" reads as an incomplete date.
export const formatMonthDay = (monthDay: string): string => {
  const parts = parseMonthDay(monthDay);
  return parts ? `${parts.day} ${MONTH_NAMES[parts.month]}` : monthDay;
};

// "31 August 2024" — the long form prose uses, where a "31/8/2024" would read as a code.
export const formatLongDate = (date: string): string => {
  const { year, month, day } = parseStormDate(date);
  return MONTH_NAMES[month] ? `${day} ${MONTH_NAMES[month]} ${year}` : date;
};

export const isLeapYear = (year: number): boolean =>
  year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

const ordinalSuffix = (day: number): string => {
  // 11th, 12th and 13th break the pattern the last digit would otherwise set.
  if (day % 100 >= 11 && day % 100 <= 13) return "th";
  return { 1: "st", 2: "nd", 3: "rd" }[day % 10] ?? "th";
};

export const formatOrdinalDate = (monthDay: string, year: number): string => {
  const parts = parseMonthDay(monthDay);
  if (!parts) return monthDay;

  const day = parts.month === 2 && parts.day === 29 && !isLeapYear(year) ? 28 : parts.day;
  return `${MONTH_NAMES[parts.month]} ${day}${ordinalSuffix(day)}, ${year}`;
};

// Steps one day through the 366-day calendar, wrapping 31/12 round to 1/1.
export const shiftMonthDay = (monthDay: string, delta: 1 | -1): string => {
  const parts = parseMonthDay(monthDay);
  if (!parts) return monthDay;

  let { month, day } = parts;
  day += delta;
  if (day < 1) {
    month = month === 1 ? 12 : month - 1;
    day = DAYS_IN_MONTH_MAX[month - 1];
  } else if (day > DAYS_IN_MONTH_MAX[month - 1]) {
    month = month === 12 ? 1 : month + 1;
    day = 1;
  }
  return toMonthDay(month, day);
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const daysBetween = (dateStart: string, dateEnd?: string): number | null => {
  const start = parseStormDate(dateStart);
  const end = parseDateParts(dateEnd);
  if (!end) return null;
  return Math.round(
    (Date.UTC(end.year, end.month - 1, end.day) -
      Date.UTC(start.year, start.month - 1, start.day)) /
      MS_PER_DAY,
  );
};

export interface Duration {
  years: number;
  months: number;
  days: number;
}

const daysInMonth = (year: number, month: number): number =>
  new Date(Date.UTC(year, month, 0)).getUTCDate();

// The calendar distance from one date to a later one: whole years and months
// first, then the leftover days. A start on the 31st steps to the end of a
// shorter month (31/1 + 1 month = 28/2), the way people count it by hand.
export const calendarDuration = (dateStart: string, dateEnd: string): Duration => {
  const start = parseStormDate(dateStart);
  const end = parseStormDate(dateEnd);
  let totalMonths = (end.year - start.year) * 12 + (end.month - start.month);
  if (end.day < start.day) totalMonths -= 1;

  const anchorYear = start.year + Math.floor((start.month - 1 + totalMonths) / 12);
  const anchorMonth = ((start.month - 1 + totalMonths) % 12) + 1;
  const anchorDay = Math.min(start.day, daysInMonth(anchorYear, anchorMonth));
  const pad = (n: number) => String(n).padStart(2, "0");
  const anchor = `${anchorYear}-${pad(anchorMonth)}-${pad(anchorDay)}`;

  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    days: daysBetween(anchor, dateEnd) ?? 0,
  };
};

// A day count with no dates to anchor it (an average) is cut down to whole days,
// split into 365-day years, and the rest walked through the Gregorian months of a
// common year from January (31, 28, 31, 30, …) until less than a month is left.
// 1416 → 3 years (1095) + 321 → Jan…Oct (304) → 3 years 10 months 17 days.
const DAYS_PER_YEAR = 365;
const COMMON_YEAR_MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const durationFromDays = (totalDays: number): Duration => {
  const whole = Math.floor(totalDays);
  const years = Math.floor(whole / DAYS_PER_YEAR);
  let days = whole - years * DAYS_PER_YEAR;
  let months = 0;
  while (days >= COMMON_YEAR_MONTH_DAYS[months]) {
    days -= COMMON_YEAR_MONTH_DAYS[months];
    months += 1;
  }
  return { years, months, days };
};

const unit = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

// "4 years 1 month 14 days"; zero parts are dropped, and nothing at all reads "0 days".
export const formatDuration = ({ years, months, days }: Duration): string => {
  const parts = [
    years > 0 && unit(years, "year"),
    months > 0 && unit(months, "month"),
    days > 0 && unit(days, "day"),
  ].filter(Boolean);
  return parts.length ? parts.join(" ") : "0 days";
};

// "2193" — whole days, floored to match durationFromDays; no thousands separator.
export const formatDayNumber = (days: number): string => String(Math.floor(days));

// "2193 days"
export const formatDayCount = (days: number): string =>
  `${formatDayNumber(days)} ${Math.floor(days) === 1 ? "day" : "days"}`;

export const formatStormDateRange = (dateStart: string, dateEnd?: string): string => {
  const start = parseStormDate(dateStart);
  const end = parseDateParts(dateEnd);
  if (!end) return `${start.day}/${start.month} - now`;
  if (start.year === end.year) {
    return `${start.day}/${start.month} - ${end.day}/${end.month}/${end.year}`;
  }
  return `${start.day}/${start.month}/${start.year} - ${end.day}/${end.month}/${end.year}`;
};
