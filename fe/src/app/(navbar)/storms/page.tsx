import { Suspense } from "react";
import DashboardPageContent from "./DashboardPageContent";
import type { Metadata } from "next";
import { getDashboardTitle } from "./_utils/fns";

type MetadataProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: MetadataProps): Promise<Metadata> {
  const { view, mode, filter } = await searchParams;

  const titleParts = getDashboardTitle(view, mode, filter);
  const title = titleParts ? `${titleParts} | Dashboard` : "Dashboard";

  return {
    title: title,
  };
}

const Dashboard = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-100 flex items-center justify-center">
          <div className="text-xl text-gray-600">Loading Dashboard...</div>
        </div>
      }
    >
      <DashboardPageContent />
    </Suspense>
  );
};

export default Dashboard;
