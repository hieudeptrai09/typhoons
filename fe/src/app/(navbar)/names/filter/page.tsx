import { Suspense } from "react";
import FilterNamesPage from "./FilterPageContent";
import type { Metadata } from "next";
import { getPageTitle } from "./_utils/fns";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  let { name, country, language, letter } = await searchParams;
  if (letter === undefined) letter = "A";

  const titleParts = getPageTitle(name, country, language, letter);
  const title = titleParts
    ? `Filter Names: ${titleParts.join(" • ")}`
    : "Filter Names";

  return {
    title: title,
  };
}

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
