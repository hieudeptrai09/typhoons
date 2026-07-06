import pool from "@/lib/db";
import type { Storm } from "@/lib/types";
import { unstable_cache } from "next/cache";
import type { RowDataPacket } from "mysql2";

interface ApiResponse<T> {
  data: T;
  count: number;
}

interface StormRow extends RowDataPacket {
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
  let sql = `SELECT
      s.position,
      p.country,
      s.name,
      s.intensity,
      s.map,
      s.correctSpelling,
      s.year,
      s.isStrongest,
      s.isFirst,
      s.isLast,
      s.dateStart,
      s.dateEnd,
      s.monthStart,
      s.monthEnd,
      s.isFromPrevYear
    FROM storms s
    INNER JOIN positions p ON s.position = p.id`;

  const params: unknown[] = [];
  if (position !== null) {
    sql += " WHERE s.position = ?";
    params.push(position);
  }
  sql += " ORDER BY s.year ASC, s.position";

  const [rows] = await pool.query<StormRow[]>(sql, params);

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
