import pool from "@/lib/db";
import type { Suggestion } from "@/lib/types";
import { unstable_cache } from "next/cache";
import type { RowDataPacket } from "mysql2";

interface ApiResponse<T> {
  data: T;
  count: number;
}

interface SuggestedNameRow extends RowDataPacket {
  replacementName: string;
  replacementMeaning: string;
  isChosen: number;
  image: string | null;
}

async function querySuggestedNames(nameId: number | null = null): Promise<ApiResponse<Suggestion[]>> {
  let sql = `SELECT
      replacementName,
      meaning as replacementMeaning,
      isChosen,
      image
    FROM suggestednames`;

  const params: unknown[] = [];
  if (nameId !== null) {
    sql += " WHERE nameId = ?";
    params.push(nameId);
  }
  sql += " ORDER BY id ASC, nameId DESC, isChosen DESC";

  const [rows] = await pool.query<SuggestedNameRow[]>(sql, params);

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
