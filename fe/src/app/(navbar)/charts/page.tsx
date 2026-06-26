import { Suspense } from "react";
import ChartsPageContent from "./ChartsPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Charts | Typhoon Dashboard",
  description:
    "Visual charts and statistics for typhoon storms and naming data in the Western Pacific basin.",
  alternates: {
    canonical: "/charts/",
  },
};

const ChartsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-stone-100">
          <div className="text-xl text-gray-700">Loading Charts...</div>
        </div>
      }
    >
      <ChartsPageContent />
    </Suspense>
  );
};

export default ChartsPage;
