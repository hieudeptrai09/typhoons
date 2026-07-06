import pool from "@/lib/db";
import type { RetiredName, SearchDetail, Storm } from "@/lib/types";
import { unstable_cache } from "next/cache";
import type { RowDataPacket } from "mysql2";

interface ApiResponse<T> {
  data: T;
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

interface StormRow extends RowDataPacket {
  position: number;
  country: string;
  name: string;
  intensity: string;
  map: string;
  correctSpelling: string | null;
  year: number;
  isStrongest: number;
  isFirst: number;
  isLast: number;
  dateStart: number | null;
  dateEnd: number | null;
  monthStart: number | null;
  monthEnd: number | null;
  isFromPrevYear: number;
}

async function queryTyphoonNameByName(name: string): Promise<ApiResponse<SearchDetail>> {
  const [nameRows] = await pool.query<TyphoonNameRow[]>(
    `SELECT
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
    INNER JOIN positions p ON tn.position = p.id
    WHERE LOWER(tn.name) = LOWER(?)
    LIMIT 1`,
    [name],
  );

  const nameRow = nameRows[0];
  const nameDetail: RetiredName | null = nameRow
    ? {
        id: Number(nameRow.id),
        name: nameRow.name,
        meaning: nameRow.meaning,
        position: Number(nameRow.position),
        country: nameRow.country,
        isRetired: Boolean(Number(nameRow.isRetired)),
        isReplaced: Number(nameRow.isReplaced),
        isLanguageProblem: Number(nameRow.isLanguageProblem),
        replacementName: nameRow.replacementName ?? "",
        note: nameRow.note ?? undefined,
        language: nameRow.language,
        lastYear: Number(nameRow.lastYear),
        image: nameRow.image ?? undefined,
        description: nameRow.description ?? undefined,
        tag: nameRow.tag,
      }
    : null;

  const [stormRows] = await pool.query<StormRow[]>(
    `SELECT
      s.position,
      p.country,
      s.name,
      s.intensity,
      s.map,
      s.correctSpelling,
      s.year,
      s.isStrongest,
      s.isFirst,
      s.isLast,
      s.dateStart,
      s.dateEnd,
      s.monthStart,
      s.monthEnd,
      s.isFromPrevYear
    FROM storms s
    INNER JOIN positions p ON s.position = p.id
    WHERE LOWER(s.name) = LOWER(?)
    ORDER BY s.year ASC, s.position`,
    [name],
  );

  const storms: Storm[] = stormRows.map((row) => ({
    position: Number(row.position),
    country: row.country,
    name: row.name,
    intensity: row.intensity as Storm["intensity"],
    map: row.map,
    correctSpelling: row.correctSpelling ?? undefined,
    year: Number(row.year),
    isStrongest: Number(row.isStrongest) as unknown as Storm["isStrongest"],
    isFirst: Number(row.isFirst) as unknown as Storm["isFirst"],
    isLast: Number(row.isLast) as unknown as Storm["isLast"],
    dateStart: row.dateStart !== null ? Number(row.dateStart) : undefined,
    dateEnd: row.dateEnd !== null ? Number(row.dateEnd) : undefined,
    monthStart: row.monthStart !== null ? Number(row.monthStart) : undefined,
    monthEnd: row.monthEnd !== null ? Number(row.monthEnd) : undefined,
    isFromPrevYear: Number(row.isFromPrevYear),
  }));

  return {
    data: {
      name: nameDetail as SearchDetail["name"],
      storms,
    },
  };
}

export const getTyphoonNameByName = unstable_cache(
  queryTyphoonNameByName,
  ["getTyphoonNameByName"],
  { revalidate: 3600 },
);
