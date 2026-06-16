import { Suspense } from "react";
import NamesPageContent from "./NamesPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Typhoon Names",
  description:
    "Browse all typhoon names used by the Western Pacific Tropical Cyclone Committee, current and retired. Filter by country, language, or tag, switch between grid and list views, and explore the full naming history.",
};

const NamesPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-stone-100">
          <div className="text-xl text-gray-700">Loading Typhoon Names...</div>
        </div>
      }
    >
      <NamesPageContent />
    </Suspense>
  );
};

export default NamesPage;
