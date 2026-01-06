import { Suspense } from "react";
import { getRetiredNamesDescription, getRetiredNamesTitle } from "./_utils/fns";
import RetiredNamesContent from "./RetiredNamesContent";
import type { Metadata } from "next";

type MetadataProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: MetadataProps): Promise<Metadata> {
  const params = await searchParams;
  const { name, year, country, lang } = params;
  const letter = params.letter === undefined ? "A" : params.letter;

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
          <div className="text-xl text-gray-700">Loading Retired Names...</div>
        </div>
      }
    >
      <RetiredNamesContent />
    </Suspense>
  );
};

export default RetiredNamesPage;
