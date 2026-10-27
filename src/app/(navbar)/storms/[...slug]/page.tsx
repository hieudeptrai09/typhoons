import { getStorms } from "@/lib/db/queries/getStorms";
import DashboardPageContent from "@/lib/features/storms/components/DashboardPageContent";
import {
  getDashboardDescription,
  getDashboardPageTitle,
} from "@/lib/features/storms/utils/metadata";
import {
  getCanonicalStormsSlugs,
  isValidStormsSlug,
  paramsToPath,
  slugToParams,
  slugToPath,
} from "@/lib/features/storms/utils/routing";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  return getCanonicalStormsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isValidStormsSlug(slug)) {
    return {};
  }

  const dashboardParams = slugToParams(slug);

  return {
    title: getDashboardPageTitle(dashboardParams),
    description: getDashboardDescription(dashboardParams),
    alternates: {
      canonical: paramsToPath(dashboardParams),
    },
  };
}

const Dashboard = async ({ params }: PageProps) => {
  const { slug } = await params;

  if (!isValidStormsSlug(slug)) {
    notFound();
  }

  const dashboardParams = slugToParams(slug);
  const path = paramsToPath(dashboardParams);
  if (slugToPath(slug) !== path) {
    redirect(path);
  }

  const result = await getStorms();
  return <DashboardPageContent stormsData={result?.data ?? null} />;
};

export default Dashboard;
