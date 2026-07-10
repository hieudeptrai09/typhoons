import sql from "@/lib/db";
import type { IntensityType } from "@/lib/types";
import { unstable_cache } from "next/cache";

export interface ActiveOnThisDayStorm {
  name: string;
  intensity: IntensityType;
  position: number;
  year: number;
  monthStart: number;
  dateStart: number;
  monthEnd: number;
  dateEnd: number;
  isFromPrevYear: number;
}

interface ActiveOnThisDayRow {
  name: string;
  intensity: string;
  position: number;
  year: number;
  dateStart: number;
  monthStart: number;
  dateEnd: number;
  monthEnd: number;
  isFromPrevYear: number;
}

async function queryActiveOnThisDay(
  day: number,
  month: number,
): Promise<{ count: number; data: ActiveOnThisDayStorm[] }> {
  const query = `SELECT
      s.position,
      s.name,
      s.intensity,
      s.year,
      s.datestart AS "dateStart",
      s.monthstart AS "monthStart",
      s.dateend AS "dateEnd",
      s.monthend AS "monthEnd",
      s.isfromprevyear AS "isFromPrevYear"
    FROM storms s
    WHERE (
        (s.monthend > s.monthstart OR (s.monthend = s.monthstart AND s.dateend >= s.datestart))
        AND (s.monthstart < $1 OR (s.monthstart = $1 AND s.datestart <= $2))
        AND (s.monthend > $1 OR (s.monthend = $1 AND s.dateend >= $2))
    ) OR (
        (s.monthend < s.monthstart OR (s.monthend = s.monthstart AND s.dateend < s.datestart))
        AND (
            (s.monthstart < $1 OR (s.monthstart = $1 AND s.datestart <= $2))
            OR (s.monthend > $1 OR (s.monthend = $1 AND s.dateend >= $2))
        )
    )
    ORDER BY s.year ASC`;

  const rows = await sql.query<ActiveOnThisDayRow[]>(query, [month, day]);

  const data: ActiveOnThisDayStorm[] = rows.map((row) => ({
    name: row.name,
    intensity: row.intensity as IntensityType,
    position: Number(row.position),
    year: Number(row.year),
    monthStart: Number(row.monthStart),
    dateStart: Number(row.dateStart),
    monthEnd: Number(row.monthEnd),
    dateEnd: Number(row.dateEnd),
    isFromPrevYear: Number(row.isFromPrevYear),
  }));

  return { count: data.length, data };
}

export const getActiveOnThisDay = unstable_cache(queryActiveOnThisDay, ["getActiveOnThisDay"], {
  revalidate: 3600,
});
