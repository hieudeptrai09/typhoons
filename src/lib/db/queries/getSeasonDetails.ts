import { CACHE_TAGS, yearTag } from "@/lib/db/cacheTags";
import sql, { type ApiResponse } from "@/lib/db/client";
import { stormColumns, stormJoin, toStorm, type StormRow } from "@/lib/db/mappers/storm";
import {
  toRetiredName,
  typhoonNameColumns,
  typhoonNameJoin,
  type TyphoonNameRow,
} from "@/lib/db/mappers/typhoonName";
import type { SeasonDetail } from "@/lib/types";
import { unstable_cache } from "next/cache";

// Only what one season's page shows, so editing a storm rewrites its own season and not all of
// them. The webhooks also refresh every season sharing a moved storm's name, since that can move
// the name's debut.
async function querySeasonDetails(year: number): Promise<ApiResponse<SeasonDetail>> {
  const stormRows = await sql.query<StormRow[]>(
    `SELECT
      ${stormColumns()}
    FROM storms s
    ${stormJoin()}
    WHERE s.year <= $1
      AND s.name IN (SELECT name FROM storms WHERE year = $1)
    ORDER BY s.year ASC, s.position`,
    [year],
  );

  const nameRows = await sql.query<TyphoonNameRow[]>(
    `SELECT
      ${typhoonNameColumns()}
    FROM typhoonnames tn
    ${typhoonNameJoin()}
    WHERE LOWER(tn.name) IN (SELECT LOWER(name) FROM storms WHERE year = $1)
       OR tn.lastyear = $1
    ORDER BY tn.id`,
    [year],
  );

  return {
    data: {
      storms: stormRows.map(toStorm),
      names: nameRows.map(toRetiredName),
    },
  };
}

// The tag names the season, so the wrapper is built per call.
export const getSeasonDetails = (year: number) =>
  unstable_cache(querySeasonDetails, ["getSeasonDetails"], {
    revalidate: false,
    tags: [CACHE_TAGS.all, yearTag(year)],
  })(year);
