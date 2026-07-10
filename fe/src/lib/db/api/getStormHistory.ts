import sql from "@/lib/db";
import type { StormHistoryEntry } from "@/lib/types";
import { unstable_cache } from "next/cache";

interface ApiResponse<T> {
  data: T;
  count: number;
}

interface StormHistoryRow {
  name: string;
  position: number;
  year: number;
}

async function queryStormHistory(position: number): Promise<ApiResponse<StormHistoryEntry[]>> {
  const rows = (await sql.query(
    `SELECT
      s.name,
      s.position,
      s.year
    FROM storms s
    WHERE s.position = $1
    ORDER BY s.year ASC`,
    [position],
  )) as StormHistoryRow[];

  const data: StormHistoryEntry[] = rows.map((row) => ({
    name: row.name,
    position: Number(row.position),
    year: Number(row.year),
  }));

  return { data, count: data.length };
}

export const getStormHistory = unstable_cache(queryStormHistory, ["getStormHistory"], {
  revalidate: 3600,
});
