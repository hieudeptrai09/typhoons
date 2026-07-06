import pool from "@/lib/db";
import type { PositionDetail, RetiredName, Storm } from "@/lib/types";
import { unstable_cache } from "next/cache";
import type { RowDataPacket } from "mysql2";

interface ApiResponse<T> {
  data: T;
}

interface PositionRow extends RowDataPacket {
  country: string;
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

async function queryPositionDetails(position: number): Promise<ApiResponse<PositionDetail | null>> {
  const [posRows] = await pool.query<PositionRow[]>(
    "SELECT country FROM positions WHERE id = ? LIMIT 1",
    [position],
  );

  const posRow = posRows[0];
  if (!posRow) {
    return { data: null };
  }

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
    WHERE tn.position = ?
    ORDER BY tn.lastYear ASC, tn.name ASC`,
    [position],
  );

  const names: RetiredName[] = nameRows.map((row) => ({
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
    WHERE s.position = ?
    ORDER BY s.year ASC`,
    [position],
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
      country: posRow.country,
      names,
      storms,
    },
  };
}

export const getPositionDetails = unstable_cache(queryPositionDetails, ["getPositionDetails"], {
  revalidate: 3600,
});
