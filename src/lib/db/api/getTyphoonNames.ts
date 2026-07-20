import sql, { type QueryParam } from "@/lib/db";
import {
  imageCreditColumns,
  imageCreditJoin,
  toImageCredit,
  type ImageCreditRow,
} from "@/lib/db/imageCredit";
import type { RetiredName } from "@/lib/types";
import { unstable_cache } from "next/cache";

interface ApiResponse<T> {
  data: T;
  count: number;
}

interface TyphoonNameRow extends ImageCreditRow {
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

async function queryTyphoonNames(
  isRetired: number | null = null,
): Promise<ApiResponse<RetiredName[]>> {
  let query = `SELECT
      tn.id,
      tn.name,
      tn.meaning,
      tn.position,
      p.country,
      tn.isretired AS "isRetired",
      tn.isreplaced AS "isReplaced",
      tn.islanguageproblem AS "isLanguageProblem",
      tn.replacementname AS "replacementName",
      tn.note,
      tn.language,
      tn.lastyear AS "lastYear",
      tn.image,
      ${imageCreditColumns("tn.")},
      tn.description,
      tn.tag
    FROM typhoonnames tn
    INNER JOIN positions p ON tn.position = p.id
    ${imageCreditJoin("tn.")}`;

  const params: QueryParam[] = [];
  if (isRetired !== null) {
    if (isRetired === 1) {
      query += ` WHERE tn.isretired = $${params.length + 1}`;
      params.push(true);
    } else {
      query += ` WHERE tn.isretired = $${params.length + 1} OR tn.isreplaced = false`;
      params.push(false);
    }
  }

  const rows = await sql.query<TyphoonNameRow[]>(query, params);

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
    imageCredit: toImageCredit(row),
    description: row.description ?? undefined,
    tag: row.tag,
  }));

  return { data, count: data.length };
}

export const getTyphoonNames = unstable_cache(queryTyphoonNames, ["getTyphoonNames"], {
  revalidate: 3600,
});
