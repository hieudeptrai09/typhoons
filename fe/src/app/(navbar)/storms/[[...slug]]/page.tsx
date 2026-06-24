import { Suspense } from "react";
import {
  slugToParams,
  paramsToPath,
  getDashboardDescription,
  getDashboardTitle,
} from "../_utils/fns";
import DashboardPageContent from "../DashboardPageContent";
import type { Metadata } from "next";

type MetadataProps = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { slug } = await params;
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

const Dashboard = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-stone-100">
          <div className="text-xl text-gray-700">Loading Dashboard...</div>
        </div>
      }
    >
      <DashboardPageContent />
    </Suspense>
  );
};

export default Dashboard;
