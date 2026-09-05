import { getAllSuggestedNames } from "@/lib/db/api/getSuggestedNames";
import { getTyphoonNames } from "@/lib/db/api/getTyphoonNames";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { NAMES_DISPLAY_COOKIE, parseDisplayPrefs } from "../_utils/displayPrefs";
import { getNamesDescription, getNamesTitle } from "../_utils/metadata";
import { isValidNamesSlug, paramsToPath, slugToParams, slugToPath } from "../_utils/routing";
import NamesPageContent from "../NamesPageContent";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isValidNamesSlug(slug)) {
    return {};
  }

  const slugParams = slugToParams(slug);

  return {
    title: `${getNamesTitle(slugParams)} | Names`,
    description: getNamesDescription(slugParams),
    alternates: {
      canonical: paramsToPath(slugParams),
    },
  };
}

const NamesPage = async ({ params }: PageProps) => {
  const { slug } = await params;

  if (!isValidNamesSlug(slug)) {
    notFound();
  }

  const slugParams = slugToParams(slug);

  const path = paramsToPath(slugParams);
  if (slugToPath(slug) !== path) {
    redirect(path);
  }

  // Only the retired view consumes the suggestions, and the slug already says whether it is active.
  const [result, cookieStore, suggestedResult] = await Promise.all([
    getTyphoonNames(),
    cookies(),
    slugParams.view === "retired" ? getAllSuggestedNames() : null,
  ]);
  const displayPrefs = parseDisplayPrefs(cookieStore.get(NAMES_DISPLAY_COOKIE)?.value);

  return (
    <NamesPageContent
      allNames={result?.data ?? null}
      suggestedNames={suggestedResult?.data ?? []}
      displayPrefs={displayPrefs}
    />
  );
};

export default NamesPage;
