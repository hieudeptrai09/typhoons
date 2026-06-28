import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import TyphoonSpinner from "../../../../components/components/TyphoonSpinner";
import {
  isValidStormsSlug,
  slugToParams,
  paramsToPath,
  getDashboardDescription,
  getDashboardTitle,
} from "../_utils/fns";
import { fetchServerData } from "../../../../containers/utils/fetchServerData";
import DashboardPageContent from "../DashboardPageContent";
import type { Metadata } from "next";
import type { Storm } from "../../../../types";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isValidStormsSlug(slug)) {
    return { title: "Not Found" };
  }

  const dashboardParams = slugToParams(slug);
  const { view, mode, filter } = dashboardParams;

  const titleParts = getDashboardTitle(view, mode, filter);
  const title = titleParts ? `${titleParts} | Dashboard` : "Dashboard";
  const description = getDashboardDescription(view, mode, filter);

  return {
    title: title,
    description: description,
    alternates: {
      canonical: paramsToPath(dashboardParams),
    },
  };
}

async function DashboardData() {
  const result = await fetchServerData<Storm[]>("/storms");
  return <DashboardPageContent stormsData={result?.data ?? null} />;
}

const Dashboard = async ({ params }: PageProps) => {
  const { slug } = await params;

  if (!isValidStormsSlug(slug)) {
    notFound();
  }

  const dashboardParams = slugToParams(slug);
  const canonicalPath = paramsToPath(dashboardParams);
  const currentPath = `/storms/${(slug || []).join("/")}/`.replace(/\/+/g, "/");
  if (currentPath !== canonicalPath) {
    redirect(canonicalPath);
  }

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-stone-100">
          <TyphoonSpinner size="large" />
        </div>
      }
    >
      <DashboardData />
    </Suspense>
  );
};

export default Dashboard;
