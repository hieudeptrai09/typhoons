import type { Metadata } from "next";
import { getRetiredNamesTitle } from "./_utils/fns";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const name = searchParams?.name as string;
  const year = searchParams?.year as string;
  const country = searchParams?.country as string;
  const lang = searchParams?.lang as string;

  const titleParts = getRetiredNamesTitle(name, year, country, lang);
  const title = titleParts
    ? `Retired Names: ${titleParts}`
    : "Retired Typhoon Names";

  return {
    title: title,
  };
}

export default function RetiredLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
