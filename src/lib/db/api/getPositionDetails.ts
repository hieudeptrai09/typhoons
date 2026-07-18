import sql from "@/lib/db";
import type { PositionDetail, RetiredName, Storm } from "@/lib/types";
import { unstable_cache } from "next/cache";

interface ApiResponse<T> {
  data: T;
}

interface PositionRow {
  country: string;
}

interface TyphoonNameRow {
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

interface StormRow {
  position: number;
  country: string;
  name: string;
  intensity: string;
  map: string;
  correctSpelling: string | null;
  year: number;
  isStrongest: number;
  dateStart: number | null;
  dateEnd: number | null;
  monthStart: number | null;
  monthEnd: number | null;
  isFromPrevYear: number;
  jtwcDesignation: string | null;
  isJtwcForecasted: boolean;
  isFirst: boolean;
  isLast: boolean;
}

async function queryPositionDetails(position: number): Promise<ApiResponse<PositionDetail | null>> {
  const posRows = await sql.query<PositionRow[]>(
    "SELECT country FROM positions WHERE id = $1 LIMIT 1",
    [position],
  );

  const posRow = posRows[0];
  if (!posRow) {
    return { data: null };
  }

  const nameRows = await sql.query<TyphoonNameRow[]>(
    `SELECT
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
      tn.description,
      tn.tag
    FROM typhoonnames tn
    INNER JOIN positions p ON tn.position = p.id
    WHERE tn.position = $1
    ORDER BY tn.lastyear ASC, tn.name ASC`,
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

  const stormRows = await sql.query<StormRow[]>(
    `SELECT
      s.position,
      p.country,
      s.name,
      s.intensity,
      s.map,
      s.correctspelling AS "correctSpelling",
      s.year,
      s.isstrongest AS "isStrongest",
      s.datestart AS "dateStart",
      s.dateend AS "dateEnd",
      s.monthstart AS "monthStart",
      s.monthend AS "monthEnd",
      s.isfromprevyear AS "isFromPrevYear",
      LPAD(s.jtwcnumber::text, 2, '0') || p.suffix::text AS "jtwcDesignation",
      s.isjtwcforecasted AS "isJtwcForecasted",
      s.isfirst AS "isFirst",
      s.islast AS "isLast"
    FROM storms s
    INNER JOIN positions p ON s.position = p.id
    WHERE s.position = $1
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
    dateStart: row.dateStart !== null ? Number(row.dateStart) : undefined,
    dateEnd: row.dateEnd !== null ? Number(row.dateEnd) : undefined,
    monthStart: row.monthStart !== null ? Number(row.monthStart) : undefined,
    monthEnd: row.monthEnd !== null ? Number(row.monthEnd) : undefined,
    isFromPrevYear: Number(row.isFromPrevYear),
    jtwcDesignation: row.jtwcDesignation ?? undefined,
    isJtwcForecasted: Boolean(row.isJtwcForecasted),
    isFirst: Boolean(row.isFirst),
    isLast: Boolean(row.isLast),
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
