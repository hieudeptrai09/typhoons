import pool from "@/lib/db";
import type { RetiredName } from "@/lib/types";
import { unstable_cache } from "next/cache";
import type { RowDataPacket } from "mysql2";

interface ApiResponse<T> {
  data: T;
  count: number;
}

interface TyphoonNameRow extends RowDataPacket {
  id: number;
  name: string;
  meaning: string;
  position: number;
  country: string;
  isRetired: number;
  isReplaced: number;
  isLanguageProblem: number;
  replacementName: string | null;
  note: string | null;
  language: string;
  lastYear: number;
  image: string | null;
  description: string | null;
  tag: string;
}

async function queryTyphoonNames(isRetired: number | null = null): Promise<ApiResponse<RetiredName[]>> {
  let sql = `SELECT
      tn.id,
      tn.name,
      tn.meaning,
      tn.position,
      p.country,
      tn.isRetired,
      tn.isReplaced,
      tn.isLanguageProblem,
      tn.replacementName,
      tn.note,
      tn.language,
      tn.lastYear,
      tn.image,
      tn.description,
      tn.tag
    FROM typhoonnames tn
    INNER JOIN positions p ON tn.position = p.id`;

  const params: unknown[] = [];
  if (isRetired !== null) {
    if (isRetired === 1) {
      sql += " WHERE tn.isRetired = ?";
      params.push(isRetired);
    } else {
      sql += " WHERE tn.isRetired = ? OR tn.isReplaced = 0";
      params.push(isRetired);
    }
  }

  const [rows] = await pool.query<TyphoonNameRow[]>(sql, params);

  const data: RetiredName[] = rows.map((row) => ({
    id: Number(row.id),
    name: row.name,
    meaning: row.meaning,
    position: Number(row.position),
    country: row.country,
    isRetired: Boolean(Number(row.isRetired)),
    isReplaced: Number(row.isReplaced),
    isLanguageProblem: Number(row.isLanguageProblem),
    replacementName: row.replacementName ?? "",
    note: row.note ?? undefined,
    language: row.language,
    lastYear: Number(row.lastYear),
    image: row.image ?? undefined,
    description: row.description ?? undefined,
    tag: row.tag,
  }));

  return { data, count: data.length };
}

export const getTyphoonNames = unstable_cache(queryTyphoonNames, ["getTyphoonNames"], {
  revalidate: 3600,
});
