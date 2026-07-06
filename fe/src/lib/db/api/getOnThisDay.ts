import sql from "@/lib/db";
import type { IntensityType } from "@/lib/types";
import { unstable_cache } from "next/cache";

export interface OnThisDayStorm {
  name: string;
  intensity: IntensityType;
  position: number;
  year: number;
  monthStart: number;
  monthEnd: number;
  isFromPrevYear: number;
  reason: "started" | "ended" | "both";
}

interface OnThisDayRow {
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

async function queryOnThisDay(
  day: number,
  month: number,
): Promise<{ count: number; data: OnThisDayStorm[] }> {
  const query = `SELECT
      s.name,
      s.intensity,
      s.position,
      s.year,
      s."dateStart",
      s."monthStart",
      s."dateEnd",
      s."monthEnd",
      s."isFromPrevYear"
    FROM storms s
    WHERE (s."monthStart" = $1 AND s."dateStart" = $2)
       OR (s."monthEnd" = $3 AND s."dateEnd" = $4)
    ORDER BY s.year ASC`;

  const rows = (await sql.query(query, [month, day, month, day])) as OnThisDayRow[];

  const data: OnThisDayStorm[] = rows.map((row) => {
    const monthStart = Number(row.monthStart);
    const dateStart = Number(row.dateStart);
    const monthEnd = Number(row.monthEnd);
    const dateEnd = Number(row.dateEnd);

    const startedToday = monthStart === month && dateStart === day;
    const endedToday = monthEnd === month && dateEnd === day;
    const reason: "started" | "ended" | "both" =
      startedToday && endedToday ? "both" : startedToday ? "started" : "ended";

    return {
      name: row.name,
      intensity: row.intensity as IntensityType,
      position: Number(row.position),
      year: Number(row.year),
      monthStart,
      monthEnd,
      isFromPrevYear: Number(row.isFromPrevYear),
      reason,
    };
  });

  return { count: data.length, data };
}

export const getOnThisDay = unstable_cache(queryOnThisDay, ["getOnThisDay"], {
  revalidate: 3600,
});
