import type { SearchResult } from "@/lib/types";
import { fetchServerData } from "@/lib/utils/fetchServerData";
import type { Metadata } from "next";
import SearchPageContent from "./SearchPageContent";

export const metadata: Metadata = {
  title: "Search Typhoon Names",
  description: "Search and browse typhoon names by name, position, country, and status.",
  alternates: {
    canonical: "/search/",
  },
};

const SearchPage = async ({ searchParams }: { searchParams: Promise<{ q?: string }> }) => {
  const { q = "" } = await searchParams;

  const result = q.trim()
    ? await fetchServerData<SearchResult[]>(`/search?q=${encodeURIComponent(q.trim())}`)
    : null;

  return <SearchPageContent results={result?.data ?? null} count={result?.count ?? 0} query={q} />;
};

export default SearchPage;
