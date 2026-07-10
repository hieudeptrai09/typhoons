import { search } from "@/lib/db/api/search";
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
