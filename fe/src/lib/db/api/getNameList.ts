import sql from "@/lib/db";
import { unstable_cache } from "next/cache";

interface ApiResponse<T> {
  data: T;
  count: number;
}

interface NameRow {
  name: string;
}

async function queryNameList(): Promise<ApiResponse<string[]>> {
  const rows = (await sql.query(
    `SELECT name FROM typhoonnames
     UNION
     SELECT DISTINCT name FROM storms WHERE position IN (141, 142, 143)
     ORDER BY name`,
  )) as NameRow[];

  const data = rows.map((row) => row.name);

  return { data, count: data.length };
}

export const getNameList = unstable_cache(queryNameList, ["getNameList"], { revalidate: 3600 });
