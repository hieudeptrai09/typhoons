import { Suspense } from "react";
import { getDashboardDescription, getDashboardTitle } from "./_utils/fns";
import DashboardPageContent from "./DashboardPageContent";
import type { Metadata } from "next";

type MetadataProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: MetadataProps): Promise<Metadata> {
  const { view, mode, filter } = await searchParams;

  const titleParts = getDashboardTitle(view, mode, filter);
  const title = titleParts ? `${titleParts} | Dashboard` : "Dashboard";
  const description = getDashboardDescription(view, mode, filter);

  return {
    title: title,
    description: description,
  };
}

const Dashboard = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-stone-100">
          <div className="text-xl text-gray-600">Loading Dashboard...</div>
        </div>
      }
    >
      <DashboardPageContent />
    </Suspense>
  );
};

export default Dashboard;
