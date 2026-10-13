import sql, { type ApiListResponse } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/db/cacheTags";
import { unstable_cache } from "next/cache";

interface YearRow {
  year: number;
}

// Only the years, for callers that would otherwise pull the whole storms table just to list
// seasons: getStorms' cache entry is ~250 KB and is rewritten in full after any storm edit.
async function queryStormYears(): Promise<ApiListResponse<number[]>> {
  const rows = await sql.query<YearRow[]>(`SELECT DISTINCT year FROM storms ORDER BY year`);

  const data = rows.map((row) => row.year);

  return { data, count: data.length };
}

export const getStormYears = unstable_cache(queryStormYears, ["getStormYears"], {
  revalidate: false,
  tags: [CACHE_TAGS.all, CACHE_TAGS.stormYears],
});
