import { Suspense } from "react";
import FilterNamesPage from "./FilterPageContent";

const RetiredNamesPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-100 flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading Filter Names...</div>
        </div>
      }
    >
      <FilterNamesPage />
    </Suspense>
  );
};

export default RetiredNamesPage;
