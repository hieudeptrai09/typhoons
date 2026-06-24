import { Suspense } from "react";
import { Spin } from "antd";
import { slugToParams, canonicalPath, getNamesDescription, getNamesTitle } from "../_utils/fns";
import NamesPageContent from "../NamesPageContent";
import type { Metadata } from "next";

type MetadataProps = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { slug } = await params;
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

const NamesPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-stone-100">
          <Spin size="large" />
        </div>
      }
    >
      <NamesPageContent />
    </Suspense>
  );
};

export default NamesPage;
