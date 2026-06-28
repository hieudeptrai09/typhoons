import { Suspense } from "react";
import TyphoonSpinner from "../../../components/components/TyphoonSpinner";
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

async function SearchData({ query }: { query: string }) {
  const result = query.trim()
    ? await fetchServerData<SearchResult[]>(
        `/search?q=${encodeURIComponent(query.trim())}`,
      )
    : null;
  return (
    <SearchPageContent
      results={result?.data ?? null}
      count={result?.count ?? 0}
      query={query}
    />
  );
}

const SearchPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) => {
  const { q = "" } = await searchParams;

  return (
    <Suspense
      key={q}
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-stone-100">
          <TyphoonSpinner size="large" />
        </div>
      }
    >
      <SearchData query={q} />
    </Suspense>
  );
};

export default SearchPage;
