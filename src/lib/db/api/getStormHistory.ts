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

async function queryAllStormHistory(): Promise<ApiResponse<StormHistoryEntry[]>> {
  const rows = await sql.query<StormHistoryRow[]>(
    `SELECT
      s.name,
      s.position,
      s.year
    FROM storms s
    ORDER BY s.year ASC`,
  );

  const data: StormHistoryEntry[] = rows.map((row) => ({
    name: row.name,
    position: Number(row.position),
    year: Number(row.year),
  }));

  return { data, count: data.length };
}

export const getAllStormHistory = unstable_cache(queryAllStormHistory, ["getAllStormHistory"], {
  revalidate: 3600,
});
