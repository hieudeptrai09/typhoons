export const getPositionTitle = (position: number): string => {
  if (position === 141) return "CPHC";
  if (position === 142) return "NHC";
  if (position === 143) return "IMD";
  return `#${position}`;
};

export const normalizeParam = (param: string | string[] | undefined): string => {
  if (Array.isArray(param)) return param[0] || "";
  return param || "";
};

export const DELIMITER = "|";

export const toArr = (val: string) => (val ? val.split(DELIMITER).filter(Boolean) : []);

export const removeFromDelimitedString = (val: string, item: string) =>
  val
    .split(DELIMITER)
    .filter((v) => v !== item)
    .join(DELIMITER);

export const toStr = (val: string[] | undefined) => (val ?? []).join(DELIMITER);

export const toOpts = (items: string[]) => items.map((v) => ({ label: v, value: v }));

export const fmt = (val: string) => toArr(val).join(", ");

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const formatStormDateRange = (
  year?: number,
  monthStart?: number,
  dateStart?: number,
  monthEnd?: number,
  dateEnd?: number,
  isFromPrevYear?: number,
): string | null => {
  if (!year || !monthStart || !dateStart || !monthEnd || !dateEnd) return null;
  const startYear = isFromPrevYear ? year - 1 : year;
  const endYear = monthEnd < monthStart ? startYear + 1 : startYear;
  if (startYear === endYear) {
    return `${dateStart}/${monthStart} - ${dateEnd}/${monthEnd}/${endYear}`;
  }
  return `${dateStart}/${monthStart}/${startYear} - ${dateEnd}/${monthEnd}/${endYear}`;
};
