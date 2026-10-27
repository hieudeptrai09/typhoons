"use server";

import { getRandomFact } from "@/lib/db/queries/getRandomFact";

export async function fetchRandomFact(): Promise<string | null> {
  const result = await getRandomFact();
  return result.data;
}
