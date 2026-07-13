const POSITION_SLUGS: Record<number, string> = {
  141: "cphc",
  142: "nhc",
  143: "imd",
};

const SLUG_POSITIONS: Record<string, number> = Object.fromEntries(
  Object.entries(POSITION_SLUGS).map(([id, slug]) => [slug, Number(id)]),
);

export const getPositionTitle = (position: number): string => {
  const slug = POSITION_SLUGS[position];
  return slug ? slug.toUpperCase() : `#${position}`;
};

export const getPositionSlug = (position: number): string =>
  POSITION_SLUGS[position] ?? String(position);

export const getPositionFromSlug = (slug: string): number | null => {
  if (slug in SLUG_POSITIONS) return SLUG_POSITIONS[slug];
  const position = Number(slug);
  return Number.isInteger(position) ? position : null;
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
  if (!year || !monthStart || !dateStart) return null;
  if (!monthEnd || !dateEnd) return `${dateStart}/${monthStart} - now`;
  const startYear = isFromPrevYear ? year - 1 : year;
  const endYear = monthEnd < monthStart ? startYear + 1 : startYear;
  if (startYear === endYear) {
    return `${dateStart}/${monthStart} - ${dateEnd}/${monthEnd}/${endYear}`;
  }
  return `${dateStart}/${monthStart}/${startYear} - ${dateEnd}/${monthEnd}/${endYear}`;
};
