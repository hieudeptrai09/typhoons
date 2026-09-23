import sql from "@/lib/db";
import { CACHE_TAGS } from "@/lib/db/cacheTags";
import { unstable_cache } from "next/cache";

interface FactRow {
  text: string;
}

async function queryFacts(): Promise<string[]> {
  const rows = await sql.query<FactRow[]>("SELECT text FROM facts ORDER BY id");
  return rows.map((row) => row.text);
}

// The fact list only changes when the facts table is edited, so it is cached and the random pick
// happens per call — every click still gets a fresh fact.
const getFacts = unstable_cache(queryFacts, ["getFacts"], {
  revalidate: false,
  tags: [CACHE_TAGS.facts],
});

export async function getRandomFact(): Promise<{ data: string | null }> {
  const facts = await getFacts();
  if (facts.length === 0) {
    return { data: null };
  }
  return { data: facts[Math.floor(Math.random() * facts.length)] };
}
