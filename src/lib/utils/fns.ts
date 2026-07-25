const POSITION_SLUGS: Record<number, string> = {
  141: "cphc",
  142: "nhc",
  143: "imd",
};

const SLUG_POSITIONS: Record<string, number> = Object.fromEntries(
  Object.entries(POSITION_SLUGS).map(([id, slug]) => [slug, Number(id)]),
);

// The naming table is a fixed grid of GRID_ROWS × GRID_COLS, filled left-to-right, top-to-bottom, so a position maps to a "row + country-column letter" label (e.g. 37 → "3I").
export const GRID_ROWS = 10;
export const GRID_COLS = 14;
const GRID_MAX = GRID_ROWS * GRID_COLS; // 140

export const positionColumnLetter = (col: number): string => String.fromCharCode(65 + col);

export const getPositionTitle = (position: number): string => {
  const slug = POSITION_SLUGS[position];
  if (slug) return slug.toUpperCase();
  if (Number.isInteger(position) && position >= 1 && position <= GRID_MAX) {
    const row = Math.floor((position - 1) / GRID_COLS) + 1;
    return `${row}${positionColumnLetter((position - 1) % GRID_COLS)}`;
  }
  return `#${position}`;
};

// Parse a grid label ("3I" / "3i") or a plain number ("37") into a 1–140 position, else null.
export const parsePositionLabel = (input: string): number | null => {
  const trimmed = input.trim().toUpperCase();
  if (!trimmed) return null;

  const gridMatch = trimmed.match(/^(\d{1,2})([A-N])$/);
  if (gridMatch) {
    const row = Number(gridMatch[1]);
    const col = gridMatch[2].charCodeAt(0) - 65;
    if (row < 1 || row > GRID_ROWS || col < 0 || col >= GRID_COLS) return null;
    return (row - 1) * GRID_COLS + col + 1;
  }

  const num = Number(trimmed);
  return Number.isInteger(num) && num >= 1 && num <= GRID_MAX ? num : null;
};

export const getPositionSlug = (position: number): string =>
  POSITION_SLUGS[position] ?? String(position);

export const getPositionFromSlug = (slug: string): number | null => {
  if (slug in SLUG_POSITIONS) return SLUG_POSITIONS[slug];
  const gridPosition = parsePositionLabel(slug);
  if (gridPosition !== null) return gridPosition;
  const num = Number(slug);
  return Number.isInteger(num) ? num : null;
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
