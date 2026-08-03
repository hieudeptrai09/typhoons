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

const positionGridLabel = (position: number): string | null => {
  if (!Number.isInteger(position) || position < 1 || position > GRID_MAX) return null;
  const row = Math.floor((position - 1) / GRID_COLS) + 1;
  return `${row}${positionColumnLetter((position - 1) % GRID_COLS)}`;
};

export const getPositionTitle = (position: number): string => {
  const slug = POSITION_SLUGS[position];
  if (slug) return slug.toUpperCase();
  return positionGridLabel(position) ?? `#${position}`;
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

// Filters pick a grid cell by its two visible coordinates (row number + country column) rather than
// by the "3I" code, so a value only resolves to a position once both halves are chosen.
export interface PositionValue {
  row?: number;
  col?: number;
}

// The empty value spells out both keys because Form.setFieldsValue merges plain objects into the
// store: a bare {} would merge nothing and leave the previous pick in place.
export const positionToValue = (position: number | null): PositionValue =>
  position != null && position >= 1 && position <= GRID_MAX
    ? { row: Math.floor((position - 1) / GRID_COLS) + 1, col: (position - 1) % GRID_COLS }
    : { row: undefined, col: undefined };

export const positionFromValue = (value?: PositionValue): number | null =>
  value?.row != null && value.col != null ? (value.row - 1) * GRID_COLS + value.col + 1 : null;

export const isPartialPosition = (value?: PositionValue) =>
  (value?.row != null) !== (value?.col != null);

// URLs carry the lowercase grid label ("3i"), so the page redirects /positions/3I/ and /positions/37/ onto it.
export const getPositionSlug = (position: number): string =>
  POSITION_SLUGS[position] ?? positionGridLabel(position)?.toLowerCase() ?? String(position);

export const getPositionFromSlug = (slug: string): number | null => {
  if (slug in SLUG_POSITIONS) return SLUG_POSITIONS[slug];
  const gridPosition = parsePositionLabel(slug);
  if (gridPosition !== null) return gridPosition;
  const num = Number(slug);
  // Out-of-grid integers pass through so the caller can range-check and 404;
  // Number("") is 0, so an empty slug needs its own rejection.
  return slug.trim() !== "" && Number.isInteger(num) ? num : null;
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

export const getZoomEarthUrl = (name: string, year: number): string =>
  `https://zoom.earth/storms/${name.trim().toLowerCase().replace(/\s+/g, "-")}-${year}/`;

export interface DateParts {
  year: number;
  month: number;
  day: number;
}

// Storm dates travel as "YYYY-MM-DD" strings (never Date objects) so they can't shift a day when serialized or rendered in another timezone.
export const parseDateParts = (date?: string): DateParts | null => {
  if (!date) return null;
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return null;
  return { year, month, day };
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const daysBetween = (dateStart?: string, dateEnd?: string): number | null => {
  const start = parseDateParts(dateStart);
  const end = parseDateParts(dateEnd);
  if (!start || !end) return null;
  return Math.round(
    (Date.UTC(end.year, end.month - 1, end.day) -
      Date.UTC(start.year, start.month - 1, start.day)) /
      MS_PER_DAY,
  );
};

export const formatStormDateRange = (dateStart?: string, dateEnd?: string): string | null => {
  const start = parseDateParts(dateStart);
  if (!start) return null;
  const end = parseDateParts(dateEnd);
  if (!end) return `${start.day}/${start.month} - now`;
  if (start.year === end.year) {
    return `${start.day}/${start.month} - ${end.day}/${end.month}/${end.year}`;
  }
  return `${start.day}/${start.month}/${start.year} - ${end.day}/${end.month}/${end.year}`;
};
