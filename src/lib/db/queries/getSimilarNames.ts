import { type ApiListResponse } from "@/lib/db/client";
import { topSuggestions } from "@/lib/utils/fuzzy";
import { getNameList } from "./getNameList";

export async function getSimilarNames(name: string): Promise<ApiListResponse<string[]>> {
  const result = await getNameList();

  const data = topSuggestions(name, result?.data ?? []);

  return { data, count: data.length };
}
