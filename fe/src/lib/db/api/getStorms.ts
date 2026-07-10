import sql, { type QueryParam } from "@/lib/db";
import type { Storm } from "@/lib/types";
import { unstable_cache } from "next/cache";

interface ApiResponse<T> {
  data: T;
  count: number;
}

interface StormRow {
  position: number;
  country: string;
  name: string;
  intensity: string;
  map: string;
  correctSpelling: string | null;
  year: number;
  isStrongest: number;
  isFirst: number;
  isLast: number;
  dateStart: number | null;
  dateEnd: number | null;
  monthStart: number | null;
  monthEnd: number | null;
  isFromPrevYear: number;
}

async function queryStorms(position: number | null = null): Promise<ApiResponse<Storm[]>> {
  let query = `SELECT
      s.position,
      p.country,
      s.name,
      s.intensity,
      s.map,
      s.correctspelling AS "correctSpelling",
      s.year,
      s.isstrongest AS "isStrongest",
      s.isfirst AS "isFirst",
      s.islast AS "isLast",
      s.datestart AS "dateStart",
      s.dateend AS "dateEnd",
      s.monthstart AS "monthStart",
      s.monthend AS "monthEnd",
      s.isfromprevyear AS "isFromPrevYear"
    FROM storms s
    INNER JOIN positions p ON s.position = p.id`;

  const params: QueryParam[] = [];
  if (position !== null) {
    query += ` WHERE s.position = $${params.length + 1}`;
    params.push(position);
  }
  query += " ORDER BY s.year ASC, s.position";

  const rows = await sql.query<StormRow[]>(query, params);

  const data: Storm[] = rows.map((row) => ({
    position: Number(row.position),
    country: row.country,
    name: row.name,
    intensity: row.intensity as Storm["intensity"],
    map: row.map,
    correctSpelling: row.correctSpelling ?? undefined,
    year: Number(row.year),
    isStrongest: Number(row.isStrongest) as unknown as Storm["isStrongest"],
    isFirst: Number(row.isFirst) as unknown as Storm["isFirst"],
    isLast: Number(row.isLast) as unknown as Storm["isLast"],
    dateStart: row.dateStart !== null ? Number(row.dateStart) : undefined,
    dateEnd: row.dateEnd !== null ? Number(row.dateEnd) : undefined,
    monthStart: row.monthStart !== null ? Number(row.monthStart) : undefined,
    monthEnd: row.monthEnd !== null ? Number(row.monthEnd) : undefined,
    isFromPrevYear: Number(row.isFromPrevYear),
  }));

  return { data, count: data.length };
}

export const getStorms = unstable_cache(queryStorms, ["getStorms"], { revalidate: 3600 });
