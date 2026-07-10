import sql, { type QueryParam } from "@/lib/db";
import type { Suggestion } from "@/lib/types";
import { unstable_cache } from "next/cache";

interface ApiResponse<T> {
  data: T;
  count: number;
}

interface SuggestedNameRow {
  replacementName: string;
  replacementMeaning: string;
  isChosen: number;
  image: string | null;
}

async function querySuggestedNames(
  nameId: number | null = null,
): Promise<ApiResponse<Suggestion[]>> {
  let query = `SELECT
      replacementname AS "replacementName",
      meaning as "replacementMeaning",
      ischosen AS "isChosen",
      image
    FROM suggestednames`;

  const params: QueryParam[] = [];
  if (nameId !== null) {
    query += ` WHERE nameid = $${params.length + 1}`;
    params.push(nameId);
  }
  query += ` ORDER BY id ASC, nameid DESC, ischosen DESC`;

  const rows = await sql.query<SuggestedNameRow[]>(query, params);

  const data: Suggestion[] = rows.map((row) => ({
    replacementName: row.replacementName,
    replacementMeaning: row.replacementMeaning,
    isChosen: Boolean(Number(row.isChosen)),
    image: row.image ?? undefined,
  }));

  return { data, count: data.length };
}

export const getSuggestedNames = unstable_cache(querySuggestedNames, ["getSuggestedNames"], {
  revalidate: 3600,
});
