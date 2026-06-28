import { fetchServerData } from "../../../containers/utils/fetchServerData";
import SearchPageContent from "./SearchPageContent";
import type { Metadata } from "next";
import type { SearchResult } from "../../../types";

export const metadata: Metadata = {
  title: "Search Typhoon Names",
  description: "Search and browse typhoon names by name, position, country, and status.",
  alternates: {
    canonical: "/search/",
  },
};

const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) => {
  const { q = "" } = await searchParams;

  const result = q.trim()
    ? await fetchServerData<SearchResult[]>(
        `/search?q=${encodeURIComponent(q.trim())}`,
      )
    : null;

  return (
    <SearchPageContent
      results={result?.data ?? null}
      count={result?.count ?? 0}
      query={q}
    />
  );
};

export default SearchPage;
