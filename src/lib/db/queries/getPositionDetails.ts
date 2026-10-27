import { CACHE_TAGS, positionTag } from "@/lib/db/cacheTags";
import sql, { type ApiResponse } from "@/lib/db/client";
import { stormColumns, stormJoin, toStorm, type StormRow } from "@/lib/db/mappers/storm";
import {
  toRetiredName,
  typhoonNameColumns,
  typhoonNameJoin,
  type TyphoonNameRow,
} from "@/lib/db/mappers/typhoonName";
import type { PositionDetail } from "@/lib/types";
import { unstable_cache } from "next/cache";

interface PositionRow {
  country: string;
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
      ${typhoonNameColumns()}
    FROM typhoonnames tn
    ${typhoonNameJoin()}
    WHERE tn.position = $1
    ORDER BY tn.lastyear ASC, tn.name ASC`,
    [position],
  );

  const stormRows = await sql.query<StormRow[]>(
    `SELECT
      ${stormColumns()}
    FROM storms s
    ${stormJoin()}
    WHERE s.position = $1
    ORDER BY s.year ASC`,
    [position],
  );

  return {
    data: {
      country: posRow.country,
      names: nameRows.map(toRetiredName),
      storms: stormRows.map(toStorm),
    },
  };
}

// The tag names the position, so the wrapper is built per call; the cache key is unchanged.
export const getPositionDetails = (position: number) =>
  unstable_cache(queryPositionDetails, ["getPositionDetails"], {
    revalidate: false,
    tags: [CACHE_TAGS.all, positionTag(position)],
  })(position);
