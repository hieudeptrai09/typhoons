import type { Metadata } from "next";
import { getDashboardTitle } from "./_utils/fns";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const view = (searchParams?.view as string) || "storms";
  const mode = (searchParams?.mode as string) || "table";
  const filter = searchParams?.filter as string;

  const titleParts = getDashboardTitle(view, mode, filter);
  const title = titleParts ? `${titleParts} | Dashboard` : "Dashboard";

  return {
    title: title,
  };
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
