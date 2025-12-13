import { Suspense } from "react";
import RetiredNamesContent from "./RetiredNamesContent";
import type { Metadata } from "next";
import { getRetiredNamesTitle } from "./_utils/fns";

type MetadataProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: MetadataProps): Promise<Metadata> {
  const { name, year, country, lang } = await searchParams;

  const titleParts = getRetiredNamesTitle(name, year, country, lang);
  const title =
    titleParts.length > 0
      ? `Retired Names: ${titleParts.join(" • ")}`
      : "Retired Typhoon Names";

  return {
    title: title,
  };
}

const RetiredNamesPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-100 flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading Retired Names...</div>
        </div>
      }
    >
      <RetiredNamesContent />
    </Suspense>
  );
};

export default RetiredNamesPage;
