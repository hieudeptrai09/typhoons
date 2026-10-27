import { CACHE_TAGS, nameTag } from "@/lib/db/cacheTags";
import sql, { type ApiResponse } from "@/lib/db/client";
import { stormColumns, stormJoin, toStorm, type StormRow } from "@/lib/db/mappers/storm";
import {
  toRetiredName,
  typhoonNameColumns,
  typhoonNameJoin,
  type TyphoonNameRow,
} from "@/lib/db/mappers/typhoonName";
import type { SearchDetail } from "@/lib/types";
import { unstable_cache } from "next/cache";

async function queryTyphoonNameByName(name: string): Promise<ApiResponse<SearchDetail>> {
  const nameRows = await sql.query<TyphoonNameRow[]>(
    `SELECT
      ${typhoonNameColumns()}
    FROM typhoonnames tn
    ${typhoonNameJoin()}
    WHERE LOWER(tn.name) = LOWER($1)
    LIMIT 1`,
    [name],
  );

  const nameRow = nameRows[0];
  const nameDetail = nameRow ? toRetiredName(nameRow) : null;

  const stormRows = await sql.query<StormRow[]>(
    `SELECT
      ${stormColumns()}
    FROM storms s
    ${stormJoin()}
    WHERE LOWER(s.name) = LOWER($1)
    ORDER BY s.year ASC, s.position`,
    [name],
  );

  return {
    data: {
      name: nameDetail as SearchDetail["name"],
      storms: stormRows.map(toStorm),
    },
  };
}

// The tag names the name, so the wrapper is built per call; the cache key is unchanged.
export const getTyphoonNameByName = (name: string) =>
  unstable_cache(queryTyphoonNameByName, ["getTyphoonNameByName"], {
    revalidate: false,
    tags: [CACHE_TAGS.all, nameTag(name)],
  })(name);

// The name exists nowhere: not in rotation, and never used by a storm.
export const isNameNotFound = (result: ApiResponse<SearchDetail> | null) =>
  result !== null && !result.data.name && result.data.storms.length === 0;
