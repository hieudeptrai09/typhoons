import { Suspense } from "react";
import RetiredNamesContent from "./RetiredNamesContent";

const RetiredNamesPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-sky-100 flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      }
    >
      <RetiredNamesContent />
    </Suspense>
  );
};

export default RetiredNamesPage;
