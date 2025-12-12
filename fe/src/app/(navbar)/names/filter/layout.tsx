import type { Metadata } from "next";
import { getPageTitle } from "./_utils/fns";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const name = searchParams?.name as string;
  const country = searchParams?.country as string;
  const letter = searchParams?.letter as string;

  const titleParts = getPageTitle(name, country, letter);
  const title = titleParts
    ? `Filter Names: ${titleParts.join(" • ")}`
    : "Filter Names";

  return {
    title: title,
  };
}

export default function FilterNamesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
