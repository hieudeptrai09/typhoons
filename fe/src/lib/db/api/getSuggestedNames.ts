import sql from "@/lib/db";
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

async function querySuggestedNames(nameId: number | null = null): Promise<ApiResponse<Suggestion[]>> {
  let query = `SELECT
      "replacementName",
      meaning as "replacementMeaning",
      "isChosen",
      image
    FROM suggestednames`;

  const params: unknown[] = [];
  if (nameId !== null) {
    query += ` WHERE "nameId" = $${params.length + 1}`;
    params.push(nameId);
  }
  query += ` ORDER BY id ASC, "nameId" DESC, "isChosen" DESC`;

  const rows = (await sql.query(query, params)) as SuggestedNameRow[];

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
