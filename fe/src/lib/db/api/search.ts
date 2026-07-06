import sql from "@/lib/db";
import type { SearchResult } from "@/lib/types";
import { unstable_cache } from "next/cache";

interface ApiResponse<T> {
  data: T;
  count: number;
}

interface SearchRow {
  id: number | null;
  name: string;
  position: number;
  country: string;
  isRetired: number;
  isLanguageProblem: number;
  note: string | null;
  replacementName: string | null;
  stormCount: number;
}

async function querySearch(query: string): Promise<ApiResponse<SearchResult[]>> {
  const q = `%${query}%`;

  const rows = (await sql.query(
    `SELECT
        tn.id,
        tn.name,
        tn.position,
        p.country,
        tn."isRetired",
        tn."isLanguageProblem",
        tn.note,
        tn."replacementName",
        COUNT(s.id) as "stormCount"
    FROM typhoonnames tn
    INNER JOIN positions p ON tn.position = p.id
    LEFT JOIN storms s ON s.name = tn.name
    WHERE tn.name LIKE $1
    GROUP BY tn.id, tn.name, tn.position, p.country, tn."isRetired", tn."isLanguageProblem", tn.note, tn."replacementName"

    UNION

    SELECT
        NULL as id,
        s.name,
        s.position,
        p.country,
        0 as "isRetired",
        0 as "isLanguageProblem",
        NULL as note,
        NULL as "replacementName",
        COUNT(s.id) as "stormCount"
    FROM storms s
    INNER JOIN positions p ON s.position = p.id
    WHERE s.name LIKE $2
      AND s.name NOT IN (SELECT tn2.name FROM typhoonnames tn2)
    GROUP BY s.name, s.position, p.country

    ORDER BY name ASC`,
    [q, q],
  )) as SearchRow[];

  const data: SearchResult[] = rows.map((row) => ({
    id: row.id !== null ? Number(row.id) : null,
    name: row.name,
    position: Number(row.position),
    country: row.country,
    isRetired: Number(row.isRetired),
    isLanguageProblem: Number(row.isLanguageProblem),
    note: row.note,
    replacementName: row.replacementName,
    stormCount: Number(row.stormCount),
  }));

  return { data, count: data.length };
}

export const search = unstable_cache(querySearch, ["search"], { revalidate: 3600 });
