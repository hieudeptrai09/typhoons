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

  // A real fetch failure yields no ApiResponse at all; a successful response
  // with no matches (or a missing/empty data array) is genuine emptiness, not
  // an error, so it must not be conflated into the same "results" signal.
  const isError = q.trim() !== "" && result === null;

  return (
    <SearchPageContent
      results={result?.data ?? []}
      count={result?.count ?? 0}
      query={q}
      isError={isError}
    />
  );
};

export default SearchPage;
