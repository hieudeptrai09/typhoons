import { Suspense } from "react";
import { Spin } from "antd";
import { getNamesDescription, getNamesTitle } from "./_utils/fns";
import NamesPageContent from "./NamesPageContent";
import type { Metadata } from "next";

type MetadataProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: MetadataProps): Promise<Metadata> {
  const { view } = await searchParams;

  const titleParts = getNamesTitle(view);
  const title = titleParts ? `${titleParts} | Names` : "Names";
  const description = getNamesDescription(view);

  return {
    title: title,
    description: description,
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
