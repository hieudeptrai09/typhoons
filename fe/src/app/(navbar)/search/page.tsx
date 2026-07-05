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

  return <SearchPageContent query={q} />;
};

export default SearchPage;
