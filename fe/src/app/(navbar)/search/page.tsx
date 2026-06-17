import { Suspense } from "react";
import SearchPageContent from "./SearchPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Typhoon Names",
  description: "Search and browse typhoon names by name, position, country, and status.",
};

const SearchPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-stone-100">
          <div className="text-xl text-gray-700">Loading Search...</div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
};

export default SearchPage;
