import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  getDashboardDescription,
  getDashboardTitle,
  isValidStormsSlug,
  paramsToPath,
  slugToParams,
} from "../_utils/fns";
import DashboardPageContent from "../DashboardPageContent";

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

  return <DashboardPageContent />;
};

export default Dashboard;
