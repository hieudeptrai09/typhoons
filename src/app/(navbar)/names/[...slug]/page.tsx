import { getAllStormHistory } from "@/lib/db/queries/getStormHistory";
import { getAllSuggestedNames } from "@/lib/db/queries/getSuggestedNames";
import { getTyphoonNames } from "@/lib/db/queries/getTyphoonNames";
import NamesPageContent from "@/lib/features/names/components/NamesPageContent";
import { NAMES_DISPLAY_COOKIE, parseDisplayPrefs } from "@/lib/features/names/utils/displayPrefs";
import { getNamesDescription, getNamesTitle } from "@/lib/features/names/utils/metadata";
import {
  isHistoryScope,
  isValidNamesSlug,
  paramsToPath,
  slugToParams,
  slugToPath,
} from "@/lib/features/names/utils/routing";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

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

  // Only the history grid and the retired view consume these, and the slug already says which is active.
  const slugParams = slugToParams(slug);

  const path = paramsToPath(slugParams);
  if (slugToPath(slug) !== path) {
    redirect(path);
  }

  const [result, cookieStore, historyResult, suggestedResult] = await Promise.all([
    getTyphoonNames(),
    cookies(),
    isHistoryScope(slugParams) ? getAllStormHistory() : null,
    slugParams.view === "retired" ? getAllSuggestedNames() : null,
  ]);
  const displayPrefs = parseDisplayPrefs(cookieStore.get(NAMES_DISPLAY_COOKIE)?.value);

  return (
    <NamesPageContent
      allNames={result?.data ?? null}
      stormHistory={historyResult?.data ?? []}
      suggestedNames={suggestedResult?.data ?? []}
      displayPrefs={displayPrefs}
    />
  );
};

export default NamesPage;
