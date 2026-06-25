import { Suspense } from "react";
import TyphoonSpinner from "../../../../components/components/TyphoonSpinner";
import { notFound } from "next/navigation";
import {
  isValidNamesSlug,
  slugToParams,
  canonicalPath,
  getNamesDescription,
  getNamesTitle,
} from "../_utils/fns";
import NamesPageContent from "../NamesPageContent";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isValidNamesSlug(slug)) {
    return { title: "Not Found" };
  }

  const { view, showName, showHistory } = slugToParams(slug);

  const titleParts = getNamesTitle(view, showName ? "true" : "", showHistory ? "true" : "");
  const title = titleParts ? `${titleParts} | Names` : "Names";
  const description = getNamesDescription(view, showName ? "true" : "", showHistory ? "true" : "");

  return {
    title: title,
    description: description,
    alternates: {
      canonical: canonicalPath(view, showHistory, showName),
    },
  };
}

const NamesPage = async ({ params }: PageProps) => {
  const { slug } = await params;

  if (!isValidNamesSlug(slug)) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-stone-100">
          <TyphoonSpinner size="large" />
        </div>
      }
    >
      <NamesPageContent />
    </Suspense>
  );
};

export default NamesPage;
