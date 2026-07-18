import sql from "@/lib/db";
import type { RetiredName, SearchDetail, Storm } from "@/lib/types";
import { unstable_cache } from "next/cache";

interface ApiResponse<T> {
  data: T;
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

async function queryTyphoonNameByName(name: string): Promise<ApiResponse<SearchDetail>> {
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
    WHERE LOWER(tn.name) = LOWER($1)
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
    WHERE LOWER(s.name) = LOWER($1)
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
