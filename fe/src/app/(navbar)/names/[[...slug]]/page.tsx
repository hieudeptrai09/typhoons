import { notFound } from "next/navigation";
import { fetchServerData } from "../../../../containers/utils/fetchServerData";
import {
  isValidNamesSlug,
  slugToParams,
  canonicalPath,
  getNamesDescription,
  getNamesTitle,
} from "../_utils/fns";
import NamesPageContent from "../NamesPageContent";
import type { RetiredName } from "../../../../types";
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

  const result = await fetchServerData<RetiredName[]>("/typhoon-names");
  return <NamesPageContent allNames={result?.data ?? null} />;
};

export default NamesPage;
