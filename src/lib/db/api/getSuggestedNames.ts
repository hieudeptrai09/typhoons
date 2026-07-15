import sql from "@/lib/db";
import type { SuggestionWithNameId } from "@/lib/types";
import { unstable_cache } from "next/cache";

interface ApiResponse<T> {
  data: T;
  count: number;
}

interface SuggestedNameRow {
  nameId: number;
  replacementName: string;
  replacementMeaning: string;
  isChosen: number;
  image: string | null;
}

async function queryAllSuggestedNames(): Promise<ApiResponse<SuggestionWithNameId[]>> {
  const rows = await sql.query<SuggestedNameRow[]>(
    `SELECT
      nameid AS "nameId",
      replacementname AS "replacementName",
      meaning as "replacementMeaning",
      ischosen AS "isChosen",
      image
    FROM suggestednames
    ORDER BY id ASC, nameid DESC, ischosen DESC`,
  );

  const data: SuggestionWithNameId[] = rows.map((row) => ({
    nameId: Number(row.nameId),
    replacementName: row.replacementName,
    replacementMeaning: row.replacementMeaning,
    isChosen: Boolean(Number(row.isChosen)),
    image: row.image ?? undefined,
  }));

  return { data, count: data.length };
}

export const getAllSuggestedNames = unstable_cache(
  queryAllSuggestedNames,
  ["getAllSuggestedNames"],
  { revalidate: 3600 },
);
