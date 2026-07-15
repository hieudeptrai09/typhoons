import { getTyphoonNames } from "@/lib/db/api/getTyphoonNames";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { NAMES_DISPLAY_COOKIE, parseDisplayPrefs } from "../_utils/displayPrefs";
import {
  canonicalPath,
  getNamesDescription,
  getNamesTitle,
  isValidNamesSlug,
  slugToParams,
} from "../_utils/fns";
import NamesPageContent from "../NamesPageContent";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isValidNamesSlug(slug)) {
    return {};
  }

  const { view, showName, showHistory } = slugToParams(slug);

  const titleParts = getNamesTitle(view, showHistory ? "true" : "");
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

  const [result, cookieStore] = await Promise.all([getTyphoonNames(), cookies()]);
  const displayPrefs = parseDisplayPrefs(cookieStore.get(NAMES_DISPLAY_COOKIE)?.value);

  return <NamesPageContent allNames={result?.data ?? null} displayPrefs={displayPrefs} />;
};

export default NamesPage;
