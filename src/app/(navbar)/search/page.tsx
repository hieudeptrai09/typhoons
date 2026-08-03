import { getNameList } from "@/lib/db/api/getNameList";
import { search } from "@/lib/db/api/search";
import { topSuggestions } from "@/lib/utils/fuzzy";
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

  const result = q.trim() ? await search(q.trim()) : null;

  const isError = q.trim() !== "" && result === null;

  // On a zero-result search, offer the closest typhoon names as "did you mean?"
  // suggestions. Wrapped defensively so a suggestion failure never breaks the
  // (otherwise working) empty state.
  let suggestions: string[] = [];
  if (result !== null && result.count === 0) {
    try {
      const names = await getNameList();
      suggestions = topSuggestions(q.trim(), names.data);
    } catch {
      suggestions = [];
    }
  }

  return (
    <SearchPageContent
      results={result?.data ?? []}
      count={result?.count ?? 0}
      query={q}
      isError={isError}
      suggestions={suggestions}
    />
  );
};

export default SearchPage;
