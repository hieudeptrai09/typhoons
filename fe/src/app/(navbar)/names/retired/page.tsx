import { Suspense } from "react";
import { getRetiredNamesDescription, getRetiredNamesTitle } from "./_utils/fns";
import RetiredNamesContent from "./RetiredNamesContent";
import type { Metadata } from "next";

type MetadataProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: MetadataProps): Promise<Metadata> {
  let { name, year, country, lang, letter } = await searchParams;

  // Default to letter A if no letter is specified and no filters are active
  if (!letter && !name && !year && !country && !lang) {
    letter = "A";
  }

  const titleParts = getRetiredNamesTitle(name, year, country, lang, letter);
  const title =
    titleParts.length > 0 ? `Retired Names: ${titleParts.join(" • ")}` : "Retired Typhoon Names";
  const description = getRetiredNamesDescription(name, year, country, lang, letter);

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
          <div className="text-xl text-gray-600">Loading Retired Names...</div>
        </div>
      }
    >
      <RetiredNamesContent />
    </Suspense>
  );
};

export default RetiredNamesPage;
