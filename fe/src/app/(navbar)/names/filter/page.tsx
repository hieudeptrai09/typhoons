import { Suspense } from "react";
import { getPageDescription, getPageTitle } from "./_utils/fns";
import FilterNamesPage from "./FilterPageContent";
import type { Metadata } from "next";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  let { name, country, language, letter } = await searchParams;
  if (letter === undefined) letter = "A";

  const titleParts = getPageTitle(name, country, language, letter);
  const title = titleParts ? `Filter Names: ${titleParts.join(" • ")}` : "Filter Names";
  const description = getPageDescription(name, country, language, letter);

  return {
    title: title,
    description: description,
  };
}

const RetiredNamesPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-stone-100">
          <div className="text-xl text-gray-600">Loading Filter Names...</div>
        </div>
      }
    >
      <FilterNamesPage />
    </Suspense>
  );
};

export default RetiredNamesPage;
